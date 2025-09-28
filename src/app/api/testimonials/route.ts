import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Testimonials API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      role,
      company,
      content,
      rating,
      image_url,
      text_message_image_url,
      is_text_message,
      display_order,
      is_featured
    } = body;

    // Validate required fields
    if (!name || !content) {
      return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .insert({
        name,
        role,
        company,
        content,
        rating: rating || 5,
        image_url,
        text_message_image_url,
        is_text_message: is_text_message || false,
        display_order: display_order || 0,
        is_featured: is_featured || false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating testimonial:', error);
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error) {
    console.error('Testimonials POST API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const { data: testimonial, error } = await supabaseAdmin
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating testimonial:', error);
      return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
    }

    return NextResponse.json({ testimonial });
  } catch (error) {
    console.error('Testimonials PUT API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication from request headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting testimonial:', error);
      return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Testimonials DELETE API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}