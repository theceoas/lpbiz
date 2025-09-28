import { Rocket, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ScarcitySection() {
  return (
    <section id="slots" className="py-12 sm:py-20 bg-gradient-to-r from-red-50 to-orange-50 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">


        {/* Alternative prominent banner version */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-4 mb-8 shadow-2xl border-4 border-red-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-yellow-300 fill-current animate-pulse" />
            <h3 className="text-xl sm:text-2xl font-bold">🔥 25% OFF FOR NEXT 3 CUSTOMERS! 🔥</h3>
            <Star className="w-6 h-6 text-yellow-300 fill-current animate-pulse" />
          </div>
          <p className="text-sm sm:text-base mt-2 font-semibold text-yellow-200 relative z-10">
            ⚡ Limited time offer - Act fast! ⚡
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-xl border border-red-100">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-6 sm:mb-8">
            <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Limited Onboarding Slots Each Month
          </h2>

          <p className="text-base sm:text-xl text-gray-600 leading-relaxed mb-6">
            We only deploy a few systems monthly to guarantee quality.
            <br />
            Slots remaining this month: <span id="slots-remaining" className="font-bold text-red-600">8</span>
          </p>

          <div className="flex items-center justify-center gap-2 text-red-600 mb-6">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Limited availability — secure your spot now</span>
          </div>

          <Link href="/book-call">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Secure Your Slot Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}