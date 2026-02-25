import { useState } from 'react';
import { format, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toggleHabitLog, type Habit, type HabitLog } from '../../services/habits';
import { Check, Trash2 } from 'lucide-react';

interface WeekRange {
    rangeStart: Date;
    rangeEnd: Date;
    thisWeekStart: Date;
    prevWeekEnd: Date;
}

interface HabitGridProps {
    habits: Habit[];
    logs: HabitLog[];                                    // shared localLogs from parent
    serverLogs: HabitLog[];                              // last known server state for revert
    range: WeekRange;
    onOptimisticUpdate: (updater: (prev: HabitLog[]) => HabitLog[]) => void; // update shared state
    onLogUpdate: () => void;                             // force full refresh on error
    isEditing?: boolean;
    onDeleteHabit?: (id: string, name: string) => void;
}

export function HabitGrid({ habits, logs, serverLogs, range, onOptimisticUpdate, onLogUpdate, isEditing, onDeleteHabit }: HabitGridProps) {
    const [syncing, setSyncing] = useState<Set<string>>(new Set());

    // Build day array from Mon-Sun range
    const days = eachDayOfInterval({ start: range.rangeStart, end: range.rangeEnd }).map(date => ({
        date,
        dateStr: format(date, 'yyyy-MM-dd'),
        dayLabel: format(date, 'dd'),
        weekdayLabel: format(date, 'EEEEE', { locale: ptBR }).toUpperCase(),
        isToday: isToday(date),
        isThisWeek: date >= range.thisWeekStart,
    }));

    const handleToggle = async (habit: Habit, dateStr: string, currentlyCompleted: boolean) => {
        const key = `${habit.id}-${dateStr}`;
        if (syncing.has(key)) return;

        const nextCompleted = !currentlyCompleted;

        // Instant optimistic update → both grid AND chart react immediately
        onOptimisticUpdate(prev => {
            const existing = prev.find(l => l.habit_id === habit.id && l.date === dateStr);
            if (existing) {
                return prev.map(l =>
                    l.habit_id === habit.id && l.date === dateStr ? { ...l, completed: nextCompleted } : l
                );
            }
            return [...prev, {
                id: `tmp-${key}`,
                user_id: habit.user_id,
                habit_id: habit.id,
                date: dateStr,
                completed: nextCompleted,
            }];
        });

        setSyncing(prev => new Set(prev).add(key));

        try {
            const saved = await toggleHabitLog(habit.id, dateStr, nextCompleted);
            // Replace temp entry with real DB row
            onOptimisticUpdate(prev => prev.map(l =>
                (l.id === `tmp-${key}` || (l.habit_id === habit.id && l.date === dateStr)) ? saved : l
            ));
        } catch (err) {
            console.error('Toggle failed', err);
            // Revert to last server state
            onOptimisticUpdate(() => serverLogs);
            onLogUpdate();
        } finally {
            setSyncing(prev => { const s = new Set(prev); s.delete(key); return s; });
        }
    };

    if (habits.length === 0) {
        return (
            <div className="h-40 w-full flex items-center justify-center bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-zinc-500 text-sm">Nenhum hábito cadastrado.</p>
            </div>
        );
    }

    // Split days into 2 weeks for column headers
    const prevWeekDays = days.filter(d => !d.isThisWeek);
    const thisWeekDays = days.filter(d => d.isThisWeek);

    return (
        <div className="w-full bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Week labels */}
                <div className="flex items-center mb-2 pl-64">
                    <div className="flex-1 flex">
                        <div
                            className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center"
                            style={{ width: `${(prevWeekDays.length / days.length) * 100}%` }}
                        >
                            Semana anterior
                        </div>
                        <div
                            className="text-[10px] font-semibold text-primary uppercase tracking-widest text-center"
                            style={{ width: `${(thisWeekDays.length / days.length) * 100}%` }}
                        >
                            Esta semana
                        </div>
                    </div>
                </div>

                {/* Day numbers */}
                <div className="flex items-center mb-5">
                    <div className="w-64 flex-shrink-0 text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">Hábito</div>
                    <div className="flex-1 flex justify-between">
                        {days.map(d => (
                            <div
                                key={d.dateStr}
                                className={`w-7 flex flex-col items-center gap-0.5 text-xs ${d.isToday ? 'text-primary font-bold' : 'text-zinc-600'}`}
                            >
                                <span className="text-[9px] opacity-70">{d.weekdayLabel}</span>
                                <span>{d.dayLabel}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Habit rows */}
                <div className="space-y-3">
                    {habits.map(habit => {
                        const habitLogs = logs.filter(l => l.habit_id === habit.id);
                        const completedCount = days.filter(d =>
                            habitLogs.some(l => l.date === d.dateStr && l.completed)
                        ).length;
                        const percentage = Math.round((completedCount / days.length) * 100);

                        return (
                            <div key={habit.id} className="flex items-center group">
                                {/* Name + progress bar */}
                                <div className="w-64 flex-shrink-0 flex items-center gap-2 pr-4">
                                    {isEditing && onDeleteHabit && (
                                        <button
                                            onClick={() => onDeleteHabit(habit.id, habit.name)}
                                            className="text-zinc-600 hover:text-red-500 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                    <span className={`text-sm font-medium truncate flex-1 transition-colors ${isEditing ? 'text-zinc-500' : 'text-white group-hover:text-primary'}`}>
                                        {habit.name}
                                    </span>
                                    <div className={`flex items-center gap-1.5 flex-shrink-0 transition-opacity ${isEditing ? 'opacity-20' : ''}`}>
                                        <div className="w-14 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                                        </div>
                                        <span className="text-[11px] text-zinc-500 w-7 text-right">{percentage}%</span>
                                    </div>
                                </div>

                                {/* Circles */}
                                <div className={`flex-1 flex justify-between ${isEditing ? 'opacity-20 pointer-events-none' : ''}`}>
                                    {days.map(d => {
                                        const log = habitLogs.find(l => l.date === d.dateStr);
                                        const isCompleted = log?.completed ?? false;

                                        return (
                                            <div key={d.dateStr} className="w-7 flex justify-center items-center">
                                                <button
                                                    onClick={() => handleToggle(habit, d.dateStr, isCompleted)}
                                                    className={[
                                                        'w-5 h-5 rounded-full flex items-center justify-center transition-all duration-100 cursor-pointer select-none hover:scale-110',
                                                        isCompleted
                                                            ? 'bg-primary border-2 border-primary shadow-[0_0_8px] shadow-primary/50'
                                                            : d.isToday
                                                                ? 'border-2 border-primary/60 hover:border-primary bg-transparent hover:bg-primary/10'
                                                                : d.isThisWeek
                                                                    ? 'border border-zinc-600 bg-zinc-900 hover:border-zinc-400'
                                                                    : 'border border-zinc-800 bg-zinc-950 hover:border-zinc-600',
                                                    ].join(' ')}
                                                >
                                                    {isCompleted && <Check size={11} strokeWidth={3} className="text-zinc-900" />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
