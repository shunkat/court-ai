import {
  DocumentSnapshot,
  FieldValue,
  QueryDocumentSnapshot,
  Timestamp,
  Transaction,
  getFirestore,
} from "firebase-admin/firestore";
import { Timestamp as ClientTimestamp } from "@firebase/firestore";
import { User } from "aws-cdk-lib/aws-iam";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

type FirestoreData<T> = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
} & T;

type FirestoreModel = User | Message;

type FirestoreResponse<T> = {
  id: string;
  snapshot: DocumentSnapshot<T>;
  createdAt: Date;
  updatedAt: Date;
} & { data: T };

const db = getFirestore();
export async function _create<T = FirestoreModel>(
  data: T,
  collection: string
): Promise<FirestoreResponse<T>> {
  db.doc(collection);
  const document = db.doc(collection);
  await db.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (snapshot.exists) throw new Error("Document already exists");

    transaction.set(document, {
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  const snapshot = (await document.get()) as QueryDocumentSnapshot<
    FirestoreData<T>
  >;

  const resData = snapshot.data();
  return {
    id: document.id,
    snapshot: snapshot,
    data: resData,
    createdAt: resData.createdAt.toDate(),
    updatedAt: resData.updatedAt.toDate(),
  };
}

export async function _update<T = FirestoreModel>(
  data: { id: string } & T,
  collection: string
): Promise<FirestoreResponse<T>> {
  const document = db.doc(`${collection}/${data.id}`);
  await db.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (!snapshot.exists) throw new Error("Document not exists");

    transaction.set(document, {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  const snapshot = (await document.get()) as QueryDocumentSnapshot<
    FirestoreData<T>
  >;

  const resData = snapshot.data();
  return {
    id: document.id,
    snapshot: snapshot,
    data: resData,
    createdAt: resData.createdAt.toDate(),
    updatedAt: resData.updatedAt.toDate(),
  };
}

export async function _delete(id: string, collection: string) {
  const document = db.doc(`${collection}/${id}`);
  await db.runTransaction(async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (!snapshot.exists) throw new Error("Document not exists");

    transaction.delete(document);
  });
}

export async function _get<T = FirestoreModel>(id: string, collection: string) {
  const document = db.doc(`${collection}/${id}`);
  const snapshot = (await document.get()) as QueryDocumentSnapshot<
    FirestoreData<T>
  >;
  const data = snapshot.data();

  return {
    id: document.id,
    snapshot: snapshot,
    data: data,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  } as FirestoreResponse<T>;
}

export async function _getList<T = FirestoreModel>(
  query: FirebaseFirestore.Query
) {
  const snapshot = await query.get();

  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      snapshot: doc,
      data: doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    };
  }) as FirestoreResponse<T>[];
}

export function _listen<T = FirestoreModel>(
  id: string,
  collectionPath: string,
  onChange: (data: FirestoreResponse<T> | undefined) => void
): void {
  const document = db.doc(`${collectionPath}/${id}`);
  document.onSnapshot((snapshot) => {
    if (!snapshot.exists) {
      return undefined;
    }

    onChange({
      id: snapshot.id,
      snapshot: snapshot,
      data: snapshot.data(),
      createdAt: snapshot.data()!.createdAt.toDate(),
      updatedAt: snapshot.data()!.updatedAt.toDate(),
    } as FirestoreResponse<T>);
  });
}

export type ListenListCallback<T> = ({
  change,
  current,
}: {
  change: FirestoreResponse<T>;
  current: FirestoreResponse<T>[];
}) => void;
export function _listenList<T = FirestoreModel>(
  query: FirebaseFirestore.Query,
  onChange: ListenListCallback<T>
) {
  return query.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((_change) => {
      const change = {
        id: _change.doc.id,
        snapshot: _change.doc,
        data: _change.doc.data(),
        createdAt: _change.doc.data().createdAt.toDate(),
        updatedAt: _change.doc.data().updatedAt.toDate(),
      } as FirestoreResponse<T>;
      const docs = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          snapshot: doc,
          data: doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        };
      }) as FirestoreResponse<T>[];
      onChange({ change: change, current: docs });
    });
  });
}
