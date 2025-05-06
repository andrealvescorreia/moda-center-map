import { z } from 'zod'
import { colorMap } from '../utils/utils'
import sector_colors from './sector_colors'

const boxeSchema = z
  .object({
    sector_color: sector_colors,
    box_number: z.coerce
      .number({ message: 'Boxe deve ser um número inteiro' })
      .int('Boxe deve ser um número inteiro')
      .min(1, 'Boxe deve ser maior ou igual a 1')
      .max(128, 'Boxe deve ser menor ou igual a 128'),
    street_letter: z
      .string()
      .toUpperCase()
      .regex(/^[A-P]$/, 'Rua deve ser uma letra entre A e P'),
  })
  .superRefine((values, ctx) => {
    if (
      values.sector_color !== 'yellow' &&
      values.sector_color !== 'white' &&
      values.box_number > 120
    ) {
      ctx.addIssue({
        message:
          'O número do boxe deve ser menor ou igual a 120 para esse setor.',
        code: z.ZodIssueCode.custom,
        path: ['box_number'],
      })
    }
    if (['A', 'P'].includes(values.street_letter)) {
      const isEven = values.box_number % 2 === 0
      const evenSectors =
        values.street_letter === 'A'
          ? ['blue', 'green', 'yellow']
          : ['orange', 'red', 'white']
      const oddSectors =
        values.street_letter === 'A'
          ? ['orange', 'red', 'white']
          : ['blue', 'green', 'yellow']

      if (evenSectors.includes(values.sector_color) && !isEven) {
        ctx.addIssue({
          message: `Para o setor ${colorMap[values.sector_color]}, boxes na rua ${values.street_letter} devem ser pares`,
          code: z.ZodIssueCode.custom,
          path: ['box_number'],
        })
      }

      if (oddSectors.includes(values.sector_color) && isEven) {
        ctx.addIssue({
          message: `Para o setor ${colorMap[values.sector_color]}, boxes na rua ${values.street_letter} devem ser ímpares`,
          code: z.ZodIssueCode.custom,
          path: ['box_number'],
        })
      }
    }

    return true
  })

export default boxeSchema
export type BoxeSchema = z.infer<typeof boxeSchema>
