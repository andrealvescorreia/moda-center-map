/*import { Sequelize } from 'sequelize-typescript'

const env = process.env.NODE_ENV || 'development'
const config = require(`${__dirname}/../../config/database.ts`)[env]

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config)

export { Sequelize, sequelize }
*/
