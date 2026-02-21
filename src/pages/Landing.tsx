import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, Zap, CheckCircle2, Star } from 'lucide-react';
import { PLAN_CONFIG } from '../lib/plans';

export function Landing() {
    const plans = [
        { ...PLAN_CONFIG.trimestral, id: 'trimestral' },
        { ...PLAN_CONFIG.semestral, id: 'semestral' },
        { ...PLAN_CONFIG.anual, id: 'anual' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-[#7c3aed]/30 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#7c3aed]/20 rounded-full blur-[120px] opacity-50 -z-10 pointer-events-none" />

            {/* Navbar */}
            <nav className="fixed top-0 w-full border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                            <span className="font-bold text-white">R</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Real</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Entrar
                        </Link>
                        <a
                            href="#planos"
                            className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Começar agora
                        </a>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24">
                {/* Hero section */}
                <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
                        <span className="text-[#a78bfa] text-sm font-medium">Novo ciclo de estudos 2026 🎯</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto">
                        Aprovado em Medicina sem <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]">
                            perder tempo estudando errado.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Inteligência artificial que adapta seu cronograma diariamente, foca nas suas dificuldades e garante que você estude o que realmente importa.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#planos"
                            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-lg shadow-[#7c3aed]/25 hover:shadow-[#7c3aed]/40"
                        >
                            Garantir minha vaga
                            <ArrowRight size={20} />
                        </a>
                        <Link
                            to="/login"
                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-medium text-lg border border-white/10 transition-all"
                        >
                            Já sou aluno
                        </Link>
                    </div>

                    <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: 'Aprovados', value: '+2.400', icon: Target },
                            { label: 'Cronogramas Gerados', value: '+150k', icon: Brain },
                            { label: 'Questões Resolvidas', value: '+4M', icon: Zap },
                            { label: 'Satisfação', value: '4.9/5', icon: Star },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="flex justify-center mb-4 text-[#a78bfa]">
                                    <stat.icon size={24} />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="bg-black/50 py-32 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Por que somos diferentes?</h2>
                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                Cursinhos tradicionais tratam todos os alunos como se fossem iguais.
                                A Real Mentoria entende como você aprende e adapta tudo para você.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: 'Cronograma IA Dinâmico',
                                    desc: 'Seu cronograma se reorganiza automaticamente se você atrasar ou adiantar matérias.',
                                    icon: Brain
                                },
                                {
                                    title: 'Revisões Espaçadas',
                                    desc: 'O sistema agenda suas revisões no momento exato para que você nunca esqueça o conteúdo.',
                                    icon: Target
                                },
                                {
                                    title: 'Direcionamento Cirúrgico',
                                    desc: 'Foque nos assuntos que mais caem e que você tem mais dificuldade. Pare de perder tempo.',
                                    icon: Zap
                                }
                            ].map((feature, i) => (
                                <div key={i} className="bg-[#111118] border border-white/5 rounded-2xl p-8 hover:border-[#7c3aed]/30 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center text-[#a78bfa] mb-6">
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing / Checkout */}
                <section id="planos" className="max-w-7xl mx-auto px-6 py-32">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Escolha seu plano</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            O investimento mínimo para a maior aprovação da sua vida.
                            Garantia incondicional de 7 dias.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 border transition-all flex flex-col ${plan.highlight
                                    ? 'bg-gradient-to-b from-[#7c3aed]/20 to-[#7c3aed]/5 border-[#7c3aed]/50 shadow-2xl shadow-[#7c3aed]/20 scale-105 z-10'
                                    : 'bg-[#111118] border-white/10'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-[#7c3aed] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                                            Recomendado
                                        </span>
                                    </div>
                                )}

                                <div className="mb-8 border-b border-white/10 pb-8">
                                    <p className="text-gray-400 font-medium mb-2 uppercase tracking-wider text-sm">{plan.label}</p>
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-5xl font-bold text-white">{plan.price}</span>
                                        <span className="text-gray-500">/{plan.period}</span>
                                    </div>
                                    <p className="text-[#a78bfa] bg-[#7c3aed]/10 inline-block px-3 py-1 rounded-full text-sm font-medium">
                                        Equivale a {plan.monthly}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {[
                                        'Cronograma de IA ilimitado',
                                        'Revisões baseadas em algoritmo',
                                        'Dashboard de desempenho',
                                        'Simulados e Listas',
                                        'Acesso a todas atualizações'
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <CheckCircle2 className="text-[#7c3aed] shrink-0" size={20} />
                                            <span className="text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href={plan.checkoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${plan.highlight
                                        ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg shadow-[#7c3aed]/25'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}
                                >
                                    Assinar agora
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
                            <span className="font-bold text-white text-xs">R</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Real Mentoria</span>
                    </div>
                    <p className="text-gray-500 mb-6">
                        O método definitivo para a sua aprovação.
                    </p>
                    <p className="text-gray-600 text-sm">
                        &copy; {new Date().getFullYear()} Real Mentoria. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
