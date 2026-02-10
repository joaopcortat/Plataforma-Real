import { useState, useEffect } from 'react';
import { BarChart3, Target, Award, Clock } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../lib/supabase';
import { format, subDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Performance() {
    const [stats, setStats] = useState({
        studyHours: 0,
        completedTasks: 0,
        completionRate: 0,
        streak: 0
    });
    const [weeklyActivity, setWeeklyActivity] = useState<number[]>([]);
    const [subjectStats, setSubjectStats] = useState<{ label: string, val: number, color: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPerformanceData();
    }, []);

    async function fetchPerformanceData() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch tasks only once for analysis
            const { data: tasks } = await supabase
                .from('schedule_tasks')
                .select('*')
                .eq('user_id', user.id);

            if (!tasks) return;

            // 1. Calculate General Stats
            const completed = tasks.filter(t => t.completed);
            const totalTasks = tasks.length;
            const completionRate = totalTasks > 0 ? Math.round((completed.length / totalTasks) * 100) : 0;

            // Assume 90min per task for MVP (since we don't have exact duration logged per task instance yet)
            // or use specific logic if we added duration column. using 1.5h
            const studyHours = Math.round(completed.length * 1.5);

            // 2. Weekly Activity (Last 7 days)
            const today = new Date();
            const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
            const activity = last7Days.map(day => {
                const dayTasks = completed.filter(t => isSameDay(new Date(t.date), day));
                // Return percentage of goal? Or raw count? using raw count * 20 for height scaling demo
                return Math.min(dayTasks.length * 20, 100);
            });

            // 3. Subject Stats
            const subjects: Record<string, { total: number, done: number }> = {};
            tasks.forEach(t => {
                const sub = t.subject || 'Outros';
                if (!subjects[sub]) subjects[sub] = { total: 0, done: 0 };
                subjects[sub].total++;
                if (t.completed) subjects[sub].done++;
            });

            // Convert to array and sort by volume
            const subjArray = Object.entries(subjects)
                .map(([label, { total, done }]) => ({
                    label,
                    val: total > 0 ? Math.round((done / total) * 100) : 0,
                    color: getColorForSubject(label)
                }))
                .sort((a, b) => b.val - a.val)
                .slice(0, 4);

            setStats({
                studyHours,
                completedTasks: completed.length,
                completionRate,
                streak: calculateStreak(completed)
            });
            setWeeklyActivity(activity);
            setSubjectStats(subjArray);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function calculateStreak(_completedTasks: any[]) {
        // Simple streak logic placeholder
        return 0; // efficient calculation requires sorting dates, keeping simple for now
    }

    function getColorForSubject(subject: string) {
        const hash = subject.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const colors = ['bg-yellow-500', 'bg-emerald-500', 'bg-purple-500', 'bg-blue-500', 'bg-pink-500'];
        return colors[hash % colors.length];
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Desempenho</h1>
                <p className="text-zinc-400">Acompanhe sua evolução e métricas de estudo em tempo real.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Tempo de Estudo', value: `${stats.studyHours}h`, change: 'Estimado', icon: Clock, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { title: 'Exercícios/Tarefas', value: stats.completedTasks, change: 'Concluídos', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { title: 'Taxa de Conclusão', value: `${stats.completionRate}%`, change: 'Geral', icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                    { title: 'Nível Atual', value: 'Prata', change: 'Em breve', icon: Award, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                                <stat.icon size={20} />
                            </div>

                        </div>
                        <h3 className="text-zinc-400 text-sm font-medium mb-1">{stat.title}</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <span className="text-xs font-medium text-zinc-500">{stat.change}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Atividade Recente (7 Dias)</h3>
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-zinc-500">Carregando dados...</div>
                    ) : (
                        <div className="h-64 flex items-end justify-between gap-2">
                            {weeklyActivity.map((h, i) => (
                                <div key={i} className="w-full bg-zinc-800 rounded-t-lg relative group h-full flex flex-col justify-end">
                                    <div
                                        className="bg-primary/50 hover:bg-primary transition-all rounded-t-lg w-full duration-1000"
                                        style={{ height: `${h}%`, minHeight: '4px' }}
                                    />
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-zinc-500 font-medium capitalize">
                                        {format(subDays(new Date(), 6 - i), 'EEE', { locale: ptBR })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Por Matéria</h3>
                    <div className="space-y-4">
                        {loading ? <p className="text-zinc-500">Carregando...</p> : subjectStats.length === 0 ? <p className="text-zinc-500">Nenhuma tarefa concluída.</p> : subjectStats.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-300">{item.label}</span>
                                    <span className="text-white font-bold">{item.val}%</span>
                                </div>
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className={clsx("h-full rounded-full", item.color)} style={{ width: `${item.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
