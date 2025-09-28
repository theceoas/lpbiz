"use client"

import Cal from "@calcom/embed-react"
import { Calendar, MessageCircle, CheckCircle, ArrowDown, UserPlus, Loader2, X } from "lucide-react"
import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'

interface FormData {
  name: string
  email: string
  businessType: string
  instagramHandle: string
}

interface BookingCalendarProps {
  onClose?: () => void;
  formData?: FormData;
}

export function BookingCalendar({ onClose, formData }: BookingCalendarProps) {
  const [isBooked, setIsBooked] = useState(false)
  const [isAddingToCRM, setIsAddingToCRM] = useState(false)
  const [crmAdded, setCrmAdded] = useState(false)
  const [crmError, setCrmError] = useState('')
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Listen for Cal.com booking events
  useEffect(() => {
    const handleCalEvent = (e: any) => {
      console.log('Cal.com event received:', e.detail)
      
      if (e.detail.type === 'bookingSuccessful') {
        console.log('Booking successful, adding to CRM:', e.detail.data)
        setIsBooked(true)
        setBookingDetails(e.detail.data)
        addLeadToCRM(e.detail.data)
      }
    }

    // Listen for Cal.com events
    window.addEventListener('cal:bookingSuccessful', handleCalEvent)
    
    return () => {
      window.removeEventListener('cal:bookingSuccessful', handleCalEvent)
    }
  }, [formData, onClose])

  // Fallback: Add lead to CRM when component mounts if we have form data
  useEffect(() => {
    if (formData && formData.name && formData.email && !crmAdded && !isAddingToCRM) {
      console.log('Adding lead to CRM with form data:', formData)
      // Add a small delay to allow Cal.com to load
      const timer = setTimeout(() => {
        addLeadToCRM(null) // Pass null for booking data, will use form data
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [formData, crmAdded, isAddingToCRM])

  const addLeadToCRM = async (bookingData: any) => {
    setIsAddingToCRM(true)
    setCrmError('')

    try {
      // Use the API endpoint to add lead to CRM
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          bookingData
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to add lead to CRM')
      }

      setCrmAdded(true)
      console.log('Lead successfully added to CRM:', result.lead)
    } catch (error: any) {
      console.error('Error adding lead to CRM:', error)
      setCrmError(error.message || 'Failed to add lead to CRM')
    } finally {
      setIsAddingToCRM(false)
    }
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'cal:booking-successful') {
        console.log('Booking successful:', event.data)
        setBookingDetails(event.data)
        setIsBooked(true)
        setBookingDetails(event.data)
        addLeadToCRM(event.data)
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  if (isBooked) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Thank You{formData?.name ? `, ${formData.name}` : ''}!
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            We&apos;ve received your application and booking{formData?.businessType ? ` for your ${formData.businessType} business` : ''}. You&apos;ll receive a confirmation email shortly at {formData?.email || 'your email address'}.
          </p>
        </div>

        {/* CRM Integration Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            {isAddingToCRM ? (
              <>
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-gray-700">Adding you to our CRM system...</span>
              </>
            ) : crmAdded ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-medium">Successfully added to our CRM system!</span>
              </>
            ) : crmError ? (
              <>
                <X className="w-5 h-5 text-red-600" />
                <span className="text-red-700">Failed to add to CRM: {crmError}</span>
              </>
            ) : null}
          </div>
          
          {crmError && !isAddingToCRM && (
            <button
              onClick={() => addLeadToCRM(bookingDetails)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Retry Adding to CRM
            </button>
          )}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">What&apos;s Next?</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
              <div>
                <p className="font-medium text-gray-900">Check Your Email</p>
                <p className="text-sm text-gray-600">You&apos;ll receive a calendar invite with meeting details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
              <div>
                <p className="font-medium text-gray-900">Prepare for the Call</p>
                <p className="text-sm text-gray-600">Think about your business goals and current challenges</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
              <div>
                <p className="font-medium text-gray-900">Join the Meeting</p>
                <p className="text-sm text-gray-600">We&apos;ll discuss your custom business solution strategy</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Need to reschedule? Use the link in your confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Happens Next?
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Here&apos;s your simple 3-step process:
          </p>
        </div>

        {/* Horizontal Process Flow */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <span className="text-white font-bold text-lg sm:text-xl">1</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg sm:text-xl">Book Your Call</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Schedule a 30-minute strategy call below
            </p>
          </div>

          {/* Arrow */}
           <div className="hidden lg:block">
             <ArrowDown className="w-6 h-6 text-blue-600 -rotate-90" />
           </div>
           <div className="lg:hidden">
             <ArrowDown className="w-6 h-6 text-blue-600" />
           </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg sm:text-xl">Strategy Discussion</h3>
            <p className="text-sm sm:text-base text-gray-600">
              We analyze your business and create a custom plan
            </p>
          </div>

          {/* Arrow */}
           <div className="hidden lg:block">
             <ArrowDown className="w-6 h-6 text-blue-600 -rotate-90" />
           </div>
           <div className="lg:hidden">
             <ArrowDown className="w-6 h-6 text-blue-600" />
           </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center max-w-xs">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg sm:text-xl">Get Your Proposal</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Receive timeline, pricing, and next steps
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full inline-block mb-4">
            <span className="text-sm sm:text-base font-semibold">👇 Click on a time slot below to book your call 👇</span>
          </div>
        </div>

        {/* Calendar Embed */}
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <div className="h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] w-full">
            <Cal 
              namespace="bizpilot-call" 
              calLink="abdu.manacq/bizpilot-call"
              style={{ 
                width: "100%", 
                height: "100%", 
                minHeight: "500px",
                border: "none"
              }}
              config={{
                layout: "month_view",
                theme: "light",
                branding: {
                  brandColor: "#2563eb"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}