'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Mail, Phone, Building, DollarSign, Calendar, MoreVertical } from 'lucide-react'
import { format } from 'date-fns'

interface PipelineStage {
  id: string
  name: string
  color: string
  order_index: number
}

interface Lead {
  id: string
  email: string
  name: string
  company?: string
  phone?: string
  status: string
  priority: string
  estimated_value?: number
  created_at: string
  pipeline_stage_id: string
}

interface PipelineViewProps {
  onStatsUpdate: () => void
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
}

export function PipelineView({ onStatsUpdate }: PipelineViewProps) {
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadPipelineData()
  }, [])

  const loadPipelineData = async () => {
    try {
      setLoading(true)
      
      // Load pipeline stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index')

      if (stagesError) throw stagesError
      
      // Load leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (leadsError) throw leadsError
      
      setStages(stagesData || [])
      setLeads(leadsData || [])
    } catch (error) {
      console.error('Error loading pipeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    
    if (source.droppableId === destination.droppableId) return

    try {
      // Update lead's pipeline stage
      const { error } = await supabase
        .from('leads')
        .update({ 
          pipeline_stage_id: destination.droppableId,
          status: getStatusFromStage(destination.droppableId)
        })
        .eq('id', draggableId)

      if (error) throw error

      // Update local state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === draggableId 
            ? { 
                ...lead, 
                pipeline_stage_id: destination.droppableId,
                status: getStatusFromStage(destination.droppableId)
              }
            : lead
        )
      )
      
      onStatsUpdate()
    } catch (error) {
      console.error('Error updating lead stage:', error)
    }
  }

  const getStatusFromStage = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId)
    if (!stage) return 'new'
    
    const stageNameLower = stage.name.toLowerCase()
    if (stageNameLower.includes('new') || stageNameLower.includes('initial')) return 'new'
    if (stageNameLower.includes('contact')) return 'contacted'
    if (stageNameLower.includes('qualif')) return 'qualified'
    if (stageNameLower.includes('proposal')) return 'proposal'
    if (stageNameLower.includes('negotiat')) return 'negotiation'
    if (stageNameLower.includes('won') || stageNameLower.includes('closed')) return 'closed_won'
    if (stageNameLower.includes('lost')) return 'closed_lost'
    return 'new'
  }

  const getLeadsForStage = (stageId: string) => {
    return leads.filter(lead => lead.pipeline_stage_id === stageId)
  }

  const getTotalValueForStage = (stageId: string) => {
    return getLeadsForStage(stageId)
      .reduce((total, lead) => total + (lead.estimated_value || 0), 0)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pipeline
          </h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-slate-500">Loading pipeline...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sales Pipeline
        </h2>
      </div>
      
      <div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
            {stages.map((stage) => {
              const stageLeads = getLeadsForStage(stage.id)
              const totalValue = getTotalValueForStage(stage.id)
              
              return (
                <div key={stage.id} className="min-w-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-slate-800">{stage.name}</h3>
                      <Badge 
                        style={{ backgroundColor: stage.color }}
                        className="text-white shadow-sm"
                      >
                        {stageLeads.length}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-slate-500 font-medium">
                      Total: <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">${totalValue.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`h-[400px] p-2 rounded-lg border-2 border-dashed transition-colors overflow-y-auto ${
                          snapshot.isDraggingOver 
                            ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm transition-all duration-200 ${
                                  snapshot.isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md hover:border-blue-300/50'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm text-slate-800">{lead.name}</h4>
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {lead.email}
                                    </div>
                                  </div>
                                  
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-slate-100">
                                    <MoreVertical className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </div>
                                
                                {lead.company && (
                                  <div className="flex items-center text-xs text-slate-500 mb-2">
                                    <Building className="h-3 w-3 mr-1" />
                                    {lead.company}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <Badge className={priorityColors[lead.priority as keyof typeof priorityColors]}>
                                    {lead.priority}
                                  </Badge>
                                  
                                  {lead.estimated_value && (
                                    <div className="flex items-center text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                      <DollarSign className="h-3 w-3 mr-1 text-blue-600" />
                                      {lead.estimated_value.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center text-xs text-slate-400 mt-2">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(lead.created_at), 'MMM d')}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {stageLeads.length === 0 && (
                          <div className="text-center text-slate-400 text-sm py-8">
                            No leads in this stage
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}