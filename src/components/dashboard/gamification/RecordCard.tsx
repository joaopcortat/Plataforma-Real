import { Medal, Calendar } from 'lucide-react';

export function RecordCard() {
    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-zinc-400 text-sm font-bold">
                <Medal size={16} />
                <span>Recorde</span>
            </div>

            <div className="text-center flex-1 flex flex-col justify-center">
                <div className="text-6xl font-bold text-yellow-500 mb-2 drop-shadow-md">15</div>
                <h3 className="text-xl font-bold text-white mb-4">Seu recorde histórico</h3>

                <p className="text-blue-400 text-xs px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    Você está entre os <span className="font-bold">10% dos alunos</span> com 15 ou mais dias de recorde.
                </p>
            </div>

            <div className="mt-6 flex flex-col items-center">
                <Calendar size={32} className="text-yellow-500 mb-2" />
            </div>
        </div>
    );
}
