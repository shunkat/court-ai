import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { chatSchema, roomJudgeSchema, RoomJudgeSchema, roomSchema, RoomSchema } from '../firestore/schema';
import { chatWithLawyer } from '../usecase/chat-with-lawyer';
import { battleCourt } from '../usecase/battle-court';

// Batch battles lawyers and a judge
export const onRoomDocumentUpdated = onDocumentUpdated(
  'rooms/{roomId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const before = roomSchema.safeParse(snapshot.before.data());
    const after = roomSchema.safeParse(snapshot.after.data());
    if (!before.success || !after.success) {
      console.error('Invalid room data:', before.error?.errors, after.error?.errors);
      return;
    }

    if (!validateStartBattleRoom(before.data, after.data)) return;

    await battleCourt(after.data, event.params.roomId);
    return;
  }
);

const validateStartBattleRoom = (before: RoomSchema, after: RoomSchema): after is RoomJudgeSchema => {
  if (!(before.status !== after.status && after.status === 'judge')) return false;

  const room = roomJudgeSchema.safeParse(after);
  if (!room.success) {
    console.error('Invalid room data:', room.error.errors);
    return false;
  }
  return true;
};

// chat with LLM
export const onChatDocumentCreated = onDocumentCreated(
  'chats/{chatId}',
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const chat = chatSchema.safeParse(snapshot.data());
    if (!chat.success) {
      console.error('Invalid chat data:', chat.error.errors);
      return;
    }

    await chatWithLawyer(chat.data);
    return;
  },
);
