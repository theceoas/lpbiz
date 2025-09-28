"use client"

import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import Link from "next/link"
import { SlotsStatus } from "@/components/slots-status"

export function HeroSection() {


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-1/4 w-72 h-72 bg-gradient-to-r from-slate-300 to-blue-300 rounded-full opacity-15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -left-1/4 w-64 h-64 bg-gradient-to-r from-blue-300 to-slate-300 rounded-full opacity-15 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-r from-gray-300 to-slate-300 rounded-full opacity-10 blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-20">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight px-2">
            Your Full-Time{" "}
            <span className="bg-gradient-to-r from-slate-600 via-blue-600 to-slate-700 bg-clip-text text-transparent">
              AI Business Team
            </span>
            <br />
            — For a One-Time Fee
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-8 leading-relaxed px-4 max-w-3xl mx-auto">
            Get a complete digital team that runs your online business 24/7.
            <br />
            Content, sales, support, and growth — all handled for you, forever.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 px-4">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
              10-Day Launch Guarantee
            </span>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
              No Monthly Fees
            </span>
            <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-purple-200">
              Works with WhatsApp, Instagram & Web
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center mb-6 px-4">
            <Link href="/book-call">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                Apply for Your AI System
              </Button>
            </Link>
          </div>

          {/* Micro-trust */}
          <p className="text-sm text-gray-500 mb-8 px-4 max-w-2xl mx-auto">
            No subscriptions. You only top-up low usage credits as you grow — like airtime.
          </p>

          {/* Dynamic Slots Status */}
          <div className="px-4">
            <SlotsStatus />
          </div>
        </div>
      </div>
    </section>
  )
}