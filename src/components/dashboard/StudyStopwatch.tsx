import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Play, Pause, Square, X, Maximize2, PenTool } from 'lucide-react';
import { useStudyTimer } from '../../contexts/StudyTimerContext';

interface StudyStopwatchProps {
    isOpen: boolean;
    onClose: () => void;
    onFinish: (secondsSpent: number) => void;
}

export function StudyStopwatch({ isOpen, onClose, onFinish }: StudyStopwatchProps) {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hideTimer, setHideTimer] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    const [isMinimized, setIsMinimized] = useState(false);

    const { sessionNotes, setSessionNotes } = useStudyTimer();

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSeconds(0);
            setIsRunning(false);
            setIsPaused(false);
            setIsMinimized(false);
        } else {
            stopTimer();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, isPaused]);

    function stopTimer() {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
    }

    function handleStart() {
        setIsRunning(true);
        setIsPaused(false);
    }

    function handlePause() {
        setIsPaused(true);
    }

    function handleResume() {
        setIsPaused(false);
    }

    function handleFinish() {
        stopTimer();
        onFinish(seconds);
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    // Minimized View
    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 flex items-center gap-4 w-72 backdrop-blur-md bg-opacity-95">
                    {/* Time Display */}
                    <div className="flex-1">
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Tempo Estudado</span>
                        <div className="font-mono text-2xl font-bold text-white tracking-widest">
                            {formatTime(seconds)}
                        </div>
                    </div>

                    {/* Mini Controls */}
                    <div className="flex gap-2">
                        {!isPaused ? (
                            <button onClick={handlePause} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors">
                                <Pause size={16} fill="currentColor" />
                            </button>
                        ) : (
                            <button onClick={handleResume} className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors">
                                <Play size={16} fill="currentColor" />
                            </button>
                        )}
                        <button onClick={() => setIsMinimized(false)} className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors" title="Expandir">
                            <Maximize2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Full Screen View
    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Top Bar */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-zinc-400">
                <button
                    onClick={() => setHideTimer(!hideTimer)}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                >
                    {hideTimer ? <Eye size={18} /> : <EyeOff size={18} />}
                    {hideTimer ? "Mostrar Tempo" : "Ocultar Tempo"}
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMinimized(true)}
                        className="hover:text-white flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
                    >
                        <span className="hidden sm:inline">Minimizar</span>
                        <span className="text-lg font-bold leading-none mb-1">_</span>
                    </button>
                    <button onClick={onClose} className="hover:text-white p-2">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Display */}
            <div className="flex flex-col items-center max-w-4xl w-full px-4 space-y-12">
                <div className="flex flex-col items-center w-full min-h-[160px] justify-center transition-all duration-500">
                    {!hideTimer && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-12 py-6 min-w-[320px] text-center shadow-lg shadow-emerald-500/5 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300 relative group">
                            <span className="text-zinc-400 font-medium tracking-wide uppercase text-sm mb-2 block">Tempo de Estudo</span>
                            <div className="text-7xl font-mono font-bold tracking-tight text-white transition-all duration-300">
                                {formatTime(seconds)}
                            </div>

                            {/* Hover Action to show notes */}
                            {!isRunning && !showNotes && (
                                <div className="absolute -bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setShowNotes(true)} className="text-xs text-zinc-500 hover:text-emerald-400 flex items-center justify-center gap-1 mx-auto">
                                        <PenTool size={10} /> Definir Metas
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notes / Goals Input */}
                {(showNotes || (sessionNotes && sessionNotes.length > 0)) && (
                    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                                    <PenTool size={12} />
                                    Metas da Sessão
                                </label>
                                <button onClick={() => setShowNotes(!showNotes)} className="text-zinc-600 hover:text-zinc-400">
                                    <X size={14} />
                                </button>
                            </div>
                            <textarea
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                placeholder="O que você vai estudar hoje? (Ex: Resolver 10 questões de Logaritmo)"
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 min-h-[80px] resize-none placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div>
                    {!isRunning ? (
                        <button
                            onClick={handleStart}
                            className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-emerald-900/20 transform hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <Play fill="currentColor" />
                            Iniciar Sessão
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            {!isPaused ? (
                                <button
                                    onClick={handlePause}
                                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Pause fill="currentColor" size={20} />
                                    Pausar
                                </button>
                            ) : (
                                <button
                                    onClick={handleResume}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <Play fill="currentColor" size={20} />
                                    Retomar
                                </button>
                            )}

                            <button
                                onClick={handleFinish}
                                className="px-8 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-600/20 font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                                <Square fill="currentColor" size={18} />
                                Finalizar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
