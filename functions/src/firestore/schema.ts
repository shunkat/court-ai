import { z } from 'zod';
import { firestoreTimestampLooseSchema, firestoreTimestampSchema } from './util';
import { lawyerCategorySchema } from '../models/lawyer/schema';

const roomCreatedSchema = z.object({
  name: z.string(),
  category: lawyerCategorySchema.optional(),
  status: z.literal('created'),
  judgeCount: z.number().int().min(0),
  creatorId: z.string(), // RoomUser
  oppositeId: z.string().optional(), // RoomUser
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampLooseSchema.optional(),
});

export const roomJudgeSchema = z.object({
  name: z.string(),
  category: lawyerCategorySchema,
  status: z.literal('judge'),
  judgeCount: z.number().int().min(0),
  creatorId: z.string(), // RoomUser
  oppositeId: z.string(), // RoomUser
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampLooseSchema,
});
export type RoomJudgeSchema = z.infer<typeof roomJudgeSchema>;

const roomCompletedSchema = z.object({
  name: z.string(),
  category: lawyerCategorySchema,
  status: z.literal('completed'),
  judgeCount: z.number().int().min(0),
  creatorId: z.string(), // RoomUser
  oppositeId: z.string(), // RoomUser
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampLooseSchema,
});

export const roomSchema = z.discriminatedUnion('status', [
  roomCreatedSchema,
  roomJudgeSchema,
  roomCompletedSchema,
]);

export type RoomSchema = z.infer<typeof roomSchema>;

export const chatSchema = z.object({
  roomId: z.string(),
  roomUserId: z.string(),
  content: z.array(z.object({
    text: z.string(),
  })),
  role: z.union([
    z.literal('model'),
    z.literal('tool'),
    z.literal('system'),
    z.literal('user'),
  ]),
  createdAt: firestoreTimestampLooseSchema,
});

export type ChatSchema = z.infer<typeof chatSchema>;

export const roomUserSchema = z.object({
  name: z.string(),
  roomId: z.string(),
  userId: z.string(),
  claimStatus: z.union([z.literal('shortage'), z.literal('sufficient'), z.literal('finished')]),
  createdAt: firestoreTimestampSchema,
});
export type RoomUserSchema = z.infer<typeof roomUserSchema>;

export const battleSchema = z.object({
  roomId: z.string(),
  judgeCount: z.number().int().min(0),
  contents: z.array(z.object({
    text: z.string(),
    role: z.union([
      z.literal('judge'),
      z.literal('plaintiff'), // 原告
      z.literal('defendant'), // 被告
    ]),
  })),
  createdAt: firestoreTimestampLooseSchema,
});
export type BattleSchema = z.infer<typeof battleSchema>;

// 裁判結果のスキーマ
export const judgmentResultSchema = z.object({
  roomId: z.string(), // どの部屋の判決か
  judgeCount: z.number().int().min(0),
  mainSentence: z.string(), // 裁判の主文
  judgeReasons: z.object({
    reasonTitle: z.string(),
    reasonDetail: z.array(z.string()),
  }), // 判決理由 (複数)
  futureDevelopments: z.string(), // 今後の展開
  homeworks: z.object({ // 宿題 (原告と被告それぞれ)
    plaintiff: z.array(z.string()), // 原告
    defendant: z.array(z.string()), // 被告
  }),
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampLooseSchema.optional(),
});
export type JudgmentSchema = z.infer<typeof judgmentResultSchema>;
