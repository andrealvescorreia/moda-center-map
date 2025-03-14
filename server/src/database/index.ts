import { Sequelize } from 'sequelize-typescript'
import databaseConfig from '../config/database'
import User from './models/user'

const models = [User]

const sequelize = new Sequelize(databaseConfig)
sequelize.addModels(models)

//!dev
sequelize.sync({ force: true })

async function connect() {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
//connect()

export default sequelize
