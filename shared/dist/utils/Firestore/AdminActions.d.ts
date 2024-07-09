import { DocumentSnapshot } from "firebase-admin/firestore";
import { User } from "aws-cdk-lib/aws-iam";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
type FirestoreModel = User | Message;
type FirestoreResponse<T> = {
    id: string;
    snapshot: DocumentSnapshot<T>;
    createdAt: Date;
    updatedAt: Date;
} & {
    data: T;
};
export declare function _create<T = FirestoreModel>(data: T, collection: string): Promise<FirestoreResponse<T>>;
export declare function _update<T = FirestoreModel>(data: {
    id: string;
} & T, collection: string): Promise<FirestoreResponse<T>>;
export declare function _delete(id: string, collection: string): Promise<void>;
export declare function _get<T = FirestoreModel>(id: string, collection: string): Promise<FirestoreResponse<T>>;
export declare function _getList<T = FirestoreModel>(query: FirebaseFirestore.Query): Promise<FirestoreResponse<T>[]>;
export declare function _listen<T = FirestoreModel>(id: string, collectionPath: string, onChange: (data: FirestoreResponse<T> | undefined) => void): void;
export type ListenListCallback<T> = ({ change, current, }: {
    change: FirestoreResponse<T>;
    current: FirestoreResponse<T>[];
}) => void;
export declare function _listenList<T = FirestoreModel>(query: FirebaseFirestore.Query, onChange: ListenListCallback<T>): () => void;
export {};
