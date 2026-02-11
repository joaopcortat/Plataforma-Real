import { useState } from 'react';
import { generateSchedule, type UserPreferences } from '../../../lib/generator';
import { supabase } from '../../../lib/supabase';
import { Brain, Calendar, ChevronRight, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import type { Subject } from '../../../lib/syllabus';

interface GeneratorWizardProps {
    onComplete: () => void;
    onCancel: () => void;
}

export function GeneratorWizard({ onComplete, onCancel }: GeneratorWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Initial State: Proficiency 3 (Average) for all
    const [prefs, setPrefs] = useState<UserPreferences>({
        hoursPerDay: { weekdays: 4, weekend: 6 },
        proficiency: {
            'Matemática': 3,
            'Física': 3,
            'Química': 3,
            'Biologia': 3,
            'História': 3,
            'Geografia': 3,
            'Português': 3,
            'Filosofia/Sociologia': 3,
            'Redação': 3
        },
        startDate: new Date()
    });

    const subjects: Subject[] = ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Filosofia/Sociologia'];

    async function handleFinish() {
        setLoading(true);
        try {
            // 1. Generate Schedule
            const tasks = generateSchedule(prefs);

            // 2. Persist to Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not found');

            const today = new Date();
            const todayStr = format(today, 'yyyy-MM-dd');

            const { error: deleteError } = await supabase
                .from('schedule_tasks')
                .delete()
                .eq('user_id', user.id)
                .gte('date', todayStr);

            if (deleteError) console.error('Error clearing old schedule:', deleteError);

            const dbTasks = tasks.map((t) => ({
                user_id: user.id,
                date: t.date,
                subject: t.subject,
                title: t.title,
                type: t.type,
                completed: false,
                is_ia_generated: true
            }));

            const { error } = await supabase
                .from('schedule_tasks')
                .insert(dbTasks);

            if (error) {
                // Fallback
                const fallbackTasks = dbTasks.map(({ is_ia_generated, ...rest }) => rest);
                const { error: fallbackError } = await supabase.from('schedule_tasks').insert(fallbackTasks);
                if (fallbackError) throw fallbackError;
                alert('Cronograma gerado! (Nota: Coluna is_ia_generated ausente no DB, ignorada).');
            }

            onComplete();
        } catch (error: any) {
            console.error('Generator failed:', error);
            alert(`Erro ao gerar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">IA Generator</h2>
                        <p className="text-zinc-400 text-sm">Passo {step} de 3</p>
                    </div>
                </div>

                {/* Step 1: Availability */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white mb-4">Disponibilidade de Tempo</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                                    <Clock size={18} />
                                    <span>Segunda a Sexta</span>
                                </div>
                                <input
                                    type="range" min="1" max="12"
                                    value={prefs.hoursPerDay.weekdays}
                                    onChange={e => setPrefs({ ...prefs, hoursPerDay: { ...prefs.hoursPerDay, weekdays: parseInt(e.target.value) } })}
                                    className="w-full accent-indigo-500 mb-2"
                                />
                                <div className="text-right font-bold text-indigo-400">{prefs.hoursPerDay.weekdays} horas/dia</div>
                            </div>

                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                                    <Calendar size={18} />
                                    <span>Finais de Semana</span>
                                </div>
                                <input
                                    type="range" min="1" max="16"
                                    value={prefs.hoursPerDay.weekend}
                                    onChange={e => setPrefs({ ...prefs, hoursPerDay: { ...prefs.hoursPerDay, weekend: parseInt(e.target.value) } })}
                                    className="w-full accent-indigo-500 mb-2"
                                />
                                <div className="text-right font-bold text-indigo-400">{prefs.hoursPerDay.weekend} horas/dia</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={onCancel} className="px-4 py-2 text-zinc-400 hover:text-white">Cancelar</button>
                            <button
                                onClick={() => setStep(2)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                            >
                                Próximo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Proficiency Level */}
                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white mb-4">Nível de Dificuldade</h3>
                        <p className="text-sm text-zinc-400 mb-4">1 estrela = Tenho muita dificuldade (Prioridade Alta)</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                            {subjects.map(subj => (
                                <div key={subj} className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-800/50 flex flex-col gap-2">
                                    <span className="text-zinc-300 font-medium">{subj}</span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => setPrefs(prev => ({
                                                    ...prev,
                                                    proficiency: { ...prev.proficiency, [subj]: rating }
                                                }))}
                                                className={`p-1 transition-transform hover:scale-110 ${(prefs.proficiency[subj] || 3) >= rating
                                                    ? 'text-yellow-500 fill-yellow-500'
                                                    : 'text-zinc-600'
                                                    }`}
                                            >
                                                <Star size={20} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs text-zinc-500">
                                        {(prefs.proficiency[subj] || 3) === 1 && 'Dificuldade Extrema'}
                                        {(prefs.proficiency[subj] || 3) === 5 && 'Domínio Total'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-zinc-400 hover:text-white">Voltar</button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                            >
                                Próximo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Brain size={48} className="text-indigo-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-white">Tudo pronto!</h3>
                        <p className="text-zinc-400 max-w-md mx-auto">
                            Baseado nas suas preferências, a IA vai gerar um cronograma completo de estudos focando nas suas dificuldades.
                        </p>

                        <div className="flex justify-center gap-3 mt-8">
                            <button onClick={() => setStep(2)} className="px-4 py-2 text-zinc-400 hover:text-white">Voltar</button>
                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Gerando...' : 'Gerar Cronograma 🚀'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
