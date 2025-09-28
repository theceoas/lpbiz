"use client"

import { MessageCircle, CreditCard, Users, TrendingDown } from "lucide-react"

export function PainAgitateSolution() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            The Daily Struggles of Selling on Social Media
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            If you sell on WhatsApp or Instagram, you&apos;ve probably faced these challenges:
          </p>
        </div>

        {/* Pain Points */}
        <div className="space-y-8">
          {/* Overwhelmed by messages */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2 sm:mb-3">Overwhelmed by messages</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Orders and questions come in at the same time from WhatsApp and Instagram. 
                  You&apos;re replying to one person here, another there… and before you know it, 
                  some customers never get a reply — which means lost sales.
                </p>
              </div>
            </div>
          </div>

          {/* Endless repetitive questions */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3">Endless repetitive questions</h3>
                <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                  <p className="text-sm sm:text-base text-gray-600 italic">&ldquo;Is this available?&rdquo;</p>
                  <p className="text-sm sm:text-base text-gray-600 italic">&ldquo;How much is this?&rdquo;</p>
                  <p className="text-sm sm:text-base text-gray-600 italic">&ldquo;Do you deliver to Lagos?&rdquo;</p>
                </div>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  You spend hours answering the same questions, even when many people never buy.
                </p>
              </div>
            </div>
          </div>

          {/* Payment headaches */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-yellow-800 mb-2 sm:mb-3">Payment headaches</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  You have to send your bank details, wait for the transfer, confirm manually, 
                  and then let the customer know their payment was received. 
                  If there&apos;s a delay, everything slows down — and customers lose trust.
                </p>
              </div>
            </div>
          </div>

          {/* Hiring staff feels too expensive */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-2 sm:mb-3">Hiring staff feels too expensive</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  You should hire help to manage orders and DMs, 
                  but even one or two extra employees add huge monthly costs. 
                  Growth feels impossible without burning more money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-8 sm:mt-12">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 sm:p-6">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">The Result?</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              These problems drain your time, limit your growth, and keep you stuck doing everything yourself.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}