import { FileText, CheckCircle2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface EssayStatsProps {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    averageScore: number;
    totalEssays: number;
    bestScore: number;
}

export function EssayStats({ c1, c2, c3, c4, c5, averageScore, totalEssays, bestScore }: EssayStatsProps) {
    const data = [
        { name: 'C1', label: 'Norma Culta', value: Math.round(c1) },
        { name: 'C2', label: 'Tema', value: Math.round(c2) },
        { name: 'C3', label: 'Argumentação', value: Math.round(c3) },
        { name: 'C4', label: 'Coesão', value: Math.round(c4) },
        { name: 'C5', label: 'Proposta', value: Math.round(c5) },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl">
                    <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">{data.name} — {data.label}</p>
                    <p className="text-primary font-black text-lg">{data.value} <span className="text-zinc-500 text-xs font-medium">/ 200</span></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Top Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <CheckCircle2 size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Média Geral</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-3xl font-bold text-white leading-none">{Math.round(averageScore)}</h3>
                                <span className="text-sm font-medium text-zinc-500">/ 1000</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 shrink-0">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Melhor Nota</p>
                            <div className="flex items-baseline gap-1">
                                <h3 className="text-3xl font-bold text-white leading-none">{bestScore > 0 ? bestScore : '—'}</h3>
                                {bestScore > 0 && <span className="text-sm font-medium text-zinc-500">/ 1000</span>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Total Corrigidas</p>
                            <h3 className="text-3xl font-bold text-white leading-none">{totalEssays}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bar Chart para Competências */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-white">Média por Competência</h4>
                    <span className="text-xs text-zinc-500 font-medium">Pontuação máxima: 200</span>
                </div>

                <div className="h-[250px] w-full">
                    {totalEssays === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                            <FileText size={32} className="opacity-50" />
                            <span className="text-sm font-medium opacity-80">Sem dados de correção</span>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[0, 200]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#52525b', fontSize: 11 }}
                                    ticks={[0, 40, 80, 120, 160, 200]}
                                />
                                <Tooltip cursor={{ fill: '#27272a', opacity: 0.4, radius: 8 }} content={<CustomTooltip />} />
                                <ReferenceLine y={160} stroke="#3f3f46" strokeDasharray="3 3" />
                                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.value >= 160 ? '#FFC832' : entry.value >= 120 ? '#Fcd34d' : '#a1a1aa'}
                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
