-- ═══════════════════════════════════════════════════════════
--  002_simulation_results.sql
--  Cria a tabela simulation_results com todas as colunas
--  necessárias para armazenar resultados de simulados e
--  redações (C1-C5).
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.simulation_results (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Identificação
    title               TEXT NOT NULL DEFAULT 'Simulado',
    subject             TEXT,                   -- ex: 'Linguagens e Humanas', 'Redação'

    -- Pontuação Geral
    score               INTEGER NOT NULL DEFAULT 0,
    total_questions     INTEGER NOT NULL DEFAULT 0,
    time_spent_minutes  INTEGER DEFAULT 0,

    -- Detalhamento ENEM Dia 1
    linguagens_correct  INTEGER,
    humanas_correct     INTEGER,
    redacao_score       INTEGER,
    c1                  INTEGER,
    c2                  INTEGER,
    c3                  INTEGER,
    c4                  INTEGER,
    c5                  INTEGER,

    -- Detalhamento ENEM Dia 2
    natureza_correct    INTEGER,
    matematica_correct  INTEGER,

    -- Metadata
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulation_results_user_id   ON public.simulation_results(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_results_created   ON public.simulation_results(created_at);

ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;

-- Usuário gerencia apenas os próprios resultados
CREATE POLICY "Users can manage own simulation results"
    ON public.simulation_results FOR ALL
    USING (auth.uid() = user_id);

CREATE TRIGGER simulation_results_updated_at
    BEFORE UPDATE ON public.simulation_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
