import { supabase, supabaseAdmin, ContentProject } from './supabase'

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

export async function getFeaturedContentProjects(limit: number = 3): Promise<ContentProject[]> {
  try {
    const { data, error } = await supabase
      .from('content_projects')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured content projects:', error)
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