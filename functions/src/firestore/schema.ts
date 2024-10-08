import { z } from 'zod';
import { firestoreTimestampLooseSchema, firestoreTimestampSchema } from './util';
import { lawyerCategorySchema } from '../models/lawyer/schema';

const roomCreatedSchema = z.object({
  name: z.string(),
  category: z.union([lawyerCategorySchema, z.literal('intake')]).optional(), // intakeは受付
  status: z.literal('created'),
  judgeCount: z.number().int().min(0),
  creatorId: z.string(), // RoomUser
  oppositeId: z.string().optional(), // RoomUser
  createdAt: firestoreTimestampSchema,
  updatedAt: firestoreTimestampLooseSchema.optional(),
});
export type RoomCreatedSchema = z.infer<typeof roomCreatedSchema>;

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
  category: lawyerCategorySchema.optional(),
  createdAt: firestoreTimestampLooseSchema,
});

export type ChatSchema = z.infer<typeof chatSchema>;

export const roomUserSchema = z.object({
  name: z.string(),
  roomId: z.string(),
  userId: z.string(),
  claimStatus: z.union([z.literal('shortage'), z.literal('sufficient'), z.literal('finished')]).optional(),
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
export const summarySchema = z.object({
  roomId: z.string(), // どの部屋の判決か
  judgeCount: z.number().int().min(0),
  mainSentence: z.string(), // 裁判の主文
  judgeReasons: z.object({
    reasonTitle: z.string(),
    reasonDetail: z.array(z.string()),
  }), // 判決理由 (一旦、一つでok)
  futureDevelopments: z.string(), // 今後の展開
  homeworks: z.object({ // 宿題 (原告と被告それぞれ)
    plaintiff: z.array(z.string()), // 原告
    defendant: z.array(z.string()), // 被告
  }),
  createdAt: firestoreTimestampLooseSchema,
  updatedAt: firestoreTimestampLooseSchema.optional(),
});
export type SummarySchema = z.infer<typeof summarySchema>;
