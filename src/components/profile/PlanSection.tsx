import { useState } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PLAN_CONFIG } from '../../lib/plans';

const PLAN_LABELS = {
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
    manual: 'Acesso Manual (Mentoria)',
};

const PLAN_COLORS = {
    trimestral: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    semestral: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
    anual: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    manual: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
};

const PLAN_ICONS = {
    trimestral: '📅',
    semestral: '🗓️',
    anual: '🏆',
    manual: '🎓',
};

// Derived from central config
const UPGRADE_URLS = {
    trimestral: PLAN_CONFIG.trimestral.checkoutUrl,
    semestral: PLAN_CONFIG.semestral.checkoutUrl,
    anual: PLAN_CONFIG.anual.checkoutUrl,
    manual: '#',
};

export function PlanSection() {
    const { subscription, isActive, isLoading, daysRemaining, expiresAt, refresh } = useSubscription();
    const [refreshing, setRefreshing] = useState(false);

    async function handleRefresh() {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
                <div className="h-8 bg-white/10 rounded w-1/2 mb-2" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
        );
    }

    // Sem assinatura ativa
    if (!isActive || !subscription) {
        return (
            <div className="bg-[#111118] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <span className="text-xl">⚠️</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Sem plano ativo</h3>
                        <p className="text-gray-500 text-sm">Assine para acessar a plataforma</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'trimestral', label: 'Trimestral', price: 'R$99', period: '3 meses' },
                        { id: 'semestral', label: 'Semestral', price: 'R$179', period: '6 meses' },
                        { id: 'anual', label: 'Anual', price: 'R$299', period: '12 meses' },
                    ].map((plan) => (
                        <a
                            key={plan.id}
                            href={UPGRADE_URLS[plan.id as keyof typeof UPGRADE_URLS]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#1a1a2e] hover:bg-[#7c3aed]/20 border border-white/10 hover:border-[#7c3aed]/40 rounded-xl p-4 text-center transition-all group"
                        >
                            <p className="text-white font-bold text-lg">{plan.price}</p>
                            <p className="text-gray-400 text-xs">{plan.period}</p>
                            <p className="text-[#a78bfa] text-xs mt-2 group-hover:text-white transition-colors">Assinar →</p>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // Com assinatura ativa
    const colorClass = PLAN_COLORS[subscription.plan] || PLAN_COLORS.anual;
    const icon = PLAN_ICONS[subscription.plan] || '📦';
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 14;
    const isManual = subscription.granted_by_admin;

    const formattedExpiry = expiresAt?.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-6`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                        {icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-lg">
                                Plano {PLAN_LABELS[subscription.plan]}
                            </h3>
                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                                ✓ Ativo
                            </span>
                        </div>
                        {isManual && (
                            <p className="text-gray-400 text-xs mt-0.5">
                                🎓 Liberado pela mentoria
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="text-gray-500 hover:text-white transition-colors p-1"
                    title="Atualizar status"
                >
                    <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Válido até</p>
                    <p className="text-white font-semibold">{formattedExpiry}</p>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Dias restantes</p>
                    <p className={`font-bold text-xl ${isExpiringSoon ? 'text-amber-400' : 'text-white'}`}>
                        {daysRemaining}
                        {isExpiringSoon && <span className="text-xs font-normal ml-1">⚠️ expirando</span>}
                    </p>
                </div>
            </div>

            {/* Barra de progresso */}
            {daysRemaining !== null && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Tempo restante</span>
                        <span>{daysRemaining} dias</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isExpiringSoon ? 'bg-amber-500' : 'bg-[#7c3aed]'
                                }`}
                            style={{
                                width: `${Math.min(100, (daysRemaining / (subscription.plan === 'anual' ? 365 : subscription.plan === 'semestral' ? 183 : 92)) * 100)}%`
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Ações */}
            <div className="flex gap-3">
                {isExpiringSoon && !isManual && (
                    <a
                        href={UPGRADE_URLS[subscription.plan as keyof typeof UPGRADE_URLS] || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-all"
                    >
                        Renovar plano
                    </a>
                )}
                {!isManual && (
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 rounded-xl text-center transition-all border border-white/10"
                    >
                        Fazer upgrade
                    </a>
                )}
            </div>

            {/* Nota admin */}
            {subscription.admin_note && (
                <p className="text-gray-500 text-xs mt-4 italic">
                    📝 {subscription.admin_note}
                </p>
            )}
        </div>
    );
}
