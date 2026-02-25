-- ═══════════════════════════════════════════════════════════
--  FULL SCHEMA — Real Mentoria (v2-saas)
--  Execute este script no SQL Editor do NOVO projeto Supabase
--  para recriar toda a estrutura da plataforma.
--  Ordem de execução: functions → tables → policies → triggers
-- ═══════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────
--  0. FUNÇÃO AUXILIAR: updated_at trigger
-- ─────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════
--  1. PROFILES
--  Armazena nome completo, role e XP de cada usuário
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT,
    role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'founder')),
    xp          INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuário lê/edita o próprio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin pode ver todos
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.user_id = auth.uid()
              AND p.role IN ('admin', 'founder')
        )
    );

-- Trigger para criar profile automaticamente no cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════
--  2. SUBSCRIPTIONS
--  Controla acesso de todos os usuários à plataforma
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Plano
    plan                    TEXT NOT NULL CHECK (plan IN ('trimestral', 'semestral', 'anual', 'manual')),
    status                  TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),

    -- Datas
    started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at              TIMESTAMPTZ NOT NULL,
    cancelled_at            TIMESTAMPTZ,

    -- Integração com gateway (Kiwify ou futuro)
    kiwify_order_id         TEXT,
    kiwify_subscription_id  TEXT,
    kiwify_customer_email   TEXT,

    -- Controle manual (alunos de mentoria)
    granted_by_admin        BOOLEAN DEFAULT FALSE,
    admin_note              TEXT,

    -- Metadata
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id   ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status    ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires   ON public.subscriptions(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_kiwify_order
    ON public.subscriptions(kiwify_order_id) WHERE kiwify_order_id IS NOT NULL;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuário só vê a própria assinatura
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Apenas service_role pode inserir/atualizar (webhook + admin)
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.role() = 'service_role');

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- View helper: assinatura ativa do usuário
CREATE OR REPLACE VIEW public.active_subscriptions AS
SELECT * FROM public.subscriptions
WHERE status = 'active' AND expires_at > NOW();

-- Função helper: verifica se usuário tem acesso
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.subscriptions
        WHERE user_id = p_user_id
          AND status = 'active'
          AND expires_at > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════════════════════
--  3. DAILY_GOALS
--  Registro de horas de estudo por dia
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.daily_goals (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date            DATE NOT NULL DEFAULT CURRENT_DATE,
    hours_studied   NUMERIC(5,2) NOT NULL DEFAULT 0,
    goal_hours      NUMERIC(5,2) NOT NULL DEFAULT 8,
    subject         TEXT,                    -- ex: 'Clínica Médica', 'Cirurgia'
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date, subject)
);

CREATE INDEX IF NOT EXISTS idx_daily_goals_user_id ON public.daily_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_goals_date    ON public.daily_goals(date);

ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own daily goals"
    ON public.daily_goals FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER daily_goals_updated_at
    BEFORE UPDATE ON public.daily_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════
--  4. SCHEDULE_TASKS
--  Tarefas do cronograma semanal/diário gerado
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.schedule_tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title       TEXT NOT NULL,
    subject     TEXT,
    day_of_week TEXT CHECK (day_of_week IN ('seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom')),
    start_time  TIME,
    end_time    TIME,
    duration_h  NUMERIC(4,2),
    completed   BOOLEAN NOT NULL DEFAULT FALSE,
    week_start  DATE,                  -- início da semana a que pertence a tarefa
    color       TEXT,                  -- cor hex para exibição
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_tasks_user_id    ON public.schedule_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_tasks_week_start ON public.schedule_tasks(week_start);

ALTER TABLE public.schedule_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own schedule tasks"
    ON public.schedule_tasks FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER schedule_tasks_updated_at
    BEFORE UPDATE ON public.schedule_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════
--  FIM DO SCRIPT
--  Após executar, vá em Project Settings → API e copie a
--  URL e a anon key para o arquivo .env.local do projeto.
-- ═══════════════════════════════════════════════════════════
