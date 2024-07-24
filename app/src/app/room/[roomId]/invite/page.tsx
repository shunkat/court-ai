"use client";
import HomeLayout from "@/app/_components/HomeLayout";
import { Room } from "@/app/resources/types/Firestore";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import RoomInviteForm from "./_components/RoomInviteForm";

type Props = {
  params: {
    roomId: string;
  };
};

export default function RoomInvitePage(props: Props) {
  const { roomId } = props.params;

  return (
    <HomeLayout>
      <RoomInviteForm roomId={roomId} />
    </HomeLayout>
  );
}
