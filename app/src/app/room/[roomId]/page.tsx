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
    <ChatRoomProvider
      roomId={props.params.roomId}
      initialMessages={[
        {
          id: "",
          role: "model",
          content: [
            {
              text: "Hello, my name is john.",
            },
          ],
          roomId: "",
          roomUserId: "",
          createdAt: new Date("1999-12-31T23:59:59.999Z"),
          updatedAt: new Date("1999-12-31T23:59:59.999Z"),
        },
      ]}
    >
      <div className={style.roomPage}>
        <ChatRoom />
      </div>
    </ChatRoomProvider>
  );
}
