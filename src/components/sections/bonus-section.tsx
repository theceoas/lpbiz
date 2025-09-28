"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Zap, Clock, Gift, Settings } from "lucide-react"

export function BonusSection() {
  const bonuses = [
    {
      icon: Star,
      title: "Priority Feature Requests",
      value: "₦400,000",
      description: "Your requests get built before any other client — ensuring your system fits your exact needs faster.",
      color: "from-amber-500 to-orange-600",
      badge: "Yours Free"
    },
    {
      icon: Zap,
      title: "Early Access to New AI Features",
      value: "₦500,000",
      description: "Get our newest tools, automations, and upgrades months before they're released to the public.",
      color: "from-purple-500 to-pink-600",
      badge: "Yours Free"
    },
    {
      icon: Settings,
      title: "Exclusive AI Optimization Session",
      value: "₦200,000",
      description: "A private 1-on-1 strategy call where our AI experts fine-tune your system for maximum sales in your niche.",
      color: "from-blue-500 to-blue-600",
      badge: "Yours Free"
    }
  ]

  const totalBonusValue = "₦1,100,000+"

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
              This Month Only
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get ₦1,100,000+ in Priority Bonuses FREE
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Exclusive benefits for early adopters — get ahead of the competition
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {bonuses.map((bonus, index) => (
            <Card key={index} className="border-0 shadow-lg bg-white group hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${bonus.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <bonus.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                    {bonus.badge}
                  </Badge>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {bonus.value}
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {bonus.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-sm sm:text-base text-gray-600">
                  {bonus.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Bonus Value */}
        <div className="text-center mb-8 sm:mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gift className="w-8 h-8 text-white" />
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Total Bonus Value: {totalBonusValue} — FREE
                </h3>
              </div>
              <p className="text-lg sm:text-xl text-amber-100">
                Only available for the first 3 sellers who apply this month.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scarcity Message */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold mb-4 sm:mb-6">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Only 3 Deployment Slots Available This Month</span>
          </div>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Only 3 Deployment Slots are available this month to ensure top-quality setup for each client. Once filled, onboarding closes until next month.
          </p>
        </div>
      </div>
    </section>
  )
}