import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Showcase } from './components/Showcase';
import { Features } from './components/Features';
import { Comparison } from './components/Comparison';
import { PlatformPreview } from './components/PlatformPreview';
import { FAQ } from './components/FAQ';
import { Guarantee } from './components/Guarantee';
import { CTA } from './components/CTA';
import { WaitlistModal } from './components/WaitlistModal';
import { ArrowRight } from 'lucide-react';

export function Landing() {
    return (
        <div className="min-h-screen bg-zinc-950 font-sans selection:bg-primary selection:text-zinc-950 overflow-x-hidden">
            <Navbar />

            <main className="pb-20 sm:pb-0">
                <Hero />
                <Showcase />
                <Features />
                <Comparison />
                <PlatformPreview />
                <FAQ />
                <Guarantee />
                <CTA />
            </main>

            <WaitlistModal />

            {/* Sticky mobile CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 px-4 py-3 flex items-center gap-3 shadow-2xl">
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-waitlist'))}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-zinc-950 font-bold text-sm transition-all active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                >
                    Garantir Acesso — 50% OFF
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
