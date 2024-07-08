import { z } from 'zod';

export const inputSchema = z.object({
  prompt: z.string(),
  history: z.array(z.object({
    role: z.union([z.literal('user'), z.literal('model'), z.literal('system'), z.literal('tool')]),
    message: z.string(),
  })).max(10),
});

