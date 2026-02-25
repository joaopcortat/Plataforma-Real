import { motion } from 'framer-motion';
import { ArrowRight, Star, Play, Timer, Target, CheckCircle2, TrendingUp, Sparkles, Brain, Flame, BarChart3 } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative pt-24 pb-16 md:pt-44 md:pb-28 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm"
                >
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>A plataforma definitiva de estudos</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-[2.4rem] leading-tight md:text-7xl font-bold text-white tracking-tight md:leading-[1.1] max-w-4xl"
                >
                    Domine seus estudos e conquiste a{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary">
                        aprovação.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 text-base md:text-xl text-zinc-400 max-w-2xl leading-relaxed px-1"
                >
                    Muito mais que um cursinho. Estudo Real é o ecossistema perfeito para organizar seus horários, metrificar seu desempenho e destruir nos simulados.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                >
                    <button
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-waitlist')); }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-13 px-6 md:h-14 md:px-8 rounded-xl bg-primary hover:bg-primary text-zinc-950 text-sm md:text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:shadow-[0_0_40px_rgba(251,191,36,0.4)]"
                    >
                        <span className="sm:hidden">Garantir 50% OFF</span>
                        <span className="hidden sm:inline">Garantir acesso antecipado (50% OFF)</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <a
                        href="#plataforma"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 h-12 md:h-14 px-6 md:px-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white text-sm md:text-base font-medium transition-all"
                    >
                        <Play className="w-5 h-5 text-primary" />
                        Conhecer Plataforma
                    </a>
                </motion.div>

                {/* Dashboard Preview — desktop only */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full mt-12 md:mt-20 relative max-w-5xl mx-auto hidden sm:block"
                >
                    {/* Responsive Floating Notifications */}
                    <div className="absolute inset-0 z-20 flex sm:hidden pointer-events-none">
                        {/* Mobile: we could position them differently or keep inline */}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 30, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="absolute -right-4 md:-right-12 top-10 z-20 bg-zinc-900 border border-zinc-700/50 p-4 rounded-xl shadow-2xl w-64 md:w-72 backdrop-blur-md hidden sm:block"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Timer className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Meta Diária Atingida!</h4>
                                <p className="text-xs text-zinc-400">Você estudou <strong className="text-white">4h e 32m</strong> hoje.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -30, y: -10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                        className="absolute -left-4 md:-left-12 bottom-24 z-20 bg-zinc-900 border border-zinc-700/50 p-4 rounded-xl shadow-2xl w-64 md:w-72 backdrop-blur-md hidden sm:block"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Target className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-2">Metas do dia</h4>
                                <ul className="text-xs text-zinc-400 space-y-1.5">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Revisar estequiometria</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Fazer 20 questões de física</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* New Notification 1: IA Integrada */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.0 }}
                        className="absolute left-1/2 -translate-x-1/2 -top-12 z-20 bg-zinc-900 border border-primary/40 p-3 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.15)] flex items-center gap-3 backdrop-blur-md hidden md:flex"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-primary flex items-center justify-center shrink-0 shadow-lg">
                            <Sparkles className="w-3 h-3 text-zinc-950" />
                        </div>
                        <span className="text-sm font-semibold text-white">IA: Simulados corrigidos. Ponto fraco detectado: <span className="text-primary">Cinemática</span>.</span>
                    </motion.div>

                    {/* New Notification 2: Dia de revisar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 2.4 }}
                        className="absolute right-10 bottom-10 z-20 bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-2xl w-56 backdrop-blur-md hidden lg:block"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Aviso do Sistema</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">Dia de Revisão</h4>
                        <p className="text-xs text-zinc-400"><strong className="text-primary">Genética:</strong> Suas métricas apontam que é o momento exato da revisão espaçada.</p>
                    </motion.div>

                    {/* New Notification 3: Desempenho Comparativo */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 2.8 }}
                        className="absolute -left-6 md:-left-16 top-1/3 z-20 bg-zinc-900 border border-zinc-700/50 p-4 rounded-xl shadow-2xl w-60 md:w-64 backdrop-blur-md hidden xl:block"
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Brain className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Mente Afiada</h4>
                                <p className="text-xs text-zinc-400 leading-tight">O tempo de finalização do 2º dia do ENEM 2023 foi <strong className="text-primary">10% menor</strong> que a média dos seus simulados anteriores.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* New Notification 4: Foco / Streak */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 3.2 }}
                        className="absolute left-[15%] -bottom-6 z-30 bg-zinc-950 border border-zinc-800 p-3 flex-row rounded-xl shadow-2xl backdrop-blur-md hidden md:flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Flame className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-white block">Fluxo Intenso</span>
                            <span className="text-xs text-zinc-400 block">50 min sem distrações.</span>
                        </div>
                    </motion.div>

                    {/* New Notification 5: Análise de Área */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 3.6 }}
                        className="absolute right-[15%] -bottom-4 z-20 bg-zinc-900 border border-zinc-700/50 p-3 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.1)] flex items-center gap-3 backdrop-blur-md hidden lg:flex"
                    >
                        <BarChart3 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-xs font-semibold text-zinc-300">
                            Rendimento em História subiu <strong className="text-primary">18%</strong>.
                        </span>
                    </motion.div>

                    <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl blur-xl" />
                    <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden aspect-video flex flex-col">
                        {/* Fake Mac Windows Bar */}
                        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary/80" />
                            <div className="w-3 h-3 rounded-full bg-primary/80" />
                            <div className="w-3 h-3 rounded-full bg-primary/80" />
                        </div>
                        {/* The Actual Platform Image/Mockup could go here. We'll use a placeholder structural representation */}
                        <div className="flex-1 bg-zinc-950 p-6 flex gap-6 overflow-hidden">
                            <div className="hidden md:flex flex-col gap-4 w-48 shrink-0">
                                <div className="h-8 bg-zinc-900 rounded-md w-full" />
                                <div className="h-8 bg-zinc-900 rounded-md w-3/4" />
                                <div className="h-8 bg-zinc-900 rounded-md w-5/6" />
                                <div className="h-8 bg-zinc-900/50 rounded-md w-full mt-auto" />
                            </div>
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="flex gap-4">
                                    <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl flex-1 flex flex-col justify-center p-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 mb-2" />
                                        <div className="h-3 w-1/2 bg-zinc-800 rounded-md mb-1.5" />
                                        <div className="h-4 w-3/4 bg-zinc-700 rounded-md" />
                                    </div>
                                    <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl flex-1 flex flex-col justify-center p-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 mb-2" />
                                        <div className="h-3 w-1/2 bg-zinc-800 rounded-md mb-1.5" />
                                        <div className="h-4 w-3/4 bg-zinc-700 rounded-md" />
                                    </div>
                                    <div className="h-24 bg-zinc-900 border border-zinc-800 rounded-xl flex-1 flex flex-col justify-center p-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 mb-2" />
                                        <div className="h-3 w-1/2 bg-zinc-800 rounded-md mb-1.5" />
                                        <div className="h-4 w-3/4 bg-zinc-700 rounded-md" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5" />
                                    {/* Dashboard wireframe visual with Line Chart */}
                                    <div className="w-full h-full p-6 flex flex-col gap-4 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-white font-bold text-sm mb-1">Acertos nos Simulados</h4>
                                                <div className="h-2 w-32 bg-zinc-800 rounded-md" />
                                            </div>
                                            <div className="flex items-center gap-1.5 text-primary bg-primary/10 px-2 py-1 rounded-md text-xs font-bold border border-primary/20">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>+24.5% evolução</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full mx-auto relative mt-2 flex items-end">
                                            {/* Grid lines */}
                                            <div className="absolute inset-0 flex flex-col justify-between">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="w-full h-px bg-zinc-800/30" />
                                                ))}
                                            </div>

                                            {/* SVG Line Chart */}
                                            <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                                                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <motion.path
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{ pathLength: 1, opacity: 1 }}
                                                    transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                                                    d="M 0 40 Q 20 38, 40 25 T 70 18 T 100 5"
                                                    fill="none"
                                                    stroke="#fbbf24"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <motion.path
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 1, delay: 2.3 }}
                                                    d="M 0 40 Q 20 38, 40 25 T 70 18 T 100 5 L 100 50 L 0 50 Z"
                                                    fill="url(#chart-glow)"
                                                />

                                                {/* Data points */}
                                                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} cx="0" cy="40" r="1.5" fill="#fbbf24" />
                                                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} cx="40" cy="25" r="1.5" fill="#fbbf24" />
                                                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8 }} cx="70" cy="18" r="1.5" fill="#fbbf24" />
                                                <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.3 }} cx="100" cy="5" r="1.5" fill="#fbbf24" className="stroke-zinc-900 stroke-2" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Overlay to fade out bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
