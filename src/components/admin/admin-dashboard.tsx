'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TestimonialManager } from '@/components/admin/testimonial-manager'
import { BeforeAfterManager } from '@/components/admin/before-after-manager'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function AdminDashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    setIsLoggingOut(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, admin@bizpilot.com
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Signing out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="testimonials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="before-after">Before & After</TabsTrigger>
          </TabsList>
          
          <TabsContent value="testimonials" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Manage Testimonials
              </h2>
              <TestimonialManager />
            </div>
          </TabsContent>
          
          <TabsContent value="before-after" className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Manage Before & After Images
              </h2>
              <BeforeAfterManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}