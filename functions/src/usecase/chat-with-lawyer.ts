import { runFlow } from '@genkit-ai/flow';
import { getChatsFromRoomUser, addChat } from '../firestore/chat';
import { getRoom, updateRoom } from '../firestore/room';
import { ChatSchema, RoomCreatedSchema } from '../firestore/schema';
import { getRoomUser, updateRoomUser } from '../firestore/room-user';
import { handleIntakeFlow } from '../models/intake';
import { lawyerSummarizeClaimFlows } from '../models/lawyer';
import { LawyerCategorySchema } from '../models/lawyer/schema';

export const chatWithLawyer = async (chat: ChatSchema) => {
  // ! Caution: infinite loop
  // Process only user messages
  if (chat.role !== 'user') return;

  const room = await getRoom(chat.roomId);
  if (!room) {
    console.error('Room doesn\'t exist');
    return;
  }

  const category = room.category;

  const message = (!category || category === 'intake') ?
    await handleIntake(chat, room) : await handleClaim(chat, category);

  if (!message) return;

  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    content: [{ text: message }],
  });
};

const handleIntake = async (chat: ChatSchema, room:RoomCreatedSchema ) => {
  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 5 });

  const result = await runFlow(handleIntakeFlow, {
    prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
    history,
  });

  if (!result) {
    console.error('Failed to handle intake');
    await addChat({
      roomId: chat.roomId,
      roomUserId: chat.roomUserId,
      role: 'model',
      content: [{ text: 'Could you please elaborate a little more?' }],
    });
    return;
  }

  if (result.category !== 'null') {
    await updateRoom(chat.roomId, { ...room, category: result.category });
  }

  return result.text;
};

const handleClaim = async (chat: ChatSchema, category: LawyerCategorySchema ) => {
  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 5 });

  const opt = await runFlow(lawyerSummarizeClaimFlows[category], {
    prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
    history,
  });

  if (!opt) {
    console.error('Failed to summarize claim');
    await addChat({
      roomId: chat.roomId,
      roomUserId: chat.roomUserId,
      role: 'model',
      content: [{ text: 'Could you please elaborate a little more?' }],
    });
    return;
  }

  if (opt.isSufficient) {
    const roomUser = await getRoomUser(chat.roomUserId);
    if (roomUser?.claimStatus !== 'shortage') return;

    await updateRoomUser(chat.roomUserId, { ...roomUser, claimStatus: 'sufficient' });
  }

  return opt.message;
};
