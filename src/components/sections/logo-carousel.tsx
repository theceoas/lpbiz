"use client"

import { useEffect, useState } from "react"

import { ShoppingBag, Heart, Smartphone, Coffee, Users, Star } from "lucide-react"

export function LogoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const logos = [
    { icon: ShoppingBag, name: "Fashion", category: "Fashion" },
    { icon: Heart, name: "Beauty", category: "Beauty" },
    { icon: Smartphone, name: "Accessories", category: "Accessories" },
    { icon: Coffee, name: "Food", category: "Food" },
    { icon: Users, name: "Gifts", category: "Gifts" },
    { icon: Star, name: "Lifestyle", category: "Lifestyle" },
    { icon: ShoppingBag, name: "Fashion", category: "Fashion" },
    { icon: Heart, name: "Beauty", category: "Beauty" },
    { icon: Smartphone, name: "Accessories", category: "Accessories" },
    { icon: Coffee, name: "Food", category: "Food" },
    { icon: Users, name: "Gifts", category: "Gifts" },
    { icon: Star, name: "Lifestyle", category: "Lifestyle" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (logos.length - 5))
    }, 3000)

    return () => clearInterval(interval)
  }, [logos.length])

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Trusted by Nigeria&apos;s Top Social Media Sellers
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex gap-8 sm:gap-12 transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 120}px)` }}
          >
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-50 transition-colors duration-300">
                  <logo.icon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 group-hover:text-blue-600 transition-colors duration-300" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors duration-300">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  )
}