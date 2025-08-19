import { useState, useMemo, useEffect, useCallback } from "react"
import { FileText, Headphones, BookOpen, Users, MapPin, Building, Calendar } from "lucide-react"
import { policyResources } from "@/lib/policy-data"

interface WidgetConfig {
  theme?: 'light' | 'dark'
  maxHeight?: string
  showFilters?: boolean
  compactMode?: boolean
}

export interface UseAbundanceDataProps {
  config?: WidgetConfig
}

export const useAbundanceData = ({ config = {} }: UseAbundanceDataProps = {}) => {
  const {
    showFilters = true,
    compactMode = false
  } = config

  // State management
  const [searchQuery, setSearchQuery] = useState("")
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
  const itemsPerPage = compactMode ? 4 : 6

  const [selectedItem, setSelectedItem] = useState<(typeof policyResources)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtered content computation
  const filteredContent = useMemo(() => {
    const filtered = policyResources.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

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

  // Load more items functionality
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    setTimeout(() => {
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const newItems = filteredContent.slice(startIndex, endIndex)

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setDisplayedItems((prev) => [...prev, ...newItems])
        setCurrentPage((prev) => prev + 1)

        if (endIndex >= filteredContent.length) {
          setHasMore(false)
        }
      }

      setIsLoading(false)
    }, 500)
  }, [currentPage, filteredContent, isLoading, hasMore, itemsPerPage])

  // Smart scroll and pagination handling
  useEffect(() => {
    const currentScrollY = window.scrollY
    const estimatedItemHeight = compactMode ? 350 : 450
    const itemsAboveViewport = Math.floor(currentScrollY / estimatedItemHeight)
    const viewportHeight = window.innerHeight
    const itemsInViewport = Math.ceil(viewportHeight / estimatedItemHeight) + 2
    
    const minimumItems = Math.max(itemsPerPage, itemsAboveViewport + itemsInViewport)
    const itemsToShow = Math.min(minimumItems, filteredContent.length)
    
    setDisplayedItems(filteredContent.slice(0, itemsToShow))
    setCurrentPage(Math.ceil(itemsToShow / itemsPerPage) + 1)
    setHasMore(filteredContent.length > itemsToShow)
  }, [filteredContent, itemsPerPage, compactMode])

  // Infinite scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.abundance-widget-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const containerBottom = containerRect.bottom
      const viewportHeight = window.innerHeight

      if (containerBottom - viewportHeight < 1000) {
        loadMoreItems()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreItems])

  // Filter management
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
      setter((prev) => (checked ? prev.filter((item) => item !== value) : [...prev, value]))
    }
  }

  // Filter configuration
  const filterConfig = {
    type: {
      setter: setExcludedTypes,
      excluded: excludedTypes,
      options: Object.keys({
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
      }),
      labels: {
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
      },
      icon: "FileText",
      title: "Content Type"
    },
    region: {
      setter: setExcludedRegions,
      excluded: excludedRegions,
      options: Object.keys({
        national: "National",
        west: "West",
        midwest: "Midwest",
        northeast: "Northeast",
        south: "South",
      }),
      labels: {
        national: "National",
        west: "West",
        midwest: "Midwest",
        northeast: "Northeast",
        south: "South",
      },
      icon: "MapPin",
      title: "Region"
    },
    policyType: {
      setter: setExcludedPolicyTypes,
      excluded: excludedPolicyTypes,
      options: Object.keys({
        housing: "Housing",
      }),
      labels: {
        housing: "Housing",
      },
      icon: "Users",
      title: "Policy Type"
    },
    policyArea: {
      setter: setExcludedPolicyAreas,
      excluded: excludedPolicyAreas,
      options: Object.keys({
        landuse: "Land Use",
        financing: "Financing Projects",
        rental: "Rental / Tenant Protections",
        cost: "Cost of Building",
        climate: "Climate Resiliency",
        homelessness: "Homelessness Prevention",
        homeownership: "Homeownership",
      }),
      labels: {
        landuse: "Land Use",
        financing: "Financing Projects",
        rental: "Rental / Tenant Protections",
        cost: "Cost of Building",
        climate: "Climate Resiliency",
        homelessness: "Homelessness Prevention",
        homeownership: "Homeownership",
      },
      icon: "Building",
      title: "Policy Area"
    },
    year: {
      setter: setExcludedYears,
      excluded: excludedYears,
      options: Array.from(new Set(policyResources.map(item => item.date.split('-')[0]))),
      labels: {},
      icon: "Calendar",
      title: "Year"
    }
  }

  const handleSelectAll = (filterType: string) => {
    const config = filterConfig[filterType as keyof typeof filterConfig]
    if (config) {
      config.setter([])
    }
  }

  const handleSelectNone = (filterType: string) => {
    const config = filterConfig[filterType as keyof typeof filterConfig]
    if (config) {
      config.setter(config.options)
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

  // Modal management
  const openModal = (item: (typeof policyResources)[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isModalOpen])

  // Icon mappings for UI components
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

  // Label mappings for UI components
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

  return {
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
    config: {
      showFilters,
      compactMode,
      ...config
    },
    
    // Label mappings
    typeIcons,
    typeLabels,
    regionLabels,
    policyTypeLabels,
    policyAreaLabels,
    policyAreaColors,
  }
}
