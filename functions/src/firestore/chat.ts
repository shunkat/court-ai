import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { ChatSchema, chatSchema } from './schema';

export const addChat = async (chat: ChatSchema): Promise<void> => {
  await db.collection(`chats`).add({ ...chat, createdAt: FieldValue.serverTimestamp() });
};

export const getChatsFromRoomUser = async (roomUserId: string, option?: {
  last?: number
}): Promise<ChatSchema[]> => {
  let q = db.collection('chats').where('roomUserId', '==', roomUserId);

  if (option?.last) {
    q = q.limit(option.last) .orderBy('createdAt', 'desc');
  }

  const snapshot = await q.get();

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

export const updateChats = async(roomUserId: string, chat: ChatSchema) => {
  await db.collection('chats').doc(roomUserId).update({ ...chat, updatedAt: FieldValue.serverTimestamp() });
};
