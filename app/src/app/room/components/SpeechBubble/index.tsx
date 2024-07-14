import style from "./style.module.scss";

type Props = {
  isOwn: boolean;
  children: React.ReactNode;
};

export default function SpeechBubble(props: Props) {
  return (
    <div
      className={`${style.speechBubble} ${
        props.isOwn ? style.own : style.opposite
      }`}
    >
      {props.children}
    </div>
  );
}
