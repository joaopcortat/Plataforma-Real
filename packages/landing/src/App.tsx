
import {
  Brain, Target, Clock, Trophy,
  CheckCircle2, ChevronDown, Play,
  Star, ArrowRight, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const plans = [
    {
      id: 'trimestral',
      name: 'Trimestral',
      price: 'R$99',
      period: '3 meses',
      equivalent: 'R$33/mês',
      url: 'https://pay.kiwify.com.br/UqFVxjD',
      popular: false
    },
    {
      id: 'semestral',
      name: 'Semestral',
      price: 'R$179',
      period: '6 meses',
      equivalent: 'R$30/mês',
      url: 'https://pay.kiwify.com.br/AiPHpNF',
      popular: true
    },
    {
      id: 'anual',
      name: 'Anual',
      price: 'R$299',
      period: '12 meses',
      equivalent: 'R$25/mês',
      url: 'https://pay.kiwify.com.br/yI7zJoY',
      popular: false
    }
  ];

  const features = [
    { title: 'Cronograma IA Adaptativo', desc: 'Seu plano de estudos se ajusta automaticamente todos os dias com base no seu desempenho e imprevistos.', icon: Brain },
    { title: 'Curva do Esquecimento', desc: 'Revisões programadas cirurgicamente no exato momento que você iria esquecer a matéria.', icon: Clock },
    { title: 'Direcionamento Cirúrgico', desc: 'Ataque frontal nas suas fraquezas e nos assuntos que mais caem nas provas que você quer.', icon: Target },
    { title: 'Radar de Competências', desc: 'Métricas visuais avançadas para você saber exatamente qual área focar antes da prova.', icon: Trophy }
  ];

  const faqs = [
    { q: 'Serve para qualquer curso?', a: 'A Plataforma Real foi desenhada com foco na aprovação mais concorrida: Medicina pelo ENEM. O nível de exigência e controle de métricas serve perfeitamente para Medicina, mas pode ser "overkill" (exagerado) para cursos mais simples.' },
    { q: 'E se eu atrasar a matéria?', a: 'Ao contrário de cronogramas em PDF ou Excel, a IA da Real redistribui automaticamente seus atrasos sem que você precise refazer planejamento ou entrar em desespero.' },
    { q: 'Como funciona a garantia?', a: 'Você tem 7 dias incondicionais. Entre, gere seu cronograma, use as métricas. Se achar que não vai acelerar sua aprovação, aperte um botão e devolvemos 100% do valor.' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b-0 border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-black text-black">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight">Real Mentoria</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#plataforma" className="hover:text-white transition-colors">Plataforma</a>
            <a href="#autor" className="hover:text-white transition-colors">O Autor</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Aprovados</a>
          </div>
          <a href="#planos" className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-transform hover:scale-105">
            Assinar Agora
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-bold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Vagas abertas para o Ciclo 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Sua aprovação em Medicina <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-accent">
              guiada por Inteligência Artificial
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Pare de estudar no escuro. Tenha um cronograma que se adapta aos seus imprevistos, controla suas revisões e mede seu progresso com precisão cirúrgica.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#planos"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center justify-center gap-2 text-lg group"
            >
              Garantir minha vaga
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/10 hover:border-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg">
              <Play size={20} className="text-primary" fill="currentColor" />
              Ver como funciona
            </button>
          </motion.div>
        </div>

        {/* Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 max-w-6xl mx-auto relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
            alt="Plataforma Dashboard"
            className="rounded-2xl border border-white/10 shadow-2xl opacity-40 grayscale sepia-[.3] hue-rotate-[15deg]"
          />
          {/* Overlay mockup representation */}
          <div className="absolute inset-x-10 -bottom-10 z-20 glass-panel p-6 rounded-2xl flex items-center justify-between border-primary/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                <CheckCircle2 />
              </div>
              <div>
                <p className="font-bold">Ciclo adaptado com sucesso</p>
                <p className="text-sm text-zinc-400">IA recalculou seu atraso de ontem.</p>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xl font-bold text-primary">Biologia - Genética</p>
              <p className="text-sm text-zinc-400">Próxima meta de foco</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problema / Agitação */}
      <section className="py-24 bg-zinc-950 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Você não precisa estudar <span className="text-primary">mais</span>.<br />Você precisa estudar <span className="text-accent border-b-2 border-accent">certo</span>.</h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 rounded-2xl bg-red-950/20 border border-red-500/20">
              <h3 className="text-red-400 font-bold text-xl mb-4">O método falho (Cursinhos)</h3>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex gap-3"><span className="text-red-500">✕</span> Cronogramas em PDF idênticos para todos.</li>
                <li className="flex gap-3"><span className="text-red-500">✕</span> Se você atrasa um dia, vira uma bola de neve.</li>
                <li className="flex gap-3"><span className="text-red-500">✕</span> Zero controle sobre o que você já esqueceu.</li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl bg-primary/10 border border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl" />
              <h3 className="text-primary font-bold text-xl mb-4">O método Real (IA)</h3>
              <ul className="space-y-4 text-zinc-300 relative z-10">
                <li className="flex gap-3"><span className="text-primary">✓</span> IA desenha ordem baseada no seu nível.</li>
                <li className="flex gap-3"><span className="text-primary">✓</span> Remanejamento automático de atrasos diários.</li>
                <li className="flex gap-3"><span className="text-primary">✓</span> Alertas exatos de quando fazer revisões.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="plataforma" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Engenharia de Aprovação</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">A única plataforma que cruza dados de Teoria Integrada ao Controle Psicométrico de Revisão.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-3xl hover:border-primary/50 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-colors">
                  <feat.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autor */}
      <section id="autor" className="py-24 bg-zinc-900 border-y border-white/5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square rounded-3xl overflow-hidden glass-panel p-2">
              {/* Imagem do Joao aqui, por enquanto placeholder */}
              <div className="w-full h-full rounded-2xl bg-zinc-800 grayscale sepia-[.2] bg-[url('https://images.unsplash.com/photo-1537511446984-935f663eb1f4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center flex items-end p-6">
                <div className="glass-panel p-4 rounded-xl backdrop-blur-xl w-full">
                  <div className="flex items-center gap-2 text-primary font-bold mb-1">
                    <Trophy size={16} /> Fundador
                  </div>
                  <p className="text-white font-medium">João Pedro Cortat</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-panel p-6 rounded-2xl shadow-2xl">
              <p className="text-4xl font-black text-primary mb-1">UFF</p>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Universidade<br />Federal</p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Feito por quem já <span className="text-gradient">venceu esse jogo.</span></h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Não fomos criados por empresários que nunca sentaram pra estudar. A Real foi inteiramente projetada usando os exatos métodos que me levaram da estaca zero para a aprovação nas federais mais concorridas do país.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '+50', label: 'Aprovações Medicina' },
                { num: '+800', label: 'Média Simples ENEM' },
                { num: '+160', label: 'Acertos Totais (2024)' },
                { num: '+900', label: 'Matemática ENEM' },
                { num: '+250h', label: 'Mentorias 1 a 1' },
                { num: 'UFF', label: 'Acadêmico de Medicina' },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-950 border border-white/5">
                  <p className="text-2xl font-black text-white mb-1">{stat.num}</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof (Depoimentos) */}
      <section id="depoimentos" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A elite da aprovação</h2>
          <p className="text-xl text-zinc-400 mb-16">Junte-se aos alunos que hackearam o sistema do ENEM.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="glass-panel p-8 rounded-3xl text-left">
                <div className="flex gap-1 text-primary mb-6">
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                  <Star fill="currentColor" size={18} />
                </div>
                <p className="text-lg text-zinc-300 mb-8 italic">
                  "Espaço reservado para o depoimento real do aluno. A mudança de perspectiva após o uso da plataforma de IA."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" /> {/* Avatar area */}
                  <div>
                    <p className="font-bold text-white">Nome do Aluno</p>
                    <p className="text-sm text-primary">Aprovado Med Federal</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-32 bg-zinc-950 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Invista na sua aprovação</h2>
            <p className="text-xl text-zinc-400">Escolha o plano ideal para a sua jornada.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 border transition-all flex flex-col ${plan.popular
                  ? 'bg-gradient-to-b from-[#1a1a24] to-[#0a0a0f] border-primary/50 shadow-2xl shadow-primary/20 scale-105 z-10'
                  : 'bg-[#111118] border-white/10'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-black text-sm font-bold px-6 py-1.5 rounded-full shadow-lg">
                      Mais Recomendado
                    </span>
                  </div>
                )}

                <div className="mb-8 border-b border-white/10 pb-8 text-center pt-2">
                  <p className="text-zinc-400 font-bold mb-4 uppercase tracking-wider">{plan.name}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                  </div>
                  <p className="text-primary bg-primary/10 inline-block px-4 py-1.5 rounded-full text-sm font-bold">
                    Equivale a {plan.equivalent}
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {['Acesso IA Ilimitado', 'Métricas Avançadas', 'Suporte Real', 'Atualizações Inclusas'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle2 className="text-primary shrink-0" size={20} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-accent/20 hover:shadow-primary/40'
                    : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                >
                  Assinar {plan.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risco Zero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto glass-panel border-primary/30 p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px]" />
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <Shield size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Garantia Incondicional 7 Dias</h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Riscos são para amadores. Entre na plataforma, gere seu cronograma e navegue por todas as funcionalidades. Se você sentir que o método não vai blindar sua jornada até a aprovação, devolvemos 100% do seu dinheiro. Sem burocracia.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group glass-panel rounded-2xl open:border-primary/30 transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg select-none">
                  {faq.q}
                  <ChevronDown className="text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4 mt-2">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
            <span className="font-bold text-black text-[10px]">R</span>
          </div>
          <span className="font-bold tracking-tight">Real Mentoria</span>
        </div>
        <p className="text-zinc-500 text-sm mb-2">Acelerando aprovações em Medicina.</p>
        <p className="text-zinc-600 text-xs text-balance">
          Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook.
          Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site.
        </p>
        <div className="mt-8 text-zinc-700 text-xs">
          &copy; {new Date().getFullYear()} Plataforma Real. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

export default App;
