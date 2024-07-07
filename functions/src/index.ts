import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2/options';

setGlobalOptions({ region: 'asia-northeast1' });
defineSecret('GOOGLE_GENAI_API_KEY');

export * from './models';
