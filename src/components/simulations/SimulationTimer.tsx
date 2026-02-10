import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Play, Pause, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import clsx from 'clsx';

interface SimulationTimerProps {
    isOpen: boolean;
    onClose: () => void;
    onFinish: (timeSpent: number) => void;
    simulationTitle: string;
    totalQuestions: number;
    durationMinutes: number;
}

const TIME_PRESETS = [
    { label: '5h30m', minutes: 330 },
    { label: '4h30m', minutes: 270 },
    { label: '3h30m', minutes: 210 },
    { label: '2h30m', minutes: 150 },
    { label: '1h30m', minutes: 90 },
    { label: '0h45m', minutes: 45 },
    { label: '0h15m', minutes: 15 },
    { label: '5h00m', minutes: 300 },
    { label: '4h00m', minutes: 240 },
    { label: '3h00m', minutes: 180 },
    { label: '2h00m', minutes: 120 },
    { label: '1h00m', minutes: 60 },
    { label: '0h30m', minutes: 30 },
    { label: '0h00m', minutes: 0 },
];

export function SimulationTimer({ isOpen, onClose, onFinish, simulationTitle, durationMinutes }: SimulationTimerProps) {
    const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hideTimer, setHideTimer] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Refs
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const previousVisibleCountRef = useRef<number>(0);

    // Audio Context Ref
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initial Setup
    useEffect(() => {
        if (isOpen) {
            setSecondsLeft(durationMinutes * 60);
            setIsRunning(false); // Start manually
            setIsPaused(false);
            // Initialize with all presets that should be visible for this duration
            previousVisibleCountRef.current = TIME_PRESETS.filter(p => durationMinutes >= p.minutes).length;
        } else {
            stopTimer();
        }
    }, [isOpen, durationMinutes]);

    // Initialize Audio Context
    useEffect(() => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
        }
        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    function playSoftBeep() {
        if (!audioContextRef.current || !soundEnabled) return;

        try {
            // Resume context if suspended (browser autoplay policy)
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);

            oscillator.start();
            oscillator.stop(audioContextRef.current.currentTime + 0.5);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }

    // Timer Logic
    useEffect(() => {
        if (isRunning && !isPaused) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    const timeLeft = prev - 1;

                    // Check if any preset card has been "removed" (visibility change)
                    const currentVisibleCount = TIME_PRESETS.filter(p => Math.ceil(timeLeft / 60) >= p.minutes).length;

                    if (currentVisibleCount < previousVisibleCountRef.current) {
                        playSoftBeep();
                        previousVisibleCountRef.current = currentVisibleCount;
                    }

                    if (timeLeft <= 0) {
                        stopTimer();
                        return 0;
                    }
                    return timeLeft;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, isPaused, soundEnabled]);

    function stopTimer() {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
    }

    function handleStart() {
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
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
        const spent = Math.ceil((durationMinutes * 60 - secondsLeft) / 60);
        onFinish(spent > 0 ? spent : 0);
    }

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center animate-in fade-in duration-300 overflow-y-auto">

            {/* Top Bar Controls */}
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center text-zinc-400">
                <button
                    onClick={() => setHideTimer(!hideTimer)}
                    className="flex items-center gap-2 hover:text-white transition-colors border-b border-transparent hover:border-zinc-500 pb-0.5"
                >
                    {hideTimer ? <Eye size={18} /> : <EyeOff size={18} />}
                    {hideTimer ? "Mostrar Tempo Digital" : "Modo Fiscal (Blocos)"}
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={clsx("p-2 rounded-full transition-colors", soundEnabled ? "text-primary bg-primary/10" : "text-zinc-600 hover:text-zinc-400")}
                    >
                        {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                    <div className="text-zinc-600">|</div>
                    <h2 className="text-white font-medium">{simulationTitle}</h2>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center max-w-4xl w-full px-4 space-y-12">

                {/* Main Timer Display */}
                <div className="flex flex-col items-center w-full min-h-[160px] justify-center transition-all duration-500">
                    {!hideTimer && (
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl px-12 py-6 min-w-[320px] text-center shadow-lg shadow-blue-500/5 backdrop-blur-sm relative overflow-hidden group animate-in fade-in zoom-in-95 duration-300">
                            <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                            <span className="text-zinc-400 font-medium tracking-wide uppercase text-sm mb-2 block relative z-10">Tempo Restante</span>
                            <div className="text-7xl font-mono font-bold tracking-tight relative z-10 text-white transition-all duration-300">
                                {formatTime(secondsLeft)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Primary Action Button */}
                <div>
                    {!isRunning ? (
                        <button
                            onClick={handleStart}
                            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xl font-bold rounded-xl shadow-lg shadow-blue-900/20 transform hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <Play fill="currentColor" />
                            Começar Prova
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            {!isPaused ? (
                                <button
                                    onClick={handlePause}
                                    className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Pause fill="currentColor" size={20} />
                                    Pausar Prova
                                </button>
                            ) : (
                                <button
                                    onClick={handleResume}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                                >
                                    <Play fill="currentColor" size={20} />
                                    Retomar Prova
                                </button>
                            )}

                            <button
                                onClick={handleFinish}
                                className="px-8 py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                                Finalizar
                            </button>
                        </div>
                    )}
                </div>

                {/* Reset Grid / Analog Blocks */}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3 transition-opacity duration-300">
                    {TIME_PRESETS.sort((a, b) => b.minutes - a.minutes).map((preset) => {
                        // Logic: If running, show block if time remaining covers this block's start time.
                        // Preset e.g. 330m (5h30). If secondsLeft/60 >= 330, it's full.
                        // Actually, standard countdown logic: 
                        // If I have 5h left (300m), the 5h30m block is GONE.
                        // The 5h00m block is present.
                        const isVisible = !isRunning || Math.ceil(secondsLeft / 60) >= preset.minutes;

                        return (
                            <button
                                key={preset.label}
                                disabled={isRunning} // Disable clicking while running
                                onClick={() => {
                                    setSecondsLeft(preset.minutes * 60);
                                    setIsRunning(false);
                                    previousVisibleCountRef.current = TIME_PRESETS.filter(p => preset.minutes >= p.minutes).length;
                                }}
                                className={clsx(
                                    "px-3 py-2 rounded-lg text-sm font-mono transition-all border duration-500",
                                    !isVisible ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100",
                                    isRunning
                                        ? "bg-sky-500/20 border-sky-500/40 text-sky-100 shadow-sm" // Active Analog Block Style
                                        : "bg-zinc-900 border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800 text-zinc-400 hover:text-white" // Standard Preset Style
                                )}
                            >
                                {preset.label}
                            </button>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <button
                    onClick={onClose}
                    className="mt-8 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl font-medium transition-all shadow-sm border border-zinc-800 flex items-center gap-2"
                >
                    <ArrowLeft size={18} />
                    Escolher Outra Prova
                </button>
            </div>
        </div>
    );
}
