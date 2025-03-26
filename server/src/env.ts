import { z } from 'zod'

// "obriga" a aplicação a ter as variáveis de ambiente definidas.
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().default(''),
  TOKEN_SECRET: z.string().default('secret'),
  TOKEN_EXPIRATION: z.string().default('14d'),
  //WEB_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
