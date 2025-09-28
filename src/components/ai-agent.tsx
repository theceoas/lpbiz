'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { saveChatMessage } from '@/lib/database'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m your BizPilot AI assistant. Ask me anything about our automation services, pricing, or how we can help grow your business!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call the AI API endpoint
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: sessionId,
          conversationHistory: messages.slice(-5) // Send last 5 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])

      // Save the conversation to database
      await saveChatMessage({
        question: userMessage.content,
        answer: botMessage.content,
        session_id: sessionId
      })

    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Sorry, I\'m having trouble responding right now. Please try again in a moment or contact our support team.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Try Our AI Assistant
          </h2>
          <p className="text-lg text-gray-600">
            Ask me anything about BizPilot and how we can automate your business!
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              BizPilot AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages Container */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white text-gray-800 border px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about BizPilot..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>

              <div className="text-xs text-gray-500 text-center">
                This AI assistant can help you learn about our services, pricing, and features.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}