import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    subValue: string;
    icon: LucideIcon;
    variant: 'orange' | 'blue' | 'green' | 'purple';
    suffix?: string;
}

const VARIANTS = {
    orange: {
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        glow: 'shadow-primary/20',
        text: 'text-primary'
    },
    blue: {
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        glow: 'shadow-primary/20',
        text: 'text-primary'
    },
    green: {
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        glow: 'shadow-primary/20',
        text: 'text-primary'
    },
    purple: {
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        glow: 'shadow-primary/20',
        text: 'text-primary'
    }
};

export function MetricCard({ label, value, subValue, icon: Icon, variant, suffix }: MetricCardProps) {
    const styles = VARIANTS[variant];

    return (
        <div className="group relative overflow-hidden rounded-3xl p-6 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-500 hover:border-zinc-700 hover:shadow-2xl">
            {/* Background Gradient Blob */}
            <div className={clsx("absolute -right-10 -top-10 w-32 h-32 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-20", styles.iconBg)} />

            <div className="relative z-10 flex flex-col justify-between h-[140px]">
                <div className="flex justify-between items-start">
                    <span className="font-semibold text-zinc-400 text-[10px] uppercase tracking-widest leading-none mt-1">{label}</span>
                    <div className={clsx("p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110", styles.iconBg, "bg-opacity-10")}>
                        <Icon size={18} className={styles.text} />
                    </div>
                </div>

                <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                        <h3 className="text-4xl font-bold text-white tracking-tight">{value}</h3>
                        {suffix && <span className="text-zinc-500 text-sm font-medium">{suffix}</span>}
                    </div>
                    <p className="text-zinc-500 text-xs font-medium tracking-wide">{subValue}</p>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className={clsx("absolute bottom-0 left-0 h-1 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left", styles.iconBg)} />
        </div>
    );
}
