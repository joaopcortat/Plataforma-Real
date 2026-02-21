// ═══════════════════════════════════════════════════════════
//  KIWIFY WEBHOOK — Supabase Edge Function
//  Recebe eventos do Kiwify e gerencia assinaturas
//
//  Eventos tratados:
//  - order_approved     → cria/renova assinatura
//  - order_refunded     → cancela assinatura
//  - subscription_cancelled → cancela assinatura
//  - subscription_expired   → marca como expirada
// ═══════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const KIWIFY_TOKEN = Deno.env.get('KIWIFY_WEBHOOK_TOKEN')!; // token secreto do Kiwify

const sb = createClient(SUPABASE_URL, SERVICE_KEY);

// Duração de cada plano em dias
const PLAN_DURATION: Record<string, number> = {
    trimestral: 92,
    semestral: 183,
    anual: 365,
};

// Mapeamento: nome do produto Kiwify → plano interno
function detectPlan(productName: string): string {
    const name = productName.toLowerCase();
    if (name.includes('anual')) return 'anual';
    if (name.includes('semestral')) return 'semestral';
    if (name.includes('trimestral')) return 'trimestral';
    return 'trimestral'; // fallback
}

function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

Deno.serve(async (req: Request) => {
    // ── Verificação de segurança ──
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    // ── Parse body PRIMEIRO para extrair token do Kiwify ──
    let body: any;
    try {
        body = await req.json();
    } catch {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Kiwify envia o token dentro do body como campo 'token'
    const url = new URL(req.url);
    const token =
        body?.token ||
        req.headers.get('x-kiwify-token') ||
        url.searchParams.get('token');

    if (KIWIFY_TOKEN && token !== KIWIFY_TOKEN) {
        console.error('Invalid webhook token. Received:', token);
        return new Response('Unauthorized', { status: 401 });
    }

    console.log('Kiwify webhook received:', JSON.stringify(body, null, 2));

    const event = body?.webhook_event_type || body?.type;
    const order = body?.order || body;

    // ── Extrai dados do pedido ──
    const customerEmail = order?.Customer?.email || order?.customer?.email || order?.email;
    const orderId = order?.id || order?.order_id;
    const subscriptionId = order?.subscription?.id || order?.subscription_id;
    // Detecta plano pelo nome do produto OU pelo plano da assinatura
    const productName = order?.Product?.name || order?.product?.name ||
        order?.Subscription?.plan || order?.subscription?.plan || '';

    if (!customerEmail) {
        console.error('No customer email in webhook payload');
        return new Response('Missing customer email', { status: 400 });
    }

    console.log(`Event: ${event} | Email: ${customerEmail} | Product: ${productName}`);

    // ── Busca usuário pelo email ──
    const { data: users } = await sb.auth.admin.listUsers();
    const user = users?.users?.find((u: any) => u.email === customerEmail);

    if (!user) {
        // Usuário ainda não tem conta — salva pendente para quando criar
        console.log(`User not found for email ${customerEmail}, saving pending subscription`);
        await sb.from('subscriptions').upsert({
            user_id: '00000000-0000-0000-0000-000000000000', // placeholder
            plan: detectPlan(productName),
            status: 'pending',
            started_at: new Date().toISOString(),
            expires_at: addDays(new Date(), PLAN_DURATION[detectPlan(productName)]).toISOString(),
            kiwify_order_id: orderId,
            kiwify_subscription_id: subscriptionId,
            kiwify_customer_email: customerEmail,
        }, { onConflict: 'kiwify_order_id' });

        return new Response(JSON.stringify({ ok: true, status: 'pending_user' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const userId = user.id;
    const plan = detectPlan(productName);
    const now = new Date();

    // ── Processa evento ──
    if (event === 'order_approved' || event === 'purchase_approved') {
        // Verifica se já existe assinatura ativa para renovar
        const { data: existing } = await sb.from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('expires_at', { ascending: false })
            .limit(1)
            .single();

        // Se já tem assinatura ativa, renova a partir do vencimento atual
        const startFrom = existing?.expires_at && new Date(existing.expires_at) > now
            ? new Date(existing.expires_at)
            : now;

        const expiresAt = addDays(startFrom, PLAN_DURATION[plan]);

        await sb.from('subscriptions').upsert({
            user_id: userId,
            plan,
            status: 'active',
            started_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
            kiwify_order_id: orderId,
            kiwify_subscription_id: subscriptionId,
            kiwify_customer_email: customerEmail,
            granted_by_admin: false,
        }, { onConflict: 'kiwify_order_id' });

        console.log(`✅ Subscription activated for ${customerEmail} until ${expiresAt.toISOString()}`);

    } else if (event === 'order_refunded' || event === 'subscription_cancelled' || event === 'purchase_refunded') {
        await sb.from('subscriptions')
            .update({ status: 'cancelled', cancelled_at: now.toISOString() })
            .eq('user_id', userId)
            .eq('status', 'active');

        console.log(`❌ Subscription cancelled for ${customerEmail}`);

    } else if (event === 'subscription_renewed') {
        // Renovação automática — estende a assinatura existente
        const { data: existing } = await sb.from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('expires_at', { ascending: false })
            .limit(1)
            .single();

        const startFrom = existing?.expires_at && new Date(existing.expires_at) > now
            ? new Date(existing.expires_at)
            : now;
        const renewedPlan = existing?.plan || plan;
        const expiresAt = addDays(startFrom, PLAN_DURATION[renewedPlan] || 92);

        await sb.from('subscriptions')
            .update({ expires_at: expiresAt.toISOString(), updated_at: now.toISOString() })
            .eq('user_id', userId)
            .eq('status', 'active');

        console.log(`🔄 Subscription renewed for ${customerEmail} until ${expiresAt.toISOString()}`);

    } else if (event === 'subscription_expired') {
        await sb.from('subscriptions')
            .update({ status: 'expired' })
            .eq('user_id', userId)
            .eq('status', 'active');

        console.log(`⏰ Subscription expired for ${customerEmail}`);

    } else {
        console.log(`Unhandled event type: ${event}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
});
