'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Bell, Plus, Users, Target, TrendingUp, DollarSign } from 'lucide-react'
import { LeadsTable } from '@/components/crm/leads-table'
import { ClientsTable } from '@/components/crm/clients-table'
import { PipelineView } from '@/components/crm/pipeline-view'
import { NotificationPanel } from '@/components/crm/notification-panel'
import { AddLeadDialog } from '@/components/crm/add-lead-dialog'
import { AddClientDialog } from '@/components/crm/add-client-dialog'

interface DashboardStats {
  totalLeads: number
  totalClients: number
  conversionRate: number
  totalRevenue: number
  unreadNotifications: number
}

export default function CRMDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalClients: 0,
    conversionRate: 0,
    totalRevenue: 0,
    unreadNotifications: 0
  })
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddClient, setShowAddClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkUser()
    loadDashboardStats()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)
  }

  const loadDashboardStats = async () => {
    try {
      // Load leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      // Load clients count
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })

      // Load unread notifications count
      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      // Calculate conversion rate
      const conversionRate = leadsCount && clientsCount 
        ? Math.round((clientsCount / leadsCount) * 100) 
        : 0

      // Calculate total revenue (sum of contract values)
      const { data: revenueData } = await supabase
        .from('clients')
        .select('contract_value')
        .not('contract_value', 'is', null)

      const totalRevenue = revenueData?.reduce((sum, client) => 
        sum + (parseFloat(client.contract_value) || 0), 0
      ) || 0

      setStats({
        totalLeads: leadsCount || 0,
        totalClients: clientsCount || 0,
        conversionRate,
        totalRevenue,
        unreadNotifications: notificationsCount || 0
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">BizPilot CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {stats.unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Button>
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">
                Active prospects in pipeline
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Converted customers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Leads to clients ratio
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Contract values sum
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Tabs defaultValue="pipeline" className="space-y-4">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                  <TabsTrigger value="leads">Leads</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                </TabsList>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowAddLead(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                  <Button onClick={() => setShowAddClient(true)} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              </div>
              
              <TabsContent value="pipeline" className="space-y-4">
                <PipelineView onStatsUpdate={loadDashboardStats} />
              </TabsContent>
              
              <TabsContent value="leads" className="space-y-4">
                <LeadsTable onStatsUpdate={loadDashboardStats} />
              </TabsContent>
              
              <TabsContent value="clients" className="space-y-4">
                <ClientsTable onStatsUpdate={loadDashboardStats} />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <NotificationPanel 
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddLeadDialog 
        onLeadAdded={loadDashboardStats}
        pipelineStages={[
          { id: 'lead', name: 'Lead' },
          { id: 'qualified', name: 'Qualified' },
          { id: 'proposal', name: 'Proposal' },
          { id: 'negotiation', name: 'Negotiation' },
          { id: 'closed', name: 'Closed' }
        ]}
      />
      
      <AddClientDialog 
        onClientAdded={loadDashboardStats}
      />
    </div>
  )
}