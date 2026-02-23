import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useAuth } from '../../contexts/AuthContext';

// ─── Guard de Rota ────────────────────────────────────────
interface RequireSubscriptionProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export function RequireSubscription({ children, requireAuth = true }: RequireSubscriptionProps) {
    const { user, loading: authLoading } = useAuth();
    const { isLoading: subLoading } = useSubscription();

    // Ainda carregando
    if (authLoading || subLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Não autenticado → /login
    if (requireAuth && !user) {
        return <Navigate to="/login" replace />;
    }

    // ⚠️  BETA: qualquer usuário autenticado tem acesso livre.
    // Reative a verificação abaixo quando o checkout estiver pronto:
    // if (user && !isActive) return <UpgradeWall />;

    return <>{children}</>;
}
