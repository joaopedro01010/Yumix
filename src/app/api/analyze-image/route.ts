import { NextRequest, NextResponse } from 'next/server'

// Força a rota a ser dinâmica para evitar problemas no build
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Verificar se as variáveis de ambiente estão disponíveis
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 503 }
      )
    }

    const { imageDataUrl, analysisType } = await request.json()

    if (!imageDataUrl || !analysisType) {
      return NextResponse.json(
        { error: 'Imagem e tipo de análise são obrigatórios' },
        { status: 400 }
      )
    }

    // Importar OpenAI apenas quando necessário
    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Definir prompts baseados no tipo de análise
    let systemPrompt = ""
    let userPrompt = ""

    if (analysisType === 'recipe') {
      systemPrompt = `Você é o Chef Yumix, um chef de cozinha divertido, criativo e experiente. Analise a imagem do prato e forneça uma receita completa com informações nutricionais. Seja simpático, use emojis e mantenha um tom divertido mas profissional.`
      
      userPrompt = `Analise esta imagem de comida e me forneça:
1. Nome do prato
2. Calorias totais estimadas
3. Lista de ingredientes com quantidades
4. Passo a passo da receita (máximo 5 passos, seja direto e claro)
5. Informações nutricionais básicas (proteína, carboidratos, gordura, fibra)

Responda como o Chef Yumix, sendo divertido e usando emojis. Mantenha as instruções curtas e diretas.`
    } else if (analysisType === 'ingredients') {
      systemPrompt = `Você é o Chef Yumix, um chef criativo que adora dar sugestões culinárias. Analise os ingredientes na imagem e sugira o que fazer com eles.`
      
      userPrompt = `Vejo ingredientes nesta imagem. Como Chef Yumix, me diga:
1. Quais ingredientes você identifica
2. 3 sugestões do que fazer com cada ingrediente principal
3. 3 receitas rápidas que posso fazer com esses ingredientes
4. Tempo de preparo e dificuldade de cada receita

Seja criativo, divertido e use emojis! Mantenha as sugestões práticas e fáceis.`
    } else if (analysisType === 'calories') {
      systemPrompt = `Você é o Chef Yumix, especialista em análise nutricional. Analise a imagem e forneça informações detalhadas sobre calorias e nutrição.`
      
      userPrompt = `Analise esta imagem de comida e me forneça:
1. Calorias totais estimadas
2. Breakdown nutricional detalhado (proteínas, carboidratos, gorduras, fibras) com percentuais
3. Score de saúde de 0-100
4. 4 dicas de saúde sobre este prato

Seja preciso mas divertido como o Chef Yumix, use emojis e mantenha um tom educativo e positivo.`
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiResponse = response.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('Nenhuma resposta da IA')
    }

    // Processar a resposta da IA e estruturar os dados
    const structuredResponse = await processAIResponse(aiResponse, analysisType)

    return NextResponse.json(structuredResponse)

  } catch (error) {
    console.error('Erro na análise da IA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para processar e estruturar a resposta da IA
async function processAIResponse(aiResponse: string, analysisType: string) {
  // Usar a IA para estruturar a resposta em JSON
  const structurePrompt = `
Converta esta resposta do Chef Yumix em um JSON estruturado para o tipo "${analysisType}".

Resposta do Chef: ${aiResponse}

${analysisType === 'recipe' ? `
Formato esperado:
{
  "type": "recipe",
  "dishName": "Nome do prato",
  "calories": número,
  "chefMessage": "Mensagem divertida do Chef Yumix",
  "recipe": {
    "ingredients": [
      {"name": "ingrediente", "amount": "quantidade", "icon": "emoji"}
    ],
    "steps": [
      {"step": 1, "instruction": "instrução", "time": "tempo", "icon": "emoji"}
    ]
  },
  "nutrition": {
    "protein": número,
    "carbs": número,
    "fat": número,
    "fiber": número
  }
}` : analysisType === 'ingredients' ? `
Formato esperado:
{
  "type": "ingredients",
  "chefMessage": "Mensagem do Chef Yumix",
  "ingredients": [
    {"name": "ingrediente", "suggestions": ["sugestão1", "sugestão2", "sugestão3"], "icon": "emoji"}
  ],
  "quickRecipes": [
    {"name": "receita", "time": "tempo", "difficulty": "dificuldade", "icon": "emoji"}
  ]
}` : `
Formato esperado:
{
  "type": "calories",
  "chefMessage": "Mensagem do Chef Yumix",
  "totalCalories": número,
  "breakdown": [
    {"nutrient": "nome", "amount": número, "unit": "g", "percentage": número, "color": "#cor", "icon": "emoji"}
  ],
  "healthScore": número,
  "tips": ["dica1", "dica2", "dica3", "dica4"]
}`}

Responda APENAS com o JSON válido, sem explicações.`

  try {
    // Verificar se OpenAI está disponível
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not available')
    }

    const OpenAI = (await import('openai')).default
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const structureResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: structurePrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    })

    const jsonResponse = structureResponse.choices[0]?.message?.content
    
    if (!jsonResponse) {
      throw new Error('Erro ao estruturar resposta')
    }

    // Tentar fazer parse do JSON
    const parsedResponse = JSON.parse(jsonResponse)
    return parsedResponse

  } catch (error) {
    console.error('Erro ao estruturar resposta:', error)
    
    // Fallback: retornar estrutura básica com a resposta da IA
    return {
      type: analysisType,
      chefMessage: aiResponse,
      error: 'Resposta não estruturada - usando texto bruto'
    }
  }
}