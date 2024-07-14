import * as Admin from "firebase-admin/firestore";
import { AppModel } from "./Firestore";

export type AdminResponse<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: Admin.Timestamp;
  updatedAt: Admin.Timestamp;
};

type AdminConverter<T extends AppModel> = Admin.FirestoreDataConverter<T>;
export function getAdminConverter<T extends AppModel>(): AdminConverter<T> {
  return {
    toFirestore(model: T): Admin.DocumentData {
      const { id, ...data } = model;
      return {
        ...data,
        createdAt:
          Admin.Timestamp.fromDate(model.createdAt) ??
          Admin.FieldValue.serverTimestamp(),
        updatedAt: Admin.FieldValue.serverTimestamp(),
      };
    },
    fromFirestore(snapshot: Admin.QueryDocumentSnapshot): T {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as T;
    },
  };
}
