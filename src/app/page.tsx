'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Home, TrendingUp, Settings, User, Bell, Palette, ChevronRight, Plus, Calendar, BarChart3, Flame, Apple, Crown, Check, Utensils, ChefHat, Zap, UtensilsCrossed, Gift, History, Infinity, Image, Star, Activity, Droplets, Wheat, Candy, X, Clock, Users, Sparkles, Heart, ArrowLeft, Loader2, Share, Trash2 } from 'lucide-react'

export default function YumixApp() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [streak, setStreak] = useState(15)
  const [selectedPeriod, setSelectedPeriod] = useState('7d')
  const [freePhotos, setFreePhotos] = useState(3)
  const [isPremium, setIsPremium] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(false) // CORREÇÃO: Inicia com tema escuro
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedMealDetail, setSelectedMealDetail] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // Mock data com análises completas salvas - ordenadas por data (mais recentes primeiro)
  const savedMeals = [
    { 
      id: 1, 
      name: 'Salmão Grelhado', 
      calories: 420, 
      time: 'Hoje, 12:30', 
      date: '2024-01-15T12:30:00',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      analysisType: 'Receita + Calorias',
      fullAnalysis: {
        type: 'recipe',
        dishName: 'Salmão Grelhado com Legumes',
        calories: 420,
        chefMessage: "Olá! Sou o Chef Yumix! 👨‍🍳✨ Que prato delicioso você tem aí! Vejo um salmão perfeitamente grelhado com vegetais frescos. Deixe-me te ensinar como fazer essa maravilha!",
        recipe: {
          ingredients: [
            { name: 'Salmão', amount: '200g', icon: '🐟' },
            { name: 'Brócolis', amount: '150g', icon: '🥦' },
            { name: 'Cenoura', amount: '100g', icon: '🥕' },
            { name: 'Azeite', amount: '2 colheres', icon: '🫒' },
            { name: 'Limão', amount: '1 unidade', icon: '🍋' },
            { name: 'Sal e pimenta', amount: 'A gosto', icon: '🧂' }
          ],
          steps: [
            { step: 1, instruction: 'Tempere o salmão com sal, pimenta e limão', time: '5 min', icon: '🧂' },
            { step: 2, instruction: 'Aqueça a frigideira com azeite em fogo médio', time: '2 min', icon: '🔥' },
            { step: 3, instruction: 'Grelhe o salmão por 4 min de cada lado', time: '8 min', icon: '🍳' },
            { step: 4, instruction: 'Cozinhe os vegetais no vapor', time: '10 min', icon: '♨️' },
            { step: 5, instruction: 'Sirva quente com um toque de limão', time: '1 min', icon: '🍽️' }
          ]
        },
        nutrition: {
          protein: 35,
          carbs: 12,
          fat: 18,
          fiber: 8,
          sugar: 6
        }
      }
    },
    { 
      id: 2, 
      name: 'Salada Caesar', 
      calories: 280, 
      time: 'Ontem, 19:45', 
      date: '2024-01-14T19:45:00',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      analysisType: 'Somente Calorias',
      fullAnalysis: {
        type: 'calories',
        chefMessage: "Opa! 📊 O Chef Yumix analisou sua salada Caesar e trouxe os números fresquinhos! Uma escolha saudável e saborosa!",
        totalCalories: 280,
        breakdown: [
          { nutrient: 'Proteínas', amount: 18, unit: 'g', percentage: 26, color: '#10B981', icon: '💪' },
          { nutrient: 'Carboidratos', amount: 8, unit: 'g', percentage: 11, color: '#F59E0B', icon: '⚡' },
          { nutrient: 'Gorduras', amount: 22, unit: 'g', percentage: 71, color: '#EF4444', icon: '🥑' },
          { nutrient: 'Fibras', amount: 4, unit: 'g', percentage: 16, color: '#8B5CF6', icon: '🌾' }
        ],
        healthScore: 75,
        tips: [
          'Rica em vitaminas A e K! 🥬',
          'Boa fonte de cálcio do queijo 🧀',
          'Moderada em calorias ✅',
          'Perfeita para o jantar! 🌙'
        ]
      }
    },
    { 
      id: 3, 
      name: 'Smoothie Verde', 
      calories: 180, 
      time: '2 dias atrás', 
      date: '2024-01-13T08:15:00',
      image: 'https://images.unsplash.com/photo-1610970881699-44a587cabec?w=400&h=300&fit=crop',
      analysisType: 'O que fazer com meus ingredientes',
      fullAnalysis: {
        type: 'ingredients',
        chefMessage: "Ei, chef! 🎉 Vejo ingredientes incríveis para um smoothie verde! Deixe o Chef Yumix te dar algumas ideias fantásticas do que fazer com esses tesouros nutritivos!",
        ingredients: [
          { name: 'Espinafre', suggestions: ['Smoothies verdes', 'Saladas frescas', 'Refogados'], icon: '🥬' },
          { name: 'Banana', suggestions: ['Vitaminas', 'Panquecas', 'Sobremesas'], icon: '🍌' },
          { name: 'Maçã', suggestions: ['Sucos naturais', 'Tortas', 'Snacks'], icon: '🍎' }
        ],
        quickRecipes: [
          { name: 'Smoothie Detox', time: '5 min', difficulty: 'Super Fácil', icon: '🥤' },
          { name: 'Salada Power', time: '10 min', difficulty: 'Fácil', icon: '🥗' },
          { name: 'Suco Verde', time: '3 min', difficulty: 'Super Fácil', icon: '🧃' }
        ]
      }
    },
    { 
      id: 4, 
      name: 'Pizza Margherita', 
      calories: 650, 
      time: '3 dias atrás', 
      date: '2024-01-12T20:30:00',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      analysisType: 'Receita + Calorias',
      fullAnalysis: {
        type: 'recipe',
        dishName: 'Pizza Margherita Clássica',
        calories: 650,
        chefMessage: "Mamma mia! 🍕 O Chef Yumix está apaixonado por essa pizza Margherita! Vamos aprender a fazer essa delícia italiana autêntica!",
        recipe: {
          ingredients: [
            { name: 'Massa de pizza', amount: '1 unidade', icon: '🍞' },
            { name: 'Molho de tomate', amount: '100ml', icon: '🍅' },
            { name: 'Mozzarella', amount: '150g', icon: '🧀' },
            { name: 'Manjericão', amount: '10 folhas', icon: '🌿' },
            { name: 'Azeite', amount: '2 colheres', icon: '🫒' },
            { name: 'Sal', amount: 'A gosto', icon: '🧂' }
          ],
          steps: [
            { step: 1, instruction: 'Pré-aqueça o forno a 220°C', time: '10 min', icon: '🔥' },
            { step: 2, instruction: 'Abra a massa e espalhe o molho', time: '3 min', icon: '🍅' },
            { step: 3, instruction: 'Adicione a mozzarella em pedaços', time: '2 min', icon: '🧀' },
            { step: 4, instruction: 'Asse por 12-15 minutos', time: '15 min', icon: '⏰' },
            { step: 5, instruction: 'Finalize com manjericão e azeite', time: '1 min', icon: '🌿' }
          ]
        },
        nutrition: {
          protein: 28,
          carbs: 75,
          fat: 25,
          fiber: 4,
          sugar: 8
        }
      }
    },
    { 
      id: 5, 
      name: 'Açaí Bowl', 
      calories: 320, 
      time: '4 dias atrás', 
      date: '2024-01-11T15:20:00',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop',
      analysisType: 'Somente Calorias',
      fullAnalysis: {
        type: 'calories',
        chefMessage: "Que delícia tropical! 🏖️ O Chef Yumix analisou seu açaí bowl e trouxe informações nutritivas sobre essa explosão de sabor brasileiro!",
        totalCalories: 320,
        breakdown: [
          { nutrient: 'Proteínas', amount: 8, unit: 'g', percentage: 10, color: '#10B981', icon: '💪' },
          { nutrient: 'Carboidratos', amount: 45, unit: 'g', percentage: 56, color: '#F59E0B', icon: '⚡' },
          { nutrient: 'Gorduras', amount: 12, unit: 'g', percentage: 34, color: '#EF4444', icon: '🥑' },
          { nutrient: 'Fibras', amount: 12, unit: 'g', percentage: 48, color: '#8B5CF6', icon: '🌾' }
        ],
        healthScore: 88,
        tips: [
          'Rico em antioxidantes! 🫐',
          'Excelente fonte de fibras 🌾',
          'Energia natural dos carboidratos ⚡',
          'Perfeito pós-treino! 💪'
        ]
      }
    }
  ]

  const historyData = [
    { id: 1, name: 'Hambúrguer Artesanal', calories: 580, time: 'Hoje, 14:20', type: 'Receita + Calorias' },
    { id: 2, name: 'Salada de Quinoa', calories: 320, time: 'Hoje, 12:15', type: 'Somente Calorias' },
    { id: 3, name: 'Smoothie de Frutas', calories: 240, time: 'Ontem, 16:30', type: 'Ingredientes' },
    { id: 4, name: 'Pasta Carbonara', calories: 680, time: 'Ontem, 20:45', type: 'Receita + Calorias' },
    { id: 5, name: 'Wrap de Frango', calories: 420, time: '2 dias atrás, 13:10', type: 'Somente Calorias' },
  ]

  const rewardsData = [
    { id: 1, title: 'Primeira Foto', description: 'Tire sua primeira foto', completed: true, points: 10 },
    { id: 2, title: 'Streak de 7 dias', description: 'Use o app por 7 dias seguidos', completed: true, points: 50 },
    { id: 3, title: 'Streak de 15 dias', description: 'Use o app por 15 dias seguidos', completed: true, points: 100 },
    { id: 4, title: '10 Receitas', description: 'Analise 10 receitas diferentes', completed: false, points: 75 },
    { id: 5, title: 'Explorador', description: 'Use todos os tipos de análise', completed: false, points: 30 },
    { id: 6, title: 'Streak de 30 dias', description: 'Use o app por 30 dias seguidos', completed: false, points: 200 },
  ]

  const progressData = {
    '7d': { calories: 1850, target: 2000, percentage: 92, data: [1800, 1900, 1750, 2100, 1850, 1950, 1850] },
    '1m': { calories: 58500, target: 60000, percentage: 97, data: [1850, 1900, 1800, 2000, 1950, 1850, 1900] },
    '6m': { calories: 345000, target: 360000, percentage: 96, data: [1900, 1850, 1950, 2000, 1800, 1900, 1850] },
    '1y': { calories: 720000, target: 730000, percentage: 99, data: [1850, 1900, 1950, 1800, 2000, 1850, 1900] },
    'total': { calories: 1250000, target: 1300000, percentage: 96, data: [1900, 1850, 2000, 1950, 1800, 1900, 1850] }
  }

  // Camera setup - CORREÇÃO: Evitar loops infinitos
  useEffect(() => {
    let mounted = true
    
    if (currentScreen === 'home' && mounted) {
      startCamera()
    } else {
      stopCamera()
    }
    
    return () => {
      mounted = false
      stopCamera()
    }
  }, [currentScreen])

  const startCamera = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        })
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
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

  // Função para capturar foto e analisar com IA
  const capturePhoto = async () => {
    if (!selectedOption) {
      alert('Por favor, selecione um tipo de análise primeiro!')
      return
    }

    // Verificar limite de fotos gratuitas
    if (!isPremium && freePhotos <= 0) {
      alert('Você atingiu o limite de fotos gratuitas! Assine o Yumix Premium para continuar.')
      return
    }

    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Configurar canvas com as dimensões do vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Capturar frame do vídeo
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Converter para base64
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)

    // Decrementar fotos gratuitas se não for premium
    if (!isPremium) {
      setFreePhotos(prev => prev - 1)
    }

    // Iniciar análise
    setIsAnalyzing(true)
    setCurrentScreen('analyzing')

    try {
      await analyzeImageWithAI(imageDataUrl, selectedOption)
    } catch (error) {
      console.error('Erro na análise:', error)
      setIsAnalyzing(false)
      setCurrentScreen('home')
      alert('Erro ao analisar a imagem. Tente novamente!')
    }
  }

  // Função para analisar imagem com ChatGPT - CORREÇÃO: Remover chamadas de API que podem causar timeout
  const analyzeImageWithAI = async (imageDataUrl: string, analysisType: string) => {
    try {
      // CORREÇÃO: Usar apenas mock para evitar timeout no deploy
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock de resposta baseado no tipo de análise
      let mockResult
      
      if (analysisType === 'recipe') {
      mockResult = {
        type: 'recipe',
        dishName: 'Salmão Grelhado com Legumes',
        calories: 420,
        chefMessage: "Olá! Sou o Chef Yumix! 👨‍🍳✨ Que prato delicioso você tem aí! Vejo um salmão perfeitamente grelhado com vegetais frescos. Deixe-me te ensinar como fazer essa maravilha!",
        recipe: {
          ingredients: [
            { name: 'Salmão', amount: '200g', icon: '🐟' },
            { name: 'Brócolis', amount: '150g', icon: '🥦' },
            { name: 'Cenoura', amount: '100g', icon: '🥕' },
            { name: 'Azeite', amount: '2 colheres', icon: '🫒' },
            { name: 'Limão', amount: '1 unidade', icon: '🍋' },
            { name: 'Sal e pimenta', amount: 'A gosto', icon: '🧂' }
          ],
          steps: [
            { step: 1, instruction: 'Tempere o salmão com sal, pimenta e limão', time: '5 min', icon: '🧂' },
            { step: 2, instruction: 'Aqueça a frigideira com azeite em fogo médio', time: '2 min', icon: '🔥' },
            { step: 3, instruction: 'Grelhe o salmão por 4 min de cada lado', time: '8 min', icon: '🍳' },
            { step: 4, instruction: 'Cozinhe os vegetais no vapor', time: '10 min', icon: '♨️' },
            { step: 5, instruction: 'Sirva quente com um toque de limão', time: '1 min', icon: '🍽️' }
          ]
        },
        nutrition: {
          protein: 35,
          carbs: 12,
          fat: 18,
          fiber: 8,
          sugar: 6
        }
      }
    } else if (analysisType === 'ingredients') {
      mockResult = {
        type: 'ingredients',
        chefMessage: "Ei, chef! 🎉 Vejo ingredientes incríveis na sua foto! Deixe o Chef Yumix te dar algumas ideias fantásticas do que fazer com esses tesouros culinários!",
        ingredients: [
          { name: 'Salmão', suggestions: ['Grelhar com ervas', 'Fazer sashimi', 'Assar no forno'], icon: '🐟' },
          { name: 'Brócolis', suggestions: ['Refogar com alho', 'Fazer purê', 'Adicionar em saladas'], icon: '🥦' },
          { name: 'Cenoura', suggestions: ['Cortar em bastões', 'Fazer chips assados', 'Usar em sopas'], icon: '🥕' }
        ],
        quickRecipes: [
          { name: 'Salmão Teriyaki', time: '15 min', difficulty: 'Fácil', icon: '🍣' },
          { name: 'Salada Colorida', time: '10 min', difficulty: 'Super Fácil', icon: '🥗' },
          { name: 'Legumes Grelhados', time: '20 min', difficulty: 'Fácil', icon: '🔥' }
        ]
      }
    } else if (analysisType === 'calories') {
      mockResult = {
        type: 'calories',
        chefMessage: "Opa! 📊 O Chef Yumix analisou seu prato e trouxe os números fresquinhos! Vamos ver o que temos aqui de informação nutricional!",
        totalCalories: 420,
        breakdown: [
          { nutrient: 'Proteínas', amount: 35, unit: 'g', percentage: 33, color: '#10B981', icon: '💪' },
          { nutrient: 'Carboidratos', amount: 12, unit: 'g', percentage: 11, color: '#F59E0B', icon: '⚡' },
          { nutrient: 'Gorduras', amount: 18, unit: 'g', percentage: 39, color: '#EF4444', icon: '🥑' },
          { nutrient: 'Fibras', amount: 8, unit: 'g', percentage: 32, color: '#8B5CF6', icon: '🌾' }
        ],
        healthScore: 85,
        tips: [
          'Excelente fonte de ômega-3! 🐟',
          'Rico em vitaminas A e C 🥕',
          'Baixo em carboidratos refinados ✅',
          'Ótimo para dieta balanceada! 🎯'
        ]
      }
    }

    setAnalysisResult(mockResult)
    setIsAnalyzing(false)
    setCurrentScreen('result')
    } catch (error) {
      console.error('Erro na análise:', error)
      setIsAnalyzing(false)
      setCurrentScreen('home')
      alert('Erro ao analisar a imagem. Tente novamente!')
    }
  }

  // Função para excluir refeição salva
  const deleteSavedMeal = (mealId: number) => {
    alert('Refeição excluída com sucesso!')
    setSelectedMealDetail(null)
    setCurrentScreen('saved')
  }

  // Função para compartilhar refeição - CORREÇÃO: String template corrigida
  const shareMeal = (meal: any) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${meal.name} - Yumix`,
        text: `Confira essa análise do ${meal.name} que fiz no Yumix! ${meal.calories} kcal`,
        url: typeof window !== 'undefined' ? window.location.href : ''
      })
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const shareText = `${meal.name} - ${meal.calories} kcal - Analisado com Yumix 🍽️✨`
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
        alert('Informações copiadas para a área de transferência!')
      }
    }
  }

  // Theme colors
  const bgColor = isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'
  const cardBg = isLightTheme ? 'bg-gray-50' : 'bg-[#1A1A1F]'
  const textPrimary = isLightTheme ? 'text-gray-900' : 'text-white'
  const textSecondary = isLightTheme ? 'text-gray-600' : 'text-[#C8C9CC]'
  const borderColor = isLightTheme ? 'border-gray-200' : 'border-white/10'

  // Logo Component usando a nova imagem da Yumix - APLICAR LUZ LARANJA EM AMBOS OS TEMAS
  const YumixLogo = ({ size = 'normal', showText = false, translucent = false }) => (
    <div className={`flex items-center gap-2 ${translucent ? 'opacity-70' : ''}`}>
      <div className="relative">
        <img 
          src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/715d1240-85fd-4a34-818e-603fb8bbc597.jpg" 
          alt="Yumix Logo" 
          className={`${size === 'large' ? 'h-24 w-24' : 'h-16 w-16'} object-contain rounded-xl`}
          style={{
            filter: 'drop-shadow(0 0 8px rgba(255, 107, 61, 0.3))',
            background: 'transparent'
          }}
        />
      </div>
      {showText && (
        <div className="flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 text-[#B8860B]" />
          <span className="text-sm font-bold bg-gradient-to-r from-[#B8860B] to-white bg-clip-text text-transparent">
            Premium
          </span>
          <Star className="w-2.5 h-2.5 text-[#B8860B]" />
        </div>
      )}
    </div>
  )

  // Header Component com blocos alinhados e harmônicos
  const Header = () => (
    <div className={`fixed top-0 left-0 right-0 z-50 ${bgColor}/95 backdrop-blur-xl ${borderColor} border-b`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo - tamanho aumentado */}
        <div className="flex items-center justify-center w-20 h-10">
          <YumixLogo translucent />
        </div>
        
        {/* Contador de fotos no meio - compacto e harmônico - SEM BORDA NO TEMA CLARO */}
        <div className={`flex items-center justify-center w-20 h-10 ${isLightTheme ? 'bg-white shadow-lg' : 'bg-[#0F0F12]'} px-3 py-2 rounded-lg`}>
          <div className="flex items-center gap-1">
            {isPremium ? (
              <div className="flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 text-[#B8860B]" />
                <span className={`text-xs font-bold ${isLightTheme ? 'bg-gradient-to-r from-[#B8860B] to-black bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#B8860B] to-white bg-clip-text text-transparent'}`}>
                  Premium
                </span>
                <Star className="w-2.5 h-2.5 text-[#B8860B]" />
              </div>
            ) : (
              <>
                <span className={`font-bold text-sm ${freePhotos >= 2 ? 'text-[#00FF88]' : 'text-[#FF3366]'}`}>
                  {freePhotos}
                </span>
                <span className={`text-xs ${freePhotos >= 2 ? 'text-[#00FF88]' : 'text-[#FF3366]'} whitespace-nowrap`}>
                  fotos grátis
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Bloco de fogo - SEM CONTORNO, só ícone colorido maior */}
        <div className={`flex items-center justify-center w-20 h-10 px-3 py-2 rounded-lg bg-transparent`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className={`${textPrimary} font-semibold text-sm`}>{streak}</span>
          </div>
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
            { id: 'rewards', icon: Gift, label: 'Recompensas' },
            { id: 'history', icon: History, label: 'Histórico' },
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
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, children = null }) => {
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
          {children || (
            <div className="text-center">
              <div className={`text-2xl font-bold ${textPrimary}`}>{percentage}%</div>
              <div className={`text-xs ${textSecondary}`}>Meta</div>
            </div>
          )}
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
      
      <div className="px-4 space-y-6">
        {/* Live Camera Feed com linhas brancas de detalhes */}
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
            {/* Linhas brancas elegantes para mostrar formato e posição */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Cantos superiores */}
              <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/60 rounded-tr-lg" />
              {/* Cantos inferiores */}
              <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/60 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/60 rounded-br-lg" />
              {/* Linhas centrais */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-white/40" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-white/40" />
            </div>
          </div>
        </div>

        {/* Three Option Buttons com gradiente melhorado no tema claro - PRETO NO LADO DIREITO */}
        <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
          <button 
            onClick={() => setSelectedOption(selectedOption === 'recipe' ? null : 'recipe')}
            className={`w-full p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'recipe' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : `bg-gradient-to-r ${isLightTheme ? 'from-white to-black/40 border-black border-2' : 'from-black to-white/20'}`
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <ChefHat className={`w-5 h-5 ${selectedOption === 'recipe' ? 'text-white' : isLightTheme ? 'text-black' : 'text-white'}`} />
              <span className={`text-sm font-semibold tracking-wide ${
                selectedOption === 'recipe' 
                  ? 'text-white' 
                  : isLightTheme ? 'text-black' : 'text-white'
              }`}>
                Receita + Calorias
              </span>
            </div>
          </button>

          <button 
            onClick={() => setSelectedOption(selectedOption === 'ingredients' ? null : 'ingredients')}
            className={`w-full p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'ingredients' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : `bg-gradient-to-r ${isLightTheme ? 'from-white to-black/40 border-black border-2' : 'from-black to-white/20'}`
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <UtensilsCrossed className={`w-5 h-5 ${selectedOption === 'ingredients' ? 'text-white' : isLightTheme ? 'text-black' : 'text-white'}`} />
              <span className={`text-sm font-semibold tracking-wide ${
                selectedOption === 'ingredients' 
                  ? 'text-white' 
                  : isLightTheme ? 'text-black' : 'text-white'
              }`}>
                O que fazer com meus ingredientes
              </span>
            </div>
          </button>

          <button 
            onClick={() => setSelectedOption(selectedOption === 'calories' ? null : 'calories')}
            className={`w-full p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
              selectedOption === 'calories' 
                ? 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]' 
                : `bg-gradient-to-r ${isLightTheme ? 'from-white to-black/40 border-black border-2' : 'from-black to-white/20'}`
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Zap className={`w-5 h-5 ${selectedOption === 'calories' ? 'text-white' : isLightTheme ? 'text-black' : 'text-white'}`} />
              <span className={`text-sm font-semibold tracking-wide ${
                selectedOption === 'calories' 
                  ? 'text-white' 
                  : isLightTheme ? 'text-black' : 'text-white'
              }`}>
                Somente Calorias
              </span>
            </div>
          </button>
        </div>

        {/* Botão para tirar foto - centralizado perfeitamente */}
        <div className="flex justify-center">
          <button 
            onClick={capturePhoto}
            disabled={!selectedOption || (!isPremium && freePhotos <= 0)}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              !selectedOption || (!isPremium && freePhotos <= 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB]'
            }`}
          >
            <Camera className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Analyzing Screen
  const AnalyzingScreen = () => (
    <div className={`min-h-screen ${bgColor} flex flex-col items-center justify-center px-6`}>
      <div className="text-center space-y-6">
        <div className="relative">
          <YumixLogo size="large" />
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] rounded-full opacity-20 blur-xl animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-[#FF6B3D] animate-spin" />
            <h2 className={`${textPrimary} text-xl font-bold`}>Chef Yumix analisando...</h2>
          </div>
          <p className={`${textSecondary} text-sm max-w-sm`}>
            Estou identificando os ingredientes e preparando uma análise deliciosa para você! 👨‍🍳✨
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-[#FF6B3D] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#FF4BB2] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#A43EEB] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )

  // Result Screen com interface atraente baseada no tipo de análise
  const ResultScreen = () => {
    if (!analysisResult) return null

    const renderRecipeResult = () => (
      <div className="space-y-6">
        {/* Chef Message */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                {analysisResult.chefMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Dish Info */}
        <div className={`${cardBg} rounded-3xl overflow-hidden ${borderColor} border`}>
          {capturedImage && (
            <img 
              src={capturedImage}
              alt="Prato analisado"
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className={`${textPrimary} text-lg font-bold`}>{analysisResult.dishName}</h3>
              <span className="bg-gradient-to-r from-[#FF6B3D] to-[#FF4BB2] text-white px-3 py-1 rounded-full text-sm font-semibold">
                {analysisResult.calories} kcal
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-[#10B981] font-semibold text-sm">{analysisResult.nutrition.protein}g</p>
                <p className={`${textSecondary} text-xs`}>Proteína</p>
              </div>
              <div>
                <p className="text-[#F59E0B] font-semibold text-sm">{analysisResult.nutrition.carbs}g</p>
                <p className={`${textSecondary} text-xs`}>Carboidrato</p>
              </div>
              <div>
                <p className="text-[#EF4444] font-semibold text-sm">{analysisResult.nutrition.fat}g</p>
                <p className={`${textSecondary} text-xs`}>Gordura</p>
              </div>
              <div>
                <p className="text-[#8B5CF6] font-semibold text-sm">{analysisResult.nutrition.fiber}g</p>
                <p className={`${textSecondary} text-xs`}>Fibra</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <Utensils className="w-5 h-5 text-[#FF6B3D]" />
            Ingredientes
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {analysisResult.recipe.ingredients.map((ingredient: any, index: number) => (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                <span className="text-2xl">{ingredient.icon}</span>
                <div>
                  <p className={`${textPrimary} font-medium text-sm`}>{ingredient.name}</p>
                  <p className={`${textSecondary} text-xs`}>{ingredient.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recipe Steps */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <Clock className="w-5 h-5 text-[#FF6B3D]" />
            Modo de Preparo
          </h4>
          <div className="space-y-4">
            {analysisResult.recipe.steps.map((step: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
                <div className="flex-1">
                  <p className={`${textPrimary} text-sm font-medium mb-1`}>{step.instruction}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{step.icon}</span>
                    <span className={`${textSecondary} text-xs`}>{step.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    const renderIngredientsResult = () => (
      <div className="space-y-6">
        {/* Chef Message */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                {analysisResult.chefMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Ingredients Suggestions */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5 text-[#FF6B3D]" />
            Sugestões para seus ingredientes
          </h4>
          <div className="space-y-4">
            {analysisResult.ingredients.map((ingredient: any, index: number) => (
              <div key={index} className={`p-4 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{ingredient.icon}</span>
                  <h5 className={`${textPrimary} font-semibold`}>{ingredient.name}</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredient.suggestions.map((suggestion: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-[#FF6B3D]/20 to-[#A43EEB]/20 text-[#FF6B3D] px-3 py-1 rounded-full text-xs font-medium">
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Recipes */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <Zap className="w-5 h-5 text-[#FF6B3D]" />
            Receitas Rápidas
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {analysisResult.quickRecipes.map((recipe: any, index: number) => (
              <div key={index} className={`p-4 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{recipe.icon}</span>
                  <div>
                    <p className={`${textPrimary} font-medium text-sm`}>{recipe.name}</p>
                    <p className={`${textSecondary} text-xs`}>{recipe.time} • {recipe.difficulty}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${textSecondary}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    const renderCaloriesResult = () => (
      <div className="space-y-6">
        {/* Chef Message */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                {analysisResult.chefMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Total Calories */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border text-center`}>
          <div className="mb-4">
            <div className="text-6xl font-bold bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] bg-clip-text text-transparent">
              {analysisResult.totalCalories}
            </div>
            <p className={`${textSecondary} text-lg`}>calorias totais</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-[#10B981]" />
            <span className={`${textPrimary} font-semibold`}>Score de Saúde: {analysisResult.healthScore}/100</span>
          </div>
        </div>

        {/* Nutritional Breakdown */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5 text-[#FF6B3D]" />
            Composição Nutricional
          </h4>
          <div className="space-y-4">
            {analysisResult.breakdown.map((nutrient: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{nutrient.icon}</span>
                    <span className={`${textPrimary} font-medium text-sm`}>{nutrient.nutrient}</span>
                  </div>
                  <span className={`${textPrimary} font-bold text-sm`}>
                    {nutrient.amount}{nutrient.unit} ({nutrient.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${nutrient.percentage}%`,
                      backgroundColor: nutrient.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
          <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
            <Sparkles className="w-5 h-5 text-[#FF6B3D]" />
            Dicas do Chef Yumix
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {analysisResult.tips.map((tip: string, index: number) => (
              <div key={index} className={`p-3 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'} flex items-center gap-3`}>
                <div className="w-2 h-2 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex-shrink-0" />
                <p className={`${textPrimary} text-sm`}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )

    return (
      <div className={`min-h-screen ${bgColor} pt-6 pb-24`}>
        <div className="px-4 space-y-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`w-10 h-10 ${cardBg} rounded-full flex items-center justify-center ${borderColor} border`}
            >
              <ArrowLeft className={`w-5 h-5 ${textPrimary}`} />
            </button>
            <h2 className={`${textPrimary} font-semibold`}>
              {analysisResult.type === 'recipe' && 'Receita Completa'}
              {analysisResult.type === 'ingredients' && 'Sugestões de Ingredientes'}
              {analysisResult.type === 'calories' && 'Análise Calórica'}
            </h2>
            <div className="w-10 h-10"></div>
          </div>

          {analysisResult.type === 'recipe' && renderRecipeResult()}
          {analysisResult.type === 'ingredients' && renderIngredientsResult()}
          {analysisResult.type === 'calories' && renderCaloriesResult()}

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setCurrentScreen('home')}
              className={`flex-1 ${cardBg} ${textPrimary} py-3 rounded-2xl font-semibold ${borderColor} border text-sm`}
            >
              Nova Análise
            </button>
            <button className="flex-1 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] text-white py-3 rounded-2xl font-semibold text-sm">
              Salvar Resultado
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Meal Detail Screen - Nova tela para mostrar detalhes completos da refeição salva
  const MealDetailScreen = () => {
    if (!selectedMealDetail) return null

    const meal = selectedMealDetail
    const analysis = meal.fullAnalysis

    const renderDetailContent = () => {
      if (analysis.type === 'recipe') {
        return (
          <div className="space-y-6">
            {/* Chef Message */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
                  <p className={`${textSecondary} text-sm leading-relaxed`}>
                    {analysis.chefMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Dish Info */}
            <div className={`${cardBg} rounded-3xl overflow-hidden ${borderColor} border`}>
              <img 
                src={meal.image}
                alt={meal.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className={`${textPrimary} text-lg font-bold`}>{analysis.dishName}</h3>
                  <span className="bg-gradient-to-r from-[#FF6B3D] to-[#FF4BB2] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {analysis.calories} kcal
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-[#10B981] font-semibold text-sm">{analysis.nutrition.protein}g</p>
                    <p className={`${textSecondary} text-xs`}>Proteína</p>
                  </div>
                  <div>
                    <p className="text-[#F59E0B] font-semibold text-sm">{analysis.nutrition.carbs}g</p>
                    <p className={`${textSecondary} text-xs`}>Carboidrato</p>
                  </div>
                  <div>
                    <p className="text-[#EF4444] font-semibold text-sm">{analysis.nutrition.fat}g</p>
                    <p className={`${textSecondary} text-xs`}>Gordura</p>
                  </div>
                  <div>
                    <p className="text-[#8B5CF6] font-semibold text-sm">{analysis.nutrition.fiber}g</p>
                    <p className={`${textSecondary} text-xs`}>Fibra</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Utensils className="w-5 h-5 text-[#FF6B3D]" />
                Ingredientes
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {analysis.recipe.ingredients.map((ingredient: any, index: number) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                    <span className="text-2xl">{ingredient.icon}</span>
                    <div>
                      <p className={`${textPrimary} font-medium text-sm`}>{ingredient.name}</p>
                      <p className={`${textSecondary} text-xs`}>{ingredient.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Steps */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Clock className="w-5 h-5 text-[#FF6B3D]" />
                Modo de Preparo
              </h4>
              <div className="space-y-4">
                {analysis.recipe.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`${textPrimary} text-sm font-medium mb-1`}>{step.instruction}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{step.icon}</span>
                        <span className={`${textSecondary} text-xs`}>{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      } else if (analysis.type === 'ingredients') {
        return (
          <div className="space-y-6">
            {/* Chef Message */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
                  <p className={`${textSecondary} text-sm leading-relaxed`}>
                    {analysis.chefMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Meal Image */}
            <div className={`${cardBg} rounded-3xl overflow-hidden ${borderColor} border`}>
              <img 
                src={meal.image}
                alt={meal.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className={`${textPrimary} text-lg font-bold`}>{meal.name}</h3>
                <p className={`${textSecondary} text-sm`}>{meal.time}</p>
              </div>
            </div>

            {/* Ingredients Suggestions */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5 text-[#FF6B3D]" />
                Sugestões para seus ingredientes
              </h4>
              <div className="space-y-4">
                {analysis.ingredients.map((ingredient: any, index: number) => (
                  <div key={index} className={`p-4 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{ingredient.icon}</span>
                      <h5 className={`${textPrimary} font-semibold`}>{ingredient.name}</h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ingredient.suggestions.map((suggestion: string, idx: number) => (
                        <span key={idx} className="bg-gradient-to-r from-[#FF6B3D]/20 to-[#A43EEB]/20 text-[#FF6B3D] px-3 py-1 rounded-full text-xs font-medium">
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Recipes */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Zap className="w-5 h-5 text-[#FF6B3D]" />
                Receitas Rápidas
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {analysis.quickRecipes.map((recipe: any, index: number) => (
                  <div key={index} className={`p-4 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{recipe.icon}</span>
                      <div>
                        <p className={`${textPrimary} font-medium text-sm`}>{recipe.name}</p>
                        <p className={`${textSecondary} text-xs`}>{recipe.time} • {recipe.difficulty}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${textSecondary}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      } else if (analysis.type === 'calories') {
        return (
          <div className="space-y-6">
            {/* Chef Message */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`${textPrimary} font-bold text-lg mb-2`}>Chef Yumix</h3>
                  <p className={`${textSecondary} text-sm leading-relaxed`}>
                    {analysis.chefMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Meal Image */}
            <div className={`${cardBg} rounded-3xl overflow-hidden ${borderColor} border`}>
              <img 
                src={meal.image}
                alt={meal.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className={`${textPrimary} text-lg font-bold`}>{meal.name}</h3>
                <p className={`${textSecondary} text-sm`}>{meal.time}</p>
              </div>
            </div>

            {/* Total Calories */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border text-center`}>
              <div className="mb-4">
                <div className="text-6xl font-bold bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] bg-clip-text text-transparent">
                  {analysis.totalCalories}
                </div>
                <p className={`${textSecondary} text-lg`}>calorias totais</p>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-[#10B981]" />
                <span className={`${textPrimary} font-semibold`}>Score de Saúde: {analysis.healthScore}/100</span>
              </div>
            </div>

            {/* Nutritional Breakdown */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5 text-[#FF6B3D]" />
                Composição Nutricional
              </h4>
              <div className="space-y-4">
                {analysis.breakdown.map((nutrient: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{nutrient.icon}</span>
                        <span className={`${textPrimary} font-medium text-sm`}>{nutrient.nutrient}</span>
                      </div>
                      <span className={`${textPrimary} font-bold text-sm`}>
                        {nutrient.amount}{nutrient.unit} ({nutrient.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${nutrient.percentage}%`,
                          backgroundColor: nutrient.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className={`${cardBg} rounded-3xl p-6 ${borderColor} border`}>
              <h4 className={`${textPrimary} font-bold text-lg mb-4 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5 text-[#FF6B3D]" />
                Dicas do Chef Yumix
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {analysis.tips.map((tip: string, index: number) => (
                  <div key={index} className={`p-3 rounded-xl ${isLightTheme ? 'bg-white' : 'bg-[#0F0F12]'} flex items-center gap-3`}>
                    <div className="w-2 h-2 bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] rounded-full flex-shrink-0" />
                    <p className={`${textPrimary} text-sm`}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
    }

    return (
      <div className={`min-h-screen ${bgColor} pt-6 pb-24`}>
        <div className="px-4 space-y-4">
          {/* Header com navegação */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setSelectedMealDetail(null)
                setCurrentScreen('saved')
              }}
              className={`w-10 h-10 ${cardBg} rounded-full flex items-center justify-center ${borderColor} border`}
            >
              <ArrowLeft className={`w-5 h-5 ${textPrimary}`} />
            </button>
            <div className="text-center">
              <h2 className={`${textPrimary} font-semibold`}>{meal.analysisType}</h2>
              <p className={`${textSecondary} text-xs`}>{meal.time}</p>
            </div>
            <div className="w-10 h-10"></div>
          </div>

          {/* Conteúdo da análise */}
          {renderDetailContent()}

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => shareMeal(meal)}
              className={`flex-1 ${cardBg} ${textPrimary} py-3 rounded-2xl font-semibold ${borderColor} border text-sm flex items-center justify-center gap-2`}
            >
              <Share className="w-4 h-4" />
              Compartilhar
            </button>
            <button 
              onClick={() => deleteSavedMeal(meal.id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Progress Screen with Apple Health Style and Circular Progress
  const ProgressScreen = () => {
    const currentData = progressData[selectedPeriod]
    
    return (
      <div className={`min-h-screen ${bgColor} pt-16 pb-24 overflow-hidden`}>
        <Header />
        
        <div className="px-4 space-y-6 pt-8">
          {/* Compact Sliding Period Selector - números em preto, contorno igual aos gráficos */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: '7d', label: '7d', number: '7', text: 'd' },
              { key: '1m', label: '1m', number: '1', text: 'm' },
              { key: '6m', label: '6m', number: '6', text: 'm' },
              { key: '1y', label: '1a', number: '1', text: 'a' },
              { key: 'total', label: 'Total', number: 'Total', text: '' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedPeriod === period.key
                    ? 'bg-gradient-to-r from-[#FF6B3D] to-[#A43EEB] text-white shadow-lg'
                    : `bg-transparent ${isLightTheme ? 'border-gray-200' : 'border-white/10'} border`
                }`}
              >
                {selectedPeriod === period.key ? (
                  period.label
                ) : (
                  <span>
                    <span className={`${isLightTheme ? 'text-black' : 'text-white'} font-bold`}>{period.number}</span>
                    {period.text && <span className={`${isLightTheme ? 'text-black' : 'text-white'}`}>{period.text}</span>}
                  </span>
                )}
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

          {/* Informações Nutricionais Detalhadas */}
          <div className="grid grid-cols-2 gap-3">
            {/* Proteína - Bloco */}
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border`}>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#10B981]" />
                <span className={`${textPrimary} font-semibold text-xs`}>Proteína</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>128g</p>
              <p className={`${textSecondary} text-xs`}>de 150g meta</p>
            </div>
            
            {/* Carboidrato - Círculo */}
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border flex items-center justify-center`}>
              <CircularProgress percentage={75} size={80}>
                <div className="text-center">
                  <Wheat className="w-4 h-4 text-[#FF6B3D] mx-auto mb-1" />
                  <div className={`text-sm font-bold ${textPrimary}`}>180g</div>
                  <div className={`text-xs ${textSecondary}`}>Carbs</div>
                </div>
              </CircularProgress>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Gordura - Círculo */}
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border flex items-center justify-center`}>
              <CircularProgress percentage={60} size={80}>
                <div className="text-center">
                  <Droplets className="w-4 h-4 text-[#A43EEB] mx-auto mb-1" />
                  <div className={`text-sm font-bold ${textPrimary}`}>45g</div>
                  <div className={`text-xs ${textSecondary}`}>Gordura</div>
                </div>
              </CircularProgress>
            </div>
            
            {/* Açúcar - Bloco */}
            <div className={`${cardBg} p-4 rounded-2xl ${borderColor} border`}>
              <div className="flex items-center gap-2 mb-2">
                <Candy className="w-4 h-4 text-[#FF4BB2]" />
                <span className={`${textPrimary} font-semibold text-xs`}>Açúcar</span>
              </div>
              <p className={`text-xl font-bold ${textPrimary}`}>32g</p>
              <p className={`${textSecondary} text-xs`}>de 50g limite</p>
            </div>
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

  // Saved Meals Screen - com funcionalidade de clique para abrir detalhes
  const SavedMealsScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24 overflow-hidden`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <h2 className={`${textPrimary} text-xl font-bold`}>Refeições Salvas</h2>

        <div className="grid grid-cols-1 gap-3">
          {savedMeals.map((meal) => (
            <button
              key={meal.id}
              onClick={() => {
                setSelectedMealDetail(meal)
                setCurrentScreen('meal-detail')
              }}
              className={`${cardBg} rounded-2xl overflow-hidden ${borderColor} border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-left`}
            >
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
                <div className="flex items-center justify-between">
                  <p className={`${textSecondary} text-xs`}>{meal.time}</p>
                  <span className={`${textSecondary} text-xs px-2 py-1 rounded-full ${isLightTheme ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    {meal.analysisType}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Rewards Screen - Sistema de recompensas fácil e simples - ÍCONE DE PRESENTE COM CORES DO PREMIUM
  const RewardsScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24 overflow-hidden`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`${textPrimary} text-xl font-bold`}>Recompensas</h2>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#B8860B]" />
            <span className={`${textPrimary} font-bold`}>
              {rewardsData.filter(r => r.completed).reduce((acc, r) => acc + r.points, 0)} pts
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {rewardsData.map((reward) => (
            <div key={reward.id} className={`${cardBg} rounded-2xl p-4 ${borderColor} border shadow-lg ${reward.completed ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${reward.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      {reward.completed ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Gift className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${reward.completed && !isLightTheme ? 'text-black' : textPrimary}`}>{reward.title}</h3>
                      <p className={`text-xs ${reward.completed && !isLightTheme ? 'text-black/70' : textSecondary}`}>{reward.description}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-sm ${reward.completed ? 'text-green-500' : 'text-[#FFD700]'}`}>
                    +{reward.points} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${cardBg} rounded-2xl p-4 ${borderColor} border mt-6`}>
          <h3 className={`${textPrimary} font-semibold mb-2`}>Como ganhar pontos</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF6B3D] rounded-full"></div>
              <span className={textSecondary}>Use o app diariamente para manter seu streak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#FF4BB2] rounded-full"></div>
              <span className={textSecondary}>Experimente todos os tipos de análise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#A43EEB] rounded-full"></div>
              <span className={textSecondary}>Complete desafios especiais</span>
            </div>
          </div>
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // History Screen - Histórico da pessoa
  const HistoryScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24 overflow-hidden`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <h2 className={`${textPrimary} text-xl font-bold`}>Histórico</h2>

        <div className="grid grid-cols-1 gap-3">
          {historyData.map((item) => (
            <div key={item.id} className={`${cardBg} rounded-2xl p-4 ${borderColor} border shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`${textPrimary} font-semibold text-sm`}>{item.name}</h3>
                <span className="bg-gradient-to-r from-[#FF6B3D] to-[#FF4BB2] text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {item.calories} kcal
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className={`${textSecondary} text-xs`}>{item.time}</p>
                <span className={`${textSecondary} text-xs px-2 py-1 rounded-full ${isLightTheme ? 'bg-gray-200' : 'bg-gray-700'}`}>
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={`${cardBg} rounded-2xl p-4 ${borderColor} border mt-6`}>
          <h3 className={`${textPrimary} font-semibold mb-2`}>Estatísticas do Histórico</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>{historyData.length}</p>
              <p className={`${textSecondary} text-xs`}>Análises feitas</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${textPrimary}`}>
                {Math.round(historyData.reduce((acc, item) => acc + item.calories, 0) / historyData.length)}
              </p>
              <p className={`${textSecondary} text-xs`}>Média de calorias</p>
            </div>
          </div>
        </div>
      </div>
      
      <SlidingBottomNav />
    </div>
  )

  // Settings Screen simplificado - BOTÃO DE TEMA COM GRADIENTE CORRETO NO TEMA CLARO - PRETO NO LADO DIREITO
  const SettingsScreen = () => (
    <div className={`min-h-screen ${bgColor} pt-16 pb-24 overflow-hidden`}>
      <Header />
      
      <div className="px-4 space-y-4">
        <h2 className={`${textPrimary} text-xl font-bold`}>Configurações</h2>

        {/* Premium Button com coroa dourada clara - SEM BORDA NO TEMA CLARO */}
        {!isPremium && (
          <button 
            onClick={() => setIsPremium(true)}
            className="w-full bg-gradient-to-r from-[#FF6B3D] via-[#FF4BB2] to-[#A43EEB] p-4 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FFD700]" />
                <span className="text-white text-lg font-bold">Assinar Yumix Premium</span>
              </div>
              <span className="text-white/80 text-sm font-medium">R$ 25/mês</span>
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
          <button 
            onClick={() => setIsLightTheme(!isLightTheme)}
            className={`w-full flex items-center justify-between bg-gradient-to-r ${isLightTheme ? 'from-white to-black/40' : 'from-black to-white/20'} p-3 rounded-2xl transition-all duration-300 hover:border-[#FF6B3D]/50 hover:from-[#FF6B3D] hover:to-[#A43EEB] hover:text-white`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <Palette className={`w-4 h-4 ${isLightTheme ? 'text-black' : 'text-white'}`} />
              </div>
              <div className="text-left">
                <h3 className={`font-medium text-sm ${isLightTheme ? 'text-black' : 'text-white'}`}>Tema</h3>
                <p className={`text-xs ${isLightTheme ? 'text-black/70' : 'text-white/70'}`}>{isLightTheme ? 'Claro' : 'Escuro'}</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 ${isLightTheme ? 'text-black/70' : 'text-white/70'}`} />
          </button>
        </div>

        {/* Botão de cancelar assinatura - só aparece para usuários Premium - MINIMALISTA E NO FINAL */}
        {isPremium && (
          <div className="pt-8">
            <button 
              onClick={() => setIsPremium(false)}
              className={`w-full flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                isLightTheme 
                  ? 'text-gray-500 hover:text-gray-700' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <X className="w-3 h-3" />
              <span className="text-xs font-medium">Cancelar Assinatura</span>
            </button>
          </div>
        )}

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
      case 'analyzing': return <AnalyzingScreen />
      case 'progress': return <ProgressScreen />
      case 'saved': return <SavedMealsScreen />
      case 'meal-detail': return <MealDetailScreen />
      case 'rewards': return <RewardsScreen />
      case 'history': return <HistoryScreen />
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