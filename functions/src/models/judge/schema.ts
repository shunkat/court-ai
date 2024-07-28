import { z } from 'zod';

export const summarizeOutputSchema = z.object({
  mainSentence: z.string().describe('The main sentence of the ruling.'),
  judgeReasons: z.object({
    reasonTitle: z.string().describe('The title summarizing the reason for the judgment.'),
    reasonDetail: z.array(z.string()).describe('Details explaining the judgment (n=1~3)'),
  }),
  futureDevelopments: z.string().describe('Possible future developments, including the potential for settlement or a second trial.'),
  homeworks: z.object({
    plaintiff: z.array(z.string()).describe('Advice for the plaintiff in case of a retrial (n=1~3)'),
    defendant: z.array(z.string()).describe('Advice for the defendant in case of a retrial (n=1~3)'),
  }),
});
export type SummarizeOutputSchema = z.infer<typeof summarizeOutputSchema>;
