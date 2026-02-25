import { Hammer } from 'lucide-react';

export function ConstructionPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative bg-zinc-900 border border-primary/30 p-6 rounded-2xl shadow-2xl">
                    <Hammer size={48} className="text-primary animate-bounce" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <h3 className="text-xl font-medium text-primary mb-6">Em Desenvolvimento 🚧</h3>

            <p className="text-zinc-400 max-w-md">
                Estamos focados em entregar a melhor experiência nas Metas e Cronograma primeiro.
                Esta funcionalidade estará disponível em breve!
            </p>

            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <div className="w-2 h-2 rounded-full bg-primary animate-ping delay-100" />
                <div className="w-2 h-2 rounded-full bg-primary animate-ping delay-200" />
            </div>
        </div>
    );
}
