import { NextRequest, NextResponse } from 'next/server'
import { saveChatMessage } from '@/lib/database'

// BizPilot AI knowledge base for webhook responses
const BIZPILOT_KNOWLEDGE = `
You are BizPilot AI, an intelligent assistant for a business automation service that helps Nigerian entrepreneurs automate their WhatsApp and Instagram operations.

Key Services:
- WhatsApp & Instagram automation
- Payment confirmation automation
- Order tracking and management
- 24/7 customer support automation
- Lead qualification and follow-up

Pricing:
- Starter: ₦15,000/month
- Growth: ₦25,000/month  
- Pro: ₦40,000/month

Benefits:
- Save 25+ hours weekly
- Never miss customer messages
- Increase sales by 40-60%
- Professional automated responses
- Real-time payment tracking

Always be helpful, professional, and focus on solving business challenges.
`

// Webhook endpoint for n8n integration
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret for security
    const webhookSecret = request.headers.get('x-webhook-secret')
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid webhook secret' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, user_id, platform, conversation_id } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate AI response
    const aiResponse = await generateWebhookResponse(message)

    // Save conversation to database
    await saveChatMessage({
      question: message,
      answer: aiResponse,
      session_id: conversation_id || `webhook-${user_id}-${Date.now()}`
    })

    // Return response in format expected by n8n
    return NextResponse.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      conversation_id: conversation_id || `webhook-${user_id}-${Date.now()}`,
      platform: platform || 'unknown',
      user_id: user_id
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        response: 'Sorry, I\'m having technical difficulties. Please try again or contact our support team.'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({ 
    status: 'BizPilot Webhook Active',
    timestamp: new Date().toISOString()
  })
}

// Generate AI response for webhook
async function generateWebhookResponse(message: string): Promise<string> {
  const lowerMessage = message.toLowerCase()

  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 👋 Welcome to BizPilot! I'm your AI assistant here to help you automate your business communications.\n\nI can help you with:\n• Learning about our automation services\n• Pricing information\n• Setup process\n• Success stories\n\nWhat would you like to know about BizPilot?"
  }

  // Pricing inquiries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('plan')) {
    return "💰 **BizPilot Pricing Plans:**\n\n🚀 **Starter Plan - ₦15,000/month**\n• Basic WhatsApp automation\n• Auto-replies and payment confirmations\n• Perfect for small businesses\n\n📈 **Growth Plan - ₦25,000/month**\n• WhatsApp + Instagram automation\n• Advanced order tracking\n• Lead qualification\n\n🏆 **Pro Plan - ₦40,000/month**\n• Full automation suite\n• Custom integrations\n• Priority support\n\nAll plans include setup, training, and ongoing support! Which plan interests you?"
  }

  // Feature inquiries
  if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('automation') || lowerMessage.includes('service')) {
    return "🤖 **BizPilot Automation Features:**\n\n✅ **WhatsApp Business Automation**\n• Instant auto-replies to customer messages\n• Payment confirmation automation\n• Order status updates\n\n✅ **Instagram DM Automation**\n• Automated responses to DMs\n• Lead capture and qualification\n\n✅ **Smart Features**\n• 24/7 customer support\n• Multi-language support\n• Custom response templates\n• Real-time analytics\n\n**Result:** Save 25+ hours weekly and increase sales by 40-60%! 📈\n\nWhat type of business do you run?"
  }

  // Setup process
  if (lowerMessage.includes('setup') || lowerMessage.includes('install') || lowerMessage.includes('how does it work') || lowerMessage.includes('get started')) {
    return "🚀 **Getting Started with BizPilot is Easy!**\n\n**Step 1:** 30-minute setup call with our team\n**Step 2:** We securely connect your WhatsApp Business & Instagram\n**Step 3:** Customize responses to match your brand voice\n**Step 4:** Train AI on your products and services\n**Step 5:** Go live within 24 hours! ⚡\n\n**No technical skills needed** - we handle everything for you!\n\nReady to get started? I can connect you with our setup team right now! 📞"
  }

  // Business type questions
  if (lowerMessage.includes('fashion') || lowerMessage.includes('beauty') || lowerMessage.includes('food') || lowerMessage.includes('product') || lowerMessage.includes('business')) {
    return "🎯 **Perfect! BizPilot works amazingly for product businesses!**\n\nWe help you:\n📱 Instantly respond to product inquiries\n💰 Confirm payments automatically\n📦 Send order updates and tracking\n🎯 Qualify leads and close more sales\n⭐ Collect reviews and testimonials\n\n**Real Results:**\n• Chioma (Beauty): Revenue doubled in 2 months\n• Ada (Fashion): 40% sales increase in month 1\n\nWhat's your biggest challenge with customer communication right now? 🤔"
  }

  // Results and testimonials
  if (lowerMessage.includes('result') || lowerMessage.includes('testimonial') || lowerMessage.includes('success') || lowerMessage.includes('review')) {
    return "🌟 **Real Success Stories from BizPilot Clients:**\n\n**Chioma - Beauty Products Seller:**\n\"Went from missing 10+ orders daily to ZERO missed sales. My revenue doubled in just two months!\"\n\n**Ada - Fashion Seller:**\n\"BizPilot saved me 25 hours every week and boosted my sales by 40% in the first month.\"\n\n**Typical Results:**\n📈 40-60% increase in sales\n⏰ 25+ hours saved weekly\n📱 Zero missed customer messages\n💰 Faster payment processing\n\nWhat kind of results are you hoping to achieve? 🎯"
  }

  // Security concerns
  if (lowerMessage.includes('safe') || lowerMessage.includes('secure') || lowerMessage.includes('data') || lowerMessage.includes('privacy')) {
    return "🔒 **Your Security is Our Priority!**\n\n✅ Bank-level encryption for all data\n✅ We never store sensitive customer info\n✅ Secure API connections only\n✅ You maintain full control of accounts\n✅ GDPR and data protection compliant\n✅ Regular security audits\n\n**You own your data** - we just help automate your responses!\n\nAny specific security questions I can address? 🛡️"
  }

  // Contact/support
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('talk to human')) {
    return "📞 **Ready to Talk to Our Team?**\n\nI can connect you with our experts who will:\n• Answer all your questions\n• Show you a live demo\n• Create a custom automation plan\n• Get you set up within 24 hours\n\n**Contact Options:**\n📱 WhatsApp: +234-XXX-XXXX\n📧 Email: hello@bizpilot.ng\n🗓️ Book a call: bizpilot.ng/demo\n\nWould you like me to schedule a call for you right now? ⏰"
  }

  // Default response for unclear messages
  return "🤖 **I'm here to help you learn about BizPilot!**\n\nI can provide information about:\n• 🚀 Our automation features\n• 💰 Pricing and plans\n• ⚙️ Setup process\n• 📈 Success stories\n• 🔒 Security and safety\n\nCould you tell me more about what you'd like to know? Or ask me something like:\n• \"How much does it cost?\"\n• \"How does the automation work?\"\n• \"Can you show me success stories?\"\n\nWhat interests you most about automating your business? 🎯"
}