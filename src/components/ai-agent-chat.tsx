'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  question: string;
  answer?: string;
  timestamp: Date;
  status: 'processing' | 'completed' | 'failed';
}

interface AIAgentChatProps {
  className?: string;
  title?: string;
  placeholder?: string;
  maxHeight?: string;
}

export function AIAgentChat({ 
  className, 
  title = "Ask BizPilot AI", 
  placeholder = "Ask me anything about business automation...",
  maxHeight = "500px"
}: AIAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    const tempMessage: Message = {
      id: `temp_${Date.now()}`,
      question,
      timestamp: new Date(),
      status: 'processing'
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          session_id: sessionId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update the temporary message with the real response
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? {
                ...msg,
                id: data.messageId,
                answer: data.answer,
                status: 'completed' as const
              }
            : msg
        ));
      } else {
        // Update with error
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id 
            ? {
                ...msg,
                answer: data.answer || 'Sorry, something went wrong. Please try again.',
                status: 'failed' as const
              }
            : msg
        ));
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Update with error
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id 
          ? {
              ...msg,
              answer: 'Sorry, I\'m having trouble connecting. Please try again later.',
              status: 'failed' as const
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
      // Focus back to input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea 
          ref={scrollAreaRef}
          className="w-full border rounded-lg p-4"
          style={{ height: maxHeight }}
        >
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-blue-600/50" />
                <p className="text-sm">
                  Hi! I'm BizPilot AI. Ask me anything about business automation,
                  <br />our services, or how we can help streamline your operations.
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* User Question */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                    <p className="text-sm">{message.question}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full p-2 flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 rounded-full p-2 flex-shrink-0">
                    {message.status === 'processing' ? (
                      <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    message.status === 'failed' 
                      ? "bg-red-50 border border-red-200" 
                      : "bg-gray-100"
                  )}>
                    {message.status === 'processing' ? (
                      <p className="text-sm text-muted-foreground">
                        Thinking...
                      </p>
                    ) : (
                      <p className="text-sm">
                        {message.answer || 'No response received'}
                      </p>
                    )}
                    {message.status !== 'processing' && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
            maxLength={500}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground text-center">
          Powered by BizPilot AI • Session: {sessionId.split('_')[1]}
        </p>
      </CardContent>
    </Card>
  );
}

export default AIAgentChat;