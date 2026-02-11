import { Trophy, Crown } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { GAMIFICATION } from '../lib/gamification';

interface RankingUser {
    id: string;
    full_name: string;
    xp: number;
    avatar_url: string;
    level: number;
    position?: number;
    me?: boolean;
}

export function Ranking() {
    const { user } = useAuth();
    const [ranking, setRanking] = useState<RankingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [userPosition, setUserPosition] = useState<number | null>(null);

    useEffect(() => {
        fetchRanking();
    }, [user]);

    async function fetchRanking() {
        setLoading(true);
        // Fetch top 50 users by XP
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, xp, avatar_url')
            .order('xp', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching ranking:', error);
            setLoading(false);
            return;
        }

        if (data) {
            const rankedData = data.map((profile, index) => ({
                id: profile.id,
                full_name: profile.full_name || 'Usuário',
                xp: profile.xp || 0,
                avatar_url: profile.avatar_url,
                level: GAMIFICATION.getLevel(profile.xp || 0),
                position: index + 1,
                me: profile.id === user?.id
            }));

            setRanking(rankedData);

            // Find current user position
            const myRank = rankedData.find(r => r.me);
            if (myRank) {
                setUserPosition(myRank.position || null);
            } else if (user) {
                // If user is not in top 50, fetch their rank separately (optional, complex query)
                // For MVP, just show "Not in Top 50" or nothing
            }
        }
        setLoading(false);
    }

    const getPodium = (index: number) => {
        if (index === 0) return { color: 'text-yellow-500', border: 'border-yellow-500', bg: 'bg-yellow-500/10' }; // 1st
        if (index === 1) return { color: 'text-zinc-300', border: 'border-zinc-400', bg: 'bg-zinc-400/10' }; // 2nd
        if (index === 2) return { color: 'text-orange-700', border: 'border-orange-700', bg: 'bg-orange-700/10' }; // 3rd
        return { color: 'text-zinc-500', border: 'border-zinc-800', bg: 'bg-zinc-800' };
    };

    if (loading) {
        return <div className="text-white text-center py-20">Carregando ranking...</div>;
    }

    const podiumUsers = [
        ranking.find(r => r.position === 2),
        ranking.find(r => r.position === 1),
        ranking.find(r => r.position === 3)
    ].filter(Boolean) as RankingUser[];
    // Adjust if less than 3 users exist

    // Fallback if very few users
    const displayPodium = ranking.length >= 3 ? podiumUsers : ranking.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Ranking Global</h1>
                    <p className="text-zinc-400">Veja sua posição em relação a outros estudantes.</p>
                </div>
                {userPosition && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-lg text-indigo-400 font-bold flex items-center gap-2">
                        <Trophy size={18} />
                        Sua posição: #{userPosition}
                    </div>
                )}
            </div>

            {/* Podium (Only show if we have enough data and logic fits) */}
            {ranking.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                    {displayPodium.map((user) => {
                        // Re-map index for visual podium: 2nd (left), 1st (center), 3rd (right)
                        // If using the filtered podiumUsers array: 0 is 2nd, 1 is 1st, 2 is 3rd.
                        const isFirst = user.position === 1;
                        const styles = getPodium(user.position! - 1);

                        return (
                            <div key={user.id} className={clsx(
                                "border rounded-2xl p-6 flex flex-col items-center relative transition-all hover:scale-[1.02]",
                                isFirst ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border-yellow-500/50 shadow-xl shadow-yellow-500/10 z-10 h-80 justify-center" : "bg-zinc-900 border-zinc-800 h-64 justify-center"
                            )}>
                                {isFirst && <Crown size={32} className="text-yellow-500 absolute -top-5 drop-shadow-lg" fill="currentColor" />}

                                <div className={clsx(
                                    "w-20 h-20 rounded-full border-4 mb-4 overflow-hidden relative",
                                    styles.border
                                )}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500">
                                            {user.full_name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] w-full text-center py-0.5">
                                        Lvl {user.level}
                                    </div>
                                </div>

                                <h3 className="font-bold text-white text-lg text-center mb-1 truncate w-full px-2">{user.full_name}</h3>
                                <span className={clsx("text-sm font-bold mb-2", styles.color)}>{user.xp} XP</span>

                                <div className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase", styles.bg, styles.color)}>
                                    {GAMIFICATION.getTitle(user.level).title}
                                </div>

                                <div className={clsx(
                                    "absolute top-4 right-4 font-black text-4xl opacity-10",
                                    styles.color
                                )}>
                                    {user.position}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {ranking.map((user) => (
                    <div
                        key={user.id}
                        className={clsx(
                            "flex items-center gap-4 p-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors",
                            user.me ? "bg-indigo-500/10 hover:bg-indigo-500/20" : ""
                        )}
                    >
                        <span className={clsx(
                            "w-8 text-center font-bold",
                            user.position! <= 3 ? "text-yellow-500 text-xl" : "text-zinc-500"
                        )}>
                            {user.position}
                        </span>

                        <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700 flex-shrink-0">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                                    {user.full_name.charAt(0)}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className={clsx("font-bold truncate", user.me ? "text-indigo-400" : "text-white")}>
                                {user.full_name} {user.me && "(Você)"}
                            </p>
                            <p className="text-xs text-zinc-500 flex items-center gap-2">
                                Nível {user.level} • <span className={GAMIFICATION.getTitle(user.level).color}>{GAMIFICATION.getTitle(user.level).title}</span>
                            </p>
                        </div>

                        <span className="font-bold text-white whitespace-nowrap">{user.xp} XP</span>
                    </div>
                ))}

                {ranking.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">
                        Nenhum usuário no ranking ainda. Seja o primeiro!
                    </div>
                )}
            </div>
        </div>
    );
}
