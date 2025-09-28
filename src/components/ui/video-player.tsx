'use client'

import { useState, useRef } from 'react'

interface VideoPlayerProps {
  src: string
  poster?: string
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

export function VideoPlayer({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoClick = () => {
    if (!controls) {
      togglePlay()
    }
  }

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover rounded"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        onClick={handleVideoClick}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      {!controls && (
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={togglePlay}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}