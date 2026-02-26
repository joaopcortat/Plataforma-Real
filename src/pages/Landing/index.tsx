import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Showcase } from './components/Showcase';
import { Features } from './components/Features';
import { Comparison } from './components/Comparison';
import { PlatformPreview } from './components/PlatformPreview';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Guarantee } from './components/Guarantee';
import { CTA } from './components/CTA';
import { WaitlistModal } from './components/WaitlistModal';

export function Landing() {
    return (
        <div className="min-h-screen bg-zinc-950 font-sans selection:bg-primary selection:text-zinc-950 overflow-x-hidden">
            <Navbar />

            <main>
                <Hero />
                <Showcase />
                <Features />
                <Comparison />
                <PlatformPreview />
                <Testimonials />
                <FAQ />
                <Guarantee />
                <CTA />
            </main>
            <WaitlistModal />
        </div>
    );
}
