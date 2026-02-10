import { useEffect, useState } from 'react';
import { WelcomeHero } from '../components/dashboard/WelcomeHero';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ActionBanner } from '../components/dashboard/ActionBanner';
import { DailyGoals } from '../components/dashboard/DailyGoals';
import { CompetencyRadar } from '../components/dashboard/CompetencyRadar';
import { ENEMCountdown } from '../components/dashboard/ENEMCountdown';
import { CheckCircle2, FileText, Play, Plus, BookOpen, PenTool } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Dashboard() {
    const [metrics, setMetrics] = useState({
        classesDone: 0,
        questionsDone: 0,
        lastSimScore: 0,
        lastEssayScore: 0
    });

    useEffect(() => {
        async function fetchMetrics() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch Goals (for questions/classes done) - Approximating from daily goals sum or actual tasks?
            // For now, let's sum up daily_goals for 'total' or just use today's? 
            // Mocking 'Total' by summing daily goals is imperfect but better than static.
            // Better: 'questions_done' from daily_goals summed up.
            const { data: goalsData } = await supabase
                .from('daily_goals')
                .select('questions_done, classes_done')
                .eq('user_id', user.id);

            const totalQuestions = goalsData?.reduce((acc, curr) => acc + (curr.questions_done || 0), 0) || 0;
            const totalClasses = goalsData?.reduce((acc, curr) => acc + (curr.classes_done || 0), 0) || 0;

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
                classesDone: totalClasses,
                questionsDone: totalQuestions,
                lastSimScore: lastSim?.score || 0,
                lastEssayScore: lastEssay?.redacao_score || 0
            });
        }
        fetchMetrics();
    }, []);
    return (
        <div className="space-y-6 pb-8 animate-in fade-in duration-500">

            {/* Hero Section */}
            <WelcomeHero />

            {/* Metrics Grid - Real Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Aulas Assistidas"
                    value={metrics.classesDone.toString()}
                    subValue="nesta semana"
                    icon={BookOpen}
                    variant="blue"
                />
                <MetricCard
                    label="Questões Resolvidas"
                    value={metrics.questionsDone.toString()}
                    subValue="total acumulado"
                    icon={CheckCircle2}
                    variant="green"
                />
                <MetricCard
                    label="Último Simulado"
                    value={metrics.lastSimScore.toString()}
                    subValue="/ 180 acertos"
                    icon={FileText}
                    variant="purple"
                />
                <MetricCard
                    label="Última Redação"
                    value={metrics.lastEssayScore.toString()}
                    subValue="pontos"
                    icon={PenTool}
                    variant="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Daily Goals */}
                    <DailyGoals />

                    {/* Action Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ActionBanner
                            title="Iniciar Cronômetro"
                            description="Timer"
                            icon={Play}
                            variant="blue"
                            onClick={() => window.location.href = '/simulations'}
                        />
                        <ActionBanner
                            title="Registrar Estudo"
                            description="Manual"
                            icon={Plus}
                            variant="green"
                            onClick={() => window.location.href = '/schedule'}
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

                {/* Sidebar Area (1 col) - Countdown & Radar */}
                <div className="lg:col-span-1 space-y-6">
                    <ENEMCountdown />
                    <CompetencyRadar />
                </div>
            </div>
        </div>
    );
}
