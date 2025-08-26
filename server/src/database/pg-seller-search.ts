import type { Sequelize } from 'sequelize-typescript'

export async function postgreSetupSellerSearch(sequelize: Sequelize) {
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
