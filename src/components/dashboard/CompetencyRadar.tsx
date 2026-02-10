import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { MOCK_DATA } from '../../data/mock';

export function CompetencyRadar() {
    return (
        <div className="glass-panel p-6 rounded-xl h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2">Radar de Competências</h3>
            <p className="text-xs text-zinc-400 mb-4">Análise detalhada por competência na redação.</p>

            <div className="flex-1 min-h-[250px] w-full flex items-center justify-center -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MOCK_DATA.performance.radar}>
                        <PolarGrid stroke="#27272a" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#a1a1aa', fontSize: 10 }}
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
                        <Radar
                            name="Desempenho"
                            dataKey="value"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5', borderRadius: '8px' }}
                            itemStyle={{ color: '#8b5cf6' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
