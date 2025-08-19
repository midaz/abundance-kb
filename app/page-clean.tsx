"use client"

import { Search, Filter, FileText, Headphones, BookOpen, Users, MapPin, Building, X, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import { useAbundanceData } from "@/hooks/useAbundanceData"

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

export default function PolicyCMS() {
  const {
    // State
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    displayedItems,
    isLoading,
    hasMore,
    selectedItem,
    isModalOpen,
    
    // Computed values
    filteredContent,
    
    // Filter state
    excludedTypes,
    excludedRegions,
    excludedPolicyTypes,
    excludedPolicyAreas,
    excludedYears,
    
    // Actions
    handleFilterChange,
    handleSelectAll,
    handleSelectNone,
    clearAllFilters,
    openModal,
    closeModal,
    loadMoreItems,
    
    // Configuration
    filterConfig,
    
    // Label mappings
    typeLabels,
    regionLabels,
    policyTypeLabels,
    policyAreaLabels,
    policyAreaColors,
  } = useAbundanceData({ config: { showFilters: true, compactMode: false } })

  // Filter Section Component
  const FilterSection = ({ filterType, sortYears = false }: { filterType: keyof typeof filterConfig, sortYears?: boolean }) => {
    const config = filterConfig[filterType]
    const IconComponent = typeIcons[config.icon as keyof typeof typeIcons] || Filter
    
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
            <div key={`${filterType}-option-${value}`} className="flex items-center space-x-2">
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
                      key={`excluded-type-${type}`}
                      variant="secondary"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      {typeLabels[type as keyof typeof typeLabels]}
                    </Badge>
                  ))}
                  {excludedRegions.map((region) => (
                    <Badge
                      key={`excluded-region-${region}`}
                      variant="secondary"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      {regionLabels[region as keyof typeof regionLabels]}
                    </Badge>
                  ))}
                  {excludedPolicyTypes.map((policy) => (
                    <Badge
                      key={`excluded-policy-${policy}`}
                      variant="secondary"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      {policyTypeLabels[policy as keyof typeof policyTypeLabels]}
                    </Badge>
                  ))}
                  {excludedPolicyAreas.map((area) => (
                    <Badge
                      key={`excluded-area-${area}`}
                      variant="secondary"
                      className="bg-red-100 text-red-800 border-red-300"
                    >
                      {policyAreaLabels[area as keyof typeof policyAreaLabels]}
                    </Badge>
                  ))}
                  {excludedYears.map((year) => (
                    <Badge
                      key={`excluded-year-${year}`}
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
                              {item.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={`${item.id}-tag-${index}`} variant="outline" className="text-xs">
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

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

            <div className="p-6">
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

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{selectedItem.title}</h1>
                <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
              </div>

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

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge key={`modal-${selectedItem.id}-tag-${index}`} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

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
