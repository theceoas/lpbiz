import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, session_id } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Get client IP and user agent
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Get active AI agent configuration
    const { data: agentConfig, error: configError } = await supabase
      .from('ai_agent_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (configError || !agentConfig) {
      console.error('No active AI agent configuration found:', configError);
      return NextResponse.json({ error: 'AI agent not configured' }, { status: 500 });
    }

    // Create chat message record
    const { data: chatMessage, error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        question,
        session_id: session_id || `session_${Date.now()}`,
        user_ip: userIP,
        user_agent: userAgent,
        status: 'processing'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating chat message:', insertError);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    const startTime = Date.now();

    try {
      // If webhook URL is configured, send to n8n
      if (agentConfig.webhook_url) {
        const webhookPayload = {
          messageId: chatMessage.id,
          question,
          sessionId: chatMessage.session_id,
          systemPrompt: agentConfig.system_prompt,
          maxTokens: agentConfig.max_tokens,
          temperature: agentConfig.temperature,
          userIP,
          userAgent
        };

        const webhookResponse = await fetch(agentConfig.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!webhookResponse.ok) {
          throw new Error(`Webhook failed with status: ${webhookResponse.status}`);
        }

        const webhookResult = await webhookResponse.json();
        const processingTime = Date.now() - startTime;

        // Update chat message with response
        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({
            answer: webhookResult.answer || webhookResult.response || 'No response received',
            webhook_response: webhookResult,
            status: 'completed',
            processing_time_ms: processingTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', chatMessage.id);

        if (updateError) {
          console.error('Error updating chat message:', updateError);
        }

        return NextResponse.json({
          success: true,
          messageId: chatMessage.id,
          sessionId: chatMessage.session_id,
          question,
          answer: webhookResult.answer || webhookResult.response || 'No response received',
          processingTime
        });

      } else {
        // Fallback: Simple response without webhook
        const fallbackAnswer = "Thank you for your question! Our team will get back to you soon. In the meantime, feel free to book a consultation to discuss how BizPilot can automate your business processes.";
        
        const processingTime = Date.now() - startTime;

        const { error: updateError } = await supabase
          .from('chat_messages')
          .update({
            answer: fallbackAnswer,
            status: 'completed',
            processing_time_ms: processingTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', chatMessage.id);

        if (updateError) {
          console.error('Error updating chat message:', updateError);
        }

        return NextResponse.json({
          success: true,
          messageId: chatMessage.id,
          sessionId: chatMessage.session_id,
          question,
          answer: fallbackAnswer,
          processingTime
        });
      }

    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      
      const processingTime = Date.now() - startTime;
      const errorMessage = webhookError instanceof Error ? webhookError.message : 'Unknown error';
      
      // Update chat message with error status
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({
          answer: 'Sorry, I\'m experiencing technical difficulties. Please try again later or contact our support team.',
          status: 'failed',
          processing_time_ms: processingTime,
          webhook_response: { error: errorMessage },
          updated_at: new Date().toISOString()
        })
        .eq('id', chatMessage.id);

      if (updateError) {
        console.error('Error updating failed chat message:', updateError);
      }

      return NextResponse.json({
        success: false,
        messageId: chatMessage.id,
        sessionId: chatMessage.session_id,
        question,
        answer: 'Sorry, I\'m experiencing technical difficulties. Please try again later or contact our support team.',
        error: 'Webhook processing failed'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const messageId = searchParams.get('messageId');

    if (messageId) {
      // Get specific message
      const { data: message, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }

      return NextResponse.json({ message });
    }

    if (sessionId) {
      // Get messages for session
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching session messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
      }

      return NextResponse.json({ messages });
    }

    // Get recent messages (last 50)
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching recent messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Chat GET API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}