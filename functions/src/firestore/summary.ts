import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { SummarySchema } from './schema';

export const addSummary = async (summary: SummarySchema) => {
  await db.collection('summaries').add({ ...summary, createdAt: FieldValue.serverTimestamp() });
};
