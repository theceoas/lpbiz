'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Image, Video, FileText, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { AfterMedia } from '@/lib/supabase'

interface MultipleFileUploadProps {
  onUpload: (mediaItems: AfterMedia[]) => void
  accept?: string
  maxSize?: number // in MB
  bucket?: string
  folder?: string
  label?: string
  allowVideo?: boolean
  maxFiles?: number
}

interface UploadingFile {
  file: File
  progress: number
  error?: string
  url?: string
  thumbnailUrl?: string
  type: 'image' | 'video'
}

export function MultipleFileUpload({
  onUpload,
  accept = "image/*,video/*",
  maxSize = 50,
  bucket = "content-projects",
  folder = "",
  label = "Upload Multiple Files",
  allowVideo = true,
  maxFiles = 10
}: MultipleFileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        reject(new Error('Not a video file'))
        return
      }

      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.addEventListener('loadedmetadata', () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Seek to 1 second or 10% of video duration, whichever is smaller
        video.currentTime = Math.min(1, video.duration * 0.1)
      })

      video.addEventListener('seeked', () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.readAsDataURL(blob)
            } else {
              reject(new Error('Failed to generate thumbnail'))
            }
          }, 'image/jpeg', 0.8)
        }
      })

      video.addEventListener('error', () => {
        reject(new Error('Failed to load video'))
      })

      const url = URL.createObjectURL(file)
      video.src = url
      video.load()
    })
  }

  const uploadSingleFile = async (file: File, index: number) => {
    try {
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder ? folder + '/' : ''}${timestamp}-${randomString}.${fileExt}`

      // Update progress
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 25 } : f
      ))

      // Upload main file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Update progress
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 50 } : f
      ))

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      let thumbnailUrl: string | undefined

      // Generate and upload thumbnail for videos
      if (file.type.startsWith('video/') && allowVideo) {
        try {
          const thumbnailDataUrl = await generateThumbnail(file)
          
          // Convert data URL to blob
          const response = await fetch(thumbnailDataUrl)
          const thumbnailBlob = await response.blob()
          
          const thumbnailFileName = `${folder ? folder + '/' : ''}thumbnails/${timestamp}-${randomString}.jpg`
          
          const { data: thumbnailData, error: thumbnailError } = await supabase.storage
            .from(bucket)
            .upload(thumbnailFileName, thumbnailBlob, {
              cacheControl: '3600',
              upsert: false
            })

          if (!thumbnailError) {
            const { data: { publicUrl: thumbnailPublicUrl } } = supabase.storage
              .from(bucket)
              .getPublicUrl(thumbnailFileName)
            
            thumbnailUrl = thumbnailPublicUrl
          }
        } catch (thumbnailError) {
          console.warn('Failed to generate thumbnail:', thumbnailError)
          // Continue without thumbnail
        }
      }

      // Update with final result
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          progress: 100, 
          url: publicUrl, 
          thumbnailUrl 
        } : f
      ))

    } catch (error) {
      console.error('Upload error:', error)
      setUploadingFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ))
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const fileArray = Array.from(files).slice(0, maxFiles)
    
    // Initialize uploading files state
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }))
    
    setUploadingFiles(newUploadingFiles)

    // Upload all files concurrently
    await Promise.all(
      fileArray.map((file, index) => uploadSingleFile(file, index))
    )
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (type: string) => {
    if (type === 'video') {
      return <Video className="w-4 h-4" />
    } else if (type === 'image') {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  const handleConfirmUpload = () => {
    const successfulUploads = uploadingFiles.filter(f => f.url && !f.error)
    const mediaItems: AfterMedia[] = successfulUploads.map((f, index) => ({
      type: f.type,
      url: f.url!,
      order: index + 1,
      thumbnail: f.thumbnailUrl
    }))
    
    onUpload(mediaItems)
    setUploadingFiles([])
  }

  const hasSuccessfulUploads = uploadingFiles.some(f => f.url && !f.error)
  const hasUploading = uploadingFiles.some(f => f.progress > 0 && f.progress < 100 && !f.error)

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <div className="text-lg font-medium mb-2">
          Drop multiple files here or click to select
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Support for images and videos (max {maxFiles} files, {maxSize}MB each)
        </div>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={hasUploading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Select Files
        </Button>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploading Files:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uploadingFiles.map((uploadingFile, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {getFileIcon(uploadingFile.type)}
                      <span className="text-sm truncate">
                        {uploadingFile.file.name}
                      </span>
                      <Badge variant={uploadingFile.type === 'video' ? 'secondary' : 'default'}>
                        {uploadingFile.type}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {uploadingFile.error ? (
                    <div className="text-sm text-destructive">
                      {uploadingFile.error}
                    </div>
                  ) : uploadingFile.url ? (
                    <div className="text-sm text-green-600">
                      ✓ Upload complete
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Uploading... {uploadingFile.progress}%
                      </div>
                      <Progress value={uploadingFile.progress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {hasSuccessfulUploads && !hasUploading && (
            <div className="flex justify-end">
              <Button onClick={handleConfirmUpload}>
                Add {uploadingFiles.filter(f => f.url && !f.error).length} Media Items
              </Button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}