"use client";
import { useAuth } from "@/app/_components/firebase/AuthProvider";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";
import { JudgmentResult } from "@/app/resources/types/Firestore"; // 裁判結果の型
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

interface ResultContextType {
  roomId: string;
  judgmentResult: JudgmentResult | null; // 裁判結果データ
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export function useResult() {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
}

export default function ResultProvider(props: {
  roomId: string;
  children: React.ReactNode;
}) {
  const [judgmentResult, setJudgmentResult] = useState<JudgmentResult | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(getFirestore(), "judgment_results", props.roomId).withConverter(
        getClientConverter<JudgmentResult>()
      ),
      (doc) => {
        setJudgmentResult(doc.data() ?? null); // doc.data() が undefined なら null を設定
    }
    );

    return () => unsubscribe();
  }, [props.roomId]);

  return (
    <ResultContext.Provider value={{ roomId: props.roomId, judgmentResult }}>
      {props.children}
    </ResultContext.Provider>
  );
}
