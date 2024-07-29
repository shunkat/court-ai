import { z } from 'zod';
import { lawyerCategorySchema } from '../lawyer/schema';

export const intakeOutputSchema = z.object({
  category: z.union([lawyerCategorySchema, z.literal('null')]),
  text: z.string(),
});
