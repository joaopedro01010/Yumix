import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erro na autenticação:', error)
        return NextResponse.redirect(new URL('/?error=auth_error', request.url))
      }

      if (data.user) {
        // Criar ou atualizar perfil do usuário
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
            avatar_url: data.user.user_metadata?.avatar_url,
            is_premium: false,
            free_photos_used: 0,
            updated_at: new Date().toISOString()
          })

        if (upsertError) {
          console.error('Erro ao criar perfil:', upsertError)
        }

        // Criar perfil do usuário se não existir
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: data.user.id,
            streak_count: 0,
            total_points: 0,
            level: 1,
            preferences: {},
            goals: {},
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Erro ao criar perfil do usuário:', profileError)
        }
      }

      return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
      console.error('Erro no callback:', error)
      return NextResponse.redirect(new URL('/?error=callback_error', request.url))
    }
  }

  return NextResponse.redirect(new URL('/', request.url))
}