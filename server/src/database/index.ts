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

async function setupSellerSearch() {
  // postgres specifc!
  await sequelize.query(`
    CREATE INDEX IF NOT EXISTS sellers_search_idx ON sellers USING GIN(search_vector);
  `)

  await sequelize.query(`
    CREATE OR REPLACE FUNCTION update_search_vector() RETURNS TRIGGER AS $$
    BEGIN
      NEW.search_vector := to_tsvector('portuguese', NEW.name || ' ' || COALESCE(NEW.phone_number, ''));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'sellers_search_trigger'
      ) THEN
        CREATE TRIGGER sellers_search_trigger
        BEFORE INSERT OR UPDATE ON sellers
        FOR EACH ROW EXECUTE FUNCTION update_search_vector();
      END IF;
    END;
    $$;
  `)
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

export async function setup() {
  await sync()
  await setupProductCategories()
  if (process.env.NODE_ENV !== 'test') {
    setupSellerSearch()
      .then(() => console.log('Banco de dados configurado'))
      .catch((err) =>
        console.error('Erro ao configurar o banco de dados:', err)
      )
  }
}
