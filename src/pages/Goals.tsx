import { GoalCard } from '../components/goals/GoalCard'; // Fixed import path
import { useStudy } from '../contexts/StudyContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function Goals() {
    const { goals } = useStudy();

    const completedCount = goals.filter(g => g.current >= g.target).length;
    const totalCount = goals.length;

    const data = [
        { name: 'Concluídas', value: completedCount },
        { name: 'Em Andamento', value: totalCount - completedCount },
    ];

    const COLORS = ['#10b981', '#3f3f46']; // Emerald-500, Zinc-700

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quadro de Metas 🎯</h1>
                    <p className="text-zinc-400">Acompanhe seu progresso e mantenha o foco nos objetivos.</p>
                </div>

                {/* Simple Health Indicator */}
                <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border border-zinc-800 bg-zinc-900/50">
                    <div className="text-sm font-medium text-zinc-400">Saúde do Plano</div>
                    <div className="h-2 w-24 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                        />
                    </div>
                    <div className="text-emerald-400 font-bold">{totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Goals Grid */}
                <div className="lg:col-span-2 space-y-4">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>

                {/* Summary / Doughnut Chart */}
                <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center min-h-[300px]">
                    <h3 className="text-lg font-bold text-white mb-4">Status Geral</h3>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-white">{completedCount}/{totalCount}</span>
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Metas</span>
                        </div>
                    </div>
                    <p className="text-center text-zinc-400 text-sm mt-6 px-4">
                        Você está no caminho certo! Mantenha a constância para atingir todas as metas do mês.
                    </p>
                </div>
            </div>
        </div>
    );
}
