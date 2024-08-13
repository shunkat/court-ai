import { generate } from '@genkit-ai/ai';
import { MessageData } from '@genkit-ai/ai/model';
import { geminiPro } from '@genkit-ai/googleai';
import { defineFlow } from '@genkit-ai/flow';
import { inputSchema } from '../lawyer/schema';
import { prompt } from './prompts/intake';
import { intakeOutputSchema } from './schema';

const handleIntakeFlow = defineFlow(
  {
    name: 'HandleIntakeFlow',
    inputSchema,
    outputSchema: intakeOutputSchema.nullable(),
  },
  async (input) => {
    const history: MessageData[] = [
      { role: 'system', content: [{ text: prompt }] },
      ...input.history,
    ];

    try {
      const llmResponse = await generate({
        model: geminiPro,
        prompt: input.prompt,
        history,
        config: { temperature: 1 },
        output: { schema: intakeOutputSchema },
      });
      return llmResponse.output();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
);

export { handleIntakeFlow };
