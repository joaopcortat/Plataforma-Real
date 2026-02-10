export type Subject = 'Matemática' | 'Física' | 'Química' | 'Biologia' | 'História' | 'Geografia' | 'Português' | 'Filosofia/Sociologia' | 'Redação';

export type Importance = 'Low' | 'Medium' | 'High' | 'Very High';

export interface Topic {
    id: string;
    subject: Subject;
    category: string;
    title: string;
    importance: Importance; // Based on ENEM frequency
    prerequisites: string[]; // IDs of topics that must be done first
    estimatedMinutes: number; // Base time to learn
}

// Comprehensive ENEM Syllabus (Best Effort Logic + Incidence)
export const SYLLABUS: Topic[] = [
    // --- MATEMÁTICA (The Foundation) ---
    { id: 'mat-00', subject: 'Matemática', category: 'Basics', title: 'Matemática Básica (Soma, Subtração, Mult, Div)', importance: 'Very High', prerequisites: [], estimatedMinutes: 60 },
    { id: 'mat-01', subject: 'Matemática', category: 'Basics', title: 'Frações, Decimais e Dízimas', importance: 'Very High', prerequisites: ['mat-00'], estimatedMinutes: 90 },
    { id: 'mat-02', subject: 'Matemática', category: 'Basics', title: 'Potenciação e Radiciação', importance: 'Very High', prerequisites: ['mat-01'], estimatedMinutes: 90 },
    { id: 'mat-03', subject: 'Matemática', category: 'Basics', title: 'Fatoração e Produtos Notáveis', importance: 'High', prerequisites: ['mat-02'], estimatedMinutes: 90 },
    { id: 'mat-04', subject: 'Matemática', category: 'Agrobusiness', title: 'Regra de Três (Simples e Composta)', importance: 'Very High', prerequisites: ['mat-01'], estimatedMinutes: 60 },
    { id: 'mat-05', subject: 'Matemática', category: 'Agrobusiness', title: 'Porcentagem e Juros', importance: 'Very High', prerequisites: ['mat-04'], estimatedMinutes: 90 },
    { id: 'mat-06', subject: 'Matemática', category: 'Algebra', title: 'Equações de 1º e 2º Grau', importance: 'Very High', prerequisites: ['mat-03'], estimatedMinutes: 120 },
    { id: 'mat-07', subject: 'Matemática', category: 'Algebra', title: 'Funções (Afim e Quadrática)', importance: 'Very High', prerequisites: ['mat-06'], estimatedMinutes: 180 },
    { id: 'mat-08', subject: 'Matemática', category: 'Stats', title: 'Estatística (Média, Moda, Mediana)', importance: 'Very High', prerequisites: ['mat-01'], estimatedMinutes: 90 },
    { id: 'mat-09', subject: 'Matemática', category: 'Stats', title: 'Interpretação de Gráficos e Tabelas', importance: 'Very High', prerequisites: [], estimatedMinutes: 60 },
    { id: 'mat-10', subject: 'Matemática', category: 'GeoP', title: 'Geometria Plana (Áreas e Perímetros)', importance: 'Very High', prerequisites: ['mat-06'], estimatedMinutes: 150 },
    { id: 'mat-11', subject: 'Matemática', category: 'GeoE', title: 'Geometria Espacial (Prismas, Cilindros)', importance: 'High', prerequisites: ['mat-10'], estimatedMinutes: 120 },
    { id: 'mat-12', subject: 'Matemática', category: 'GeoE', title: 'Geometria Espacial (Cones, Esferas)', importance: 'Medium', prerequisites: ['mat-11'], estimatedMinutes: 120 },
    { id: 'mat-13', subject: 'Matemática', category: 'Trig', title: 'Trigonometria no Triângulo Retângulo', importance: 'High', prerequisites: ['mat-10'], estimatedMinutes: 90 },
    { id: 'mat-14', subject: 'Matemática', category: 'Count', title: 'Princípio Fundamental da Contagem', importance: 'High', prerequisites: ['mat-01'], estimatedMinutes: 90 },
    { id: 'mat-15', subject: 'Matemática', category: 'Count', title: 'Probabilidade', importance: 'Very High', prerequisites: ['mat-14'], estimatedMinutes: 120 },
    { id: 'mat-16', subject: 'Matemática', category: 'Log', title: 'Logaritmos', importance: 'Medium', prerequisites: ['mat-02'], estimatedMinutes: 120 },
    { id: 'mat-17', subject: 'Matemática', category: 'Seq', title: 'Progressões (PA e PG)', importance: 'Medium', prerequisites: ['mat-06'], estimatedMinutes: 90 },

    // --- FÍSICA ---
    { id: 'fis-01', subject: 'Física', category: 'Mecânica', title: 'Cinemática (MRU e MRUV)', importance: 'High', prerequisites: ['mat-06'], estimatedMinutes: 120 },
    { id: 'fis-02', subject: 'Física', category: 'Mecânica', title: 'Leis de Newton', importance: 'Very High', prerequisites: ['fis-01'], estimatedMinutes: 120 },
    { id: 'fis-03', subject: 'Física', category: 'Mecânica', title: 'Trabalho e Energia', importance: 'Very High', prerequisites: ['fis-02'], estimatedMinutes: 120 },
    { id: 'fis-04', subject: 'Física', category: 'Termo', title: 'Calorimetria e Mudanças de Fase', importance: 'High', prerequisites: ['mat-06'], estimatedMinutes: 90 },
    { id: 'fis-05', subject: 'Física', category: 'Ondulas', title: 'Ondulatória (Eq. Fundamental, Fenômenos)', importance: 'Very High', prerequisites: ['mat-04'], estimatedMinutes: 120 },
    { id: 'fis-06', subject: 'Física', category: 'Eletro', title: 'Eletrostática (Carga e Campo)', importance: 'Medium', prerequisites: ['mat-02'], estimatedMinutes: 90 },
    { id: 'fis-07', subject: 'Física', category: 'Eletro', title: 'Eletrodinâmica (Corrente, Potência, Leis de Ohm)', importance: 'Very High', prerequisites: ['fis-06'], estimatedMinutes: 150 },
    { id: 'fis-08', subject: 'Física', category: 'Otica', title: 'Óptica Geométrica (Espelhos e Lentes)', importance: 'Medium', prerequisites: ['mat-10'], estimatedMinutes: 90 },

    // --- QUÍMICA ---
    { id: 'qui-01', subject: 'Química', category: 'Geral', title: 'Propriedades da Matéria e Separação de Misturas', importance: 'High', prerequisites: [], estimatedMinutes: 90 },
    { id: 'qui-02', subject: 'Química', category: 'Atomística', title: 'Modelos Atômicos e Distribuição Eletrônica', importance: 'Medium', prerequisites: [], estimatedMinutes: 90 },
    { id: 'qui-03', subject: 'Química', category: 'Geral', title: 'Tabela Periódica e Ligações Químicas', importance: 'High', prerequisites: ['qui-02'], estimatedMinutes: 120 },
    { id: 'qui-04', subject: 'Química', category: 'Inorgânica', title: 'Funções Inorgânicas (Ácidos, Bases, Sais, Óxidos)', importance: 'High', prerequisites: ['qui-03'], estimatedMinutes: 120 },
    { id: 'qui-05', subject: 'Química', category: 'Fís-Qui', title: 'Estequiometria', importance: 'Very High', prerequisites: ['qui-01', 'mat-04'], estimatedMinutes: 150 },
    { id: 'qui-06', subject: 'Química', category: 'Fís-Qui', title: 'Soluções (Concentração)', importance: 'High', prerequisites: ['qui-05'], estimatedMinutes: 120 },
    { id: 'qui-07', subject: 'Química', category: 'Fís-Qui', title: 'Termoquímica', importance: 'Medium', prerequisites: ['mat-06'], estimatedMinutes: 90 },
    { id: 'qui-08', subject: 'Química', category: 'Fís-Qui', title: 'Equilíbrio Químico (pH e pOH)', importance: 'High', prerequisites: ['qui-06'], estimatedMinutes: 120 },
    { id: 'qui-09', subject: 'Química', category: 'Orgânica', title: 'Introdução à Orgânica e Hidrocarbonetos', importance: 'Very High', prerequisites: ['qui-03'], estimatedMinutes: 120 },
    { id: 'qui-10', subject: 'Química', category: 'Orgânica', title: 'Funções Orgânicas Oxigenadas', importance: 'Very High', prerequisites: ['qui-09'], estimatedMinutes: 120 },
    { id: 'qui-11', subject: 'Química', category: 'Orgânica', title: 'Reações Orgânicas', importance: 'Medium', prerequisites: ['qui-10'], estimatedMinutes: 120 },
    { id: 'qui-12', subject: 'Química', category: 'Ambiental', title: 'Química Ambiental (Chuva Ácida, Ozônio, Lixo)', importance: 'Very High', prerequisites: ['qui-04'], estimatedMinutes: 90 },

    // --- BIOLOGIA ---
    { id: 'bio-01', subject: 'Biologia', category: 'Bioquímica', title: 'Água, Sais, Carboidratos e Lipídios', importance: 'Medium', prerequisites: ['qui-03'], estimatedMinutes: 90 },
    { id: 'bio-02', subject: 'Biologia', category: 'Citologia', title: 'Membrana Plasmática e Transportes', importance: 'High', prerequisites: ['bio-01'], estimatedMinutes: 90 },
    { id: 'bio-03', subject: 'Biologia', category: 'Citologia', title: 'Metabolismo Energético (Respiração e Fotossíntese)', importance: 'Very High', prerequisites: ['bio-02'], estimatedMinutes: 120 },
    { id: 'bio-04', subject: 'Biologia', category: 'Citologia', title: 'Síntese Proteica e Divisão Celular', importance: 'High', prerequisites: ['bio-02'], estimatedMinutes: 120 },
    { id: 'bio-05', subject: 'Biologia', category: 'Genética', title: 'Leis de Mendel', importance: 'High', prerequisites: ['bio-04'], estimatedMinutes: 120 },
    { id: 'bio-06', subject: 'Biologia', category: 'Ecologia', title: 'Cadeias Alimentares e Relações Ecológicas', importance: 'Very High', prerequisites: [], estimatedMinutes: 90 },
    { id: 'bio-07', subject: 'Biologia', category: 'Ecologia', title: 'Ciclos Biogeoquímicos e Desequilíbrios', importance: 'Very High', prerequisites: ['bio-06', 'qui-12'], estimatedMinutes: 90 },
    { id: 'bio-08', subject: 'Biologia', category: 'Fisiologia', title: 'Sistema Digestório e Respiratório', importance: 'Medium', prerequisites: ['bio-02'], estimatedMinutes: 90 },
    { id: 'bio-09', subject: 'Biologia', category: 'Fisiologia', title: 'Sistema Circulatório e Imune (Vacinas/Soro)', importance: 'Very High', prerequisites: ['bio-08'], estimatedMinutes: 120 },
    { id: 'bio-10', subject: 'Biologia', category: 'Doenças', title: 'Doenças (Vírus, Bactérias, Protozoários)', importance: 'Very High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'bio-11', subject: 'Biologia', category: 'Evolução', title: 'Teorias Evolutivas', importance: 'Medium', prerequisites: ['bio-05'], estimatedMinutes: 90 },

    // --- HISTÓRIA ---
    { id: 'his-01', subject: 'História', category: 'Brasil', title: 'Brasil Colônia (Açúcar e Ouro)', importance: 'Very High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'his-02', subject: 'História', category: 'Brasil', title: 'Brasil Império (I e II Reinado)', importance: 'Very High', prerequisites: ['his-01'], estimatedMinutes: 120 },
    { id: 'his-03', subject: 'História', category: 'Brasil', title: 'Brasil República (Velha, Vargas, Ditadura)', importance: 'Very High', prerequisites: ['his-02'], estimatedMinutes: 180 },
    { id: 'his-04', subject: 'História', category: 'Geral', title: 'Antiguidade Clássica (Grécia e Roma)', importance: 'Medium', prerequisites: [], estimatedMinutes: 90 },
    { id: 'his-05', subject: 'História', category: 'Geral', title: 'Feudalismo e Idade Média', importance: 'Medium', prerequisites: ['his-04'], estimatedMinutes: 90 },
    { id: 'his-06', subject: 'História', category: 'Geral', title: 'Revoluções Burguesas e Industrial', importance: 'High', prerequisites: ['his-05'], estimatedMinutes: 120 },
    { id: 'his-07', subject: 'História', category: 'Geral', title: 'Guerra Fria e Mundo Contemporâneo', importance: 'High', prerequisites: ['his-06'], estimatedMinutes: 120 },

    // --- GEOGRAFIA ---
    { id: 'geo-01', subject: 'Geografia', category: 'Física', title: 'Cartografia e Fusos Horários', importance: 'Medium', prerequisites: [], estimatedMinutes: 90 },
    { id: 'geo-02', subject: 'Geografia', category: 'Física', title: 'Climatologia e Domínios Morfoclimáticos', importance: 'High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'geo-03', subject: 'Geografia', category: 'Humana', title: 'Urbanização e Demografia', importance: 'Very High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'geo-04', subject: 'Geografia', category: 'Econômica', title: 'Agropecuária no Brasil', importance: 'Very High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'geo-05', subject: 'Geografia', category: 'Econômica', title: 'Fontes de Energia', importance: 'Very High', prerequisites: ['geo-02'], estimatedMinutes: 120 },
    { id: 'geo-06', subject: 'Geografia', category: 'Geopolítica', title: 'Globalização e Blocos Econômicos', importance: 'High', prerequisites: [], estimatedMinutes: 120 },

    // --- FILOSOFIA/SOCIOLOGIA ---
    { id: 'fil-01', subject: 'Filosofia/Sociologia', category: 'Filosofia', title: 'Pré-Socráticos e Clássicos (Sócrates, Platão, Aristóteles)', importance: 'High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'fil-02', subject: 'Filosofia/Sociologia', category: 'Filosofia', title: 'Política Moderna (Maquiavel, Hobbes, Locke, Rousseau)', importance: 'Very High', prerequisites: ['fil-01'], estimatedMinutes: 120 },
    { id: 'fil-03', subject: 'Filosofia/Sociologia', category: 'Sociologia', title: 'Cultura e Identidade (Antropologia)', importance: 'High', prerequisites: [], estimatedMinutes: 90 },
    { id: 'fil-04', subject: 'Filosofia/Sociologia', category: 'Sociologia', title: 'Trabalho e Classes Sociais (Marx, Weber, Durkheim)', importance: 'Very High', prerequisites: [], estimatedMinutes: 120 },

    // --- PORTUGUÊS ---
    { id: 'por-01', subject: 'Português', category: 'Gramática', title: 'Interpretação de Texto e Gêneros Textuais', importance: 'Very High', prerequisites: [], estimatedMinutes: 150 },
    { id: 'por-02', subject: 'Português', category: 'Literatura', title: 'Modernismo Brasileiro (1ª, 2ª e 3ª Geração)', importance: 'Very High', prerequisites: [], estimatedMinutes: 150 },
    { id: 'por-03', subject: 'Português', category: 'Literatura', title: 'Romantismo e Realismo', importance: 'High', prerequisites: [], estimatedMinutes: 120 },
    { id: 'por-04', subject: 'Português', category: 'Gramática', title: 'Funções da Linguagem', importance: 'High', prerequisites: ['por-01'], estimatedMinutes: 90 },
    { id: 'por-05', subject: 'Português', category: 'Artes', title: 'Vanguardas Europeias e Arte Contemporânea', importance: 'Medium', prerequisites: [], estimatedMinutes: 90 }
];
