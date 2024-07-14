import { z } from 'zod';
import { firestoreTimestampLooseSchema, firestoreTimestampSchema } from './util';
import { lawyerCategorySchema } from '../models/lawyer/schema';

export const roomSchema = z.object({
  name: z.string(),
  category: lawyerCategorySchema.optional(),
  status: z.union([z.literal('created'), z.literal('judge'), z.literal('completed')]),
  judgeCount: z.number().int().min(0),
  creatorId: z.string(), // RoomUser
  oppositeId: z.string().optional(), // RoomUser
  createdAt: firestoreTimestampSchema,
});
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
