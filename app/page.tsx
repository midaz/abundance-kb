"use client"

import { useState, useMemo, useEffect, useCallback, useRef } from "react"
import { Search, Filter, FileText, Headphones, BookOpen, Users, MapPin, Building, X, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import { policyResources } from "@/lib/policy-data"

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
  // Inverted logic: these store EXCLUDED items, not included ones
  const [excludedTypes, setExcludedTypes] = useState<string[]>([])
  const [excludedRegions, setExcludedRegions] = useState<string[]>([])
  const [excludedPolicyTypes, setExcludedPolicyTypes] = useState<string[]>([])
  const [excludedPolicyAreas, setExcludedPolicyAreas] = useState<string[]>([])
  const [excludedYears, setExcludedYears] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("date")

  const [displayedItems, setDisplayedItems] = useState<typeof policyResources>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [selectedItem, setSelectedItem] = useState<(typeof policyResources)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const watcherRef = useRef<HTMLDivElement | null>(null);

  const filteredContent = useMemo(() => {
    const filtered = policyResources.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())

      // Inverted logic: item is shown unless it's excluded
      const matchesType = !excludedTypes.includes(item.type)
      const matchesRegion = !excludedRegions.includes(item.region)
      const matchesPolicyType = !excludedPolicyTypes.includes(item.policyType)
      const matchesPolicyArea = !excludedPolicyAreas.some(excludedArea => item.policyAreas.includes(excludedArea))
      const matchesYear = !excludedYears.includes(item.date.split('-')[0])

      return matchesSearch && matchesType && matchesRegion && matchesPolicyType && matchesPolicyArea && matchesYear
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
  }, [searchQuery, excludedTypes, excludedRegions, excludedPolicyTypes, excludedPolicyAreas, excludedYears, sortBy])

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
    // Calculate how many items to show to maintain current viewport
    if (typeof window === 'undefined') {
      // Server-side rendering: just show initial page
      setDisplayedItems(filteredContent.slice(0, itemsPerPage))
      setCurrentPage(2)
      setHasMore(filteredContent.length > itemsPerPage)
      return
    }

    const currentScrollY = window.scrollY
    const estimatedItemHeight = 450 // Approximate card height including margins
    const itemsAboveViewport = Math.floor(currentScrollY / estimatedItemHeight)
    const viewportHeight = window.innerHeight
    const itemsInViewport = Math.ceil(viewportHeight / estimatedItemHeight) + 2 // +2 for buffer

    // Show enough items to maintain scroll position, but at least the minimum page size
    const minimumItems = Math.max(itemsPerPage, itemsAboveViewport + itemsInViewport)
    const itemsToShow = Math.min(minimumItems, filteredContent.length)

    setDisplayedItems(filteredContent.slice(0, itemsToShow))
    setCurrentPage(Math.ceil(itemsToShow / itemsPerPage) + 1)
    setHasMore(filteredContent.length > itemsToShow)
  }, [filteredContent])

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    const setters = {
      type: setExcludedTypes,
      region: setExcludedRegions,
      policyType: setExcludedPolicyTypes,
      policyArea: setExcludedPolicyAreas,
      year: setExcludedYears,
    }

    const setter = setters[filterType as keyof typeof setters]
    if (setter) {
      // Inverted logic: checked means included (not excluded), unchecked means excluded
      setter((prev) => (checked ? prev.filter((item) => item !== value) : [...prev, value]))
    }
  }

  const filterConfig = {
    type: {
      setter: setExcludedTypes,
      excluded: excludedTypes,
      options: Object.keys(typeLabels),
      labels: typeLabels,
      icon: FileText,
      title: "Content Type"
    },
    region: {
      setter: setExcludedRegions,
      excluded: excludedRegions,
      options: Object.keys(regionLabels),
      labels: regionLabels,
      icon: MapPin,
      title: "Region"
    },
    policyType: {
      setter: setExcludedPolicyTypes,
      excluded: excludedPolicyTypes,
      options: Object.keys(policyTypeLabels),
      labels: policyTypeLabels,
      icon: Users,
      title: "Policy Type"
    },
    policyArea: {
      setter: setExcludedPolicyAreas,
      excluded: excludedPolicyAreas,
      options: Object.keys(policyAreaLabels),
      labels: policyAreaLabels,
      icon: Building,
      title: "Policy Area"
    },
    year: {
      setter: setExcludedYears,
      excluded: excludedYears,
      options: Array.from(new Set(policyResources.map(item => item.date.split('-')[0]))),
      labels: {},
      icon: Calendar,
      title: "Year"
    }
  }

  const handleSelectAll = (filterType: string) => {
    const config = filterConfig[filterType as keyof typeof filterConfig]
    if (config) {
      config.setter([]) // Clear excluded list (show all)
    }
  }

  const handleSelectNone = (filterType: string) => {
    const config = filterConfig[filterType as keyof typeof filterConfig]
    if (config) {
      config.setter(config.options) // Add all to excluded list (hide all)
    }
  }

  const clearAllFilters = () => {
    setExcludedTypes([])
    setExcludedRegions([])
    setExcludedPolicyTypes([])
    setExcludedPolicyAreas([])
    setExcludedYears([])
    setSearchQuery("")
  }

  // Reusable FilterSection component
  const FilterSection = ({ filterType, sortYears = false }: { filterType: keyof typeof filterConfig, sortYears?: boolean }) => {
    const config = filterConfig[filterType]
    const IconComponent = config.icon

    let optionsToRender = config.options
    if (sortYears && filterType === 'year') {
      optionsToRender = [...config.options].sort((a, b) => parseInt(b) - parseInt(a))
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <IconComponent className="w-4 h-4" />
            {config.title}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => handleSelectAll(filterType)}
              className="text-accent-purple hover:text-accent-purple/80 hover:underline"
            >
              All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => handleSelectNone(filterType)}
              className="text-accent-purple hover:text-accent-purple/80 hover:underline"
            >
              None
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {optionsToRender.map((value) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`${filterType}-${value}`}
                checked={!config.excluded.includes(value)}
                onCheckedChange={(checked) => handleFilterChange(filterType, value, checked as boolean)}
              />
              <label htmlFor={`${filterType}-${value}`} className="text-sm font-medium">
                {config.labels[value as keyof typeof config.labels] || value}
              </label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const openModal = (item: (typeof policyResources)[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
    /* MINDK: Notify parent of modal open */
    window.parent.postMessage({ type: "modal-open" }, "*")
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
    document.body.style.overflow = "unset"
    /* MINDK: Notify parent of modal close */
    window.parent.postMessage({ type: "modal-close" }, "*")
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



  /* MINDK: Watcher to trigger loading more items when it comes into view */
  useEffect(() => {
    if (!watcherRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(watcherRef.current);
    return () => {
      if (watcherRef.current) observer.unobserve(watcherRef.current);
    };
  }, [loadMoreItems]);

  /* MINDK: Iframe resize notifier to parent */
  useEffect(() => {
    const notifyParent = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "resize-iframe", height }, "*");
    };

    notifyParent();

    const observer = new MutationObserver(() => notifyParent());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("resize", notifyParent);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", notifyParent);
    };
  }, []);

  /* MINDK: Removed custom scroll-based centering logic since the modal is now
     centered using the fixed flex container. */

  return (
    <div className="abundance-kb-app min-h-screen bg-policy-light w-full overflow-x-hidden">
      {/*<Header />*/}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-80 space-y-6 order-2 lg:order-1">
            <Card className={`hidden lg:block bg-card/95 backdrop-blur-sm`}>
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
                  Select All
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 lg:mt-3">
                <FilterSection filterType="policyType" />
                <Separator />
                <FilterSection filterType="policyArea" />
                <Separator />
                <FilterSection filterType="region" />
                <Separator />
                <FilterSection filterType="type" />
                <Separator />
                <FilterSection filterType="year" sortYears={true} />
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 order-1 lg:order-2">
            {/* Search and Sort */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search resources (title, description, tags, author)..."
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

              {/* Mobile/Tablet Filters Toggle (visible below lg) */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="w-full bg-card/95 backdrop-blur-sm"
                >
                  <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </div>

              {/* Mobile/Tablet Filters Content (renders below toggle, above results) */}
              {showFilters && (
                <Card className="lg:hidden bg-card/95 backdrop-blur-sm">
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
                      Select All
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FilterSection filterType="policyType" />
                    <Separator />
                    <FilterSection filterType="policyArea" />
                    <Separator />
                    <FilterSection filterType="region" />
                    <Separator />
                    <FilterSection filterType="type" />
                    <Separator />
                    <FilterSection filterType="year" sortYears={true} />
                  </CardContent>
                </Card>
              )}

              {/* Active Filters (showing excluded items) */}
              {(excludedTypes.length > 0 ||
                excludedRegions.length > 0 ||
                excludedPolicyTypes.length > 0 ||
                excludedPolicyAreas.length > 0 ||
                excludedYears.length > 0) && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground self-center">Hidden:</span>
                    {excludedTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {typeLabels[type as keyof typeof typeLabels]}
                      </Badge>
                    ))}
                    {excludedRegions.map((region) => (
                      <Badge
                        key={region}
                        variant="secondary"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {regionLabels[region as keyof typeof regionLabels]}
                      </Badge>
                    ))}
                    {excludedPolicyTypes.map((policy) => (
                      <Badge
                        key={policy}
                        variant="secondary"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {policyTypeLabels[policy as keyof typeof policyTypeLabels]}
                      </Badge>
                    ))}
                    {excludedPolicyAreas.map((area) => (
                      <Badge
                        key={area}
                        variant="secondary"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {policyAreaLabels[area as keyof typeof policyAreaLabels]}
                      </Badge>
                    ))}
                    {excludedYears.map((year) => (
                      <Badge
                        key={year}
                        variant="secondary"
                        className="bg-red-100 text-red-800 border-red-300"
                      >
                        {year}
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                  {displayedItems.map((item) => {
                    const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
                    return (
                      <Card
                        key={item.id}
                        className="group hover:shadow-lg transition-all duration-300 bg-card/95 backdrop-blur-sm hover:bg-card cursor-pointer h-fit"
                        onClick={() => openModal(item)}
                      >
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div
                              className="w-full h-full group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
                              style={{ background: item.gradient }}
                            >
                              <div className="text-white text-center px-4">
                                <IconComponent className="w-8 h-8 mx-auto mb-2 opacity-80" />
                                <div className="text-sm font-medium opacity-90">
                                  {typeLabels[item.type as keyof typeof typeLabels]}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-accent-purple text-white">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-4">
                          <CardTitle className="group-hover:text-accent-purple transition-colors leading-tight text-base font-semibold min-h-fit break-words">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-3 text-sm leading-relaxed mt-2">
                            {item.description}
                          </CardDescription>
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
                              <span className="leading-5">{item.date.split('-')[0]}</span>
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

                {/* Sentinel for IntersectionObserver */}
                <div ref={watcherRef}></div>

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
                    Select All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-lg shadow-xl w-full max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[80vh] overflow-y-auto transition-all ease-in-out duration-300"
          >
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
                {selectedItem.image ? (
                  <div
                    className="w-full h-full cursor-pointer group relative"
                    onClick={() => selectedItem.url && window.open(selectedItem.url, '_blank')}
                    title={selectedItem.url ? "Click to open original source" : "No source available"}
                  >
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/placeholder.svg";
                      }}
                    />
                    {selectedItem.url && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <ExternalLink className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center cursor-pointer group relative"
                    style={{ background: selectedItem.gradient }}
                    onClick={() => selectedItem.url && window.open(selectedItem.url, '_blank')}
                    title={selectedItem.url ? "Click to open original source" : "No source available"}
                  >
                    <div className="text-white text-center">
                      {(() => {
                        const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                        return <IconComponent className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      })()}
                      <div className="text-xl font-medium opacity-90">
                        {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                      </div>
                    </div>
                    {selectedItem.url && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-3">
                          <ExternalLink className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                      <span className="text-gray-900">{selectedItem.date.split('-')[0]}</span>
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

              {/* Additional Information */}
              {(selectedItem.accessibilityScore || selectedItem.abundanceAlignment || selectedItem.strengths) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Information</h3>
                  <div className="space-y-2 text-sm">
                    {selectedItem.accessibilityScore && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accessibility Score:</span>
                        <span className="text-gray-900 capitalize">{selectedItem.accessibilityScore}</span>
                      </div>
                    )}
                    {selectedItem.abundanceAlignment && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Abundance Alignment:</span>
                        <span className="text-gray-900">{selectedItem.abundanceAlignment}</span>
                      </div>
                    )}
                    {selectedItem.strengths && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Strengths:</span>
                        <span className="text-gray-900">{selectedItem.strengths}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t">
                {selectedItem.url ? (
                  <Button
                    className="w-full bg-accent-purple hover:bg-accent-purple/90 text-white"
                    onClick={() => window.open(selectedItem.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Original Source
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-gray-400 cursor-not-allowed text-white"
                    disabled
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    No Source Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
