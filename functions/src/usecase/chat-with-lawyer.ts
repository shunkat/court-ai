import { runFlow } from '@genkit-ai/flow';
import { getChatsFromRoomUser, addChat } from '../firestore/chat';
import { getRoom } from '../firestore/room';
import { ChatSchema } from '../firestore/schema';
import { llmFlows } from '../models/lawyer';

export const chatWithLawyer = async (chat: ChatSchema) => {
  // ! Caution: infinite loop
  // Process only user messages
  if (chat.role !== 'user') return;

  const room = await getRoom(chat.roomId);
  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 5 });

  const message = await runFlow(llmFlows[room?.category ?? 'general'], {
    prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
    history,
  });

  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    content: [{ text: message }],
  });

  return;
};
