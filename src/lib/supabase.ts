import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  is_premium: boolean
  free_photos_used: number
  subscription_id?: string
  subscription_status?: 'active' | 'canceled' | 'expired'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  streak_count: number
  total_points: number
  level: number
  preferences: any
  goals: any
  created_at: string
  updated_at: string
}

export interface MealAnalysis {
  id: string
  user_id: string
  image_url: string
  analysis_type: 'recipe' | 'ingredients' | 'calories'
  result: any
  calories?: number
  ingredients?: string[]
  created_at: string
}

export interface SavedMeal {
  id: string
  user_id: string
  meal_analysis_id: string
  name: string
  is_favorite: boolean
  created_at: string
}

export interface UserReward {
  id: string
  user_id: string
  reward_type: string
  reward_data: any
  earned_at: string
}

export interface UserMission {
  id: string
  user_id: string
  mission_type: string
  mission_data: any
  status: 'active' | 'completed' | 'expired'
  progress: number
  target: number
  created_at: string
  completed_at?: string
}

// Funções de autenticação
export const auth = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  },

  signInWithApple: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Funções para usuários
export const users = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  incrementPhotoUsage: async (userId: string) => {
    const { data, error } = await supabase.rpc('increment_photo_usage', {
      user_id: userId
    })
    return { data, error }
  },

  upgradeToPremium: async (userId: string, subscriptionId: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_premium: true,
        subscription_id: subscriptionId,
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  cancelSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },
}

// Funções para análises de refeições
export const mealAnalyses = {
  create: async (analysis: Omit<MealAnalysis, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('meal_analyses')
      .insert(analysis)
      .select()
      .single()
    return { data, error }
  },

  getByUser: async (userId: string, limit = 20) => {
    const { data, error } = await supabase
      .from('meal_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('meal_analyses')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },
}

// Funções para refeições salvas
export const savedMeals = {
  save: async (userId: string, mealAnalysisId: string, name: string) => {
    const { data, error } = await supabase
      .from('saved_meals')
      .insert({
        user_id: userId,
        meal_analysis_id: mealAnalysisId,
        name,
        is_favorite: false
      })
      .select()
      .single()
    return { data, error }
  },

  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('saved_meals')
      .select(`
        *,
        meal_analyses (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  toggleFavorite: async (id: string, isFavorite: boolean) => {
    const { data, error } = await supabase
      .from('saved_meals')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('saved_meals')
      .delete()
      .eq('id', id)
    return { error }
  },
}

// Funções para perfil do usuário
export const userProfiles = {
  get: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    return { data, error }
  },

  upsert: async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    return { data, error }
  },

  updateStreak: async (userId: string, streakCount: number) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        streak_count: streakCount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
    return { data, error }
  },

  addPoints: async (userId: string, points: number) => {
    const { data, error } = await supabase.rpc('add_user_points', {
      user_id: userId,
      points_to_add: points
    })
    return { data, error }
  },
}

// Funções para recompensas
export const rewards = {
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
    return { data, error }
  },

  earn: async (userId: string, rewardType: string, rewardData: any) => {
    const { data, error } = await supabase
      .from('user_rewards')
      .insert({
        user_id: userId,
        reward_type: rewardType,
        reward_data: rewardData
      })
      .select()
      .single()
    return { data, error }
  },
}

// Funções para missões
export const missions = {
  getByUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  create: async (mission: Omit<UserMission, 'id' | 'created_at' | 'completed_at'>) => {
    const { data, error } = await supabase
      .from('user_missions')
      .insert(mission)
      .select()
      .single()
    return { data, error }
  },

  updateProgress: async (id: string, progress: number) => {
    const { data, error } = await supabase
      .from('user_missions')
      .update({ progress })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  complete: async (id: string) => {
    const { data, error } = await supabase
      .from('user_missions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },
}