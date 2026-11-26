-- ============================================================================
-- KESSOKU FAMILY (KSF) — SUPABASE SCHEMA / MIGRATION
-- Safe to re-run. Preserves existing registration rows.
-- Run in Supabase Dashboard > SQL Editor > New query.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- 1) WEBSITE CONFIGURATION
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add missing columns if this table was created by an older schema.
ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS data JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Ensure id can be used by ON CONFLICT(id), even for an older table.
CREATE UNIQUE INDEX IF NOT EXISTS site_config_id_uidx
  ON public.site_config (id);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_config public read" ON public.site_config;
CREATE POLICY "site_config public read"
  ON public.site_config FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "site_config admin insert" ON public.site_config;
CREATE POLICY "site_config admin insert"
  ON public.site_config FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "site_config admin update" ON public.site_config;
CREATE POLICY "site_config admin update"
  ON public.site_config FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "site_config admin delete" ON public.site_config;
CREATE POLICY "site_config admin delete"
  ON public.site_config FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

INSERT INTO public.site_config (id, data)
VALUES ('main', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2) MEMBER REGISTRATIONS
-- Create the complete table for new projects.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gender TEXT,
  tiktok TEXT,
  gen TEXT,
  skill TEXT,
  cn_format TEXT,
  cn_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migrate older registrations tables. Add created_at BEFORE creating its index.
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS gen TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS skill TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS cn_format TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS cn_value TEXT;
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
-- Keep the existing id type. Older installations may already use BIGINT
-- (often an identity/serial column); newer installations use UUID.
-- Never assign UUID values into a BIGINT column.
DO $$
DECLARE
  id_type TEXT;
  seq_name TEXT;
  max_id BIGINT;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod)
    INTO id_type
  FROM pg_attribute a
  WHERE a.attrelid = 'public.registrations'::regclass
    AND a.attname = 'id'
    AND NOT a.attisdropped;

  IF id_type IN ('bigint', 'integer', 'smallint') THEN
    SELECT MAX(id)::bigint INTO max_id FROM public.registrations;
    seq_name := pg_get_serial_sequence('public.registrations', 'id');

    -- Use the existing serial/identity sequence if one is already attached.
    -- Otherwise create a sequence and attach it as the column default.
    IF seq_name IS NULL THEN
      CREATE SEQUENCE IF NOT EXISTS public.registrations_id_seq;
      ALTER SEQUENCE public.registrations_id_seq
        OWNED BY public.registrations.id;
      ALTER TABLE public.registrations
        ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);
      seq_name := 'public.registrations_id_seq';
    END IF;

    PERFORM setval(
      seq_name::regclass,
      GREATEST(COALESCE(max_id, 0), 1),
      COALESCE(max_id, 0) > 0
    );
  ELSIF id_type = 'uuid' THEN
    UPDATE public.registrations
      SET id = gen_random_uuid()
      WHERE id IS NULL;
    ALTER TABLE public.registrations
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
  ELSE
    RAISE EXCEPTION 'Unsupported registrations.id type: %', id_type;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS registrations_id_uidx
  ON public.registrations (id);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx
  ON public.registrations (created_at DESC);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "registrations public insert" ON public.registrations;
CREATE POLICY "registrations public insert"
  ON public.registrations FOR INSERT TO anon, authenticated
  WITH CHECK (name IS NOT NULL AND length(trim(name)) > 0);

DROP POLICY IF EXISTS "registrations admin read" ON public.registrations;
CREATE POLICY "registrations admin read"
  ON public.registrations FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "registrations admin update" ON public.registrations;
CREATE POLICY "registrations admin update"
  ON public.registrations FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "registrations admin delete" ON public.registrations;
CREATE POLICY "registrations admin delete"
  ON public.registrations FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------
-- 3) PUBLIC MEDIA STORAGE BUCKET (50 MB max per file)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('media', 'media', true, 52428800)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit;

DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
CREATE POLICY "media admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "media admin update" ON storage.objects;
CREATE POLICY "media admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "media admin delete" ON storage.objects;
CREATE POLICY "media admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Verification result
SELECT 'KSF Supabase schema installed' AS status;
