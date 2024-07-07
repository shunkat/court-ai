import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { ChatSchema } from './schema';

export const addChat = async (channelId: string, chat: ChatSchema): Promise<void> => {
  await db.collection(`channels/${channelId}/chats`).add({ ...chat, createdAt: FieldValue.serverTimestamp() });
};
