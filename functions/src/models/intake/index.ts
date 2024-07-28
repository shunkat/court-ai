import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema, IntakeOutputSchema } from '../lawyer/schema';
import { prompt } from './prompts/intake';

const handleIntakeFlow = defineFlow(
  {
    name: 'HandleIntakeFlow',
    inputSchema,
    outputSchema: IntakeOutputSchema,
  },
  async (input) => {
    try {
      const history: MessageData[] = [
        { role: 'system', content: [{ text: prompt }] },
        ...input.history,
      ];

      const llmResponse = await generate({
        model: geminiPro,
        prompt: input.prompt,
        history,
        config: { temperature: 1 },
      });

      return IntakeOutputSchema.parse(llmResponse);
    } catch (error) {
      // エラー型に応じて適切な処理を行う
      if (error instanceof Error) {
        console.error('Error in handleIntakeFlow:', error.message); // エラーメッセージのみ出力
      } else {
        console.error('An unexpected error occurred in handleIntakeFlow:', error); // 予期しないエラー
      }

      // エラーを再スローするか、適切な値を返す
      throw error; // デフォルトではエラーを再スロー
    }
  }
);

export { handleIntakeFlow };
