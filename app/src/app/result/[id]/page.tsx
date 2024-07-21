import { getAdminConverter } from "@/app/resources/types/AdminFirestore";
import { AdminFirestore } from "@/lib/firebaseAdmin";
import { Chat } from "@/app/resources/types/Firestore";
import ResultProvider from "../components/ResultProvider";
// import CaseSummary from "../components/CaseSummary";
// import HomeworkSection from "../components/HomeworkSection";
// import ActionButtons from "../components/ActionButtons";
import style from "./style.module.scss";

type Props = {
  params: {
    id: string;
  };
};

export default async function ResultPage(props: Props) {
//   const roomId = props.params.id;

//   // Firestore から裁判データを取得
//   const caseData = await AdminFirestore.collection("cases") // "cases"コレクションを想定
//     .doc(roomId)
//     .withConverter(getAdminConverter<CaseData>()) // CaseData型を定義
//     .get()
//     .then((doc) => doc.data());

//   if (!caseData) {
//     // 裁判データが見つからない場合のエラー処理
//     throw new Error("Case data not found");
//   }

//   // チャットの初期メッセージを取得
//   const initialMessages = await AdminFirestore.collection("chats")
//     .withConverter(getAdminConverter<Chat>())
//     .where("roomId", "==", roomId)
//     .orderBy("createdAt")
//     .limitToLast(30)
//     .get()
//     .then((snapshot) => snapshot.docs.map((doc) => doc.data()));

//   return (
//     <ResultProvider roomId={roomId}>
//       <div>
//         <CaseSummary caseData={caseData} />
//         <HomeworkSection caseData={caseData} />
//         <ActionButtons caseData={caseData} />
//       </div>
//     </ResultProvider>
//   );
}
