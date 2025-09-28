'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image, Video, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface FileUploadProps {
  onUpload: (url: string, thumbnailUrl?: string) => void
  accept?: string
  maxSize?: number // in MB
  bucket?: string
  folder?: string
  label?: string
  currentUrl?: string
  allowVideo?: boolean
}

export function FileUpload({
  onUpload,
  accept = "image/*,video/*",
  maxSize = 50,
  bucket = "content-projects",
  folder = "",
  label = "Upload File",
  currentUrl,
  allowVideo = true
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
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

  const uploadFile = async (file: File) => {
    try {
      setUploading(true)
      setError(null)
      setProgress(0)

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`)
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder ? folder + '/' : ''}${timestamp}-${randomString}.${fileExt}`

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

      setProgress(50)

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

      setProgress(100)
      onUpload(publicUrl, thumbnailUrl)
      
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    uploadFile(file)
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

  const getFileIcon = (url: string) => {
    if (url.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
      return <Video className="w-4 h-4" />
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl && (
        <div className="flex items-center gap-2 p-2 border rounded">
          {getFileIcon(currentUrl)}
          <span className="text-sm truncate flex-1">{currentUrl.split('/').pop()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUpload('', '')}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        } ${uploading ? 'opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="text-sm">Uploading...</div>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              Drag and drop a file here, or click to select
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              Select File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-destructive">{error}</div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  )
}