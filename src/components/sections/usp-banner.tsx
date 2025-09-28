"use client"

import { Globe, ImageIcon, Mail, Package, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function USPBanner() {
  const services = [
    {
      icon: MessageSquare,
      title: "24/7 Customer Replies",
      description: "In your brand tone, across WhatsApp, Instagram, Facebook",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Globe,
      title: "Smart Shopping Website",
      description: "Tracks every order automatically",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: ImageIcon,
      title: "AI Image Enhancer",
      description: "Turns raw product photos into ready-to-post visuals",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Mail,
      title: "Automated Marketing",
      description: "Sends promos, collects reviews",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Package,
      title: "Full Order Management",
      description: "From payment to delivery follow-up",
      color: "from-pink-500 to-pink-600"
    }
  ]

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            What We Do for You
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI team handles everything while you focus on fulfilment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center mb-3 sm:mb-4`}>
                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-2">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* AI Conversation Screenshot */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">AI Conversation Example</CardTitle>
              <CardDescription>Real customer interaction handled by our AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">Hi! I saw your beautiful Ankara dress. Is it still available in size M?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-blue-500 rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-white">Yes! The Ankara dress is available in size M for ₦35,000. Would you like me to send you the payment link?</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AI</span>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">Perfect! I&apos;ll take it. Can you deliver tomorrow?</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Enhanced Product Image */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">AI Enhanced Product</CardTitle>
              <CardDescription>Before and after image enhancement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="bg-slate-200 rounded-lg h-32 sm:h-40 flex items-center justify-center mb-2">
                      <span className="text-slate-500 text-sm">Raw Photo</span>
                    </div>
                    <p className="text-xs text-gray-600">Original</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg h-32 sm:h-40 flex items-center justify-center mb-2 relative">
                      <span className="text-purple-600 text-sm">Enhanced</span>
                      <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        AI Enhanced
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">Ready to Post</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    <strong>AI Enhancement:</strong> Background removal, lighting correction, professional styling, and brand-consistent colors applied automatically.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}