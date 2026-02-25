import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function Guarantee() {
    return (
        <section className="py-20 bg-zinc-950 relative overflow-hidden">
            {/* Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-primary/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-[0_0_40px_rgba(251,191,36,0.05)]"
                >
                    {/* Badge */}
                    <div className="shrink-0 relative">
                        <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse" />
                        <div className="w-24 h-24 bg-zinc-900 border border-primary/30 rounded-full flex items-center justify-center relative shadow-inner">
                            <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1.5} />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-zinc-950 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg transform rotate-12">
                            7 Dias
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="text-center md:text-left flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Risco Zero. Teste com garantia <span className="text-primary">Incondicional</span>
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Entre e teste você mesmo a Plataforma Real. Use o cronograma, faça simulados, navegue pelos módulos.
                            Se por qualquer motivo você sentir que ela não é para você, basta nos enviar um e-mail dentro de 7 dias
                            e devolveremos 100% do seu dinheiro. <strong className="text-zinc-300 font-semibold text-base">Sem ressentimentos, sem enrolação.</strong>
                        </p>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
