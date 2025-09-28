"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, BarChart3, ImageIcon, Mail, Package, HeadphonesIcon, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"

export function ValueStack() {
  const valueItems = [
    {
      icon: MessageSquare,
      title: "24/7 Customer Replies",
      value: "₦1,000,000",
      description: "Instantly respond to every DM on WhatsApp, Instagram, and Facebook in your brand tone — no delays, no missed sales.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "Smart Order Tracking",
      value: "₦800,000",
      description: "All orders tracked from payment to delivery in one place — no messy spreadsheets or forgotten customers.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: ImageIcon,
      title: "AI Image Enhancement",
      value: "₦750,000",
      description: "Transform raw product photos into professional, brand-consistent visuals with perfect lighting and styling.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Mail,
      title: "Automated Marketing Campaigns",
      value: "₦1,000,000",
      description: "Send promos, follow-ups, and review requests automatically to drive repeat sales without lifting a finger.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Package,
      title: "Daily Social Posting",
      value: "₦600,000",
      description: "Stay visible and relevant every day — without spending hours scheduling content.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Package,
      title: "Full Order Management",
      value: "₦500,000",
      description: "From payment confirmation to delivery follow-up — fully handled.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: HeadphonesIcon,
      title: "Priority Support for 3 Months",
      value: "₦200,000",
      description: "Get your tweaks and updates handled before any other client.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Zap,
      title: "10-Day Deployment Guarantee",
      value: "₦200,000",
      description: "Fully live within 10 days or we work for free until it's done.",
      color: "from-amber-500 to-amber-600"
    }
  ]

  const totalValue = "₦5,050,000+"

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Here&apos;s What You Get When You Onboard BizPilot™
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Present each as a premium, standalone asset with perceived value clearly stated
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {valueItems.map((item, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-500">Value</div>
                  </div>
                </div>
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Value */}
        <div className="text-center mb-8 sm:mb-12">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl sm:text-3xl font-bold">
                  Total Value: {totalValue}
                </h3>
              </div>
              <p className="text-lg sm:text-xl text-slate-300">
                This is the total value of what you receive — not the cost of the system.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Before/After Demonstration */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              What Changes When an AI Team Runs Your Business
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From manual chaos to automated excellence — see the transformation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Before Column */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-red-600">Before</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Manual Chaos</h4>
              </div>
              
              <div className="space-y-4">
                <Card className="border-l-4 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Content Creation:</strong> Inconsistent posting, hours spent on design, or expensive freelancers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Customer Service:</strong> Manual replies, missed messages, delayed responses hurt sales
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Order Management:</strong> Spreadsheet chaos, manual confirmations, tracking nightmares
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Growth Bottleneck:</strong> Need to hire more staff, manage teams, increase overhead costs
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* After Column */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-green-600">After</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">AI Team Running It</h4>
              </div>
              
              <div className="space-y-4">
                <Card className="border-l-4 border-green-500 bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Content Creation:</strong> Professional content auto-created daily, brand-consistent visuals ready to post
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-green-500 bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Customer Service:</strong> 24/7 instant replies, never miss a sale, customers get immediate answers
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-green-500 bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Order Management:</strong> Smooth checkout, instant confirmations, automated tracking updates
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-green-500 bg-green-50">
                  <CardContent className="p-4">
                    <p className="text-gray-700">
                      <strong>Growth Scaling:</strong> Scale without salaries, no management overhead, pure profit growth
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Transformation Arrow (visible on larger screens) */}
          <div className="hidden lg:flex justify-center items-center mt-8">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-green-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-700">Instant Transformation</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/book-call">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Apply for Your AI Team →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}