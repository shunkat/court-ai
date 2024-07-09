import ChatRoom from "../components/ChatRoom";
import ChatRoomProvider from "../components/ChatRoomProvider";
import style from "./style.module.scss";
import { Message, getAdminConverter } from "@/app/resources/types/Firestore";
import { AdminFirestore } from "@/lib/firebaseAdmin";

type Props = {
  params: {
    id: string;
  };
};

export default async function RoomPage(props: Props) {
  const initialMessages = await AdminFirestore.collection("messages")
    .withConverter(getAdminConverter<Message>())
    .where("roomId", "==", props.params.id)
    .limit(30)
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
