import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check } from 'lucide-react';

interface GradeEssayModalProps {
    essay: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function GradeEssayModal({ essay, isOpen, onClose, onSuccess }: GradeEssayModalProps) {
    const [loading, setLoading] = useState(false);
    const [c1, setC1] = useState('');
    const [c2, setC2] = useState('');
    const [c3, setC3] = useState('');
    const [c4, setC4] = useState('');
    const [c5, setC5] = useState('');

    if (!isOpen || !essay) return null;

    const totalCalculated = (
        (parseInt(c1 || '0') + parseInt(c2 || '0') + parseInt(c3 || '0') +
            parseInt(c4 || '0') + parseInt(c5 || '0'))
    );

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const totalScore = totalCalculated;

            const { error } = await supabase
                .from('simulation_results')
                .update({
                    score: totalScore,
                    redacao_score: totalScore,
                    c1: parseInt(c1) || 0,
                    c2: parseInt(c2) || 0,
                    c3: parseInt(c3) || 0,
                    c4: parseInt(c4) || 0,
                    c5: parseInt(c5) || 0,
                })
                .eq('id', essay.id);

            if (error) throw error;

            onSuccess();
        } catch (error: any) {
            console.error('Grade error:', error);
            alert(`Erro ao registrar notas: ${error?.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    }

    const scoreColor = (val: number) => {
        if (val >= 160) return 'text-primary';
        if (val >= 120) return 'text-yellow-400';
        return 'text-zinc-400';
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar Notas</h2>
                        <p className="text-zinc-400 text-sm mt-0.5 line-clamp-1">
                            {essay.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* C1-C5 grid */}
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        <label className="text-xs text-zinc-400 mb-3 block uppercase tracking-wider font-bold">
                            Notas por Competência (C1–C5)
                        </label>

                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {[
                                { num: 1, val: c1, set: setC1 },
                                { num: 2, val: c2, set: setC2 },
                                { num: 3, val: c3, set: setC3 },
                                { num: 4, val: c4, set: setC4 },
                                { num: 5, val: c5, set: setC5 },
                            ].map(({ num, val, set }) => (
                                <div key={num} className="flex flex-col items-center gap-1">
                                    <span className="text-[10px] text-zinc-500 font-bold">C{num}</span>
                                    <input
                                        type="number"
                                        max="200"
                                        min="0"
                                        step="1"
                                        required
                                        placeholder="0"
                                        value={val}
                                        onChange={(e) => set(e.target.value)}
                                        className={`w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 text-center text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary transition-all ${scoreColor(parseInt(val || '0'))}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                            <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Nota Total</span>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-black leading-none ${totalCalculated >= 800 ? 'text-primary' : totalCalculated >= 600 ? 'text-white' : 'text-zinc-400'}`}>
                                    {totalCalculated}
                                </span>
                                <span className="text-zinc-500 text-sm">/ 1000</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                        ) : (
                            <>
                                <Check size={20} strokeWidth={2.5} />
                                Confirmar Notas
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
