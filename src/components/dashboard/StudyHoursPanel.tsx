import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Clock, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, subDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DayData {
    date: string;
    label: string;
    hours: number;
}

interface StudyHoursPanelProps {
    metricsVersion?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl">
                <p className="text-zinc-400 text-xs mb-1">{label}</p>
                <p className="text-primary font-bold text-sm">
                    {payload[0].value.toFixed(1)}h estudadas
                </p>
            </div>
        );
    }
    return null;
};

export function StudyHoursPanel({ metricsVersion }: StudyHoursPanelProps) {
    const [chartData, setChartData] = useState<DayData[]>([]);
    const [avgHoursPerDay, setAvgHoursPerDay] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [metricsVersion]);

    async function fetchData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const today = new Date();
            const days: DayData[] = [];
            for (let i = 13; i >= 0; i--) {
                const d = subDays(today, i);
                days.push({
                    date: format(d, 'yyyy-MM-dd'),
                    label: format(d, 'dd/MM', { locale: ptBR }),
                    hours: 0,
                });
            }

            const since = days[0].date;
            const { data: sessions } = await supabase
                .from('study_sessions')
                .select('duration_seconds, created_at')
                .eq('user_id', user.id)
                .gte('created_at', since + 'T00:00:00');

            if (sessions) {
                sessions.forEach(s => {
                    const dateKey = format(parseISO(s.created_at), 'yyyy-MM-dd');
                    const day = days.find(d => d.date === dateKey);
                    if (day) {
                        day.hours += (s.duration_seconds || 0) / 3600;
                    }
                });
            }

            days.forEach(d => { d.hours = Math.round(d.hours * 10) / 10; });

            const daysWithStudy = days.filter(d => d.hours > 0);
            const total = days.reduce((sum, d) => sum + d.hours, 0);
            const avg = daysWithStudy.length > 0 ? total / daysWithStudy.length : 0;

            setChartData(days);
            setTotalHours(Math.round(total * 10) / 10);
            setAvgHoursPerDay(Math.round(avg * 10) / 10);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-primary/30 transition-colors h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Horas de Estudo</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-white leading-none">{avgHoursPerDay.toFixed(1)}</h3>
                            <span className="text-sm font-medium text-zinc-500">h / dia (média)</span>
                        </div>
                    </div>
                </div>
                <span className="text-xs text-zinc-600 font-medium">{totalHours}h total</span>
            </div>

            {/* Chart */}
            {loading ? (
                <div className="h-[160px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : (
                <div className="h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fill: '#52525b', fontSize: 9, fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                interval={1}
                            />
                            <YAxis
                                tick={{ fill: '#52525b', fontSize: 9 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `${v}h`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="hours"
                                stroke="#FFC832"
                                strokeWidth={2.5}
                                dot={{ fill: '#FFC832', strokeWidth: 0, r: 3 }}
                                activeDot={{ r: 5, fill: '#FFC832', strokeWidth: 2, stroke: '#18181b' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-600">
                <TrendingUp size={12} className="text-primary" />
                <span>Últimos 14 dias de estudo registrados</span>
            </div>
        </div>
    );
}
