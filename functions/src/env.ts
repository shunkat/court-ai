import { defineSecret, defineString } from 'firebase-functions/params';

export const appUrl = defineString('APP_URL');
export const googleGenaiApiKey = defineSecret('GOOGLE_GENAI_API_KEY');
export const resendApiKey = defineSecret('RESEND_API_KEY');
