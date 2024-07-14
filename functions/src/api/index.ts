import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { chatSchema } from '../firestore/schema';
import { getRoom } from '../firestore/room';
import { addChat, getChatsLast } from '../firestore/chat';
import { llmFlows } from '../models/lawyer';
import { runFlow } from '@genkit-ai/flow';

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

    const message = await runFlow(llmFlows[room?.category ?? 'general'], {
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
