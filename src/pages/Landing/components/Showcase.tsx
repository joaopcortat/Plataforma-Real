import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CalendarDays, BookOpen, Timer } from 'lucide-react';

const slides = [
    {
        id: 'dashboard',
        title: 'Dashboard Estatístico',
        description: 'Mapeamento visual das suas métricas em tempo real: horas acumuladas, questões resolvidas e contagem regressiva para o ENEM.',
        icon: <LayoutDashboard className="w-6 h-6" />,
        image: '/assets/showcase-dashboard.png'
    },
    {
        id: 'cronograma',
        title: 'Cronograma Semanal',
        description: 'Seu planejamento organizado em blocos por matéria. Arraste e reordene as tarefas conforme a semana evolui.',
        icon: <CalendarDays className="w-6 h-6" />,
        image: '/assets/showcase-cronograma.png'
    },
    {
        id: 'simulados',
        title: 'Área de Simulados',
        description: 'Central de provas e análise de evolução. Faça simulados no padrão oficial do ENEM e acompanhe sua nota por área de conhecimento.',
        icon: <BookOpen className="w-6 h-6" />,
        image: '/assets/showcase-simulados-area.png'
    },
    {
        id: 'cronometro',
        title: 'Cronômetro Modo Prova',
        description: 'Ambiente isolado simulando as condições reais do ENEM — tempo exato de 5h30min, modo fiscal e sem distrações.',
        icon: <Timer className="w-6 h-6" />,
        image: '/assets/showcase-timer simulados.png'
    },
    {
        id: 'modo-foco',
        title: 'Temporizador de Estudo',
        description: 'Modo tela cheia de rastreamento líquido de tempo. Pausa, finaliza e registra cada sessão de foco puro no seu histórico.',
        icon: <Timer className="w-6 h-6" />,
        image: '/assets/showcase-modo-foco.png'
    }
];

export function Showcase() {
    const [activeSlide, setActiveSlide] = useState(0);

    // Define um timer para rotacionar automaticamente as imagens a cada 12 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 12000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="interface" className="py-24 bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex justify-center items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-sm mb-6">
                        Por Dentro da Plataforma
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Ferramentas premium para uma <span className="text-amber-400">rotina de elite.</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Abaixo estão as prints reais da sua futura área de estudos. Esqueça cursinhos cheios de publicidade, aqui o silêncio e o minimalismo ditam o jogo.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[300px_1fr] gap-8 xl:gap-12 items-start">

                    {/* Menu Lateral */}
                    <div className="flex flex-col gap-3">
                        {slides.map((slide, index) => {
                            const isActive = activeSlide === index;
                            return (
                                <button
                                    key={slide.id}
                                    onClick={() => setActiveSlide(index)}
                                    className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isActive
                                        ? 'bg-zinc-900 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                                        : 'bg-zinc-900/40 border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="showcase-active-indicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"
                                        />
                                    )}
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`p-2 rounded-xl border transition-colors ${isActive ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 group-hover:text-zinc-300'
                                            }`}>
                                            {slide.icon}
                                        </div>
                                        <h3 className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                                            {slide.title}
                                        </h3>
                                    </div>
                                    {isActive && (
                                        <motion.p
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="text-sm text-zinc-400 leading-relaxed pl-1"
                                        >
                                            {slide.description}
                                        </motion.p>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Área da Imagem / Mockup */}
                    <div className="relative w-full aspect-[16/10] md:aspect-video rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl flex items-center justify-center group flex-1">
                        <div className="absolute inset-0 bg-zinc-950 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide}
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full p-2 md:p-4"
                            >
                                <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-800/50 relative bg-zinc-950">
                                    <img
                                        src={slides[activeSlide].image}
                                        alt={slides[activeSlide].title}
                                        className="w-full h-full object-cover object-left-top"
                                    />
                                    {/* Fallback de cor caso a imagem não carregue rápido */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent pointer-events-none" />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Decoração estilo Janela de App */}
                        <div className="absolute top-4 md:top-6 left-4 md:left-6 flex gap-2 z-10">
                            <div className="w-3 h-3 rounded-full bg-zinc-800/80 backdrop-blur" />
                            <div className="w-3 h-3 rounded-full bg-zinc-800/80 backdrop-blur" />
                            <div className="w-3 h-3 rounded-full bg-zinc-800/80 backdrop-blur" />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
