import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { ChannelSchema, chatSchema } from '../firestore/schema';
import { getChannel } from '../firestore/channel';
import { addChat } from '../firestore/chat';
import { lawyerSuggestionFlow } from '../models/lawyer';
import { Flow, runFlow } from '@genkit-ai/flow';
import { ZodString, ZodTypeAny } from 'zod';
import { inputSchema } from '../models/lawyer/schema';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';

const workflows = {
  general: lawyerSuggestionFlow,
  lawyer: lawyerSuggestionFlow,
  japanese: lawyerSuggestionFlow,
} satisfies Record<NonNullable<ChannelSchema['category'] | 'general'>, Flow<typeof inputSchema, ZodString, ZodTypeAny>>;

export const onChatDocumentCreated = onDocumentCreated(
  'channels/{channelId}/chats/{chatId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const chat = chatSchema.safeParse(snapshot.data());
    if (!chat.success) {
      console.error('Invalid chat data:', chat.error.errors);
      return;
    }

    // ! Caution: infinite loop
    // Process only user messages
    if (chat.data.role !== 'user') return;

    const channel = await getChannel(event.params.channelId);
    const history = await getChatHistories(snapshot);

    const message = await runFlow(workflows[channel?.category ?? 'general'], {
      prompt: chat.data.message,
      history,
    });

    await addChat(event.params.channelId, {
      role: 'model',
      message,
    });

    return;
  },
);

const getChatHistories = async (snapshot: QueryDocumentSnapshot) => {
  const chatSnapshots = await snapshot.ref.parent.orderBy('timestamp', 'desc').limit(5).get();
  const chats = chatSnapshots.docs.map((doc) => {
    const chat = chatSchema.safeParse(doc.data());
    if (chat.success) return chat.data;
    else {
      console.error('Invalid chat data:', chat.error.errors);
      return;
    }
  }).filter((c) => !!c)
    .reverse();

  return chats;
};
