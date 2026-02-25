-- ═══════════════════════════════════════════════════════════
--  FIX SCRIPT — Correção do Banco de Dados
--  Execute este script no SQL Editor do seu projeto Supabase SaaS
-- ═══════════════════════════════════════════════════════════

-- 1. Cria a tabela study_sessions (que estava faltando)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_seconds INTEGER DEFAULT 0,
    classes_count INTEGER DEFAULT 0,
    questions_count INTEGER DEFAULT 0,
    subject_breakdown JSONB DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own study sessions"
    ON public.study_sessions FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER study_sessions_updated_at
    BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Recria a tabela daily_goals com a estrutura correta pro Dashboard novo
DROP TABLE IF EXISTS public.daily_goals CASCADE;

CREATE TABLE public.daily_goals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    
    questions_target INTEGER DEFAULT 30,
    questions_done   INTEGER DEFAULT 0,
    
    classes_target   INTEGER DEFAULT 4,
    classes_done     INTEGER DEFAULT 0,
    
    tasks            JSONB DEFAULT '[]'::jsonb,
    completed        BOOLEAN DEFAULT false,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE INDEX idx_daily_goals_user_id ON public.daily_goals(user_id);
CREATE INDEX idx_daily_goals_date    ON public.daily_goals(date);

ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own daily goals"
    ON public.daily_goals FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER daily_goals_updated_at
    BEFORE UPDATE ON public.daily_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
