import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { RoomSchema, roomSchema } from './schema';

export const getRoom = async (roomId: string): Promise<RoomSchema | undefined> => {
  const data = (await db.doc(`rooms/${roomId}`).get()).data();
  const parsed = roomSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid channel data:', parsed.error.errors);
    return undefined;
  }
  return parsed.data;
};

export const updateRoom = async (roomId: string, room: RoomSchema) => {
  await db.doc(`rooms/${roomId}`).update({ ...room, updatedAt: FieldValue.serverTimestamp() });
};

export const updateRoomCategory = async (roomId: string, category: string) => {
  await db.doc(`rooms/${roomId}`).update({ category });
}