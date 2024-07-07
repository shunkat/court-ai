import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { judgeSystemPrompt } from './prompt';
import { defineFlow } from '@genkit-ai/flow';

export const judgeSuggestionFlow = defineFlow(
  {
    name: 'judgeSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
    // authPolicy: firebaseAuth((user) => {
    //   if (!user.email_verified) {
    //     throw new Error('Verified email required to run flow');
    //   }
    // }),
  },
  async (prompt) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: judgeSystemPrompt }] },
    ];

    const llmResponse = await generate({
      model: geminiPro,
      prompt,
      history,
      config: { temperature: 1 },
    });

    return llmResponse.text();
  },
);
