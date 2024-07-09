"use client";
import { use, useState } from "react";
import style from "./style.module.scss";
import MessageBlock from "../MessageBlock";

export default function ChatRoom(props: Props) {
  const { messages, submit } = useChat();

  const [message, setMessage] = useState("");

  return (
    <div className={style.chatRoom}>
      <div className={style.messages}>
        {messages.map((message, index) => (
          <div key={index} className={style.message}>
            <MessageBlock
              isOwn={index % 2 === 0}
              user={{
                name: "User",
                thumbnailSrc: "https://picsum.photos/200",
              }}
            >
              {message}
            </MessageBlock>
          </div>
        ))}
      </div>
      <div className={style.form}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
        <button
          onClick={() => {
            submit(message);
            setMessage("");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function useChat(): { messages: string[]; submit: (message: string) => void } {
  const [messages, setMessages] = useState<string[]>([]);
  const submit = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  return {
    messages,
    submit,
  };
}
