"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { BookingCalendar } from "@/components/booking-calendar"
import { ChevronLeft, ChevronRight, User, Calendar, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface FormData {
  name: string
  email: string
  businessType: string
  instagramHandle: string
}

export default function BookCallPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessType: "",
    instagramHandle: ""
  })

  const totalSteps = 3

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isStep1Valid = formData.name && formData.email
  const isStep2Valid = formData.businessType && formData.instagramHandle

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Tell us about yourself</h3>
              <p className="text-gray-600 max-w-md mx-auto">We'd love to get to know you better and understand your needs</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">About your business</h3>
              <p className="text-gray-600 max-w-md mx-auto">Help us understand your business better so we can provide the best solution</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  What do you sell? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessType"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange("businessType", e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagramHandle" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Instagram Handle <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">@</span>
                  <Input
                    id="instagramHandle"
                    value={formData.instagramHandle}
                    onChange={(e) => handleInputChange("instagramHandle", e.target.value)}
                    className="h-12 pl-8 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3 p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Schedule Your Call</h3>
              <p className="text-gray-600 max-w-md mx-auto">Choose a time that works best for you and let's discuss your project</p>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <BookingCalendar formData={formData} />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-6 sm:mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Book Your Strategy Call
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Let&apos;s discuss how we can transform your business with our proven strategies
          </p>
        </div>
      </div>

      {/* Process Overview */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your AI Strategy Call Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Here's exactly what happens after you book your call</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Strategy Call</h3>
              <p className="text-gray-600">We'll analyze your business, identify opportunities, and create a custom AI strategy tailored to your specific needs and goals.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom AI Development</h3>
              <p className="text-gray-600">Our team builds your personalized AI system, integrating it seamlessly with your existing workflows and business processes.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Launch & Optimization</h3>
              <p className="text-gray-600">We deploy your AI system, provide training, and continuously optimize performance to maximize your ROI and business growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Step {currentStep} of {totalSteps}
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-10 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center gap-2 h-12 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !isStep1Valid) ||
                    (currentStep === 2 && !isStep2Valid)
                  }
                  className="flex items-center justify-center gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all duration-200 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg w-full sm:w-auto"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}