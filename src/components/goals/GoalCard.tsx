import type { Goal } from '../../contexts/StudyContext';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface GoalCardProps {
    goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
    const percentage = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
    const daysLeft = differenceInDays(parseISO(goal.deadline), new Date('2024-02-13')); // Simulating today
    const isExpired = daysLeft < 0 && percentage < 100;
    const isCompleted = percentage >= 100;

    return (
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-white text-lg">{goal.title}</h3>
                    <p className="text-zinc-400 text-sm">
                        {goal.current} / {goal.target} <span className="text-xs uppercase">{goal.unit}</span>
                    </p>
                </div>

                {isCompleted ? (
                    <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                        <CheckCircle2 size={24} />
                    </div>
                ) : isExpired ? (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-lg text-xs font-bold border border-red-400/20">
                        <AlertCircle size={14} />
                        EXPIRADA
                    </div>
                ) : (
                    <div className={clsx(
                        "px-3 py-1 rounded-lg text-xs font-bold border",
                        daysLeft <= 3 ? "text-orange-400 bg-orange-400/10 border-orange-400/20" : "text-zinc-500 bg-zinc-800 border-zinc-700"
                    )}>
                        {daysLeft} dias restantes
                    </div>
                )}
            </div>

            {/* Progress Bar Container */}
            <div className="h-4 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800/50 relative">
                {/* Progress Fill */}
                <div
                    className={clsx(
                        "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                        isCompleted ? "bg-emerald-500" : isExpired ? "bg-red-500" : "bg-blue-500"
                    )}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                </div>
            </div>

            <div className="mt-2 text-right">
                <span className={clsx(
                    "text-xs font-bold",
                    isCompleted ? "text-emerald-400" : isExpired ? "text-red-400" : "text-blue-400"
                )}>
                    {percentage.toFixed(0)}%
                </span>
            </div>
        </div>
    );
}
