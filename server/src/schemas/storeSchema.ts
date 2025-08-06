import z from 'zod'
import { sector_colors } from './sectorCollors'

export const storeSchema = z.object({
  sector_color: sector_colors,
  store_number: z.number().int().positive().max(19),
  block_number: z.number().int().positive().max(9),
})
