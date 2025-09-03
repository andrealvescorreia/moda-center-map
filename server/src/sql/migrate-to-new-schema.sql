
-- use this script if you need to migrate existing users from the old schema (MCM version 1.3) to the new schema that introduces Google users (MCM version 1.4)

CREATE TABLE if not exists public.google_users  (
    id uuid NOT NULL,
    sub character varying(255) NOT NULL,
    name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE TABLE if not exists public.local_users (
    id uuid NOT NULL,
    username character varying(255) NOT NULL,
    password_hash character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- copy all the previously created users to local_users
INSERT INTO public.local_users
SELECT * FROM public.users;

-- make the alterations to the User table
ALTER TABLE public.users 
drop column if exists username;

ALTER TABLE public.users 
drop column if exists password_hash;

CREATE TYPE public.enum_users_type AS ENUM ( 'local', 'google');

ALTER TABLE public.users 
add column if not exists type public.enum_users_type DEFAULT 'local'::public.enum_users_type NOT NULL;

