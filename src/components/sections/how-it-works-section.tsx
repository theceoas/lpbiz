import { CheckCircle, Settings, Rocket } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Diagnose & Plan",
      description: "We map your products, sales flow, and content needs — then design your AI team.",
      icon: <Settings className="w-8 h-8 text-blue-600" />
    },
    {
      number: "2", 
      title: "Build & Train",
      description: "We set up your website/checkout, connect WhatsApp/IG, and train the AI on your brand.",
      icon: <CheckCircle className="w-8 h-8 text-green-600" />
    },
    {
      number: "3",
      title: "Go Live & Optimize", 
      description: "You approve. We launch. Your AI team runs 24/7 — with performance tweaks in week 2.",
      icon: <Rocket className="w-8 h-8 text-purple-600" />
    }
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Launch in 10 Days — Here's the Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                    {step.icon}
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Step {step.number} — {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on mobile, shown on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-blue-300"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Zero tech stress — we do it for you.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}