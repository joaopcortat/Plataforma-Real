import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

// ─── Types ───────────────────────────────────────────────
export type PlanType = 'trimestral' | 'semestral' | 'anual' | 'manual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Subscription {
    id: string;
    user_id: string;
    plan: PlanType;
    status: SubscriptionStatus;
    started_at: string;
    expires_at: string;
    cancelled_at?: string;
    kiwify_order_id?: string;
    kiwify_customer_email?: string;
    granted_by_admin: boolean;
    admin_note?: string;
    created_at: string;
}

interface SubscriptionContextValue {
    subscription: Subscription | null;
    isActive: boolean;
    isLoading: boolean;
    daysRemaining: number | null;
    expiresAt: Date | null;
    planLabel: string;
    refresh: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────
const SubscriptionContext = createContext<SubscriptionContextValue>({
    subscription: null,
    isActive: false,
    isLoading: true,
    daysRemaining: null,
    expiresAt: null,
    planLabel: '',
    refresh: async () => { },
});

// ─── Helpers ─────────────────────────────────────────────
const PLAN_LABELS: Record<PlanType, string> = {
    trimestral: 'Trimestral',
    semestral: 'Semestral',
    anual: 'Anual',
    manual: 'Acesso Manual',
};

function getDaysRemaining(expiresAt: string): number {
    const now = new Date();
    const exp = new Date(expiresAt);
    const diff = exp.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// ─── Provider ────────────────────────────────────────────
export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchSubscription() {
        if (!user) {
            setSubscription(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .gt('expires_at', new Date().toISOString())
                .order('expires_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            setSubscription(data);
        } catch (err) {
            console.error('Error fetching subscription:', err);
            setSubscription(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSubscription();
    }, [user?.id]);

    const isActive = subscription !== null;
    const expiresAt = subscription ? new Date(subscription.expires_at) : null;
    const daysRemaining = subscription ? getDaysRemaining(subscription.expires_at) : null;
    const planLabel = subscription ? PLAN_LABELS[subscription.plan] : '';

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            isActive,
            isLoading,
            daysRemaining,
            expiresAt,
            planLabel,
            refresh: fetchSubscription,
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    return useContext(SubscriptionContext);
}
