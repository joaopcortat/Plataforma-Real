import { useState } from 'react';
import clsx from 'clsx';
import { Clock, Trash2 } from 'lucide-react';

interface TaskCardProps {
    subject: string;
    title: string;
    completed: boolean;
    onToggle?: (completed: boolean) => void;
    onDelete?: () => void;
    timeRange?: string; // e.g. "08:00 - 09:30" - Kept for compatibility but not displayed
    duration?: number;  // in minutes
}

// Color mapping based on the reference image vibe
const SUBJECT_COLORS: Record<string, string> = {
    'Matemática': 'border-yellow-500 text-yellow-500 bg-yellow-500/10',
    'Física': 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
    'Química': 'border-emerald-400 text-emerald-400 bg-emerald-400/10',
    'Biologia': 'border-green-500 text-green-500 bg-green-500/10',
    'História': 'border-purple-500 text-purple-500 bg-purple-500/10',
    'Geografia': 'border-purple-400 text-purple-400 bg-purple-400/10',
    'Filosofia': 'border-pink-500 text-pink-500 bg-pink-500/10',
    'Sociologia': 'border-pink-500 text-pink-500 bg-pink-500/10',
    'Português': 'border-orange-500 text-orange-500 bg-orange-500/10',
    'Redação': 'border-blue-500 text-blue-500 bg-blue-500/10',
    'Literatura': 'border-orange-400 text-orange-400 bg-orange-400/10',
    'Inglês': 'border-indigo-400 text-indigo-400 bg-indigo-400/10',
    'Espanhol': 'border-indigo-400 text-indigo-400 bg-indigo-400/10',
};

const DEFAULT_COLOR = 'border-zinc-500 text-zinc-500 bg-zinc-500/10';

export function TaskCard({ subject, title, completed, onToggle, onDelete, duration = 90 }: TaskCardProps) {
    const [isCompleted, setIsCompleted] = useState(completed);

    const handleToggle = () => {
        const newState = !isCompleted;
        setIsCompleted(newState);
        onToggle?.(newState);
    };

    // Extract core subject name for matching
    const cleanSubject = subject.split('/')[0].trim();
    const colorClass = SUBJECT_COLORS[cleanSubject] || DEFAULT_COLOR;
    const [borderColor, textColor, _bgColor] = colorClass.split(' ');

    // Google Agenda Style: Height is proportional to duration
    const minHeight = `${Math.max(duration, 60)}px`;

    return (
        <div
            onClick={handleToggle}
            className={clsx(
                "group relative p-2 rounded-lg border-l-[6px] transition-all duration-200 cursor-pointer select-none overflow-hidden hover:brightness-110 flex flex-col",
                borderColor,
                isCompleted
                    ? "bg-zinc-900/40 opacity-50 grayscale-[0.5]"
                    : "bg-zinc-800/80 hover:shadow-lg hover:translate-y-[-1px]"
            )}
            style={{ minHeight }}
        >
            {/* Header: Subject & Checkbox */}
            <div className="flex justify-between items-start mb-1">
                <span className={clsx("text-[10px] font-black tracking-wider uppercase pr-2 truncate", textColor)}>
                    {subject}
                </span>

                <div className="flex items-center gap-2">
                    {/* Delete Button (Veiled) */}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-500 hover:text-red-500 rounded"
                            title="Excluir bloco"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}

                    <div className={clsx(
                        "w-3.5 h-3.5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                        isCompleted
                            ? clsx("bg-current border-transparent", textColor)
                            : "border-zinc-600 group-hover:border-zinc-500 bg-transparent"
                    )}>
                        {isCompleted && <div className="w-1.5 h-1.5 bg-black rounded-sm" />}
                    </div>
                </div>
            </div>

            {/* Body: Title */}
            <p className={clsx(
                "text-xs font-medium leading-snug mb-auto",
                isCompleted ? "text-zinc-600 line-through" : "text-zinc-200"
            )}>
                {title}
            </p>

            {/* Footer: Duration Only */}
            <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold mt-2 pt-2 border-t border-white/5 uppercase tracking-wide">
                <Clock size={10} />
                <span>{duration} min</span>
            </div>
        </div>
    );
}
