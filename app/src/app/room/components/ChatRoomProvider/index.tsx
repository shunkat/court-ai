import { Message } from "@/app/resources/types/Firestore";
import * as Admin from "firebase-admin/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface ChatRoomContextType {
  roomId: string;
  messages: Message[];
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
  initialMessages: Message[];
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Message[]>(props.initialMessages);

  useEffect(() => {
    const _query = query(
      collection(getFirestore(), "messages"),
      where("roomId", "==", props.roomId),
      where("createdAt", ">", Timestamp.now()),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(_query, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
      });
      setMessages(messages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const submit = async (message: string) => {
    await addDoc(collection(getFirestore(), "messages"), {
      from: {
        type: "user",
        id: "user1",
      },
      roomId: props.roomId,
      content: {
        type: "text",
        value: message,
      },
      createdAt: Admin.FieldValue.serverTimestamp(),
      updatedAt: Admin.FieldValue.serverTimestamp(),
    });
  };

  return (
    <ChatRoomContext.Provider
      value={{ roomId: props.roomId, messages, submit }}
    >
      {props.children}
    </ChatRoomContext.Provider>
  );
}
