import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { chatSchema } from '../firestore/schema';
import { getRoom } from '../firestore/room';
import { addChat, getChatsLast } from '../firestore/chat';
import { lawyerSuggestionFlow } from '../models/lawyer';
import { Flow, runFlow } from '@genkit-ai/flow';
import { ZodString, ZodTypeAny } from 'zod';
import { inputSchema, LawyerCategorySchema } from '../models/lawyer/schema';

export const onChatDocumentCreated = onDocumentCreated(
  'chats/{chatId}',
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

    const room = await getRoom(chat.data.roomId);
    const history = await getChatsLast(chat.data.roomUserId, 5);

    const message = await runFlow(workflows[room?.category ?? 'general'], {
      prompt: chat.data.content.reduce((acc, cur) => acc + cur.text, ''),
      history,
    });

    await addChat({
      roomId: chat.data.roomId,
      roomUserId: chat.data.roomUserId,
      role: 'model',
      content: [{ text: message }],
    });

    return;
  },
);

const workflows = {
  'general': lawyerSuggestionFlow('general'),
  'bankruptcy': lawyerSuggestionFlow('bankruptcy'),
  'business': lawyerSuggestionFlow('business'),
  'consumer': lawyerSuggestionFlow('consumer'),
  'contract': lawyerSuggestionFlow('contract'),
  'defamation': lawyerSuggestionFlow('defamation'),
  'employment': lawyerSuggestionFlow('employment'),
  'estate-and-probate': lawyerSuggestionFlow('estate-and-probate'),
  'family': lawyerSuggestionFlow('family'),
  'intellectual-property': lawyerSuggestionFlow('intellectual-property'),
  'japanese': lawyerSuggestionFlow('japanese'),
  'medical-malpractice': lawyerSuggestionFlow('medical-malpractice'),
  'real-estate': lawyerSuggestionFlow('real-estate'),
} satisfies Record<NonNullable<LawyerCategorySchema>, Flow<typeof inputSchema, ZodString, ZodTypeAny>>;
