import { z } from 'zod';

export const modelRoleSchema = z.union([
  z.literal('model'),
  z.literal('tool'),
  z.literal('system'),
  z.literal('user'),
]);

export const historySchema = z.array(z.object({
  role: modelRoleSchema,
  content: z.array(z.object({ text: z.string() })),
})).max(15);

export const inputSchema = z.object({
  prompt: z.string(),
  history: historySchema,
});

export const outputSchema = z.string();
export const summarizeClaimOutputSchema = z.string();

export const lawyerCategorySchema = z.union([
  z.literal('general'), // 一般(下記の法律に当てはまらない場合)
  z.literal('bankruptcy'), // 債務整理・破産法
  z.literal('business'), // 会社法
  z.literal('consumer'), // 消費者法
  z.literal('contract'), // 契約法
  z.literal('defamation'), // 名誉毀損
  z.literal('employment'), // 労働法
  z.literal('estate-and-probate'), // 遺産相続法
  z.literal('family'), // 家族法
  z.literal('intellectual-property'), // 知的財産権
  z.literal('japanese'), // 日本法
  z.literal('medical-malpractice'), // 医療過誤
  z.literal('real-estate'), // 不動産法
]);

export type LawyerCategorySchema = z.infer<typeof lawyerCategorySchema>;
