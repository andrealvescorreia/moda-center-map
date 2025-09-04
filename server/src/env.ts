import { z } from 'zod'

const envSchema = z.object({
  PROTOCOL: z.enum(['http', 'https']).default('http'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(3001),
  POSTGRES_URL: z
    .string()
    .url()
    .default('postgresql://docker:docker@localhost:5432/moda-center-map'),
  TOKEN_SECRET: z.string().default('secret'),
  TOKEN_EXPIRATION: z.string().default('14d'),
  WEB_URL: z.string().url().default('http://localhost:5173'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
export const serverUrl = `${env.PROTOCOL}://${env.HOST}${env.HOST === 'localhost' ? `:${env.PORT}` : ''}`
