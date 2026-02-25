import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Loader2, Target, Clock, BarChart } from 'lucide-react';

const QUESTIONS = [
    {
        id: 'foco',
        title: 'Qual é o seu principal objetivo este ano?',
        icon: <Target className="w-5 h-5 text-primary" />,
        options: [
            'ENEM (Foco em Vestibulares Federais)',
            'Vestibulares Paulistas (FUVEST, UNICAMP, UNESP)',
            'Medicina (Particulares e Públicas)',
            'Outros / Concursos'
        ]
    },
    {
        id: 'tempo',
        title: 'Há quanto tempo você está se preparando?',
        icon: <Clock className="w-5 h-5 text-primary" />,
        options: [
            'Estou começando agora (Menos de 6 meses)',
            'Sou veterano de 1 ano',
            'Estou na luta há 2 a 3 anos',
            'Mais de 3 anos de preparação'
        ]
    },
    {
        id: 'desempenho',
        title: 'Como você avalia seu desempenho nos Simulados hoje?',
        icon: <BarChart className="w-5 h-5 text-primary" />,
        options: [
            'Nunca fiz / Não tenho métricas exatas',
            'Iniciante (Abaixo de 50% de acertos)',
            'Intermediário (50% a 70% de acertos)',
            'Avançado (Acima de 70%, buscando a excelência)'
        ]
    }
];

export function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);

    // Quiz state
    const [step, setStep] = useState(0); // 0, 1, 2 for questions, 3 for form, 4 for success
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            setStep(0);
            setAnswers({});
        };
        window.addEventListener('open-waitlist', handleOpen);
        return () => window.removeEventListener('open-waitlist', handleOpen);
    }, []);

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        if (step < QUESTIONS.length) {
            setStep(prev => prev + 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simular integração com banco de dados / API / Supabase
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Lead Capturado: ", { name, email, whatsapp, answers });

        setIsLoading(false);
        setStep(4); // Success Step
    };

    if (!isOpen) return null;

    const currentQuestion = step < QUESTIONS.length ? QUESTIONS[step] : null;
    const progress = (step / (QUESTIONS.length + 1)) * 100;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Progress Bar (Only show during quiz and form) */}
                    {step < 4 && (
                        <div className="h-1.5 w-full bg-zinc-800 absolute top-0 left-0">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-10 min-h-[400px] flex flex-col justify-center">

                        {/* QUESTIONS STEP */}
                        {step < QUESTIONS.length && currentQuestion && (
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                <div className="mb-8">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 mb-4">
                                        {currentQuestion.icon}
                                    </div>
                                    <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2 block">
                                        Passo {step + 1} de {QUESTIONS.length}
                                    </span>
                                    <h3 className="text-2xl font-bold text-white leading-tight">
                                        {currentQuestion.title}
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-3 mt-auto">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(currentQuestion.id, option)}
                                            className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-primary/50 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                                        >
                                            <span className="text-sm font-medium">{option}</span>
                                            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* FORM STEP */}
                        {step === QUESTIONS.length && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                <div className="mb-8 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                                        <Target className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Excelente. Último passo!
                                    </h3>
                                    <p className="text-sm text-zinc-400">
                                        Preencha seus dados para garantir seu lugar VIP e receber **50% de desconto** no dia do lançamento.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">Nome Completo</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Seu nome"
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">E-mail</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@melhoremail.com"
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-zinc-400 mb-1">WhatsApp</label>
                                        <input
                                            type="tel"
                                            required
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            placeholder="(11) 99999-9999"
                                            className="w-full h-12 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-12 mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary text-zinc-950 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processando vaga...
                                            </>
                                        ) : (
                                            <>
                                                Garantir Desconto e Acesso VIP
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* SUCCESS STEP */}
                        {step === 4 && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-8"
                            >
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Cadastro Confirmado!
                                </h3>
                                <p className="text-zinc-400 mb-8 max-w-sm">
                                    Sua vaga VIP foi reservada com sucesso. Fique de olho no seu e-mail e WhatsApp, entraremos em contato com as instruções para o seu <strong className="text-primary">desconto de 50%</strong>.
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                                >
                                    Voltar para o site
                                </button>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
