import { Unsubscribe, DocumentReference } from "@firebase/firestore";
import { ListenListCallback } from "../../utils/Firestore/ClientActions";
export declare namespace Client {
    type Ref<T> = DocumentReference<T>;
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
    export function createUser(data: User): Promise<void>;
    export function getUser(id: string): Promise<{
        id: string;
        snapshot: import("@firebase/firestore").DocumentSnapshot<User, import("@firebase/firestore").DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: User;
    }>;
    export function createRoom(data: Room): Promise<void>;
    export function getRoom(id: string): Promise<{
        id: string;
        snapshot: import("@firebase/firestore").DocumentSnapshot<Room, import("@firebase/firestore").DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: Room;
    }>;
    export function createMessage(data: Message): Promise<void>;
    export function getMessage(id: string): Promise<{
        id: string;
        snapshot: import("@firebase/firestore").DocumentSnapshot<Message, import("@firebase/firestore").DocumentData>;
        createdAt: Date;
        updatedAt: Date;
    } & {
        data: Message;
    }>;
    export function listenMessages(roomId: string, startUpdatedAt: Date, onChange: ListenListCallback<Message>): Unsubscribe;
    export {};
}
