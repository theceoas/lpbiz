"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, AlertCircle } from "lucide-react"

interface SlotsStatus {
  totalSlots: number
  availableSlots: number
  waitlistEnabled: boolean
  waitlistCount: number
  lastUpdated: string
  status: "open" | "full" | "waitlist"
}

export function SlotsStatus() {
  const [slots, setSlots] = useState<SlotsStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch('/api/slots')
        if (response.ok) {
          const data = await response.json()
          setSlots(data)
        }
      } catch (error) {
        console.error('Error fetching slots:', error)
        // Fallback to default
        setSlots({
          totalSlots: 3,
          availableSlots: 3,
          waitlistEnabled: false,
          waitlistCount: 0,
          lastUpdated: new Date().toISOString(),
          status: "open"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [])

  if (loading || !slots) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    switch (slots.status) {
      case "open":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            <Users className="w-3 h-3 mr-1" />
            {slots.availableSlots} slots available
          </Badge>
        )
      case "full":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            All slots filled
          </Badge>
        )
      case "waitlist":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            Join waitlist
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (slots.status) {
      case "open":
        return `${slots.availableSlots} slots left this month`
      case "full":
        return "All slots filled - join our waitlist"
      case "waitlist":
        return `${slots.waitlistCount} people on waitlist`
      default:
        return "Checking availability..."
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
      {getStatusBadge()}
      <span>{getStatusText()}</span>
    </div>
  )
} 