"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, Heart, Smartphone, Coffee } from "lucide-react"

export function WhoItsFor() {
  const businessTypes = [
    { icon: ShoppingBag, name: "Fashion brands" },
    { icon: Heart, name: "Beauty products" },
    { icon: Smartphone, name: "Phone accessories" },
    { icon: Coffee, name: "Food delivery" },
    { icon: Users, name: "Gift stores" }
  ]

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Built for Sellers Who Are Already Selling
          </h2>
          <p className="text-base sm:text-xl text-gray-600 leading-relaxed">
            If you sell 50+ products a month, our AI system removes the bottlenecks so you can scale faster without hiring a team.
          </p>
        </div>

        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
              Perfect For Nigerian Social Media Sellers
            </CardTitle>
            <CardDescription className="text-sm sm:text-lg text-gray-600">
              Fashion, beauty, accessories, and more — our AI adapts to your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 sm:gap-6">
              {businessTypes.map((type, index) => (
                <div key={index} className="flex flex-col items-center text-center p-2 sm:p-4 bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl hover:from-slate-200 hover:to-blue-200 transition-all duration-300">
                  <div className="w-8 h-8 sm:w-12 sm:h-14 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                    <type.icon className="w-4 h-4 sm:w-6 sm:h-7 text-white" />
                  </div>
                  <span className="text-xs sm:text-base font-medium text-gray-900 leading-tight">
                    {type.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}