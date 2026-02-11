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

export function StudySessionModal({ isOpen, onClose, totalSeconds, onSuccess }: StudySessionModalProps) {
    const { user } = useAuth();
    const { sessionNotes, setSessionNotes } = useStudyTimer();
    const [loading, setLoading] = useState(false);

    // Inputs
    const [classesCount, setClassesCount] = useState('');
    const [qLinguagens, setQLinguagens] = useState('');
    const [qHumanas, setQHumanas] = useState('');
    const [qNatureza, setQNatureza] = useState('');
    const [qMatematica, setQMatematica] = useState('');
    const [topics, setTopics] = useState(sessionNotes || '');

    // Update topics when modal opens or sessionNotes changes (if needed, but init is usually enough if modal remounts or we verify isOpen)
    // Actually, since modal might be mounted but hidden, we should sync when isOpen becomes true.
    // However, useState init only runs once. Let's use useEffect to sync when isOpen changes.
    useEffect(() => {
        if (isOpen) {
            setTopics(sessionNotes || '');
        }
    }, [isOpen, sessionNotes]);

    if (!isOpen) return null;

    const formatDuration = (totalSecs: number) => {
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        return `${hrs}h ${mins}m`;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error('User not logged in');

            const totalQuestions =
                (parseInt(qLinguagens) || 0) +
                (parseInt(qHumanas) || 0) +
                (parseInt(qNatureza) || 0) +
                (parseInt(qMatematica) || 0);

            const breakdown = {
                linguagens: parseInt(qLinguagens) || 0,
                humanas: parseInt(qHumanas) || 0,
                natureza: parseInt(qNatureza) || 0,
                matematica: parseInt(qMatematica) || 0
            };

            const sessionData = {
                user_id: user.id,
                duration_seconds: totalSeconds,
                classes_count: parseInt(classesCount) || 0,
                questions_count: totalQuestions,
                subject_breakdown: breakdown,
                notes: topics,
                created_at: new Date().toISOString()
            };

            // 1. Save to study_sessions table (if exists, checking later)
            // For now, assuming table exists as per plan. 
            // If it doesn't, we might need to rely on daily_goals, but user wants a "session log".
            // We'll trust the SQL we generated will be applied or at least we try.

            const { error } = await supabase
                .from('study_sessions')
                .insert(sessionData);

            if (error) {
                // Determine if error is "relation does not exist"
                if (error.code === '42P01') {
                    // Fallback or Alert?
                    alert('Erro: Tabela de sessões não encontrada. Contate o suporte.');
                } else {
                    console.error('Error saving session:', error);
                    alert(`Erro ao salvar sessão: ${error.message} (${error.details || ''})`);
                }
                setLoading(false);
                return;
            }

            // 2. Ideally update daily_goals too? 
            // We can do that via trigger or manually.
            // Let's manually increment daily_goals for today just to be sure metrics update immediately?
            // Or assume dashboard recalculates from goals.
            // I'll leave daily_goals update for now to avoid complexity/conflicts.
            // Dashboard metric uses daily goals. 
            // IF Dashboard Metric uses daily_goals, and we insert into study_sessions, the Dashboard Metric WON'T update unless we fetch from study_sessions too.
            // Dashboard.tsx code: `goalsData?.reduce((acc, curr) => acc + (curr.questions_done || 0), 0)`
            // So we SHOULD update daily_goals too.

            const today = new Date().toISOString().split('T')[0];

            // Check if goal exists for today
            const { data: goals } = await supabase
                .from('daily_goals')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .single();

            // Split topics
            const newTasks = topics
                .split(/[\n,]/)
                .map(t => t.trim())
                .filter(t => t.length > 0);

            if (goals) {
                // Append new tasks to existing ones
                const existingTasks = Array.isArray(goals.tasks) ? goals.tasks : [];
                const updatedTasks = [...existingTasks, ...newTasks];

                await supabase.from('daily_goals').update({
                    questions_done: (goals.questions_done || 0) + totalQuestions,
                    classes_done: (goals.classes_done || 0) + (parseInt(classesCount) || 0),
                    tasks: updatedTasks
                }).eq('id', goals.id);
            } else {
                // Create new goal entry for today just for tracking
                await supabase.from('daily_goals').insert({
                    user_id: user.id,
                    date: today,
                    questions_done: totalQuestions,
                    classes_done: parseInt(classesCount) || 0,
                    completed: false,
                    tasks: newTasks
                });
            }

            onSuccess();
            setSessionNotes(''); // Clear global notes
            window.location.reload(); // To refresh dashboard metrics

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Registrar Sessão</h2>
                        <p className="text-zinc-400 text-sm">
                            Tempo total: <span className="text-emerald-400 font-mono font-bold">{formatDuration(totalSeconds)}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Topics / Goals */}
                    <div className="space-y-1">
                        <label className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                            <PenTool size={12} /> Tópicos / Metas da Sessão
                        </label>
                        <textarea
                            placeholder="Ex: Revisão de Logaritmos, Resumo de Revolução Francesa..."
                            value={topics}
                            onChange={(e) => setTopics(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                        />
                    </div>

                    {/* Classes */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 mb-3 text-blue-400 font-medium">
                            <BookOpen size={18} />
                            Aulas Assistidas
                        </div>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={classesCount}
                            onChange={(e) => setClassesCount(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Questions */}
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <div className="flex items-center gap-2 mb-4 text-emerald-400 font-medium">
                            <CheckCircle2 size={18} />
                            Questões Resolvidas
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Linguagens</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={qLinguagens}
                                    onChange={(e) => setQLinguagens(e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-white focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Humanas</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={qHumanas}
                                    onChange={(e) => setQHumanas(e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-white focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Natureza</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={qNatureza}
                                    onChange={(e) => setQNatureza(e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-white focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 mb-1 block">Matemática</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={qMatematica}
                                    onChange={(e) => setQMatematica(e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-2 text-white focus:border-emerald-500"
                                />
                            </div>
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
