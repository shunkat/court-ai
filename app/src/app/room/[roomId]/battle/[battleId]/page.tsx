import JudgeChatRoom from "./components/JudgeChatRoom";
import style from "./style.module.scss";

type Props = {
  params: {
    roomId: string;
    battleId: string;
  };
};

export default async function JudgeRoomPage(props: Props) {
  return (
    <div className={style.roomPage}>
      <JudgeChatRoom
        roomId={props.params.roomId}
        battleId={props.params.battleId}
      />
    </div>
  );
}
