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

async function setup() {
  await sync()

  if (process.env.NODE_ENV !== 'test') {
    setupSellerSearch()
      .then(() => console.log('Banco de dados configurado'))
      .catch((err) =>
        console.error('Erro ao configurar o banco de dados:', err)
      )
  }
}
setup()
export default sequelize
