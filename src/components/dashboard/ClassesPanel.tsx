import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubjectData {
    name: string;
    value: number;
    color: string;
}

// Subject colors matching QuestionsPanel for consistency
const SUBJECT_COLORS = [
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
                    {item.value} <span className="text-zinc-500 text-xs font-medium">aula{item.value !== 1 ? 's' : ''}</span>
                </p>
            </div>
        );
    }
    return null;
};

export function ClassesPanel({ metricsVersion }: Props) {
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
                .select('classes_count, subject_breakdown')
                .eq('user_id', user.id);

            const totals: Record<string, number> = { linguagens: 0, humanas: 0, natureza: 0, matematica: 0 };
            let hasSubjectData = false;

            sessions?.forEach(s => {
                const bd = s.subject_breakdown;
                if (bd && typeof bd === 'object') {
                    const keysMap = [
                        ['classes_linguagens', 'linguagens'],
                        ['classes_humanas', 'humanas'],
                        ['classes_natureza', 'natureza'],
                        ['classes_matematica', 'matematica'],
                    ];
                    keysMap.forEach(([k, sub]) => {
                        if (typeof bd[k] === 'number' && bd[k] > 0) {
                            totals[sub] += bd[k];
                            hasSubjectData = true;
                        }
                    });
                }
            });

            const totalClasses = sessions?.reduce((s, r) => s + (r.classes_count || 0), 0) || 0;
            setTotal(totalClasses);

            if (hasSubjectData) {
                const chartData = SUBJECT_COLORS
                    .map(sub => ({ name: sub.label, value: totals[sub.key], color: sub.color }))
                    .filter(d => d.value > 0);
                setData(chartData);
            } else if (totalClasses > 0) {
                setData([{ name: 'Aulas Registradas', value: totalClasses, color: '#FFC832' }]);
            } else {
                setData([]);
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
                    <BookOpen size={20} />
                </div>
                <div>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Aulas Assistidas</p>
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
                    <BookOpen size={28} strokeWidth={1.5} />
                    <p className="text-xs font-medium">Nenhuma aula registrada ainda</p>
                    <p className="text-xs text-zinc-700">Especifique a matéria no registro de estudo</p>
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
                                    paddingAngle={data.length > 1 ? 3 : 0}
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
