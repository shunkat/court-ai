import { runFlow } from '@genkit-ai/flow';
import { llmFlows } from '.';
import { LawyerCategorySchema } from './schema';

type Args = {
  role: 'plaintiff' | 'defendant';
  category: LawyerCategorySchema;
  claimsPrompt: string;
  conversationsPrompt: string;
}
export const openingStatement = ({ role, category, claimsPrompt, conversationsPrompt }: Args ) => {
  const prompt = `
  You are the counsel representing the ${role}s.
  Craft a compelling opening statement for the trial, considering the following information:
  ## ${role}s' Allegations
  ${claimsPrompt}
  ## Court Conversations
  ${conversationsPrompt}
  Ensure your statement is persuasive, addresses key points raised by the ${role}s, and sets a strong tone for your client's defense.
  `;

  return runFlow(llmFlows[category], { prompt, history: [] });
};

export const provideEvidence = ({ role, category, claimsPrompt, conversationsPrompt }: Args) => {
  const prompt = `
  You are the counsel representing the ${role}s.
  Present the ${role}s' claims and provide evidence to support each claim based on the following court conversations.
  ## ${role}s' Allegations
  ${claimsPrompt}
  ## Court Conversations
  ${conversationsPrompt}
  Ensure your presentation is clear, concise, and effectively demonstrates the validity of the ${role}s' claims.
  `;

  return runFlow(llmFlows[category], { prompt, history: [] });
};
