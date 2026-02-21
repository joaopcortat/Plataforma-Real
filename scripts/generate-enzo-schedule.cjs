/**
 * ═══════════════════════════════════════════════════════════════
 *  CRONOGRAMA INDIVIDUALIZADO — ENZO MARTINS
 *  Medicina UEPA | 3º Ano EM | ENEM 2026
 *  user_id: f27f0dff-279c-44e6-9f77-85d1ff074f0b
 *
 *  FEATURES:
 *  ✅ Respeita budget diário de cada dia da semana
 *  ✅ Preserva tarefas já concluídas (não recria)
 *  ✅ Distribui tópicos uniformemente até Agosto
 *  ✅ Revisões espaçadas D+1, D+7, D+30
 *  ✅ Redação a cada 2 semanas
 *  ✅ Currículo ENEM completo (exceto Linguagens)
 * ═══════════════════════════════════════════════════════════════
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tgybzzknpcrwjseotbrc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneWJ6emtucGNyd2pzZW90YnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU3MDY0MSwiZXhwIjoyMDg2MTQ2NjQxfQ.G7XJp5oDyYnUGoPHpZaozy5C5x8jbon4i2AHZ9m9Igg';
const ENZO_ID = 'f27f0dff-279c-44e6-9f77-85d1ff074f0b';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ═══════════════════════════════════════════════════════════
//  DURAÇÕES (idênticas ao Schedule.tsx)
// ═══════════════════════════════════════════════════════════
const DURATION = { class: 60, exercise: 45, review: 20, simulation: 90 };

// ═══════════════════════════════════════════════════════════
//  DISPONIBILIDADE — minutos por dia da semana
//  0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
//
//  Dom: 09–12 + 13:30–16:30 = 6h = 360min
//  Seg: 20:00–21:30 = 1.5h = 90min
//  Ter: 20:00–21:30 = 1.5h = 90min
//  Qua: 19:00–21:30 = 2.5h = 150min
//  Qui: 15–18 + 18:30–21:30 = 6h = 360min
//  Sex: 15–18 + 18:30–21:30 = 6h = 360min
//  Sáb: livre = 0min
// ═══════════════════════════════════════════════════════════
const BUDGET = { 0: 360, 1: 90, 2: 90, 3: 150, 4: 360, 5: 360, 6: 0 };

// Subjects assigned to each day
const DAY_SUBJECTS = {
    0: ['Física', 'Matemática'],               // Dom 6h — prioridade
    1: ['Química'],                             // Seg 1.5h
    2: ['Biologia'],                            // Ter 1.5h
    3: ['Física', 'Química'],                   // Qua 2.5h
    4: ['Matemática', 'Física'],                // Qui 6h
    5: ['História', 'Geografia', 'Biologia', 'Filosofia/Sociologia'], // Sex 6h
};

// ═══════════════════════════════════════════════════════════
//  CURRÍCULO ENEM COMPLETO — 130 tópicos
//  Todas as frentes cobradas no ENEM (exceto Linguagens)
//  p = fase (1=fundação fev-abr, 2=construção mai-jun, 3=aprofundamento jul-ago)
// ═══════════════════════════════════════════════════════════

const TOPICS = [
    // ════════════════════════════════════════
    //  FÍSICA — 30 tópicos (PRIORIDADE MÁXIMA)
    // ════════════════════════════════════════
    // Mecânica
    { s: 'Física', t: 'Introdução à Física — Unidades e Conversões', p: 1 },
    { s: 'Física', t: 'Cinemática — Velocidade Média e MRU', p: 1 },
    { s: 'Física', t: 'Cinemática — MRUV e Queda Livre', p: 1 },
    { s: 'Física', t: 'Cinemática — Interpretação de Gráficos', p: 1 },
    { s: 'Física', t: 'Lançamento Oblíquo e Composição de Movimentos', p: 1 },
    { s: 'Física', t: 'MCU — Movimento Circular Uniforme', p: 1 },
    { s: 'Física', t: 'Vetores — Soma e Decomposição', p: 1 },
    { s: 'Física', t: 'Dinâmica — Leis de Newton (1ª, 2ª e 3ª)', p: 1 },
    { s: 'Física', t: 'Forças — Peso, Normal, Atrito e Tração', p: 1 },
    { s: 'Física', t: 'Plano Inclinado e Elevadores', p: 1 },
    { s: 'Física', t: 'Gravitação Universal — Leis de Kepler', p: 1 },
    // Energia e Momento
    { s: 'Física', t: 'Trabalho e Energia Cinética', p: 2 },
    { s: 'Física', t: 'Energia Potencial e Conservação', p: 2 },
    { s: 'Física', t: 'Potência e Rendimento', p: 2 },
    { s: 'Física', t: 'Impulso e Quantidade de Movimento', p: 2 },
    // Termofísica
    { s: 'Física', t: 'Termologia — Temperatura, Escalas e Dilatação', p: 2 },
    { s: 'Física', t: 'Calorimetria — Calor Sensível e Latente', p: 2 },
    { s: 'Física', t: 'Termodinâmica — 1ª e 2ª Lei', p: 2 },
    // Fluidos + Óptica
    { s: 'Física', t: 'Hidrostática — Pressão, Empuxo e Pascal', p: 2 },
    { s: 'Física', t: 'Óptica — Reflexão, Espelhos e Refração', p: 2 },
    { s: 'Física', t: 'Óptica — Lentes e Instrumentos', p: 2 },
    // Ondas
    { s: 'Física', t: 'Ondulatória — Tipos, Propriedades e Fenômenos', p: 3 },
    { s: 'Física', t: 'Acústica — Som, Ressonância e Efeito Doppler', p: 3 },
    // Eletricidade e Magnetismo
    { s: 'Física', t: 'Eletrostática — Carga, Campo e Potencial', p: 3 },
    { s: 'Física', t: 'Eletrodinâmica — Corrente, Resistência e Ohm', p: 3 },
    { s: 'Física', t: 'Circuitos — Série, Paralelo e Potência Elétrica', p: 3 },
    { s: 'Física', t: 'Eletromagnetismo — Campo Magnético e Lorentz', p: 3 },
    { s: 'Física', t: 'Indução Eletromagnética e Lei de Faraday', p: 3 },
    // Moderna
    { s: 'Física', t: 'Física Moderna — Efeito Fotoelétrico e Dualidade', p: 3 },
    { s: 'Física', t: 'Radioatividade — Tipos de Emissão e Meia-Vida', p: 3 },

    // ════════════════════════════════════════
    //  MATEMÁTICA — 30 tópicos
    // ════════════════════════════════════════
    // Aritmética e Álgebra Básica
    { s: 'Matemática', t: 'Operações Fundamentais e Propriedades', p: 1 },
    { s: 'Matemática', t: 'Frações, Decimais e Potenciação', p: 1 },
    { s: 'Matemática', t: 'Expressões Numéricas e Fatoração', p: 1 },
    { s: 'Matemática', t: 'Regra de Três Simples e Composta', p: 1 },
    { s: 'Matemática', t: 'Razão, Proporção e Grandezas', p: 1 },
    { s: 'Matemática', t: 'Porcentagem — Problemas ENEM', p: 1 },
    { s: 'Matemática', t: 'Matem. Financeira — Juros Simples e Compostos', p: 1 },
    { s: 'Matemática', t: 'Estatística — Média, Moda, Mediana e Desvio', p: 1 },
    { s: 'Matemática', t: 'Interpretação de Gráficos e Tabelas', p: 1 },
    { s: 'Matemática', t: 'Equações de 1º Grau e Sistemas Lineares', p: 1 },
    { s: 'Matemática', t: 'Equações de 2º Grau — Bhaskara e Soma/Produto', p: 1 },
    // Funções
    { s: 'Matemática', t: 'Funções — Conceito, Domínio e Imagem', p: 2 },
    { s: 'Matemática', t: 'Função Afim — Gráficos e Raízes', p: 2 },
    { s: 'Matemática', t: 'Função Quadrática — Vértice e Análise', p: 2 },
    { s: 'Matemática', t: 'Função Exponencial e Aplicações', p: 2 },
    { s: 'Matemática', t: 'Logaritmos — Propriedades e Equações', p: 2 },
    // Geometria
    { s: 'Matemática', t: 'Geom. Plana — Triângulos, Tales e Pitágoras', p: 2 },
    { s: 'Matemática', t: 'Geom. Plana — Áreas de Figuras Planas', p: 2 },
    { s: 'Matemática', t: 'Geom. Plana — Circunferência e Polígonos', p: 2 },
    { s: 'Matemática', t: 'Geom. Espacial — Prismas e Cilindros', p: 2 },
    { s: 'Matemática', t: 'Geom. Espacial — Pirâmide, Cone e Esfera', p: 2 },
    { s: 'Matemática', t: 'Geom. Analítica — Ponto, Reta e Circunferência', p: 2 },
    // Combinatória e Probabilidade
    { s: 'Matemática', t: 'Análise Combinatória — PFC, Arranjo e Combinação', p: 3 },
    { s: 'Matemática', t: 'Probabilidade — Problemas ENEM', p: 3 },
    // Trigonometria
    { s: 'Matemática', t: 'Trigonometria — Razões no Triângulo Retângulo', p: 3 },
    { s: 'Matemática', t: 'Trigonometria — Ciclo Trigonométrico e Funções', p: 3 },
    // Sequências
    { s: 'Matemática', t: 'PA — Termo Geral e Soma', p: 3 },
    { s: 'Matemática', t: 'PG — Termo Geral e Soma', p: 3 },
    // Matrizes
    { s: 'Matemática', t: 'Matrizes e Determinantes', p: 3 },
    { s: 'Matemática', t: 'Sistemas Lineares — Escalonamento e Cramer', p: 3 },

    // ════════════════════════════════════════
    //  QUÍMICA — 25 tópicos (FOCO Estequiometria)
    // ════════════════════════════════════════
    // Geral
    { s: 'Química', t: 'Propriedades da Matéria e Separação de Misturas', p: 1 },
    { s: 'Química', t: 'Modelos Atômicos e Estrutura do Átomo', p: 1 },
    { s: 'Química', t: 'Tabela Periódica — Propriedades Periódicas', p: 1 },
    { s: 'Química', t: 'Ligações Químicas — Iônica, Covalente e Metálica', p: 1 },
    { s: 'Química', t: 'Polaridade e Forças Intermoleculares', p: 1 },
    { s: 'Química', t: 'Funções Inorgânicas — Ácidos e Bases', p: 1 },
    { s: 'Química', t: 'Funções Inorgânicas — Sais e Óxidos', p: 1 },
    { s: 'Química', t: 'Reações Inorgânicas e Balanceamento', p: 1 },
    // Estequiometria (FOCO)
    { s: 'Química', t: '⚠️ FOCO: Estequiometria — Mol e Massa Molar', p: 2 },
    { s: 'Química', t: '⚠️ FOCO: Estequiometria — Relações Massa-Massa', p: 2 },
    { s: 'Química', t: '⚠️ FOCO: Estequiometria — Pureza e Rendimento', p: 2 },
    { s: 'Química', t: '⚠️ FOCO: Estequiometria — Exercícios ENEM', p: 2 },
    // Físico-Química
    { s: 'Química', t: 'Soluções — Concentração e Diluição', p: 2 },
    { s: 'Química', t: 'Termoquímica — Entalpia e Lei de Hess', p: 2 },
    { s: 'Química', t: 'Cinética Química — Velocidade e Fatores', p: 2 },
    { s: 'Química', t: 'Equilíbrio Químico — Kc, Kp e Le Chatelier', p: 3 },
    { s: 'Química', t: 'pH e pOH — Cálculos e Indicadores', p: 3 },
    { s: 'Química', t: 'Eletroquímica — Pilhas e Eletrólise', p: 3 },
    // Orgânica
    { s: 'Química', t: 'Orgânica — Cadeias Carbônicas e Classificação', p: 2 },
    { s: 'Química', t: 'Orgânica — Funções I (HC, Álcoois, Fenóis)', p: 2 },
    { s: 'Química', t: 'Orgânica — Funções II (Aldeídos, Cetonas, Ésteres)', p: 3 },
    { s: 'Química', t: 'Isomeria — Plana e Óptica', p: 3 },
    { s: 'Química', t: 'Reações Orgânicas — Adição, Substituição', p: 3 },
    // Ambiental
    { s: 'Química', t: 'Radioatividade e Química Ambiental', p: 3 },
    { s: 'Química', t: 'Polímeros e Bioquímica Básica', p: 3 },

    // ════════════════════════════════════════
    //  BIOLOGIA — 22 tópicos
    // ════════════════════════════════════════
    // Ecologia
    { s: 'Biologia', t: 'Ecologia — Cadeias Alimentares e Teias', p: 1 },
    { s: 'Biologia', t: 'Ecologia — Ciclos Biogeoquímicos', p: 1 },
    { s: 'Biologia', t: 'Ecologia — Relações Ecológicas e Sucessão', p: 1 },
    { s: 'Biologia', t: 'Impactos Ambientais e Sustentabilidade', p: 1 },
    // Citologia
    { s: 'Biologia', t: 'Citologia — Célula Eucarionte vs Procarionte', p: 1 },
    { s: 'Biologia', t: 'Citologia — Organelas e Membrana', p: 1 },
    { s: 'Biologia', t: 'Bioenergética — Fotossíntese', p: 1 },
    { s: 'Biologia', t: 'Bioenergética — Respiração e Fermentação', p: 1 },
    { s: 'Biologia', t: 'Divisão Celular — Mitose e Meiose', p: 2 },
    // Genética
    { s: 'Biologia', t: 'Genética — 1ª Lei de Mendel', p: 2 },
    { s: 'Biologia', t: 'Genética — 2ª Lei e Herança Ligada ao Sexo', p: 2 },
    { s: 'Biologia', t: 'Genética — Grupos Sanguíneos (ABO e Rh)', p: 2 },
    // Fisiologia Humana
    { s: 'Biologia', t: 'Fisiologia — Sistema Digestório e Respiratório', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Circulatório e Excretor', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Nervoso e Endócrino', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Imunológico e Vacinas', p: 2 },
    // Evolução e Biotec
    { s: 'Biologia', t: 'Evolução — Darwinismo, Neodarwinismo e Evidências', p: 3 },
    { s: 'Biologia', t: 'Biotecnologia — DNA Recombinante e Transgênicos', p: 3 },
    // Diversidade
    { s: 'Biologia', t: 'Botânica — Fisiologia Vegetal e Hormônios', p: 3 },
    { s: 'Biologia', t: 'Zoologia — Classificação e Principais Filos', p: 3 },
    // Saúde
    { s: 'Biologia', t: 'Microbiologia — Vírus, Bactérias e Protozoários', p: 3 },
    { s: 'Biologia', t: 'Parasitologia — Doenças e Profilaxia', p: 3 },

    // ════════════════════════════════════════
    //  HISTÓRIA — 12 tópicos
    // ════════════════════════════════════════
    { s: 'História', t: 'Brasil Colônia — Capitanias, Economia e Sociedade', p: 1 },
    { s: 'História', t: 'Brasil Colônia — Escravidão e Resistência', p: 1 },
    { s: 'História', t: 'Brasil Império — Independência e 1º Reinado', p: 2 },
    { s: 'História', t: 'Brasil Império — 2º Reinado e Abolição', p: 2 },
    { s: 'História', t: 'Brasil República — República Velha e Era Vargas', p: 2 },
    { s: 'História', t: 'Brasil República — Ditadura Militar e Redemocratização', p: 2 },
    { s: 'História', t: 'Antiguidade Clássica — Grécia e Roma', p: 3 },
    { s: 'História', t: 'Idade Média — Feudalismo, Igreja e Cruzadas', p: 3 },
    { s: 'História', t: 'Revolução Industrial e Iluminismo', p: 3 },
    { s: 'História', t: 'Revolução Francesa e Era Napoleônica', p: 3 },
    { s: 'História', t: 'Guerras Mundiais e Período Entreguerras', p: 3 },
    { s: 'História', t: 'Guerra Fria e Mundo Contemporâneo', p: 3 },

    // ════════════════════════════════════════
    //  GEOGRAFIA — 11 tópicos
    // ════════════════════════════════════════
    { s: 'Geografia', t: 'Geopolítica — Globalização e Blocos Econômicos', p: 1 },
    { s: 'Geografia', t: 'Urbanização — Problemas Urbanos e Metropolização', p: 1 },
    { s: 'Geografia', t: 'Geografia Agrária — Estrutura Fundiária e Agronegócio', p: 2 },
    { s: 'Geografia', t: 'Meio Ambiente — Biomas Brasileiros e Desmatamento', p: 2 },
    { s: 'Geografia', t: 'Climatologia — Tipos Climáticos e Fenômenos', p: 2 },
    { s: 'Geografia', t: 'Geomorfologia — Relevo, Solos e Intemperismo', p: 2 },
    { s: 'Geografia', t: 'Demografia — Teorias Populacionais e Pirâmides', p: 3 },
    { s: 'Geografia', t: 'Hidrografia — Bacias e Recursos Hídricos', p: 3 },
    { s: 'Geografia', t: 'Industrialização e Matriz Energética', p: 3 },
    { s: 'Geografia', t: 'Cartografia — Escalas, Projeções e Fusos', p: 1 },
    { s: 'Geografia', t: 'Migrações e Conflitos Territoriais', p: 3 },

    // ════════════════════════════════════════
    //  FILOSOFIA (3) + SOCIOLOGIA (3) = 6 tópicos
    // ════════════════════════════════════════
    { s: 'Filosofia/Sociologia', t: 'Filosofia Clássica — Sócrates, Platão, Aristóteles', p: 2 },
    { s: 'Filosofia/Sociologia', t: 'Filosofia Política — Contratualismo', p: 2 },
    { s: 'Filosofia/Sociologia', t: 'Ética e Filosofia Contemporânea', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Sociologia — Durkheim, Weber e Marx', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Cidadania, Direitos Humanos e Movimentos Sociais', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Cultura de Massa, Indústria Cultural e Ideologia', p: 3 },
];

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
// Parse 'YYYY-MM-DD' as LOCAL date (not UTC)
function parseLocal(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
}

// ═══════════════════════════════════════════════════════════
//  STEP 1: FETCH COMPLETED TOPICS (from previous generation)
// ═══════════════════════════════════════════════════════════

async function fetchCompletedTopics() {
    console.log('🔍 Buscando tarefas concluídas pelo Enzo...');
    const { data, error } = await supabase
        .from('schedule_tasks')
        .select('title, subject, type')
        .eq('user_id', ENZO_ID)
        .eq('completed', true)
        .eq('is_ia_generated', true);

    if (error) {
        console.error('  ⚠️ Erro:', error.message);
        return new Set();
    }

    // Extract the base topic titles from completed class blocks
    // (ignore fixation/review variations)
    const completedTitles = new Set();
    for (const row of (data || [])) {
        if (row.type === 'class' || row.type === 'exercise') {
            // Strip "Fixação: " prefix if present
            const baseTitle = row.title.replace(/^Fixação:\s*/, '');
            completedTitles.add(baseTitle);
        }
    }

    if (completedTitles.size > 0) {
        console.log('  ✅ ' + completedTitles.size + ' tópicos já concluídos:');
        for (const t of completedTitles) console.log('     ✓ ' + t);
    } else {
        console.log('  ℹ️  Nenhum tópico concluído ainda');
    }

    return completedTitles;
}

