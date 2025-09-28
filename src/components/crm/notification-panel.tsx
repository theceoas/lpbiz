'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, X, Check, User, Calendar, DollarSign } from 'lucide-react'
import { format } from 'date-fns'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  related_id?: string
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

const notificationIcons = {
  new_lead: User,
  lead_updated: User,
  client_added: User,
  reminder: Calendar,
  payment: DollarSign,
  system: Bell
}

const notificationColors = {
  new_lead: 'bg-green-100 text-green-800',
  lead_updated: 'bg-blue-100 text-blue-800',
  client_added: 'bg-purple-100 text-purple-800',
  reminder: 'bg-yellow-100 text-yellow-800',
  payment: 'bg-green-100 text-green-800',
  system: 'bg-gray-100 text-gray-800'
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      
      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.is_read).length || 0)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)

      if (error) throw error
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.is_read)
        .map(n => n.id)
      
      if (unreadIds.length === 0) return
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds)

      if (error) throw error
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      const notification = notifications.find(n => n.id === id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={markAllAsRead}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                
                <Button size="sm" variant="ghost" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-gray-500">Loading notifications...</div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Bell className="h-8 w-8 mb-2" />
                  <div>No notifications yet</div>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => {
                    const IconComponent = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell
                    
                    return (
                      <div 
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${
                            notificationColors[notification.type as keyof typeof notificationColors] || 'bg-gray-100 text-gray-800'
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                              </h4>
                              
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.is_read && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            
                            <div className="text-xs text-gray-400 mt-2">
                              {format(new Date(notification.created_at), 'MMM d, yyyy h:mm a')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}