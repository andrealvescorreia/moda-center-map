import z from 'zod'

export const searchSchema = z.object({
  searchTerm: z.string(),
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
})

export type SearchType = z.infer<typeof searchSchema>
