import ChatRoom from "../../components/ChatRoom";
import ChatRoomProvider from "../../components/ChatRoomProvider";
import JudgeChatRoom from "./components/JudgeChatRoom";
import style from "./style.module.scss";

type Props = {
  params: {
    roomId: string;
  };
};

export default async function JudgeRoomPage(props: Props) {
  return (
    <div className={style.roomPage}>
      <JudgeChatRoom roomId={props.params.roomId} />
    </div>
  );
}
