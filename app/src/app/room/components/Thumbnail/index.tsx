import AppImage from "@/app/components/AppImage";
import style from "./style.module.scss";

type Props = {
  src: string;
  name: string;
};

export default function Thumbnail(props: Props) {
  return (
    <div className={style.thumbnail}>
      <AppImage src={props.src} alt={props.name} height={120} width={120} />
    </div>
  );
}
