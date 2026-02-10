
export const GAMIFICATION = {
    // Formula: Level = floor(sqrt(XP / 100)) + 1
    getLevel: (xp: number) => Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1,

    // Formula: XP = ((Level) * 100)^2 (Inverse of sqrt, simplified approximation for next level)
    // Actually, to get to level L, you need (L-1)^2 * 100 XP.
    // So next level (L+1) requires L^2 * 100 XP
    getNextLevelXp: (currentLevel: number) => Math.pow(currentLevel, 2) * 100,

    // Titles based on Level
    getTitle: (level: number) => {
        if (level >= 50) return { title: 'Imperador', color: 'text-yellow-400' };
        if (level >= 40) return { title: 'Rei', color: 'text-orange-400' };
        if (level >= 30) return { title: 'Duque', color: 'text-purple-400' };
        if (level >= 20) return { title: 'Marquês', color: 'text-red-400' };
        if (level >= 10) return { title: 'Cavaleiro', color: 'text-blue-400' };
        return { title: 'Plebeu', color: 'text-zinc-400' };
    }
};
