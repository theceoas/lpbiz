import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Do I have to use Instagram/WhatsApp?",
      answer: "No. We can run your AI checkout on your website only, or combine web + chat."
    },
    {
      question: "What if I only need a website and content?",
      answer: "Perfect. Your AI team still includes The Content Creator and The Sales Manager. Support can be added anytime."
    },
    {
      question: "Is this a subscription?",
      answer: "No monthly fees. It's a one-time build. You'll only top-up low usage credits as you grow — like airtime."
    },
    {
      question: "How fast can we launch?",
      answer: "In 10 days. That includes setup, training, and go-live."
    },
    {
      question: "What if it doesn't work for my business?",
      answer: "You're covered by our No-Stress Guarantee — full refund if it's not delivered as outlined in onboarding."
    },
    {
      question: "What do you need from me?",
      answer: "Product info, brand basics (logo/colors), and any existing content. We do the rest."
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about BizPilot™
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white border rounded-lg shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 text-left text-lg font-semibold text-gray-900 hover:no-underline hover:bg-gray-50">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}