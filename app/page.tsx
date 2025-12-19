'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [userId, setUserId] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate or retrieve user ID
    let id = localStorage.getItem('userId')
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('userId', id)
    }
    setUserId(id)

    // Load API key
    const savedApiKey = localStorage.getItem('apiKey')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }

    // Load saved messages and level
    const savedMessages = localStorage.getItem('messages')
    const savedLevel = localStorage.getItem('currentLevel')
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Initial welcome message
      setMessages([{
        role: 'assistant',
        content: 'Hey! Willkommen beim RED AI NAVIGATOR. 🔥\n\nIch bin dein persönlicher AI Coach und helfe dir deine perfekte AI Money Making Methode zu finden.\n\nErste Frage: Hast du ChatGPT schon mal für was anderes als Google oder Hausaufgaben benutzt? (Ja/Nein)'
      }])
    }
    
    if (savedLevel) {
      setCurrentLevel(parseInt(savedLevel))
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
    localStorage.setItem('currentLevel', currentLevel.toString())
  }, [messages, currentLevel])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (!apiKey) {
      alert('Bitte füge zuerst deinen Claude API Key in den Einstellungen hinzu!')
      setShowSettings(true)
      return
    }

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentLevel,
          userId,
          apiKey
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      
      if (data.newLevel && data.newLevel !== currentLevel) {
        setCurrentLevel(data.newLevel)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Entschuldigung, es gab einen Fehler. Bitte überprüfe deinen API Key in den Einstellungen.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
    if (confirm('Möchtest du wirklich von vorne beginnen? Dein Fortschritt wird gelöscht.')) {
      localStorage.removeItem('messages')
      localStorage.removeItem('currentLevel')
      setMessages([{
        role: 'assistant',
        content: 'Hey! Willkommen beim RED AI NAVIGATOR. 🔥\n\nIch bin dein persönlicher AI Coach und helfe dir deine perfekte AI Money Making Methode zu finden.\n\nErste Frage: Hast du ChatGPT schon mal für was anderes als Google oder Hausaufgaben benutzt? (Ja/Nein)'
      }])
      setCurrentLevel(1)
    }
  }

  const saveApiKey = () => {
    if (!apiKey.startsWith('sk-ant-')) {
      alert('Ungültiger API Key! Er sollte mit "sk-ant-" beginnen.')
      return
    }
    localStorage.setItem('apiKey', apiKey)
    setShowSettings(false)
    alert('API Key gespeichert! ✅')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-electric-blue/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-primary via-hot-pink to-purple bg-clip-text text-transparent">
              RED AI NAVIGATOR
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-electric-blue font-bold">
                LEVEL {currentLevel}/5
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-purple/20 hover:bg-purple/40 text-white rounded-lg transition-all border border-purple"
              >
                ⚙️ Einstellungen
              </button>
              <button
                onClick={resetChat}
                className="px-4 py-2 bg-red-primary/20 hover:bg-red-primary/40 text-white rounded-lg transition-all border border-red-primary"
              >
                Neustart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-gray-800/50 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-electric-blue to-hot-pink transition-all duration-500"
            style={{ width: `${(currentLevel / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 pb-32">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-electric-blue to-hot-pink text-white'
                    : 'bg-gray-800/80 text-gray-100 border border-purple/30'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800/80 rounded-2xl px-6 py-4 border border-purple/30">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-electric-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-hot-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-electric-blue rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-3xl font-bold text-electric-blue mb-6">⚙️ Einstellungen</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  Claude API Key
                </label>
                <p className="text-gray-400 text-sm mb-4">
                  Hol dir deinen API Key von: <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:underline">console.anthropic.com/settings/keys</a>
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full bg-gray-800 text-white rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-electric-blue border border-gray-700"
                />
              </div>

              <div className="bg-purple/10 border border-purple/30 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-hot-pink">💡 Wichtig:</strong> Dein API Key wird nur in deinem Browser gespeichert. 
                  Dies ist Teil deiner AI Education - du lernst wie man APIs nutzt!
                </p>
              </div>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-gold">💰 Kosten:</strong> ~$0.01-0.02 pro Conversation. 
                  Für den kompletten Kurs: ~$0.50-1.00
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={saveApiKey}
                  className="flex-1 bg-gradient-to-r from-electric-blue to-hot-pink text-white rounded-xl px-6 py-4 font-bold hover:shadow-lg transition-all"
                >
                  Speichern
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-electric-blue/30">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Schreib deine Antwort..."
              className="flex-1 bg-gray-800/80 text-white rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-electric-blue border border-gray-700"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-8 py-4 bg-gradient-to-r from-red-primary to-hot-pink text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Senden
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
