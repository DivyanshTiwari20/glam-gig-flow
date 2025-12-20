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
    const { amount, providerId, payerName, payerEmail, payerPhone, userId } = body;

    if (!amount || amount <= 0 || !payerName || !payerEmail || !payerPhone) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')?.trim();
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();

    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ success: false, error: 'Server config error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authBase64 = btoa(`${keyId}:${keySecret}`);
    const receipt = `pay_${Date.now()}`;

    // Create Razorpay order
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: { providerId, payerName, payerEmail, payerPhone, userId: userId || 'guest' },
      }),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.json();
      console.error('Razorpay error:', errorData);
      return new Response(JSON.stringify({ success: false, error: 'Razorpay failed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = await razorpayResponse.json();

    // Insert payment - ONLY columns that exist
    const { data: insertData, error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: userId || null,
        amount: amount / 100,
        currency: 'INR',
        payment_status: 'pending',
        payment_method: 'razorpay',
        razorpay_order_id: order.id,
        payer_name: payerName,
        payer_email: payerEmail,
        payer_phone: payerPhone,
        provider_id: providerId,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('❌ INSERT ERROR:', dbError);
      return new Response(JSON.stringify({ success: false, error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Payment created:', insertData.id);

    return new Response(JSON.stringify({
      success: true,
      orderId: order.id,
      keyId,
      amount: order.amount,
      currency: 'INR',
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