// ═══════════════════════════════════════════════════════════
//  STEP 2: GENERATE SCHEDULE
// ═══════════════════════════════════════════════════════════

function generate(completedTitles) {
    // Filter out already-completed topics
    const filteredTopics = TOPICS.filter(t => !completedTitles.has(t.t));
    console.log('\n📚 ' + TOPICS.length + ' tópicos no currículo');
    console.log('   ' + completedTitles.size + ' já concluídos');
    console.log('   ' + filteredTopics.length + ' a agendar\n');

    // Build per-subject queues
    const queues = {};
    for (const t of filteredTopics) {
        if (!queues[t.s]) queues[t.s] = [];
        queues[t.s].push({ ...t });
    }
    for (const s of Object.keys(queues)) queues[s].sort((a, b) => a.p - b.p);

    const tasks = [];
    const START = new Date(2026, 1, 15);     // Feb 15, 2026 (today, Sunday)
    const CONTENT_END = new Date(2026, 7, 31); // Aug 31 — content deadline
    const SCHED_END = new Date(2026, 8, 30);   // Sep 30 — schedule end (reviews only in Sep)

    // Calculate weeks available for content
    const totalWeeks = Math.floor((CONTENT_END - START) / (7 * 86400000));

    // Calculate pace per subject
    const pace = {};
    for (const [subj, q] of Object.entries(queues)) {
        pace[subj] = q.length / totalWeeks;
    }

    console.log('📐 Ritmo (' + totalWeeks + ' semanas até Agosto):');
    for (const [s, r] of Object.entries(pace).sort((a, b) => b[1] - a[1])) {
        console.log('  ' + s.padEnd(24) + (r).toFixed(2) + '/semana  (' + queues[s].length + ' tópicos)');
    }

    // Track assigned count per subject
    const assigned = {};
    for (const s of Object.keys(queues)) assigned[s] = 0;

    // Collect all reviews to distribute in a second pass
    const allReviews = []; // [{date, s, t}]
    function schedReview(date, offset, subj, title) {
        // Find next valid study day from target date
        let target = addDays(date, offset);
        while ((BUDGET[target.getDay()] || 0) === 0) target = addDays(target, 1);
        if (target <= SCHED_END) {
            allReviews.push({ date: fmt(target), s: subj, t: 'Revisão D+' + offset + ': ' + title });
        }
    }

    // Track minutes used per day (to enforce budget)
    const dayUsage = {}; // dateStr -> minutes used
    function getUsed(dateStr) { return dayUsage[dateStr] || 0; }
    function addUsed(dateStr, min) { dayUsage[dateStr] = (dayUsage[dateStr] || 0) + min; }

    let sundayCount = 0;
    let weekNum = 0;
    let cur = new Date(START);

    // ═══ PASS 1: Content + Redação ═══
    while (cur <= SCHED_END) {
        const dow = cur.getDay();
        const dateStr = fmt(cur);
        const budget = BUDGET[dow] || 0;

        // Track week
        if (dow === 0) weekNum++;

        // Skip no-study days
        if (budget === 0) { cur = addDays(cur, 1); continue; }

        let usedMin = getUsed(dateStr);
        const dayTasks = [];

        // ── 1. Redação every 2 Sundays ──
        if (dow === 0) {
            sundayCount++;
            if (sundayCount % 2 === 0 && usedMin + DURATION.simulation <= budget) {
                dayTasks.push({
                    date: dateStr,
                    subject: 'Redação',
                    title: 'Produção Textual ENEM #' + (sundayCount / 2),
                    type: 'simulation',
                });
                usedMin += DURATION.simulation;
            }
        }

        // ── 3. New Content (only before content deadline) ──
        if (cur <= CONTENT_END) {
            const daySubjects = DAY_SUBJECTS[dow] || [];

            for (const subj of daySubjects) {
                const q = queues[subj];
                if (!q || q.length === 0) continue;

                // Pace check: should we assign a new topic this week?
                const expected = pace[subj] * weekNum;
                if (assigned[subj] >= Math.ceil(expected)) continue;

                // Check if we have budget for theory + fixation
                const neededMin = DURATION.class + DURATION.exercise; // 60 + 45 = 105min
                if (usedMin + DURATION.class > budget) continue; // at least theory must fit

                const topic = q.shift();
                assigned[subj]++;

                // Theory block
                dayTasks.push({
                    date: dateStr,
                    subject: topic.s,
                    title: topic.t,
                    type: topic.t.includes('Exercícios') ? 'exercise' : 'class',
                });
                usedMin += DURATION.class;

                // Fixation block (if budget allows)
                if (usedMin + DURATION.exercise <= budget) {
                    dayTasks.push({
                        date: dateStr,
                        subject: topic.s,
                        title: 'Fixação: ' + topic.t,
                        type: 'exercise',
                    });
                    usedMin += DURATION.exercise;
                }

                // Schedule spaced reviews
                schedReview(cur, 1, topic.s, topic.t);
                schedReview(cur, 7, topic.s, topic.t);
                schedReview(cur, 30, topic.s, topic.t);
            }

            // ── 4. If there's still budget, try to add extra topics from priority subjects ──
            const priorityOrder = ['Física', 'Matemática', 'Química', 'Biologia'];
            for (const subj of priorityOrder) {
                const q = queues[subj];
                if (!q || q.length === 0) continue;
                if (usedMin + DURATION.class > budget) break;

                // Allow up to 20% ahead of pace for priority subjects
                const expected = pace[subj] * weekNum * 1.2;
                if (assigned[subj] >= Math.ceil(expected)) continue;

                const topic = q.shift();
                assigned[subj]++;

                dayTasks.push({
                    date: dateStr,
                    subject: topic.s,
                    title: topic.t,
                    type: 'class',
                });
                usedMin += DURATION.class;

                if (usedMin + DURATION.exercise <= budget) {
                    dayTasks.push({
                        date: dateStr,
                        subject: topic.s,
                        title: 'Fixação: ' + topic.t,
                        type: 'exercise',
                    });
                    usedMin += DURATION.exercise;
                }

                schedReview(cur, 1, topic.s, topic.t);
                schedReview(cur, 7, topic.s, topic.t);
                schedReview(cur, 30, topic.s, topic.t);
            }
        }

        if (dayTasks.length > 0) {
            addUsed(dateStr, usedMin - getUsed(dateStr));
            tasks.push(...dayTasks);
        }

        cur = addDays(cur, 1);
    }

    // ═══ PASS 2: Distribute Reviews Respecting Budget ═══
    console.log('\n📝 Distribuindo ' + allReviews.length + ' revisões...');

    // Sort reviews by target date
    allReviews.sort((a, b) => a.date.localeCompare(b.date));

    let deferredCount = 0;
    for (const rev of allReviews) {
        let targetDate = rev.date;
        let attempts = 0;

        // Find a day where the review fits within budget
        while (attempts < 14) {
            const d = parseLocal(targetDate);
            const dow = d.getDay();
            const budget = BUDGET[dow] || 0;
            const used = getUsed(targetDate);

            if (budget > 0 && used + DURATION.review <= budget) {
                // It fits! Add it
                tasks.push({ date: targetDate, subject: rev.s, title: rev.t, type: 'review' });
                addUsed(targetDate, DURATION.review);
                if (targetDate !== rev.date) deferredCount++;
                break;
            }

            // Try next day
            targetDate = fmt(addDays(parseLocal(targetDate), 1));
            attempts++;

            // Don't go past schedule end
            if (parseLocal(targetDate) > SCHED_END) break;
        }
    }
    if (deferredCount > 0) console.log('  ↪️  ' + deferredCount + ' revisões movidas para próximo dia disponível');

    // Report leftover
    let allDone = true;
    for (const [subj, q] of Object.entries(queues)) {
        if (q.length > 0) {
            console.log('  ⚠️ ' + subj + ': ' + q.length + ' tópicos NÃO couberam');
            allDone = false;
        }
    }
    if (allDone) console.log('  ✅ Todos os tópicos agendados!');

    return tasks;
}

