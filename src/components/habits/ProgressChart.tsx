import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { format, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Habit, HabitLog } from '../../services/habits';

interface WeekRange {
    rangeStart: Date;
    rangeEnd: Date;
    thisWeekStart: Date;
    prevWeekEnd: Date;
}

interface ProgressChartProps {
    habits: Habit[];
    logs: HabitLog[]; // now receives localLogs for instant reactivity
    range: WeekRange;
}

export function ProgressChart({ habits, logs, range }: ProgressChartProps) {
    const data = useMemo(() => {
        if (habits.length === 0) return [];

        const dateRange = eachDayOfInterval({ start: range.rangeStart, end: range.rangeEnd });

        return dateRange.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayLogs = logs.filter(l => l.date === dateStr);
            const completed = dayLogs.filter(l => l.completed).length;
            const percentage = habits.length > 0 ? (completed / habits.length) * 100 : 0;

            return {
                date: format(date, 'EEEEE', { locale: ptBR }).toUpperCase(),
                dateStr,
                percentage: Math.round(percentage),
            };
        });
    }, [habits, logs, range]);

    if (habits.length === 0) {
        return (
            <div className="h-64 w-full flex items-center justify-center bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-zinc-500 text-sm">Adicione hábitos para ver o progresso</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#eab308' }}
                        labelStyle={{ color: '#a1a1aa' }}
                        formatter={(v) => [`${v ?? 0}%`, 'Completado']}
                    />
                    <Area type="monotone" dataKey="percentage" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorPercentage)" animationDuration={800} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
