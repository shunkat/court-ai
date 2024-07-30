import { getChatsFromRoomUser } from '../../firestore/chat';
import { BattleSchema, ChatSchema, RoomJudgeSchema } from '../../firestore/schema';
import { addBattle } from '../../firestore/battle';
import * as Judge from '../../models/judge/actions';
import * as Lawyer from '../../models/lawyer/actions';
import { sendEmail } from './send-email';
import { updateRoom } from '../../firestore/room';
import { SummarizeOutputSchema } from '../../models/judge/schema';
import { addSummary } from '../../firestore/summary';

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

  const finalJudgment = await Judge.finalJudgment(battleContentsPrompt);
  if (!finalJudgment) {
    console.error('Failed to generate final judgment');
    updateBattleOnMemory({
      role: 'judge',
      text: 'I am sorry, but I could not generate a final judgment. Please wait for the judge to make a decision.',
    });
  } else {
    updateBattleOnMemory({
      role: 'judge',
      text: convertMarkdown(finalJudgment),
    });
  }

  const [, battle] = await Promise.all([
    addSummary(newSummary(roomId, room.judgeCount, finalJudgment)),
    addBattle({
      roomId: roomId,
      judgeCount: room.judgeCount,
      contents: battleContents,
    }),
    updateRoom(roomId, { ...room, status: 'completed' }),
  ]);

  await sendEmail({ roomId, battleId: battle.id, title: room.name, plaintiffId: room.creatorId, defendantId: room.oppositeId });
};

const convertClaimsPrompt = (type: 'plaintiff' | 'defendant', claims: ChatSchema[]) => {
  return `${claims.map((claim) => `${claim.role === 'user' ? type : 'lawyer'}: ${claim.content}`).join('\n')}`;
};

const convertConversationsPrompt = (contents: BattleSchema['contents']) => {
  return contents.map((content) => `${content.role}: ${content.text}`).join('\n');
};

const convertMarkdown = (results: SummarizeOutputSchema) => {
  return `## Main Sentence
  ${results.mainSentence}
  ## Reasons
  ### ${results.judgeReasons.reasonTitle}
  ${results.judgeReasons.reasonDetail.map((reason, index) => `${index + 1}. ${reason}`).join('\n')}
  `;
};

const newSummary = (roomId: string, judgeCount: number, summary: SummarizeOutputSchema | null) => {
  return {
    roomId,
    judgeCount,
    ...(summary ?? {
      mainSentence: 'Error: contact administrator',
      judgeReasons: {
        reasonTitle: '',
        reasonDetail: [],
      },
      futureDevelopments: '',
      homeworks: {
        plaintiff: [],
        defendant: [],
      },
    }),
  };
};

