"use client";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";
import { Chat } from "@/app/resources/types/Firestore";
import {
  Timestamp,
  addDoc,
  collection,
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
  const [messages, setMessages] = useState<Chat[]>(props.initialMessages);

  useEffect(() => {
    const _query = query(
      collection(getFirestore(), "chats"),
      where("roomUserId", "==", "dummy"),
      where("createdAt", ">", Timestamp.now()),
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
  }, []);

  const submit = async (message: string) => {
    await addDoc(
      collection(getFirestore(), "chats").withConverter(
        getClientConverter<Chat>()
      ),
      {
        roomUserId: "dummy",
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

  return (
    <ChatRoomContext.Provider
      value={{ roomId: props.roomId, messages, submit }}
    >
      {props.children}
    </ChatRoomContext.Provider>
  );
}
