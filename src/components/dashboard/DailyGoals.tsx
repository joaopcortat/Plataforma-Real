import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Plus, Settings, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DailyGoalType {
    questions_target: number;
    questions_done: number;
    classes_target: number;
    classes_done: number;
    tasks?: string[];
}

export function DailyGoals() {
    const [goals, setGoals] = useState<DailyGoalType>({
        questions_target: 30,
        questions_done: 0,
        classes_target: 4,
        classes_done: 0,
        tasks: []
    });
    const [originalGoals, setOriginalGoals] = useState<DailyGoalType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchGoals();
    }, []);

    async function fetchGoals() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('daily_goals')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            if (data) {
                setGoals(data);
                setOriginalGoals(data);
            } else if (!error) {
                const { data: newGoal } = await supabase
                    .from('daily_goals')
                    .insert([{ user_id: user.id, date: today }])
                    .select()
                    .single();

                if (newGoal) {
                    setGoals(newGoal);
                    setOriginalGoals(newGoal);
                }
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    }

    async function incrementGoal(type: 'questions' | 'classes') {
        const field = type === 'questions' ? 'questions_done' : 'classes_done';
        const newValue = goals[field] + 1;

        setGoals(prev => ({ ...prev, [field]: newValue }));

        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('daily_goals')
                .update({ [field]: newValue })
                .eq('user_id', user.id)
                .eq('date', today);
        } catch (error) {
            console.error('Error updating goal:', error);
            setGoals(prev => ({ ...prev, [field]: prev[field] - 1 }));
        }
    }

    async function saveTargets() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setIsEditing(false); // Optimistic UI

            await supabase
                .from('daily_goals')
                .update({
                    questions_target: goals.questions_target,
                    classes_target: goals.classes_target
                })
                .eq('user_id', user.id)
                .eq('date', today);

            setOriginalGoals(goals);

        } catch (error) {
            console.error('Error saving targets:', error);
            if (originalGoals) setGoals(originalGoals); // Revert
        }
    }

    const cancelEdit = () => {
        if (originalGoals) setGoals(originalGoals);
        setIsEditing(false);
    }


    const items = [
        {
            id: 1,
            label: 'Questões Hoje',
            icon: CheckCircle2,
            current: goals.questions_done,
            target: goals.questions_target,
            targetField: 'questions_target' as const,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10'
        },
        {
            id: 2,
            label: 'Aulas Hoje',
            icon: BookOpen,
            current: goals.classes_done,
            target: goals.classes_target,
            targetField: 'classes_target' as const,
            color: 'bg-blue-500',
            textColor: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        }
    ];

    if (loading) return <div className="animate-pulse h-[100px] bg-zinc-900/50 rounded-xl" />;

    return (
        <div className="space-y-6 relative group/container">
            {/* Edit Button (Top Right) */}
            <div className="absolute top-0 right-0 z-20 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveTargets}
                            className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                            title="Salvar Metas"
                        >
                            <Save size={14} />
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            title="Cancelar"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="opacity-0 group-hover/container:opacity-100 p-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-all"
                        title="Configurar Metas"
                    >
                        <Settings size={14} />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((goal) => {
                    const percentage = Math.round((goal.current / goal.target) * 100);
                    const Icon = goal.icon;

                    return (
                        <div key={goal.id} className={`group relative overflow-hidden rounded-3xl p-6 border ${isEditing ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-zinc-800 bg-zinc-900/50'} hover:bg-zinc-900/80 transition-all duration-500`}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${goal.bgColor} ${goal.textColor} bg-opacity-10 ring-1 ring-white/5`}>
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{goal.label}</h4>
                                        <span className="text-xs text-zinc-500">Meta diária</span>
                                    </div>
                                </div>
                                <div className={`text-xl font-bold ${goal.textColor}`}>
                                    {isFinite(percentage) ? percentage : 0}%
                                </div>
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-white">{goal.current}</span>
                                    <span className="text-sm text-zinc-500">/ </span>

                                    {/* Editable Target */}
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={goals[goal.targetField]}
                                            onChange={(e) => setGoals(prev => ({ ...prev, [goal.targetField]: parseInt(e.target.value) || 0 }))}
                                            className="w-12 bg-zinc-800 border border-zinc-700 text-white text-sm rounded px-1 text-center focus:outline-none focus:border-yellow-500"
                                        />
                                    ) : (
                                        <span className="text-sm text-zinc-500">{goal.target}</span>
                                    )}

                                </div>
                                {!isEditing && (
                                    <button
                                        onClick={() => incrementGoal(goal.id === 1 ? 'questions' : 'classes')}
                                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                                        title="Adicionar +1"
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Progress Bar only shown when NOT editing to keep UI clean */}
                            {!isEditing && (
                                <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${goal.color} transition-all duration-1000 ease-out`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Tasks / Topics List */}
            {goals.tasks && goals.tasks.length > 0 && (
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5">
                    <h4 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        Tópicos Estudados Hoje
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {goals.tasks.map((task, index) => (
                            <span
                                key={index}
                                className="px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-300 font-medium"
                            >
                                {task}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
