import { useEffect, useState, useCallback } from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActionBanner } from '../components/dashboard/ActionBanner';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { ENEMCountdown } from '../components/dashboard/ENEMCountdown';
import { ManualStudyEntryModal } from '../components/dashboard/ManualStudyEntryModal';
import { CheckCircle2, FileText, Play, Plus, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useStudyTimer } from '../contexts/StudyTimerContext';

export function Dashboard() {
    const { openTimer, metricsVersion } = useStudyTimer();
    const [metrics, setMetrics] = useState({
        studyHours: 0,
        classesDone: 0,
        questionsDone: 0,
        lastSimScore: 0,
        lastEssayScore: 0
    });

    // Manual Entry State
    const [showManualEntry, setShowManualEntry] = useState(false);

    // Refresh key to force re-fetch from within the dashboard (e.g. after manual entry)
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchMetrics = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch Study Sessions Stats
        const { data: sessions } = await supabase
            .from('study_sessions')
            .select('duration_seconds, questions_count, classes_count')
            .eq('user_id', user.id);

        let totalSeconds = 0;
        let totalQuestions = 0;
        let totalClasses = 0;

        if (sessions) {
            sessions.forEach(s => {
                totalSeconds += (s.duration_seconds || 0);
                totalQuestions += (s.questions_count || 0);
                totalClasses += (s.classes_count || 0);
            });
        }

        const totalHours = Math.round(totalSeconds / 3600);

        // 2. Last Simulation
        const { data: lastSim } = await supabase
            .from('simulation_results')
            .select('score')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        // 3. Last Essay (result with redacao_score > 0)
        const { data: lastEssay } = await supabase
            .from('simulation_results')
            .select('redacao_score')
            .eq('user_id', user.id)
            .gt('redacao_score', 0)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        setMetrics({
            studyHours: totalHours,
            classesDone: totalClasses,
            questionsDone: totalQuestions,
            lastSimScore: lastSim?.score || 0,
            lastEssayScore: lastEssay?.redacao_score || 0
        });
    }, []);

    // Re-fetch on mount, when refreshKey changes, or when metricsVersion changes (timer session saved)
    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics, refreshKey, metricsVersion]);

    return (
        <div className="space-y-6 pb-8 animate-in fade-in duration-500">

            {/* Metrics Grid - Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Horas de Estudo"
                    value={metrics.studyHours.toString()}
                    subValue="tempo total"
                    icon={Clock}
                    variant="orange"
                    suffix="horas"
                />
                <MetricCard
                    label="Questões Resolvidas"
                    value={metrics.questionsDone.toString()}
                    subValue="total acumulado"
                    icon={CheckCircle2}
                    variant="green"
                />
                <MetricCard
                    label="Aulas Assistidas"
                    value={metrics.classesDone.toString()}
                    subValue="registradas"
                    icon={BookOpen}
                    variant="blue"
                />
                <MetricCard
                    label="Último Simulado"
                    value={metrics.lastSimScore.toString()}
                    subValue="/ 180 acertos"
                    icon={FileText}
                    variant="purple"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Daily Goals */}
                    <DailyGoals refreshKey={refreshKey} />

                    {/* Action Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ActionBanner
                            title="Iniciar Cronômetro"
                            description="Registre seu tempo de estudo"
                            icon={Play}
                            variant="blue"
                            onClick={openTimer}
                        />
                        <ActionBanner
                            title="Registrar Estudo"
                            description="Registrar manualmente"
                            icon={Plus}
                            variant="green"
                            onClick={() => setShowManualEntry(true)}
                        />
                        <ActionBanner
                            title="Novo Simulado"
                            description="Lançar"
                            icon={FileText}
                            variant="pink"
                            onClick={() => window.location.href = '/simulations'}
                        />
                    </div>
                </div>

                {/* Sidebar Area (1 col) - Countdown */}
                <div className="lg:col-span-1 space-y-6">
                    <ENEMCountdown />
                </div>
            </div>

            <ManualStudyEntryModal
                isOpen={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                onSuccess={() => {
                    setShowManualEntry(false);
                    setRefreshKey(prev => prev + 1);
                }}
            />
        </div>
    );
}
