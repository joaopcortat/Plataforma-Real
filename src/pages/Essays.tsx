import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EssayRadar } from '../components/essays/EssayRadar';
import { EssayStats } from '../components/essays/EssayStats';
import { EssayHistory } from '../components/essays/EssayHistory';
import { RegisterEssayModal } from '../components/essays/RegisterEssayModal';
import { PenTool, Target, Layers, Plus } from 'lucide-react';

export function Essays() {
    const [loading, setLoading] = useState(true);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [essays, setEssays] = useState<any[]>([]);
    const [stats, setStats] = useState({
        c1: 0,
        c2: 0,
        c3: 0,
        c4: 0,
        c5: 0,
        averageScore: 0,
        totalEssays: 0,
        bestScore: 0
    });

    useEffect(() => {
        fetchEssays();
    }, []);

    async function fetchEssays() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Busca Redações: Se o c1 não for nulo OU se o subject for expressamente 'Redação'.
            // "subject = 'Redação' AND score is null" são as pendentes.
            const { data, error } = await supabase
                .from('simulation_results')
                .select('*')
                .eq('user_id', user.id)
                .or('subject.eq.Redação,c1.not.is.null')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                setEssays(data);

                // Calcular médias apenas das que ESTÃO CORRIGIDAS (c1 !== null)
                const gradedEssays = data.filter(e => e.c1 !== null);
                const count = gradedEssays.length;

                if (count > 0) {
                    const sums = gradedEssays.reduce((acc, curr) => ({
                        c1: acc.c1 + (curr.c1 || 0),
                        c2: acc.c2 + (curr.c2 || 0),
                        c3: acc.c3 + (curr.c3 || 0),
                        c4: acc.c4 + (curr.c4 || 0),
                        c5: acc.c5 + (curr.c5 || 0),
                        total: acc.total + (curr.score || curr.redacao_score || 0)
                    }), { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, total: 0 });

                    const best = Math.max(...gradedEssays.map(e => e.score || 0));

                    setStats({
                        c1: sums.c1 / count,
                        c2: sums.c2 / count,
                        c3: sums.c3 / count,
                        c4: sums.c4 / count,
                        c5: sums.c5 / count,
                        averageScore: sums.total / count,
                        totalEssays: count,
                        bestScore: best
                    });
                } else {
                    setStats(prev => ({ ...prev, totalEssays: 0 }));
                }
            }
        } catch (error) {
            console.error('Erro ao buscar redações:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header da Página */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <PenTool size={24} strokeWidth={2.5} />
                        <h1 className="text-3xl font-black text-white tracking-tight">Redação</h1>
                    </div>
                    <p className="text-zinc-400 font-medium">Análise de desempenho e histórico de temas escritos.</p>
                </div>

                <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105"
                >
                    <Plus size={20} />
                    Nova Redação
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Radar Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-full flex flex-col">
                        <div className="flex items-center gap-2 text-zinc-300 font-bold mb-6">
                            <Target size={18} className="text-primary" />
                            <h3>Radar de Competências</h3>
                        </div>
                        <div className="flex-1 flex items-center justify-center relative min-h-[350px]">
                            {/* Glow Subtil atrás do radar */}
                            <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                            <EssayRadar
                                c1={stats.c1}
                                c2={stats.c2}
                                c3={stats.c3}
                                c4={stats.c4}
                                c5={stats.c5}
                            />
                        </div>
                        <p className="text-xs text-center text-zinc-500 font-medium mt-4">
                            Gráfico gerado a partir da média geral de notas.
                        </p>
                    </div>
                </div>

                {/* Stats e History Column */}
                <div className="lg:col-span-2 space-y-8">

                    <EssayStats
                        {...stats}
                    />

                    <div>
                        <div className="flex items-center gap-2 text-zinc-300 font-bold mb-4">
                            <Layers size={18} className="text-primary" />
                            <h3>Histórico de Redações</h3>
                        </div>
                        <EssayHistory essays={essays} onRefresh={fetchEssays} />
                    </div>

                </div>

            </div>

            <RegisterEssayModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSuccess={() => {
                    setIsRegisterModalOpen(false);
                    fetchEssays();
                }}
            />
        </div>
    );
}
