'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

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
  notes?: string
  pipeline_stage_id?: string
}

interface EditLeadDialogProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLeadUpdated: () => void
  pipelineStages: Array<{ id: string; name: string }>
}

export function EditLeadDialog({ lead, open, onOpenChange, onLeadUpdated, pipelineStages }: EditLeadDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    priority: 'medium',
    source: '',
    estimated_value: '',
    notes: '',
    pipeline_stage_id: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if (lead && open) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'new',
        priority: lead.priority || 'medium',
        source: lead.source || '',
        estimated_value: lead.estimated_value?.toString() || '',
        notes: lead.notes || '',
        pipeline_stage_id: lead.pipeline_stage_id || ''
      })
      setError('')
    }
  }, [lead, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lead) return

    setLoading(true)
    setError('')

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        status: formData.status,
        priority: formData.priority,
        source: formData.source || null,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        notes: formData.notes || null,
        pipeline_stage_id: formData.pipeline_stage_id || null,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id)

      if (error) throw error

      onLeadUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating lead:', error)
      setError('Failed to update lead. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!lead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-estimated_value">Estimated Value ($)</Label>
              <Input
                id="edit-estimated_value"
                type="number"
                value={formData.estimated_value}
                onChange={(e) => handleInputChange('estimated_value', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-source">Source</Label>
              <Input
                id="edit-source"
                placeholder="Website, referral, etc."
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-pipeline_stage">Pipeline Stage</Label>
            <Select 
              value={formData.pipeline_stage_id} 
              onValueChange={(value) => handleInputChange('pipeline_stage_id', value)}
            >
              <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {pipelineStages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              placeholder="Additional notes about this lead..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}