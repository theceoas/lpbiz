'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { LeadsTable } from '@/components/crm/leads-table'
import { AddLeadDialog } from '@/components/crm/add-lead-dialog'
import { PipelineView } from '@/components/crm/pipeline-view'
import { TestimonialManager } from '@/components/admin/testimonial-manager'
import { ClientsTable } from '@/components/crm/clients-table'
import { AddClientDialog } from '@/components/crm/add-client-dialog'
import { ChatMessagesTable } from '@/components/admin/chat-messages-table'
import { BeforeAfterManager } from '@/components/admin/before-after-manager'
import { ContentProjectsManager } from '@/components/admin/content-projects-manager'
import { 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Bell, 
  Image,
  BarChart3,
  UserPlus,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Activity,
  Mail,
  Phone,
  Building,
  Clock,
  Kanban
} from 'lucide-react'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [leadsView, setLeadsView] = useState('table') // 'table' or 'pipeline'
  const [pipelineStages, setPipelineStages] = useState<Array<{ id: string; name: string }>>([])
  const [dashboardData, setDashboardData] = useState({
    leads: 0,
    clients: 0,
    testimonials: 0,
    chatMessages: 0,
    recentLeads: [] as any[],
    recentTestimonials: [] as any[]
  })
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
      
      // Load dashboard data if user is authenticated
      if (session?.user?.email === 'admin@bizpilot.com') {
        loadDashboardData()
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user?.email === 'admin@bizpilot.com') {
          loadDashboardData()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const loadDashboardData = async () => {
    try {
      console.log('🔗 Connecting to Supabase...', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })

      // Test connection first
      const { data: testData, error: testError } = await supabase.from('leads').select('count', { count: 'exact', head: true })
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError)
        throw testError
      }
      console.log('✅ Supabase connection successful')

      // Fetch counts for all tables
      const [leadsRes, clientsRes, testimonialsRes, chatRes, pipelineRes] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
        supabase.from('pipeline_stages').select('id, name').order('order_index')
      ])

      // Check for errors in the responses
      if (leadsRes.error) console.error('Leads query error:', leadsRes.error)
      if (clientsRes.error) console.error('Clients query error:', clientsRes.error)
      if (testimonialsRes.error) console.error('Testimonials query error:', testimonialsRes.error)
      if (chatRes.error) console.error('Chat messages query error:', chatRes.error)
      if (pipelineRes.error) console.error('Pipeline stages query error:', pipelineRes.error)

      // Fetch recent data
      const [recentLeadsRes, recentTestimonialsRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(5)
      ])

      if (recentLeadsRes.error) console.error('Recent leads query error:', recentLeadsRes.error)
      if (recentTestimonialsRes.error) console.error('Recent testimonials query error:', recentTestimonialsRes.error)

      setPipelineStages(pipelineRes.data || [])
      setDashboardData({
        leads: leadsRes.count || 0,
        clients: clientsRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        chatMessages: chatRes.count || 0,
        recentLeads: recentLeadsRes.data || [],
        recentTestimonials: recentTestimonialsRes.data || []
      })

      console.log('📊 Dashboard data loaded:', {
        leads: leadsRes.count,
        clients: clientsRes.count,
        testimonials: testimonialsRes.count,
        chatMessages: chatRes.count
      })
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please check the console for details.')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user is admin
      if (data.user?.email !== 'admin@bizpilot.com') {
        await supabase.auth.signOut()
        throw new Error('Unauthorized: Admin access only')
      }

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-600">Sign in to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@bizpilot.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Your Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Check if user is admin
  const isAdmin = user.email === 'admin@bizpilot.com'
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Leads</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.leads}</p>
            </div>
            <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Clients</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.clients}</p>
            </div>
            <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Testimonials</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.testimonials}</p>
            </div>
            <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Chat Messages</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.chatMessages}</p>
            </div>
            <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent mb-4">Recent Leads</h3>
          <div className="space-y-3">
            {dashboardData.recentLeads.length > 0 ? (
              dashboardData.recentLeads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all duration-200">
                  <div>
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="text-sm text-slate-600">{lead.email}</p>
                  </div>
                  <span className="text-xs bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 text-white px-3 py-1 rounded-full shadow-sm">
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No recent leads</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent mb-4">Recent Testimonials</h3>
          <div className="space-y-3">
            {dashboardData.recentTestimonials.length > 0 ? (
              dashboardData.recentTestimonials.map((testimonial: any) => (
                <div key={testimonial.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{testimonial.name}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{testimonial.content}</p>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-4">No recent testimonials</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'leads':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Total Leads</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.leads}</p>
                  </div>
                  <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Active Clients</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.clients}</p>
                  </div>
                  <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Testimonials</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.testimonials}</p>
                  </div>
                  <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">Chat Messages</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">{dashboardData.chatMessages}</p>
                  </div>
                  <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-3 rounded-lg shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Header with actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">Lead Management</h3>
                  <p className="text-slate-600">Manage your leads and track them through the sales pipeline</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setLeadsView('table')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        leadsView === 'table'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-4 h-4 mr-2 inline" />
                      Table
                    </button>
                    <button
                      onClick={() => setLeadsView('pipeline')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        leadsView === 'pipeline'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Kanban className="w-4 h-4 mr-2 inline" />
                      Pipeline
                    </button>
                  </div>
                  <AddLeadDialog 
                    onLeadAdded={loadDashboardData}
                    pipelineStages={pipelineStages}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            {leadsView === 'table' ? (
              <LeadsTable onStatsUpdate={loadDashboardData} />
            ) : (
              <PipelineView onStatsUpdate={loadDashboardData} />
            )}
          </div>
        )
      case 'clients':
          return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Client Management</h3>
              <AddClientDialog onClientAdded={loadDashboardData} />
            </div>
            <ClientsTable onStatsUpdate={loadDashboardData} />
          </div>
      case 'testimonials':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TestimonialManager />
        </div>
      case 'chat':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ChatMessagesTable onStatsUpdate={loadDashboardData} />
        </div>
      case 'images':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <BeforeAfterManager />
        </div>
      case 'content-projects':
        return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ContentProjectsManager />
        </div>
      default:
        return renderDashboard()
    }
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'leads', name: 'Leads', icon: UserPlus },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'testimonials', name: 'Testimonials', icon: Star },
    { id: 'chat', name: 'Chat', icon: MessageSquare },
    { id: 'images', name: 'Images', icon: Image },
    { id: 'content-projects', name: 'Content Projects', icon: Image },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">
                BizPilot Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 space-y-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}