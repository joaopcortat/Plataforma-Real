import { useState } from 'react';
import { X, BookOpen, CheckCircle2, Save, Calendar, Clock, PenTool } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ManualStudyEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ManualStudyEntryModal({ isOpen, onClose, onSuccess }: ManualStudyEntryModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Inputs
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');

    const [classesCount, setClassesCount] = useState('');
    const [qLinguagens, setQLinguagens] = useState('');
    const [qHumanas, setQHumanas] = useState('');
    const [qNatureza, setQNatureza] = useState('');
    const [qMatematica, setQMatematica] = useState('');
    const [topics, setTopics] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) throw new Error('User not logged in');

            // Calculate total seconds
            const durationSeconds = ((parseInt(hours) || 0) * 3600) + ((parseInt(minutes) || 0) * 60);

            if (durationSeconds <= 0 && !topics && !classesCount) {
                // Allow saving just topics/classes even if time is 0? Maybe not. Let's keep time required or at least 1 field.
                // User request implies linking study data. Time is usually key.
                if (durationSeconds <= 0) {
                    alert('Por favor, informe o tempo de estudo.');
                    setLoading(false);
                    return;
                }
            }

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
                duration_seconds: durationSeconds,
                classes_count: parseInt(classesCount) || 0,
                questions_count: totalQuestions,
                subject_breakdown: breakdown,
                notes: topics, // Save topics to study_sessions
                created_at: new Date(date).toISOString() // Use selected date
            };

            // 1. Save to study_sessions table
            const { error } = await supabase
                .from('study_sessions')
                .insert(sessionData);

            if (error) {
                console.error('Error saving session:', error);
                alert('Erro ao salvar sessão.');
                setLoading(false);
                return;
            }

            // 2. Update daily_goals ONLY if the date is TODAY
            const today = new Date().toISOString().split('T')[0];
            if (date === today) {
                const { data: goals } = await supabase
                    .from('daily_goals')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('date', today)
                    .single();

                // Split topics by newline or comma and filter empty
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
                    await supabase.from('daily_goals').insert({
                        user_id: user.id,
                        date: today,
                        questions_done: totalQuestions,
                        classes_done: parseInt(classesCount) || 0,
                        completed: false,
                        tasks: newTasks
                    });
                }
            }

            onSuccess();
            window.location.reload(); // Refresh to update metrics

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
                        <h2 className="text-xl font-bold text-white">Registrar Estudo Manual</h2>
                        <p className="text-zinc-400 text-sm">Adicione detalhes da sua sessão</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                                <Calendar size={12} /> Data
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                                <Clock size={12} /> Duração
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="H"
                                    value={hours}
                                    onChange={(e) => setHours(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    placeholder="M"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

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
                        {loading ? 'Salvando...' : 'Salvar Registro'}
                    </button>

                </form>
            </div>
        </div>
    );
}
