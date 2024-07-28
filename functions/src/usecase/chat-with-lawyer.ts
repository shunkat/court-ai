import { runFlow } from '@genkit-ai/flow';
import { getChatsFromRoomUser, addChat } from '../firestore/chat';
import { getRoom } from '../firestore/room';
import { ChatSchema } from '../firestore/schema';
import { lawyerSummarizeClaimFlows } from '../models/lawyer';
import { getRoomUser, updateRoomUser } from '../firestore/room-user';

export const chatWithLawyer = async (chat: ChatSchema) => {
  // ! Caution: infinite loop
  // Process only user messages
  if (chat.role !== 'user') return;

  const room = await getRoom(chat.roomId);
  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 5 });

  const opt = await runFlow(lawyerSummarizeClaimFlows[room?.category ?? 'general'], {
    prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
    history,
  });

  if (!opt) {
    await addChat({
      roomId: chat.roomId,
      roomUserId: chat.roomUserId,
      role: 'model',
      content: [{ text: 'Could you please elaborate a little more?' }],
    });
    return;
  }

  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    content: [{ text: opt.message }],
  });

  if (opt.isSufficient) {
    const roomUser = await getRoomUser(chat.roomUserId);
    if (roomUser?.claimStatus !== 'shortage') return;

    await updateRoomUser(chat.roomUserId, { ...roomUser, claimStatus: 'sufficient' });
  }

  return;
};
