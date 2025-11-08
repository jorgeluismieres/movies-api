
import { z } from 'zod';
export const MovieSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  synopsis: z.string().min(1),
  release_year: z.number().int().gte(1888).lte(2100)
});
