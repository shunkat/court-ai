import { defineSecret, defineString } from 'firebase-functions/params';

export const appUrl = defineString('APP_URL', {
  default: 'http://localhost:3000',
});
export const googleGenaiApiKey = defineSecret('GOOGLE_GENAI_API_KEY');
export const resendApiKey = defineSecret('RESEND_API_KEY');
