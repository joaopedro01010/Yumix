'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from 'lucide-react'
import { toast } from 'sonner'

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, signInWithApple, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  
  // Formulário de cadastro
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      window.location.href = '/'
    }
  }, [user])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(loginData.email, loginData.password)
      
      if (error) {
        toast.error('Erro ao fazer login: ' + error.message)
      } else {
        toast.success('Login realizado com sucesso!')
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (signupData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(signupData.email, signupData.password, signupData.fullName)
      
      if (error) {
        toast.error('Erro ao criar conta: ' + error.message)
      } else {
        toast.success('Conta criada com sucesso! Verifique seu email.')
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error('Erro ao fazer login com Google: ' + error.message)
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login com Google')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await signInWithApple()
      if (error) {
        toast.error('Erro ao fazer login com Apple: ' + error.message)
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login com Apple')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">Y</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Yumix
          </CardTitle>
          <CardDescription>
            Seu chef pessoal com inteligência artificial
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      className="pl-10 pr-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="pl-10"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      className="pl-10 pr-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirme sua senha"
                      className="pl-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={loading}
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continue com</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={handleAppleLogin}
                disabled={loading}
                className="w-full"
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}