import z from 'zod'
import { sector_colors } from './sectorCollors'

export const boxeSchema = z.object({
  sector_color: sector_colors,
  box_number: z.number().int().positive().max(128),
  street_letter: z.string().regex(/^[A-P]$/),
})

export type BoxeType = z.infer<typeof boxeSchema>
