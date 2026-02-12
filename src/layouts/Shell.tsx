import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Calendar,
    LogOut,
    Menu,
    X,
    FileText,
    BookOpen,
    Crown
} from 'lucide-react';

import clsx from 'clsx';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useStudyTimer } from '../contexts/StudyTimerContext';
import { StudyStopwatch } from '../components/dashboard/StudyStopwatch';
import { StudySessionModal } from '../components/dashboard/StudySessionModal';

export function Shell() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<any>(null);

    const {
        isTimerOpen,
        closeTimer,
        openSessionModal,
        isSessionModalOpen,
        closeSessionModal,
        sessionSeconds
    } = useStudyTimer();

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    async function fetchProfile() {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user?.id)
            .single();

        if (data) {
            setProfile(data);
        }
    }

    const focusItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/schedule', icon: Calendar, label: 'Cronograma' },
        { path: '/simulations', icon: FileText, label: 'Simulados' },
        { path: '/materials', icon: BookOpen, label: 'Materiais' },
    ];

    /* 
    const devItems = [
        { path: '/performance', icon: BarChart2, label: 'Desempenho' },
        { path: '/ranking', icon: Trophy, label: 'Ranking' },
        { path: '/achievements', icon: Medal, label: 'Conquistas' },
        { path: '/courses', icon: GraduationCap, label: 'Aulas' },
    ];
    */

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const renderMenuItem = (item: any) => {
        const Icon = item.icon;

        const getAnimationClass = (label: string) => {
            switch (label) {
                case 'Dashboard': return 'animate-dashboard-hover';
                case 'Cronograma': return 'animate-calendar-hover';
                case 'Simulados': return 'animate-sim-hover';
                case 'Materiais': return 'animate-book-hover';
                default: return 'hover:scale-105';
            }
        };

        return (
            <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                    getAnimationClass(item.label),
                    isActive
                        ? "bg-zinc-800 text-white shadow-lg shadow-black/20"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                )}
            >
                {({ isActive }) => (
                    <>
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                        )}
                        <Icon size={20} className={clsx("transition-colors duration-300", isActive ? "text-primary" : "group-hover:text-white")} />
                        <span className="font-medium">{item.label}</span>
                    </>
                )}
            </NavLink>
        );
    };

    return (
        <div className="min-h-screen bg-background text-text-primary flex font-sans">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-zinc-800 transform transition-transform duration-300 lg:translate-x-0 flex flex-col",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >


                <div className="p-6 border-b border-zinc-800 flex items-center justify-between lg:justify-center relative">

                    <div className="flex items-center gap-3 relative z-10">
                        <NavLink to="/" className="relative group cursor-pointer">
                            {/* Royal Glow Effect emitting from the square - visible only on hover */}
                            <div className="absolute inset-0 bg-amber-500 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-yellow-300/20 group-hover:scale-105 transition-transform duration-300">
                                <Crown size={22} className="text-black fill-yellow-950/20" strokeWidth={2.5} />
                            </div>
                        </NavLink>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tight text-white leading-none">REAL</span>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase">Mentoria</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="lg:hidden text-zinc-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                    <div>
                        {/* <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-4">Foco</h3> */}
                        <div className="space-y-1">
                            {focusItems.map(renderMenuItem)}
                        </div>
                    </div>

                    {/* 
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-4">Em Desenvolvimento</h3>
                        <div className="space-y-1">
                            {devItems.map(renderMenuItem)}
                        </div>
                    </div>
                    */}
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 mb-4 transition-colors hover:bg-zinc-800/50 group">
                        <NavLink to="/profile" className="block" onClick={() => setMobileMenuOpen(false)}>
                            <div className="flex items-center gap-3 mb-3">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="User"
                                        className="w-10 h-10 object-cover rounded-full border border-zinc-700 group-hover:border-zinc-500 transition-colors"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                        <span className="text-xs font-bold text-zinc-400">
                                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate text-white group-hover:text-primary transition-colors">
                                        {profile?.full_name || user?.email?.split('@')[0]}
                                    </p>
                                </div>
                            </div>

                        </NavLink>
                    </div>

                    <button
                        onClick={() => setLogoutConfirmationOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            {logoutConfirmationOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                        <h3 className="text-lg font-bold text-white mb-2">Sair da Plataforma?</h3>
                        <p className="text-zinc-400 text-sm mb-6">
                            Você precisará fazer login novamente para acessar sua conta.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setLogoutConfirmationOpen(false)}
                                className="flex-1 px-4 py-2 text-zinc-300 hover:bg-zinc-800 rounded-xl transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-bold"
                            >
                                Sim, sair
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <div className="lg:hidden h-16 border-b border-zinc-800 flex items-center px-4 justify-between bg-surface z-30">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="text-zinc-400 p-2 hover:bg-zinc-800 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-white">Real Mentoria</span>
                    <div className="w-8" /> {/* Spacer */}
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Global Study Tools */}
            <StudyStopwatch
                isOpen={isTimerOpen}
                onClose={closeTimer}
                onFinish={(seconds) => {
                    closeTimer();
                    openSessionModal(seconds);
                }}
            />

            <StudySessionModal
                isOpen={isSessionModalOpen}
                onClose={closeSessionModal}
                totalSeconds={sessionSeconds}
                onSuccess={() => {
                    closeSessionModal();
                    // Optionally force refresh dashboard or something? 
                    // The modals refresh usually. But if on Schedule page, might not update.
                    // Ideally use a global refresh trigger or query invalidation.
                    window.location.reload(); // Simple brute force update for now
                }}
            />
        </div>
    );
}
