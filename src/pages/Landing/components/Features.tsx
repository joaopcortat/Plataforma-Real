import { motion } from 'framer-motion';
import { Target, Clock, BarChart, Zap } from 'lucide-react';

const features = [
    {
        title: "Gerador de Cronograma Inteligente",
        description: "Um cronograma que se adapta à sua rotina. Escolha as matérias, os dias livres e a plataforma cria o planejamento perfeito matematicamente.",
        icon: <Clock className="w-6 h-6 text-primary" />
    },
    {
        title: "Simulados Corrigidos e Rankeados",
        description: "Faça provas simuladas no padrão real. Seus erros são mapeados, e você descobre exatamente quais assuntos precisa revisar.",
        icon: <Target className="w-6 h-6 text-primary" />
    },
    {
        title: "Análise de Performance",
        description: "Painéis de controle completos mostrando sua evolução por matéria, tempo médio por questão e predição de nota.",
        icon: <BarChart className="w-6 h-6 text-primary" />
    },
    {
        title: "Métricas Avançadas",
        description: "Conheça seus pontos cegos. O aplicativo acompanha cada minuto de estudo líquido e correlaciona com seu desempenho.",
        icon: <Zap className="w-6 h-6 text-primary" />
    }
];

export function Features() {
    return (
        <section id="recursos" className="py-24 relative bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Não é só estudar. É ter <span className="text-primary">direção clara.</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        A Plataforma Real foi construída com tecnologia de ponta para substituir planilhas complexas, resumos perdidos e simulados desorganizados.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-primary/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                                {feature.icon}
                            </div>

                            <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-[0_0_15px_rgba(251,191,36,0.15)] transition-shadow">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
