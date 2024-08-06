import { getAdminConverter } from "@/app/resources/types/AdminFirestore";
import { AdminFirestore } from "@/lib/firebaseAdmin";
import { JudgmentSummary } from "@/app/resources/types/Firestore";

import MainSection from "../components/MainSection";
import ReasonSection from "../components/ReasonSection";
import HomeworkSection from "../components/HomeworkSection";
import SNSShareButtonSection from "../components/SNSShareButtonSection";
import style from "./style.module.scss";

type Props = {
  params: {
    id: string;
  };
};

export default async function SummaryPage(props: Props) {
  const roomId = props.params.id;

  const summaryData = await AdminFirestore.collection("summaries")
  .where("roomId", "==", roomId) // Query based on roomId field
  .withConverter(getAdminConverter<JudgmentSummary>())
  .get()
  .then((snapshot) => {
    if (snapshot.empty) {
      // Handle the case where no matching documents are found
      return null; // or throw an error, etc.
    } else {
      return snapshot.docs[0].data(); // Return the data of the first matching document
    }
  });

  if (!summaryData) {
    // 裁判データが見つからない場合のエラー処理
    throw new Error("Case data not found");
  }


  return (
    <div className={style.summaryPage}>
      <div className={style.container}>
        <MainSection summaryData={summaryData} />
        <ReasonSection summaryData={summaryData} />
        <HomeworkSection summaryData={summaryData} />
        <SNSShareButtonSection summaryData={summaryData} />
      </div>
    </div>
  );
}
