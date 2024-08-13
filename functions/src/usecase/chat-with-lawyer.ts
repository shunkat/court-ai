import { runFlow } from '@genkit-ai/flow';
import { getChatsFromRoomUser, addChat } from '../firestore/chat';
import { getRoom, updateRoom } from '../firestore/room';
import { ChatSchema, RoomCreatedSchema } from '../firestore/schema';
import { getRoomUser, updateRoomUser } from '../firestore/room-user';
import { handleIntakeFlow } from '../models/intake';
import { lawyerSuggestionSufficientClaimFlow, lawyerSummarizeClaimFlows } from '../models/lawyer';
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

  (!category || category === 'intake') ?
    await handleIntake(chat, room) : await handleClaim(chat, category);
};

const handleIntake = async (chat: ChatSchema, room: RoomCreatedSchema ) => {
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
  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    content: [{ text: result.text }],
  });

  return result.text;
};

const handleClaim = async (chat: ChatSchema, category: LawyerCategorySchema ) => {
  const history = await getChatsFromRoomUser(chat.roomUserId, { last: 9 }); // ユーザーから始めないとバグるので奇数にしている

  const message = await runFlow(lawyerSummarizeClaimFlows[category], {
    prompt: chat.content.reduce((acc, cur) => acc + cur.text, ''),
    history,
  });

  // sufficient check
  const roomUser = await getRoomUser(chat.roomUserId);
  if (roomUser && roomUser?.claimStatus !== 'sufficient') {
    const isSufficient = await runFlow(lawyerSuggestionSufficientClaimFlow, (
      [...history, { role: 'model', content: [{ text: message }] }]
    ));
    await updateRoomUser(chat.roomUserId, { ...roomUser, claimStatus: isSufficient ? 'sufficient' : 'shortage' });
  }

  await addChat({
    roomId: chat.roomId,
    roomUserId: chat.roomUserId,
    role: 'model',
    category,
    content: [{ text: message ?? 'Could you please elaborate a little more?' }],
  });
};
