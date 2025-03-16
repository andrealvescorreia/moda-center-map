import type { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import configs from '../config/database'
import Boxe from './models/boxe'
import ProductCategory from './models/product-category'
import Seller from './models/seller'
import SellerProductCategories from './models/seller-product-categories'
import Store from './models/store'
import User from './models/user'
import UserFavoriteSellers from './models/user-favorite-sellers'

const envConfigs =
  process.env.NODE_ENV === 'test'
    ? {
        dialect: 'sqlite' as Dialect,
        storage: ':memory:',
        logging: false,
      }
    : configs

const sequelize = new Sequelize({
  ...envConfigs,
  models: [`${__dirname}/models`],
})

//!dev
async function sync() {
  await sequelize.sync({ force: true })
}

sync()

export default sequelize
