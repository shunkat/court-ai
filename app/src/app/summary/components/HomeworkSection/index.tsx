import { JudgmentSummary } from "@/app/resources/types/Firestore";
import check from "public/check.png";
import style from "./style.module.scss"; // スタイルを別ファイルで定義


interface HomeworkSectionProps {
  summaryData: JudgmentSummary;
}

const HomeworkSection: React.FC<HomeworkSectionProps> = ({ summaryData }) => {
  return (
    
    <div className={style.homeworkSection}>
      
      <h2>Next Steps</h2>
      <p>{summaryData.futureDevelopments}</p>

      <div className={style.homeworkContainer}>
        <div className={style.homeworkGroup}>
        <h3>Party A</h3>
          <ul>
            {summaryData.homeworks.plaintiff.map((item, index) => (
              <li key={index}>
                <img src={check.src} alt="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={style.homeworkGroup}>
          <h3>Party B</h3>
          <ul>
            {summaryData.homeworks.defendant.map((item, index) => (
              <li key={index}>
                <img src={check.src} alt="check" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
};

export default HomeworkSection;
