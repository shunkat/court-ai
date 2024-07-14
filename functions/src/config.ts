import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import googleAI from '@genkit-ai/googleai';

const googleGenaiApiKey = defineSecret('GOOGLE_GENAI_API_KEY');
setGlobalOptions({ region: 'us-west2', secrets: [googleGenaiApiKey], timeoutSeconds: 540 });

initializeApp();
export const db = getFirestore();

configureGenkit({
  plugins: [firebase(), googleAI()],
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableTracingAndMetrics: true,
});
