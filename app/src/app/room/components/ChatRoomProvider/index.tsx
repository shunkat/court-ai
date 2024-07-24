"use client";
import { useAuth } from "@/app/_components/firebase/AuthProvider";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";
import { Chat, Room, RoomUser } from "@/app/resources/types/Firestore";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface ChatRoomContextType {
  roomId: string;
  room: Room;
  roomUser: RoomUser;
  messages: Chat[];
  submit: (message: string) => void;
}

const ChatRoomContext = createContext<ChatRoomContextType | undefined>(
  undefined
);

export function useChatRoom() {
  const context = useContext(ChatRoomContext);
  if (!context) {
    throw new Error("useLiff must be used within a LiffProvider");
  }

  return context;
}

export default function ChatRoomProvider(props: {
  roomId: string;
  initialMessages: Chat[];
  children: React.ReactNode;
}) {
  const { authUser } = useAuth();
  const [messages, setMessages] = useState<Chat[]>(props.initialMessages);
  const [room, setRoom] = useState<Room>();
  const [roomUser, setRoomUser] = useState<RoomUser>();

  useEffect(() => {
    if (!roomUser) return;
    if (!roomUser.id) return;
    const _query = query(
      collection(getFirestore(), "chats"),
      where("roomUserId", "==", roomUser.id),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(_query, (snapshot) => {
      const newMessages: Chat[] = [];
      snapshot.forEach((doc) => {
        newMessages.push(doc.data() as Chat);
      });
      setMessages([...messages, ...newMessages]);
    });

    return () => {
      unsubscribe();
    };
  }, [roomUser]);

  useEffect(() => {
    getDoc(
      doc(getFirestore(), `rooms/${props.roomId}`).withConverter(
        getClientConverter<Room>()
      )
    ).then((snapshot) => {
      setRoom(snapshot.data() as Room);
    });
  }, [props.roomId]);

  useEffect(() => {
    if (!authUser) return;
    console.log("authUser", authUser);
    console.log("props.roomId", props.roomId);
    const _query = query(
      collection(getFirestore(), "room_users"),
      where("roomId", "==", props.roomId),
      where("userId", "==", authUser?.uid)
    ).withConverter(getClientConverter<RoomUser>());
    getDocs(_query).then((snapshot) => {
      setRoomUser(snapshot.docs[0].data());
    });
  }, [props.roomId, authUser]);

  const submit = async (message: string) => {
    await addDoc(
      collection(getFirestore(), "chats").withConverter(
        getClientConverter<Chat>()
      ),
      {
        roomUserId: roomUser?.id,
        roomId: props.roomId,
        role: "user",
        content: [
          {
            text: message,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Chat
    );
  };

  return authUser && room && roomUser ? (
    <ChatRoomContext.Provider
      value={{
        messages,
        submit,
        roomId: props.roomId,
        room: room,
        roomUser: roomUser,
      }}
    >
      {props.children}
    </ChatRoomContext.Provider>
  ) : (
    <></>
  );
}
