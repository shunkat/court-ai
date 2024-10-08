import * as Client from "firebase/firestore";
import { AppModel } from "./Firestore";

export type ClientResponse<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: Client.Timestamp;
  updatedAt: Client.Timestamp;
};

type ClientConverter<T extends Partial<AppModel>> =
  Client.FirestoreDataConverter<T>;
export function getClientConverter<T extends AppModel>(): ClientConverter<T> {
  return {
    toFirestore(model: Client.PartialWithFieldValue<T>): Client.DocumentData {
      const { id, ...data } = model;
      return {
        ...data,
        createdAt: model.createdAt ? model.createdAt : Client.serverTimestamp(),
        updatedAt: Client.serverTimestamp(),
      };
    },
    fromFirestore(snapshot: Client.QueryDocumentSnapshot): Required<T> {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Required<T>;
    },
  };
}