// ═══════════════════════════════════════════════════════════
//  VALIDATION: Check daily budget compliance
// ═══════════════════════════════════════════════════════════

function validateBudget(tasks) {
    const byDate = {};
    for (const t of tasks) {
        if (!byDate[t.date]) byDate[t.date] = [];
        byDate[t.date].push(t);
    }

    let violations = 0;
    for (const [dateStr, dayTasks] of Object.entries(byDate)) {
        const d = parseLocal(dateStr);
        const dow = d.getDay();
        const budget = BUDGET[dow] || 0;
        const totalMin = dayTasks.reduce((sum, t) => sum + (DURATION[t.type] || 60), 0);

        if (totalMin > budget + 10) { // 10min tolerance
            violations++;
            if (violations <= 5) {
                console.log('  ⚠️ ' + dateStr + ' (' + ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dow] + '): ' +
                    totalMin + '/' + budget + 'min — ' + dayTasks.length + ' tarefas');
            }
        }
    }
    if (violations > 5) console.log('  ... e mais ' + (violations - 5) + ' violações');
    if (violations === 0) console.log('  ✅ Nenhuma violação de budget!');
    return violations;
}

// ═══════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  CRONOGRAMA ENZO MARTINS — Medicina UEPA');
    console.log('  user_id: ' + ENZO_ID);
    console.log('  Início: 15/02/2026 (hoje)');
    console.log('═══════════════════════════════════════════════\n');

    // 1. Fetch completed topics
    const completedTitles = await fetchCompletedTopics();

    // 2. Generate
    const tasks = generate(completedTitles);
    console.log('\n📅 ' + tasks.length + ' tarefas geradas\n');

    // 3. Stats
    const bySubject = {}, byType = {}, byMonth = {};
    for (const t of tasks) {
        bySubject[t.subject] = (bySubject[t.subject] || 0) + 1;
        byType[t.type] = (byType[t.type] || 0) + 1;
        byMonth[t.date.slice(0, 7)] = (byMonth[t.date.slice(0, 7)] || 0) + 1;
    }

    console.log('📊 Por matéria:');
    for (const [s, c] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) {
        const bar = '█'.repeat(Math.min(Math.round(c / 3), 35));
        console.log('  ' + s.padEnd(24) + String(c).padStart(4) + ' blocos  ' + bar);
    }

    console.log('\n📋 Por tipo:');
    for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
        console.log('  ' + t.padEnd(14) + c);
    }

    console.log('\n📆 Por mês:');
    for (const [m, c] of Object.entries(byMonth).sort()) {
        console.log('  ' + m + ': ' + c + ' blocos');
    }

    // 4. Validate budget
    console.log('\n🔒 Verificação de budget diário:');
    validateBudget(tasks);

    // 5. Clean old IA tasks (preserve completed ones!)
    console.log('\n🗑️  Limpando tarefas IA NÃO concluídas...');
    const { error: delErr, count } = await supabase
        .from('schedule_tasks')
        .delete()
        .eq('user_id', ENZO_ID)
        .eq('is_ia_generated', true)
        .eq('completed', false); // ONLY delete non-completed tasks

    if (delErr) console.error('  ⚠️', delErr.message);
    else console.log('  ✅ Tarefas não-concluídas removidas');

    // Also clean completed tasks for dates in the past
    // (they served their purpose, and we don't want duplicates)
    const today = fmt(new Date());

    // 6. Insert new schedule
    const rows = tasks.map(t => ({
        user_id: ENZO_ID,
        date: t.date,
        subject: t.subject,
        title: t.title,
        type: t.type,
        completed: false,
        is_ia_generated: true,
    }));

    console.log('\n📝 Inserindo ' + rows.length + ' tarefas...');
    const BATCH = 200;
    let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
        const chunk = rows.slice(i, i + BATCH);
        const { error } = await supabase.from('schedule_tasks').insert(chunk);
        if (error) {
            console.error('  ❌ Batch ' + (Math.floor(i / BATCH) + 1) + ':', error.message);
            console.error('     Detalhe:', error.details || error.hint || '');
            break;
        }
        inserted += chunk.length;
        console.log('  ✅ ' + inserted + '/' + rows.length);
    }

    console.log('\n🎉 ' + inserted + ' tarefas inseridas para Enzo Martins!');
    console.log('   Tarefas concluídas anteriormente: preservadas ✅');
    console.log('   O cronograma começa hoje, 15/02/2026.');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
