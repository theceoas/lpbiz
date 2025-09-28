"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ImageIcon, TrendingUp } from "lucide-react"

export function BenefitPanels() {
  const benefits = [
    {
      icon: Users,
      title: "You Sell. We Do Everything Else.",
      description: "No more late replies or scattered orders.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: ImageIcon,
      title: "Look Professional — Without the Work",
      description: "Raw photos → stunning visuals → instant uploads.",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Built to Scale With You",
      description: "Whether 3 or 300 orders — same system, zero stress.",
      gradient: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-r ${benefit.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-lg text-gray-600 leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 