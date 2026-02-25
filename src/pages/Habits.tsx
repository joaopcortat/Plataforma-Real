import { useState, useEffect, useMemo } from 'react';
import { fetchHabits, fetchHabitLogs, createHabit, deleteHabit, type Habit, type HabitLog } from '../services/habits';
import { ProgressChart } from '../components/habits/ProgressChart';
import { HabitGrid } from '../components/habits/HabitGrid';
import { Plus, Settings2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { startOfWeek, subWeeks, endOfWeek } from 'date-fns';

// Calculate the date range to display: the last 2 full Mon–Sun weeks
function getTwoWeekRange() {
    const today = new Date();
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const prevWeekStart = subWeeks(thisWeekStart, 1);
    const prevWeekEnd = endOfWeek(prevWeekStart, { weekStartsOn: 1 }); // Sunday

    // We show: previous Mon → current Sun
    const rangeStart = prevWeekStart;
    const rangeEnd = endOfWeek(today, { weekStartsOn: 1 });

    return { rangeStart, rangeEnd, thisWeekStart, prevWeekEnd };
}

export function Habits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [serverLogs, setServerLogs] = useState<HabitLog[]>([]);
    // localLogs mirrors serverLogs but gets optimistic updates instantly
    const [localLogs, setLocalLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newHabitName, setNewHabitName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const range = useMemo(() => getTwoWeekRange(), []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [fetchedHabits, fetchedLogs] = await Promise.all([
                fetchHabits(),
                fetchHabitLogs(14)
            ]);
            setHabits(fetchedHabits);
            setServerLogs(fetchedLogs);
            setLocalLogs(fetchedLogs); // sync local state with server
        } catch (err: unknown) {
            console.error("Failed to load habits", err);
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes('relation') || msg.includes('does not exist') || msg.includes('42P01') || msg.includes('undefined')) {
                setError('setup_required');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleCreateHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim() || isCreating) return;
        try {
            setIsCreating(true);
            await createHabit(newHabitName.trim());
            setNewHabitName('');
            await loadData();
        } catch (err) {
            console.error("Failed to create habit", err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteHabit = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja remover o hábito "${name}"? Todo o histórico será perdido.`)) return;
        try {
            await deleteHabit(id);
            await loadData();
        } catch (err) {
            console.error("Failed to delete habit", err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Tarefas Diárias</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Sua central de execução diária — hábitos, consistência e progresso.
                    </p>
                </div>

                {!error && !loading && (
                    <div className="flex flex-row gap-3 items-center">
                        <form onSubmit={handleCreateHabit} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Novo hábito..."
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary w-48 sm:w-60 transition-colors placeholder:text-zinc-600"
                                disabled={isCreating}
                            />
                            <button
                                type="submit"
                                disabled={isCreating || !newHabitName.trim()}
                                className="bg-primary/10 text-primary px-3 py-2 rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-40 border border-primary/20 flex items-center justify-center"
                            >
                                {isCreating
                                    ? <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                                    : <Plus size={18} />}
                            </button>
                        </form>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            title="Editar / remover hábitos"
                            className={`p-2.5 rounded-xl border transition-all ${isEditing
                                ? 'bg-zinc-800 border-zinc-600 text-white'
                                : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                                }`}
                        >
                            <Settings2 size={18} />
                        </button>
                    </div>
                )}
            </header>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : error === 'setup_required' ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Configuração necessária</h2>
                        <p className="text-zinc-400 text-sm max-w-md">
                            As tabelas de hábitos ainda não foram criadas no banco de dados.
                            Execute o script abaixo no <strong className="text-white">SQL Editor</strong> do seu projeto Supabase:
                        </p>
                    </div>
                    <div className="w-full max-w-2xl text-left bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <p className="text-xs text-zinc-500 mb-2 font-mono">supabase/migrations/003_habits.sql</p>
                        <pre className="text-xs text-zinc-300 overflow-auto font-mono whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS public.habits (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habit_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id   UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date       DATE NOT NULL DEFAULT CURRENT_DATE,
    completed  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, date)
);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own habit logs" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);`}</pre>
                    </div>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 text-primary rounded-xl hover:bg-primary/20 transition-all font-medium"
                    >
                        <CheckCircle2 size={18} /> Já executei, tentar novamente
                    </button>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-zinc-500 text-sm">
                    Erro ao carregar hábitos: {error}
                    <button onClick={loadData} className="block mx-auto mt-4 text-primary hover:underline">Tentar novamente</button>
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-primary">Progresso Geral dos Hábitos</h2>
                        {/* Chart always uses localLogs so it reacts to optimistic updates instantly */}
                        <ProgressChart habits={habits} logs={localLogs} range={range} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-primary">Grade de Hábitos</h2>
                            {isEditing && (
                                <span className="text-xs text-zinc-500 animate-pulse">Modo edição — clique no ícone para remover</span>
                            )}
                        </div>
                        {/* Grid shares same localLogs and can update it via onOptimisticUpdate */}
                        <HabitGrid
                            habits={habits}
                            logs={localLogs}
                            serverLogs={serverLogs}
                            range={range}
                            onOptimisticUpdate={setLocalLogs}
                            onLogUpdate={loadData}
                            isEditing={isEditing}
                            onDeleteHabit={handleDeleteHabit}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
