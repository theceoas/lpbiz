import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const slotsPath = path.join(process.cwd(), 'data', 'slots.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// GET slots status
export async function GET() {
  try {
    await ensureDataDir()
    
    try {
      const data = await fs.readFile(slotsPath, 'utf-8')
      const slots = JSON.parse(data)
      return NextResponse.json(slots)
    } catch {
      // If file doesn't exist, return default slots configuration
      const defaultSlots = {
        totalSlots: 3,
        availableSlots: 3,
        waitlistEnabled: false,
        waitlistCount: 0,
        lastUpdated: new Date().toISOString(),
        status: "open" // "open", "full", "waitlist"
      }
      
      await fs.writeFile(slotsPath, JSON.stringify(defaultSlots, null, 2))
      return NextResponse.json(defaultSlots)
    }
  } catch {
    console.error('Error reading slots file')
    return NextResponse.json({ error: 'Failed to read slots' }, { status: 500 })
  }
}

// POST to update slots (for webhooks)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, slotsUsed, waitlistEnabled } = body

    await ensureDataDir()

    // Read current slots
    let slots
    try {
      const data = await fs.readFile(slotsPath, 'utf-8')
      slots = JSON.parse(data)
    } catch {
      slots = {
        totalSlots: 3,
        availableSlots: 3,
        waitlistEnabled: false,
        waitlistCount: 0,
        lastUpdated: new Date().toISOString(),
        status: "open"
      }
    }

    // Update based on action
    switch (action) {
      case 'reserve_slot':
        if (slots.availableSlots > 0) {
          slots.availableSlots -= 1
          if (slots.availableSlots === 0) {
            slots.status = "full"
            slots.waitlistEnabled = true
          }
        }
        break

      case 'release_slot':
        if (slots.availableSlots < slots.totalSlots) {
          slots.availableSlots += 1
          slots.status = "open"
          if (slots.waitlistCount > 0) {
            slots.waitlistCount -= 1
          }
        }
        break

      case 'add_waitlist':
        slots.waitlistCount += 1
        break

      case 'set_slots_used':
        if (slotsUsed !== undefined) {
          const used = Math.min(slotsUsed, slots.totalSlots)
          slots.availableSlots = Math.max(0, slots.totalSlots - used)
          slots.status = slots.availableSlots === 0 ? "full" : "open"
          if (slots.availableSlots === 0) {
            slots.waitlistEnabled = true
          }
        }
        break

      case 'toggle_waitlist':
        if (waitlistEnabled !== undefined) {
          slots.waitlistEnabled = waitlistEnabled
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    slots.lastUpdated = new Date().toISOString()

    // Write back to file
    await fs.writeFile(slotsPath, JSON.stringify(slots, null, 2))

    return NextResponse.json(slots)
  } catch {
    console.error('Error writing slots file')
    return NextResponse.json({ error: 'Failed to update slots' }, { status: 500 })
  }
}