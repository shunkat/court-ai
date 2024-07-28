"use client";
import { useState } from "react";
import style from "./style.module.scss";
import MessageBlock from "../MessageBlock";
import { useChatRoom } from "../ChatRoomProvider";
import ReactLoading from "react-loading";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { RoomUser } from "@/app/resources/types/Firestore";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";

export default function ChatRoom() {
  const [input, setInput] = useState("");
  const { messages, submit, roomId, roomUser, room } = useChatRoom();

  const shouldWait = messages[messages.length - 1]?.role === "user";
  const canFinish = roomUser.claimStatus === "sufficient";

  const finishChat = async () => {
    await setDoc(
      doc(getFirestore(), `room_users/${roomUser.id}`).withConverter(
        getClientConverter<RoomUser>()
      ),
      {
        claimStatus: "finished",
      },
      { merge: true }
    );
    return;
  };
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
        {canFinish && (
          <div className={style.canFinish}>
            <div className={style.buttons}>
              <button className={style.startJudge} onClick={finishChat}>
                Start Judge
              </button>
              <button className={style.continueChat}>Continute Chat</button>
            </div>
            <div className={style.description}>
              You cannot add more messages until the judge will be completed.
            </div>
          </div>
        )}
        {roomUser.claimStatus === "finished" && room.status === "created" ? (
          <div className={style.notify}>
            Please wait until Judge will be prepared.
            <br /> We notify you when the judge is ready by Email.
          </div>
        ) : (
          <></>
        )}
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
          disabled={shouldWait || !input || roomUser.claimStatus === "finished"}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
