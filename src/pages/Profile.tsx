import { useState, useEffect } from 'react';
import { User, Mail, GraduationCap, Target, Save, Camera, Moon, Bell, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import clsx from 'clsx';

export function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [course, setCourse] = useState('');
    const [targetScore, setTargetScore] = useState(120);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    async function loadProfile() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user?.id)
                .single();

            if (error) {
                console.warn('Error loading profile:', error);
            }

            if (data) {
                setFullName(data.full_name || '');
                setUniversity(data.university || '');
                setCourse(data.course || '');
                setTargetScore(data.target_score || 120); // Default from previous setting or schema
                setAvatarUrl(data.avatar_url || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return;
            }
            if (!user) return;

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}-${Math.random()}.${fileExt}`;

            setLoading(true);

            // 1. Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            if (data) {
                setAvatarUrl(data.publicUrl);
                setMessage({ type: 'success', text: 'Avatar enviado! Clique em Salvar para confirmar.' });
            }

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: 'Erro ao enviar foto. Verifique se o bucket "avatars" existe.' });
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!user) return;
        setSaving(true);
        setMessage(null);

        try {
            const updates = {
                user_id: user.id,
                full_name: fullName,
                university,
                course,
                target_score: targetScore,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

            // Clear success message after 3 seconds
            setTimeout(() => setMessage(null), 3000);

        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: `Erro ao salvar: ${error.message || 'Tente novamente.'}` });
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="text-zinc-500 flex items-center justify-center h-64">Carregando perfil...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
                <p className="text-zinc-400">Gerencie suas informações pessoais e objetivos acadêmicos.</p>
            </div>

            {/* Notification Toast */}
            {message && (
                <div className={clsx(
                    "p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-4 fixed top-8 right-8 z-50 shadow-2xl",
                    message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                    {message.type === 'success' ? <Shield size={20} /> : <Target size={20} />}
                    <span className="font-medium">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Main Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-800 border-4 border-zinc-800 shadow-xl">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                className="absolute bottom-0 right-0 p-2.5 bg-primary rounded-full text-black shadow-lg hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </div>

                        <h2 className="text-xl font-bold text-white mb-1">{fullName || 'Estudante'}</h2>
                        <p className="text-zinc-500 text-sm mb-4">{user?.email}</p>

                        <div className="w-full h-px bg-zinc-800 mb-4" />

                        <div className="w-full text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Nível</span>
                                <span className="text-white font-medium">Plebeu (Lvl 1)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500">Membro desde</span>
                                <span className="text-white font-medium">Fev 2026</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Configurações</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                                <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                                    <Moon size={18} />
                                    <span>Tema</span>
                                </div>
                                <span className="text-xs bg-zinc-800 group-hover:bg-zinc-700 px-2 py-1 rounded text-zinc-400">Escuro</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-3 hover:bg-zinc-800 rounded-xl transition-colors text-left group">
                                <div className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                                    <Bell size={18} />
                                    <span>Notificações</span>
                                </div>
                                <span className="text-xs bg-zinc-800 group-hover:bg-zinc-700 px-2 py-1 rounded text-zinc-400">Ativado</span>
                            </button>
                        </div>
                    </div>

                    {/* Dev Tools (Temporary) */}
                    <div className="bg-red-900/10 border border-red-900/20 rounded-2xl p-6 mt-6">
                        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4">Dev Tools (Security)</h3>
                        <button
                            onClick={async () => {
                                setLoading(true);
                                const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('user_id', user?.id);
                                if (!error) {
                                    alert('Role updated to Admin! You can now upload materials.');
                                    window.location.reload();
                                } else {
                                    alert('Error: ' + error.message);
                                }
                                setLoading(false);
                            }}
                            className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 rounded-lg transition-colors"
                        >
                            Set me as Admin (Enable Uploads)
                        </button>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Personal Data */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <User size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Dados Pessoais</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Nome Completo</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Seu nome"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl pl-11 pr-4 py-3 text-zinc-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Goals */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                                <GraduationCap size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-white">Objetivos Academicos</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Universidade Alvo</label>
                                <input
                                    type="text"
                                    value={university}
                                    onChange={(e) => setUniversity(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Ex: USP, Unicamp, UFRJ"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Curso Desejado</label>
                                <input
                                    type="text"
                                    value={course}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Ex: Medicina, Direito"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-zinc-400 flex justify-between">
                                    <span>Meta de Acertos (Simulado Global)</span>
                                    <span className="text-emerald-500 font-bold">{targetScore} / 180</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="180"
                                    value={targetScore}
                                    onChange={(e) => setTargetScore(parseInt(e.target.value))}
                                    className="w-full accent-primary h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-zinc-600 px-1">
                                    <span>0</span>
                                    <span>90</span>
                                    <span>180</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
