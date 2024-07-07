import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import googleAI from '@genkit-ai/googleai';

configureGenkit({
  plugins: [firebase(), googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export { lawyerSuggestionFlow } from './lawyer';
export { judgeSuggestionFlow } from './judge';
