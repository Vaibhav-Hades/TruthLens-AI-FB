import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

export const summarizeYouTubeVideo = async (url, language = 'en') => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const languageNames = {
        en: 'English', hi: 'Hindi', te: 'Telugu',
        ta: 'Tamil', bn: 'Bengali', zh: 'Chinese',
        ja: 'Japanese', ko: 'Korean'
    }

    const prompt = `
    Analyze this YouTube video: ${url}
    
    Please provide:
    1. A concise summary (3-5 sentences) of what this video is about
    2. The main claims or facts presented in the video
    3. Key points to fact-check
    
    IMPORTANT: Respond entirely in ${languageNames[language] || 'English'} language.
    
    Format your response as JSON:
    {
      "summary": "...",
      "main_claims": ["claim1", "claim2", "claim3"],
      "key_points": ["point1", "point2"]
    }
  `

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
}

export const summarizeText = async (text, language = 'en') => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const languageNames = {
        en: 'English', hi: 'Hindi', te: 'Telugu',
        ta: 'Tamil', bn: 'Bengali', zh: 'Chinese',
        ja: 'Japanese', ko: 'Korean'
    }

    const prompt = `
    Summarize and analyze this claim for fact-checking:
    "${text}"
    
    Respond in ${languageNames[language] || 'English'} language.
    
    Format as JSON:
    {
      "summary": "Brief summary of the claim",
      "main_claims": ["extracted claim 1", "extracted claim 2"],
      "key_points": ["what to verify 1", "what to verify 2"]
    }
  `

    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const clean = response.replace(/```json|```/g, '').trim()
    return JSON.parse(clean)
}
