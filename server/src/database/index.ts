import type { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import configs from '../config/database'
import { env } from '../env'
import { defaultProductCategories } from './default-product-categories'
import Boxe from './models/boxe'
import GoogleUser from './models/google-user'
import LocalUser from './models/local-user'
import Notes from './models/note'
import ProductCategory from './models/product-category'
import Seller from './models/seller'
import SellerProductCategories from './models/seller-product-categories'
import Store from './models/store'
import User from './models/user'
import UserFavoriteSellers from './models/user-favorite-sellers'
import { postgreSetupSellerSearch } from './pg-seller-search'

const models = [
  ProductCategory,
  Seller,
  User,
  LocalUser,
  GoogleUser,
  Boxe,
  Store,
  UserFavoriteSellers,
  Notes,
  SellerProductCategories,
]

let sequelize: Sequelize
if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite' as Dialect,
    storage: ':memory:',
    logging: false,
    models,
  })
} else {
  sequelize = new Sequelize(env.POSTGRES_URL, {
    ...configs,
    models,
  })
}
export default sequelize

async function sync() {
  await sequelize.sync({ alter: true })
}

async function setupProductCategories() {
  for (const category of defaultProductCategories) {
    await ProductCategory.findOrCreate({
      where: { category },
    })
  }
}

export async function setupDatabase() {
  try {
    await sync()
    await setupProductCategories()
    if (sequelize.getDialect() === 'postgres') {
      await postgreSetupSellerSearch(sequelize)
    }
    console.log('Conectado ao banco de dados.')
  } catch (error) {
    console.log('Ocorreu um erro ao configurar o BD: ', error)
  }
}
