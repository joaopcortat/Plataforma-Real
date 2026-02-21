import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                alert('Conta criada! Verifique seu email para confirmar.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: any) {
            // Translate common Supabase errors
            let msg = err.message;
            if (msg === 'Invalid login credentials') msg = 'Email ou senha incorretos.';
            if (msg === 'User already registered') msg = 'Este email já está cadastrado.';

            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">
                    {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
                </h2>
                <p className="mt-2 text-zinc-400">
                    {isSignUp ? 'Comece sua jornada de aprovação.' : 'Acesse seu painel de estudos.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                            <Mail size={20} />
                        </div>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="block w-full pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="block w-full pl-10 bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {isSignUp ? 'Cadastrar' : 'Entrar'}
                            <ArrowRight className="ml-2" size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                    }}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                    {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
                </button>
            </div>
        </div>
    );
}
