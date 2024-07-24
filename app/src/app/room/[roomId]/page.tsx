import ChatRoom from "../components/ChatRoom";
import ChatRoomProvider from "../components/ChatRoomProvider";
import style from "./style.module.scss";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function RoomPage(props: Props) {
  return (
    <ChatRoomProvider roomId={props.params.roomId} initialMessages={[]}>
      <div className={style.roomPage}>
        <ChatRoom />
      </div>
    </ChatRoomProvider>
  );
}
