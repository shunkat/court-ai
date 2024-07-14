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
