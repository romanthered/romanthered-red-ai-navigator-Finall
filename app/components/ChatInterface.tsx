'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserProgress {
  currentLevel: number;
  totalLevels: 5;
  messagesInLevel: number;
  completedLevels: string[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentLevel: 0,
    totalLevels: 5,
    messagesInLevel: 0,
    completedLevels: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial welcome message
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `# 🔥 WILLKOMMEN BEIM RED AI NAVIGATOR

Ich bin dein persönlicher AI Coach um die perfekte AI Money-Making Methode für DICH zu finden.

Keine Bullshit-Theorie. Nur echte, getestete Strategien.

**Bereit?** Schreib: **START**`
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userProgress
        })
      });

      const data = await response.json();
      
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
      
      if (data.progress) {
        setUserProgress(data.progress);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Fehler. Versuch nochmal.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (userProgress.currentLevel / userProgress.totalLevels) * 100;

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* Header with Progress */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
                  RED AI NAVIGATOR
                </h1>
                <p className="text-xs text-white/50">Find Your AI Money Method</p>
              </div>
            </div>

            {/* Circular Progress */}
            {userProgress.currentLevel > 0 && (
              <div className="relative w-20 h-20">
                {/* Background circle */}
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="rgba(239, 68, 68, 0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="url(#gradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - progressPercentage / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Level text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">
                      {userProgress.currentLevel}
                    </div>
                    <div className="text-[8px] text-white/50">/ {userProgress.totalLevels}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-invert prose-red max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent" {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-xl font-bold mb-3 text-red-400" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-lg font-bold mb-2 text-red-300" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="mb-3 text-white/90 leading-relaxed" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="space-y-2 mb-4" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-white/80 flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span {...props} />
                          </li>
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="text-red-400 font-bold" {...props} />
                        ),
                        code: ({ node, ...props }) => (
                          <code className="bg-white/10 px-2 py-1 rounded text-red-300 text-sm" {...props} />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto border border-white/10 mb-4" {...props} />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-white leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  <span className="text-white/60">Denke nach...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Schreib deine Antwort..."
                disabled={isLoading}
                rows={1}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl 
                         text-white placeholder-white/40 
                         focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50
                         resize-none backdrop-blur-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
                style={{
                  minHeight: '56px',
                  maxHeight: '200px'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-4 bg-gradient-to-br from-red-500 to-red-600 
                       text-white rounded-2xl font-semibold
                       hover:from-red-600 hover:to-red-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200
                       shadow-lg shadow-red-500/20
                       hover:shadow-xl hover:shadow-red-500/30
                       flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          
          {/* Quick Actions */}
          {userProgress.currentLevel === 0 && messages.length === 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {['START', 'HELP', 'INFO'].map((action) => (
                <button
                  key={action}
                  onClick={() => setInput(action)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg
                           text-white/80 text-sm font-medium
                           hover:bg-white/10 hover:border-red-500/50
                           transition-all duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
