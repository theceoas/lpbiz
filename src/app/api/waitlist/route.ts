import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const waitlistPath = path.join(process.cwd(), 'data', 'waitlist.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// POST to join waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, business, phone, message } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    await ensureDataDir()

    // Read existing waitlist
    let waitlist = []
    try {
      const data = await fs.readFile(waitlistPath, 'utf-8')
      waitlist = JSON.parse(data)
    } catch {
      // File doesn't exist, start with empty array
    }

    // Check if email already exists
    const existingEntry = waitlist.find((entry: { email: string }) => entry.email === email)
    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already registered for waitlist' },
        { status: 409 }
      )
    }

    // Create new waitlist entry
    const newEntry = {
      id: Date.now().toString(),
      name,
      email,
      business: business || '',
      phone: phone || '',
      message: message || '',
      joinedAt: new Date().toISOString(),
      status: 'waiting' // 'waiting', 'contacted', 'converted'
    }

    // Add to waitlist
    waitlist.push(newEntry)

    // Write back to file
    await fs.writeFile(waitlistPath, JSON.stringify(waitlist, null, 2))

    // Update slots to increment waitlist count
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/slots`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ action: 'increment_waitlist' })
       })
    } catch {
       console.error('Error updating slots')
     }

    return NextResponse.json({
      success: true,
      message: 'Successfully joined waitlist. We\'ll notify you when slots become available.',
      entry: newEntry
    }, { status: 201 })
  } catch {
    console.error('Error adding to waitlist')
    return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
  }
}

// GET waitlist (for admin purposes - you might want to add authentication)
export async function GET() {
  try {
    await ensureDataDir()
    
    try {
      const data = await fs.readFile(waitlistPath, 'utf-8')
      const waitlist = JSON.parse(data)
      return NextResponse.json(waitlist)
    } catch {
      return NextResponse.json([])
    }
  } catch {
    console.error('Error reading waitlist file')
    return NextResponse.json({ error: 'Failed to read waitlist' }, { status: 500 })
  }
}