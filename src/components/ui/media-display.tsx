"use client"

import { useState } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { AfterMedia } from "@/lib/supabase"

interface MediaDisplayProps {
  media: AfterMedia[]
  fallbackUrl?: string
  className?: string
  showControls?: boolean
  autoPlay?: boolean
}

export function MediaDisplay({ 
  media, 
  fallbackUrl, 
  className = "", 
  showControls = true,
  autoPlay = false 
}: MediaDisplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // Use fallback if no media or use the first media item
  const displayMedia = media.length > 0 ? media : (fallbackUrl ? [{ type: 'image' as const, url: fallbackUrl, order: 1 }] : [])
  const currentMedia = displayMedia[currentIndex]

  if (!currentMedia) {
    return (
      <div className={`bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm text-white font-medium">NO MEDIA</span>
        </div>
      </div>
    )
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const nextMedia = () => {
    if (displayMedia.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % displayMedia.length)
      setIsPlaying(false)
    }
  }

  const prevMedia = () => {
    if (displayMedia.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + displayMedia.length) % displayMedia.length)
      setIsPlaying(false)
    }
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {currentMedia.type === 'video' ? (
        <div className="relative w-full h-full">
          <video
            src={currentMedia.url}
            poster={currentMedia.thumbnail}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={autoPlay}
            muted={isMuted}
            loop
            playsInline
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          />
          
          {showControls && (
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const video = document.querySelector('video')
                    if (video) {
                      if (isPlaying) {
                        video.pause()
                      } else {
                        video.play()
                      }
                    }
                  }}
                  className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-gray-800" />
                  ) : (
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  )}
                </button>
                
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-gray-800" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-gray-800" />
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Video indicator */}
          <div className="absolute top-2 left-2">
            <Play className="w-4 h-4 text-white drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <img 
          src={currentMedia.url} 
          alt="Media content"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Multiple media navigation */}
      {displayMedia.length > 1 && showControls && (
        <>
          <button
            onClick={prevMedia}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextMedia}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
          >
            →
          </button>
          
          {/* Media indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {displayMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}