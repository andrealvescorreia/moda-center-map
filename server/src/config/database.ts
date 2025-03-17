import type { Dialect } from 'sequelize'
import { env } from '../env'

export default {
  dialect: 'postgres' as Dialect,
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  //dialectOptions: {},
  timezone: 'America/Sao_Paulo',
  logging: false,
}
