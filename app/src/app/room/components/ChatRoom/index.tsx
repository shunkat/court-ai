"use client";
import { useState } from "react";
import style from "./style.module.scss";
import MessageBlock from "../MessageBlock";
import { useChatRoom } from "../ChatRoomProvider";

export default function ChatRoom() {
  const [input, setInput] = useState("");
  const { messages, submit } = useChatRoom();

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
              {message.content.value}
            </MessageBlock>
          </div>
        ))}
      </div>
      <div className={style.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          onClick={() => {
            submit(input);
            setInput("");
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
