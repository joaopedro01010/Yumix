'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Home, TrendingUp, Settings, User, Bell, Palette, ChevronRight, Plus, Calendar, BarChart3, Flame, Apple, Crown, Check, Utensils, ChefHat, Zap, UtensilsCrossed } from 'lucide-react'

export default function YumixApp() {
  const [currentScreen, setCurrentScreen] = useState('home') // Mudança: inicia direto na home
  const [streak, setStreak] = useState(15)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [freePhotos, setFreePhotos] = useState(2) // 3, 2, 1 para cores diferentes
  const [isPremium, setIsPremium] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null) // Para controlar qual botão está selecionado
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // Mock data
  const savedMeals = [
    { id: 1, name: 'Salmão Grelhado', calories: 420, time: 'Hoje, 12:30', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop' },
    { id: 2, name: 'Salada Caesar', calories: 280, time: 'Ontem, 19:45', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
    { id: 3, name: 'Smoothie Verde', calories: 180, time: '2 dias atrás', image: 'https://images.unsplash.com/photo-1610970881699-44a587cabec?w=400&h=300&fit=crop' },
    { id: 4, name: 'Pizza Margherita', calories: 650, time: '3 dias atrás', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop' },
    { id: 5, name: 'Açaí Bowl', calories: 320, time: '4 dias atrás', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop' },
  ]

  const progressData = {
    '7d': { calories: 1850, target: 2000, percentage: 92, data: [1800, 1900, 1750, 2100, 1850, 1950, 1850] },
    '1m': { calories: 58500, target: 60000, percentage: 97, data: [1850, 1900, 1800, 2000, 1950, 1850, 1900] },
    '6m': { calories: 345000, target: 360000, percentage: 96, data: [1900, 1850, 1950, 2000, 1800, 1900, 1850] },
    '1y': { calories: 720000, target: 730000, percentage: 99, data: [1850, 1900, 1950, 1800, 2000, 1850, 1900] },
    'total': { calories: 1250000, target: 1300000, percentage: 96, data: [1900, 1850, 2000, 1950, 1800, 1900, 1850] }
  }

  // Camera setup
  useEffect(() => {
    if (currentScreen === 'home') {
      startCamera()
    } else {
      stopCamera()
    }
    
    return () => stopCamera()
  }, [currentScreen])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.log('Camera access denied or not available')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
  }

  const capturePhoto = (type: string) => {
    if (freePhotos > 0 && !isPremium) {
      setFreePhotos(prev => prev - 1)
    }
    // Simulate photo analysis
    setTimeout(() => setCurrentScreen('result'), 1000)
  }

  // Theme colors
  const bgColor = isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'
  const cardBg = isLightTheme ? 'bg-gray-50' : 'bg-[#1A1A1F]'
  const textPrimary = isLightTheme ? 'text-gray-900' : 'text-white'
  const textSecondary = isLightTheme ? 'text-gray-600' : 'text-[#C8C9CC]'
  const borderColor = isLightTheme ? 'border-gray-200' : 'border-white/10'

  // Logo Component usando a imagem real da Yumix
  const YumixLogo = ({ size = 'normal', showText = false, translucent = false }) => (
    <div className={`flex items-center gap-2 ${translucent ? 'opacity-70' : ''}`}>
      <img 
        src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/57b06054-2f07-4b8d-9587-981abfa6ef54.jpg" 
        alt="Yumix Logo" 
        className={`${size === 'large' ? 'h-12 w-auto' : 'h-8 w-auto'} object-contain`}
      />
    </div>
  )

  // Header Component com contador de fotos no meio - mais compacto
  const Header = () => (
    <div className={`fixed top-0 left-0 right-0 z-50 ${bgColor}/95 backdrop-blur-xl ${borderColor} border-b`}>
      <div className="flex items-center justify-between px-4 py-3">
        <YumixLogo translucent />
        
        {/* Contador de fotos no meio - mais compacto */}
        {!isPremium && (
          <div className={`bg-[#0F0F12] px-2 py-1 rounded-lg shadow-md ${borderColor} border`}>
            <div className="flex items-center gap-1">
              <span className={`font-bold text-sm ${freePhotos >= 2 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {freePhotos}
              </span>
              <span className={`text-xs ${freePhotos >= 2 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                fotos
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] px-3 py-1.5 rounded-full shadow-lg">
          <Flame className="w-4 h-4 text-white" />
          <span className="text-white font-semibold text-sm">{streak}</span>
        </div>
      </div>
    </div>
  )

  // Sliding Bottom Navigation
  const SlidingBottomNav = () => (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`${cardBg}/90 backdrop-blur-xl ${borderColor} border rounded-full px-2 py-2 shadow-2xl`}>
        <div className="flex items-center gap-1">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'progress', icon: TrendingUp, label: 'Progresso' },
            { id: 'saved', icon: Camera, label: 'Salvas' },
            { id: 'settings', icon: Settings, label: 'Config' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
                currentScreen === item.id 
                  ? 'bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] shadow-lg text-white' 
                  : `${textSecondary} hover:${textPrimary}`
              }`}
            >
              <item.icon className="w-4 h-4" />
              {currentScreen === item.id && (
                <span className="text-xs font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Circular Progress Component
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${circumference} ${circumference}`
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B3D" />
              <stop offset="50%" stopColor="#FF4BB2" />
              <stop offset="100%" stopColor="#A43EEB" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${textPrimary}`}>{percentage}%</div>
            <div className={`text-xs ${textSecondary}`}>Meta</div>
          </div>
        </div>
      </div>
    )
  }

  // Apple Health Style Chart
  const AppleHealthChart = ({ data }: { data: number[] }) => (
    <div className="relative h-32 flex items-end justify-between px-4">
      {data.map((value, index) => {
        const height = (value / Math.max(...data)) * 100
        return (
          <div key={index} className="flex flex-col items-center gap-2">
            <div 
              className="w-6 bg-gradient-to-t from-[#10B981] to-[#06D6A0] rounded-full transition-all duration-1000 hover:scale-110 cursor-pointer"
              style={{ height: `${height}%` }}
            />
            <div className="w-2 h-2 bg-[#10B981] rounded-full opacity-80" />
          </div>
        )
      })}
    </div>
  )

  // Splash Screen
  const SplashScreen = () => (
    <div className={`min-h-screen ${bgColor} bg-gradient-to-br from-[#0F0F12] via-[#1A1A1F] to-[#0F0F12] flex flex-col items-center justify-center px-6`}>
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <div className="relative">
          <YumixLogo size="large" />
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] rounded-full opacity-20 blur-xl animate-pulse"></div>
        </div>
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Bem-vindo ao Yumix
          </h1>
          <p className="text-[#C8C9CC] text-lg max-w-sm">
            Descubra receitas e calorias através de fotos dos seus pratos
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-sm mt-8">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border border-white/20"
          >
            <Apple className="w-5 h-5" />
            Entrar com Apple
          </button>
          
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  )

  // Home Screen with Live Camera
  const HomeScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24`}>
      <Header />
      
      <div className="px-4 space-y-4">
        {/* Live Camera Feed */}
        <div className="relative">
          <div className="relative w-full aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!cameraStream && (
              <div className={`absolute inset-0 ${cardBg} flex items-center justify-center`}>
                <div className="text-center space-y-4">
                  <Camera className={`w-16 h-16 ${textSecondary} mx-auto`} />
                  <p className={`${textSecondary} text-sm`}>
                    Câmera não disponível
                  </p>
                </div>
              </div>
            )}
            {/* Elegant white frame overlay */}
            <div className="absolute inset-0 border-2 border-white/40 rounded-3xl pointer-events-none" />
            <div className="absolute inset-2 border border-white/20 rounded-3xl pointer-events-none" />
          </div>
        </div>

        {/* Three Option Buttons com gradiente preto/branco e seleção Yumix - menores e alinhados */}
        <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
          <button 
            onClick={() => setSelectedOption(selectedOption === 'recipe' ? null : 'recipe')}
            className={`w-full p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'recipe' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : 'bg-gradient-to-r from-black to-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <ChefHat className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-semibold">Receita + Calorias</span>
            </div>
          </button>

          <button 
            onClick={() => setSelectedOption(selectedOption === 'ingredients' ? null : 'ingredients')}
            className={`w-full p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'ingredients' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : 'bg-gradient-to-r from-black to-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-semibold">O que fazer com meus ingredientes</span>
            </div>
          </button>

          <button 
            onClick={() => setSelectedOption(selectedOption === 'calories' ? null : 'calories')}
            className={`w-full p-3 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'calories' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : 'bg-gradient-to-r from-black to-white/20'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-semibold">Somente Calorias</span>
            </div>
          </button>
        </div>

        {/* Botão para tirar foto */}
        <div className="flex justify-center pt-2">
          <button 
            onClick={() => capturePhoto('photo')}
            className="w-16 h-16 bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Progress Screen with Apple Health Style and Circular Progress
  const ProgressScreen = () => {
    const currentData = progressData[selectedPeriod]
    
    return (
      <div className={`min-h-screen ${bgColor} pt-16 pb-24`}>
        <Header />
        
        <div className="px-4 space-y-6">
          {/* Compact Sliding Period Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: '7d', label: '7d' },
              { key: '1m', label: '1m' },
              { key: '6m', label: '6m' },
              { key: '1y', label: '1a' },
              { key: 'total', label: 'Total' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] text-white shadow-lg'
                    : `bg-gradient-to-r from-black to-white/20 ${textSecondary} ${borderColor} border`
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Informações com Progresso Circular */}
          <div className={`${cardBg} p-4 rounded-3xl ${borderColor} border`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className={`${textPrimary} text-xl font-bold`}>{currentData.calories.toLocaleString()}</h3>
                <p className={`${textSecondary} text-sm`}>de {currentData.target.toLocaleString()} kcal</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className={`${textSecondary} text-xs`}>Streak atual</span>
                    <span className={`${textPrimary} font-semibold text-xs`}>{streak} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary} text-xs`}>Média diária</span>
                    <span className={`${textPrimary} font-semibold text-xs`}>1,847 kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${textSecondary} text-xs`}>Melhor dia</span>
                    <span className={`${textPrimary} font-semibold text-xs`}>2,100 kcal</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <CircularProgress percentage={currentData.percentage} size={100} />
              </div>
            </div>
            
            <AppleHealthChart data={currentData.data} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border`}>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#FF6B3D]" />
                <span className={`${textPrimary} font-semibold text-xs`}>Streak</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>{streak}</p>
              <p className={`${textSecondary} text-xs`}>dias consecutivos</p>
            </div>
            
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span className={`${textPrimary} font-semibold text-xs`}>Média</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>1,847</p>
              <p className={`${textSecondary} text-xs`}>kcal por dia</p>
            </div>
          </div>
        </div>
        
        <SlidingBottomNav />
      </div>
    )
  }

  // Saved Meals Screen
  const SavedMealsScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <h2 className={`${textPrimary} text-xl font-bold`}>Refeições Salvas</h2>

        <div className="grid grid-cols-1 gap-3">
          {savedMeals.map((meal) => (
            <div key={meal.id} className={`${cardBg} rounded-2xl overflow-hidden ${borderColor} border shadow-lg`}>
              <img 
                src={meal.image} 
                alt={meal.name}
                className="w-full h-24 object-cover"
              />
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`${textPrimary} font-semibold text-sm`}>{meal.name}</h3>
                  <span className="bg-gradient-to-r from-[#FF6B3D] to-[#FF4BB2] text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {meal.calories} kcal
                  </span>
                </div>
                <p className={`${textSecondary} text-xs`}>{meal.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Result Screen (after photo capture)
  const ResultScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-6 pb-24`}>
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`w-10 h-10 ${cardBg} rounded-full flex items-center justify-center ${borderColor} border`}
          >
            <ChevronRight className={`w-5 h-5 ${textPrimary} rotate-180`} />
          </button>
          <h2 className={`${textPrimary} font-semibold`}>Análise Completa</h2>
          <div className="w-10 h-10"></div>
        </div>

        {/* Photo Result */}
        <div className={`${cardBg} rounded-3xl overflow-hidden ${borderColor} border`}>
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop"
            alt="Prato analisado"
            className="w-full h-40 object-cover"
          />
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`${textPrimary} text-lg font-bold`}>Salmão Grelhado</h3>
              <span className="bg-gradient-to-r from-[#FF6B3D] to-[#FF4BB2] text-white px-3 py-1 rounded-full text-sm font-semibold">
                420 kcal
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[#10B981] font-semibold text-sm">28g</p>
                <p className={`${textSecondary} text-xs`}>Proteína</p>
              </div>
              <div>
                <p className="text-[#FF6B3D] font-semibold text-sm">12g</p>
                <p className={`${textSecondary} text-xs`}>Gordura</p>
              </div>
              <div>
                <p className="text-[#A43EEB] font-semibold text-sm">8g</p>
                <p className={`${textSecondary} text-xs`}>Carboidrato</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentScreen('home')}
            className={`flex-1 ${cardBg} ${textPrimary} py-3 rounded-2xl font-semibold ${borderColor} border text-sm`}
          >
            Voltar ao Início
          </button>
          <button className="flex-1 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] text-white py-3 rounded-2xl font-semibold text-sm">
            Salvar Refeição
          </button>
        </div>
      </div>
    </div>
  )

  // Settings Screen simplificado (removidas opções solicitadas)
  const SettingsScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <h2 className={`${textPrimary} text-xl font-bold`}>Configurações</h2>

        {/* Premium Button */}
        {!isPremium && (
          <button 
            onClick={() => setIsPremium(true)}
            className="w-full bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] p-4 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-white" />
              <span className="text-white text-lg font-bold">Assinar Yumix Premium</span>
            </div>
            <div className="space-y-1 text-white/90 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Fotos ilimitadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Receitas detalhadas</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Análise nutricional avançada</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3 h-3" />
                <span>Histórico completo</span>
              </div>
            </div>
          </button>
        )}

        <div className="space-y-3">
          {[
            { 
              icon: Palette, 
              title: 'Tema', 
              subtitle: isLightTheme ? 'Claro' : 'Escuro',
              action: () => setIsLightTheme(!isLightTheme)
            }
          ].map((item, index) => (
            <button 
              key={index} 
              onClick={item.action}
              className={`w-full flex items-center justify-between bg-gradient-to-r from-black to-white/20 p-3 rounded-2xl ${borderColor} border transition-all duration-300 hover:border-[#FF6B3D]/50 hover:from-[#FF6B3D] hover:to-[#A43EEB] hover:text-white`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <item.icon className={`w-4 h-4 ${textPrimary}`} />
                </div>
                <div className="text-left">
                  <h3 className={`${textPrimary} font-medium text-sm`}>{item.title}</h3>
                  <p className={`${textSecondary} text-xs`}>{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${textSecondary}`} />
            </button>
          ))}
        </div>

        <div className="pt-6 text-center">
          <p className={`${textSecondary} text-xs`}>Versão 1.0.0</p>
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Screen Router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen />
      case 'home': return <HomeScreen />
      case 'progress': return <ProgressScreen />
      case 'saved': return <SavedMealsScreen />
      case 'result': return <ResultScreen />
      case 'settings': return <SettingsScreen />
      default: return <HomeScreen />
    }
  }

  return (
    <div className="font-inter antialiased">
      {renderScreen()}
    </div>
  )
}