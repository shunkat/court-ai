import SpeechBubble from "../SpeechBubble";
import Thumbnail from "../Thumbnail";
import style from "./style.module.scss";

type OwnProps = {
  isOwn: true;
  children: React.ReactNode;
};

type OppositeProps = {
  isOwn: false;
  user: {
    name: string;
    thumbnailSrc: string;
  };
  children: string;
};

type Props = OwnProps | OppositeProps;

export default function MessageBlock(props: Props) {
  return (
    <div
      className={`${style.messageBlock} ${
        props.isOwn ? style.own : style.opposite
      }`}
    >
      {!props.isOwn && (
        <div className={style.thumbnail}>
          <Thumbnail src={props.user.thumbnailSrc} name={props.user.name} />
        </div>
      )}
      <div className={style.speechBubble}>
        <SpeechBubble isOwn={props.isOwn}>{props.children}</SpeechBubble>
      </div>
    </div>
  );
}
