-- ═══════════════════════════════════════════════════════════
--  MIGRATION: HABITS TRACKER
-- ═══════════════════════════════════════════════════════════

-- 1. HABITS TABLE
CREATE TABLE IF NOT EXISTS public.habits (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own habits"
    ON public.habits FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER habits_updated_at
    BEFORE UPDATE ON public.habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. HABIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id    UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date        DATE NOT NULL DEFAULT CURRENT_DATE,
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, date)
);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON public.habit_logs(date);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own habit logs"
    ON public.habit_logs FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER habit_logs_updated_at
    BEFORE UPDATE ON public.habit_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
