import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

const features = [
    {
        name: 'Cronograma Adaptável Inteligente',
        real: true,
        generic: false,
        manual: false,
    },
    {
        name: 'Análise Preditiva de Desempenho',
        real: true,
        generic: false,
        manual: false,
    },
    {
        name: 'Cronômetro Líquido Nativo',
        real: true,
        generic: false,
        manual: false,
    },
    {
        name: 'Correção Inteligente de Simulados',
        real: true,
        generic: true,
        manual: false,
    },
    {
        name: 'Custo de Tempo em Atualizações',
        real: 'Automático (Zero)',
        generic: 'Moderado',
        manual: 'Altíssimo',
    },
    {
        name: 'Foco da Ferramenta',
        real: 'Aprovação Acelerada',
        generic: 'Anotações e Tarefas',
        manual: 'Tabelas e Burocracia',
    }
];

export function Comparison() {
    return (
        <section id="comparativo" className="py-16 md:py-24 bg-zinc-950 relative">
            <div className="max-w-6xl mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Por que a Estudo Real<br />
                        <span className="text-primary">destrói o padrão do mercado?</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Chega de adaptar ferramentas corporativas (Notion, Trello) para estudar, ou perder horas montando planilhas no Excel.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-900/80">
                                    <th className="p-4 md:p-6 text-sm font-semibold text-zinc-400 w-1/3">Recursos & Foco</th>
                                    <th className="p-4 md:p-6 text-center border-l border-zinc-800 bg-primary/5">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-primary font-black text-lg">Estudo Real</span>
                                            <span className="text-xs text-primary/80 font-normal">O Ecossistema Completo</span>
                                        </div>
                                    </th>
                                    <th className="p-6 text-center border-l border-zinc-800">
                                        <span className="text-white font-bold text-base">Apps Genéricos</span>
                                        <p className="text-xs text-zinc-500 font-normal mt-1">(Notion, Todoist, etc)</p>
                                    </th>
                                    <th className="p-6 text-center border-l border-zinc-800">
                                        <span className="text-white font-bold text-base">Planilhas</span>
                                        <p className="text-xs text-zinc-500 font-normal mt-1">(Excel, Sheets)</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {features.map((feature, i) => (
                                    <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                                        <td className="p-3 md:p-6 text-sm font-medium text-white">{feature.name}</td>

                                        {/* Estudo Real Column */}
                                        <td className="p-3 md:p-6 text-center border-l border-zinc-800 bg-primary/5 relative">
                                            {typeof feature.real === 'boolean' ? (
                                                feature.real ? (
                                                    <Check className="w-6 h-6 text-primary mx-auto" strokeWidth={3} />
                                                ) : (
                                                    <X className="w-6 h-6 text-zinc-600 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-primary font-semibold">{feature.real}</span>
                                            )}
                                        </td>

                                        {/* Generic Apps Column */}
                                        <td className="p-3 md:p-6 text-center border-l border-zinc-800 text-zinc-400 relative">
                                            {typeof feature.generic === 'boolean' ? (
                                                feature.generic ? (
                                                    <Check className="w-5 h-5 text-zinc-500 mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-zinc-600 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm">{feature.generic}</span>
                                            )}
                                        </td>

                                        {/* Manual Spreadsheets Column */}
                                        <td className="p-3 md:p-6 text-center border-l border-zinc-800 text-zinc-400 relative">
                                            {typeof feature.manual === 'boolean' ? (
                                                feature.manual ? (
                                                    <Check className="w-5 h-5 text-zinc-500 mx-auto" />
                                                ) : (
                                                    <Minus className="w-5 h-5 text-zinc-600 mx-auto" />
                                                )
                                            ) : (
                                                <span className="text-sm">{feature.manual}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-zinc-900 border-t border-zinc-800 p-6 text-center">
                        <p className="text-sm text-zinc-400">
                            Enquanto as outras ferramentas fazem de você um gerenciador de tarefas, <strong className="text-white">nós fazemos de você um aprovado.</strong>
                        </p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
