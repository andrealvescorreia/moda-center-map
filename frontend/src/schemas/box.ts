import { z } from 'zod'
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
    if (values.street_letter === 'A' && values.box_number % 2 === 0) {
      ctx.addIssue({
        message: 'Boxes na rua A devem ser ímpares',
        code: z.ZodIssueCode.custom,
        path: ['box_number'],
      })
    }
    if (values.street_letter === 'P' && values.box_number % 2 !== 0) {
      ctx.addIssue({
        message: 'Boxes na rua P devem ser pares',
        code: z.ZodIssueCode.custom,
        path: ['box_number'],
      })
    }
    return true
  })

export default boxeSchema
export type BoxeSchema = z.infer<typeof boxeSchema>
