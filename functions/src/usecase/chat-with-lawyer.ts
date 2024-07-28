import { runFlow } from '@genkit-ai/flow';
import { getChatsFromRoomUser, addChat } from '../firestore/chat';
import { getRoom, updateRoomCategory } from '../firestore/room';
import { ChatSchema } from '../firestore/schema';
import { llmFlows } from '../models/lawyer';
import { handleIntakeFlow } from '../models/intake';

export const chatWithLawyer = async (chat: ChatSchema) => {
  // ! Caution: infinite loop
  // Process only user messages
  if (chat.role !== 'user') return;

  const room = await getRoom(chat.roomId);
  const category = room?.category;
  let message = '';

  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 5 });


  if (!category || category === 'intake') {
    const result = await runFlow(handleIntakeFlow, {
      prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
      history,
    });

    if (result.category) {
      await updateRoomCategory(chat.roomId, result.category);
    }
    message = result.text;
  } else {
    message = await runFlow(llmFlows[category], {
      prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
      history,
    });
  }

  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    content: [{ text: message }],
  });

  return;
};
