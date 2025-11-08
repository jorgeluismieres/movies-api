
import { z } from 'zod';
export const PersonSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  nationality: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/,'YYYY-MM-DD')
});
