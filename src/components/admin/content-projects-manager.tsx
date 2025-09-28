'use client'

import { useState, useEffect } from 'react'
import { ContentProject, AfterMedia } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Edit, 
  Trash2, 
  Plus, 
  Star, 
  Image, 
  Video, 
  Upload,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { FileUpload } from '@/components/admin/file-upload'
import { MultipleFileUpload } from '@/components/admin/multiple-file-upload'

interface ContentProjectsManagerProps {
  onClose?: () => void
}

export function ContentProjectsManager({ onClose }: ContentProjectsManagerProps) {
  const [projects, setProjects] = useState<ContentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<ContentProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    before_image_url: '',
    after_image_url: '',
    after_video_url: '',
    video_thumbnail_url: '',
    media_type: 'image' as 'image' | 'video' | 'mixed',
    is_video: false,
    is_featured: false,
    display_order: 0,
    is_active: true
  })
  const [afterMedia, setAfterMedia] = useState<AfterMedia[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content-projects')
      if (!response.ok) {
        throw new Error('Failed to fetch content projects')
      }
      const data = await response.json()
      setProjects(data || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
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
      after_video_url: project.after_video_url || '',
      video_thumbnail_url: project.video_thumbnail_url || '',
      media_type: project.media_type || 'image',
      is_video: project.is_video || false,
      is_featured: project.is_featured,
      display_order: project.display_order,
      is_active: project.is_active
    })
    setAfterMedia(project.after_media || [])
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      category: '',
      before_image_url: '',
      after_image_url: '',
      after_video_url: '',
      video_thumbnail_url: '',
      media_type: 'image',
      is_video: false,
      is_featured: false,
      display_order: projects.length,
      is_active: true
    })
    setAfterMedia([])
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const projectData = {
        ...formData,
        after_media: afterMedia
      }

      let response
      if (editingProject) {
        response = await fetch('/api/content-projects', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: editingProject.id, ...projectData }),
        })
      } else {
        response = await fetch('/api/content-projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save content project')
      }

      setIsDialogOpen(false)
      loadProjects()
    } catch (error) {
      console.error('Error saving project:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch('/api/content-projects', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete content project')
        }

        loadProjects()
      } catch (error) {
        console.error('Error deleting project:', error)
      }
    }
  }

  const toggleFeatured = async (project: ContentProject) => {
    try {
      const response = await fetch('/api/content-projects', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: project.id, 
          is_featured: !project.is_featured 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update featured status')
      }

      loadProjects()
    } catch (error) {
      console.error('Error updating featured status:', error)
    }
  }

  const addAfterMedia = () => {
    const newMedia: AfterMedia = {
      type: 'image',
      url: '',
      order: afterMedia.length + 1
    }
    setAfterMedia([...afterMedia, newMedia])
  }

  const handleMultipleUpload = (mediaItems: AfterMedia[]) => {
    // Update order values to continue from existing media
    const startOrder = afterMedia.length + 1
    const updatedMediaItems = mediaItems.map((item, index) => ({
      ...item,
      order: startOrder + index
    }))
    
    setAfterMedia([...afterMedia, ...updatedMediaItems])
  }

  const updateAfterMedia = (index: number, field: keyof AfterMedia, value: string | number) => {
    const updated = [...afterMedia]
    updated[index] = { ...updated[index], [field]: value }
    setAfterMedia(updated)
  }

  const removeAfterMedia = (index: number) => {
    setAfterMedia(afterMedia.filter((_, i) => i !== index))
  }

  const moveAfterMedia = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= afterMedia.length) return

    const updated = [...afterMedia]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Update order values
    updated.forEach((media, i) => {
      media.order = i + 1
    })

    setAfterMedia(updated)
  }

  if (loading) {
    return <div className="p-4">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Projects Manager</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.title}
                    {project.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {!project.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.category} • Order: {project.display_order}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(project)}
                  >
                    <Star className={`w-4 h-4 ${project.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {project.description}
              </p>
              <div className="flex gap-4">
                {project.before_image_url && (
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Before</Label>
                    <img 
                      src={project.before_image_url} 
                      alt="Before" 
                      className="w-full h-24 object-cover rounded border"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    After ({project.after_media?.length || 0} items)
                  </Label>
                  {project.after_media && project.after_media.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1">
                      {project.after_media.slice(0, 4).map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'video' ? (
                            <div className="relative">
                              <div className="w-full h-11 bg-gray-100 rounded border flex items-center justify-center">
                                <Video className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="absolute top-1 right-1">
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  Video
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <img 
                              src={media.url} 
                              alt={`After ${index + 1}`} 
                              className="w-full h-11 object-cover rounded border"
                            />
                          )}
                        </div>
                      ))}
                      {project.after_media.length > 4 && (
                        <div className="w-full h-11 bg-gray-50 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            +{project.after_media.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : project.after_image_url ? (
                    <img 
                      src={project.after_image_url} 
                      alt="After" 
                      className="w-full h-24 object-cover rounded border"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-50 rounded border flex items-center justify-center">
                      <span className="text-xs text-gray-500">No after media</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <FileUpload
                  label="Before Image"
                  currentUrl={formData.before_image_url}
                  accept="image/*"
                  allowVideo={false}
                  onUpload={(url) => setFormData({ ...formData, before_image_url: url })}
                  folder="before-images"
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">After Media</h3>
                <div className="flex gap-2">
                  <Button onClick={addAfterMedia} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Single Media
                  </Button>
                </div>
              </div>

              {/* Multiple File Upload Section */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <MultipleFileUpload
                  onUpload={handleMultipleUpload}
                  label="Upload Multiple Images & Videos"
                  allowVideo={true}
                  maxFiles={10}
                  maxSize={50}
                  bucket="content-projects"
                  folder="after-media"
                />
              </div>

              {afterMedia.map((media, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Media {index + 1}</h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveAfterMedia(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveAfterMedia(index, 'down')}
                          disabled={index === afterMedia.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeAfterMedia(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Type</Label>
                        <Select
                          value={media.type}
                          onValueChange={(value: 'image' | 'video') => 
                            updateAfterMedia(index, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={media.order}
                          onChange={(e) => updateAfterMedia(index, 'order', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <FileUpload
                        label={media.type === 'video' ? 'Video File' : 'Image File'}
                        currentUrl={media.url}
                        accept={media.type === 'video' ? 'video/*' : 'image/*'}
                        allowVideo={media.type === 'video'}
                        onUpload={(url, thumbnailUrl) => {
                          updateAfterMedia(index, 'url', url)
                          if (thumbnailUrl && media.type === 'video') {
                            updateAfterMedia(index, 'thumbnail', thumbnailUrl)
                          }
                        }}
                        folder={`after-${media.type}s`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Legacy after image for backward compatibility */}
              <div>
                <FileUpload
                  label="Legacy After Image (for backward compatibility)"
                  currentUrl={formData.after_image_url}
                  accept="image/*"
                  allowVideo={false}
                  onUpload={(url) => setFormData({ ...formData, after_image_url: url })}
                  folder="after-images-legacy"
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="media_type">Media Type</Label>
                  <Select
                    value={formData.media_type}
                    onValueChange={(value: 'image' | 'video' | 'mixed') => 
                      setFormData({ ...formData, media_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured Project</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}