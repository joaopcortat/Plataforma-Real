import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubjectData {
    name: string;
    value: number;
    color: string;
}

const SUBJECTS = [
    { key: 'linguagens', label: 'Linguagens', color: '#FFC832' },
    { key: 'humanas', label: 'Humanas', color: '#a78bfa' },
    { key: 'natureza', label: 'Natureza', color: '#34d399' },
    { key: 'matematica', label: 'Matemática', color: '#60a5fa' },
];

interface Props {
    metricsVersion?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const item = payload[0];
        return (
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-xl">
                <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">{item.name}</p>
                <p className="font-black text-lg" style={{ color: item.payload.color }}>
                    {item.value} <span className="text-zinc-500 text-xs font-medium">questões</span>
                </p>
                <p className="text-zinc-500 text-xs">{Math.round(item.payload.percent * 100)}% do total</p>
            </div>
        );
    }
    return null;
};

export function QuestionsPanel({ metricsVersion }: Props) {
    const [data, setData] = useState<SubjectData[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [metricsVersion]);

    async function fetchData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: sessions } = await supabase
                .from('study_sessions')
                .select('subject_breakdown, questions_count')
                .eq('user_id', user.id);

            const totals: Record<string, number> = { linguagens: 0, humanas: 0, natureza: 0, matematica: 0 };

            sessions?.forEach(s => {
                const bd = s.subject_breakdown;
                if (bd && typeof bd === 'object') {
                    SUBJECTS.forEach(sub => { totals[sub.key] += bd[sub.key] || 0; });
                }
            });

            const totalQ = Object.values(totals).reduce((a, b) => a + b, 0);
            setTotal(totalQ);

            const chartData = SUBJECTS
                .map(sub => ({ name: sub.label, value: totals[sub.key], color: sub.color }))
                .filter(d => d.value > 0);

            if (chartData.length === 0) {
                const rawTotal = sessions?.reduce((s, r) => s + (r.questions_count || 0), 0) || 0;
                if (rawTotal > 0) {
                    setTotal(rawTotal);
                    setData([{ name: 'Geral', value: rawTotal, color: '#FFC832' }]);
                } else {
                    setData([]);
                }
            } else {
                setData(chartData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const isEmpty = data.length === 0 || total === 0;

    return (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-primary/30 transition-colors">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 size={20} />
                </div>
                <div>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Questões Resolvidas</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-3xl font-bold text-white leading-none">{total}</h3>
                        <span className="text-sm font-medium text-zinc-500">total</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-[200px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : isEmpty ? (
                <div className="h-[200px] flex flex-col items-center justify-center gap-2 text-zinc-600">
                    <CheckCircle2 size={28} strokeWidth={1.5} />
                    <p className="text-xs font-medium">Nenhuma questão registrada ainda</p>
                    <p className="text-xs text-zinc-700">Use o registro de estudo para adicionar</p>
                </div>
            ) : (
                <div>
                    <div className="h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 space-y-2">
                        {data.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
                                    <span className="text-xs text-zinc-400 font-medium">{entry.name}</span>
                                </div>
                                <span className="text-xs font-bold text-white">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
