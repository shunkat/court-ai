import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { chatSchema, RoomSchema, roomSchema } from '../firestore/schema';
import { getRoom } from '../firestore/room';
import { addChat, getChatsFromRoom, getChatsFromUser } from '../firestore/chat';
import { llmFlows } from '../models/lawyer';
import { runFlow } from '@genkit-ai/flow';
import { judgeSuggestionFlow } from '../models/judge';

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

    if (!canStartBattle(before.data, after.data)) return;

    const roomId = event.params.roomId;
    const room = after.data;
    const chats = await getChatsFromRoom(roomId);

    await addChat({
      roomId: roomId,
      roomUserId: 'admin',
      role: 'system',
      content: [{ type: 'text', text: '裁判を開始します。' }],
    });

    // 原告の主張を取得
    const plaintiffClaim = await getPlaintiffClaim(roomId);
    // 被告の主張を取得
    const defendantClaim = await getDefendantClaim(roomId);

    // 裁判官AIに判定を依頼
    const judgeResponse = await runFlow(judgeSuggestionFlow, `${plaintiffClaim} ${defendantClaim}`);

    // 判定結果をチャットに追加
    await addChat({
      roomId: roomId,
      roomUserId: 'admin',
      role: 'system',
      content: [{ type: 'text', text: judgeResponse }],
    });
  }
);

const canStartBattle = (before: RoomSchema, after: RoomSchema) :boolean => {
  return before.status !== after.status && after.status === 'judge';
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

    // ! Caution: infinite loop
    // Process only user messages
    if (chat.data.role !== 'user') return;

    const room = await getRoom(chat.data.roomId);
    const history = await getChatsFromUser(chat.data.roomUserId, 5);

    const message = await runFlow(llmFlows[room?.category ?? 'general'], {
      prompt: chat.data.content.reduce((acc, cur) => acc + cur.text, ''),
      history,
    });

    await addChat({
      roomId: chat.data.roomId,
      roomUserId: chat.data.roomUserId,
      role: 'model',
      content: [{ text: message }],
    });

    return;
  },
);
