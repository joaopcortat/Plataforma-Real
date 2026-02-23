import { motion } from 'framer-motion';

// Esta lista simula as 6 imagens de provas sociais.
// Você precisará substituir as imagens na pasta:
// /Users/joaopedrocortat/REAL/Plataforma/public/assets/testimonials/
const testimonials = [
    '/assets/testimonials/depoimento-1.png',
    '/assets/testimonials/depoimento-2.png',
    '/assets/testimonials/depoimento-3.png',
    '/assets/testimonials/depoimento-4.png',
    '/assets/testimonials/depoimento-5.png',
    '/assets/testimonials/depoimento-6.png',
];

export function Testimonials() {
    // Duplicando a lista para criar o efeito contínuo imperceptível ("infinite scroll")
    const doubledTestimonials = [...testimonials, ...testimonials];

    return (
        <section id="depoimentos" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">

            {/* Background Decorativo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex justify-center items-center px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-sm mb-6"
                    >
                        Aprovados
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Não acredite apenas <span className="text-amber-400">em nós.</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Veja o que os alunos que adotaram a rotina de alto desempenho e nossa plataforma estão falando a respeito.
                    </p>
                </div>
            </div>

            {/* Carrossel Infinito */}
            <div className="relative w-full flex overflow-hidden">

                {/* Sombras laterais para fade out suave nas bordas */}
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

                <div className="flex animate-[infinite-scroll_40s_linear_infinite] hover:[animation-play-state:paused] gap-6 px-3">
                    {doubledTestimonials.map((imagePath, index) => (
                        <div
                            key={index}
                            className="w-[300px] md:w-[350px] shrink-0 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 shadow-xl relative overflow-hidden group"
                        >
                            {/* Fallback box caso a imagem não exista - a estética dark mode garante que não fique feio */}
                            <div className="w-full aspect-[4/5] bg-zinc-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-zinc-800/50 group-hover:border-amber-500/30 transition-colors">
                                <span className="text-zinc-600 text-xs text-center px-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Coloque a imagem em: <br /> {imagePath}
                                </span>

                                {/* Imagem Real da Print */}
                                <img
                                    src={imagePath}
                                    alt="Depoimento de aluno aprovado"
                                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                                    onError={(e) => {
                                        // Ocultar ícone quebrado do navegador e mostrar só o fallback estilizado do componente acima
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        ((e.target as HTMLImageElement).parentElement?.querySelector('span') as HTMLSpanElement).style.opacity = '1';
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            /* Como dobramos o array, ele precisa deslocar exatamente 50% de si mesmo e uma fração de flex gap */
            100% { transform: translateX(calc(-50% - 12px)); }
          }
        `}
            </style>
        </section>
    );
}
