import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
    format, startOfMonth, endOfMonth, eachDayOfInterval,
    parseISO, isToday, differenceInDays, differenceInWeeks
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flame, CalendarCheck, Settings, X, Save } from 'lucide-react';

interface Props {
    metricsVersion?: number;
}

/* ── Exam Config ──────────────────────────────────────────────── */
const DEFAULT_EXAM = 'ENEM';
// Second Sunday of November 2026
const DEFAULT_DATE = '2026-11-08';

function loadExamConfig(): { examName: string; examDate: string } {
    try {
        const raw = localStorage.getItem('examConfig');
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return { examName: DEFAULT_EXAM, examDate: DEFAULT_DATE };
}

function saveExamConfig(cfg: { examName: string; examDate: string }) {
    localStorage.setItem('examConfig', JSON.stringify(cfg));
}

/* ── Countdown Label ─────────────────────────────────────────── */
function getCountdown(examDate: string) {
    const target = new Date(examDate + 'T12:00:00');
    const now = new Date();
    if (target <= now) return { weeks: 0, days: 0, isPast: true };
    const totalDays = differenceInDays(target, now);
    const weeks = differenceInWeeks(target, now);
    const remainingDays = totalDays - weeks * 7;
    return { weeks, days: remainingDays, isPast: false };
}

/* ── Component ───────────────────────────────────────────────── */
export function StudyCalendar({ metricsVersion }: Props) {
    const [studiedDays, setStudiedDays] = useState<Set<string>>(new Set());
    const [streak, setStreak] = useState(0);
    const [totalDaysThisMonth, setTotalDaysThisMonth] = useState(0);
    const [loading, setLoading] = useState(true);

    // Exam config
    const [examConfig, setExamConfig] = useState(loadExamConfig);
    const [showSettings, setShowSettings] = useState(false);
    const [draftName, setDraftName] = useState(examConfig.examName);
    const [draftDate, setDraftDate] = useState(examConfig.examDate);

    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = (monthStart.getDay() + 6) % 7; // Mon = 0
    const monthLabel = format(today, 'MMMM yyyy', { locale: ptBR });
    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const countdown = getCountdown(examConfig.examDate);

    useEffect(() => { fetchData(); }, [metricsVersion]);

    async function fetchData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const since = format(monthStart, 'yyyy-MM-dd');
            const { data: sessions } = await supabase
                .from('study_sessions')
                .select('created_at, duration_seconds')
                .eq('user_id', user.id)
                .gte('created_at', since + 'T00:00:00');

            const dateSet = new Set<string>();
            sessions?.forEach(s => {
                if ((s.duration_seconds || 0) > 0) {
                    dateSet.add(format(parseISO(s.created_at), 'yyyy-MM-dd'));
                }
            });

            setStudiedDays(dateSet);
            setTotalDaysThisMonth(dateSet.size);

            // Streak
            let streakCount = 0;
            const checkDate = new Date(today);
            while (true) {
                const key = format(checkDate, 'yyyy-MM-dd');
                if (dateSet.has(key)) {
                    streakCount++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else { break; }
            }
            setStreak(streakCount);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    function handleSaveSettings() {
        const cfg = { examName: draftName.trim() || DEFAULT_EXAM, examDate: draftDate };
        setExamConfig(cfg);
        saveExamConfig(cfg);
        setShowSettings(false);
    }

    return (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl hover:border-primary/30 transition-colors overflow-hidden">

            {/* ── Top: Calendar ──────────────────────────────────── */}
            <div className="p-5 pb-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <CalendarCheck size={17} />
                        </div>
                        <div>
                            <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Frequência</p>
                            <p className="text-white font-bold capitalize text-sm leading-none mt-0.5">{monthLabel}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Streak badge */}
                        <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5">
                            <Flame size={13} className={streak > 0 ? 'text-primary' : 'text-zinc-600'} />
                            <span className="text-white font-black text-sm leading-none">{streak}</span>
                            <span className="text-zinc-500 text-[10px] font-medium">dias</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="h-[120px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                ) : (
                    <>
                        {/* Weekday labels */}
                        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
                            {weekDays.map(d => (
                                <div key={d} className="text-center text-[9px] font-bold text-zinc-600 uppercase py-0.5">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Day grid */}
                        <div className="grid grid-cols-7 gap-0.5">
                            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                <div key={`e-${i}`} />
                            ))}
                            {daysInMonth.map(day => {
                                const key = format(day, 'yyyy-MM-dd');
                                const studied = studiedDays.has(key);
                                const current = isToday(day);
                                const future = day > today;

                                return (
                                    <div
                                        key={key}
                                        title={studied ? `Estudou em ${format(day, 'dd/MM')}` : format(day, 'dd/MM')}
                                        className={`
                                            aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all
                                            ${studied
                                                ? 'bg-primary text-black shadow-sm shadow-primary/30'
                                                : current
                                                    ? 'bg-zinc-700 text-white ring-1 ring-primary/50'
                                                    : future
                                                        ? 'bg-transparent text-zinc-700'
                                                        : 'bg-zinc-800/50 text-zinc-600'
                                            }
                                        `}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                                <span className="text-[10px] text-zinc-500 font-medium">Dia estudado</span>
                            </div>
                            <span className="text-[10px] font-bold text-primary">{totalDaysThisMonth} dia{totalDaysThisMonth !== 1 ? 's' : ''} este mês</span>
                        </div>
                    </>
                )}
            </div>

            {/* ── Divider ────────────────────────────────────────── */}
            <div className="border-t border-zinc-800 mx-5" />

            {/* ── Bottom: Countdown ─────────────────────────────── */}
            <div className="px-5 py-4">
                <div className="flex items-center justify-between">
                    {/* Countdown text */}
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                            Faltam para o {examConfig.examName}
                        </p>
                        {countdown.isPast ? (
                            <p className="text-zinc-400 text-sm font-bold">Prova já realizada!</p>
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white tracking-tight leading-none">
                                    {countdown.weeks}
                                </span>
                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">sem</span>
                                <span className="text-xl font-bold text-zinc-400 leading-none">+</span>
                                <span className="text-2xl font-black text-zinc-300 leading-none">
                                    {countdown.days}
                                </span>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">dias</span>
                            </div>
                        )}
                    </div>

                    {/* Settings button */}
                    <button
                        onClick={() => {
                            setDraftName(examConfig.examName);
                            setDraftDate(examConfig.examDate);
                            setShowSettings(true);
                        }}
                        title="Configurar prova"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <Settings size={14} />
                    </button>
                </div>
            </div>

            {/* ── Settings Overlay (inside card) ─────────────────── */}
            {showSettings && (
                <div className="absolute inset-0 z-10 bg-zinc-900/95 backdrop-blur-sm rounded-2xl p-5 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-white text-sm">Configurar Prova</h3>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="p-1 text-zinc-500 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs text-zinc-400 font-medium block mb-1.5">Nome da Prova</label>
                            <input
                                type="text"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                placeholder="Ex: ENEM, FUVEST, UNICAMP..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-primary focus:outline-none placeholder:text-zinc-600"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 font-medium block mb-1.5">Data da Prova</label>
                            <input
                                type="date"
                                value={draftDate}
                                onChange={(e) => setDraftDate(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                        <p className="text-[10px] text-zinc-600">
                            Padrão: ENEM — segundo domingo de novembro
                        </p>
                    </div>

                    <div className="flex gap-2 mt-5">
                        <button
                            onClick={() => setShowSettings(false)}
                            className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveSettings}
                            className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-primary/20"
                        >
                            <Save size={14} />
                            Salvar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
