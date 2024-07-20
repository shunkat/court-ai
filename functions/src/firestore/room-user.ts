import { db } from '../config';
import { RoomUserSchema, roomUserSchema } from './schema';

export const getRoomUser = async (id: string): Promise<RoomUserSchema | undefined> => {
  const data = (await db.doc(`room_users/${id}`).get()).data();
  const parsed = roomUserSchema.safeParse(data);
  if (!parsed.success) {
    console.error('Invalid room user data:', parsed.error.errors);
    return undefined;
  }
  return parsed.data;
};
