import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)] overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"></div>
                        <Crown className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Estudo Real</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#plataforma" className="text-sm text-zinc-400 hover:text-white transition-colors">A Plataforma</a>
                    <a href="#recursos" className="text-sm text-zinc-400 hover:text-white transition-colors">Recursos</a>
                    <a href="#depoimentos" className="text-sm text-zinc-400 hover:text-white transition-colors">Depoimentos</a>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium text-white hover:text-amber-400 transition-colors">
                        Entrar
                    </Link>
                    <button
                        onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-waitlist')); }}
                        className="flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
                    >
                        Acesso VIP
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-zinc-400 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-zinc-900 border-b border-zinc-800 px-6 py-6 flex flex-col gap-4"
                >
                    <a href="#plataforma" className="text-zinc-300 py-2 border-b border-zinc-800" onClick={() => setMobileMenuOpen(false)}>A Plataforma</a>
                    <a href="#recursos" className="text-zinc-300 py-2 border-b border-zinc-800" onClick={() => setMobileMenuOpen(false)}>Recursos</a>
                    <Link to="/login" className="text-white font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
                    <button
                        onClick={() => { setMobileMenuOpen(false); window.dispatchEvent(new CustomEvent('open-waitlist')); }}
                        className="flex items-center justify-center gap-2 h-12 rounded-lg bg-amber-400 text-zinc-950 font-semibold mt-4"
                    >
                        Acesso VIP
                    </button>
                </motion.div>
            )}
        </motion.header>
    );
}
