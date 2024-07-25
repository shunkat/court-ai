"use client";
import { useEffect, useState } from "react";
import style from "./style.module.scss";
import ReactLoading from "react-loading";
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";
import { Battle } from "@/app/resources/types/Firestore";
import MessageBlock from "@/app/room/components/MessageBlock";

export default function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Battle["contents"]>([]);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    getDocs(
      query(
        collection(getFirestore(), "battles"),
        where("roomId", "==", roomId),
        limit(1)
      ).withConverter(getClientConverter<Battle>())
    ).then((querySnapshot) => {
      const data = querySnapshot.docs[0].data();
      data.contents.forEach((content, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, content]);
          if (i === data.contents.length - 1) setAllLoaded(true);
        }, 3000 * (i + 1));
      });
    });
  }, [roomId]);

  return (
    <div className={style.chatRoom}>
      <div className={style.messages}>
        {messages.map((message, mIndex) => (
          <div key={`${mIndex}_${mIndex}`} className={style.message}>
            <MessageBlock
              isOwn={
                message.role === "defendant" || message.role === "plaintiff"
              }
              user={{
                name: "User",
                thumbnailSrc: `/lawyers/${
                  // @ts-ignore
                  message.category ?? "intake"
                }.webp`,
              }}
            >
              {message.text}
            </MessageBlock>
          </div>
        ))}
        {!allLoaded && <ReactLoading type="bubbles" color="gray" height={50} />}
        {allLoaded && (
          <div className={style.allLoaded}>
            <div className={style.buttons}>
              <button className={style.summary}>Go Summary</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
