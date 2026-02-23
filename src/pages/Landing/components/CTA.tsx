import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

export function CTA() {
    return (
        <section id="checkout" className="py-32 relative overflow-hidden bg-zinc-950">
            {/* Glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-amber-500/10 rounded-[100%] blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 md:p-16 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Lock className="w-48 h-48 text-amber-500" />
                    </div>

                    <div className="inline-flex justify-center items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-sm mb-6 relative z-10">
                        Vagas Limitadas / Acesso Exclusivo
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight relative z-10">
                        Pronto para mudar o rumo dos seus estudos?
                    </h2>

                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto relative z-10">
                        A plataforma ainda não está aberta para o público geral. Cadastre-se na nossa lista VIP agora para garantir acesso antecipado com <strong className="text-amber-400">50% de desconto</strong> no dia do lançamento.
                    </p>

                    <button
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-waitlist')); }}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 h-16 px-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] relative z-10"
                    >
                        Garantir acesso antecipado (50% OFF)
                        <ArrowRight className="w-6 h-6" />
                    </button>

                    <p className="text-sm text-zinc-500 mt-6 relative z-10">
                        Sem compromisso. Entrar na lista VIP é 100% gratuito.
                    </p>
                </motion.div>
            </div>

            <footer className="mt-32 border-t border-zinc-900 py-12 relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center">
                            <span className="font-bold text-[10px] text-zinc-900">R</span>
                        </div>
                        <span className="text-sm font-medium text-white">Estudo Real</span>
                    </div>
                    <p className="text-sm text-zinc-500">© 2026 Estudo Real. Todos os direitos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Termos de Uso</a>
                        <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Privacidade</a>
                    </div>
                </div>
            </footer>
        </section>
    );
}
