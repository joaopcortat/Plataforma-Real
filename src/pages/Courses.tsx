import { Play, Lock } from 'lucide-react';
import clsx from 'clsx';

const MODULES = [
    { title: 'Matemática Básica', progress: 100, lessons: 12, completed: 12 },
    { title: 'Funções', progress: 65, lessons: 8, completed: 5 },
    { title: 'Geometria Plana', progress: 30, lessons: 10, completed: 3 },
    { title: 'Geometria Espacial', progress: 0, lessons: 8, completed: 0, locked: true },
    { title: 'Trigonometria', progress: 0, lessons: 15, completed: 0, locked: true },
];

export function Courses() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Aulas e Materiais</h1>
                <p className="text-zinc-400">Videoaulas e apostilas organizadas por módulo.</p>
            </div>

            <div className="space-y-4">
                {MODULES.map((mod, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all",
                            mod.locked ? "opacity-50 grayscale" : "hover:border-zinc-700 hover:shadow-lg"
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                                    mod.locked ? "bg-zinc-800" : "bg-indigo-600 shadow-lg shadow-indigo-600/20"
                                )}>
                                    {mod.locked ? <Lock size={20} /> : <Play size={20} fill="currentColor" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                                    <p className="text-sm text-zinc-400">
                                        {mod.completed}/{mod.lessons} aulas
                                    </p>
                                </div>
                            </div>

                            {!mod.locked && (
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{mod.progress}%</span>
                                </div>
                            )}
                        </div>

                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className={clsx("h-full rounded-full transition-all duration-500", mod.progress === 100 ? "bg-emerald-500" : "bg-indigo-500")}
                                style={{ width: `${mod.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
