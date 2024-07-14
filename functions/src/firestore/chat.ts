import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { ChatSchema, chatSchema } from './schema';

export const addChat = async (chat: ChatSchema): Promise<void> => {
  await db.collection(`chats`).add({ ...chat, createdAt: FieldValue.serverTimestamp() });
};

export const getChatsLast = async (roomUserId: string, last = 5): Promise<ChatSchema[]> => {
  const snapshot = await db.collection('chats')
    .where('roomUserId', '==', roomUserId)
    .orderBy('createdAt', 'desc')
    .limit(last)
    .get();

  const chats = snapshot.docs.map((doc) => {
    const chat = chatSchema.safeParse(doc.data());
    if (chat.success) return chat.data;
    else {
      console.error('Failed to getChats\nInvalid chat data:', chat.error.errors);
      return;
    }
  }).filter((c) => !!c)
    .reverse();

  return chats;
};
