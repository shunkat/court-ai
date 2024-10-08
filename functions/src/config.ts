import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import googleAI from '@genkit-ai/googleai';
import { googleGenaiApiKey, resendApiKey } from './env';

setGlobalOptions({
  region: 'us-west2',
  secrets: [googleGenaiApiKey, resendApiKey],
  timeoutSeconds: 540,
  maxInstances: 5,
});

initializeApp();
export const db = getFirestore();

configureGenkit({
  plugins: [firebase(), googleAI()],
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableTracingAndMetrics: true,
});
