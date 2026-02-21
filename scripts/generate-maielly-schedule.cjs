/**
 * CRONOGRAMA INDIVIDUALIZADO — MAIELLY
 * Medicina UFMA | EM Completo | ENEM 2026
 * user_id: 6a0bf649-50ec-4756-8443-959db9128107
 *
 * ✅ Inclui Linguagens (dificuldade da aluna)
 * ✅ Revisão D+7 APENAS para tópicos p=1
 * ✅ Revisão geral mensal por matéria (45min)
 * ✅ Bateria ENEM extra por matéria (mais exercícios)
 * ✅ Redação 1x/semana
 * ✅ Mentoria Ter 19-20 (budget reduzido)
 * ✅ Currículo ENEM completo + Linguagens
 */

const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://tgybzzknpcrwjseotbrc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRneWJ6emtucGNyd2pzZW90YnJjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDU3MDY0MSwiZXhwIjoyMDg2MTQ2NjQxfQ.G7XJp5oDyYnUGoPHpZaozy5C5x8jbon4i2AHZ9m9Igg';
const USER_ID = '6a0bf649-50ec-4756-8443-959db9128107';
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const DURATION = { class: 60, exercise: 45, review: 20, simulation: 90 };

// Budget: Dom/Sáb 6h15, Seg/Qua-Sex 3h30, Ter 2h30 (mentoria 19-20)
const BUDGET = { 0: 375, 1: 210, 2: 150, 3: 210, 4: 210, 5: 210, 6: 375 };

const DAY_SUBJECTS = {
    0: ['Matemática', 'Física'],                          // Dom 6h15
    1: ['Química', 'Biologia'],                           // Seg 3h30
    2: ['Linguagens', 'História'],                        // Ter 2h30
    3: ['Matemática', 'Física'],                          // Qua 3h30
    4: ['Química', 'Biologia', 'Linguagens'],             // Qui 3h30
    5: ['Geografia', 'Filosofia/Sociologia', 'Linguagens'], // Sex 3h30
    6: ['Matemática', 'Física', 'História'],              // Sáb 6h15
};

