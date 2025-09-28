import { MessageCircle, CreditCard, Users, TrendingUp } from "lucide-react"

export function SolutionSection() {
  return (
    <section className="py-12 sm:py-20 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Imagine if everything just <span className="text-blue-600 font-semibold">worked</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Here&apos;s what your business looks like with our AI-powered system:
          </p>
        </div>

        {/* Solution Points */}
        <div className="space-y-8">
          {/* Every message answered instantly */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-2 sm:mb-3">Every message answered instantly</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 sm:mb-3">
                  Whether it&apos;s an order or a simple question, 
                  customers get instant, accurate replies — 24/7 — without you lifting a finger.
                </p>
                <p className="text-sm sm:text-base text-emerald-700 font-medium">
                  You win because you sell more without spending your day responding to DMs, and they win because they get fast, reliable service.
                </p>
              </div>
            </div>
          </div>

          {/* Seamless payments */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2 sm:mb-3">Seamless payments</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 sm:mb-3">
                  Once a customer pays, the system automatically confirms the payment 
                  and sends them an order confirmation — no manual checks or back-and-forth.
                </p>
                <p className="text-sm sm:text-base text-blue-700 font-medium">
                  Even if they order via WhatsApp, the agent confirms it instantly on your behalf.
                </p>
              </div>
            </div>
          </div>

          {/* No need to hire extra staff */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-2 sm:mb-3">No need to hire extra staff</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2 sm:mb-3">
                  Instead of hiring people to take orders, answer questions, and post products, 
                  your AI team works 24/7 — for a one-time setup.
                </p>
                <p className="text-sm sm:text-base text-purple-700 font-medium">
                  You get the same results without paying monthly salaries.
                </p>
              </div>
            </div>
          </div>

          {/* Built to scale with you */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3">Built to scale with you</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Whether you&apos;re processing 30 orders or 300, 
                  everything runs smoothly without adding extra work or extra people.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}