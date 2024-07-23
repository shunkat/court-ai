import { JudgmentSummary } from "@/app/resources/types/Firestore";

import check from "public/check.png";
import styles from "./style.module.scss";

interface Props {
  summaryData: JudgmentSummary;
}

const ReasonSection: React.FC<Props> = ({ summaryData }) => {
  return (
    <div className={styles.reasonSection}>
      <ul className={styles.reasonContainer}>
        <h3>Reason: {summaryData.judgeReasons.reasonTitle}</h3>
        <ul>
            {summaryData.judgeReasons.reasonDetail.map((detail, index) => (
            
            <li key={index}>
              <img src={check.src} alt="check" />
              {detail}
            </li>
            ))}
        </ul>
      </ul>
    </div>
  );
};

export default ReasonSection;
