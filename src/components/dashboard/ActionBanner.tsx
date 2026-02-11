import { type LucideIcon, ArrowRight } from 'lucide-react';

interface ActionBannerProps {
    title: string;
    description: string;
    icon: LucideIcon;
    variant: 'blue' | 'green' | 'pink';
    onClick?: () => void;
}

export function ActionBanner({ title, description, icon: Icon, variant, onClick }: ActionBannerProps) {
    const variants = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'hover:border-blue-500/50' },
        green: { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
        pink: { bg: 'bg-pink-500', text: 'text-pink-400', border: 'hover:border-pink-500/50' }
    }[variant];

    return (
        <button
            onClick={onClick}
            className={`w-full group relative overflow-hidden rounded-2xl p-4 bg-zinc-900/50 border border-zinc-800 transition-all duration-300 ${variants.border} hover:bg-zinc-900/80 hover:shadow-lg`}
        >
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${variants.bg} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300 group-hover:scale-110`}>
                        <Icon size={24} className={variants.text} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
                        <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors uppercase tracking-wide">{description}</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-500 transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </button>
    );
}
