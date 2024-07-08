import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { lawyerSystemPrompt } from './prompt';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema } from './schema';

export const lawyerSuggestionFlow = defineFlow(
  {
    name: 'lawyerSuggestionFlow',
    inputSchema: inputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: lawyerSystemPrompt }] },
      ...input.history.map((h) => ({ role: h.role, content: [{ text: h.message }] })),
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
