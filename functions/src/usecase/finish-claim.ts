import { getRoom, updateRoom } from '../firestore/room';
import { getRoomUser } from '../firestore/room-user';
import { RoomUserSchema } from '../firestore/schema';

export const finishAllClaims = async (roomUser: RoomUserSchema) => {
  const room = await getRoom(roomUser.roomId);
  if (room?.status !== 'created') return;
  if (!room.oppositeId) return;

  const creator = await getRoomUser(room.creatorId);
  const opposite = await getRoomUser(room.oppositeId);
  if (creator?.claimStatus === 'finished' && opposite?.claimStatus === 'finished') {
    await updateRoom(roomUser.roomId, {
      ...room,
      oppositeId: room.oppositeId!, // type assist
      category: room.category === 'intake' ? 'general' : room.category ?? 'general',
      status: 'judge',
    });
  }
};
