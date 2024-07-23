import { JudgmentSummary } from "@/app/resources/types/Firestore";
import snsWhite from "public/snsWhite.png";
import style from "./style.module.scss"; // スタイルを別ファイルで定義

interface ActionButtonsProps {
  summaryData: JudgmentSummary;
}

const SNSShareButtonSection: React.FC<ActionButtonsProps> = ({ summaryData }) => {
  return (
    <div className={style.shareButtonContainer}>
      <button className={style.shareButton}>share this result<img src={snsWhite.src}/></button>
    </div>
  );
};

export default SNSShareButtonSection;
