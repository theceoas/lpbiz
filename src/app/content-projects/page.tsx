"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Image, Play, Eye, ArrowRight, Sparkles, Search, Filter, X } from "lucide-react"
import { getContentProjects } from "@/lib/content-projects"
import { ContentProject } from "@/lib/supabase"
import { MediaDisplay } from "@/components/ui/media-display"
import Link from "next/link"

export default function ContentProjectsPage() {
  const [projects, setProjects] = useState<ContentProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ContentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getContentProjects()
        setProjects(data)
        setFilteredProjects(data)
      } catch (error) {
        console.error('Error fetching content projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategory])

  const handleProjectClick = (project: ContentProject) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  const categories = ["all", ...Array.from(new Set(projects.map(p => p.category)))]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Projects</h1>
              <p className="text-gray-600 mt-1">Explore all AI-generated content transformations</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === "all" ? "All Categories" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
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
                    
                    {/* Arrow Indicator */}
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
      </div>

      {/* Modal for Selected Project */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                  <Badge variant="outline" className="mt-2">
                    {selectedProject.category}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedProject.description}</p>
              
              {/* Large Before/After Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Before</h3>
                  <div className="aspect-[9/16] bg-gray-100 relative overflow-hidden rounded-lg">
                    {selectedProject.before_image_url ? (
                      <img 
                        src={selectedProject.before_image_url} 
                        alt="Before image"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="text-center">
                          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <span className="text-sm text-gray-500 font-medium">ORIGINAL CONTENT</span>
                        </div>
                      </div>
                    )}
                    {selectedProject.is_video && (
                      <div className="absolute top-4 left-4">
                        <Play className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">After</h3>
                  <MediaDisplay
                    media={selectedProject.after_media || []}
                    fallbackUrl={selectedProject.after_image_url}
                    className="aspect-[9/16] bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg"
                    showControls={true}
                    autoPlay={false}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}