import { CheckCircle, CreditCard } from "lucide-react"

export function StandoutSection() {
  return (
    <section className="py-12 sm:py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why This Stands Out
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8">
            Done-for-you setup with one simple payment — no ongoing fees.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-slate-200">
          <div className="space-y-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We build the entire system for you once.
              </p>
            </div>
            
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                No monthly subscription to keep it running.
              </p>
            </div>
            
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                No surprise charges for our work.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-2">
                    You only pay for small, affordable credits when the system is actively used — 
                    just like topping up airtime on your phone.
                  </p>
                  <p className="text-blue-700 font-semibold text-base sm:text-lg">
                    This means you get enterprise-level automation for a fraction of the cost of hiring staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}