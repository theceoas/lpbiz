import { Camera, ShoppingCart, Headphones } from "lucide-react"

export function ThreePillarsSection() {
  const aiTeam = [
    {
      icon: Camera,
      title: "The Content Creator",
      function: "Produces ready-to-post content and product shots on autopilot.",
      bullets: [
        "Turn raw photos into pro-grade images & ads",
        "Consistent posting system (templates + captions)",
        "Saves hours and designer costs"
      ]
    },
    {
      icon: ShoppingCart,
      title: "The Sales Manager",
      function: "Handles checkout, orders, and payments 24/7 — web + chat.",
      bullets: [
        "Smart shopping website or AI checkout via WhatsApp/IG",
        "Instant payment confirmation & order tracking",
        "Zero missed orders, smoother conversions"
      ]
    },
    {
      icon: Headphones,
      title: "The Support Team",
      function: "Replies instantly, answers FAQs, and keeps customers updated.",
      bullets: [
        "24/7 customer replies without you",
        "Returns, delivery, and status updates handled",
        "Frees you to focus on growth"
      ]
    }
  ]

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Your AI Team
          </h2>
        </div>

        {/* Three Equal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {aiTeam.map((role, index) => {
            const IconComponent = role.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{role.function}</p>
                </div>
                
                <ul className="space-y-3">
                  {role.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Caption */}
        <div className="text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Together, these roles replace multiple hires — without salaries or management.
          </p>
        </div>
      </div>
    </section>
  )
}