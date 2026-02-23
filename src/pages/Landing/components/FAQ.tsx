import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "Como funciona a entrega das métricas da plataforma?",
        answer: "Nossa plataforma possui um cronômetro líquido nativo. Você ativa quando começa a estudar e pausa nos intervalos. Ao final do dia ou da semana, todas essas horas entram nos seus gráficos individuais por matéria, permitindo visualizar seus pontos de deficiência exatos."
    },
    {
        question: "Posso acessar pelo celular?",
        answer: "Sim! A Estudo Real foi desenvolvida com design responsivo, significando que a plataforma se adapta perfeitamente em celulares (iOS/Android) e Tablets. Não precisa baixar na App Store, basta acessar o link pelo navegador do celular."
    },
    {
        question: "Qual a diferença dessa plataforma para as outras de questões?",
        answer: "A Estudo Real não é apenas um banco de questões, é um ecossistema de gestão de estudos (ERP para estudantes). Aqui você une cronograma que se adapta à sua vida com a correção avançada de simulados via inteligência estatística."
    },
    {
        question: "Como recebo o acesso após a compra?",
        answer: "O pagamento é processado pela Kiwify (100% seguro). Assim que o pagamento (Pix ou Cartão) for aprovado pela Kiwify, o nosso sistema interno enviará automaticamente um E-mail de Boas Vindas com o seu login para acessar a área restrita na mesma hora."
    },
    {
        question: "Como funciona a garantia e o reembolso?",
        answer: "Temos garantia incondicional de 7 dias. Se por qualquer motivo no mundo você não gostar da experiência dentro da nossa plataforma, basta enviar um e-mail solicitando o reembolso e 100% do seu dinheiro será estornado, sem questionamentos extras."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-zinc-950 relative border-t border-zinc-900 border-b border-zinc-900">
            <div className="max-w-3xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Dúvidas <span className="text-amber-400">Frequentes</span>
                    </h2>
                    <p className="text-lg text-zinc-400">
                        Ainda com alguma dúvida se este é o momento ideal para assinar? Confira as perguntas abaixo.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'bg-zinc-900 border-amber-500/30' : 'bg-transparent border-zinc-800 hover:border-zinc-700'
                                    }`}
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                >
                                    <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-amber-400' : 'text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : 'text-zinc-500'}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed text-sm md:text-base">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
