import { useState, useEffect } from 'react';
import { X, Calculator, BookOpen, BrainCircuit, Timer as TimerIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import clsx from 'clsx';

interface RegisterResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    simulation: any;
    timeSpent: number; // in minutes
    onSuccess?: () => void;
}

export function RegisterResultModal({ isOpen, onClose, simulation, timeSpent, onSuccess }: RegisterResultModalProps) {
    const [customTitle, setCustomTitle] = useState('');
    const [manualTime, setManualTime] = useState(0);
    const [loading, setLoading] = useState(false);

    // Exam Type Selection for Manual Entry
    const [examType, setExamType] = useState<string>('custom');

    // Detailed Scores
    const [linguagens, setLinguagens] = useState('');
    const [humanas, setHumanas] = useState('');
    const [natureza, setNatureza] = useState('');
    const [matematica, setMatematica] = useState('');
    const [redacao, setRedacao] = useState('');
    const [c1, setC1] = useState('');
    const [c2, setC2] = useState('');
    const [c3, setC3] = useState('');
    const [c4, setC4] = useState('');
    const [c5, setC5] = useState('');
    const [simpleScore, setSimpleScore] = useState('');

    useEffect(() => {
        if (simulation) {
            setCustomTitle(simulation.title);
            setExamType(simulation.id || 'custom');

            // Reset fields
            setLinguagens('');
            setHumanas('');
            setNatureza('');
            setMatematica('');
            setMatematica('');
            setRedacao('');
            setC1('');
            setC2('');
            setC3('');
            setC4('');
            setC5('');
            setSimpleScore('');
            setManualTime(0);
        }
    }, [simulation]);

    if (!isOpen || !simulation) return null;

    // Use internal state 'examType' which can be changed if it's a manual entry (timeSpent === 0)
    // If it's an automatic finish (timeSpent > 0), examType tracks simulation.id from effect and shouldn't change ideally
    // But manual entry allows switching.

    const isDay1 = examType === 'enem_day1';
    const isDay2 = examType === 'enem_day2';
    const isCustom = !isDay1 && !isDay2;
    const isManual = timeSpent === 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuario não logado');

            const finalTime = timeSpent > 0 ? timeSpent : manualTime;

            let totalScore = 0;
            let totalQuestions = (simulation && simulation.questions) ? simulation.questions : 90;

            if (isDay1) {
                totalScore = (parseInt(linguagens) || 0) + (parseInt(humanas) || 0);
            } else if (isDay2) {
                totalScore = (parseInt(natureza) || 0) + (parseInt(matematica) || 0);
            } else {
                totalScore = parseInt(simpleScore) || 0;
            }

            const resultData = {
                user_id: user.id,
                title: customTitle || (simulation ? simulation.title : 'Simulado'),
                subject: isDay1 ? 'Linguagens e Humanas' : isDay2 ? 'Natureza e Matemática' : 'Geral',
                score: totalScore,
                total_questions: totalQuestions,
                time_spent_minutes: finalTime,
                created_at: new Date().toISOString(),
                // Detailed fields
                linguagens_correct: isDay1 ? parseInt(linguagens) : null,
                humanas_correct: isDay1 ? parseInt(humanas) : null,
                redacao_score: isDay1 ? (parseInt(c1 || '0') + parseInt(c2 || '0') + parseInt(c3 || '0') + parseInt(c4 || '0') + parseInt(c5 || '0')) : null,
                c1: isDay1 ? parseInt(c1) : null,
                c2: isDay1 ? parseInt(c2) : null,
                c3: isDay1 ? parseInt(c3) : null,
                c4: isDay1 ? parseInt(c4) : null,
                c5: isDay1 ? parseInt(c5) : null,
                natureza_correct: isDay2 ? parseInt(natureza) : null,
                matematica_correct: isDay2 ? parseInt(matematica) : null
            };

            const { error } = await supabase
                .from('simulation_results')
                .insert(resultData);

            if (error) {
                console.warn("Could not save to DB, saving to local storage");
                const history = JSON.parse(localStorage.getItem('sim_history') || '[]');
                history.push({ ...resultData, id: Date.now() });
                localStorage.setItem('sim_history', JSON.stringify(history));
                // Even if there's a DB error, we still want to close the modal and potentially reload
                onClose();
            } else {
                console.log('Result saved!');
                if (onSuccess) {
                    onSuccess();
                } else {
                    onClose();
                }
            }

            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar resultado');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar Resultado</h2>
                        <p className="text-zinc-400 text-sm">
                            {isManual ? 'Registro Manual' : `Finalizado em ${Math.floor(timeSpent / 60)}h ${timeSpent % 60}m`}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Exam Type Selector for Manual Entry */}
                    {isManual && (
                        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setExamType('enem_day1')}
                                className={clsx("flex flex-col items-center justify-center py-3 rounded-lg text-xs font-medium transition-all gap-1",
                                    examType === 'enem_day1' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                )}
                            >
                                <BookOpen size={16} className={examType === 'enem_day1' ? "text-orange-500" : ""} />
                                Dia 1
                            </button>
                            <button
                                type="button"
                                onClick={() => setExamType('enem_day2')}
                                className={clsx("flex flex-col items-center justify-center py-3 rounded-lg text-xs font-medium transition-all gap-1",
                                    examType === 'enem_day2' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                )}
                            >
                                <BrainCircuit size={16} className={examType === 'enem_day2' ? "text-blue-500" : ""} />
                                Dia 2
                            </button>
                            <button
                                type="button"
                                onClick={() => setExamType('custom')}
                                className={clsx("flex flex-col items-center justify-center py-3 rounded-lg text-xs font-medium transition-all gap-1",
                                    examType === 'custom' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
                                )}
                            >
                                <TimerIcon size={16} className={examType === 'custom' ? "text-emerald-500" : ""} />
                                Outro
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Nome da Prova
                        </label>
                        <input
                            type="text"
                            required
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            placeholder={isDay1 ? "Ex: ENEM 2021 Dia 1" : isDay2 ? "Ex: ENEM 2021 Dia 2" : "Nome do Simulado"}
                        />
                    </div>

                    <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                        <span className="text-zinc-400">Tempo de Prova (min)</span>
                        {!isManual ? (
                            <span className="text-xl font-mono font-bold text-white">
                                {Math.floor(timeSpent / 60)}h {timeSpent % 60}m
                            </span>
                        ) : (
                            <input
                                type="number"
                                className="bg-transparent text-right text-xl font-mono font-bold text-white focus:outline-none w-24 border-b border-zinc-700 focus:border-primary"
                                placeholder="0"
                                value={manualTime || ''}
                                onChange={(e) => setManualTime(parseInt(e.target.value) || 0)}
                            />
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <Calculator size={18} />
                            Detalhamento de Acertos
                        </div>

                        {isDay1 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-zinc-400 mb-1 block">Linguagens (/45)</label>
                                        <input
                                            type="number"
                                            max="45"
                                            min="0"
                                            required
                                            value={linguagens}
                                            onChange={(e) => setLinguagens(e.target.value)}
                                            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-center font-bold text-white focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-400 mb-1 block">Humanas (/45)</label>
                                        <input
                                            type="number"
                                            max="45"
                                            min="0"
                                            required
                                            value={humanas}
                                            onChange={(e) => setHumanas(e.target.value)}
                                            className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-center font-bold text-white focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-2 block">Redação (C1-C5)</label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={num}>
                                                <input
                                                    type="number"
                                                    max="200"
                                                    min="0"
                                                    step="40"
                                                    placeholder={`C${num}`}
                                                    value={eval(`c${num}` as any)}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (num === 1) setC1(val);
                                                        if (num === 2) setC2(val);
                                                        if (num === 3) setC3(val);
                                                        if (num === 4) setC4(val);
                                                        if (num === 5) setC5(val);
                                                    }}
                                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-center text-xs font-bold text-white focus:border-pink-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-xs text-zinc-500 mr-2">Total:</span>
                                        <span className="text-pink-500 font-bold">
                                            {(parseInt(c1 || '0') + parseInt(c2 || '0') + parseInt(c3 || '0') + parseInt(c4 || '0') + parseInt(c5 || '0'))}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}

                        {isDay2 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Natureza (/45)</label>
                                    <input
                                        type="number"
                                        max="45"
                                        min="0"
                                        required
                                        value={natureza}
                                        onChange={(e) => setNatureza(e.target.value)}
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-center font-bold text-white focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Matemática (/45)</label>
                                    <input
                                        type="number"
                                        max="45"
                                        min="0"
                                        required
                                        value={matematica}
                                        onChange={(e) => setMatematica(e.target.value)}
                                        className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-center font-bold text-white focus:border-blue-600"
                                    />
                                </div>
                            </div>
                        )}

                        {isCustom && (
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Total de Acertos</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={simpleScore}
                                    onChange={(e) => setSimpleScore(e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-3 text-center text-2xl font-bold text-white focus:border-primary"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Salvando...' : 'Salvar Resultado'}
                    </button>
                </form>
            </div>
        </div>
    );
}
