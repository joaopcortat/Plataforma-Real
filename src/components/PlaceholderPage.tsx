export function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Em Construção 🚧</h2>
            <p className="text-zinc-400 max-w-md">
                O módulo <span className="text-primary font-mono">{title}</span> será liberado nas próximas atualizações do MVP.
            </p>
        </div>
    );
}
