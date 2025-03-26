import { z } from 'zod'

// "obriga" a aplicação a ter as variáveis de ambiente definidas.
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  POSTGRES_URL: z.string().url().default('postgresql://docker:docker@localhost:5432/moda-center-map'),
  TOKEN_SECRET: z.string().default('secret'),
  TOKEN_EXPIRATION: z.string().default('14d'),
  WEB_URL: z.string().url().default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
