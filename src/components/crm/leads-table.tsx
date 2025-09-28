'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Search, Mail, Phone, Building, Calendar, Edit, Trash2, Instagram } from 'lucide-react'
import { format } from 'date-fns'
import { EditLeadDialog } from './edit-lead-dialog'

interface Lead {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  status: string
  priority: string
  source?: string
  estimated_value?: number
  created_at: string
  notes?: string
  pipeline_stage?: {
    name: string
    color: string
  }
}

// Function to extract Instagram handle from notes
const extractInstagramHandle = (notes?: string): string | null => {
  if (!notes) return null
  const match = notes.match(/Instagram:\s*@?([^\s\n]+)/i)
  return match ? match[1] : null
}

interface PipelineStage {
  id: string
  name: string
  color: string
}

interface LeadsTableProps {
  onStatsUpdate: () => void
}

const statusColors = {
  new: 'bg-red-100 text-red-800',
  contacted: 'bg-orange-100 text-orange-800',
  qualified: 'bg-yellow-100 text-yellow-800',
  proposal: 'bg-blue-100 text-blue-800',
  negotiation: 'bg-purple-100 text-purple-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-gray-100 text-gray-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

export function LeadsTable({ onStatsUpdate }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([])
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadLeads()
    loadPipelineStages()
  }, [])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          pipeline_stage:pipeline_stages(name, color)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setLeads(data || [])
    } catch (error) {
      console.error('Error loading leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPipelineStages = async () => {
    try {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('id, name, color')
        .order('order_index', { ascending: true })

      if (error) throw error
      setPipelineStages(data || [])
    } catch (error) {
      console.error('Error loading pipeline stages:', error)
    }
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setEditingLead(null)
    loadLeads()
    onStatsUpdate()
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return
    
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setLeads(leads.filter(lead => lead.id !== id))
      onStatsUpdate()
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent mb-4">
          Leads
        </h3>
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-500">Loading leads...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent mb-4">
          Leads ({filteredLeads.length})
        </h3>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed_won">Closed Won</SelectItem>
              <SelectItem value="closed_lost">Closed Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        {filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {leads.length === 0 ? 'No leads found. Add your first lead!' : 'No leads match your filters.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.map((lead) => {
              const instagramHandle = extractInstagramHandle(lead.notes)
              return (
                <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {lead.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-medium text-slate-900">{lead.name}</h4>
                        <div className="flex items-center text-xs text-slate-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-blue-600"
                        onClick={() => handleEdit(lead)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLead(lead.id)}
                        className="text-slate-600 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {lead.company && (
                      <div className="flex items-center text-sm text-slate-700">
                        <Building className="h-4 w-4 mr-2 text-slate-500" />
                        <span>{lead.company}</span>
                      </div>
                    )}
                    
                    {lead.phone && (
                      <div className="flex items-center text-sm text-slate-700">
                        <Phone className="h-4 w-4 mr-2 text-slate-500" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    
                    {instagramHandle && (
                      <div className="flex items-center text-sm text-slate-700">
                        <Instagram className="h-4 w-4 mr-2 text-slate-500" />
                        <span>@{instagramHandle}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={statusColors[lead.status as keyof typeof statusColors]}>
                          {lead.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                          {lead.priority}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="text-sm text-slate-600">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </div>
                      {lead.estimated_value && (
                        <div className="text-lg font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">
                          ${lead.estimated_value.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <EditLeadDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        lead={editingLead}
        pipelineStages={pipelineStages}
        onLeadUpdated={handleEditSuccess}
      />
    </div>
  )
}