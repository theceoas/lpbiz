'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, MessageSquare, Calendar, Eye, Trash2, User, Bot } from 'lucide-react'
import { format } from 'date-fns'
import { getChatHistory } from '@/lib/database'

interface ChatMessage {
  id: string
  question: string
  answer: string
  session_id?: string
  created_at: string
}

interface ChatMessagesTableProps {
  onStatsUpdate: () => void
}

export function ChatMessagesTable({ onStatsUpdate }: ChatMessagesTableProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sessionFilter, setSessionFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await getChatHistory()
      setMessages(data)
    } catch (error) {
      console.error('Error loading chat messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chat message?')) return
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setMessages(messages.filter(message => message.id !== id))
      onStatsUpdate()
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  // Get unique sessions for filter
  const uniqueSessions = Array.from(new Set(messages.map(m => m.session_id).filter(Boolean)))

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.session_id && message.session_id.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSession = sessionFilter === 'all' || message.session_id === sessionFilter
    
    return matchesSearch && matchesSession
  })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Chat Messages</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-500">Loading chat messages...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Chat Messages ({filteredMessages.length})</h3>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-full sm:w-48 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {uniqueSessions.map((session) => (
                  <SelectItem key={session} value={session!}>
                    {session!.substring(0, 20)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {messages.length === 0 ? 'No chat messages found.' : 'No messages match your filters.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Conversation</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                            <div className="bg-blue-50 rounded-lg p-2 flex-1">
                              <p className="text-sm line-clamp-2 text-slate-700">{message.question}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Bot className="h-4 w-4 text-slate-600 mt-1 flex-shrink-0" />
                            <div className="bg-slate-50 rounded-lg p-2 flex-1">
                              <p className="text-sm line-clamp-2 text-slate-700">{message.answer}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {message.session_id ? (
                          <Badge variant="outline" className="font-mono text-xs">
                            {message.session_id.substring(0, 12)}...
                          </Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(message.created_at), 'MMM d, yyyy HH:mm')}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Chat Message Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-sm text-slate-700 mb-2">Session ID</h4>
                                  <p className="text-sm font-mono bg-slate-100 p-2 rounded text-slate-700">
                                    {message.session_id || 'No session ID'}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-slate-700 mb-2">Date</h4>
                                  <p className="text-sm text-slate-600">
                                    {format(new Date(message.created_at), 'MMMM d, yyyy at HH:mm:ss')}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-600" />
                                    User Question
                                  </h4>
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-slate-700">{message.question}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-sm text-slate-700 mb-2 flex items-center gap-2">
                                    <Bot className="h-4 w-4 text-slate-600" />
                                    AI Response
                                  </h4>
                                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                    <p className="text-sm whitespace-pre-wrap text-slate-700">{message.answer}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}