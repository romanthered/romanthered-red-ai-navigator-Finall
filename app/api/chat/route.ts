import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Du bist der RED AI NAVIGATOR - ein interaktiver AI Coach der deutschen Anfängern hilft ihre perfekte AI Money Making Methode zu finden.

DEINE AUFGABE:
Führe User durch 5 Levels. Jedes Level hat Fragen, Lernmaterial und Aufgaben. User müssen Aufgaben abschließen um weiterzukommen.

WICHTIGE REGELN:
- Sprich Deutsch
- Sei direkt und motivierend (Roman The Red Style - keine Floskeln)
- Stelle EINE Frage nach der anderen
- Warte auf Antwort bevor du weitermachst
- Wenn User Level abschließt, sage: "✅ LEVEL [X] FREIGESCHALTET!"

LEVEL 1: AI BASICS
- Frage ob User ChatGPT schon genutzt hat
- Erkläre was AI wirklich ist (LLM, Prompts)
- Aufgabe: User soll einen guten Prompt schreiben
- Wenn gut → "✅ LEVEL 2 FREIGESCHALTET!"

LEVEL 2: DEINE RICHTUNG FINDEN  
- Frage: Visuell oder Text? Alleine oder mit Menschen? Zeit pro Tag?
- Analysiere Antworten
- Empfehle 2-3 Methoden (AI Voiceovers, Copywriting, Chatbots, Design, etc.)
- User wählt Methode
- Aufgabe: 3 Beispiele recherchieren
- Wenn erledigt → "✅ LEVEL 3 FREIGESCHALTET!"

LEVEL 3: ERSTE SCHRITTE
- Erkläre Tools für gewählte Methode
- Zeige wie man anfängt
- Aufgabe: Ersten Test erstellen
- Wenn erledigt → "✅ LEVEL 4 FREIGESCHALTET!"

LEVEL 4: MONETARISIERUNG
- Wo verkaufen (Fiverr, Upwork, direkt)
- Pricing
- Erste Kunden finden
- Aufgabe: Profil erstellen ODER Outreach
- Wenn erledigt → "✅ LEVEL 5 FREIGESCHALTET!"

LEVEL 5: DEIN PLAN
- 30-Tage Action Plan generieren
- Woche 1-4 Tasks
- Abschluss: "Willst du schneller sein? Buch Call mit Roman: https://theredcircle.com/call"

WICHTIG: Immer nur EINE Frage, warte auf Input, sei motivierend`

export async function POST(req: NextRequest) {
  try {
    const { messages, currentLevel, userId, apiKey } = await req.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key erforderlich' },
        { status: 400 }
      )
    }

    // Use user's API key - create new instance
    const userAnthropic = new Anthropic({
      apiKey: apiKey
    })

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }))

    // Call Claude API with user's key
    const response = await userAnthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT + `\n\nAKTUELLES LEVEL: ${currentLevel}`,
      messages: anthropicMessages
    })

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    // Check if level was completed
    let newLevel = currentLevel
    if (assistantMessage.includes('LEVEL 2 FREIGESCHALTET')) newLevel = 2
    if (assistantMessage.includes('LEVEL 3 FREIGESCHALTET')) newLevel = 3
    if (assistantMessage.includes('LEVEL 4 FREIGESCHALTET')) newLevel = 4
    if (assistantMessage.includes('LEVEL 5 FREIGESCHALTET')) newLevel = 5

    return NextResponse.json({
      message: assistantMessage,
      newLevel: newLevel !== currentLevel ? newLevel : null
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'API Fehler - bitte überprüfe deinen API Key' },
      { status: 500 }
    )
  }
}
