import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';

// read
export const firestoreTimestampSchema = z.instanceof(Timestamp);
// write
export const firestoreFieldValueSchema = z.custom((data) => data instanceof FieldValue);

// read and write
export const firestoreTimestampLooseSchema = z.union([
  firestoreFieldValueSchema,
  firestoreTimestampSchema,
]);
