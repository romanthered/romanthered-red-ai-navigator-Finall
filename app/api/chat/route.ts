import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import Anthropic from '@anthropic-ai/sdk';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserProgress {
  currentLevel: number;
  totalLevels: number;
  messagesInLevel: number;
  completedLevels: string[];
}

export async function POST(req: Request) {
  try {
    const { messages, userProgress, userId, apiKey } = await req.json() as {
      messages: Message[];
      userProgress: UserProgress;
      userId?: string;
      apiKey?: string;
    };

    // Validate API key is provided
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'API Key fehlt. Bitte füge deinen Claude API Key in den Einstellungen hinzu.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create client with user's API key
    const client = new Anthropic({
      apiKey: apiKey,
    });

    // Call Claude API with full system prompt
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    // Update progress based on keywords in response
    let updatedProgress = { ...userProgress };
    
    if (assistantMessage.includes('LEVEL 1') && userProgress.currentLevel === 0) {
      updatedProgress.currentLevel = 1;
    } else if (assistantMessage.includes('LEVEL 2') && userProgress.currentLevel === 1) {
      updatedProgress.currentLevel = 2;
    } else if (assistantMessage.includes('LEVEL 3') && userProgress.currentLevel === 2) {
      updatedProgress.currentLevel = 3;
    } else if (assistantMessage.includes('LEVEL 4') && userProgress.currentLevel === 3) {
      updatedProgress.currentLevel = 4;
    } else if (assistantMessage.includes('LEVEL 5') && userProgress.currentLevel === 4) {
      updatedProgress.currentLevel = 5;
    }

    updatedProgress.messagesInLevel++;

    return new Response(JSON.stringify({
      message: assistantMessage,
      progress: updatedProgress
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
