'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { auth, users } from '@/lib/supabase'
import type { User as UserProfile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signInWithApple: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      const { data: profile } = await users.getProfile(user.id)
      if (profile) {
        setUserProfile(profile)
      }
    }
  }

  useEffect(() => {
    // Verificar usuário atual
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      if (user) {
        refreshProfile()
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await refreshProfile()
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await auth.signIn(email, password)
    return { error }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await auth.signUp(email, password, fullName)
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await auth.signInWithGoogle()
    return { error }
  }

  const signInWithApple = async () => {
    const { error } = await auth.signInWithApple()
    return { error }
  }

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
    setUserProfile(null)
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}