'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Star, User } from 'lucide-react'
import { Testimonial } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

export function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    display_order: 0,
    is_featured: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('No session found')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/testimonials', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to load testimonials')
      }
      
      const data = await response.json()
      setTestimonials(data.testimonials || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('No session found')
        return
      }

      const url = editingTestimonial 
        ? `/api/testimonials?id=${editingTestimonial.id}`
        : '/api/testimonials'
      
      const method = editingTestimonial ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save testimonial')
      }
      
      await loadTestimonials()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving testimonial:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating || 5,
      display_order: testimonial.display_order || 0,
      is_featured: testimonial.is_featured || false
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          console.error('No session found')
          return
        }

        const response = await fetch(`/api/testimonials?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete testimonial')
        }
        
        await loadTestimonials()
      } catch (error) {
        console.error('Error deleting testimonial:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      content: '',
      rating: 5,
      display_order: 0,
      is_featured: false
    })
    setEditingTestimonial(null)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (isLoading) {
    return <div className="flex justify-center py-8 text-slate-600">Loading testimonials...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Customer Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., John Smith"
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                    Company/Business *
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    placeholder="e.g., ABC Fashion Store"
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                    Role/Title
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., CEO, Store Owner, Manager"
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div>
                <Label htmlFor="content" className="text-sm font-medium text-slate-700">
                  Testimonial Content *
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  required
                  placeholder="Enter the customer's testimonial here..."
                  className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Write the testimonial in the customer's own words
                </p>
              </div>

              {/* Rating and Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating" className="text-sm font-medium text-slate-700">
                    Rating
                  </Label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="display_order" className="text-sm font-medium text-slate-700">
                    Display Order
                  </Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="is_featured" className="text-sm font-medium text-slate-700">
                  Mark as featured testimonial
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No testimonials found</h3>
            <p className="text-slate-500 mb-4">Add your first testimonial to get started!</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      {testimonial.name}
                    </CardTitle>
                    <p className="text-sm text-slate-600">
                      {testimonial.role && `${testimonial.role}, `}{testimonial.company}
                    </p>
                  </div>
                  {testimonial.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(testimonial.rating || 5)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.content}"
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">
                    Order: {testimonial.display_order || 0}
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}