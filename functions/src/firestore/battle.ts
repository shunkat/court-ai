import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../config';
import { BattleSchema } from './schema';

export const addBattle = async (battle: BattleSchema) => {
  db.collection('battles').add({ ...battle, createdAt: FieldValue.serverTimestamp() });
};
