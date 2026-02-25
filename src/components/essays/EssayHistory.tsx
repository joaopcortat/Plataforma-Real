import { useState } from 'react';
import { FileSymlink, Calendar, Award, ClipboardEdit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GradeEssayModal } from './GradeEssayModal';

interface EssayResult {
    id: string;
    title: string;
    score: number;
    c1: number | null;
    c2: number | null;
    c3: number | null;
    c4: number | null;
    c5: number | null;
    created_at: string;
}

interface EssayHistoryProps {
    essays: EssayResult[];
    onRefresh: () => void;
}

export function EssayHistory({ essays, onRefresh }: EssayHistoryProps) {
    const [gradingEssay, setGradingEssay] = useState<EssayResult | null>(null);

    if (!essays || essays.length === 0) {
        return (
            <div className="w-full text-center py-12 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <FileSymlink size={32} className="mx-auto text-zinc-600 mb-3" />
                <h3 className="text-zinc-300 font-bold mb-1">Nenhuma redação registrada</h3>
                <p className="text-zinc-500 text-sm">Use o botão "Nova Redação" para registrar seus temas.</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {essays.map((essay) => {
                    const date = new Date(essay.created_at);
                    const isPending = essay.c1 === null;
                    const isExcellent = !isPending && essay.score >= 900;
                    const isGood = !isPending && essay.score >= 700 && essay.score < 900;

                    return (
                        <div
                            key={essay.id}
                            className={`group border p-5 rounded-2xl transition-all ${isPending
                                    ? 'bg-zinc-900/20 border-zinc-800/50'
                                    : 'bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                {/* Left Side: Title & Date */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-3 rounded-xl border shrink-0 ${isPending
                                            ? 'bg-zinc-800/30 border-zinc-700/50 text-zinc-600'
                                            : isExcellent
                                                ? 'bg-primary/10 border-primary/20 text-primary'
                                                : isGood
                                                    ? 'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                                        }`}>
                                        <Award size={22} className={isExcellent ? 'fill-primary/20' : ''} />
                                    </div>
                                    <div>
                                        <h4 className={`font-bold text-base md:text-lg tracking-tight transition-colors ${isPending ? 'text-zinc-500' : 'text-white group-hover:text-primary'
                                            }`}>
                                            {essay.title}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 mt-1">
                                            <Calendar size={12} />
                                            {format(date, "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Scores or Pending */}
                                <div className="flex items-center gap-4 justify-between md:justify-end">

                                    {!isPending ? (
                                        <>
                                            {/* Competencies Mini-Grid */}
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {[
                                                    { label: 'C1', val: essay.c1 },
                                                    { label: 'C2', val: essay.c2 },
                                                    { label: 'C3', val: essay.c3 },
                                                    { label: 'C4', val: essay.c4 },
                                                    { label: 'C5', val: essay.c5 }
                                                ].map((comp, idx) => (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors uppercase">
                                                            {comp.label}
                                                        </span>
                                                        <span className={`text-xs font-bold ${comp.val === 200 ? 'text-primary' :
                                                                (comp.val ?? 0) >= 160 ? 'text-zinc-300' : 'text-zinc-500'
                                                            }`}>
                                                            {comp.val}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="w-px h-8 bg-zinc-800 hidden md:block" />

                                            {/* Total Score */}
                                            <div className="text-right min-w-[80px]">
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">Total</p>
                                                <p className={`text-2xl font-black leading-none tracking-tighter ${isExcellent ? 'text-primary' : isGood ? 'text-white' : 'text-zinc-400'
                                                    }`}>
                                                    {essay.score}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span className="inline-block px-3 py-1.5 bg-zinc-800/80 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-zinc-700/50">
                                                Aguardando Correção
                                            </span>
                                            <button
                                                onClick={() => setGradingEssay(essay)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                                            >
                                                <ClipboardEdit size={13} />
                                                Registrar Notas
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Grade Modal */}
            <GradeEssayModal
                essay={gradingEssay}
                isOpen={gradingEssay !== null}
                onClose={() => setGradingEssay(null)}
                onSuccess={() => {
                    setGradingEssay(null);
                    onRefresh();
                }}
            />
        </>
    );
}
