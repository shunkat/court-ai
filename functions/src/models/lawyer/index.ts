import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema, LawyerCategorySchema, outputSchema, summarizeClaimOutputSchema } from './schema';
import path from 'path';

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
      model: geminiPro,
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
    outputSchema: summarizeClaimOutputSchema.nullable(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: await getSystemPrompt(category) }] },
      ...input.history,
    ];

    const llmResponse = await generate({
      model: geminiPro,
      prompt: getUserPrompt(input.prompt),
      history,
      config: { temperature: 1 },
      output: { schema: summarizeClaimOutputSchema },
    });

    return llmResponse.output();
  },
);

const getSystemPrompt = async (category: LawyerCategorySchema) => {
  const filePath = path.resolve(__dirname, `./prompts/characters/${category}`);
  return await import(filePath).then((module) => module.prompt);
};

const getUserPrompt = (input: string) => {
  return `{Output} according to the specified format based on the user's {Input}.
## Input
${input}
## Output
- Provide the output in JSON format.
\`\`\`json
  {message: {string}, isSufficient: {boolean}}
\`\`\`
The "message" field represents the response to the user, and the "isSufficient" field indicates whether the information is sufficient for litigation preparation.
`;
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
