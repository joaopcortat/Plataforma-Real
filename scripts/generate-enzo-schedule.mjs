/**
 * ═══════════════════════════════════════════════════════════════
 *  CRONOGRAMA INDIVIDUALIZADO — ENZO MARTINS
 *  Medicina UEPA | 3º Ano EM | ENEM 2026
 * ═══════════════════════════════════════════════════════════════
 *
 *  Perfil:
 *  - Dificuldade em Física (geral) e Estequiometria (Química)
 *  - Precisa de base sólida até Junho
 *  - Cobertura total até Setembro
 *  - Prioridade: Natureza + Matemática
 *  - Sem Línguas
 *  - Redação a cada 2 semanas
 *  - Revisão espaçada D+1, D+7, D+30
 *
 *  Disponibilidade Semanal:
 *  ┌──────────┬─────────────────────────────┬──────────┐
 *  │ Dia      │ Janela                      │ Horas    │
 *  ├──────────┼─────────────────────────────┼──────────┤
 *  │ Domingo  │ 09:00–12:00 + 13:30–16:30   │ 6.0h     │
 *  │ Segunda  │ 20:00–21:30                 │ 1.5h     │
 *  │ Terça    │ 20:00–21:30                 │ 1.5h     │
 *  │ Quarta   │ 19:00–21:30                 │ 2.5h     │
 *  │ Quinta   │ 15:00–18:00 + 18:30–21:30   │ 6.0h     │
 *  │ Sexta    │ 15:00–18:00 + 18:30–21:30   │ 6.0h     │
 *  │ Sábado   │ —                           │ 0        │
 *  └──────────┴─────────────────────────────┴──────────┘
 *  Total: 23.5h/semana
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://tgybzzknpcrwjseotbrc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qqwQcKm-9DgRs-i8rCU6MA_wxseSbFg';
const ENZO_EMAIL = 'enzomartins0508@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════
//  CONTEÚDO PROGRAMÁTICO ENEM — EXPANDIDO PARA ENZO
// ═══════════════════════════════════════════════════════════

// Each topic: [subject, title, type, estimatedMinutes, phase]
// phase: 1 = Fundação (Fev–Abr), 2 = Construção (Mai–Jul), 3 = Aprofundamento (Ago–Set)

const CURRICULUM = [
    // ═══ MATEMÁTICA (sessões longas, prioridade alta) ═══
    // Fase 1 — Fundação
    { subject: 'Matemática', title: 'Operações Fundamentais e Propriedades Numéricas', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Frações, Decimais e Potenciação', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Expressões Numéricas e Fatoração', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Matemática', title: 'Regra de Três Simples e Composta', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Razão, Proporção e Grandezas', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Porcentagem — Conceito e Problemas', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Matemática', title: 'Matemática Financeira Básica (Juros Simples/Compostos)', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Estatística — Média, Moda e Mediana', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Matemática', title: 'Leitura e Interpretação de Gráficos e Tabelas', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Matemática', title: 'Equações de 1º Grau e Sistemas', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Matemática', title: 'Equações de 2º Grau — Bhaskara e Soma/Produto', type: 'class', minutes: 90, phase: 1 },
    // Fase 2 — Construção
    { subject: 'Matemática', title: 'Funções — Conceito, Domínio e Imagem', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Função Afim — Gráficos e Problemas', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Função Quadrática — Análise de Gráficos e Vértice', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Função Exponencial e Aplicações', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Matemática', title: 'Logaritmos — Propriedades e Equações', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Geometria Plana — Ângulos e Triângulos', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Geometria Plana — Áreas de Figuras Planas', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Geometria Plana — Circunferência e Polígonos', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Matemática', title: 'Geometria Espacial — Prismas e Cilindros', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Matemática', title: 'Geometria Espacial — Pirâmide, Cone e Esfera', type: 'class', minutes: 90, phase: 2 },
    // Fase 3 — Aprofundamento
    { subject: 'Matemática', title: 'Análise Combinatória — Princípio Fundamental', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Matemática', title: 'Permutações, Arranjos e Combinações', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Matemática', title: 'Probabilidade — Eventos e Cálculos', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Matemática', title: 'Trigonometria — Razões no Triângulo Retângulo', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Matemática', title: 'Trigonometria — Ciclo Trigonométrico', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Matemática', title: 'Progressão Aritmética (PA)', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Matemática', title: 'Progressão Geométrica (PG)', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Matemática', title: 'Matrizes e Determinantes', type: 'class', minutes: 60, phase: 3 },

    // ═══ FÍSICA (PRIORIDADE MÁXIMA — dificuldade do aluno) ═══
    // Fase 1 — Fundação (do zero)
    { subject: 'Física', title: 'Introdução à Física — Unidades e Conversões', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Física', title: 'Cinemática — Velocidade Média e MRU', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Física', title: 'Cinemática — MRUV e Queda Livre', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Física', title: 'Cinemática — Gráficos de Movimento', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Física', title: 'Vetores — Soma e Decomposição', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Física', title: 'Dinâmica — 1ª Lei de Newton (Inércia)', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Física', title: 'Dinâmica — 2ª Lei de Newton (F=ma)', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Física', title: 'Dinâmica — 3ª Lei de Newton e Aplicações', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Física', title: 'Forças — Peso, Normal, Atrito e Tração', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Física', title: 'Plano Inclinado e Elevadores', type: 'class', minutes: 60, phase: 1 },
    // Fase 2 — Construção
    { subject: 'Física', title: 'Trabalho e Energia Cinética', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Energia Potencial e Conservação de Energia', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Potência e Rendimento', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Física', title: 'Impulso e Quantidade de Movimento', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Física', title: 'Termologia — Temperatura, Escalas e Dilatação', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Calorimetria — Calor Sensível e Latente', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Termodinâmica — 1ª e 2ª Lei', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Hidrostática — Pressão, Empuxo e Princípio de Pascal', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Física', title: 'Óptica — Reflexão e Espelhos', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Física', title: 'Óptica — Refração e Lentes', type: 'class', minutes: 60, phase: 2 },
    // Fase 3 — Aprofundamento
    { subject: 'Física', title: 'Ondulatória — Conceitos e Propriedades', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Física', title: 'Acústica — Som e Fenômenos Sonoros', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Física', title: 'Eletrostática — Carga, Campo e Potencial', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Física', title: 'Eletrodinâmica — Corrente, Resistência e Lei de Ohm', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Física', title: 'Circuitos Elétricos — Série, Paralelo e Potência', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Física', title: 'Eletromagnetismo — Campo Magnético e Força', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Física', title: 'Indução Eletromagnética e Aplicações', type: 'class', minutes: 60, phase: 3 },

    // ═══ QUÍMICA (atenção especial em Estequiometria) ═══
    // Fase 1
    { subject: 'Química', title: 'Propriedades da Matéria e Separação de Misturas', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Modelos Atômicos e Estrutura do Átomo', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Tabela Periódica — Propriedades e Organização', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Ligações Químicas — Iônica, Covalente e Metálica', type: 'class', minutes: 90, phase: 1 },
    { subject: 'Química', title: 'Polaridade e Forças Intermoleculares', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Funções Inorgânicas — Ácidos e Bases', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Funções Inorgânicas — Sais e Óxidos', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Química', title: 'Reações Inorgânicas e Balanceamento', type: 'class', minutes: 60, phase: 1 },
    // Fase 2 — Estequiometria (foco especial!)
    { subject: 'Química', title: '⚠️ Estequiometria — Mol, Massa Molar e Nº de Avogadro', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Química', title: '⚠️ Estequiometria — Relações Estequiométricas', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Química', title: '⚠️ Estequiometria — Pureza e Rendimento', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Química', title: '⚠️ Estequiometria — Exercícios Intensivos', type: 'exercise', minutes: 90, phase: 2 },
    { subject: 'Química', title: 'Soluções — Concentração e Diluição', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Química', title: 'Termoquímica — Entalpia e Lei de Hess', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Química', title: 'Cinética Química — Velocidade e Fatores', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Química', title: 'Química Orgânica — Classificação de Cadeias', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Química', title: 'Química Orgânica — Funções Orgânicas I (Hidrocarbonetos, Álcoois)', type: 'class', minutes: 90, phase: 2 },
    // Fase 3
    { subject: 'Química', title: 'Química Orgânica — Funções Orgânicas II (Ácidos, Ésteres, Aminas)', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Química', title: 'Isomeria — Plana e Espacial', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Química', title: 'Equilíbrio Químico — Constante e Princípio de Le Chatelier', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Química', title: 'pH e pOH — Cálculos e Aplicações', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Química', title: 'Eletroquímica — Pilhas e Eletrólise', type: 'class', minutes: 90, phase: 3 },
    { subject: 'Química', title: 'Reações Orgânicas — Adição, Substituição, Eliminação', type: 'class', minutes: 60, phase: 3 },

    // ═══ BIOLOGIA ═══
    // Fase 1
    { subject: 'Biologia', title: 'Ecologia — Cadeias Alimentares e Teias', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Ecologia — Ciclos Biogeoquímicos', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Ecologia — Relações Ecológicas', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Citologia — Célula Eucarionte e Procarionte', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Citologia — Organelas e Membrana Plasmática', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Bioenergética — Fotossíntese', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Biologia', title: 'Bioenergética — Respiração Celular e Fermentação', type: 'class', minutes: 60, phase: 1 },
    // Fase 2
    { subject: 'Biologia', title: 'Divisão Celular — Mitose e Meiose', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Biologia', title: 'Genética — 1ª Lei de Mendel', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Biologia', title: 'Genética — 2ª Lei de Mendel e Herança', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Biologia', title: 'Genética — Grupos Sanguíneos e Ligada ao Sexo', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Biologia', title: 'Fisiologia Humana — Sistema Digestório e Respiratório', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Biologia', title: 'Fisiologia Humana — Sistema Circulatório e Excretor', type: 'class', minutes: 90, phase: 2 },
    { subject: 'Biologia', title: 'Fisiologia Humana — Sistema Nervoso e Endócrino', type: 'class', minutes: 60, phase: 2 },
    // Fase 3
    { subject: 'Biologia', title: 'Evolução — Teorias e Evidências', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Biologia', title: 'Biotecnologia — DNA Recombinante e Transgênicos', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Biologia', title: 'Botânica — Fisiologia Vegetal', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Biologia', title: 'Zoologia — Classificação e Filos Principais', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Biologia', title: 'Impactos Ambientais e Sustentabilidade', type: 'class', minutes: 60, phase: 3 },

    // ═══ HISTÓRIA ═══
    // Fase 1
    { subject: 'História', title: 'Brasil Colônia — Capitanias e Economia Colonial', type: 'class', minutes: 90, phase: 1 },
    { subject: 'História', title: 'Brasil Colônia — Escravidão e Sociedade', type: 'class', minutes: 60, phase: 1 },
    // Fase 2
    { subject: 'História', title: 'Brasil Império — Independência e 1º Reinado', type: 'class', minutes: 90, phase: 2 },
    { subject: 'História', title: 'Brasil Império — 2º Reinado e Abolição', type: 'class', minutes: 60, phase: 2 },
    { subject: 'História', title: 'Brasil República — República Velha e Vargas', type: 'class', minutes: 90, phase: 2 },
    { subject: 'História', title: 'Brasil República — Ditadura Militar', type: 'class', minutes: 90, phase: 2 },
    // Fase 3
    { subject: 'História', title: 'Idade Média — Feudalismo e Igreja', type: 'class', minutes: 60, phase: 3 },
    { subject: 'História', title: 'Revolução Industrial e Iluminismo', type: 'class', minutes: 60, phase: 3 },
    { subject: 'História', title: 'Guerras Mundiais e Período Entreguerras', type: 'class', minutes: 90, phase: 3 },
    { subject: 'História', title: 'Guerra Fria e Mundo Contemporâneo', type: 'class', minutes: 60, phase: 3 },

    // ═══ GEOGRAFIA ═══
    // Fase 1
    { subject: 'Geografia', title: 'Geopolítica — Globalização e Blocos Econômicos', type: 'class', minutes: 60, phase: 1 },
    { subject: 'Geografia', title: 'Urbanização — Problemas Urbanos e Favelização', type: 'class', minutes: 60, phase: 1 },
    // Fase 2
    { subject: 'Geografia', title: 'Geografia Agrária — Estrutura Fundiária e Agronegócio', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Geografia', title: 'Meio Ambiente — Biomas Brasileiros', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Geografia', title: 'Climatologia — Climas do Brasil e do Mundo', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Geografia', title: 'Geomorfologia — Relevo e Solos', type: 'class', minutes: 60, phase: 2 },
    // Fase 3
    { subject: 'Geografia', title: 'Demografia — Teorias Populacionais e Pirâmides', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Geografia', title: 'Hidrografia — Bacias Hidrográficas e Recursos Hídricos', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Geografia', title: 'Geografia Econômica — Industrialização e Energia', type: 'class', minutes: 60, phase: 3 },

    // ═══ FILOSOFIA / SOCIOLOGIA ═══
    { subject: 'Filosofia/Sociologia', title: 'Filosofia Clássica — Sócrates, Platão e Aristóteles', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Filosofia/Sociologia', title: 'Filosofia Política — Contratualismo e Estado', type: 'class', minutes: 60, phase: 2 },
    { subject: 'Filosofia/Sociologia', title: 'Sociologia — Durkheim, Weber e Marx', type: 'class', minutes: 60, phase: 3 },
    { subject: 'Filosofia/Sociologia', title: 'Cidadania, Direitos Humanos e Cultura', type: 'class', minutes: 60, phase: 3 },
];

// ═══════════════════════════════════════════════════════════
//  DISPONIBILIDADE SEMANAL DO ENZO
// ═══════════════════════════════════════════════════════════
//  dow: 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
const AVAILABILITY = {
    0: [ // Domingo
        { start: '09:00', minutes: 180 }, // 09:00–12:00
        { start: '13:30', minutes: 180 }, // 13:30–16:30
    ],
    1: [ // Segunda
        { start: '20:00', minutes: 90 },  // 20:00–21:30
    ],
    2: [ // Terça
        { start: '20:00', minutes: 90 },  // 20:00–21:30
    ],
    3: [ // Quarta
        { start: '19:00', minutes: 150 }, // 19:00–21:30
    ],
    4: [ // Quinta
        { start: '15:00', minutes: 180 }, // 15:00–18:00
        { start: '18:30', minutes: 180 }, // 18:30–21:30
    ],
    5: [ // Sexta
        { start: '15:00', minutes: 180 }, // 15:00–18:00
        { start: '18:30', minutes: 180 }, // 18:30–21:30
    ],
    6: [], // Sábado — sem sessões
};

// ═══════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

function formatDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDow(d) {
    return d.getDay();
}

// ═══════════════════════════════════════════════════════════
//  SCHEDULE GENERATOR
// ═══════════════════════════════════════════════════════════

function generateEnzoSchedule() {
    const tasks = [];
    const startDate = new Date(2026, 1, 16); // Feb 16, 2026 (Monday)
    const endDate = new Date(2026, 8, 30);   // Sep 30, 2026

    // Queue of topics, sorted by phase then by subject priority
    const subjectPriority = {
        'Física': 1,        // highest
        'Matemática': 2,
        'Química': 3,
        'Biologia': 4,
        'História': 5,
        'Geografia': 6,
        'Filosofia/Sociologia': 7,
    };

    const queue = [...CURRICULUM].sort((a, b) => {
        if (a.phase !== b.phase) return a.phase - b.phase;
        return (subjectPriority[a.subject] || 99) - (subjectPriority[b.subject] || 99);
    });

    let topicIdx = 0;
    let topicRemaining = queue.length > 0 ? queue[0].minutes : 0;
    let redacaoWeekCounter = 0;

    // Track completed topics for spaced reviews
    const reviews = []; // { date, subject, title, type }

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const dow = getDow(currentDate);
        const dateStr = formatDate(currentDate);
        const slots = AVAILABILITY[dow] || [];

        if (slots.length === 0) {
            currentDate = addDays(currentDate, 1);
            continue;
        }

        // Sunday: Redação every 2 weeks
        if (dow === 0) {
            redacaoWeekCounter++;
        }

        let dayTasks = [];

        // 1. Add scheduled reviews for this day
        const todayReviews = reviews.filter(r => r.date === dateStr);
        for (const rev of todayReviews) {
            dayTasks.push({
                date: dateStr,
                subject: rev.subject,
                title: rev.title,
                type: 'review',
            });
        }
        // Remove consumed reviews
        const reviewMinutes = todayReviews.length * 20;

        // 2. If Sunday and redação week, add redação in first slot
        let redacaoMinutes = 0;
        if (dow === 0 && redacaoWeekCounter % 2 === 0) {
            dayTasks.push({
                date: dateStr,
                subject: 'Redação',
                title: 'Produção Textual ENEM — Tema Inédito',
                type: 'simulation',
            });
            redacaoMinutes = 90;
        }

        // 3. Calculate remaining budget for this day
        const totalDayMinutes = slots.reduce((sum, s) => sum + s.minutes, 0);
        let budgetMinutes = totalDayMinutes - reviewMinutes - redacaoMinutes;

        // 4. Fill remaining budget with new topics
        let subjectsToday = new Set(dayTasks.map(t => t.subject));
        let lastSubject = null;

        while (budgetMinutes >= 30 && topicIdx < queue.length) {
            const topic = queue[topicIdx];

            // Prefer subject diversity (max 3 per day, avoid consecutive same subject)
            if (topic.subject === lastSubject && subjectsToday.size < 3) {
                // Try to find a different subject
                let found = false;
                for (let j = topicIdx + 1; j < Math.min(topicIdx + 5, queue.length); j++) {
                    if (queue[j].subject !== lastSubject && queue[j].phase <= topic.phase + 1) {
                        // Swap
                        [queue[topicIdx], queue[j]] = [queue[j], queue[topicIdx]];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    // OK, same subject is fine
                }
            }

            const currentTopic = queue[topicIdx];
            const blockMinutes = Math.min(topicRemaining, budgetMinutes, 90); // Max 90 min per block

            if (blockMinutes < 30) break;

            // Add theory/exercise block
            dayTasks.push({
                date: dateStr,
                subject: currentTopic.subject,
                title: currentTopic.title,
                type: currentTopic.type,
            });

            budgetMinutes -= blockMinutes;
            topicRemaining -= blockMinutes;
            lastSubject = currentTopic.subject;
            subjectsToday.add(currentTopic.subject);

            // Topic finished?
            if (topicRemaining <= 0) {
                // Add fixation block if budget allows
                if (budgetMinutes >= 45 && currentTopic.type === 'class') {
                    dayTasks.push({
                        date: dateStr,
                        subject: currentTopic.subject,
                        title: `Fixação: ${currentTopic.title}`,
                        type: 'exercise',
                    });
                    budgetMinutes -= 45;
                }

                // Schedule spaced reviews
                const reviewDays = [1, 7, 30];
                for (const offset of reviewDays) {
                    const revDate = formatDate(addDays(currentDate, offset));
                    const label = `Revisão D+${offset}`;
                    reviews.push({
                        date: revDate,
                        subject: currentTopic.subject,
                        title: `${label}: ${currentTopic.title}`,
                    });
                }

                // Move to next topic
                topicIdx++;
                if (topicIdx < queue.length) {
                    topicRemaining = queue[topicIdx].minutes;
                }
            }
        }

        // If any remaining reviews overflow into available time
        // (already handled above)

        // Add all day tasks to main list
        tasks.push(...dayTasks);

        currentDate = addDays(currentDate, 1);
    }

    // Add any remaining reviews that didn't get their own theory day
    for (const rev of reviews) {
        const revDateObj = new Date(rev.date);
        if (revDateObj > endDate) continue;
        // Check if already added
        const alreadyExists = tasks.some(t => t.date === rev.date && t.title === rev.title);
        if (!alreadyExists) {
            tasks.push({
                date: rev.date,
                subject: rev.subject,
                title: rev.title,
                type: 'review',
            });
        }
    }

    return tasks;
}

// ═══════════════════════════════════════════════════════════
//  MAIN EXECUTION
// ═══════════════════════════════════════════════════════════

async function main() {
    console.log('🔍 Buscando user_id do Enzo...');

    // Find Enzo's user_id by querying profiles or auth
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .ilike('full_name', '%enzo%');

    let userId = null;

    if (profiles && profiles.length > 0) {
        userId = profiles[0].user_id;
        console.log(`✅ Encontrado: ${profiles[0].full_name} → ${userId}`);
    } else {
        // Try to find via auth (won't work with anon key, but let's try the profiles table with email patterns)
        console.log('⚠️ Não encontrado por nome. Tentando buscar por email...');

        // Check if there's an email field in profiles
        const { data: allProfiles } = await supabase.from('profiles').select('*');
        console.log('Todos os perfis:', JSON.stringify(allProfiles, null, 2));

        if (!allProfiles || allProfiles.length === 0) {
            console.error('❌ Nenhum perfil encontrado. O aluno precisa se cadastrar primeiro.');
            console.log('\n📋 Instrução: O Enzo precisa criar uma conta em enzomartins0508@gmail.com na plataforma.');
            console.log('  Depois, rode este script novamente.');
            process.exit(1);
        }

        // Show available profiles for manual selection
        console.log('\nPerfis disponíveis:');
        allProfiles.forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.full_name || 'Sem nome'} (user_id: ${p.user_id})`);
        });
        process.exit(1);
    }

    // Generate schedule
    console.log('\n📅 Gerando cronograma individualizado...');
    const tasks = generateEnzoSchedule();
    console.log(`📊 ${tasks.length} tarefas geradas (Fev 16 – Set 30, 2026)`);

    // Stats
    const subjects = {};
    for (const t of tasks) {
        subjects[t.subject] = (subjects[t.subject] || 0) + 1;
    }
    console.log('\n📈 Distribuição por matéria:');
    for (const [s, count] of Object.entries(subjects).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${s}: ${count} blocos`);
    }

    const types = {};
    for (const t of tasks) {
        types[t.type] = (types[t.type] || 0) + 1;
    }
    console.log('\n📋 Por tipo:');
    for (const [ty, count] of Object.entries(types)) {
        console.log(`  ${ty}: ${count}`);
    }

    // Confirm before inserting
    console.log(`\n🎯 Pronto para inserir ${tasks.length} tarefas para user_id: ${userId}`);
    console.log('   Pressione Ctrl+C para cancelar, ou aguarde 3 segundos...');

    await new Promise(r => setTimeout(r, 3000));

    // Delete existing IA-generated tasks for this user (future only)
    const today = formatDate(new Date());
    console.log('\n🗑️ Removendo cronograma IA anterior...');
    const { error: deleteError } = await supabase
        .from('schedule_tasks')
        .delete()
        .eq('user_id', userId)
        .eq('is_ia_generated', true)
        .gte('date', today);

    if (deleteError) {
        console.error('Erro ao deletar:', deleteError);
    }

    // Insert in batches
    console.log('📝 Inserindo tarefas...');
    const rows = tasks.map(t => ({
        user_id: userId,
        date: t.date,
        subject: t.subject,
        title: t.title,
        type: t.type,
        completed: false,
        is_ia_generated: true,
    }));

    const BATCH_SIZE = 200;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('schedule_tasks').insert(chunk);
        if (error) {
            console.error(`❌ Erro no batch ${i / BATCH_SIZE + 1}:`, error);
            break;
        }
        inserted += chunk.length;
        console.log(`  ✅ ${inserted}/${rows.length} inseridas`);
    }

    console.log(`\n🎉 Cronograma do Enzo inserido com sucesso! (${inserted} tarefas)`);
    console.log('   Ele pode acessar o app e verá o cronograma completo.');
}

main().catch(console.error);
