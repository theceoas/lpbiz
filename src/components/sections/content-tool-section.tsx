"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Image, Play, Eye, ArrowRight, Sparkles } from "lucide-react"
import { getFeaturedContentProjects } from "@/lib/content-projects"
import { ContentProject } from "@/lib/supabase"
import { MediaDisplay } from "@/components/ui/media-display"
import Link from "next/link"

export function ContentToolSection() {
  const [projects, setProjects] = useState<ContentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const featuredProjects = await getFeaturedContentProjects(3)
        setProjects(featuredProjects)
      } catch (error) {
        console.error('Error loading content projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleProjectClick = (project: ContentProject) => {
    setSelectedProject(project)
  }

  return (
    <section id="content-tool" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-3 py-1">
              Content Creation Tool
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            See Your Content Transform
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4 max-w-3xl mx-auto">
            Watch how our AI Content Creator transforms your raw images and videos into professional marketing materials — automatically.
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-[9/16] bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {projects.map((project) => (
            <Card 
               key={project.id} 
               className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
               onClick={() => handleProjectClick(project)}
             >
               <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                   <Badge variant="outline" className="text-xs">
                     {project.category}
                   </Badge>
                   {project.is_video && (
                     <div className="flex items-center gap-1 text-xs text-purple-600">
                       <Play className="w-3 h-3" />
                       Video
                     </div>
                   )}
                 </div>
                 <CardTitle className="text-lg font-semibold text-gray-900">
                   {project.title}
                 </CardTitle>
                 <CardDescription className="text-sm text-gray-600">
                   {project.description}
                 </CardDescription>
               </CardHeader>
              
              <CardContent className="p-0">
                {/* Before/After Comparison */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-0">
                    {/* Before */}
                    <div className="relative group/before">
                      <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden">
                        {project.before_image_url ? (
                          <img 
                            src={project.before_image_url} 
                            alt="Before image"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <span className="text-xs text-gray-500 font-medium">BEFORE</span>
                            </div>
                          </div>
                        )}
                        {project.is_video && (
                          <div className="absolute top-2 left-2">
                            <Play className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <span className="text-white text-xs font-medium">Original</span>
                      </div>
                    </div>
                    
                    {/* After */}
                    <div className="relative group/after">
                      <MediaDisplay
                        media={project.after_media || []}
                        fallbackUrl={project.after_image_url}
                        className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-indigo-200"
                        showControls={false}
                        autoPlay={false}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600/80 to-transparent p-2">
                        <span className="text-white text-xs font-medium">AI Enhanced</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-200">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </div>
                
                {/* View Details Button */}
                <div className="p-4 bg-gray-50 group-hover:bg-purple-50 transition-colors duration-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Transformation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link href="/content-projects">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300"
            >
              <Eye className="w-5 h-5 mr-2" />
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}