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
The "message" field represents the response to the user,
and the "isSufficient" field indicates whether the information is sufficient for litigation preparation and if the user feels their arguments are sufficiently supported.

### Examples:

#### Input
I have a signed contract from January 10th that shows the agreed payment terms.
#### Output
\`\`\`json
{
  "message": "The signed contract from January 10th clearly outlines the agreed payment terms, which will be crucial in demonstrating the expectations set between both parties.",
  "isSufficient": true
}
\`\`\`

#### Input
Here are the emails where they acknowledged receiving the goods on March 5th.
#### Output
\`\`\`json
{
  "message": "The emails acknowledging receipt of the goods on March 5th are important evidence of the transaction completion. This will support your claim of fulfilling your part of the agreement.",
  "isSufficient": true
}
\`\`\`

#### Input
I think we have covered everything we need for now.
#### Output
\`\`\`json
{
  "message": "If you believe we have covered all necessary points, you can proceed with your preparations. If you need further assistance, please let me know.",
  "isSufficient": true
}
\`\`\`

#### Input
I want to add the witness statements about the incident on February 20th.
#### Output
\`\`\`json
{
  "message": "The witness statements about the incident on February 20th will be valuable in corroborating your version of events. Ensure they are properly documented and ready for presentation.",
  "isSufficient": false
}
\`\`\`

#### Input
I think we're ready to move forward with this.
#### Output
\`\`\`json
{
  "message": "Great! If you feel everything is in order, you can proceed with your preparations. If there's anything else you need, feel free to ask.",
  "isSufficient": true
}
\`\`\`
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
