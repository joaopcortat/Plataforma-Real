import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Timer, Zap } from 'lucide-react';
import { useStudyTimer } from '../../contexts/StudyTimerContext';

type TimerState = 'idle' | 'running' | 'paused';

export function FocusTimerPanel() {
    const { openTimer, openSessionModal } = useStudyTimer();

    const [timerState, setTimerState] = useState<TimerState>('idle');
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (timerState === 'running') {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [timerState]);

    const formatTime = (total: number) => {
        const h = Math.floor(total / 3600);
        const m = Math.floor((total % 3600) / 60);
        const s = total % 60;
        if (h > 0) {
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => setTimerState('running');
    const handlePause = () => setTimerState('paused');
    const handleResume = () => setTimerState('running');

    const handleFinish = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimerState('idle');
        openSessionModal(seconds); // → goes directly to registration modal
        setSeconds(0);
    };

    const handleCancel = () => {
        setTimerState('idle');
        setSeconds(0);
    };

    const handleFullSession = () => openTimer();

    const isIdle = timerState === 'idle';
    const isRunning = timerState === 'running';
    const isPaused = timerState === 'paused';

    return (
        <div className={`bg-zinc-900/80 border rounded-2xl p-6 transition-colors ${isRunning ? 'border-primary/40' : 'border-zinc-800 hover:border-primary/30'}`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isRunning ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'}`}>
                    <Timer size={20} />
                </div>
                <div>
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Sessão Foco</p>
                    <p className="text-sm font-medium text-zinc-300 leading-none mt-0.5">
                        {isIdle && 'Pronto para estudar?'}
                        {isRunning && <span className="text-primary animate-pulse">● Em foco</span>}
                        {isPaused && <span className="text-amber-400">⏸ Pausado</span>}
                    </p>
                </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-center py-4">
                {isIdle ? (
                    <div className="font-mono text-5xl font-bold text-zinc-700 tracking-tight">
                        00:00
                    </div>
                ) : (
                    <div className={`font-mono text-5xl font-bold tracking-tight transition-colors ${isRunning ? 'text-white' : 'text-amber-400'}`}>
                        {formatTime(seconds)}
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-2">
                {isIdle && (
                    <>
                        <button
                            onClick={handleStart}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]"
                        >
                            <Play size={16} fill="currentColor" />
                            Iniciar Sessão
                        </button>
                        <button
                            onClick={handleFullSession}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-all"
                        >
                            <Zap size={14} />
                            Usar Cronômetro Completo
                        </button>
                    </>
                )}

                {isRunning && (
                    <div className="space-y-2">
                        <button
                            onClick={handlePause}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all"
                        >
                            <Pause size={16} fill="currentColor" />
                            Pausar
                        </button>
                        <button
                            onClick={handleFinish}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-sm font-bold rounded-xl transition-all"
                        >
                            <Square size={14} fill="currentColor" />
                            Finalizar e Registrar
                        </button>
                    </div>
                )}

                {isPaused && (
                    <div className="space-y-2">
                        <button
                            onClick={handleResume}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                        >
                            <Play size={16} fill="currentColor" />
                            Retomar
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleFinish}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold rounded-xl transition-all"
                            >
                                <Square size={12} fill="currentColor" />
                                Finalizar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center justify-center gap-1.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 text-xs font-bold rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
