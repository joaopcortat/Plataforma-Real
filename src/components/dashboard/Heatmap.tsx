import { MOCK_DATA } from '../../data/mock';
import clsx from 'clsx';

export function Heatmap() {
    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-zinc-800/50';
        if (count === 1) return 'bg-emerald-900/40';
        if (count === 2) return 'bg-emerald-700/60';
        if (count === 3) return 'bg-emerald-500/80';
        return 'bg-emerald-400';
    };

    // Group by weeks for the grid
    const weeks = [];
    let currentWeek = [];
    // Use last 140 days (approx 20 weeks) for display
    const displayData = MOCK_DATA.heatmap.slice(-140);

    for (let i = 0; i < displayData.length; i++) {
        currentWeek.push(displayData[i]);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    return (
        <div className="glass-panel p-6 rounded-xl mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Constância de Estudos</h3>
                <div className="text-xs text-zinc-500 flex gap-2 items-center">
                    <span>Menos</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-zinc-800/50" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-900/40" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-700/60" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-500/80" />
                        <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                    </div>
                    <span>Mais</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-max">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="flex flex-col gap-1">
                            {week.map((day, dIdx) => (
                                <div
                                    key={`${wIdx}-${dIdx}`}
                                    className={clsx(
                                        "w-3 h-3 rounded-sm transition-all hover:scale-125 hover:z-10 cursor-alias",
                                        getIntensityClass(day.count)
                                    )}
                                    title={`${day.date}: ${day.count} atividades`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
