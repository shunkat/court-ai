import { DocumentReference } from "firebase-admin/firestore";
import { ListenListCallback } from "../../utils/Firestore/AdminActions";
type Ref<T> = DocumentReference<T>;
export declare namespace Admin {
    type User = {
        name: string;
    };
    type Department = {
        name: string;
    };
    type Lawyer = {
        name: string;
        departmentRef: Ref<Department>[];
    };
    type RoomStatus = "created" | "wip" | "judge" | "completed";
    type Room = {
        status: RoomStatus;
        judgeCount: 0 | 1 | 2 | 3;
        creatorRef: Ref<User>;
        oppositeRef: Ref<User>;
    };
    type TextMessage = {
        value: string;
    };
    type Message = {
        user: ({
            type: "user";
        } & Ref<User>) | ({
            type: "lawyer";
            for: Ref<User>;
        } & Ref<Lawyer>) | {
            type: "judge";
        };
        roomRef: Ref<Room>;
        content: TextMessage;
    };
    export function createUser(data: User): Promise<{
        id: string;
        snapshot: FirebaseFirestore.DocumentSnapshot<{
            name: string;
        }, FirebaseFirestore.DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: {
            name: string;
        };
    }>;
    export function getUser(id: string): Promise<{
        id: string;
        snapshot: FirebaseFirestore.DocumentSnapshot<User, FirebaseFirestore.DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: User;
    }>;
    export function createRoom(data: Room): Promise<{
        id: string;
        snapshot: FirebaseFirestore.DocumentSnapshot<{
            status: RoomStatus;
            judgeCount: 0 | 1 | 2 | 3;
            creatorRef: Ref<User>;
            oppositeRef: Ref<User>;
        }, FirebaseFirestore.DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: {
            status: RoomStatus;
            judgeCount: 0 | 1 | 2 | 3;
            creatorRef: Ref<User>;
            oppositeRef: Ref<User>;
        };
    }>;
    export function getRoom(id: string): Promise<{
        id: string;
        snapshot: FirebaseFirestore.DocumentSnapshot<Room, FirebaseFirestore.DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: Room;
    }>;
    export function createMessage(data: Message): Promise<void>;
    export function getMessage(id: string): Promise<{
        id: string;
        snapshot: FirebaseFirestore.DocumentSnapshot<Message, FirebaseFirestore.DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: Message;
    }>;
    export function listenMessages(roomId: string, onChange: ListenListCallback<Message>): () => void;
    export {};
}
export {};
