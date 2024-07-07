import { z } from 'zod';
import { firestoreTimestampLooseSchema, firestoreTimestampSchema } from './util';

export const channelSchema = z.object({
  name: z.string().min(0),
  category: z.union([
    z.literal('lawyer'),
    z.literal('japanese'),
  ]).optional(),
  createdAt: firestoreTimestampSchema,
});
export type ChannelSchema = z.infer<typeof channelSchema>;

export const chatSchema = z.object({
  role: z.union([
    z.literal('model'),
    z.literal('tool'),
    z.literal('system'),
    z.literal('user'),
  ]),
  message: z.string().min(0),
  createdAt: firestoreTimestampLooseSchema,
});

export type ChatSchema = z.infer<typeof chatSchema>;
