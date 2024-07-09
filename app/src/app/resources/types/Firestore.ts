import * as Client from "firebase/firestore";
import * as Admin from "firebase-admin/firestore";

export type AppModel = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ClientResponse<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: Client.Timestamp;
  updatedAt: Client.Timestamp;
};

export type AdminResponse<T> = Omit<T, "createdAt" | "updatedAt"> & {
  createdAt: Admin.Timestamp;
  updatedAt: Admin.Timestamp;
};

export type Department = {
  name: string;
} & AppModel;

export type Lawyer = {
  name: string;
  departmentIds: string[];
} & AppModel;

export type User = {
  name: string;
} & AppModel;

export type RoomStatus = "created" | "wip" | "judge" | "completed";
export type Room = {
  status: RoomStatus;
  judgeCount: 0 | 1 | 2 | 3;
  creatorId: string;
  oppositeId: string;
} & AppModel;

export type TextMessage = {
  type: "text";
  value: string;
};

export type Message = {
  from:
    | {
        type: "user";
        id: string;
      }
    | {
        type: "lawyer";
        id: string;
        for: string;
      }
    | {
        type: "judge";
      };
  roomId: string;
  content: TextMessage;
} & AppModel;

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

type ClientConverter<T extends AppModel> = Client.FirestoreDataConverter<T>;
export function getClientConverter<T extends AppModel>(): ClientConverter<T> {
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
    fromFirestore(snapshot: Client.QueryDocumentSnapshot): T {
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
