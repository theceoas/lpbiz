"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Shield, CreditCard, Banknote, Zap } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const features = [
    "Complete AI setup & customization",
    "24/7 customer service automation",
    "Smart order tracking system",
    "AI image enhancement & posting",
    "Automated marketing campaigns",
    "10-day deployment guarantee",
    "30-day money-back guarantee",
    "Priority support for 3 months"
  ]

  const paymentOptions = [
    {
      icon: CreditCard,
      title: "Full Payment",
      amount: "₦1,900,000",
      description: "One-time payment",
      popular: false
    },
    {
      icon: Banknote,
      title: "Split Payment",
      amount: "₦950,000",
      description: "50% now, 50% after launch",
      popular: true
    }
  ]

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pricing & Payment Options
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the payment plan that works best for your business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Pricing Card */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                Complete AI System
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Everything you need to automate your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <div className="space-y-6">
            {paymentOptions.map((option, index) => (
              <Card key={index} className={`border-2 ${option.popular ? 'border-blue-500 bg-blue-50' : 'border-slate-200'} shadow-lg`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${option.popular ? 'bg-blue-500' : 'bg-slate-500'} rounded-full flex items-center justify-center`}>
                        <option.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          {option.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                    {option.popular && (
                      <Badge className="bg-blue-500 text-white">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {option.amount}
                    </div>
                    <Link href="/book-call">
                      <Button 
                        size="lg" 
                        className={`w-full ${option.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-700 hover:bg-slate-800'} text-white`}
                      >
                        Choose {option.title}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-green-50">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-800">
                  30-Day Money-Back Guarantee
                </h3>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                If you&apos;re not completely satisfied with your AI system within 30 days, we&apos;ll give you a full refund. No questions asked.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}