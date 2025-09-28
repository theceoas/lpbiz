"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Settings, Zap, CheckCircle } from "lucide-react"

export function ProcessTimeline() {
  const timelineSteps = [
    {
      icon: Calendar,
      title: "Day 1–3",
      subtitle: "Gather brand info & products",
      description: "We collect your brand guidelines, product catalog, and business processes to customize your AI system.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Settings,
      title: "Day 4–7",
      subtitle: "Build & customize",
      description: "Our team builds your AI system, customizes responses, and integrates with your existing platforms.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Day 8–10",
      subtitle: "Test & launch",
      description: "We thoroughly test your system, train it on your specific use cases, and launch it live.",
      color: "from-emerald-500 to-emerald-600"
    }
  ]

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your 10-Day Launch Process
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From application to live AI system — everything happens in just 10 days
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {timelineSteps.map((step, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white relative">
              {index < timelineSteps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2 z-10"></div>
              )}
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-slate-800 text-white text-xs">
                    {index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {step.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-base font-semibold text-gray-700">
                  {step.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Message */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-800">
                  Day 10: Your AI System Goes Live!
                </h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                Your AI team starts handling customers immediately. You can focus on fulfilment while we manage everything else.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 