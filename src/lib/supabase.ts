import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback configuration.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// For server-side operations that require elevated permissions
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  business?: string // Keep for backward compatibility
  content: string
  quote?: string // Keep for backward compatibility
  rating?: number
  image_url?: string
  text_message_image_url?: string
  is_text_message?: boolean
  display_order?: number
  is_featured?: boolean
  created_at: string
  updated_at?: string
  is_active?: boolean
}

export interface BeforeAfterImage {
  id: string
  title: string
  description: string
  before_image_url: string
  after_image_url: string // Keep for backward compatibility
  after_media: AfterMedia[]
  after_video_url?: string
  video_thumbnail_url?: string
  media_type: 'image' | 'video' | 'mixed'
  is_video: boolean
  created_at: string
  is_active: boolean
}

export interface ChatMessage {
  id: string
  question: string
  answer: string
  created_at: string
  session_id?: string
}

export interface AfterMedia {
  type: 'image' | 'video'
  url: string
  order: number
  thumbnail?: string
}

export interface ContentProject {
  id: string
  title: string
  description?: string
  category: string
  before_image_url: string
  after_image_url: string // Keep for backward compatibility
  after_media: AfterMedia[]
  after_video_url?: string
  video_thumbnail_url?: string
  media_type: 'image' | 'video' | 'mixed'
  is_video: boolean
  is_featured: boolean
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}