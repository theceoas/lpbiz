import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Image, BarChart3, Headphones } from "lucide-react"

export function FeaturesSection() {
  const assistantMappings = [
    {
      assistant: "AI Customer Support Assistant",
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      whatItDoes: "Customer asks: &apos;Where is my order #1234?&apos;",
      response: "AI checks system and replies: &apos;Your order shipped yesterday! It&apos;s out for delivery today by 5 PM. Track it here: [tracking link]. Need anything else?&apos;",
      benefit: "24/7 support without hiring staff"
    },
    {
      assistant: "AI Image Assistant",
      icon: <Image className="w-6 h-6 text-purple-600" />,
      whatItDoes: "You upload: 1 product photo",
      response: "AI creates: 5 Instagram posts, website banners, and social ads — all branded and ready to post",
      benefit: "Professional marketing materials in minutes"
    },
    {
      assistant: "Business Dashboard",
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      whatItDoes: "You check your phone",
      response: "See: Today&apos;s sales, pending orders, customer messages, and which products are trending",
      benefit: "Run your business from anywhere"
    }
  ]

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 mb-6">
            HOW IT WORKS
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            See Your AI Team in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real examples of how each AI assistant handles your business tasks — so you don&apos;t have to.
          </p>
        </div>

        <div className="space-y-8">
          {assistantMappings.map((mapping, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-3 gap-6 p-8">
                  {/* Assistant */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      {mapping.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{mapping.assistant}</h3>
                      <p className="text-sm text-gray-500">Your AI employee</p>
                    </div>
                  </div>

                  {/* What happens */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Scenario */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">What happens:</p>
                      <p className="text-gray-900 font-medium">{mapping.whatItDoes}</p>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* AI Response */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 mb-2">AI automatically:</p>
                      <p className="text-blue-900 font-medium">{mapping.response}</p>
                    </div>

                    {/* Benefit */}
                    <div className="text-center pt-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {mapping.benefit}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-amber-800 font-medium mb-2">Need Sales Automation?</p>
            <p className="text-amber-700">We can build AI assistants that handle sales conversations, product recommendations, and direct-to-chat purchasing — available upon request during onboarding.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-2xl font-semibold text-gray-700">
            All of this happens automatically — while you sleep, vacation, or focus on growing your business.
          </p>
        </div>
      </div>
    </section>
  )
} 