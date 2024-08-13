import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';
import { defineFlow } from '@genkit-ai/flow';
import { historySchema, inputSchema, LawyerCategorySchema, outputSchema, summarizeClaimOutputSchema } from './schema';
import path from 'path';
import { z } from 'zod';

const lawyerSuggestionFlow = (category: LawyerCategorySchema, name: string) => defineFlow(
  {
    name,
    inputSchema: inputSchema,
    outputSchema: outputSchema,
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: await getSystemPrompt(category) }] },
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

export const lawyerSummarizeClaimFlow = (category: LawyerCategorySchema, name: string) => defineFlow(
  {
    name,
    inputSchema: inputSchema,
    outputSchema: summarizeClaimOutputSchema,
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: await getSystemPrompt(category) }] },
      ...input.history,
    ];

    try {
      const llmResponse = await generate({
        model: gemini15Pro,
        // eslint-disable-next-line max-len
        prompt: `You are currently in the pre-trial preparation phase. Your task is to support the user in organizing evidence and preparing for trial. During the conversation, focus on short and clear messages to maintain the flow. Begin by identifying the user's concerns and checking whether there is sufficient evidence to support their case. If evidence is missing or unclear, ask specific follow-up questions to gather the necessary details. Ensure that all required materials are ready to proceed with the trial.
#user input
${input.prompt}`,
        history,
        config: { temperature: 1 },
      });

      return llmResponse.text();
    } catch (error) {
      console.error(error);
      return 'Could you please elaborate a little more?';
    }
  },
);

export const lawyerSuggestionSufficientClaimFlow = defineFlow(
  {
    name: 'lawyerSuggestionSufficientClaimFlow',
    inputSchema: historySchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const history: MessageData[] = input;

    const prompt = `The user intends to file a lawsuit and is currently in the litigation preparation stage.
Based on the conversation so far, your role is to determine whether the user should proceed to the litigation stage.
## Conditions for proceeding to the litigation stage
Proceed if any of the following conditions apply:
- Answer 'true' if the information provided by the user is sufficient to prepare a lawsuit.
- If more than three pieces of evidence or one or more pieces of very strong evidence are submitted, this is considered sufficient.
- If it is not sufficient, return 'false'.
- If you deem it insufficient, but the user deems it sufficient preparation.
  - Examples - "This is sufficient." - "This is sufficient preparation." - "I'm tired of waiting" - "There is no more evidence.
## Output.
Returns absolutely true or false.
Example - true`;

    const llmResponse = await generate({
      model: gemini15Pro,
      prompt: prompt,
      history,
      config: { temperature: 1 },
    });

    return llmResponse.text();
  },
);

const getSystemPrompt = async (category: LawyerCategorySchema) => {
  const filePath = path.resolve(__dirname, `./prompts/characters/${category}`);
  return await import(filePath).then((module) => module.prompt);
};

export const lawyerFlows = {
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

export const lawyerSummarizeClaimFlows = {
  'general': lawyerSummarizeClaimFlow('general', 'generalLawyerSummarizeClaimFlow'),
  'bankruptcy': lawyerSummarizeClaimFlow('bankruptcy', 'bankruptcyLawyerSummarizeClaimFlow'),
  'business': lawyerSummarizeClaimFlow('business', 'businessLawyerSummarizeClaimFlow'),
  'consumer': lawyerSummarizeClaimFlow('consumer', 'consumerLawyerSummarizeClaimFlow'),
  'contract': lawyerSummarizeClaimFlow('contract', 'contractLawyerSummarizeClaimFlow'),
  'defamation': lawyerSummarizeClaimFlow('defamation', 'defamationLawyerSummarizeClaimFlow'),
  'employment': lawyerSummarizeClaimFlow('employment', 'employmentLawyerSummarizeClaimFlow'),
  'estate-and-probate': lawyerSummarizeClaimFlow('estate-and-probate', 'estateAndProbateLawyerSummarizeClaimFlow'),
  'family': lawyerSummarizeClaimFlow('family', 'familyLawyerSummarizeClaimFlow'),
  'intellectual-property': lawyerSummarizeClaimFlow('intellectual-property', 'intellectualPropertyLawyerSummarizeClaimFlow'),
  'japanese': lawyerSummarizeClaimFlow('japanese', 'japaneseLawyerSummarizeClaimFlow'),
  'medical-malpractice': lawyerSummarizeClaimFlow('medical-malpractice', 'medicalMalpracticeLawyerSummarizeClaimFlow'),
  'real-estate': lawyerSummarizeClaimFlow('real-estate', 'realEstateLawyerSummarizeClaimFlow'),
};
