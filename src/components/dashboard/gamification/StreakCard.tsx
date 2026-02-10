import { Flame } from 'lucide-react';
import { MOCK_DATA } from '../../../data/mock';

export function StreakCard() {
    const streak = MOCK_DATA.user.streak;

    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px] border-orange-500/20 bg-gradient-to-b from-transparent to-orange-500/5">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-zinc-400 text-sm font-bold">
                <Flame size={16} className="text-orange-500" />
                <span>Streak</span>
            </div>

            <div className="relative group cursor-pointer my-6">
                {/* Animated Glow Behind */}
                <div className="absolute inset-0 bg-orange-500/30 blur-[60px] rounded-full animate-pulse" />

                {/* Main Fire Icon */}
                <Flame
                    size={120}
                    className="text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-transform duration-500 group-hover:scale-110"
                    fill="currentColor"
                />
            </div>

            <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-2">{streak} dias</h2>
                <p className="text-zinc-400 text-sm max-w-[200px] mx-auto">
                    Mantenha o foco para quebrar seus próprios recordes! 🔥
                </p>
            </div>

            {/* Mini Days Row */}
            <div className="flex gap-2 mt-6">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                        {d}
                    </div>
                ))}
            </div>
        </div>
    );
}
