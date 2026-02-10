import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';
import { MOCK_DATA } from '../../data/mock';

export function PerformanceCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Diagnostic Chart */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-6">Diagnóstico de Erros</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA.performance.errors} layout="vertical" margin={{ left: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="category"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a1a1aa', fontSize: 12 }}
                                width={100}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#f4f4f5' }}
                                cursor={{ fill: '#27272a', opacity: 0.4 }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-6">Radar de Competências (Redação)</h3>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={MOCK_DATA.performance.radar}>
                            <PolarGrid stroke="#27272a" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
                            <Radar
                                name="Desempenho"
                                dataKey="value"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.3}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }}
                                itemStyle={{ color: '#10b981' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
