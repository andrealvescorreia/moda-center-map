import type { Dialect } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import configs from '../config/database'
import { env } from '../env'
import Boxe from './models/boxe'
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
  Boxe,
  Store,
  UserFavoriteSellers,
  Notes,
  SellerProductCategories,
]

let sequelize: Sequelize
if (process.env.NODE_ENV !== 'test') {
  sequelize = new Sequelize(env.POSTGRES_URL, {
    ...configs,
    models,
  })
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite' as Dialect,
    storage: ':memory:',
    logging: false,
    models,
  })
}
export default sequelize

async function sync() {
  await sequelize.sync({ alter: true })
}

async function setupProductCategories() {
  // evite remover categorias existentes, apenas adicionar caso necessário
  for (const category of [
    'Calças',
    'Camisetas',
    'Shorts',
    'Saias',
    'Vestidos',
    'Blusas',
    'Bebês',
    'Jeans',
    'Acessórios',
    'Beleza',
    'Calçados',
    'Casa',
    'Casual',
    'Evangélica',
    'Fitness',
    'Infantil',
    'Íntima',
    'Plus Size',
    'Praia',
    'Sleepwear',
    'Social',
    'Outros',
  ]) {
    await ProductCategory.findOrCreate({
      where: { category },
    })
  }
}

export async function setupDatabase() {
  await sync()
  await setupProductCategories()
  if (process.env.NODE_ENV !== 'test') {
    postgreSetupSellerSearch(sequelize)
      .then(() => console.log('Banco de dados configurado'))
      .catch((err) =>
        console.error('Erro ao configurar o banco de dados:', err)
      )
  }
}
