import { z } from 'zod'
import sector_colors from './sector_colors'

const storeSchema = z
  .object({
    sector_color: sector_colors,
    block_number: z.coerce
      .number({ message: 'Bloco deve ser um número inteiro' })
      .int('Bloco deve ser um número inteiro')
      .positive('Bloco é obrigatório')
      .max(9, 'Bloco deve ser menor ou igual a 9'),
    store_number: z.coerce
      .number({ message: 'Loja deve ser um número inteiro' })
      .int('Loja deve ser um número inteiro')
      .positive('Loja é obrigatória')
      .max(19, 'Loja deve ser menor ou igual a 19'),
  })
  .superRefine((values, ctx) => {
    if (
      ['white', 'yellow'].includes(values.sector_color) &&
      values.block_number > 5
    ) {
      ctx.addIssue({
        message: 'Esse setor só possui blocos de 1 a 5.',
        code: z.ZodIssueCode.custom,
        path: ['block_number'],
      })
    }
    if (
      ['white', 'yellow'].includes(values.sector_color) &&
      values.store_number > 18 &&
      values.block_number < 5
    ) {
      ctx.addIssue({
        message: 'Esse bloco só possui lojas de 1 a 18.',
        code: z.ZodIssueCode.custom,
        path: ['store_number'],
      })
    }
    if (
      !['white', 'yellow'].includes(values.sector_color) &&
      values.store_number > 15 &&
      values.block_number < 8
    ) {
      ctx.addIssue({
        message: 'Esse bloco só possui lojas de 1 a 15.',
        code: z.ZodIssueCode.custom,
        path: ['store_number'],
      })
    }
    if (
      ['blue', 'orange'].includes(values.sector_color) &&
      values.store_number > 14 &&
      values.block_number === 8
    ) {
      ctx.addIssue({
        message: 'Esse bloco só possui lojas de 1 a 14.',
        code: z.ZodIssueCode.custom,
        path: ['store_number'],
      })
    }
    if (
      ['red', 'green'].includes(values.sector_color) &&
      values.store_number > 6 &&
      values.block_number === 8
    ) {
      ctx.addIssue({
        message: 'Esse bloco só possui lojas de 1 a 6.',
        code: z.ZodIssueCode.custom,
        path: ['store_number'],
      })
    }
    return true
  })

export default storeSchema
export type StoreSchema = z.infer<typeof storeSchema>
