-- You can use this script to remove duplicate unique constraints that may be created by Sequelize when using the { alter: true } option.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.product_categories'::regclass
          AND contype = 'u'
          AND conname LIKE 'product_categories_category_key%'
        ORDER BY conname
    LOOP
        EXECUTE format('ALTER TABLE public.product_categories DROP CONSTRAINT %I;', r.conname);
    END LOOP;
END $$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.users'::regclass
          AND contype = 'u'
          AND conname LIKE 'users_username_key%'
        ORDER BY conname
    LOOP
        EXECUTE format('ALTER TABLE public.users DROP CONSTRAINT %I;', r.conname);
    END LOOP;
END $$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.sellers'::regclass
          AND contype = 'u'
          AND conname LIKE 'sellers_name_key%'
        ORDER BY conname
    LOOP
        EXECUTE format('ALTER TABLE public.sellers DROP CONSTRAINT %I;', r.conname);
    END LOOP;
END $$;

