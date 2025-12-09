import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') || ''

serve(async (req) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('No signature found in request')
      return new Response('No signature found', { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    console.log('✅ Webhook verified:', event.type)

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Extract the client_reference_id (User ID from frontend)
      const userId = session.client_reference_id

      if (!userId) {
        console.error('No client_reference_id found in session')
        return new Response('No user ID found', { status: 400 })
      }

      console.log('Processing payment for user:', userId)

      // Create Supabase Admin Client
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
      
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })

      // Update the user's profile to premium
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', userId)
        .select()

      if (error) {
        console.error('Database update error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to update profile' }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('✅ User upgraded to premium:', data)

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'User upgraded to premium',
          userId 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Handle other event types (optional)
    console.log('Unhandled event type:', event.type)

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

