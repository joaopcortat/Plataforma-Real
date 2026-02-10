export interface RankingItem {
    rank: number;
    name: string;
    xp: number;
    status: string;
}

export interface CurrentUserRank {
    position: number;
    league: string;
    nextLeaguePoints: number;
}

export interface MockData {
    user: {
        name: string;
        level: string;
        avatar: string;
        streak: number;
        xp: number;
        nextLevelXp: number;
    };
    kpis: {
        studyHours: number;
        questionsSolved: number;
        accuracy: number;
        streak: number;
    };
    heatmap: { date: string; count: number }[];
    weeklySchedule: { day: string; subject: string; topic: string; status: string }[];
    performance: {
        errors: { category: string; count: number }[];
        radar: { subject: string; value: number; fullMark: number }[];
    };
    courses: {
        id: number;
        title: string;
        mentor: string;
        progress: number;
        thumbnail: string;
        videoId: string;
    }[];
    ranking: {
        list: RankingItem[];
        currentUser: CurrentUserRank;
    };
}

export const MOCK_DATA: MockData = {
    user: {
        name: "João Silva",
        level: "Futuro Calouro",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        streak: 12,
        xp: 4500,
        nextLevelXp: 5000,
    },
    kpis: {
        studyHours: 24.5,
        questionsSolved: 342,
        accuracy: 78,
        streak: 12,
    },
    heatmap: Array.from({ length: 365 }, (_, i) => ({
        date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5), // 0-4 intensity
    })).reverse(),
    weeklySchedule: [
        { day: "Seg", subject: "Matemática", topic: "Geometria Analítica", status: "completed" },
        { day: "Ter", subject: "Física", topic: "Cinemática", status: "completed" },
        { day: "Qua", subject: "Química", topic: "Estequiometria", status: "in-progress" },
        { day: "Qui", subject: "Biologia", topic: "Genética", status: "pending" },
        { day: "Sex", subject: "História", topic: "Era Vargas", status: "pending" },
        { day: "Sáb", subject: "Redação", topic: "Prática Semanal", status: "pending" },
        { day: "Dom", subject: "Simulado", topic: "Revisão Geral", status: "pending" },
    ],
    performance: {
        errors: [
            { category: "Interpretação", count: 12 },
            { category: "Falta de Atenção", count: 8 },
            { category: "Lacuna Teórica", count: 15 },
            { category: "Não Estudado", count: 5 },
        ],
        radar: [
            { subject: "C1 (Norma)", value: 160, fullMark: 200 },
            { subject: "C2 (Tema)", value: 180, fullMark: 200 },
            { subject: "C3 (Arg)", value: 140, fullMark: 200 },
            { subject: "C4 (Coesão)", value: 160, fullMark: 200 },
            { subject: "C5 (Prop)", value: 200, fullMark: 200 },
        ],
    },
    courses: [
        {
            id: 1,
            title: "Matemática Básica",
            mentor: "Prof. Ferretto",
            progress: 75,
            thumbnail: "https://img.youtube.com/vi/31M44j6I5hE/maxresdefault.jpg",
            videoId: "31M44j6I5hE",
        },
        {
            id: 2,
            title: "Química Orgânica",
            mentor: "Prof. Michel",
            progress: 30,
            thumbnail: "https://img.youtube.com/vi/xJ8aZ9x9a7g/maxresdefault.jpg",
            videoId: "xJ8aZ9x9a7g",
        },
        {
            id: 3,
            title: "Redação Nota 1000",
            mentor: "Prof. Jana",
            progress: 10,
            thumbnail: "https://img.youtube.com/vi/W9x9x9x9x9x/maxresdefault.jpg",
            videoId: "W9x9x9x9x9x",
        },
    ],
    ranking: {
        list: [
            { rank: 1, name: "Ana Silva", xp: 15420, status: "promote" },
            { rank: 2, name: "Carlos Edu", xp: 14850, status: "promote" },
            { rank: 3, name: "Maria Clara", xp: 14200, status: "maintain" },
            { rank: 4, name: "Você", xp: 13500, status: "maintain" },
            { rank: 5, name: "João Pedro", xp: 12800, status: "demote" },
        ],
        currentUser: {
            position: 4,
            league: "Diamante",
            nextLeaguePoints: 700
        }
    }
};
