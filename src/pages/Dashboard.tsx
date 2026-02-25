import { useEffect, useState, useCallback } from 'react';
import { Clock, CheckCircle2, BookOpen, Plus, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStudyTimer } from '../contexts/StudyTimerContext';

import { ManualStudyEntryModal } from '../components/dashboard/ManualStudyEntryModal';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { StudyHoursPanel } from '../components/dashboard/StudyHoursPanel';
import { QuestionsPanel } from '../components/dashboard/QuestionsPanel';
import { ClassesPanel } from '../components/dashboard/ClassesPanel';
import { FocusTimerPanel } from '../components/dashboard/FocusTimerPanel';
import { StudyCalendar } from '../components/dashboard/StudyCalendar';

/* ─── KPI Summary Card ───────────────────────────────────────────── */
interface KpiCardProps {
    label: string;
    value: string | number;
    sub: string;
    icon: React.ElementType;
    iconBg?: string;
    iconColor?: string;
    onClick?: () => void;
}

function KpiCard({ label, value, sub, icon: Icon, iconBg = 'bg-primary/10', iconColor = 'text-primary', onClick }: KpiCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-primary/50 transition-colors ${onClick ? 'cursor-pointer hover:bg-zinc-900' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} shrink-0`}>
                    <Icon size={20} />
                </div>
                <div className="min-w-0">
                    <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">{label}</p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                        <h3 className="text-3xl font-bold text-white leading-none">{value}</h3>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 font-medium truncate">{sub}</p>
                </div>
            </div>
        </div>
    );
}

/* ─── Dashboard ──────────────────────────────────────────────────── */
export function Dashboard() {
    const { metricsVersion } = useStudyTimer();

    const [metrics, setMetrics] = useState({
        studyHours: 0,
        avgHoursPerDay: 0,
        classesDone: 0,
        questionsDone: 0,
    });

    const [showManualEntry, setShowManualEntry] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchMetrics = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: sessions } = await supabase
            .from('study_sessions')
            .select('duration_seconds, questions_count, classes_count, created_at')
            .eq('user_id', user.id);

        let totalSeconds = 0, totalQuestions = 0, totalClasses = 0;
        const daysSeen = new Set<string>();

        sessions?.forEach(s => {
            totalSeconds += s.duration_seconds || 0;
            totalQuestions += s.questions_count || 0;
            totalClasses += s.classes_count || 0;
            if (s.created_at) daysSeen.add(s.created_at.slice(0, 10));
        });

        const totalHours = totalSeconds / 3600;
        const avgHoursPerDay = daysSeen.size > 0 ? totalHours / daysSeen.size : 0;

        setMetrics({
            studyHours: Math.round(totalHours * 10) / 10,
            avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
            classesDone: totalClasses,
            questionsDone: totalQuestions,
        });
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics, refreshKey, metricsVersion]);

    const handleSuccess = () => {
        setShowManualEntry(false);
        setRefreshKey(prev => prev + 1);
    };

    const version = metricsVersion + refreshKey;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* ── Page Header ────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-1">
                        <LayoutDashboard size={22} strokeWidth={2.5} />
                        <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    </div>
                    <p className="text-zinc-400 font-medium text-sm">Visão geral do seu progresso e desempenho.</p>
                </div>

                <button
                    onClick={() => setShowManualEntry(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-black font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:scale-105 self-start sm:self-auto"
                >
                    <Plus size={18} />
                    Registrar Estudo
                </button>
            </div>

            {/* ── Row 1: KPI Cards ─────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    label="Média / Dia"
                    value={`${metrics.avgHoursPerDay.toFixed(1)}h`}
                    sub={`${metrics.studyHours}h acumulado no total`}
                    icon={Clock}
                />
                <KpiCard
                    label="Questões"
                    value={metrics.questionsDone}
                    sub="total de questões resolvidas"
                    icon={CheckCircle2}
                />
                <KpiCard
                    label="Aulas Assistidas"
                    value={metrics.classesDone}
                    sub="total de aulas registradas"
                    icon={BookOpen}
                />
                <KpiCard
                    label="Registrar Estudo"
                    value="+"
                    sub="entrada manual de sessão"
                    icon={Plus}
                    iconBg="bg-zinc-800"
                    iconColor="text-zinc-300"
                    onClick={() => setShowManualEntry(true)}
                />
            </div>

            {/* ── Row 2: Line Chart (full width) ───────────────── */}
            <StudyHoursPanel metricsVersion={version} />

            {/* ── Row 3: Pizza Charts + Focus Timer ────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuestionsPanel metricsVersion={version} />
                <ClassesPanel metricsVersion={version} />
                <FocusTimerPanel />
            </div>

            {/* ── Row 4: Calendar+Countdown (left) + Daily Goals (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* relative needed for the settings overlay inside StudyCalendar */}
                <div className="relative">
                    <StudyCalendar metricsVersion={version} />
                </div>
                <DailyGoals refreshKey={refreshKey} />
            </div>

            {/* ── Modal ─────────────────────────────────────────── */}
            <ManualStudyEntryModal
                isOpen={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
