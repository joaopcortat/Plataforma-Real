import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function XPCard() {
    const currentXP = 111;
    const targetXP = 2100;
    const percentage = (currentXP / targetXP) * 100;

    const data = [
        { value: currentXP },
        { value: targetXP - currentXP }
    ];

    return (
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute top-4 left-4 flex items-center gap-2 text-zinc-400 text-sm font-bold">
                <span>✨ XP da Semana</span>
            </div>

            <div className="w-48 h-48 relative mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="progress" fill="#22c55e" />
                            <Cell key="remaining" fill="#27272a" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-emerald-500 text-sm font-bold bg-emerald-500/10 px-2 py-1 rounded-full mb-1">
                        {Math.round(percentage)}%
                    </span>
                    <span className="text-3xl font-bold text-white shadow-glow">{currentXP}</span>
                    <span className="text-xs text-zinc-500">/{targetXP} XP semanal</span>
                </div>
            </div>

            <div className="text-center mt-6">
                <h3 className="text-lg font-bold text-white mb-1">Hora de começar!</h3>
                <p className="text-zinc-400 text-sm">Faltam <span className="text-white font-bold">{targetXP - currentXP} XP</span></p>
                <p className="text-xs text-emerald-500 mt-2 font-medium">Média diária: 300 XP</p>
            </div>
        </div>
    );
}
