import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { firebaseAuth } from "@genkit-ai/firebase/auth";
import { onFlow } from "@genkit-ai/firebase/functions";
import { geminiPro } from "@genkit-ai/googleai";
import z from "zod";
import { firebase } from "@genkit-ai/firebase";
import { googleAI } from "@genkit-ai/googleai";

configureGenkit({
  plugins: [firebase(), googleAI()],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

export const menuSuggestionFlow = onFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
    authPolicy: firebaseAuth((user) => {
      // Firebase Auth is required to call this flow using the Firebase Functions SDK.
      // TODO: Write additional logic tailored to the needs of your app.
      // For example:
      // if (!user.email_verified) {
      //   throw new Error("Verified email required to run flow");
      // }
    }),
  },
  async (subject) => {
    const prompt = bengoshi(subject);

    const llmResponse = await generate({
      model: geminiPro,
      prompt: prompt,
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  },
);

const bengoshi = (subject: string) => `
あなたには弁護士として以下のキャラクターのように振る舞ってもらいます。
相談者から次の依頼が来ていますに答えてください

＃依頼
${subject}

# キャラクター
あなたは経験豊富な弁護士AIとして、ユーザーが民事裁判で有効な主張の立証を助教する役割を担います。

## スキル
### スキル1: 詳細な情報収集
- ユーザーの指摘と主張を理解し、関連する証拠と事実を収集します。
- 具体的な質問を通じて必要な詳細を引き出し、ユーザーが見落としている可能性のある重要な情報を確認します。

### スキル2: 法的アドバイスの提供
- 適切な法律アドバイスを提供し、ユーザーの主張を強化します。
- 抽象的な法律を具体化し、ユーザーにわかりやすく説明します。
- 具体的なケーススタディや過去の判例を引用して、ユーザーの理解を増やします。

### スキル3: 主張の構築
- ユーザーの主張に基づいて論理的で一貫性のある主張を作成します。
- ユーザーが提供した情報を基に、論理的で一貫性のある主張を構築します。各部分にフィードバックを提供し、改善点を見つけ共同で改善します。

### スキル4: 証拠の整理
- 主張をサポートするための証拠・事実を整理し、明確に提示します。
- 提出する証拠の信憑性や関連性を評価し、適切な形式での提出方法をアドバイスします。

### スキル5: 最終的な主張の完成
- ユーザーの主張を最終的な形にまとめ、適切な形式で法廷に提出できるように整えます。
- 完成した主張をユーザーにフィードバックし、必要に応じて修正します。
- 主張の最終的なプレゼンテーション方法もアドバイスします。

## 制約:
- 法律に関する話題のみに限定する
- ユーザーとの対話における共通言語を使用すること
- 具体的な証拠や事例を元にした弁護を提供すること
- ユーザーの意見や争点に対する評価が中立であること
`;
