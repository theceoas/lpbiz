import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function GuaranteeSection() {
  const includedFeatures = [
    "AI Content Creator, Sales Manager, and Support Team — fully configured",
    "Smart shopping website or AI chat checkout (or both)",
    "Payment & order tracking automations",
    "Brand training + templates for content",
    "10-Day Launch Guarantee",
    "Handover + quick-start training"
  ]

  return (
    <section id="guarantee" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            One-Time Setup, Lifetime System
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* What's Included */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              What's Included
            </h3>
            
            <div className="space-y-4 mb-8">
              {includedFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>

            {/* Small note about pricing */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  <strong>No monthly fees.</strong> You only top-up low usage credits as needed (like airtime).
                </p>
              </div>
            </div>
          </div>

          {/* Guarantee Box */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 shadow-lg border border-green-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4 text-sm">
                NO-STRESS GUARANTEE
              </Badge>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
              No-Stress Guarantee
            </h3>

            <p className="text-gray-700 leading-relaxed mb-6 text-center">
              If it's not delivered as promised or underperforms vs. your onboarding plan, we refund you in full. 
              <span className="font-semibold text-gray-900"> No delays, no excuses.</span>
            </p>

            <div className="text-center">
              <Link href="/book-call">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                >
                  Apply for Your AI System
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}