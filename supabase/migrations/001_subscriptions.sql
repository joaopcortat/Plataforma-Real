-- ═══════════════════════════════════════════════════════════
--  SUBSCRIPTIONS TABLE — Real Mentoria SaaS
--  Controla acesso de todos os usuários à plataforma
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plano
    plan                TEXT NOT NULL CHECK (plan IN ('trimestral', 'semestral', 'anual', 'manual')),
    status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    
    -- Datas
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL,
    cancelled_at        TIMESTAMPTZ,
    
    -- Kiwify
    kiwify_order_id     TEXT,
    kiwify_subscription_id TEXT,
    kiwify_customer_email  TEXT,
    
    -- Controle manual (alunos de mentoria)
    granted_by_admin    BOOLEAN DEFAULT FALSE,
    admin_note          TEXT,
    
    -- Metadata
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON public.subscriptions(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_kiwify_order ON public.subscriptions(kiwify_order_id) WHERE kiwify_order_id IS NOT NULL;

-- RLS (Row Level Security)
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Usuário só vê a própria assinatura
CREATE POLICY "Users can view own subscription"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Apenas service_role pode inserir/atualizar (webhook + admin)
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- Trigger: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

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
