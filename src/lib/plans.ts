// ─────────────────────────────────────────────
//  KIWIFY CHECKOUT URLs
//  Substitua pelas URLs reais dos planos no Kiwify
//  Painel: Kiwify → seu produto → Planos → URL de checkout
// ─────────────────────────────────────────────

export const CHECKOUT_URLS = {
    trimestral: 'https://pay.kiwify.com.br/UqFVxjD',
    semestral: 'https://pay.kiwify.com.br/AiPHpNF',
    anual: 'https://pay.kiwify.com.br/yI7zJoY',
} as const;

export const PLAN_CONFIG = {
    trimestral: {
        label: 'Trimestral',
        price: 'R$99',
        period: '3 meses',
        monthly: 'R$33/mês',
        durationDays: 92,
        checkoutUrl: CHECKOUT_URLS.trimestral,
        highlight: false,
    },
    semestral: {
        label: 'Semestral',
        price: 'R$179',
        period: '6 meses',
        monthly: 'R$30/mês',
        durationDays: 183,
        checkoutUrl: CHECKOUT_URLS.semestral,
        highlight: true, // Mais popular
    },
    anual: {
        label: 'Anual',
        price: 'R$299',
        period: '12 meses',
        monthly: 'R$25/mês',
        durationDays: 365,
        checkoutUrl: CHECKOUT_URLS.anual,
        highlight: false,
    },
} as const;

export type PlanKey = keyof typeof PLAN_CONFIG;
