import { NextRequest, NextResponse } from 'next/server'

// Força a rota a ser dinâmica para evitar problemas no build
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão disponíveis
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration not available' },
        { status: 503 }
      )
    }

    // Importar Supabase apenas quando necessário
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { subscriptionId, status, platform } = await request.json()

    if (!subscriptionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from auth header or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extract user ID from auth token (simplified - in production use proper JWT verification)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Update subscription status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // Set platform-specific subscription ID
    if (platform === 'stripe') {
      updateData.stripe_subscription_id = subscriptionId
    } else if (platform === 'apple') {
      updateData.apple_subscription_id = subscriptionId
    } else if (platform === 'google') {
      updateData.google_subscription_id = subscriptionId
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating subscription:', error)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      subscription: data 
    })

  } catch (error) {
    console.error('Subscription sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}