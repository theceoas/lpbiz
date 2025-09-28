import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Create Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, bookingData } = body

    // Get the first pipeline stage (usually "New Lead")
    const { data: pipelineStages, error: stageError } = await supabase
      .from('pipeline_stages')
      .select('id, name')
      .order('order_index')
      .limit(1)

    if (stageError) {
      console.error('Pipeline stage error:', stageError)
      throw new Error('Failed to fetch pipeline stages')
    }

    const firstStage = pipelineStages?.[0]
    if (!firstStage) {
      throw new Error('No pipeline stages found')
    }

    // Extract booking information
    const attendeeInfo = bookingData?.attendees?.[0] || {}
    const eventInfo = bookingData?.event || {}
    
    // Use form data as primary source, fall back to booking data
    const leadData = {
      name: formData?.name || attendeeInfo.name || 'Unknown',
      email: formData?.email || attendeeInfo.email || '',
      phone: attendeeInfo.phone || null,
      company: formData?.businessType || null,
      estimated_value: null,
      source: bookingData ? 'Application Form + Cal.com Booking' : 'Application Form',
      notes: `Business Type: ${formData?.businessType || 'Not specified'}\nInstagram: @${formData?.instagramHandle || 'Not specified'}${bookingData ? `\nBooked call: ${eventInfo.title || 'Strategy Call'}\nScheduled for: ${bookingData?.startTime || 'Unknown time'}` : '\nLead submitted application form'}`,
      pipeline_stage_id: firstStage.id,
      status: 'new'
    }

    // Add lead to CRM
    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to insert lead')
    }

    // Create notification for new lead
    await supabase
      .from('notifications')
      .insert({
        type: 'new_lead',
        title: 'New Lead from Application Form',
        message: `${leadData.name} (${leadData.email}) from ${formData?.businessType || 'Unknown business'} completed the application form${bookingData ? ' and booked a call' : ''}. Instagram: @${formData?.instagramHandle || 'Not provided'}`,
        is_read: false
      })

    return NextResponse.json({ 
      success: true, 
      lead: insertedLead,
      message: 'Lead successfully added to CRM' 
    })

  } catch (error: any) {
    console.error('API Error adding lead to CRM:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to add lead to CRM' 
      },
      { status: 500 }
    )
  }
}