import style from "./style.module.scss";
import ReactMarkdown from "react-markdown";

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
      <ReactMarkdown>{props.children as string}</ReactMarkdown>
    </div>
  );
}
