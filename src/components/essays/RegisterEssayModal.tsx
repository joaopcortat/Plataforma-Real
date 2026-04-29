import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Check } from 'lucide-react';
import clsx from 'clsx';

interface RegisterEssayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function RegisterEssayModal({ isOpen, onClose, onSuccess }: RegisterEssayModalProps) {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<'pending' | 'graded'>('graded');

    const [c1, setC1] = useState('');
    const [c2, setC2] = useState('');
    const [c3, setC3] = useState('');
    const [c4, setC4] = useState('');
    const [c5, setC5] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario não logado');

            let submissionData: any = {
                user_id: user.id,
                title: title || 'Redação Sem Tema',
                subject: 'Redação',
                created_at: new Date().toISOString(),
                total_questions: 1, // apenas semântico pra tabela
                time_spent_minutes: 0,
            };

            if (status === 'graded') {
                const totalScore = (parseInt(c1 || '0') + parseInt(c2 || '0') + parseInt(c3 || '0') + parseInt(c4 || '0') + parseInt(c5 || '0'));
                submissionData = {
                    ...submissionData,
                    score: totalScore,
                    redacao_score: totalScore,
                    c1: parseInt(c1) || 0,
                    c2: parseInt(c2) || 0,
                    c3: parseInt(c3) || 0,
                    c4: parseInt(c4) || 0,
                    c5: parseInt(c5) || 0,
                };
            } else {
                // Se está pending, gravamos como nulas as C1 pra não entrarem na média
                submissionData = {
                    ...submissionData,
                    score: 0,
                    redacao_score: 0,
                    c1: null,
                    c2: null,
                    c3: null,
                    c4: null,
                    c5: null,
                };
            }

            const { error } = await supabase
                .from('simulation_results')
                .insert(submissionData);

            if (error) throw error;

            onSuccess();
        } catch (error: any) {
            console.error('Submission error:', error);
            alert(`Erro ao registrar redação: ${error?.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    }

    const totalCalculated = (parseInt(c1 || '0') + parseInt(c2 || '0') + parseInt(c3 || '0') + parseInt(c4 || '0') + parseInt(c5 || '0'));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Nova Redação</h2>
                        <p className="text-zinc-400 text-sm">Registre suas notas ou entradas em análise.</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Tema da Redação</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Ex: Os desafios da saúde mental..."
                        />
                    </div>

                    <div className="bg-zinc-950 p-1.5 rounded-xl flex border border-zinc-800 shadow-sm relative">
                        <button
                            type="button"
                            onClick={() => setStatus('graded')}
                            className={clsx(
                                "flex-1 py-2 text-sm font-bold rounded-lg transition-all relative z-10",
                                status === 'graded' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Já Recebi a Nota
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatus('pending')}
                            className={clsx(
                                "flex-1 py-2 text-sm font-bold rounded-lg transition-all relative z-10",
                                status === 'pending' ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Aguardando Correção
                        </button>

                        {/* Animated background tab */}
                        <div
                            className={clsx(
                                "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-lg shadow transition-all duration-300 ease-out z-0",
                                status === 'graded' ? "left-1.5" : "left-[calc(50%+1.5px)]"
                            )}
                        />
                    </div>

                    <div className={clsx("transition-all duration-500 overflow-hidden", status === 'graded' ? "opacity-100 max-h-[400px]" : "opacity-0 max-h-0")}>
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <label className="text-xs text-zinc-400 mb-3 block uppercase tracking-wider font-bold">Detalhamento (C1-C5)</label>

                            <div className="grid grid-cols-5 gap-2 mb-4">
                                {[
                                    { num: 1, val: c1, set: setC1 },
                                    { num: 2, val: c2, set: setC2 },
                                    { num: 3, val: c3, set: setC3 },
                                    { num: 4, val: c4, set: setC4 },
                                    { num: 5, val: c5, set: setC5 },
                                ].map(({ num, val, set }) => (
                                    <div key={num} className="flex flex-col items-center">
                                        <span className="text-[10px] text-zinc-500 font-bold mb-1">C{num}</span>
                                        <input
                                            type="number"
                                            max="200"
                                            min="0"
                                            step="1"
                                            required={status === 'graded'}
                                            placeholder="0"
                                            value={val}
                                            onChange={(e) => set(e.target.value)}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2 text-center text-sm font-bold text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-end border-t border-zinc-800 pt-3">
                                <span className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Nota Total</span>
                                <span className="text-2xl font-black text-white">{totalCalculated}</span>
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
                                Salvar Registro
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
