'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Loader2 } from 'lucide-react'

interface AddLeadDialogProps {
  onLeadAdded: () => void
  pipelineStages: Array<{ id: string; name: string }>
}

export function AddLeadDialog({ onLeadAdded, pipelineStages }: AddLeadDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    priority: 'medium',
    estimated_value: '',
    source: '',
    notes: '',
    pipeline_stage_id: ''
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get the first pipeline stage if none selected
      const stageId = formData.pipeline_stage_id || pipelineStages[0]?.id
      
      if (!stageId) {
        throw new Error('No pipeline stages available')
      }

      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        priority: formData.priority,
        estimated_value: formData.estimated_value ? parseInt(formData.estimated_value) : null,
        source: formData.source || null,
        notes: formData.notes || null,
        pipeline_stage_id: stageId,
        status: 'new'
      }

      const { error: insertError } = await supabase
        .from('leads')
        .insert([leadData])

      if (insertError) throw insertError

      // Create notification for new lead
      await supabase
        .from('notifications')
        .insert({
          type: 'new_lead',
          title: 'New Lead Added',
          message: `${formData.name} has been added as a new lead`,
          is_read: false
        })

      // Reset form and close dialog
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        priority: 'medium',
        estimated_value: '',
        source: '',
        notes: '',
        pipeline_stage_id: ''
      })
      
      setOpen(false)
      onLeadAdded()
    } catch (error: any) {
      console.error('Error adding lead:', error)
      setError(error.message || 'Failed to add lead')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="estimated_value">Estimated Value ($)</Label>
              <Input
                id="estimated_value"
                type="number"
                value={formData.estimated_value}
                onChange={(e) => handleInputChange('estimated_value', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="Website, referral, etc."
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pipeline_stage">Pipeline Stage</Label>
              <Select 
                value={formData.pipeline_stage_id} 
                onValueChange={(value) => handleInputChange('pipeline_stage_id', value)}
              >
                <SelectTrigger>
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this lead..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}