import { z } from 'zod'

console.log(process.env.DATABASE_HOST)

// "obriga" a aplicação a ter as variáveis de ambiente definidas.
const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE: z.string(),
  TOKEN_SECRET: z.string(),
  TOKEN_EXPIRATION: z.string().default('14d'),
  //WEB_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
