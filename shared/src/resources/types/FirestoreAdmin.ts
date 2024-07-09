import { DocumentReference, getFirestore } from "firebase-admin/firestore";
import {
  ListenListCallback,
  _create,
  _get,
  _listenList,
} from "../../utils/Firestore/AdminActions";

type Ref<T> = DocumentReference<T>;

export namespace Admin {
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
    user:
      | ({ type: "user" } & Ref<User>)
      | ({ type: "lawyer"; for: Ref<User> } & Ref<Lawyer>)
      | { type: "judge" };
    roomRef: Ref<Room>;
    content: TextMessage;
  };

  const COLLECTIONS = {
    User: "user",
    Message: "message",
    Room: "room",
  };

  export async function createUser(data: User) {
    const { name } = data;
    return await _create({ name }, COLLECTIONS.User);
  }

  export async function getUser(id: string) {
    return _get<User>(id, COLLECTIONS.User);
  }

  export async function createRoom(data: Room) {
    const { status, judgeCount, creatorRef, oppositeRef } = data;
    return await _create(
      {
        status,
        judgeCount,
        creatorRef,
        oppositeRef,
      },
      COLLECTIONS.Room
    );
  }

  export async function getRoom(id: string) {
    return _get<Room>(id, COLLECTIONS.Room);
  }

  export async function createMessage(data: Message) {
    const { user, roomRef, content } = data;
    const res = await _create(
      {
        user,
        roomRef,
        content,
      },
      COLLECTIONS.Message
    );
  }

  export async function getMessage(id: string) {
    return _get<Message>(id, COLLECTIONS.Message);
  }

  export function listenMessages(
    roomId: string,
    onChange: ListenListCallback<Message>
  ) {
    const roomRef = getFirestore().doc(`${COLLECTIONS.Room}/${roomId}`);
    return _listenList<Message>(
      getFirestore()
        .collection(COLLECTIONS.Message)
        .where("roomRef", "==", roomRef),
      ({ change, current }) => {
        onChange({ change, current });
      }
    );
  }
}
