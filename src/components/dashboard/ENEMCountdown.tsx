import { useEffect, useState } from 'react';
import { differenceInWeeks, differenceInDays } from 'date-fns';

export function ENEMCountdown() {
    const [timeLeft, setTimeLeft] = useState<{ weeks: number; days: number }>({ weeks: 0, days: 0 });

    useEffect(() => {
        // Target: First Day of ENEM 2026 -> Nov 8th, 2026
        const targetDate = new Date('2026-11-08T13:00:00');
        const now = new Date();

        // Calculate difference
        const weeks = differenceInWeeks(targetDate, now);
        const days = differenceInDays(targetDate, now) % 7;

        setTimeLeft({ weeks, days });
    }, []);

    const getPhase = (weeks: number) => {
        if (weeks > 30) return { label: 'Construção de Base', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30' };
        if (weeks > 12) return { label: 'Aprofundamento', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30' };
        return { label: 'Reta Final', color: 'text-red-400', bg: 'bg-red-500/10', border: 'hover:border-red-500/30' };
    };

    const phase = getPhase(timeLeft.weeks);

    return (
        <div className={`relative group overflow-hidden rounded-3xl p-6 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-500 ${phase.border} hover:shadow-2xl`}>
            {/* Background Effects */}
            <div className={`absolute top-0 right-0 w-48 h-48 blur-[60px] rounded-full pointer-events-none transition-all duration-500 opacity-10 group-hover:opacity-20 ${timeLeft.weeks > 12 ? (timeLeft.weeks > 30 ? 'bg-emerald-600' : 'bg-blue-600') : 'bg-red-600'}`} />

            <div className="relative z-10 flex flex-col items-center text-center justify-center min-h-[160px]">

                {/* Header Text */}
                <span className="text-sm font-bold text-zinc-500 tracking-[0.2em] uppercase mb-4">
                    FALTAM
                </span>

                {/* Main Counter Block */}
                {/* Main Counter Block - Adjusted Layout */}
                <div className="flex items-center justify-center gap-4 mb-2">

                    {/* Weeks (Big) */}
                    <div className="flex flex-col items-center">
                        <span className="text-8xl font-black text-white tracking-tighter leading-none filter drop-shadow-2xl">
                            {Math.max(0, timeLeft.weeks)}
                        </span>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">
                            SEMANAS
                        </span>
                    </div>

                    {/* Separator / 'e' */}
                    {/* <span className="text-2xl font-light text-zinc-600 self-start mt-6">e</span> */}

                    {/* Days (Detail) - Vertical Stack next to it */}
                    <div className="flex flex-col items-start h-full justify-center pt-2 gap-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl text-zinc-500 font-light">e</span>
                            <span className="text-3xl font-bold text-zinc-300">
                                {timeLeft.days}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-1">
                            DIAS
                        </span>
                    </div>
                </div>

                {/* Footer Context */}
                <span className="text-sm font-bold text-zinc-500 tracking-[0.2em] uppercase">
                    PARA O ENEM
                </span>

            </div>
        </div>
    );
}
