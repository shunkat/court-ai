import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { ChannelSchema, chatSchema } from '../firestore/schema';
import { getChannel } from '../firestore/channel';
import { addChat } from '../firestore/chat';
import { lawyerSuggestionFlow } from '../models/lawyer';
import { Flow, runFlow } from '@genkit-ai/flow';
import { ZodString, ZodTypeAny } from 'zod';

const workflows = {
  general: lawyerSuggestionFlow,
  lawyer: lawyerSuggestionFlow,
  japanese: lawyerSuggestionFlow,
} satisfies Record<NonNullable<ChannelSchema['category'] | 'general'>, Flow<ZodString, ZodString, ZodTypeAny>>;

export const onChatDocumentCreated = onDocumentCreated(
  'channels/{channelId}/chats/{chatId}',
  async (event) => {
    const _chat = event.data?.data();
    if (!_chat) return;

    const chat = chatSchema.safeParse(_chat);
    if (!chat.success) {
      console.error('Invalid chat data:', chat.error.errors);
      return;
    }

    // ! Caution: infinite loop
    // Process only user messages
    if (chat.data.role !== 'user') return;

    const channel = await getChannel(event.params.channelId);
    const message = await runFlow(workflows[channel?.category ?? 'general'], chat.data.message);

    await addChat(event.params.channelId, {
      role: 'model',
      message,
    });

    return;
  },
);
