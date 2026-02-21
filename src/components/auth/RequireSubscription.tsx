import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';
import { PLAN_CONFIG } from '../../lib/plans';

// ─── Tela de Upgrade ─────────────────────────────────────
function UpgradeWall() {
    const plans = [
        { ...PLAN_CONFIG.trimestral, id: 'trimestral' },
        { ...PLAN_CONFIG.semestral, id: 'semestral' },
        { ...PLAN_CONFIG.anual, id: 'anual' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-2 mb-6">
                    <span className="text-[#a78bfa] text-sm font-medium">🎯 Real Mentoria</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    Sua jornada para a<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]">
                        Medicina começa aqui
                    </span>
                </h1>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Cronograma personalizado por IA, revisões inteligentes e acompanhamento completo para o ENEM.
                </p>
            </div>

            {/* Planos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-2xl p-6 border transition-all ${plan.highlight
                                ? 'bg-gradient-to-b from-[#7c3aed]/20 to-[#7c3aed]/5 border-[#7c3aed]/50 shadow-lg shadow-[#7c3aed]/10'
                                : 'bg-[#111118] border-white/10'
                            }`}
                    >
                        {plan.highlight && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-full">
                                    ⭐ Mais popular
                                </span>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className="text-gray-400 text-sm mb-1">{plan.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">{plan.price}</span>
                                <span className="text-gray-500 text-sm">/{plan.period}</span>
                            </div>
                            <p className="text-[#a78bfa] text-sm mt-1">{plan.monthly}</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {[
                                'Cronograma IA personalizado',
                                'Revisões com Curva de Hermann',
                                'Banco de questões ENEM',
                                'Análise de desempenho',
                                'Garantia de 7 dias',
                            ].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-[#a78bfa]">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <a
                            href={plan.checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${plan.highlight
                                    ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                                }`}
                        >
                            Começar agora
                        </a>
                    </div>
                ))}
            </div>

            <p className="text-gray-600 text-sm mt-8">
                Garantia de 7 dias. Cancele quando quiser.
            </p>
        </div>
    );
}

// ─── Guard de Rota ────────────────────────────────────────
interface RequireSubscriptionProps {
    children: React.ReactNode;
    /** Se true, redireciona para /login se não autenticado */
    requireAuth?: boolean;
}

export function RequireSubscription({ children, requireAuth = true }: RequireSubscriptionProps) {
    const { user, loading: authLoading } = useAuth();
    const { isActive, isLoading: subLoading } = useSubscription();

    // Ainda carregando
    if (authLoading || subLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Não autenticado
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // Autenticado mas sem assinatura ativa
    if (user && !isActive) {
        return <UpgradeWall />;
    }

    return <>{children}</>;
}
