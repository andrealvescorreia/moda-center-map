import z from 'zod'

export const queryOptionsSchema = z.object({
  order_by: z.string().optional(),
  order: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
})

export type QueryOptionsType = z.infer<typeof queryOptionsSchema>