const TOPICS = [
    // FÍSICA — 30
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
    { s: 'Física', t: 'Trabalho e Energia Cinética', p: 2 },
    { s: 'Física', t: 'Energia Potencial e Conservação de Energia', p: 2 },
    { s: 'Física', t: 'Potência e Rendimento', p: 2 },
    { s: 'Física', t: 'Impulso e Quantidade de Movimento', p: 2 },
    { s: 'Física', t: 'Termologia — Temperatura, Escalas e Dilatação', p: 2 },
    { s: 'Física', t: 'Calorimetria — Calor Sensível e Latente', p: 2 },
    { s: 'Física', t: 'Termodinâmica — 1ª e 2ª Lei', p: 2 },
    { s: 'Física', t: 'Hidrostática — Pressão, Empuxo e Pascal', p: 2 },
    { s: 'Física', t: 'Óptica — Reflexão, Espelhos e Refração', p: 2 },
    { s: 'Física', t: 'Óptica — Lentes e Instrumentos Ópticos', p: 2 },
    { s: 'Física', t: 'Ondulatória — Tipos, Propriedades e Fenômenos', p: 3 },
    { s: 'Física', t: 'Acústica — Som, Ressonância e Efeito Doppler', p: 3 },
    { s: 'Física', t: 'Eletrostática — Carga, Campo e Potencial', p: 3 },
    { s: 'Física', t: 'Eletrodinâmica — Corrente, Resistência e Ohm', p: 3 },
    { s: 'Física', t: 'Circuitos — Série, Paralelo e Potência Elétrica', p: 3 },
    { s: 'Física', t: 'Eletromagnetismo — Campo Magnético e Lorentz', p: 3 },
    { s: 'Física', t: 'Indução Eletromagnética e Lei de Faraday', p: 3 },
    { s: 'Física', t: 'Física Moderna — Efeito Fotoelétrico e Dualidade', p: 3 },
    { s: 'Física', t: 'Radioatividade — Tipos de Emissão e Meia-Vida', p: 3 },

    // MATEMÁTICA — 30
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
    { s: 'Matemática', t: 'Funções — Conceito, Domínio e Imagem', p: 2 },
    { s: 'Matemática', t: 'Função Afim — Gráficos e Raízes', p: 2 },
    { s: 'Matemática', t: 'Função Quadrática — Vértice e Análise', p: 2 },
    { s: 'Matemática', t: 'Função Exponencial e Aplicações', p: 2 },
    { s: 'Matemática', t: 'Logaritmos — Propriedades e Equações', p: 2 },
    { s: 'Matemática', t: 'Geom. Plana — Triângulos, Tales e Pitágoras', p: 2 },
    { s: 'Matemática', t: 'Geom. Plana — Áreas de Figuras Planas', p: 2 },
    { s: 'Matemática', t: 'Geom. Plana — Circunferência e Polígonos', p: 2 },
    { s: 'Matemática', t: 'Geom. Espacial — Prismas e Cilindros', p: 2 },
    { s: 'Matemática', t: 'Geom. Espacial — Pirâmide, Cone e Esfera', p: 2 },
    { s: 'Matemática', t: 'Geom. Analítica — Ponto, Reta e Circunferência', p: 2 },
    { s: 'Matemática', t: 'Análise Combinatória — PFC, Arranjo e Combinação', p: 3 },
    { s: 'Matemática', t: 'Probabilidade — Problemas ENEM', p: 3 },
    { s: 'Matemática', t: 'Trigonometria — Razões no Triângulo Retângulo', p: 3 },
    { s: 'Matemática', t: 'Trigonometria — Ciclo Trigonométrico e Funções', p: 3 },
    { s: 'Matemática', t: 'PA — Termo Geral e Soma', p: 3 },
    { s: 'Matemática', t: 'PG — Termo Geral e Soma', p: 3 },
    { s: 'Matemática', t: 'Matrizes e Determinantes', p: 3 },
    { s: 'Matemática', t: 'Sistemas Lineares — Escalonamento e Cramer', p: 3 },

    // QUÍMICA — 25
    { s: 'Química', t: 'Propriedades da Matéria e Separação de Misturas', p: 1 },
    { s: 'Química', t: 'Modelos Atômicos e Estrutura do Átomo', p: 1 },
    { s: 'Química', t: 'Tabela Periódica — Propriedades Periódicas', p: 1 },
    { s: 'Química', t: 'Ligações Químicas — Iônica, Covalente e Metálica', p: 1 },
    { s: 'Química', t: 'Polaridade e Forças Intermoleculares', p: 1 },
    { s: 'Química', t: 'Funções Inorgânicas — Ácidos e Bases', p: 1 },
    { s: 'Química', t: 'Funções Inorgânicas — Sais e Óxidos', p: 1 },
    { s: 'Química', t: 'Reações Inorgânicas e Balanceamento', p: 1 },
    { s: 'Química', t: 'Estequiometria — Mol e Massa Molar', p: 2 },
    { s: 'Química', t: 'Estequiometria — Relações Massa-Massa', p: 2 },
    { s: 'Química', t: 'Estequiometria — Pureza e Rendimento', p: 2 },
    { s: 'Química', t: 'Estequiometria — Exercícios ENEM', p: 2 },
    { s: 'Química', t: 'Soluções — Concentração e Diluição', p: 2 },
    { s: 'Química', t: 'Termoquímica — Entalpia e Lei de Hess', p: 2 },
    { s: 'Química', t: 'Cinética Química — Velocidade e Fatores', p: 2 },
    { s: 'Química', t: 'Equilíbrio Químico — Kc, Kp e Le Chatelier', p: 3 },
    { s: 'Química', t: 'pH e pOH — Cálculos e Indicadores', p: 3 },
    { s: 'Química', t: 'Eletroquímica — Pilhas e Eletrólise', p: 3 },
    { s: 'Química', t: 'Orgânica — Cadeias Carbônicas e Classificação', p: 2 },
    { s: 'Química', t: 'Orgânica — Funções I (HC, Álcoois, Fenóis)', p: 2 },
    { s: 'Química', t: 'Orgânica — Funções II (Aldeídos, Cetonas, Ésteres)', p: 3 },
    { s: 'Química', t: 'Isomeria — Plana e Óptica', p: 3 },
    { s: 'Química', t: 'Reações Orgânicas — Adição, Substituição', p: 3 },
    { s: 'Química', t: 'Radioatividade e Química Ambiental', p: 3 },
    { s: 'Química', t: 'Polímeros e Bioquímica Básica', p: 3 },

    // BIOLOGIA — 22
    { s: 'Biologia', t: 'Ecologia — Cadeias Alimentares e Teias', p: 1 },
    { s: 'Biologia', t: 'Ecologia — Ciclos Biogeoquímicos', p: 1 },
    { s: 'Biologia', t: 'Ecologia — Relações Ecológicas e Sucessão', p: 1 },
    { s: 'Biologia', t: 'Impactos Ambientais e Sustentabilidade', p: 1 },
    { s: 'Biologia', t: 'Citologia — Célula Eucarionte vs Procarionte', p: 1 },
    { s: 'Biologia', t: 'Citologia — Organelas e Membrana', p: 1 },
    { s: 'Biologia', t: 'Bioenergética — Fotossíntese', p: 1 },
    { s: 'Biologia', t: 'Bioenergética — Respiração e Fermentação', p: 1 },
    { s: 'Biologia', t: 'Divisão Celular — Mitose e Meiose', p: 2 },
    { s: 'Biologia', t: 'Genética — 1ª Lei de Mendel', p: 2 },
    { s: 'Biologia', t: 'Genética — 2ª Lei e Herança Ligada ao Sexo', p: 2 },
    { s: 'Biologia', t: 'Genética — Grupos Sanguíneos (ABO e Rh)', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Digestório e Respiratório', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Circulatório e Excretor', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Nervoso e Endócrino', p: 2 },
    { s: 'Biologia', t: 'Fisiologia — Sistema Imunológico e Vacinas', p: 2 },
    { s: 'Biologia', t: 'Evolução — Darwinismo, Neodarwinismo e Evidências', p: 3 },
    { s: 'Biologia', t: 'Biotecnologia — DNA Recombinante e Transgênicos', p: 3 },
    { s: 'Biologia', t: 'Botânica — Fisiologia Vegetal e Hormônios', p: 3 },
    { s: 'Biologia', t: 'Zoologia — Classificação e Principais Filos', p: 3 },
    { s: 'Biologia', t: 'Microbiologia — Vírus, Bactérias e Protozoários', p: 3 },
    { s: 'Biologia', t: 'Parasitologia — Doenças e Profilaxia', p: 3 },

    // HISTÓRIA — 12
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

    // GEOGRAFIA — 11
    { s: 'Geografia', t: 'Geopolítica — Globalização e Blocos Econômicos', p: 1 },
    { s: 'Geografia', t: 'Urbanização — Problemas Urbanos e Metropolização', p: 1 },
    { s: 'Geografia', t: 'Cartografia — Escalas, Projeções e Fusos', p: 1 },
    { s: 'Geografia', t: 'Geografia Agrária — Estrutura Fundiária e Agronegócio', p: 2 },
    { s: 'Geografia', t: 'Meio Ambiente — Biomas Brasileiros e Desmatamento', p: 2 },
    { s: 'Geografia', t: 'Climatologia — Tipos Climáticos e Fenômenos', p: 2 },
    { s: 'Geografia', t: 'Geomorfologia — Relevo, Solos e Intemperismo', p: 2 },
    { s: 'Geografia', t: 'Demografia — Teorias Populacionais e Pirâmides', p: 3 },
    { s: 'Geografia', t: 'Hidrografia — Bacias e Recursos Hídricos', p: 3 },
    { s: 'Geografia', t: 'Industrialização e Matriz Energética', p: 3 },
    { s: 'Geografia', t: 'Migrações e Conflitos Territoriais', p: 3 },

    // FILOSOFIA/SOCIOLOGIA — 6
    { s: 'Filosofia/Sociologia', t: 'Filosofia Clássica — Sócrates, Platão, Aristóteles', p: 2 },
    { s: 'Filosofia/Sociologia', t: 'Filosofia Política — Contratualismo', p: 2 },
    { s: 'Filosofia/Sociologia', t: 'Ética e Filosofia Contemporânea', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Sociologia — Durkheim, Weber e Marx', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Cidadania, Direitos Humanos e Movimentos Sociais', p: 3 },
    { s: 'Filosofia/Sociologia', t: 'Cultura de Massa, Indústria Cultural e Ideologia', p: 3 },

    // LINGUAGENS — 12 (diferencial da Maielly)
    { s: 'Linguagens', t: 'Interpretação de Texto — Estratégias de Leitura', p: 1 },
    { s: 'Linguagens', t: 'Gêneros Textuais — Identificação e Características', p: 1 },
    { s: 'Linguagens', t: 'Variação Linguística — Norma Culta e Coloquial', p: 1 },
    { s: 'Linguagens', t: 'Funções da Linguagem — Jakobson', p: 1 },
    { s: 'Linguagens', t: 'Gramática — Classes de Palavras e Sintaxe', p: 2 },
    { s: 'Linguagens', t: 'Gramática — Concordância e Regência', p: 2 },
    { s: 'Linguagens', t: 'Gramática — Pontuação e Crase', p: 2 },
    { s: 'Linguagens', t: 'Literatura — Quinhentismo ao Romantismo', p: 2 },
    { s: 'Linguagens', t: 'Literatura — Realismo ao Modernismo', p: 2 },
    { s: 'Linguagens', t: 'Literatura — Modernismo e Contemporâneos', p: 3 },
    { s: 'Linguagens', t: 'Figuras de Linguagem e Recursos Estilísticos', p: 3 },
    { s: 'Linguagens', t: 'Intertextualidade e Argumentação', p: 3 },
];

// ═══ HELPERS ═══
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function parseLocal(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }

// ═══ FETCH COMPLETED ═══
async function fetchCompletedTopics() {
    console.log('🔍 Buscando tarefas concluídas...');
    const { data, error } = await supabase.from('schedule_tasks')
        .select('title, type').eq('user_id', USER_ID).eq('completed', true).eq('is_ia_generated', true);
    if (error) { console.error('  ⚠️', error.message); return new Set(); }
    const set = new Set();
    for (const row of (data || [])) {
        if (row.type === 'class' || row.type === 'exercise') set.add(row.title.replace(/^Fixação:\s*/, ''));
    }
    console.log(set.size > 0 ? '  ✅ ' + set.size + ' tópicos concluídos' : '  ℹ️  Nenhum tópico concluído');
    return set;
}

// ═══ GENERATE ═══
function generate(completedTitles) {
    const filteredTopics = TOPICS.filter(t => !completedTitles.has(t.t));
    console.log('\n📚 ' + TOPICS.length + ' tópicos (' + filteredTopics.length + ' a agendar)\n');

    const queues = {};
    for (const t of filteredTopics) { if (!queues[t.s]) queues[t.s] = []; queues[t.s].push({ ...t }); }
    for (const s of Object.keys(queues)) queues[s].sort((a, b) => a.p - b.p);

    const tasks = [];
    const START = new Date(2026, 1, 18);      // Feb 18
    const CONTENT_END = new Date(2026, 9, 15); // Oct 15
    const SCHED_END = new Date(2026, 9, 31);   // Oct 31

    // Pre-compute DOW-occurrence slots per subject
    const subjDOWs = {};
    for (const [d, subjects] of Object.entries(DAY_SUBJECTS)) {
        for (const subj of subjects) {
            if (!subjDOWs[subj]) subjDOWs[subj] = [];
            if (!subjDOWs[subj].includes(parseInt(d))) subjDOWs[subj].push(parseInt(d));
        }
    }
    const totalOcc = {};
    {
        let tmp = new Date(START); while (tmp <= CONTENT_END) {
            const d = tmp.getDay();
            for (const [subj, dows] of Object.entries(subjDOWs)) { if (dows.includes(d)) totalOcc[subj] = (totalOcc[subj] || 0) + 1; }
            tmp = addDays(tmp, 1);
        }
    }

    const origCount = {};
    for (const [subj, q] of Object.entries(queues)) origCount[subj] = q.length;

    console.log('📐 Ritmo:');
    for (const [subj, q] of Object.entries(queues)) {
        console.log('  ' + subj.padEnd(24) + q.length + '/' + (totalOcc[subj] || 1) + ' = ' + (q.length / (totalOcc[subj] || 1)).toFixed(3) + '/slot');
    }

    const assigned = {}, occSoFar = {};
    for (const s of Object.keys(queues)) { assigned[s] = 0; occSoFar[s] = 0; }

    const ALL_PRIORITY = ['Matemática', 'Física', 'Química', 'Biologia',
        'Linguagens', 'História', 'Geografia', 'Filosofia/Sociologia'];

    // Reviews: ONLY D+7 for foundation topics
    const allReviews = [];
    function schedReview(date, subj, title) {
        let target = addDays(date, 7);
        let safety = 0;
        while ((BUDGET[target.getDay()] || 0) === 0 && safety++ < 7) target = addDays(target, 1);
        if (target <= SCHED_END) allReviews.push({ date: fmt(target), s: subj, t: 'Revisão D+7: ' + title });
    }

    const dayUsage = {};
    function getUsed(ds) { return dayUsage[ds] || 0; }
    function addUsed(ds, min) { dayUsage[ds] = (dayUsage[ds] || 0) + min; }

    let cur = new Date(START);
    let redacaoCount = 0, weekCount = 0;

    // Helper: place topic
    function placeTopic(subj, dateStr, budget, dayTasks) {
        const q = queues[subj];
        if (!q || q.length === 0) return 0;
        let usedMin = getUsed(dateStr);
        if (usedMin + DURATION.class > budget) return 0;

        const topic = q.shift();
        assigned[subj]++;
        dayTasks.push({
            date: dateStr, subject: topic.s, title: topic.t,
            type: 'class'
        });
        let added = DURATION.class;

        // Fixation
        if (usedMin + added + DURATION.exercise <= budget) {
            dayTasks.push({ date: dateStr, subject: topic.s, title: 'Fixação: ' + topic.t, type: 'exercise' });
            added += DURATION.exercise;
        }

        // D+7 review ONLY for p=1 foundation topics
        if (topic.p === 1) schedReview(cur, topic.s, topic.t);

        addUsed(dateStr, added);
        return added;
    }

    // ═══ PASS 1: Content + Redação ═══
    while (cur <= SCHED_END) {
        const dow = cur.getDay();
        const dateStr = fmt(cur);
        const budget = BUDGET[dow];
        if (budget === 0) { cur = addDays(cur, 1); continue; }

        if (dow === 0) weekCount++;

        // Increment slot counters
        if (cur <= CONTENT_END) {
            for (const subj of (DAY_SUBJECTS[dow] || [])) {
                if (occSoFar[subj] !== undefined) occSoFar[subj]++;
            }
        }

        const dayTasks = [];

        // Redação: 1x/week on Sunday
        if (dow === 0 && getUsed(dateStr) + DURATION.simulation <= budget) {
            redacaoCount++;
            dayTasks.push({
                date: dateStr, subject: 'Redação',
                title: 'Produção Textual ENEM #' + redacaoCount, type: 'simulation'
            });
            addUsed(dateStr, DURATION.simulation);
        }

        // New content
        if (cur <= CONTENT_END) {
            const daySubjects = DAY_SUBJECTS[dow] || [];

            // Pass A: assigned subjects (pace-controlled)
            for (const subj of daySubjects) {
                if (!queues[subj] || queues[subj].length === 0) continue;
                if (getUsed(dateStr) + DURATION.class > budget) break;
                const expected = origCount[subj] * (occSoFar[subj] / (totalOcc[subj] || 1));
                if (assigned[subj] >= Math.ceil(expected)) continue;
                placeTopic(subj, dateStr, budget, dayTasks);
            }

            // Pass B: backfill with deficit-sorted subjects
            const backfill = ALL_PRIORITY
                .filter(s => queues[s] && queues[s].length > 0)
                .map(s => ({
                    subj: s,
                    deficit: (origCount[s] * (occSoFar[s] / (totalOcc[s] || 1))) - assigned[s]
                }))
                .sort((a, b) => b.deficit - a.deficit);
            for (const item of backfill) {
                if (getUsed(dateStr) + DURATION.class > budget) break;
                if (item.deficit < 0.2) continue;
                placeTopic(item.subj, dateStr, budget, dayTasks);
            }
        }

        if (dayTasks.length > 0) tasks.push(...dayTasks);
        cur = addDays(cur, 1);
    }

    // ═══ PASS 2: D+7 reviews (20min each) ═══
    console.log('\n📝 ' + allReviews.length + ' revisões D+7 (apenas p=1)...');
    allReviews.sort((a, b) => a.date.localeCompare(b.date));
    let deferredR = 0, droppedR = 0;
    for (const rev of allReviews) {
        let td = rev.date; let att = 0;
        while (att < 30) {
            const d = parseLocal(td), b = BUDGET[d.getDay()];
            if (b > 0 && getUsed(td) + DURATION.review <= b) {
                tasks.push({ date: td, subject: rev.s, title: rev.t, type: 'review' });
                addUsed(td, DURATION.review); if (td !== rev.date) deferredR++; break;
            }
            td = fmt(addDays(parseLocal(td), 1)); att++;
            if (parseLocal(td) > SCHED_END) { droppedR++; break; }
        }
        if (att >= 30) droppedR++;
    }
    if (deferredR > 0) console.log('  ↪️  ' + deferredR + ' movidas');
    if (droppedR > 0) console.log('  ⚠️  ' + droppedR + ' não couberam');

    // ═══ PASS 3: Monthly general reviews + exercise batteries ═══
    console.log('\n📋 Gerando revisões gerais + baterias ENEM...');
    const supplementary = [];

    // Monthly general review per subject (45min exercise) — spread across month
    for (let month = 2; month <= 9; month++) {
        ALL_PRIORITY.forEach((subj, i) => {
            const day = 3 + i * 3; // days 3, 6, 9, 12, 15, 18, 21, 24
            const d = new Date(2026, month, day);
            if (d >= START && d <= SCHED_END)
                supplementary.push({
                    date: fmt(d), subject: subj,
                    title: 'Revisão Geral: ' + subj, type: 'exercise'
                });
        });
    }

    // Exercise batteries: 1 subject per week, rotating through all 8
    for (let week = 2; week <= 34; week++) {
        const si = (week - 2) % ALL_PRIORITY.length;
        const subj = ALL_PRIORITY[si];
        const d = addDays(START, week * 7 + 3); // target Wed of that week
        if (d >= START && d <= SCHED_END)
            supplementary.push({
                date: fmt(d), subject: subj,
                title: 'Bateria ENEM: ' + subj, type: 'exercise'
            });
    }

    let placedSupp = 0;
    for (const item of supplementary) {
        let td = item.date; let att = 0;
        while (att < 14) {
            const d = parseLocal(td), b = BUDGET[d.getDay()];
            if (b > 0 && getUsed(td) + DURATION.exercise <= b) {
                tasks.push({ date: td, subject: item.subject, title: item.title, type: item.type });
                addUsed(td, DURATION.exercise); placedSupp++; break;
            }
            td = fmt(addDays(parseLocal(td), 1)); att++;
            if (parseLocal(td) > SCHED_END) break;
        }
    }
    console.log('  ✅ ' + placedSupp + '/' + supplementary.length + ' suplementares agendadas');

    // ═══ PASS 4: Fill idle/underutilized days ═══
    console.log('\n📋 Preenchendo dias ociosos/subutilizados...');
    let fillCount = 0;
    let subjectRotation = 0;
    let fillCur = new Date(START);
    while (fillCur <= SCHED_END) {
        const dow = fillCur.getDay();
        const dateStr = fmt(fillCur);
        const budget = BUDGET[dow];
        if (budget > 0 && getUsed(dateStr) + DURATION.exercise <= budget) {
            const daySubjects = DAY_SUBJECTS[dow] || ALL_PRIORITY;
            while (getUsed(dateStr) + DURATION.exercise <= budget) {
                const subj = daySubjects[subjectRotation % daySubjects.length];
                subjectRotation++;
                tasks.push({
                    date: dateStr, subject: subj,
                    title: 'Bateria de Questões: ' + subj, type: 'exercise'
                });
                addUsed(dateStr, DURATION.exercise);
                fillCount++;
            }
        }
        fillCur = addDays(fillCur, 1);
    }
    console.log('  ✅ ' + fillCount + ' baterias extras adicionadas');

    // Report leftover
    let allDone = true;
    for (const [subj, q] of Object.entries(queues)) {
        if (q.length > 0) { console.log('  ⚠️ ' + subj + ': ' + q.length + ' não couberam'); allDone = false; }
    }
    if (allDone) console.log('  ✅ Todos os tópicos agendados!');

    // ═══ FINAL: Enforce Budget Strictly ═══
    const finalByDate = {};
    for (let i = 0; i < tasks.length; i++) {
        if (!finalByDate[tasks[i].date]) finalByDate[tasks[i].date] = [];
        finalByDate[tasks[i].date].push(i);
    }
    const toRemove = new Set();
    for (const [ds, indices] of Object.entries(finalByDate)) {
        const d = parseLocal(ds);
        const b = BUDGET[d.getDay()];
        let total = 0;
        for (const idx of indices) total += DURATION[tasks[idx].type] || 60;
        if (total > b) {
            for (let j = indices.length - 1; j >= 0 && total > b; j--) {
                const idx = indices[j];
                if (tasks[idx].title.startsWith('Bateria de Questões') || tasks[idx].title.startsWith('Bateria ENEM')) {
                    toRemove.add(idx); total -= DURATION[tasks[idx].type] || 60;
                }
            }
        }
    }
    if (toRemove.size > 0) {
        console.log('  🔧 Removidas ' + toRemove.size + ' baterias em excesso');
        return tasks.filter((_, i) => !toRemove.has(i));
    }

    return tasks;
}

// ═══ VALIDATION ═══
function validateBudget(tasks) {
    const byDate = {};
    for (const t of tasks) { if (!byDate[t.date]) byDate[t.date] = []; byDate[t.date].push(t); }
    let violations = 0;
    for (const [ds, dt] of Object.entries(byDate)) {
        const d = parseLocal(ds), b = BUDGET[d.getDay()];
        const total = dt.reduce((s, t) => s + (DURATION[t.type] || 60), 0);
        if (total > b + 10) {
            violations++; if (violations <= 5)
                console.log('  ⚠️ ' + ds + ': ' + total + '/' + b + 'min');
        }
    }
    if (violations > 5) console.log('  ... +' + (violations - 5) + ' violações');
    if (violations === 0) console.log('  ✅ Nenhuma violação de budget!');
    return violations;
}

// ═══ MAIN ═══
async function main() {
    console.log('═══════════════════════════════════════════════');
    console.log('  CRONOGRAMA MAIELLY — Medicina UFMA');
    console.log('  user_id: ' + USER_ID);
    console.log('  Início: 18/02/2026');
    console.log('═══════════════════════════════════════════════\n');

    const completedTitles = await fetchCompletedTopics();
    const tasks = generate(completedTitles);
    console.log('\n📅 ' + tasks.length + ' tarefas geradas\n');

    const bySubject = {}, byType = {}, byMonth = {};
    for (const t of tasks) {
        bySubject[t.subject] = (bySubject[t.subject] || 0) + 1;
        byType[t.type] = (byType[t.type] || 0) + 1;
        byMonth[t.date.slice(0, 7)] = (byMonth[t.date.slice(0, 7)] || 0) + 1;
    }

    console.log('📊 Por matéria:');
    for (const [s, c] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) {
        console.log('  ' + s.padEnd(24) + String(c).padStart(4) + ' blocos  ' + '█'.repeat(Math.min(Math.round(c / 3), 35)));
    }
    console.log('\n📋 Por tipo:');
    for (const [t, c] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log('  ' + t.padEnd(14) + c);
    console.log('\n📆 Por mês:');
    for (const [m, c] of Object.entries(byMonth).sort()) console.log('  ' + m + ': ' + c + ' blocos');

    console.log('\n🔒 Verificação de budget:');
    validateBudget(tasks);

    console.log('\n🗑️  Limpando tarefas IA antigas...');
    const { error: delErr } = await supabase.from('schedule_tasks').delete()
        .eq('user_id', USER_ID).eq('is_ia_generated', true).eq('completed', false);
    if (delErr) console.error('  ⚠️', delErr.message);
    else console.log('  ✅ Removidas');

    const rows = tasks.map(t => ({
        user_id: USER_ID, date: t.date, subject: t.subject,
        title: t.title, type: t.type, completed: false, is_ia_generated: true
    }));
    console.log('\n📝 Inserindo ' + rows.length + ' tarefas...');
    const BATCH = 200; let inserted = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
        const chunk = rows.slice(i, i + BATCH);
        const { error } = await supabase.from('schedule_tasks').insert(chunk);
        if (error) { console.error('  ❌', error.message); break; }
        inserted += chunk.length; console.log('  ✅ ' + inserted + '/' + rows.length);
    }
    console.log('\n🎉 ' + inserted + ' tarefas inseridas para Maielly!');
}

main().catch(e => { console.error('❌', e); process.exit(1); });
