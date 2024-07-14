import { getAdminConverter } from "@/app/resources/types/AdminFirestore";
import ChatRoom from "../components/ChatRoom";
import ChatRoomProvider from "../components/ChatRoomProvider";
import style from "./style.module.scss";
import { AdminFirestore } from "@/lib/firebaseAdmin";
import { Chat } from "@/app/resources/types/Firestore";

type Props = {
  params: {
    id: string;
  };
};

export default async function RoomPage(props: Props) {
  const initialMessages = await AdminFirestore.collection("chats")
    .withConverter(getAdminConverter<Chat>())
    .where("roomUserId", "==", "dummy")
    .orderBy("createdAt")
    .limitToLast(30)
    .get()
    .then((snapshot) => snapshot.docs.map((doc) => doc.data()));

  return (
    <ChatRoomProvider
      roomId={props.params.id}
      initialMessages={initialMessages}
    >
      <div className={style.roomPage}>
        <ChatRoom />
      </div>
    </ChatRoomProvider>
  );
}
