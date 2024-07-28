"use client";
import { useEffect, useState } from "react";
import style from "./style.module.scss";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/firebase/AuthProvider";
import GoogleLoginButton from "@/app/_components/GoogleLoginButton";
import CopyImage from "./copy.png";
import Image from "next/image";
import { Room, RoomUser } from "@/app/resources/types/Firestore";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";

export default function RoomBuildForm() {
  const router = useRouter();
  const { authUser } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const [sharedUrl, setSharedUrl] = useState("");

  useEffect(() => {
    setSharedUrl(`${window.location.origin}/room/${roomId}/invite`);
  }, [roomId]);

  return (
    <div className={`${style.roomBuildForm} ${authUser ? "" : style.disable}`}>
      <div className={`${style.content}`}>
        {roomId ? (
          <>
            <div className={style.share}>
              <label>Share the URL to Opposite.</label>
              <div
                className={style.share_copy}
                onClick={() => {
                  navigator.clipboard.writeText(sharedUrl);
                  setIsCopied(true);
                  window.alert("Copied!");
                }}
              >
                <span className={style.share_copy_text}>{sharedUrl}</span>
                <div className={style.share_copy_image}>
                  <Image src={CopyImage} alt="Copy" />
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                router.push(`/room/${roomId}`);
              }}
              disabled={!isCopied}
            >
              Go to Room
            </button>
          </>
        ) : (
          <>
            <div className={style.item}>
              <label>Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.currentTarget.value)}
              />
            </div>
            <div className={style.item}>
              <label>Nick Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
              />
            </div>
            <button
              onClick={async () => {
                submit(roomName, authUser?.uid ?? "", userName).then(
                  (roomId) => {
                    setRoomId(roomId);
                  }
                );
              }}
            >
              Create Room
            </button>
          </>
        )}
      </div>
      <div className={style.authOverlay}>
        Please Sign In Before Use
        <div className={style.loginButton}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}

async function submit(roomName: string, userId: string, userName: string) {
  const batch = writeBatch(getFirestore());
  const roomRef = doc(collection(getFirestore(), "rooms"));
  const roomUserRef = doc(collection(getFirestore(), "room_users"));
  batch.set(roomRef, {
    name: roomName,
    status: "created",
    judgeCount: 0,
    creatorId: roomUserRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  batch.set(roomUserRef, {
    name: userName,
    userId: userId,
    roomId: roomRef.id,
    claimStatus: "shortage",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return roomRef.id;
}
