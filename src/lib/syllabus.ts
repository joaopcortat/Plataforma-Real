export type Subject = 'Matemática' | 'Física' | 'Química' | 'Biologia' | 'História' | 'Geografia' | 'Português' | 'Filosofia/Sociologia' | 'Redação';

export type Importance = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Topic {
    id: string;
    subject: Subject;
    category: string;
    title: string;
    importance: Importance;
    tier: 1 | 2 | 3; // 1 = Critical Foundation, 2 = Score Builder, 3 = Competitive Edge
    prerequisites: string[];
    estimatedMinutes: number;
}

// Syllabus based on "Relatório de Treinamento: Lógica de Agendamento Adaptativo (Medicina)"
export const SYLLABUS: Topic[] = [
    // --- MATEMÁTICA ---
    // TIER 1
    { id: 'mat-t1-01', subject: 'Matemática', category: 'Basics', title: 'Operações Básicas, Frações e Potenciação', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'mat-t1-02', subject: 'Matemática', category: 'Basics', title: 'Regra de Três, Razão e Proporção', importance: 'Very High', tier: 1, prerequisites: ['mat-t1-01'], estimatedMinutes: 120 },
    { id: 'mat-t1-03', subject: 'Matemática', category: 'Basics', title: 'Porcentagem e Matemática Financeira Básica', importance: 'Very High', tier: 1, prerequisites: ['mat-t1-02'], estimatedMinutes: 120 },
    { id: 'mat-t1-04', subject: 'Matemática', category: 'Stats', title: 'Estatística (Média, Moda, Mediana)', importance: 'Very High', tier: 1, prerequisites: ['mat-t1-01'], estimatedMinutes: 90 },

    // TIER 2
    { id: 'mat-t2-01', subject: 'Matemática', category: 'GeoP', title: 'Geometria Plana (Áreas e Perímetros)', importance: 'Very High', tier: 2, prerequisites: ['mat-t1-01'], estimatedMinutes: 150 },
    { id: 'mat-t2-02', subject: 'Matemática', category: 'GeoE', title: 'Geometria Espacial (Prismas, Cilindros, Cones, Esferas)', importance: 'Very High', tier: 2, prerequisites: ['mat-t2-01'], estimatedMinutes: 180 },
    { id: 'mat-t2-03', subject: 'Matemática', category: 'Func', title: 'Funções de 1º e 2º Grau (Gráficos)', importance: 'Very High', tier: 2, prerequisites: ['mat-t1-01'], estimatedMinutes: 180 },

    // TIER 3
    { id: 'mat-t3-01', subject: 'Matemática', category: 'Count', title: 'Análise Combinatória e Probabilidade', importance: 'High', tier: 3, prerequisites: ['mat-t1-01'], estimatedMinutes: 150 },
    { id: 'mat-t3-02', subject: 'Matemática', category: 'Log', title: 'Logaritmos e Exponenciais', importance: 'Medium', tier: 3, prerequisites: ['mat-t1-02'], estimatedMinutes: 120 },
    { id: 'mat-t3-03', subject: 'Matemática', category: 'Trig', title: 'Trigonometria e Matrizes', importance: 'Medium', tier: 3, prerequisites: ['mat-t2-01'], estimatedMinutes: 120 },

    // --- BIOLOGIA ---
    // TIER 1
    { id: 'bio-t1-01', subject: 'Biologia', category: 'Ecologia', title: 'Ecologia: Cadeias, Ciclos e Relações', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'bio-t1-02', subject: 'Biologia', category: 'Citologia', title: 'Citologia: Estrutura, Organelas e Membrana', importance: 'High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'bio-t1-03', subject: 'Biologia', category: 'Bioenergética', title: 'Bioenergética: Fotossíntese e Respiração', importance: 'Very High', tier: 1, prerequisites: ['bio-t1-02'], estimatedMinutes: 120 },

    // TIER 2
    { id: 'bio-t2-01', subject: 'Biologia', category: 'Fisiologia', title: 'Fisiologia Humana (Sistemas)', importance: 'Very High', tier: 2, prerequisites: ['bio-t1-02'], estimatedMinutes: 180 },
    { id: 'bio-t2-02', subject: 'Biologia', category: 'Genética', title: 'Genética: Mendel e Grupos Sanguíneos', importance: 'High', tier: 2, prerequisites: ['bio-t1-02'], estimatedMinutes: 150 },
    { id: 'bio-t2-03', subject: 'Biologia', category: 'Ecologia', title: 'Impactos Ambientais e Poluição', importance: 'Very High', tier: 2, prerequisites: ['bio-t1-01'], estimatedMinutes: 90 },

    // TIER 3
    { id: 'bio-t3-01', subject: 'Biologia', category: 'Botânica', title: 'Botânica (Fisiologia e Grupos)', importance: 'Medium', tier: 3, prerequisites: ['bio-t1-03'], estimatedMinutes: 120 },
    { id: 'bio-t3-02', subject: 'Biologia', category: 'Biotecnologia', title: 'Biotecnologia e Engenharia Genética', importance: 'High', tier: 3, prerequisites: ['bio-t2-02'], estimatedMinutes: 90 },

    // --- FÍSICA ---
    // TIER 1
    { id: 'fis-t1-01', subject: 'Física', category: 'Eletro', title: 'Eletrodinâmica: Circuitos e Potência', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 150 },
    { id: 'fis-t1-02', subject: 'Física', category: 'Cinemática', title: 'Cinemática: MRU, MRUV e Aceleração', importance: 'High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'fis-t1-03', subject: 'Física', category: 'Termo', title: 'Termologia: Calorimetria e Fases', importance: 'High', tier: 1, prerequisites: [], estimatedMinutes: 100 },

    // TIER 2
    { id: 'fis-t2-01', subject: 'Física', category: 'Dinâmica', title: 'Dinâmica: Leis de Newton e Energia', importance: 'Very High', tier: 2, prerequisites: ['fis-t1-02'], estimatedMinutes: 150 },
    { id: 'fis-t2-02', subject: 'Física', category: 'Ondulas', title: 'Ondulatória e Acústica', importance: 'Very High', tier: 2, prerequisites: [], estimatedMinutes: 120 },
    { id: 'fis-t2-03', subject: 'Física', category: 'Hidro', title: 'Hidrostática: Pressão e Empuxo', importance: 'Medium', tier: 2, prerequisites: ['fis-t2-01'], estimatedMinutes: 90 },

    // TIER 3
    { id: 'fis-t3-01', subject: 'Física', category: 'Otica', title: 'Óptica Geométrica', importance: 'Medium', tier: 3, prerequisites: [], estimatedMinutes: 90 },
    { id: 'fis-t3-02', subject: 'Física', category: 'Magnetismo', title: 'Eletromagnetismo e Indução', importance: 'Medium', tier: 3, prerequisites: ['fis-t1-01'], estimatedMinutes: 120 },

    // --- QUÍMICA ---
    // TIER 1
    { id: 'qui-t1-01', subject: 'Química', category: 'Geral', title: 'Propriedades, Atomística e Separação', importance: 'High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'qui-t1-02', subject: 'Química', category: 'Geral', title: 'Interações Intermoleculares e Polaridade', importance: 'Very High', tier: 1, prerequisites: ['qui-t1-01'], estimatedMinutes: 90 },
    { id: 'qui-t1-03', subject: 'Química', category: 'Inorgânica', title: 'Inorgânica: Ácidos, Bases, Sais, Óxidos', importance: 'High', tier: 1, prerequisites: ['qui-t1-02'], estimatedMinutes: 120 },

    // TIER 2
    { id: 'qui-t2-01', subject: 'Química', category: 'Fís-Qui', title: 'Estequiometria e Soluções', importance: 'Very High', tier: 2, prerequisites: ['qui-t1-01'], estimatedMinutes: 150 },
    { id: 'qui-t2-02', subject: 'Química', category: 'Orgânica', title: 'Orgânica: Funções e Isomeria', importance: 'Very High', tier: 2, prerequisites: ['qui-t1-02'], estimatedMinutes: 150 },
    { id: 'qui-t2-03', subject: 'Química', category: 'Fís-Qui', title: 'Termoquímica e Cinética', importance: 'Medium', tier: 2, prerequisites: ['qui-t2-01'], estimatedMinutes: 120 },

    // TIER 3
    { id: 'qui-t3-01', subject: 'Química', category: 'Fís-Qui', title: 'Equilíbrio Químico e pH', importance: 'High', tier: 3, prerequisites: ['qui-t2-01'], estimatedMinutes: 120 },
    { id: 'qui-t3-02', subject: 'Química', category: 'Fís-Qui', title: 'Eletroquímica (Pilhas/Eletrólise)', importance: 'High', tier: 3, prerequisites: ['qui-t2-01'], estimatedMinutes: 120 },
    { id: 'qui-t3-03', subject: 'Química', category: 'Orgânica', title: 'Reações Orgânicas Avançadas', importance: 'Medium', tier: 3, prerequisites: ['qui-t2-02'], estimatedMinutes: 120 },

    // --- HUMANAS E LINGUAGENS (Support - Simplified Tiers, mostly usage based) ---
    { id: 'his-01', subject: 'História', category: 'Brasil', title: 'Brasil Colônia', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'his-02', subject: 'História', category: 'Brasil', title: 'Brasil Império', importance: 'High', tier: 1, prerequisites: ['his-01'], estimatedMinutes: 120 },
    { id: 'his-03', subject: 'História', category: 'Brasil', title: 'Brasil República (Vargas/Militar)', importance: 'Very High', tier: 2, prerequisites: ['his-02'], estimatedMinutes: 150 },
    { id: 'his-04', subject: 'História', category: 'Geral', title: 'Mundo Contemporâneo (Guerra Fria)', importance: 'High', tier: 2, prerequisites: [], estimatedMinutes: 120 },

    { id: 'geo-01', subject: 'Geografia', category: 'Geopolítica', title: 'Geopolítica e Globalização', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'geo-02', subject: 'Geografia', category: 'Humana', title: 'Geografia Agrária e Urbana', importance: 'High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'geo-03', subject: 'Geografia', category: 'Física', title: 'Meio Ambiente, Clima e Relevo', importance: 'High', tier: 2, prerequisites: [], estimatedMinutes: 120 },

    { id: 'por-01', subject: 'Português', category: 'Interpretação', title: 'Interpretação e Gêneros Textuais', importance: 'Very High', tier: 1, prerequisites: [], estimatedMinutes: 120 },
    { id: 'por-02', subject: 'Português', category: 'Literatura', title: 'Modernismo e Escolas Literárias', importance: 'High', tier: 2, prerequisites: [], estimatedMinutes: 120 },

    { id: 'soc-01', subject: 'Filosofia/Sociologia', category: 'Sociologia', title: 'Sociologia Contemporânea', importance: 'Medium', tier: 2, prerequisites: [], estimatedMinutes: 90 },
    { id: 'fil-01', subject: 'Filosofia/Sociologia', category: 'Filosofia', title: 'Filosofia Clássica e Política', importance: 'Medium', tier: 2, prerequisites: [], estimatedMinutes: 90 }
];
