import { WelcomeHero } from '../components/dashboard/WelcomeHero';
import { WeeklyProgressStrip } from '../components/dashboard/WeeklyProgressStrip';
import { XPCard } from '../components/dashboard/gamification/XPCard';
import { StreakCard } from '../components/dashboard/gamification/StreakCard';
import { RankingCard } from '../components/dashboard/gamification/RankingCard';
import { RecordCard } from '../components/dashboard/gamification/RecordCard';

export function Achievements() {
    return (
        <div className="space-y-6 pb-8 animate-in fade-in duration-500">

            {/* Reusing Hero for personalization */}
            <WelcomeHero />

            <div className="flex flex-col gap-2 mb-4">
                <h2 className="text-2xl font-bold text-white">Suas Conquistas 🏆</h2>
                <p className="text-zinc-400">Acompanhe seu progresso, nível e recordes na plataforma.</p>
            </div>

            {/* Weekly Progress Strip */}
            <WeeklyProgressStrip />

            {/* Gamification Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <XPCard />
                <StreakCard />
                <RankingCard />
                <RecordCard />
            </div>

            {/* Future: Badges / Medals section could go here */}
        </div>
    );
}
