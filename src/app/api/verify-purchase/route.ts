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

    const { platform, transactionId, productId } = await request.json()

    if (!platform || !transactionId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Importar Supabase apenas quando necessário
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Verify purchase with platform (simplified - in production implement proper verification)
    let isValidPurchase = false
    
    if (platform === 'apple') {
      // Verify with Apple App Store
      isValidPurchase = await verifyApplePurchase(transactionId)
    } else if (platform === 'google') {
      // Verify with Google Play Store
      isValidPurchase = await verifyGooglePurchase(transactionId, productId)
    }

    if (!isValidPurchase) {
      return NextResponse.json(
        { error: 'Invalid purchase' },
        { status: 400 }
      )
    }

    // Create or update subscription
    const subscriptionData = {
      user_id: user.id,
      status: 'active',
      plan_type: 'premium',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      ...(platform === 'apple' && { apple_subscription_id: transactionId }),
      ...(platform === 'google' && { google_subscription_id: transactionId })
    }

    // Check if subscription already exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let subscription
    if (existingSubscription) {
      // Update existing subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          ...subscriptionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
        .select()
        .single()

      if (error) throw error
      subscription = data
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single()

      if (error) throw error
      subscription = data
    }

    // Create welcome reward
    await supabase
      .from('rewards')
      .insert({
        user_id: user.id,
        title: 'Bem-vindo ao Premium!',
        description: 'Você agora tem acesso ilimitado ao Yumix',
        points: 100,
        completed: true,
        completed_at: new Date().toISOString(),
        reward_type: 'special'
      })

    return NextResponse.json({ 
      success: true, 
      subscription 
    })

  } catch (error) {
    console.error('Purchase verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simplified verification functions - implement proper verification in production
async function verifyApplePurchase(transactionId: string): Promise<boolean> {
  // In production, verify with Apple's App Store Server API
  // For now, return true for demo purposes
  console.log('Verifying Apple purchase:', transactionId)
  return true
}

async function verifyGooglePurchase(transactionId: string, productId: string): Promise<boolean> {
  // In production, verify with Google Play Developer API
  // For now, return true for demo purposes
  console.log('Verifying Google purchase:', transactionId, productId)
  return true
}