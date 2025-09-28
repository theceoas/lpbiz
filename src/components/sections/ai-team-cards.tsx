"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Package, Megaphone, ImageIcon } from "lucide-react"

export function AITeamCards() {
  const teamMembers = [
    {
      icon: MessageSquare,
      title: "Customer Support Agent",
      description: "Replies, refunds, custom orders",
      color: "from-blue-500 to-blue-600",
      badge: "24/7 Active"
    },
    {
      icon: Mail,
      title: "Email Marketing Assistant",
      description: "Launches promos & coupons",
      color: "from-emerald-500 to-emerald-600",
      badge: "Auto-Triggered"
    },
    {
      icon: Package,
      title: "Order Manager",
      description: "Tracks orders, sends follow-ups",
      color: "from-purple-500 to-purple-600",
      badge: "Real-time"
    },
    {
      icon: Megaphone,
      title: "Product Promo Assistant",
      description: "Announces new collections",
      color: "from-orange-500 to-orange-600",
      badge: "Smart Timing"
    },
    {
      icon: ImageIcon,
      title: "Image Enhancer",
      description: "Beautifies photos, posts to social",
      color: "from-pink-500 to-pink-600",
      badge: "AI-Powered"
    }
  ]

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Your AI Team Members
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Each AI assistant has a specific role in your business — working together to handle everything while you focus on fulfillment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${member.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <member.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                    {member.badge}
                  </Badge>
                </div>
                <CardTitle className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                  {member.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {member.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}