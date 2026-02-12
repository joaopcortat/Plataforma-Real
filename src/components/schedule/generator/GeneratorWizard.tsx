import { useState } from 'react';
import { generateSchedule, type UserPreferences } from '../../../lib/generator';
import { supabase } from '../../../lib/supabase';
import { Brain, Calendar, ChevronRight, Clock, Star, GraduationCap, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { Subject } from '../../../lib/syllabus';

interface GeneratorWizardProps {
    onComplete: () => void;
    onCancel: () => void;
}

const ALL_SUBJECTS: Subject[] = [
    'Matemática', 'Física', 'Química', 'Biologia',
    'História', 'Geografia', 'Português', 'Filosofia/Sociologia'
];

export function GeneratorWizard({ onComplete, onCancel }: GeneratorWizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [prefs, setPrefs] = useState<UserPreferences>({
        hoursPerDay: { weekdays: 4, weekend: 6 },
        proficiency: {
            'Matemática': 3, 'Física': 3, 'Química': 3, 'Biologia': 3,
            'História': 3, 'Geografia': 3, 'Português': 3,
            'Filosofia/Sociologia': 3, 'Redação': 3,
        },
        startDate: new Date(),
        focusCourse: 'Medicina',
    });

    // ── Generate & Persist ──
    async function handleFinish() {
        setLoading(true);
        try {
            const tasks = generateSchedule(prefs);

            if (tasks.length === 0) {
                alert('Nenhuma tarefa gerada. Verifique suas preferências.');
                setLoading(false);
                return;
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não encontrado');

            const todayStr = format(new Date(), 'yyyy-MM-dd');

            // Delete future uncompleted tasks only
            await supabase
                .from('schedule_tasks')
                .delete()
                .eq('user_id', user.id)
                .gte('date', todayStr)
                .eq('completed', false);

            // Map to DB rows
            const rows = tasks.map(t => ({
                user_id: user.id,
                date: t.date,
                subject: t.subject,
                title: t.title,
                type: t.type,
                completed: false,
                is_ia_generated: true,
            }));

            // Batch insert (chunks of 200)
            for (let i = 0; i < rows.length; i += 200) {
                const chunk = rows.slice(i, i + 200);
                const { error } = await supabase.from('schedule_tasks').insert(chunk);
                if (error) throw error;
            }

            onComplete();
        } catch (err: any) {
            console.error('Generator failed:', err);
            alert(`Erro ao gerar cronograma: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    // ── UI ──
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Novo Planejamento</h2>
                        <p className="text-zinc-400 text-sm">Passo {step} de 3</p>
                    </div>
                </div>

                {/* ━━━ Step 1: Availability ━━━ */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Focus Course */}
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                <div className="flex items-center gap-2 mb-3 text-white font-medium">
                                    <GraduationCap size={18} className="text-indigo-400" />
                                    <span>Curso de Foco</span>
                                </div>
                                <select
                                    value={prefs.focusCourse}
                                    onChange={e => setPrefs({ ...prefs, focusCourse: e.target.value as any })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="Medicina">Medicina (Alta Concorrência)</option>
                                    <option value="Engenharia">Engenharia</option>
                                    <option value="Direito">Direito</option>
                                    <option value="Geral">Outros / Geral</option>
                                </select>
                                <p className="text-xs text-zinc-500 mt-2">Ajusta prioridade das matérias (Ex: Medicina → Natureza 70%).</p>
                            </div>

                            {/* Coverage Info */}
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                <div className="flex items-center gap-2 mb-3 text-white font-medium">
                                    <Calendar size={18} className="text-emerald-400" />
                                    <span>Cobertura Completa</span>
                                </div>
                                <p className="text-sm text-zinc-300">
                                    Toda a matéria do ENEM distribuída até <strong className="text-emerald-400">outubro</strong>.
                                </p>
                                <p className="text-xs text-zinc-500 mt-2">Teoria + Fixação + Revisão D+1, D+7, D+30.</p>
                            </div>
                        </div>

                        <hr className="border-zinc-800" />

                        <h3 className="text-lg font-medium text-white">Disponibilidade de Tempo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                                <div className="flex items-center gap-2 mb-2 text-zinc-300">
                                    <Clock size={16} />
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
                                    <Calendar size={16} />
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

                {/* ━━━ Step 2: Proficiency ━━━ */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Auto-Avaliação</h3>
                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Define prioridade inicial</span>
                        </div>

                        <p className="text-sm text-zinc-400">Quanto menor a aptidão, maior a frequência e duração no cronograma.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700">
                            {ALL_SUBJECTS.map(subj => (
                                <div key={subj} className="bg-zinc-800/30 p-3 rounded-xl border border-zinc-800/50 flex flex-col gap-2 hover:border-zinc-700 transition-colors">
                                    <span className="text-zinc-300 font-medium text-sm">{subj}</span>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(r => (
                                                <button
                                                    key={r}
                                                    onClick={() => setPrefs(p => ({ ...p, proficiency: { ...p.proficiency, [subj]: r } }))}
                                                    className={`p-0.5 transition-transform hover:scale-110 ${(prefs.proficiency[subj] || 3) >= r ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'
                                                        }`}
                                                >
                                                    <Star size={18} />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                                            {(prefs.proficiency[subj] || 3) <= 2 && 'Prioridade Alta'}
                                            {(prefs.proficiency[subj] || 3) === 3 && 'Normal'}
                                            {(prefs.proficiency[subj] || 3) >= 4 && 'Revisão'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setStep(1)} className="px-4 py-2 text-zinc-400 hover:text-white flex items-center gap-2"><ChevronLeft size={16} /> Voltar</button>
                            <button
                                onClick={() => setStep(3)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                            >
                                Próximo <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ━━━ Step 3: Confirmation ━━━ */}
                {step === 3 && (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Brain size={48} className="text-indigo-500" />
                        </div>

                        <h3 className="text-2xl font-bold text-white">Tudo pronto!</h3>
                        <div className="text-zinc-400 max-w-md mx-auto space-y-2">
                            <p>O algoritmo vai cobrir <strong>toda a matéria do ENEM</strong> até outubro, com foco em <strong>{prefs.focusCourse}</strong>.</p>
                            <ul className="text-sm text-zinc-500 bg-zinc-800/50 p-4 rounded-lg text-left list-disc list-inside space-y-1">
                                <li>Cobertura: <strong>100% do conteúdo</strong></li>
                                <li>Seg–Sex: <strong>{prefs.hoursPerDay.weekdays}h/dia</strong> | FDS: <strong>{prefs.hoursPerDay.weekend}h/dia</strong></li>
                                <li>Blocos: Aula (60 min) + Fixação (45 min)</li>
                                <li>Revisão Espaçada: <strong>D+1, D+7, D+30</strong></li>
                                <li>Redação: <strong>Todo Domingo</strong></li>
                            </ul>
                        </div>

                        <div className="flex justify-center gap-3 mt-8">
                            <button onClick={() => setStep(2)} className="px-4 py-2 text-zinc-400 hover:text-white">Voltar</button>
                            <button
                                onClick={handleFinish}
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Gerando...' : 'Gerar Planejamento 🚀'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
