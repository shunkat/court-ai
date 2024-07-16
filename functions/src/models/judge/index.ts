import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { judgeSystemPrompt } from './prompt';
import { defineFlow } from '@genkit-ai/flow';
import { modelRoleSchema } from '../lawyer/schema';

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
