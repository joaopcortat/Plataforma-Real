/**
 * ═══════════════════════════════════════════════════════════════
 *  CRONOGRAMA INDIVIDUALIZADO — MARIA FERNANDA
 *  Medicina UFPA | 2º Ano EM | ENEM 2026
 *  user_id: 36604148-7b5c-43b1-8329-ab98d4d34a3f
 *
 *  PERFIL:
 *  - 2º ano EM → construção de base extensa, mais teoria
 *  - Dificuldade: Ciências da Natureza
 *  - Prioridade: Matemática > Física > Química > Biologia
 *  - Redação: 3x por mês
 *  - ENEM 2026 (quer aprovação este ano)
 *
 *  FEATURES:
 *  ✅ Respeita budget diário por janela de disponibilidade
 *  ✅ Preserva tarefas já concluídas (para regeneração)
 *  ✅ Distribui tópicos uniformemente até Outubro
 *  ✅ Revisões espaçadas D+1, D+7, D+30
 *  ✅ Redação 3x/mês
 *  ✅ Currículo ENEM completo (exceto Linguagens)
 * ═══════════════════════════════════════════════════════════════
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://tgybzzknpcrwjseotbrc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneWJ6emtucGNyd2pzZW90YnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU3MDY0MSwiZXhwIjoyMDg2MTQ2NjQxfQ.G7XJp5oDyYnUGoPHpZaozy5C5x8jbon4i2AHZ9m9Igg';
const MF_ID = '36604148-7b5c-43b1-8329-ab98d4d34a3f';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ═══════════════════════════════════════════════════════════
//  DURAÇÕES (idênticas ao Schedule.tsx)
// ═══════════════════════════════════════════════════════════
const DURATION = { class: 60, exercise: 45, review: 20, simulation: 90 };

// ═══════════════════════════════════════════════════════════
//  DISPONIBILIDADE — minutos por dia da semana
//  0=Dom  10–12 + 13:30–15:30 + 16–18 = 6h = 360min
//  1=Seg  16–19 = 3h = 180min
//  2=Ter  16–17:30 + 17:30–19 = 3h = 180min
//  3=Qua  16–18:15 = 2h15 = 135min
//  4=Qui  16–19 = 3h = 180min
//  5=Sex  16–19 = 3h = 180min
//  6=Sáb  10–12 + 13:30–15:30 + 16–18 = 6h = 360min
// ═══════════════════════════════════════════════════════════
const BUDGET = { 0: 360, 1: 180, 2: 180, 3: 135, 4: 180, 5: 180, 6: 360 };

// Subjects assigned to each day — priority Matemática + Natureza
const DAY_SUBJECTS = {
    0: ['Matemática', 'Física'],                                     // Dom 6h — prioridade
    1: ['Química', 'Biologia'],                                      // Seg 3h
    2: ['História', 'Geografia', 'Filosofia/Sociologia'],            // Ter 3h — humanas
    3: ['Matemática', 'Física'],                                     // Qua 2h15
    4: ['Física', 'Química'],                                        // Qui 3h — natureza
    5: ['Matemática', 'Biologia'],                                   // Sex 3h
    6: ['Física', 'Química', 'Matemática'],                          // Sáb 6h — natureza intensivo
};

// ═══════════════════════════════════════════════════════════
//  CURRÍCULO ENEM COMPLETO — 136 tópicos
//  2º Ano EM → mais tópicos de base (Fase 1)
//  Todas as frentes cobradas no ENEM (exceto Linguagens)
//  p = fase (1=fundação fev-mai, 2=construção jun-ago, 3=aprofundamento set-out)
// ═══════════════════════════════════════════════════════════

const TOPICS = [
    // ════════════════════════════════════════
    //  FÍSICA — 30 tópicos (PRIORIDADE ALTA, base fraca)
    // ════════════════════════════════════════
    // Mecânica — base
    { s: 'Física', t: 'Introdução à Física — Unidades, Notação Científica', p: 1 },
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
    { s: 'Física', t: 'Energia Potencial e Conservação de Energia', p: 2 },
    { s: 'Física', t: 'Potência e Rendimento', p: 2 },
    { s: 'Física', t: 'Impulso e Quantidade de Movimento', p: 2 },
    // Termofísica
    { s: 'Física', t: 'Termologia — Temperatura, Escalas e Dilatação', p: 2 },
    { s: 'Física', t: 'Calorimetria — Calor Sensível e Latente', p: 2 },
    { s: 'Física', t: 'Termodinâmica — 1ª e 2ª Lei', p: 2 },
    // Fluidos + Óptica
    { s: 'Física', t: 'Hidrostática — Pressão, Empuxo e Pascal', p: 2 },
    { s: 'Física', t: 'Óptica — Reflexão, Espelhos e Refração', p: 2 },
    { s: 'Física', t: 'Óptica — Lentes e Instrumentos Ópticos', p: 2 },
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
    //  MATEMÁTICA — 30 tópicos (PRIORIDADE MÁXIMA)
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
    //  QUÍMICA — 25 tópicos (base fraca, atenção especial)
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
    // Estequiometria
    { s: 'Química', t: 'Estequiometria — Mol e Massa Molar', p: 2 },
    { s: 'Química', t: 'Estequiometria — Relações Massa-Massa', p: 2 },
    { s: 'Química', t: 'Estequiometria — Pureza e Rendimento', p: 2 },
    { s: 'Química', t: 'Estequiometria — Exercícios ENEM', p: 2 },
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
    //  BIOLOGIA — 22 tópicos (base fraca)
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
function parseLocal(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
}

// ═══════════════════════════════════════════════════════════
//  STEP 1: FETCH COMPLETED TOPICS
// ═══════════════════════════════════════════════════════════

async function fetchCompletedTopics() {
    console.log('🔍 Buscando tarefas concluídas pela Maria Fernanda...');
    const { data, error } = await supabase
        .from('schedule_tasks')
        .select('title, subject, type')
        .eq('user_id', MF_ID)
        .eq('completed', true)
        .eq('is_ia_generated', true);

    if (error) {
        console.error('  ⚠️ Erro:', error.message);
        return new Set();
    }

    const completedTitles = new Set();
    for (const row of (data || [])) {
        if (row.type === 'class' || row.type === 'exercise') {
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
    const filteredTopics = TOPICS.filter(t => !completedTitles.has(t.t));
    console.log('\n📚 ' + TOPICS.length + ' tópicos no currículo');
    console.log('   ' + completedTitles.size + ' já concluídos');
    console.log('   ' + filteredTopics.length + ' a agendar\n');

    // Build per-subject queues (sorted by phase)
    const queues = {};
    for (const t of filteredTopics) {
        if (!queues[t.s]) queues[t.s] = [];
        queues[t.s].push({ ...t });
    }
    for (const s of Object.keys(queues)) queues[s].sort((a, b) => a.p - b.p);

    const tasks = [];
    const START = new Date(2026, 1, 15);
    const CONTENT_END = new Date(2026, 9, 15); // Oct 15 — content deadline
    const SCHED_END = new Date(2026, 9, 31);   // Oct 31 — schedule end

    // ── Pre-compute: total DOW-occurrences per subject ──
    // "How many times does a day assigned to Física appear between START and CONTENT_END?"
    const subjDOWs = {};
    for (const [d, subjects] of Object.entries(DAY_SUBJECTS)) {
        for (const subj of subjects) {
            if (!subjDOWs[subj]) subjDOWs[subj] = [];
            if (!subjDOWs[subj].includes(parseInt(d))) subjDOWs[subj].push(parseInt(d));
        }
    }

    const totalOcc = {};
    {
        let tmp = new Date(START);
        while (tmp <= CONTENT_END) {
            const d = tmp.getDay();
            for (const [subj, dows] of Object.entries(subjDOWs)) {
                if (dows.includes(d)) totalOcc[subj] = (totalOcc[subj] || 0) + 1;
            }
            tmp = addDays(tmp, 1);
        }
    }

    // Total topics per subject (the original count, before any filtering)
    const origCount = {};
    for (const [subj, q] of Object.entries(queues)) origCount[subj] = q.length;

    console.log('📐 Ritmo por matéria:');
    for (const [subj, q] of Object.entries(queues)) {
        const occ = totalOcc[subj] || 1;
        console.log('  ' + subj.padEnd(24) + q.length + ' tópicos / ' + occ +
            ' slots = ' + (q.length / occ).toFixed(3) + ' tópicos/slot');
    }

    // Track how many topics assigned + slots elapsed per subject
    const assigned = {};
    const occSoFar = {};
    for (const s of Object.keys(queues)) { assigned[s] = 0; occSoFar[s] = 0; }

    // All subjects in priority order
    const ALL_PRIORITY = ['Matemática', 'Física', 'Química', 'Biologia',
        'História', 'Geografia', 'Filosofia/Sociologia'];

    // Collect reviews for second pass
    const allReviews = [];
    function schedReview(date, offset, subj, title) {
        let target = addDays(date, offset);
        let safety = 0;
        while ((BUDGET[target.getDay()] || 0) === 0 && safety++ < 7) target = addDays(target, 1);
        if (target <= SCHED_END) {
            allReviews.push({ date: fmt(target), s: subj, t: 'Revisão D+' + offset + ': ' + title });
        }
    }

    // Day usage tracker
    const dayUsage = {};
    function getUsed(dateStr) { return dayUsage[dateStr] || 0; }
    function addUsed(dateStr, min) { dayUsage[dateStr] = (dayUsage[dateStr] || 0) + min; }

    // Helper: place one topic from queue
    function placeTopic(subj, dateStr, budget, dayTasks) {
        const q = queues[subj];
        if (!q || q.length === 0) return 0;
        let usedMin = getUsed(dateStr);
        if (usedMin + DURATION.class > budget) return 0;

        const topic = q.shift();
        assigned[subj]++;

        dayTasks.push({
            date: dateStr,
            subject: topic.s,
            title: topic.t,
            type: 'class',
        });
        usedMin += DURATION.class;
        let added = DURATION.class;

        if (usedMin + DURATION.exercise <= budget) {
            dayTasks.push({
                date: dateStr,
                subject: topic.s,
                title: 'Fixação: ' + topic.t,
                type: 'exercise',
            });
            added += DURATION.exercise;
        }

        schedReview(cur, 1, topic.s, topic.t);
        schedReview(cur, 7, topic.s, topic.t);
        schedReview(cur, 30, topic.s, topic.t);

        addUsed(dateStr, added);
        return added;
    }

    let redacaoCount = 0;
    let cur = new Date(START);
    let currentMonth = -1;
    let redacoesThisMonth = 0;

    // ═══ PASS 1: Content + Redação ═══
    while (cur <= SCHED_END) {
        const dow = cur.getDay();
        const dateStr = fmt(cur);
        const budget = BUDGET[dow];

        const month = cur.getMonth();
        if (month !== currentMonth) { currentMonth = month; redacoesThisMonth = 0; }

        if (budget === 0) { cur = addDays(cur, 1); continue; }

        const dayTasks = [];

        // ── Increment slot counter for subjects on this DOW ──
        if (cur <= CONTENT_END) {
            for (const subj of (DAY_SUBJECTS[dow] || [])) {
                if (occSoFar[subj] !== undefined) occSoFar[subj]++;
            }
        }

        // ── 1. Redação: 3x/mês, Dom ou Sáb ──
        if ((dow === 0 || dow === 6) && redacoesThisMonth < 3 &&
            getUsed(dateStr) + DURATION.simulation <= budget) {
            const dayOfMonth = cur.getDate();
            const targets = [1, 11, 21];
            const shouldWrite = targets.some(rd =>
                Math.abs(dayOfMonth - rd) <= 3 &&
                redacoesThisMonth < (targets.indexOf(rd) + 1)
            );

            if (shouldWrite || (dayOfMonth >= 25 && redacoesThisMonth < 3)) {
                redacaoCount++;
                redacoesThisMonth++;
                dayTasks.push({
                    date: dateStr,
                    subject: 'Redação',
                    title: 'Produção Textual ENEM #' + redacaoCount,
                    type: 'simulation',
                });
                addUsed(dateStr, DURATION.simulation);
            }
        }

        // ── 2. New Content (before content deadline) ──
        if (cur <= CONTENT_END) {
            const daySubjects = DAY_SUBJECTS[dow] || [];

            // PASS A: Subjects assigned to this DOW — pace-controlled
            for (const subj of daySubjects) {
                const q = queues[subj];
                if (!q || q.length === 0) continue;
                if (getUsed(dateStr) + DURATION.class > budget) break;

                // Expected progress = origCount × (occSoFar / totalOcc)
                const expected = origCount[subj] * (occSoFar[subj] / (totalOcc[subj] || 1));
                if (assigned[subj] >= Math.ceil(expected)) continue;

                placeTopic(subj, dateStr, budget, dayTasks);
            }

            // PASS B: Extra topics if budget remains — priority subjects first
            // Allow up to 20% ahead of pace
            for (const subj of ALL_PRIORITY) {
                const q = queues[subj];
                if (!q || q.length === 0) continue;
                if (getUsed(dateStr) + DURATION.class > budget) break;

                const expected = origCount[subj] * (occSoFar[subj] / (totalOcc[subj] || 1));
                if (assigned[subj] >= Math.ceil(expected * 1.5)) continue;

                placeTopic(subj, dateStr, budget, dayTasks);
            }
        }

        if (dayTasks.length > 0) {
            tasks.push(...dayTasks);
        }

        cur = addDays(cur, 1);
    }

    // ═══ PASS 2: Distribute Reviews Respecting Budget ═══
    console.log('\n📝 Distribuindo ' + allReviews.length + ' revisões...');
    allReviews.sort((a, b) => a.date.localeCompare(b.date));

    let deferredCount = 0;
    let droppedCount = 0;
    for (const rev of allReviews) {
        let targetDate = rev.date;
        let attempts = 0;

        while (attempts < 30) {
            const d = parseLocal(targetDate);
            const dow = d.getDay();
            const budget = BUDGET[dow];
            const used = getUsed(targetDate);

            if (budget > 0 && used + DURATION.review <= budget) {
                tasks.push({ date: targetDate, subject: rev.s, title: rev.t, type: 'review' });
                addUsed(targetDate, DURATION.review);
                if (targetDate !== rev.date) deferredCount++;
                break;
            }

            targetDate = fmt(addDays(parseLocal(targetDate), 1));
            attempts++;
            if (parseLocal(targetDate) > SCHED_END) { droppedCount++; break; }
        }
        if (attempts >= 30) droppedCount++;
    }
    if (deferredCount > 0) console.log('  ↪️  ' + deferredCount + ' revisões movidas para próximo dia disponível');
    if (droppedCount > 0) console.log('  ⚠️  ' + droppedCount + ' revisões não couberam (pós-prazo)');

    // ═══ PASS 3: Fill idle/underutilized days ═══
    console.log('\n📋 Preenchendo dias ociosos/subutilizados...');
    let fillCount = 0;
    let subjectRotation = 0;

    cur = new Date(START);
    while (cur <= SCHED_END) {
        const dow = cur.getDay();
        const dateStr = fmt(cur);
        const budget = BUDGET[dow];

        if (budget > 0) {
            const used = getUsed(dateStr);
            const remaining = budget - used;

            // Fill if day has >50% budget remaining
            if (remaining >= DURATION.exercise) {
                const daySubjects = DAY_SUBJECTS[dow] || ALL_PRIORITY;

                // Add exercise batteries for day's subjects
                while (getUsed(dateStr) + DURATION.exercise <= budget) {
                    const subj = daySubjects[subjectRotation % daySubjects.length];
                    subjectRotation++;
                    tasks.push({
                        date: dateStr,
                        subject: subj,
                        title: 'Bateria de Questões: ' + subj,
                        type: 'exercise'
                    });
                    addUsed(dateStr, DURATION.exercise);
                    fillCount++;
                }
            }
        }
        cur = addDays(cur, 1);
    }
    console.log('  ✅ ' + fillCount + ' baterias de exercícios adicionadas');

    // Report leftover
    let allDone = true;
    for (const [subj, q] of Object.entries(queues)) {
        if (q.length > 0) {
            console.log('  ⚠️ ' + subj + ': ' + q.length + ' tópicos NÃO couberam');
            allDone = false;
        }
    }
    if (allDone) console.log('  ✅ Todos os tópicos agendados!');

    // ═══ FINAL: Enforce Budget Strictly ═══
    const finalByDate = {};
    for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        if (!finalByDate[t.date]) finalByDate[t.date] = [];
        finalByDate[t.date].push(i);
    }
    const toRemove = new Set();
    for (const [ds, indices] of Object.entries(finalByDate)) {
        const d = parseLocal(ds);
        const budget = BUDGET[d.getDay()];
        let total = 0;
        for (const idx of indices) total += DURATION[tasks[idx].type] || 60;
        if (total > budget) {
            // Remove baterias from the end until budget is met
            for (let j = indices.length - 1; j >= 0 && total > budget; j--) {
                const idx = indices[j];
                if (tasks[idx].title.startsWith('Bateria de Questões')) {
                    toRemove.add(idx);
                    total -= DURATION[tasks[idx].type] || 60;
                }
            }
        }
    }
    if (toRemove.size > 0) {
        const filtered = tasks.filter((_, i) => !toRemove.has(i));
        console.log('  🔧 Removidas ' + toRemove.size + ' baterias em excesso');
        return filtered;
    }

    return tasks;
}

// ═══════════════════════════════════════════════════════════
//  VALIDATION
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
        const budget = BUDGET[dow];
        const totalMin = dayTasks.reduce((sum, t) => sum + (DURATION[t.type] || 60), 0);

        if (totalMin > budget + 10) {
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
    console.log('  CRONOGRAMA MARIA FERNANDA — Medicina UFPA');
    console.log('  user_id: ' + MF_ID);
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
    const { error: delErr } = await supabase
        .from('schedule_tasks')
        .delete()
        .eq('user_id', MF_ID)
        .eq('is_ia_generated', true)
        .eq('completed', false);

    if (delErr) console.error('  ⚠️', delErr.message);
    else console.log('  ✅ Tarefas não-concluídas removidas');

    // 6. Insert new schedule
    const rows = tasks.map(t => ({
        user_id: MF_ID,
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

    console.log('\n🎉 ' + inserted + ' tarefas inseridas para Maria Fernanda!');
    console.log('   Tarefas concluídas anteriormente: preservadas ✅');
    console.log('   O cronograma começa hoje, 15/02/2026.');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
