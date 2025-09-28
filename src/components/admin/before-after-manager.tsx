"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react"
import { ContentProject } from "@/lib/supabase"
import { MediaDisplay } from "@/components/ui/media-display"

export function BeforeAfterManager() {
  const [projects, setProjects] = useState<ContentProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<ContentProject | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Before/After',
    before_image_url: '',
    after_image_url: '',
    is_video: false,
    is_featured: false,
    display_order: 0,
    is_active: true
  })
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null)
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content-projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        console.error('Failed to load content projects')
      }
    } catch (error) {
      console.error('Error loading content projects:', error)
    }
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let beforeImageUrl = formData.before_image_url
      let afterImageUrl = formData.after_image_url

      // Upload before image if a new file is selected
      if (beforeImageFile) {
        const fileName = `before-${Date.now()}-${beforeImageFile.name}`
        const uploadFormData = new FormData()
        uploadFormData.append('file', beforeImageFile)
        uploadFormData.append('fileName', fileName)
        
        const uploadResponse = await fetch('/api/content-projects/upload', {
          method: 'POST',
          body: uploadFormData
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          beforeImageUrl = uploadData.url
        } else {
          throw new Error('Failed to upload before image')
        }
      }

      // Upload after image if a new file is selected
      if (afterImageFile) {
        const fileName = `after-${Date.now()}-${afterImageFile.name}`
        const uploadFormData2 = new FormData()
        uploadFormData2.append('file', afterImageFile)
        uploadFormData2.append('fileName', fileName)
        
        const uploadResponse = await fetch('/api/content-projects/upload', {
          method: 'POST',
          body: uploadFormData2
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          afterImageUrl = uploadData.url
        } else {
          throw new Error('Failed to upload after image')
        }
      }

      const projectData = {
        ...formData,
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl
      }

      if (editingProject) {
        const response = await fetch('/api/content-projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProject.id, ...projectData })
        })
        
        if (!response.ok) {
          throw new Error('Failed to update content project')
        }
      } else {
        const response = await fetch('/api/content-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        })
        
        if (!response.ok) {
          throw new Error('Failed to create content project')
        }
      }

      await loadProjects()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving before/after image:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEdit = (project: ContentProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      category: project.category,
      before_image_url: project.before_image_url,
      after_image_url: project.after_image_url,
      is_video: project.is_video,
      is_featured: project.is_featured,
      display_order: project.display_order,
      is_active: project.is_active
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content project?')) {
      try {
        const response = await fetch(`/api/content-projects?id=${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await loadProjects()
        } else {
          console.error('Failed to delete content project')
        }
      } catch (error) {
        console.error('Error deleting content project:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      category: 'Before/After',
      before_image_url: '', 
      after_image_url: '',
      is_video: false,
      is_featured: false,
      display_order: 0,
      is_active: true
    })
    setEditingProject(null)
    setBeforeImageFile(null)
    setAfterImageFile(null)
  }

  const handleBeforeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setBeforeImageFile(file)
  }

  const handleAfterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setAfterImageFile(file)
  }

  if (isLoading) {
    return <div className="flex justify-center py-8 text-slate-600">Loading content projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Content Projects Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? 'Edit Content Project' : 'Add New Content Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="before-image">Before Image</Label>
                  <Input
                    id="before-image"
                    type="file"
                    accept="image/*"
                    onChange={handleBeforeImageChange}
                    className="mb-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formData.before_image_url && (
                    <div className="text-sm text-slate-600">
                      Current: <a href={formData.before_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="after-image">After Image</Label>
                  <Input
                    id="after-image"
                    type="file"
                    accept="image/*"
                    onChange={handleAfterImageChange}
                    className="mb-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formData.after_image_url && (
                    <div className="text-sm text-slate-600">
                      Current: <a href={formData.after_image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View</a>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
              {project.description && (
                <p className="text-sm text-slate-600 mt-1">{project.description}</p>
              )}
              <Badge variant="secondary" className="mt-2">{project.category}</Badge>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Before</h4>
                  <img
                    src={project.before_image_url}
                    alt="Before"
                    className="w-full h-32 object-cover rounded-md border border-slate-200"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">After</h4>
                  <MediaDisplay
                    media={project.after_media || []}
                    fallbackUrl={project.after_image_url}
                    className="w-full h-32 rounded-md border border-slate-200"
                    showControls={false}
                    autoPlay={false}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(project.before_image_url, '_blank')}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Before
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(project.after_image_url, '_blank')}
                >
                  <ImageIcon className="w-4 h-4 mr-1" />
                  After
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No before/after images found. Add your first comparison!</p>
        </div>
      )}
    </div>
  )
}