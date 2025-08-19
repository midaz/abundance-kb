"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Search, Filter, FileText, Headphones, BookOpen, Users, MapPin, Building, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

// Mock data for content items
const mockContent = [
  {
    id: 1,
    title: "Housing Policy Framework for Urban Development",
    description: "Comprehensive analysis of housing policies and their impact on urban growth patterns.",
    type: "article",
    region: "west",
    policyType: "housing",
    policyArea: "landuse",
    date: "2024-01-15",
    author: "Dr. Sarah Chen",
    tags: ["urban planning", "affordable housing", "zoning"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Transportation Infrastructure Investment Strategies",
    description: "Research paper examining ROI of various transportation infrastructure projects.",
    type: "paper",
    region: "northeast",
    policyType: "housing",
    policyArea: "financing",
    date: "2024-01-10",
    author: "Transportation Research Institute",
    tags: ["infrastructure", "public transit", "economic impact"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Education Reform Podcast Series",
    description: "Weekly discussions with education leaders on innovative policy approaches.",
    type: "podcast",
    region: "south",
    policyType: "housing",
    policyArea: "rental",
    date: "2024-01-08",
    author: "Policy Voices Network",
    tags: ["education reform", "innovation", "leadership"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Climate Action Implementation Guide",
    description: "Practical handbook for implementing climate policies at the local level.",
    type: "book",
    region: "midwest",
    policyType: "housing",
    policyArea: "climate",
    date: "2024-01-05",
    author: "Green Policy Institute",
    tags: ["climate change", "sustainability", "local government"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Economic Development Through Innovation Hubs",
    description: "Case study analysis of successful innovation districts and their economic impact.",
    type: "article",
    region: "national",
    policyType: "housing",
    policyArea: "cost",
    date: "2024-01-03",
    author: "Economic Policy Research Center",
    tags: ["innovation", "economic development", "technology"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Healthcare Access in Rural Communities",
    description: "Research on improving healthcare delivery in underserved rural areas.",
    type: "paper",
    region: "south",
    policyType: "housing",
    policyArea: "homeownership",
    date: "2023-12-28",
    author: "Rural Health Policy Center",
    tags: ["rural health", "access", "telemedicine"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Affordable Housing Development Strategies",
    description: "Best practices for developing affordable housing in high-cost markets.",
    type: "guide",
    region: "west",
    policyType: "housing",
    policyArea: "financing",
    date: "2023-12-20",
    author: "Housing Development Alliance",
    tags: ["affordable housing", "development", "financing"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Tenant Rights Protection Framework",
    description: "Comprehensive guide to implementing tenant protection policies.",
    type: "model",
    region: "northeast",
    policyType: "housing",
    policyArea: "rental",
    date: "2023-12-15",
    author: "Tenant Advocacy Group",
    tags: ["tenant rights", "rental", "protection"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 9,
    title: "Building Code Modernization Study",
    description: "Analysis of updated building codes and their impact on construction costs.",
    type: "brief",
    region: "midwest",
    policyType: "housing",
    policyArea: "cost",
    date: "2023-12-10",
    author: "Construction Policy Institute",
    tags: ["building codes", "construction", "costs"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 10,
    title: "Climate-Resilient Housing Design",
    description: "Innovative approaches to designing housing that withstands climate challenges.",
    type: "case",
    region: "south",
    policyType: "housing",
    policyArea: "climate",
    date: "2023-12-05",
    author: "Resilient Communities Network",
    tags: ["climate resilience", "housing design", "sustainability"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 11,
    title: "Homelessness Prevention Programs",
    description: "Evaluation of successful homelessness prevention initiatives across the country.",
    type: "assessment",
    region: "national",
    policyType: "housing",
    policyArea: "homelessness",
    date: "2023-11-30",
    author: "National Housing Coalition",
    tags: ["homelessness", "prevention", "social services"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 12,
    title: "First-Time Homebuyer Support Systems",
    description: "Analysis of programs supporting first-time homebuyers in various markets.",
    type: "news",
    region: "west",
    policyType: "housing",
    policyArea: "homeownership",
    date: "2023-11-25",
    author: "Housing Finance Weekly",
    tags: ["homeownership", "first-time buyers", "financing"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 13,
    title: "Land Use Planning Interactive Tool",
    description: "Digital platform for visualizing land use planning scenarios and outcomes.",
    type: "map",
    region: "northeast",
    policyType: "housing",
    policyArea: "landuse",
    date: "2023-11-20",
    author: "Urban Planning Tech Lab",
    tags: ["land use", "planning", "visualization"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 14,
    title: "Housing Policy Training Workshop",
    description: "Professional development program for housing policy practitioners.",
    type: "training",
    region: "midwest",
    policyType: "housing",
    policyArea: "financing",
    date: "2023-11-15",
    author: "Policy Training Institute",
    tags: ["training", "professional development", "policy"],
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 15,
    title: "Community Housing Catalog",
    description: "Comprehensive database of community housing resources and programs.",
    type: "catalog",
    region: "south",
    policyType: "housing",
    policyArea: "rental",
    date: "2023-11-10",
    author: "Community Housing Network",
    tags: ["community housing", "resources", "programs"],
    image: "/placeholder.svg?height=200&width=300",
  },
]

const typeIcons = {
  simulator: FileText,
  catalog: BookOpen,
  brief: FileText,
  assessment: FileText,
  map: MapPin,
  training: Users,
  guide: BookOpen,
  case: FileText,
  news: FileText,
  model: FileText,
  article: FileText,
  paper: BookOpen,
  podcast: Headphones,
  book: BookOpen,
}

const typeLabels = {
  simulator: "Simulator",
  catalog: "Catalog or Library",
  brief: "Research Brief",
  assessment: "Assessment",
  map: "Interactive map",
  training: "Training & Consulting",
  guide: "Guide or Toolkit",
  case: "Case study",
  news: "News Article or Blog",
  model: "Model Policy",
  article: "Article",
  paper: "Academic Paper",
  podcast: "Podcast",
  book: "Book",
}

const regionLabels = {
  national: "National",
  west: "West",
  midwest: "Midwest",
  northeast: "Northeast",
  south: "South",
}

const policyTypeLabels = {
  housing: "Housing",
}

const policyAreaLabels = {
  landuse: "Land Use",
  financing: "Financing Projects",
  rental: "Rental / Tenant Protections",
  cost: "Cost of Building",
  climate: "Climate Resiliency",
  homelessness: "Homelessness Prevention",
  homeownership: "Homeownership",
}

const policyAreaColors = {
  landuse: "bg-red-200 text-red-800 border-red-300",
  financing: "bg-blue-200 text-blue-800 border-blue-300",
  rental: "bg-green-200 text-green-800 border-green-300",
  cost: "bg-purple-200 text-purple-800 border-purple-300",
  climate: "bg-orange-200 text-orange-800 border-orange-300",
  homelessness: "bg-yellow-200 text-yellow-800 border-yellow-300",
  homeownership: "bg-violet-200 text-violet-800 border-violet-300",
}

export default function PolicyCMS() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedPolicyTypes, setSelectedPolicyTypes] = useState<string[]>([])
  const [selectedPolicyAreas, setSelectedPolicyAreas] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")

  const [displayedItems, setDisplayedItems] = useState<typeof mockContent>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [selectedItem, setSelectedItem] = useState<(typeof mockContent)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredContent = useMemo(() => {
    const filtered = mockContent.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type)
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(item.region)
      const matchesPolicyType = selectedPolicyTypes.length === 0 || selectedPolicyTypes.includes(item.policyType)
      const matchesPolicyArea = selectedPolicyAreas.length === 0 || selectedPolicyAreas.includes(item.policyArea)

      return matchesSearch && matchesType && matchesRegion && matchesPolicyType && matchesPolicyArea
    })

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedTypes, selectedRegions, selectedPolicyTypes, selectedPolicyAreas, sortBy])

  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const newItems = filteredContent.slice(startIndex, endIndex)

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setDisplayedItems((prev) => [...prev, ...newItems])
        setCurrentPage((prev) => prev + 1)

        // Check if we've loaded all available items
        if (endIndex >= filteredContent.length) {
          setHasMore(false)
        }
      }

      setIsLoading(false)
    }, 500)
  }, [currentPage, filteredContent, isLoading, hasMore])

  useEffect(() => {
    setDisplayedItems(filteredContent.slice(0, itemsPerPage))
    setCurrentPage(2)
    setHasMore(filteredContent.length > itemsPerPage)
  }, [filteredContent])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 1000) {
        loadMoreItems()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreItems])

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const setters = {
      type: setSelectedTypes,
      region: setSelectedRegions,
      policyType: setSelectedPolicyTypes,
      policyArea: setSelectedPolicyAreas,
    }

    const setter = setters[filterType as keyof typeof setters]
    if (setter) {
      setter((prev) => (checked ? [...prev, value] : prev.filter((item) => item !== value)))
    }
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedRegions([])
    setSelectedPolicyTypes([])
    setSelectedPolicyAreas([])
    setSearchQuery("")
  }

  const openModal = (item: (typeof mockContent)[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    document.body.style.overflow = "unset" // Restore scrolling
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isModalOpen])

  return (
    <div className="abundance-kb-app min-h-screen bg-policy-light">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 space-y-6">
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full bg-transparent hover:bg-accent-purple hover:text-white transition-colors"
                >
                  Clear All
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Policy Type Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Policy Type
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(policyTypeLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`policy-${value}`}
                          checked={selectedPolicyTypes.includes(value)}
                          onCheckedChange={(checked) => handleFilterChange("policyType", value, checked as boolean)}
                        />
                        <label htmlFor={`policy-${value}`} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Policy Area Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Policy Area
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(policyAreaLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`policyarea-${value}`}
                          checked={selectedPolicyAreas.includes(value)}
                          onCheckedChange={(checked) => handleFilterChange("policyArea", value, checked as boolean)}
                        />
                        <label htmlFor={`policyarea-${value}`} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Region Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Region
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(regionLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${value}`}
                          checked={selectedRegions.includes(value)}
                          onCheckedChange={(checked) => handleFilterChange("region", value, checked as boolean)}
                        />
                        <label htmlFor={`region-${value}`} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Content Type Filter */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Content Type
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(typeLabels).map(([value, label]) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${value}`}
                          checked={selectedTypes.includes(value)}
                          onCheckedChange={(checked) => handleFilterChange("type", value, checked as boolean)}
                        />
                        <label htmlFor={`type-${value}`} className="text-sm font-medium">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search and Sort */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card/95 backdrop-blur-sm"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48 bg-card/95 backdrop-blur-sm">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="type">Content Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(selectedTypes.length > 0 ||
                selectedRegions.length > 0 ||
                selectedPolicyTypes.length > 0 ||
                selectedPolicyAreas.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="bg-accent-purple/20 text-accent-purple border-accent-purple/30"
                    >
                      {typeLabels[type as keyof typeof typeLabels]}
                    </Badge>
                  ))}
                  {selectedRegions.map((region) => (
                    <Badge
                      key={region}
                      variant="secondary"
                      className="bg-accent-purple/20 text-accent-purple border-accent-purple/30"
                    >
                      {regionLabels[region as keyof typeof regionLabels]}
                    </Badge>
                  ))}
                  {selectedPolicyTypes.map((policy) => (
                    <Badge
                      key={policy}
                      variant="secondary"
                      className="bg-accent-purple/20 text-accent-purple border-accent-purple/30"
                    >
                      {policyTypeLabels[policy as keyof typeof policyTypeLabels]}
                    </Badge>
                  ))}
                  {selectedPolicyAreas.map((area) => (
                    <Badge
                      key={area}
                      variant="secondary"
                      className={policyAreaColors[area as keyof typeof policyAreaColors]}
                    >
                      {policyAreaLabels[area as keyof typeof policyAreaLabels]}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Results */}
            {displayedItems.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {displayedItems.length} of {filteredContent.length} resource
                    {filteredContent.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedItems.map((item) => {
                    const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
                    return (
                      <Card
                        key={item.id}
                        className="group hover:shadow-lg transition-all duration-300 bg-card/95 backdrop-blur-sm hover:bg-card cursor-pointer"
                        onClick={() => openModal(item)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-accent-purple text-white">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-2 group-hover:text-accent-purple transition-colors leading-snug py-1">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-6">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-start justify-between text-sm text-muted-foreground leading-5">
                              <span className="leading-5">{item.author}</span>
                              <span className="leading-5">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{regionLabels[item.region as keyof typeof regionLabels]}</span>
                                <span className="text-muted-foreground/50">|</span>
                                <span>{policyTypeLabels[item.policyType as keyof typeof policyTypeLabels]}</span>
                              </div>
                              <div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${policyAreaColors[item.policyArea as keyof typeof policyAreaColors]}`}
                                >
                                  {policyAreaLabels[item.policyArea as keyof typeof policyAreaLabels]}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {isLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-purple"></div>
                    <span className="ml-2 text-muted-foreground">Loading more resources...</span>
                  </div>
                )}

                {!hasMore && displayedItems.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You&apos;ve reached the end of the results.</p>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <Card className="bg-card/95 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    We couldn&apos;t find any resources matching your current filters. Try adjusting your search criteria or
                    clearing some filters.
                  </p>
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="hover:bg-accent-purple hover:text-white transition-colors bg-transparent"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                  return (
                    <Badge className="bg-accent-purple text-white">
                      <IconComponent className="w-3 h-3 mr-1" />
                      {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                    </Badge>
                  )
                })()}
                <h2 className="text-lg font-semibold text-gray-900">Resource Details</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal} className="hover:bg-gray-100">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image */}
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title and Description */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedItem.title}</h1>
                <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Publication Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Author:</span>
                      <span className="text-gray-900">{selectedItem.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{new Date(selectedItem.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{typeLabels[selectedItem.type as keyof typeof typeLabels]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Policy Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region:</span>
                      <span className="text-gray-900">
                        {regionLabels[selectedItem.region as keyof typeof regionLabels]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Policy Type:</span>
                      <span className="text-gray-900">
                        {policyTypeLabels[selectedItem.policyType as keyof typeof policyTypeLabels]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Policy Area:</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${policyAreaColors[selectedItem.policyArea as keyof typeof policyAreaColors]}`}
                      >
                        {policyAreaLabels[selectedItem.policyArea as keyof typeof policyAreaLabels]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t">
                <Button className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Original Source
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
