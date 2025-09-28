"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

export function ComparisonTable() {
  const features = [
    {
      feature: "Replies to customers 24/7",
      hiring: { available: true, note: "but costly" },
      yourself: { available: false, note: undefined },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Handles orders & tracking",
      hiring: { available: true, note: undefined },
      yourself: { available: false, note: "manual, slow" },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Creates email marketing campaigns",
      hiring: { available: false, note: undefined },
      yourself: { available: false, note: "needs tools/skills" },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Enhances product photos",
      hiring: { available: false, note: undefined },
      yourself: { available: false, note: "requires a designer" },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Auto-posts to WhatsApp/Instagram",
      hiring: { available: false, note: undefined },
      yourself: { available: false, note: undefined },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Sends promotions & discounts",
      hiring: { available: true, note: "requires marketing team" },
      yourself: { available: false, note: undefined },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Collects customer reviews",
      hiring: { available: false, note: undefined },
      yourself: { available: false, note: undefined },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Escalates refund issues smartly",
      hiring: { available: true, note: undefined },
      yourself: { available: false, note: undefined },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Can launch in 1 week",
      hiring: { available: false, note: undefined },
      yourself: { available: false, note: "takes time" },
      aiSystem: { available: true, note: undefined }
    },
    {
      feature: "Affordable and scalable",
      hiring: { available: false, note: undefined },
      yourself: { available: true, note: "but limited" },
      aiSystem: { available: true, note: undefined }
    }
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Our AI System Wins
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Compare what you get with different approaches — our AI system handles everything while staying affordable and scalable.
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle className="text-center text-xl sm:text-2xl font-bold text-gray-900">
                Feature Comparison
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-4 sm:p-6 font-semibold text-gray-900">Feature</th>
                      <th className="text-center p-4 sm:p-6 font-semibold text-gray-900">Hiring a Team</th>
                      <th className="text-center p-4 sm:p-6 font-semibold text-gray-900">Doing It Yourself</th>
                      <th className="text-center p-4 sm:p-6 font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-emerald-50">Our AI System</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 sm:p-6 font-medium text-gray-900">
                          {row.feature}
                        </td>
                        <td className="p-4 sm:p-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {row.hiring.available ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            {row.hiring.note && (
                              <span className="text-xs text-gray-500">({row.hiring.note})</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {row.yourself.available ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                            {row.yourself.note && (
                              <span className="text-xs text-gray-500">({row.yourself.note})</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 sm:p-6 text-center bg-gradient-to-r from-blue-50 to-emerald-50">
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            {row.aiSystem.note && (
                              <span className="text-xs text-gray-500">({row.aiSystem.note})</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {features.map((row, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900">
                  {row.feature}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {row.hiring.available ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-1">Hiring a Team</p>
                    {row.hiring.note && (
                      <p className="text-xs text-gray-500">({row.hiring.note})</p>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {row.yourself.available ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-1">Doing It Yourself</p>
                    {row.yourself.note && (
                      <p className="text-xs text-gray-500">({row.yourself.note})</p>
                    )}
                  </div>
                  <div className="text-center bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-2">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-1">Our AI System</p>
                    {row.aiSystem.note && (
                      <p className="text-xs text-gray-500">({row.aiSystem.note})</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}