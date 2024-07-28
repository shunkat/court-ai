import { runFlow } from '@genkit-ai/flow';
import { judgeSuggestionFlow, judgeSummarizeFlow } from '.';

export const summarizeClaims = (plaintiffClaim: string, defendantClaim: string ) => {
  const prompt = `
  We are now commencing the trial. First, we will organize and confirm the claims from both the plaintiff and the defendant.
  ## Plaintiff's Claim
  ${plaintiffClaim}
  ## Defendant's Claim
  ${defendantClaim}
  Based on this information, organize and present the key points necessary for the progression of the trial.
  `;

  return runFlow(judgeSuggestionFlow, { prompt, history: [] });
};

export const extractIssues = async (conversationPrompt: string) => {
  const prompt = `
  Summarize the key issues of the case based on the following court conversations.
  ## Court Conversations
  ${conversationPrompt}
  Ensure the summary is concise and clear.
  `;
  return runFlow(judgeSuggestionFlow, { prompt, history: [] });
};

export const encourageLawyer = (to: 'plaintiff' | 'defendant', conversationPrompt: string) => {
  const prompt = `
  Review the court conversations and then prompt the ${to}s to present their questions and evidence in support of their claims.
  ## Court Conversations
  ${conversationPrompt}
  Ensure your instructions guide the ${to}s effectively to ask relevant questions and present necessary evidence.
  `;

  return runFlow(judgeSuggestionFlow, { prompt, history: [] });
};

export const finalJudgment = async (conversationPrompt: string) => {
  return runFlow(judgeSummarizeFlow, { conversation: conversationPrompt, history: [] });
};
