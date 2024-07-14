import ChatRoom from "../components/ChatRoom";
import style from "./style.module.scss";

type Props = {
  params: {
    id: string;
  };
};

export default function RoomPage(props: Props) {
  return (
    <div className={style.roomPage}>
      <ChatRoom params={props.params} />
    </div>
  );
}
