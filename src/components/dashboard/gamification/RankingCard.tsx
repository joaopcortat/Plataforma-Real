import { Users } from 'lucide-react';

export function RankingCard() {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-zinc-400 text-sm font-bold">
                <Users size={16} />
                <span>Comparativo</span>
            </div>

            <div className="text-center flex flex-col items-center justify-center flex-1">
                <h3 className="text-lg font-medium text-white mb-2">Você está entre os</h3>

                <div className="text-[80px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-600 drop-shadow-lg">
                    7%
                </div>

                <p className="text-green-500 font-bold mb-6">dos alunos que mais estudam</p>

                <p className="text-zinc-500 text-xs max-w-[200px]">
                    em toda a Plataforma da Real Mentoria.
                </p>
            </div>

            <div className="mt-4 p-3 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                    <span className="text-white text-xs">🎯</span>
                </div>
            </div>
        </div>
    );
}
