import { getChatsFromRoomUser } from '../../firestore/chat';
import { BattleSchema, ChatSchema, RoomJudgeSchema } from '../../firestore/schema';
import { addBattle } from '../../firestore/battle';
import * as Judge from '../../models/judge/actions';
import * as Lawyer from '../../models/lawyer/actions';
import { sendEmail } from './send-email';
import { updateRoom } from '../../firestore/room';

export const battleCourt = async (room: RoomJudgeSchema, roomId: string) => {
  const plaintiffClaims = await getChatsFromRoomUser(room.creatorId);
  const defendantClaims = await getChatsFromRoomUser(room.oppositeId);

  const plaintiffClaimsText = convertClaimsPrompt('plaintiff', plaintiffClaims);
  const defendantClaimsText = convertClaimsPrompt('defendant', defendantClaims);

  const battleContents: BattleSchema['contents'] = [
    { role: 'judge', text: await Judge.summarizeClaims(plaintiffClaimsText, defendantClaimsText) },
    { role: 'judge', text: 'In light of this, plaintiffs, what do you think?' },
  ];
  let battleContentsPrompt = convertConversationsPrompt(battleContents);

  const updateBattleOnMemory = (...contents: BattleSchema['contents']) => {
    battleContents.push(...contents);
    battleContentsPrompt += '\n' + convertConversationsPrompt(contents);
  };

  updateBattleOnMemory(
    {
      role: 'plaintiff',
      text: await Lawyer.openingStatement({ role: 'plaintiff', category: room.category, claimsPrompt: plaintiffClaimsText, conversationsPrompt: battleContentsPrompt }),
    },
    { role: 'judge', text: 'In light of this, defendants, what do you think?' },
  );

  updateBattleOnMemory({
    role: 'defendant',
    text: await Lawyer.openingStatement({ role: 'defendant', category: room.category, claimsPrompt: defendantClaimsText, conversationsPrompt: battleContentsPrompt }),
  },);

  updateBattleOnMemory({
    role: 'judge',
    text: await Judge.extractIssues(battleContentsPrompt),
  });

  // discussion
  await Promise.all(Array.from({ length: 1 }).map(async (_) => {
    updateBattleOnMemory({
      role: 'judge',
      text: await Judge.encourageLawyer('plaintiff', battleContentsPrompt),
    });
    updateBattleOnMemory({
      role: 'plaintiff',
      text: await Lawyer.provideEvidence({ role: 'plaintiff', category: room.category, claimsPrompt: plaintiffClaimsText, conversationsPrompt: battleContentsPrompt }),
    });
    updateBattleOnMemory({
      role: 'judge',
      text: await Judge.encourageLawyer('defendant', battleContentsPrompt),
    });
    updateBattleOnMemory({
      role: 'defendant',
      text: await Lawyer.provideEvidence({ role: 'defendant', category: room.category, claimsPrompt: defendantClaimsText, conversationsPrompt: battleContentsPrompt }),
    });
  }));

  updateBattleOnMemory({
    role: 'judge',
    text: await Judge.finalJudgment(battleContentsPrompt),
  });

  await Promise.all([
    sendEmail({ roomId, title: room.name, plaintiffId: room.creatorId, defendantId: room.oppositeId }),
    addBattle({
      roomId: roomId,
      judgeCount: room.judgeCount,
      contents: battleContents,
    }),
    updateRoom(roomId, { ...room, status: 'completed' }),
  ]);
  return;
};

const convertClaimsPrompt = (type: 'plaintiff' | 'defendant', claims: ChatSchema[]) => {
  return `${claims.map((claim) => `${claim.role === 'user' ? type : 'lawyer'}: ${claim.content}`).join('\n')}`;
};

const convertConversationsPrompt = (contents: BattleSchema['contents']) => {
  return contents.map((content) => `${content.role}: ${content.text}`).join('\n');
};

