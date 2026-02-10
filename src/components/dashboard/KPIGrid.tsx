import { Zap, Clock, CheckCircle, Target } from 'lucide-react';
import { MOCK_DATA } from '../../data/mock';
import clsx from 'clsx';

export function KPIGrid() {
    const stats = [
        {
            label: 'Horas de Estudo',
            value: `${MOCK_DATA.kpis.studyHours}h`,
            icon: Clock,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            trend: '+2.5h'
        },
        {
            label: 'Questões Resolvidas',
            value: MOCK_DATA.kpis.questionsSolved,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            trend: '+45'
        },
        {
            label: '% de Acerto',
            value: `${MOCK_DATA.kpis.accuracy}%`,
            icon: Target,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            trend: '+5%'
        },
        {
            label: 'Dias Seguidos',
            value: MOCK_DATA.kpis.streak,
            icon: Zap,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            trend: 'Recorde!'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <div key={idx} className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:border-zinc-700 transition-colors">
                        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                <span className="text-xs text-emerald-400 font-medium">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
