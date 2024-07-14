"use client";
import { useState } from "react";
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
import GoogleLoginButton from "../GoogleLoginButton";

export default function RoomBuildForm() {
  const router = useRouter();
  const { authUser } = useAuth();
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <div className={`${style.roomBuildForm} ${authUser ? "" : style.disable}`}>
      <div className={`${style.content}`}>
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
            submit(roomName, authUser?.uid ?? "", userName).then((roomId) => {
              router.push(`/room/${roomId}`);
            });
          }}
        >
          Submit
        </button>
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
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();

  return roomRef.id;
}
