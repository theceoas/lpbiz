"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Clock, CheckCircle, AlertCircle } from "lucide-react"

interface WaitlistFormProps {
  onSuccess?: () => void
  className?: string
}

export function WaitlistForm({ onSuccess, className = "" }: WaitlistFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    phone: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Send to n8n webhook first
      const webhookData = {
        ...formData,
        type: 'waitlist',
        submittedAt: new Date().toISOString(),
        source: 'BizPilot Landing Page'
      }

      const webhookResponse = await fetch('https://n8n.srv942568.hstgr.cloud/webhook-test/09fbdc2f-067b-425b-897b-da38dcbd62a1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      if (!webhookResponse.ok) {
        throw new Error('Webhook failed')
      }

      // Then add to local waitlist
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: "", email: "", business: "", phone: "", message: "" })
        onSuccess?.()
      } else {
        setError(data.error || 'Failed to join waitlist')
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <Card className={`border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50 ${className}`}>
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">
            Successfully Joined Waitlist!
          </h3>
          <p className="text-emerald-700">
            We&apos;ll notify you via email when slots become available. You&apos;ll be among the first to know!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900">
          Join Our Waitlist
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Get notified when new slots become available. Priority access for waitlist members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business" className="text-sm font-medium text-gray-700">
                Business Type
              </Label>
              <Input
                id="business"
                name="business"
                type="text"
                value={formData.business}
                onChange={handleChange}
                className="mt-1"
                placeholder="Fashion, Beauty, etc."
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
                placeholder="+234..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Additional Message
            </Label>
            <Input
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 h-24"
              placeholder="Tell us about your business and what you're looking for..."
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Joining Waitlist...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Join Waitlist
              </div>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            We&apos;ll only use your email to notify you about slot availability. No spam, ever.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}