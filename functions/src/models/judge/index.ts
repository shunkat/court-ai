import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { getSummarizePrompt, judgeSystemPrompt } from './prompt';
import { defineFlow } from '@genkit-ai/flow';
import { modelRoleSchema } from '../lawyer/schema';
import { summarizeOutputSchema } from './schema';

export const judgeSuggestionFlow = defineFlow(
  {
    name: 'judgeSuggestionFlow',
    inputSchema: z.object({
      prompt: z.string(),
      history: z.array(z.object({
        role: modelRoleSchema,
        content: z.array(z.object({ text: z.string() })),
      })),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: judgeSystemPrompt }] },
      ...input.history,
    ];

    const llmResponse = await generate({
      model: geminiPro,
      prompt: input.prompt,
      history,
      config: { temperature: 1 },
    });

    return llmResponse.text();
  },
);

export const judgeSummarizeFlow = defineFlow(
  {
    name: 'judgeSummarizeFlow',
    inputSchema: z.object({
      conversation: z.string(),
      history: z.array(z.object({
        role: modelRoleSchema,
        content: z.array(z.object({ text: z.string() })),
      })),
    }),
    outputSchema: summarizeOutputSchema.nullable(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: judgeSystemPrompt }] },
      ...input.history,
    ];

    const llmResponse = await generate({
      model: geminiPro,
      prompt: getSummarizePrompt(input.conversation),
      history,
      config: { temperature: 1 },
    });

    return llmResponse.output();
  },
);
