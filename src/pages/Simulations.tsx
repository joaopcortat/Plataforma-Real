import { useState, useEffect } from 'react';
import { BookOpen, Clock, Play, History, Trophy, Timer as TimerIcon, PlusCircle, ArrowLeft, BarChart3, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { SimulationTimer } from '../components/simulations/SimulationTimer';
import { RegisterResultModal } from '../components/simulations/RegisterResultModal';
import { SimulationProgression } from '../components/simulations/SimulationProgression';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

type SimulationType = 'enem_day1' | 'enem_day2' | 'custom' | null;

interface ExamConfig {
    id: SimulationType;
    title: string;
    description: string;
    time: string;
    minutes: number;
    color: string;
    icon: any;
    subject: string;
    questions: number;
}

const EXAM_TYPES: ExamConfig[] = [
    {
        id: 'enem_day1',
        title: 'ENEM Dia 1',
        description: 'Linguagens, Humanas e Redação',
        time: '5h 30m',
        minutes: 330,
        color: 'from-orange-500 to-red-600',
        icon: BookOpen,
        subject: 'Linguagens e Humanas',
        questions: 90
    },
    {
        id: 'enem_day2',
        title: 'ENEM Dia 2',
        description: 'Matemática e Natureza',
        time: '5h 00m',
        minutes: 300,
        color: 'from-blue-500 to-indigo-600',
        icon: BrainCircuit,
        subject: 'Natureza e Matemática',
        questions: 90
    },
    {
        id: 'custom',
        title: 'Simulado Fragmentado',
        description: 'Tempo e meta personalizáveis',
        time: 'Personalizado',
        minutes: 0, // Set by user
        color: 'from-emerald-500 to-teal-600',
        icon: TimerIcon,
        subject: 'Personalizado',
        questions: 0 // Will be ignored or handled as N/A
    }
];

export function Simulations() {
    const [view, setView] = useState<'menu' | 'take' | 'progression'>('menu');
    const [activeSimulation, setActiveSimulation] = useState<ExamConfig | null>(null);
    const [showTimer, setShowTimer] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [finishedTime, setFinishedTime] = useState(0); // Minutes spent
    const [history, setHistory] = useState<any[]>([]);

    // Custom Time Modal State
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [customTime, setCustomTime] = useState(60); // Default 1h

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('simulation_results')
                .select('*, linguagens_correct, humanas_correct, natureza_correct, matematica_correct, redacao_score, exam_type')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data && !error) {
                setHistory(data);
                return;
            }
            if (data && !error) {
                setHistory(data);
                return;
            }
        }
        setHistory([]);
    }

    function handleStartClick(exam: ExamConfig) {
        if (exam.id === 'custom') {
            setActiveSimulation(exam);
            setShowCustomModal(true);
        } else {
            setActiveSimulation(exam);
            setShowTimer(true);
        }
    }

    function handleCustomStart() {
        if (activeSimulation && activeSimulation.id === 'custom') {
            activeSimulation.minutes = customTime;
            setShowCustomModal(false);
            setShowTimer(true);
        }
    }

    function handleFinish(timeSpent: number) {
        setFinishedTime(timeSpent);
        setShowTimer(false);
        setShowRegister(true);
    }

    function handleManualRegister() {
        setActiveSimulation({
            id: 'custom',
            title: 'Simulado Antigo',
            description: 'Registro manual',
            time: 'N/A',
            minutes: 0,
            color: 'from-zinc-500 to-zinc-600',
            icon: History,
            subject: 'Geral',
            questions: 90
        });
        setFinishedTime(0); // Indicates manual entry
        setShowRegister(true);
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    {view !== 'menu' && (
                        <button
                            onClick={() => setView('menu')}
                            className="p-2 -ml-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-white">Simulados</h1>
                </div>
                <p className="text-zinc-400">
                    {view === 'menu' && "Ambiente real de prova e análise de evolução."}
                    {view === 'take' && "Escolha o modo de prova ideal para seu momento."}
                    {view === 'progression' && "Acompanhe sua evolução e identifique pontos de melhoria."}
                </p>
            </div>

            {/* Menu View */}
            {view === 'menu' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fazer Simulado Card */}
                        <button
                            onClick={() => setView('take')}
                            className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all hover:translate-y-[-4px] hover:shadow-2xl text-left h-80 flex flex-col justify-end"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/exam-card.png"
                                    alt="Ambiente de Prova"
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8">
                                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Fazer Simulado</h2>
                                <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-sm">
                                    Entre no modo de prova com cronômetro oficial e simulados completos do ENEM.
                                </p>
                            </div>
                        </button>

                        {/* Progressão Card */}
                        <button
                            onClick={() => setView('progression')}
                            className="group relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all hover:translate-y-[-4px] hover:shadow-2xl text-left h-80 flex flex-col justify-end"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src="/assets/progression-card.png"
                                    alt="Gráficos de Evolução"
                                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                            </div>

                            <div className="relative z-10 p-8">
                                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">Progressão</h2>
                                <p className="text-zinc-300 text-sm font-medium leading-relaxed max-w-sm">
                                    Visualize sua evolução com gráficos detalhados de desempenho por área e nota.
                                </p>
                            </div>
                        </button>
                    </div>

                    {/* Footer Action */}
                    <div className="flex justify-center border-t border-zinc-800/50 pt-8">
                        <button
                            onClick={handleManualRegister}
                            className="flex items-center gap-3 text-zinc-400 hover:text-white px-6 py-3 rounded-full hover:bg-zinc-900 transition-all group"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 group-hover:text-primary transition-colors">
                                <PlusCircle size={16} />
                            </div>
                            <span className="font-medium">Registrar resultado de prova anterior manualmente</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Take View */}
            {view === 'take' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {EXAM_TYPES.map((exam) => (
                            <div
                                key={exam.id}
                                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all hover:translate-y-[-2px] hover:shadow-xl flex flex-col"
                            >
                                <div className={clsx("h-2 bg-gradient-to-r", exam.color)} />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br opacity-80", exam.color)}>
                                        <exam.icon className="text-white w-6 h-6" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">{exam.title}</h3>
                                    <p className="text-zinc-400 text-sm mb-6 flex-1">{exam.description}</p>

                                    <div className="flex items-center gap-2 text-zinc-300 text-sm font-mono bg-zinc-950/50 p-2 rounded-lg mb-4 justify-center">
                                        <Clock size={16} />
                                        {exam.time}
                                    </div>

                                    <button
                                        onClick={() => handleStartClick(exam)}
                                        className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors group-hover:bg-white group-hover:text-black font-bold"
                                    >
                                        <Play size={16} fill="currentColor" />
                                        Iniciar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick History */}
                    {history.length > 0 && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <History size={20} className="text-zinc-400" />
                                Últimos Resultados
                            </h2>
                            <div className="space-y-3">
                                {history.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                                        <div>
                                            <div className="font-medium text-white">{item.title}</div>
                                            <div className="text-xs text-zinc-500">{format(new Date(item.created_at || new Date()), 'dd/MM/yyyy')}</div>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
                                            <Trophy size={14} />
                                            {item.score}/{item.total_questions}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Progression View */}
            {view === 'progression' && (
                <div className="animate-in slide-in-from-right-4 duration-300">
                    <SimulationProgression history={history} />
                </div>
            )}

            {/* Custom Time Modal */}
            {showCustomModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-xl font-bold text-white mb-4">Configurar Tempo</h3>
                        <p className="text-zinc-400 mb-6 font-medium">Quanto tempo você dedica a este simulado?</p>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-zinc-300 font-mono text-2xl font-bold p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                                <button onClick={() => setCustomTime(t => Math.max(15, t - 15))} className="hover:text-primary">-</button>
                                <span>{Math.floor(customTime / 60)}h {customTime % 60}m</span>
                                <button onClick={() => setCustomTime(t => t + 15)} className="hover:text-primary">+</button>
                            </div>
                            <input
                                type="range"
                                min="15"
                                max="300"
                                step="15"
                                value={customTime}
                                onChange={(e) => setCustomTime(parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCustomModal(false)}
                                className="px-4 py-2 text-zinc-400 hover:text-white"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCustomStart}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-black font-bold rounded-lg"
                            >
                                Começar Prova
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Timer Component */}
            <SimulationTimer
                isOpen={showTimer}
                onClose={() => setShowTimer(false)}
                onFinish={handleFinish}
                simulationTitle={activeSimulation?.title || ''}
                totalQuestions={90} // Default for visual, update later if needed
                durationMinutes={activeSimulation?.minutes || 60}
            />

            {/* Register Modal */}
            <RegisterResultModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                simulation={activeSimulation}
                timeSpent={finishedTime}
                onSuccess={() => {
                    loadHistory();
                    setShowRegister(false);
                }}
            />
        </div>
    );
}
