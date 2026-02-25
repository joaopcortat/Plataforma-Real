import { motion } from 'framer-motion';

export function PlatformPreview() {
    return (
        <section id="plataforma" className="py-24 relative overflow-hidden bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-6"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            Uma interface projetada para <span className="text-primary">reduzir atrito</span>.
                        </h2>
                        <p className="text-lg text-zinc-400">
                            Cada milissegundo conta quando o assunto é o seu tempo líquido de estudos. Desenvolvemos uma interface
                            completamente minimalista, rápida como um raio e livre de distrações, com tudo o que você precisa a um clique.
                        </p>

                        <div className="flex flex-col gap-8 mt-6">
                            {[
                                { title: 'Dashboard Dinâmico', text: 'Métricas atualizadas em tempo real à medida que você conclui sessões de estudo.' },
                                { title: 'Modo Foco em Tela Cheia', text: 'Bloqueie estímulos enquanto estuda com o cronômetro nativo do aplicativo.' },
                                { title: 'Navegação Ultra Rápida', text: 'Construído com tecnologia premium, o sistema reza 60 quadros de animação por segundo.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-zinc-400">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative hidden sm:block"
                    >
                        {/* Glowing Background Blur */}
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-2 shadow-2xl flex flex-col overflow-hidden">
                            {/* Decorative Sidebar Preview */}
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-h-[600px] overflow-hidden flex shadow-inner">
                                <div className="w-20 lg:w-48 bg-zinc-900 border-r border-zinc-800 flex flex-col gap-4 p-4 shrink-0 shadow-lg">
                                    <div className="w-8 h-8 rounded-lg bg-primary/20 mb-6" />
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-full h-8 bg-zinc-800/50 rounded-lg flex items-center px-3" />
                                    ))}
                                </div>
                                <div className="flex-1 p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-1/3 h-8 bg-zinc-800 rounded-lg" />
                                        <div className="w-10 h-10 rounded-full bg-zinc-800" />
                                    </div>
                                    {/* Bento Grid Preview */}
                                    <div className="grid grid-cols-2 gap-4 h-32">
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden">
                                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary/10 to-transparent" />
                                        </div>
                                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl" />
                                    </div>
                                    <div className="flex-1 min-h-[150px] bg-zinc-900 border border-zinc-800 rounded-xl relative group overflow-hidden pointer-events-none">
                                        <div className="absolute inset-0 flex items-end opacity-40">
                                            {/* Fake Chart bars */}
                                            {[20, 45, 30, 70, 50, 90, 60, 45, 80].map((h, j) => (
                                                <div key={j} className="flex-1 bg-primary mx-[2px] rounded-t-sm" style={{ height: `${h}%` }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Absolute positioning of tiny floating cards for parallax feel */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -right-12 top-20 w-48 h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur-md hidden lg:flex flex-col gap-2"
                        >
                            <div className="text-xs font-semibold text-zinc-500">Horas Líquidas</div>
                            <div className="text-2xl font-black text-white">4h 32m</div>
                            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-auto overflow-hidden">
                                <div className="w-[75%] h-full bg-primary" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -left-12 bottom-20 w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur-md hidden lg:flex flex-col gap-3"
                        >
                            <div className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-bold">✓</div>
                            <div>
                                <div className="text-sm font-bold text-white">Meta Diária</div>
                                <div className="text-xs text-zinc-400">Batida com sucesso</div>
                            </div>
                        </motion.div>

                    </motion.div>

                </div>
            </div>
        </section>
    );
}
