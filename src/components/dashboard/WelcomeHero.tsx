import { Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function WelcomeHero() {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [xp, setXp] = useState(0);

    useEffect(() => {
        if (user) {
            supabase.from('profiles').select('full_name, xp').eq('user_id', user.id).single()
                .then(({ data }) => {
                    if (data) {
                        setName(data.full_name || user.email?.split('@')[0] || 'Estudante');
                        setXp(data.xp || 0);
                    }
                });
        }
    }, [user]);

    const firstName = name.split(' ')[0];

    return (
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="z-10 flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
                    🏆
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Olá, {firstName}!
                        <span className="text-sm font-normal text-zinc-400 ml-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
                            👋 4 dias de foco!
                        </span>
                    </h1>
                    <p className="text-zinc-400 max-w-lg">
                        Continue sua jornada rumo à aprovação no ENEM 🎯
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm text-pink-400 bg-pink-500/10 px-3 py-1 rounded-lg border border-pink-500/20">
                        <span>Lembre de preencher o diário de bordo!</span>
                        <button className="flex items-center gap-1 hover:underline font-bold">
                            → Preencher
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats / Ranking Box */}
            <div className="flex gap-4 z-10 w-full md:w-auto">
                <div className="flex-1 md:flex-none glass-panel p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="text-xs font-bold text-yellow-500 uppercase">Ranking</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                        - <span className="text-sm font-normal text-zinc-500">de -</span>
                    </div>
                    <div className="text-xs text-zinc-400">
                        {xp} XP Acumulado
                    </div>
                </div>
            </div>
        </div>
    );
}
