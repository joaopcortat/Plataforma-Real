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

            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-xl ${phase.bg} ${phase.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform duration-500`}>
                        <Timer size={18} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors`}>
                        {phase.label}
                    </span>
                </div>

                {/* Main Counter */}
                <div className="mb-2">
                    <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 tracking-tighter">
                        {Math.max(0, timeLeft.weeks)}
                    </span>
                </div>

                <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 px-4 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                    Semanas Restantes
                </span>

                {/* Footer Details */}
                <div className="w-full pt-4 border-t border-zinc-800/50 flex justify-between items-center text-xs">
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-zinc-400 text-[10px] uppercase tracking-wider">Próximo Marco</span>
                        <span className="text-white font-bold">1º Dia (08/11)</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-zinc-600 text-[10px] uppercase tracking-wider">2º Dia</span>
                        <span className="text-zinc-400">15/11</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
