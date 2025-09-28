'use client'

import { useState, useEffect } from 'react'
import { Quote, Star } from 'lucide-react'
import { getTestimonials } from '@/lib/database'
import { Testimonial } from '@/lib/supabase'

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials()
      setTestimonials(data)
    } catch (error) {
      console.error('Error loading testimonials:', error)
      // Fallback to empty array if database fails
      setTestimonials([])
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-slate-600">Check back soon for customer testimonials!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real business owners are saying about BizPilot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-blue-100" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {renderStars(testimonial.rating || 5)}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-slate-700 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-600 text-sm">
                      {testimonial.role && `${testimonial.role}, `}
                      {testimonial.company}
                    </p>
                  </div>
                  {testimonial.is_featured && (
                    <div className="ml-auto">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-6">
            Ready to join these successful business owners?
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  )
}