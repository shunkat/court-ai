"use client";
import { useEffect, useState } from "react";
import style from "./style.module.scss";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/firebase/AuthProvider";
import GoogleLoginButton from "@/app/_components/GoogleLoginButton";
import { Room, RoomUser } from "@/app/resources/types/Firestore";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";

type Props = {
  roomId: string;
};
export default function RoomInviteForm(props: Props) {
  const router = useRouter();
  const { authUser } = useAuth();
  const [userName, setUserName] = useState("");

  const [room, setRoom] = useState<Room>();
  const [roomCreator, setRoomCreator] = useState<RoomUser>();

  useEffect(() => {
    if (!props.roomId) return;
    const fetchRoom = async () => {
      const res = await getDoc(
        doc(getFirestore(), `rooms/${props.roomId}`).withConverter(
          getClientConverter<Room>()
        )
      );
      return res.data();
    };
    const fetchRoomCreator = async (creatorId: string) => {
      const res = await getDoc(
        doc(getFirestore(), `room_users/${creatorId}`).withConverter(
          getClientConverter<RoomUser>()
        )
      );
      return res.data();
    };

    const fetchData = async () => {
      const room = await fetchRoom();
      if (!room) return;
      const creator = await fetchRoomCreator(room.creatorId);

      setRoom(room);
      setRoomCreator(creator);
    };
    fetchData();
  }, [props.roomId]);

  if (!room) return "loading...";

  return (
    <div className={`${style.roomBuildForm} ${authUser ? "" : style.disable}`}>
      <div className={`${style.content}`}>
        {authUser?.uid === roomCreator?.userId ? (
          <>
            <div className={style.error}>
              <p>Creator cannot join as Opposite</p>
              <p>Please Share this page to other.</p>
            </div>
            <button>Go to Room</button>
          </>
        ) : (
          <>
            <div className={style.item}>
              <label>Room Name</label>
              <input type="text" value={room?.name} readOnly />
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
                await submit(props.roomId, userName, authUser!.uid);
                router.push(`/room/${props.roomId}`);
              }}
            >
              Go to Room
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

async function submit(roomId: string, userName: string, userId: string) {
  const batch = writeBatch(getFirestore());
  const roomRef = doc(collection(getFirestore(), "rooms"), roomId);
  const roomUserRef = doc(collection(getFirestore(), "room_users"));
  batch.set(
    roomRef,
    {
      oppositeId: roomUserRef.id,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
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
