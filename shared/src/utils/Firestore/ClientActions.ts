import {
  Timestamp,
  DocumentSnapshot,
  doc,
  getFirestore,
  runTransaction,
  Transaction,
  serverTimestamp,
  getDoc,
  QueryDocumentSnapshot,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  collection,
  getDocs,
  query as firestoreQuery,
  Unsubscribe,
  onSnapshot,
} from "@firebase/firestore";
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

export async function _create<T = FirestoreModel>(
  data: T,
  collection: string
): Promise<FirestoreResponse<T>> {
  const document = doc(getFirestore(), collection);
  await runTransaction(getFirestore(), async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (snapshot.exists()) throw new Error("Document already exists");

    transaction.set(document, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  const snapshot = (await getDoc(document)) as QueryDocumentSnapshot<
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
  const document = doc(getFirestore(), collection, data.id);
  await runTransaction(getFirestore(), async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (!snapshot.exists()) throw new Error("Document not exists");

    transaction.set(document, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  });

  const snapshot = (await getDoc(document)) as QueryDocumentSnapshot<
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
  const document = doc(getFirestore(), collection, id);
  await runTransaction(getFirestore(), async (transaction: Transaction) => {
    const snapshot = await transaction.get(document);
    if (!snapshot.exists()) throw new Error("Document not exists");

    transaction.delete(document);
  });
}

export async function _get<T = FirestoreModel>(id: string, collection: string) {
  const document = doc(getFirestore(), collection, id);
  const snapshot = (await getDoc(document)) as QueryDocumentSnapshot<
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
  collectionName: string,
  query?: QueryCompositeFilterConstraint | QueryConstraint[]
) {
  let _query;
  if (query) {
    if (Array.isArray(query)) {
      _query = firestoreQuery(
        collection(getFirestore(), collectionName),
        ...query
      );
    } else {
      _query = firestoreQuery(
        collection(getFirestore(), collectionName),
        query
      );
    }
  } else {
    _query = collection(getFirestore(), collectionName);
  }

  const snapshot = await getDocs(_query);

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
): Unsubscribe {
  const document = doc(getFirestore(), collectionPath, id);
  return onSnapshot(document, (snapshot) => {
    if (!snapshot.exists()) {
      return undefined;
    }
    onChange({
      id: snapshot.id,
      snapshot: snapshot,
      data: snapshot.data(),
      createdAt: snapshot.data().createdAt.toDate(),
      updatedAt: snapshot.data().updatedAt.toDate(),
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
  collectionPath: string,
  onChange: ListenListCallback<T>,
  query?: QueryCompositeFilterConstraint | QueryConstraint[]
): Unsubscribe {
  const col = collection(getFirestore(), collectionPath);
  let _query;

  if (query) {
    if (Array.isArray(query)) {
      _query = firestoreQuery(col, ...query);
    } else {
      _query = firestoreQuery(col, query);
    }
  } else {
    _query = collection(getFirestore(), collectionPath);
  }

  return onSnapshot(_query, (snapshot) => {
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
