"use client";
import { useState } from "react";
import style from "./style.module.scss";
import MessageBlock from "../MessageBlock";
import { useChatRoom } from "../ChatRoomProvider";
import ReactLoading from "react-loading";

export default function ChatRoom() {
  const [input, setInput] = useState("");
  const { messages, submit } = useChatRoom();

  const shouldWait = messages[messages.length - 1]?.role === "user";

  return (
    <div className={style.chatRoom}>
      <div className={style.messages}>
        {messages.map((message, mIndex) =>
          message.content.map((content, cIndex) => (
            <div key={`${mIndex}_${cIndex}`} className={style.message}>
              <MessageBlock
                isOwn={message.role === "user"}
                user={{
                  name: "User",
                  thumbnailSrc: `/lawyers/${
                    // @ts-ignore
                    message.category ?? "intake"
                  }.webp`,
                }}
              >
                {content.text}
              </MessageBlock>
            </div>
          ))
        )}
        {shouldWait && <ReactLoading type="bubbles" color="gray" height={50} />}
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
          disabled={shouldWait || !input}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
