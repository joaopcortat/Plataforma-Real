import { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle2, Save, PenTool } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useStudyTimer } from '../../contexts/StudyTimerContext';

interface StudySessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalSeconds: number;
    onSuccess: () => void;
}

const SUBJECTS = ['linguagens', 'humanas', 'natureza', 'matematica'] as const;
type Subject = typeof SUBJECTS[number];

const SUBJECT_LABELS: Record<Subject, string> = {
    linguagens: 'Linguagens',
    humanas: 'Humanas',
    natureza: 'Natureza',
    matematica: 'Matemática',
};

export function StudySessionModal({ isOpen, onClose, totalSeconds, onSuccess }: StudySessionModalProps) {
    const { user } = useAuth();
    const { sessionNotes, setSessionNotes } = useStudyTimer();
    const [loading, setLoading] = useState(false);

    const [classesPerSubject, setClassesPerSubject] = useState<Record<Subject, string>>({
        linguagens: '', humanas: '', natureza: '', matematica: '',
    });
    const [questionsPerSubject, setQuestionsPerSubject] = useState<Record<Subject, string>>({
        linguagens: '', humanas: '', natureza: '', matematica: '',
    });
    const [topics, setTopics] = useState(sessionNotes || '');

    useEffect(() => {
        if (isOpen) {
            setTopics(sessionNotes || '');
        }
    }, [isOpen, sessionNotes]);

    if (!isOpen) return null;

    const formatDuration = (totalSecs: number) => {
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        if (hrs > 0) return `${hrs}h ${mins}m`;
        return `${mins}m ${secs}s`;
    };

    const totalClasses = SUBJECTS.reduce((s, k) => s + (parseInt(classesPerSubject[k]) || 0), 0);
    const totalQuestions = SUBJECTS.reduce((s, k) => s + (parseInt(questionsPerSubject[k]) || 0), 0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error('User not logged in');

            const classesBreakdown = Object.fromEntries(
                SUBJECTS.map(k => [`classes_${k}`, parseInt(classesPerSubject[k]) || 0])
            );
            const questionsBreakdown = Object.fromEntries(
                SUBJECTS.map(k => [k, parseInt(questionsPerSubject[k]) || 0])
            );
            const subjectBreakdown = { ...questionsBreakdown, ...classesBreakdown };

            const sessionData = {
                user_id: user.id,
                duration_seconds: totalSeconds,
                classes_count: totalClasses,
                questions_count: totalQuestions,
                subject_breakdown: subjectBreakdown,
                notes: topics,
                created_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('study_sessions').insert(sessionData);

            if (error) {
                if (error.code === '42P01') {
                    alert('Erro: Tabela de sessões não encontrada.');
                } else {
                    alert(`Erro ao salvar sessão: ${error.message}`);
                }
                setLoading(false);
                return;
            }

            // Update daily_goals
            const today = new Date().toISOString().split('T')[0];
            const { data: goals } = await supabase
                .from('daily_goals')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            const newTasks = topics.split(/[\n,]/).map(t => t.trim()).filter(t => t.length > 0);

            if (goals) {
                const existingTasks = Array.isArray(goals.tasks) ? goals.tasks : [];
                await supabase.from('daily_goals').update({
                    questions_done: (goals.questions_done || 0) + totalQuestions,
                    classes_done: (goals.classes_done || 0) + totalClasses,
                    tasks: [...existingTasks, ...newTasks],
                }).eq('id', goals.id);
            } else {
                await supabase.from('daily_goals').insert({
                    user_id: user.id,
                    date: today,
                    questions_done: totalQuestions,
                    classes_done: totalClasses,
                    completed: false,
                    tasks: newTasks,
                });
            }

            onSuccess();
            setSessionNotes('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar Sessão</h2>
                        <p className="text-zinc-400 text-sm mt-0.5">
                            Tempo total: <span className="text-primary font-mono font-bold">{formatDuration(totalSeconds)}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white p-1">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Topics */}
                    <div className="space-y-1.5">
                        <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                            <PenTool size={12} /> Tópicos / Metas da Sessão
                        </label>
                        <textarea
                            placeholder="Ex: Revisão de Logaritmos, Resumo de Revolução Francesa..."
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm focus:border-primary focus:outline-none min-h-[70px] resize-none placeholder:text-zinc-600"
                        />
                    </div>

                    {/* Aulas por Matéria */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <BookOpen size={14} />
                                </div>
                                Aulas Assistidas
                            </div>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{totalClasses} total</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {SUBJECTS.map(sub => (
                                <div key={sub}>
                                    <label className="text-xs text-zinc-500 mb-1 block">{SUBJECT_LABELS[sub]}</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={classesPerSubject[sub]}
                                        onChange={(e) => setClassesPerSubject(prev => ({ ...prev, [sub]: e.target.value }))}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Questões por Matéria */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <CheckCircle2 size={14} />
                                </div>
                                Questões Resolvidas
                            </div>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{totalQuestions} total</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {SUBJECTS.map(sub => (
                                <div key={sub}>
                                    <label className="text-xs text-zinc-500 mb-1 block">{SUBJECT_LABELS[sub]}</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={questionsPerSubject[sub]}
                                        onChange={(e) => setQuestionsPerSubject(prev => ({ ...prev, [sub]: e.target.value }))}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white text-sm focus:border-primary focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        {loading ? 'Salvando...' : 'Salvar Sessão'}
                    </button>
                </form>
            </div>
        </div>
    );
}
