import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { z } from 'zod';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema, LawyerCategorySchema } from './schema';
import path from 'path';

const lawyerSuggestionFlow = (category: LawyerCategorySchema, name: string) => defineFlow(
  {
    name,
    inputSchema: inputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: await getSystemPrompt(category) }] },
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

const getSystemPrompt = async (category: LawyerCategorySchema) => {
  const filePath = path.resolve(__dirname, `./prompts/${category}`);
  return await import(filePath).then((module) => module.prompt);
};

export const llmFlows = {
  'general': lawyerSuggestionFlow('general', 'generalLawyerSuggestionFlow'),
  'bankruptcy': lawyerSuggestionFlow('bankruptcy', 'bankruptcyLawyerSuggestionFlow'),
  'business': lawyerSuggestionFlow('business', 'businessLawyerSuggestionFlow'),
  'consumer': lawyerSuggestionFlow('consumer', 'consumerLawyerSuggestionFlow'),
  'contract': lawyerSuggestionFlow('contract', 'contractLawyerSuggestionFlow'),
  'defamation': lawyerSuggestionFlow('defamation', 'defamationLawyerSuggestionFlow'),
  'employment': lawyerSuggestionFlow('employment', 'employmentLawyerSuggestionFlow'),
  'estate-and-probate': lawyerSuggestionFlow('estate-and-probate', 'estateAndProbateLawyerSuggestionFlow'),
  'family': lawyerSuggestionFlow('family', 'familyLawyerSuggestionFlow'),
  'intellectual-property': lawyerSuggestionFlow('intellectual-property', 'intellectualPropertyLawyerSuggestionFlow'),
  'japanese': lawyerSuggestionFlow('japanese', 'japaneseLawyerSuggestionFlow'),
  'medical-malpractice': lawyerSuggestionFlow('medical-malpractice', 'medicalMalpracticeLawyerSuggestionFlow'),
  'real-estate': lawyerSuggestionFlow('real-estate', 'realEstateLawyerSuggestionFlow'),
};
