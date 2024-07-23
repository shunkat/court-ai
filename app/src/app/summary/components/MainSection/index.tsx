import { JudgmentSummary } from "@/app/resources/types/Firestore";
import style from "./style.module.scss";

interface CaseSummaryProps {
  summaryData: JudgmentSummary;
}

const MainSection: React.FC<CaseSummaryProps> = ({ summaryData }) => {
  return (
    <div className={style.mainSentence}>
        {summaryData.mainSentence}
    </div>);
};

export default MainSection;
