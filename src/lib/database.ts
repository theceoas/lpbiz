import { supabase, supabaseAdmin, Testimonial, BeforeAfterImage, ChatMessage, ContentProject } from './supabase'

// Testimonials functions
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .or('is_active.eq.true,is_active.is.null')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Supabase connection error:', error)
    return []
  }
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial | null> {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single()

  if (error) {
    console.error('Error creating testimonial:', error)
    return null
  }

  return data
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating testimonial:', error)
    return false
  }

  return true
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('testimonials')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting testimonial:', error)
    return false
  }

  return true
}

// Before/After Images functions
export async function getBeforeAfterImages(): Promise<BeforeAfterImage[]> {
  const { data, error } = await supabase
    .from('content_projects')
    .select('id, title, description, before_image_url, after_image_url, after_media, after_video_url, video_thumbnail_url, media_type, is_video, created_at')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching before/after images:', error)
    throw error
  }

  // Transform ContentProject data to BeforeAfterImage format
  return (data || []).map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    before_image_url: project.before_image_url,
    after_image_url: project.after_image_url,
    after_media: project.after_media || [],
    after_video_url: project.after_video_url,
    video_thumbnail_url: project.video_thumbnail_url,
    media_type: project.media_type || 'image',
    is_video: project.is_video || false,
    created_at: project.created_at,
    is_active: true // Since we're filtering by is_active = true
  }))
}

export async function createBeforeAfterImage(image: Omit<BeforeAfterImage, 'id' | 'created_at'>): Promise<BeforeAfterImage | null> {
  const { data, error } = await supabaseAdmin
    .from('content_projects')
    .insert([{
      title: image.title,
      description: image.description,
      category: 'Before/After',
      before_image_url: image.before_image_url,
      after_image_url: image.after_image_url,
      is_video: false,
      is_featured: true,
      display_order: 0,
      is_active: image.is_active
    }])
    .select('id, title, description, before_image_url, after_image_url, created_at, is_active')
    .single()

  if (error) {
    console.error('Error creating before/after image:', error)
    return null
  }

  // Transform back to BeforeAfterImage format
  if (data) {
    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      before_image_url: data.before_image_url,
      after_image_url: data.after_image_url,
      after_media: [],
      after_video_url: '',
      video_thumbnail_url: '',
      media_type: 'image' as 'image' | 'video' | 'mixed',
      is_video: false,
      created_at: data.created_at,
      is_active: data.is_active
    }
  }

  return null
}

export async function updateBeforeAfterImage(id: string, updates: Partial<BeforeAfterImage>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('before_after_images')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating before/after image:', error)
    return false
  }

  return true
}

export async function deleteBeforeAfterImage(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('content_projects')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting before/after image:', error)
    return false
  }

  return true
}

// Chat Messages functions
export async function saveChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single()

  if (error) {
    console.error('Error saving chat message:', error)
    return null
  }

  return data
}

export async function getChatHistory(sessionId?: string): Promise<ChatMessage[]> {
  let query = supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true })

  if (sessionId) {
    query = query.eq('session_id', sessionId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching chat history:', error)
    return []
  }

  return data || []
}

// File upload functions
export async function uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading file:', error)
    return null
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Error deleting file:', error)
    return false
  }

  return true
}

// Content Projects functions
export async function getContentProjects(): Promise<ContentProject[]> {
  try {
    const { data, error } = await supabase
      .from('content_projects')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching content projects:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Supabase connection error:', error)
    return []
  }
}

export async function createContentProject(project: Omit<ContentProject, 'id' | 'created_at' | 'updated_at'>): Promise<ContentProject | null> {
  const { data, error } = await supabaseAdmin
    .from('content_projects')
    .insert([project])
    .select()
    .single()

  if (error) {
    console.error('Error creating content project:', error)
    return null
  }

  return data
}

export async function updateContentProject(id: string, updates: Partial<ContentProject>): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('content_projects')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating content project:', error)
    return false
  }

  return true
}

export async function deleteContentProject(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('content_projects')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting content project:', error)
    return false
  }

  return true
}