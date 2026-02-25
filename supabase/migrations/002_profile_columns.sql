ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS university   TEXT,
    ADD COLUMN IF NOT EXISTS course       TEXT,
    ADD COLUMN IF NOT EXISTS target_score INTEGER DEFAULT 120,
    ADD COLUMN IF NOT EXISTS avatar_url   TEXT;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
