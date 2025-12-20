import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ success: false, error: 'Missing verification params' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    if (!keySecret) {
      return new Response(JSON.stringify({ success: false, error: 'Config error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', encoder.encode(keySecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signatureBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const computedSignature = Array.from(new Uint8Array(signatureBytes)).map(b => b.toString(16).padStart(2, '0')).join('');

    if (computedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update payment record
    const { data: payment, error: updateError } = await supabaseClient
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        payment_status: 'success',
        verified_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select('id, provider_id, amount, payer_name')
      .single();

    if (updateError) {
      console.error('❌ UPDATE ERROR:', updateError);
      return new Response(JSON.stringify({ success: false, error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Payment verified:', payment.id);

    // Update provider balance
    if (payment.provider_id && payment.amount) {
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('account_balance')
        .eq('id', payment.provider_id)
        .single();

      const newBalance = (profile?.account_balance || 0) + payment.amount;

      const { error: balanceError } = await supabaseClient
        .from('profiles')
        .update({ account_balance: newBalance })
        .eq('id', payment.provider_id);

      if (balanceError) {
        console.error('❌ BALANCE ERROR:', balanceError);
      } else {
        console.log('✅ Balance updated:', newBalance);
      }

      // Create notification for provider
      const { error: notifError } = await supabaseClient
        .from('notifications')
        .insert({
          user_id: payment.provider_id,
          title: 'Payment Received! 💰',
          message: `You received ₹${payment.amount.toFixed(2)}${payment.payer_name ? ` from ${payment.payer_name}` : ''}`,
          type: 'payment',
          read: false,
          payment_id: payment.id,
        });

      if (notifError) {
        console.error('❌ NOTIFICATION ERROR:', notifError);
      } else {
        console.log('✅ Notification sent to provider:', payment.provider_id);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified',
      paymentId: razorpay_payment_id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
