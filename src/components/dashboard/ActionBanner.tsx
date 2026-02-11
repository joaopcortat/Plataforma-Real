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
            <div className="flex items-center justify-between relative z-10 w-full">
                <div className="flex items-center gap-5">
                    {/* Vivid Gradient Icon Box */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${variants.bg} bg-opacity-20 shadow-[0_0_20px_-5px] group-hover:bg-opacity-30 group-hover:scale-105 transition-all duration-300`}>
                        <Icon size={26} className={variants.text} />
                    </div>

                    <div className="text-left flex flex-col justify-center">
                        <h4 className="font-bold text-white text-[15px] mb-0.5 tracking-tight group-hover:text-white/90 transition-colors">{title}</h4>
                        <p className="text-xs text-zinc-500 font-medium tracking-wide group-hover:text-zinc-400 transition-colors leading-relaxed">{description}</p>
                    </div>
                </div>

                {/* Subtle Arrow */}
                <div className="w-8 h-8 flex items-center justify-center text-zinc-600 transition-all transform group-hover:translate-x-1 group-hover:text-zinc-400">
                    <ArrowRight size={18} />
                </div>
            </div>
        </button>
    );
}
