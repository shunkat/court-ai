import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { z } from 'zod';
import { getSummarizePrompt, judgeSystemPrompt } from './prompt';
import { defineFlow } from '@genkit-ai/flow';
import { modelRoleSchema } from '../lawyer/schema';
import { summarizeOutputSchema } from './schema';
import { gemini15Flash } from '@genkit-ai/googleai';

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
      model: gemini15Flash,
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

    try {
      const llmResponse = await generate({
        model: gemini15Flash,
        prompt: getSummarizePrompt(input.conversation),
        history,
        config: { temperature: 1 },
      });
      return llmResponse.output();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
);
