import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, Clock, TrendingDown } from "lucide-react"

export function PainPointSection() {
  const painPoints = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      title: "Manual Replies",
      description: "Spending hours on WhatsApp instead of growing your business"
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Missed Follow-ups",
      description: "Losing customers because you forgot to follow up"
    },
    {
      icon: <TrendingDown className="w-8 h-8 text-red-600" />,
      title: "Chasing Sales",
      description: "Constantly hunting for orders instead of automating the process"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            You didn&apos;t start your business to run WhatsApp full-time.
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            But here you are — replying to customers manually, forgetting follow-ups, sending delivery updates, 
            and chasing sales. It&apos;s overwhelming… and holding you back from real growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center">
                    {point.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 italic">
            What if your business could run automatically — like a proper brand?
          </h3>
        </div>
      </div>
    </section>
  )
} 