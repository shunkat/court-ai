import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema, LawyerCategorySchema } from './schema';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const lawyerSuggestionFlow = (category: LawyerCategorySchema) => defineFlow(
  {
    name: 'lawyerSuggestionFlow',
    inputSchema: inputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: getSystemPrompt(category) }] },
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

const getSystemPrompt = (category: LawyerCategorySchema) => {
  const filePath = resolve(__dirname, `./prompts/${category}.md`);
  const promptContent = readFileSync(filePath, 'utf-8');
  return promptContent;
};
