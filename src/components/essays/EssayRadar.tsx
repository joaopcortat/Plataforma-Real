import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface EssayRadarProps {
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
}

export function EssayRadar({ c1, c2, c3, c4, c5 }: EssayRadarProps) {
    const data = [
        { subject: 'C1 - Norma Culta', value: c1, fullMark: 200 },
        { subject: 'C2 - Tema/Estrutura', value: c2, fullMark: 200 },
        { subject: 'C3 - Argumentação', value: c3, fullMark: 200 },
        { subject: 'C4 - Coesão', value: c4, fullMark: 200 },
        { subject: 'C5 - Proposta', value: c5, fullMark: 200 },
    ];

    if (c1 === 0 && c2 === 0 && c3 === 0 && c4 === 0 && c5 === 0) {
        return (
            <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-zinc-500 gap-3">
                <span className="text-4xl">🕸️</span>
                <p className="text-sm font-medium">Ainda não há dados suficientes para desenhar o radar.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#3f3f46" strokeDasharray="3 3" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, 200]} tick={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '12px',
                            color: '#fff',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                        }}
                        itemStyle={{ color: '#FFC832', fontWeight: 600 }}
                        formatter={(value: number | undefined) => [`${value || 0} pts`, 'Média']}
                    />
                    <Radar
                        name="Competências"
                        dataKey="value"
                        stroke="#FFC832"
                        strokeWidth={2}
                        fill="#FFC832"
                        fillOpacity={0.25}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
