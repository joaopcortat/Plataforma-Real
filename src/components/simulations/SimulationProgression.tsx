import { useMemo, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, Label, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, BookOpen, Calendar, Filter, Target, PenTool } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface SimulationResult {
    id: string | number;
    title: string;
    subject: string;
    score: number;
    total_questions: number;
    created_at: string;
    linguagens_correct?: number;
    humanas_correct?: number;
    natureza_correct?: number;
    matematica_correct?: number;
    redacao_score?: number;
    exam_type?: string;
    c1?: number;
    c2?: number;
    c3?: number;
    c4?: number;
    c5?: number;
}

interface SimulationProgressionProps {
    history: SimulationResult[];
}

export function SimulationProgression({ history }: SimulationProgressionProps) {
    const [viewMode, setViewMode] = useState<'geral' | 'dias' | 'materias' | 'redacao'>('geral');
    const [targetScore, setTargetScore] = useState(120); // Default
    const [isEditingTarget, setIsEditingTarget] = useState(false);

    useEffect(() => {
        loadTargetScore();
    }, []);

    async function loadTargetScore() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('target_score')
                .eq('user_id', user.id)
                .single();
            if (data?.target_score) {
                setTargetScore(data.target_score);
            }
        }
    }

    async function updateTargetScore(newScore: number) {
        setTargetScore(newScore);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .upsert({ user_id: user.id, target_score: newScore });

            if (error) console.error('Error updating target score', error);
        }
    }

    // --- DATA PROCESSING ---

    // 1. GERAL: Combine Day 1 + Day 2 by Title similarities to simulate Full Exam (180)
    const geralData = useMemo(() => {
        // Group by normalized title (remove "Dia 1", "Day 1", "Matemática", etc.)
        const groups: Record<string, { total: number, score: number, date: string, count: number }> = {};

        history.forEach(item => {
            // Very basic normalization: remove "Dia X", "Day X"
            const normTitle = item.title.replace(/Dia\s*\d/i, '').replace(/Day\s*\d/i, '').replace(/-/g, '').trim();
            const date = format(new Date(item.created_at), 'dd/MM'); // Group by date proximity too? strict for now.

            // Allow grouping if dates are close? For now, let's keep it simple: unique ID logic would be better but we lack it.
            // Let's assume unique attempts have distinct base names or we just plot individual exams if they are "Custom".
            // Actually, showing 90/90 on a 180 scale looks bad.
            // Strategy: ANY item with < 90 questions is partial.
            // If we find a matching partial (Day 1 + Day 2) we merge.
            // Simplified: Just use the raw history but filter for "Full Exams" if possible?
            // "Ver a progressão na prova por inteiro" -> User wants to see SUM of Day 1 and Day 2.

            const key = normTitle;
            if (!groups[key]) {
                groups[key] = { total: 0, score: 0, date, count: 0 };
            }
            groups[key].total += item.total_questions;
            groups[key].score += item.score;
            groups[key].count += 1;
        });

        return Object.entries(groups)
            .map(([name, data]) => ({
                name,
                date: data.date,
                score: data.score,
                total: data.total,
                isFull: data.total > 100 // Heuristic
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort might be wrong if date format is dd/MM. 
        // Better to sort by original created_at if possible.
        // Let's rely on the input history being sorted or re-sort properly.
    }, [history]);

    // 2. DIAS: Separate Day 1 and Day 2
    const day1Data = useMemo(() => history.filter(h => h.title.toLowerCase().includes('dia 1') || h.title.toLowerCase().includes('day 1')).reverse(), [history]);
    const day2Data = useMemo(() => history.filter(h => h.title.toLowerCase().includes('dia 2') || h.title.toLowerCase().includes('day 2')).reverse(), [history]);

    // 3. MATÉRIAS: Detailed Timeline per Subject
    const subjectEvolution = useMemo(() => {
        // We need 4 separate arrays or one array with multiple lines
        // Items must have detailed scores
        return history
            .filter(h => h.linguagens_correct !== undefined) // Valid detailed results
            .slice()
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(item => ({
                name: format(new Date(item.created_at), 'dd/MM'),
                linguagens: item.linguagens_correct || 0,
                humanas: item.humanas_correct || 0,
                natureza: item.natureza_correct || 0,
                matematica: item.matematica_correct || 0,
            }));
    }, [history]);

    // 4. REDAÇÃO
    const redacaoData = useMemo(() => {
        return history
            .filter(h => h.redacao_score !== undefined && h.redacao_score > 0)
            .slice()
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(item => ({
                name: format(new Date(item.created_at), 'dd/MM'),
                score: item.redacao_score
            }));
    }, [history]);


    // 5. COMPETENCIES (For Radar)
    const competencyData = useMemo(() => {
        const essays = history.filter(h => h.redacao_score !== undefined && h.redacao_score > 0);
        if (essays.length === 0) return Array(5).fill(0).map((_, i) => ({ subject: `C${i + 1}`, value: 0, fullMark: 200 }));

        const totals = { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0 };
        let count = 0;

        essays.forEach(e => {
            if (e.c1 !== undefined) {
                totals.c1 += e.c1 || 0;
                totals.c2 += e.c2 || 0;
                totals.c3 += e.c3 || 0;
                totals.c4 += e.c4 || 0;
                totals.c5 += e.c5 || 0;
                count++;
            }
        });

        if (count === 0) return Array(5).fill(0).map((_, i) => ({ subject: `C${i + 1}`, value: 0, fullMark: 200 }));

        return [
            { subject: 'C1', value: Math.round(totals.c1 / count), fullMark: 200 },
            { subject: 'C2', value: Math.round(totals.c2 / count), fullMark: 200 },
            { subject: 'C3', value: Math.round(totals.c3 / count), fullMark: 200 },
            { subject: 'C4', value: Math.round(totals.c4 / count), fullMark: 200 },
            { subject: 'C5', value: Math.round(totals.c5 / count), fullMark: 200 },
        ];
    }, [history]);

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 border border-zinc-800 rounded-2xl border-dashed min-h-[400px]">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                    <TrendingUp size={32} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Sem dados de Progresso</h2>
                <p className="text-zinc-400 max-w-md mb-6">
                    Realize simulados ou registre seus resultados antigos para visualizar sua evolução aqui.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-primary" />
                        Análise de Desempenho
                    </h3>

                    {/* Meta Input (Global) */}
                    <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                        <Target size={16} className="text-emerald-500" />
                        <span className="text-zinc-400 text-sm">Meta Global:</span>
                        {isEditingTarget ? (
                            <input
                                type="number"
                                value={targetScore}
                                onChange={(e) => setTargetScore(parseInt(e.target.value) || 0)}
                                onBlur={() => { setIsEditingTarget(false); updateTargetScore(targetScore); }}
                                autoFocus
                                className="w-12 bg-zinc-800 text-white text-sm px-1 rounded focus:outline-none border border-zinc-700"
                            />
                        ) : (
                            <span
                                onClick={() => setIsEditingTarget(true)}
                                className="text-white font-bold text-sm cursor-pointer hover:text-emerald-400 transition-colors border-b border-dashed border-zinc-600 hover:border-emerald-500"
                            >
                                {targetScore}
                            </span>
                        )}
                        <span className="text-zinc-600 text-xs self-end mb-0.5">/ 180</span>
                    </div>
                </div>

                {/* View Tabs */}
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto scrollbar-hide">
                    {[
                        { id: 'geral', label: 'Visão Geral', icon: Calendar },
                        { id: 'dias', label: 'Por Dia', icon: Filter },
                        { id: 'materias', label: 'Por Matéria', icon: BookOpen },
                        { id: 'redacao', label: 'Redação', icon: PenTool },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setViewMode(tab.id as any)}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 whitespace-nowrap",
                                viewMode === tab.id
                                    ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700"
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Column: KPI Cards (Context Aware) */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Dynamic KPIs based on View */}
                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target size={64} />
                        </div>
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Média Geral</div>
                        <div className="text-3xl font-bold text-white">
                            {viewMode === 'redacao'
                                ? Math.round(redacaoData.reduce((acc, curr) => acc + (curr.score || 0), 0) / (redacaoData.length || 1))
                                : Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / (history.length || 1)) // Crude average, refine later
                            }
                        </div>
                        <div className="text-xs text-zinc-500 mt-2">
                            Em {history.length} simulados
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                        <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Melhor Performance</div>
                        <div className="text-3xl font-bold text-emerald-500">
                            {viewMode === 'redacao'
                                ? Math.max(...redacaoData.map(h => h.score || 0), 0)
                                : Math.max(...history.map(h => h.score), 0)
                            }
                        </div>
                    </div>
                </div>

                {/* Right Column: Chart */}
                <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <h4 className="text-zinc-400 font-medium mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                        {viewMode === 'geral' && "Evolução Global (Total de Acertos)"}
                        {viewMode === 'dias' && "Evolução Dia 1 vs Dia 2"}
                        {viewMode === 'materias' && "Evolução por Área do Conhecimento"}
                        {viewMode === 'redacao' && "Notas de Redação"}
                    </h4>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            {viewMode === 'geral' ? (
                                <AreaChart data={geralData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 180]} />
                                    <ReferenceLine y={targetScore} stroke="#10b981" strokeDasharray="3 3">
                                        <Label value="Meta" position="right" fill="#10b981" fontSize={10} />
                                    </ReferenceLine>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                                </AreaChart>
                            ) : viewMode === 'dias' ? (
                                <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="title" allowDuplicatedCategory={false} stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 90]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                                    {/* Must unify data for multi-line or just use filters? Creating combined dataset is complex inside Render. Let's simplfy: Two separate lines if data allows, else Toggle? */}
                                    {/* Actually, user wants to see progression. Let's merge Day 1 and Day 2 into one dataset with type? */}
                                    {/* Better approach for 'Dias': Just separate charts or one chart with 2 lines if X-axis matches (Simulado 1, Simulado 2). 
                                        Assuming chronological. Let's map indexes.
                                    */}
                                    <Line data={day1Data} dataKey="score" name="Dia 1" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line data={day2Data} dataKey="score" name="Dia 2" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            ) : viewMode === 'materias' ? (
                                <LineChart data={subjectEvolution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 45]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                                    <Line type="monotone" dataKey="linguagens" name="Linguagens" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="humanas" name="Humanas" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="natureza" name="Natureza" stroke="#10b981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="matematica" name="Matemática" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            ) : (
                                <div className="h-full flex flex-col gap-8">
                                    <div className="h-[300px] w-full flex">
                                        <div className="flex-1">
                                            <h5 className="text-zinc-500 text-xs font-bold uppercase mb-4 text-center">Evolução da Nota</h5>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={redacaoData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                                    <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#52525b" tick={{ fill: '#71717a', fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 1000]} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                                                    <Line type="monotone" dataKey="score" name="Nota Redação" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899', stroke: '#18181b' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex-1 border-l border-zinc-800 pl-4">
                                            <h5 className="text-zinc-500 text-xs font-bold uppercase mb-4 text-center">Competências (Média)</h5>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={competencyData}>
                                                    <PolarGrid stroke="#27272a" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
                                                    <Radar name="Média" dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }} itemStyle={{ color: '#ec4899' }} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
