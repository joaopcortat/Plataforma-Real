import clsx from 'clsx';
import { Check, Flame, Lock } from 'lucide-react';

export function WeeklyProgressStrip() {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const todayIndex = new Date().getDay();

    return (
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-8">
            {days.map((day, index) => {
                const isPast = index < todayIndex;
                const isToday = index === todayIndex;

                return (
                    <div
                        key={day}
                        className={clsx(
                            "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 relative group",
                            isToday
                                ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20"
                                : isPast
                                    ? "bg-zinc-900/50 border-zinc-800 opacity-60 hover:opacity-100"
                                    : "bg-zinc-900/30 border-zinc-800/50 opacity-40"
                        )}
                    >
                        <span className="text-xs font-bold text-zinc-400 uppercase">{day}</span>

                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            isToday ? "bg-blue-500 text-white animate-pulse" :
                                isPast ? "bg-emerald-500/20 text-emerald-500" :
                                    "bg-zinc-800 text-zinc-600"
                        )}>
                            {isToday ? <Flame size={16} fill="currentColor" /> :
                                isPast ? <Check size={16} /> :
                                    <Lock size={14} />}
                        </div>

                        {/* XP Bubble for Today */}
                        {isToday && (
                            <div className="absolute -top-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                                +111 XP
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
