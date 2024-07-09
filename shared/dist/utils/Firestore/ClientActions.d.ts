import { DocumentSnapshot, QueryCompositeFilterConstraint, QueryConstraint, Unsubscribe } from "@firebase/firestore";
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
export declare function _getList<T = FirestoreModel>(collectionName: string, query?: QueryCompositeFilterConstraint | QueryConstraint[]): Promise<FirestoreResponse<T>[]>;
export declare function _listen<T = FirestoreModel>(id: string, collectionPath: string, onChange: (data: FirestoreResponse<T> | undefined) => void): Unsubscribe;
export type ListenListCallback<T> = ({ change, current, }: {
    change: FirestoreResponse<T>;
    current: FirestoreResponse<T>[];
}) => void;
export declare function _listenList<T = FirestoreModel>(collectionPath: string, onChange: ListenListCallback<T>, query?: QueryCompositeFilterConstraint | QueryConstraint[]): Unsubscribe;
export {};
