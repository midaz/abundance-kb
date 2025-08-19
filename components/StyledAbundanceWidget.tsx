"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import styled from 'styled-components'
import { Search, Filter, FileText, Headphones, BookOpen, Users, MapPin, Building, X, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"
import { policyResources } from "@/lib/policy-data"

// Styled Components
const WidgetContainer = styled.div`
  font-family: "TT Hoves Pro", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fff5eb;
  min-height: 100vh;
  color: #1f2937;

  * {
    box-sizing: border-box;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
`

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`

const Sidebar = styled.aside`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1024px) {
    width: 320px;
    flex-shrink: 0;
  }
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`

const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
`

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const CardContent = styled.div`
  padding: 16px;
`

const FilterSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`

const FilterTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`

const FilterButton = styled.button`
  background: none;
  border: none;
  color: #7a5cff;
  cursor: pointer;
  text-decoration: none;
  padding: 2px 4px;
  border-radius: 2px;
  transition: all 0.2s;

  &:hover {
    color: #6b46c1;
    text-decoration: underline;
  }
`

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FilterOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  position: relative;

  &:checked {
    background: #7a5cff;
    border-color: #7a5cff;
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 10px;
    font-weight: bold;
  }

  &:hover {
    border-color: #7a5cff;
  }
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
`

const Main = styled.main`
  flex: 1;
`

const SearchSort = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`

const SearchInput = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px 8px 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    border-color: #7a5cff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(122, 92, 255, 0.2);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`

const Select = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;

  @media (min-width: 640px) {
    width: 192px;
  }

  &:focus {
    border-color: #7a5cff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(122, 92, 255, 0.2);
    background: white;
  }

  &:hover {
    border-color: #9ca3af;
  }
`

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;
  align-items: start;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

const ResourceCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`

const ResourceImage = styled.div`
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 16px;
`

const ResourceContent = styled.div`
  padding: 16px;
`

const ResourceTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
  transition: color 0.2s;

  ${ResourceCard}:hover & {
    color: #7a5cff;
  }
`

const ResourceDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 4px;
  margin-bottom: 4px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
`

const PrimaryBadge = styled(Badge)`
  background: #7a5cff;
  color: white;
  border-color: #7a5cff;
`

const Button = styled.button`
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #7a5cff;
    color: white;
    border-color: #7a5cff;
  }
`

const PrimaryButton = styled(Button)`
  background: #7a5cff;
  color: white;
  border-color: #7a5cff;

  &:hover {
    background: #6b46c1;
  }
`

const Separator = styled.hr`
  height: 1px;
  background: #e5e7eb;
  border: none;
  margin: 16px 0;
`

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
  align-items: center;
`

const FilterLabel = styled.span`
  font-size: 14px;
  color: #6b7280;
`

const HiddenBadge = styled(Badge)`
  background: #fef2f2 !important;
  color: #dc2626 !important;
  border-color: #fecaca !important;
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;

  .spinner {
    width: 32px;
    height: 32px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #7a5cff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .text {
    margin-left: 8px;
    color: #6b7280;
    font-size: 14px;
  }
`

const EndMessage = styled.div`
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-size: 14px;
`

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`

const ModalContent = styled.div`
  position: relative;
  background: white;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 1024px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ModalBody = styled.div`
  padding: 24px;
`

const ModalImageContainer = styled.div`
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.02);
  }
`

const ModalTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
`

const ModalDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 24px 0;
`

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

const MetadataSection = styled.div`
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
`

const MetadataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
`

const MetadataItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    color: #6b7280;
  }

  .value {
    color: #1f2937;
    font-weight: 500;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`

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

interface WidgetConfig {
  theme?: 'light' | 'dark'
  maxHeight?: string
  showFilters?: boolean
  compactMode?: boolean
}

interface StyledAbundanceWidgetProps {
  config?: WidgetConfig
}

export default function StyledAbundanceWidget({ config = {} }: StyledAbundanceWidgetProps) {
  const {
    showFilters = true,
    compactMode = false
  } = config

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

  useEffect(() => {
    // Calculate how many items to show to maintain current viewport
    const currentScrollY = window.scrollY
    const estimatedItemHeight = compactMode ? 350 : 450 // Approximate card height including margins
    const itemsAboveViewport = Math.floor(currentScrollY / estimatedItemHeight)
    const viewportHeight = window.innerHeight
    const itemsInViewport = Math.ceil(viewportHeight / estimatedItemHeight) + 2 // +2 for buffer
    
    // Show enough items to maintain scroll position, but at least the minimum page size
    const minimumItems = Math.max(itemsPerPage, itemsAboveViewport + itemsInViewport)
    const itemsToShow = Math.min(minimumItems, filteredContent.length)
    
    setDisplayedItems(filteredContent.slice(0, itemsToShow))
    setCurrentPage(Math.ceil(itemsToShow / itemsPerPage) + 1)
    setHasMore(filteredContent.length > itemsToShow)
  }, [filteredContent, itemsPerPage, compactMode])

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.abundance-widget-container')
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const containerBottom = containerRect.bottom
      const viewportHeight = window.innerHeight

      // Load more when container bottom is close to viewport
      if (containerBottom - viewportHeight < 1000) {
        loadMoreItems()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadMoreItems])

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

  const openModal = (item: (typeof policyResources)[0]) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
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

  const FilterSectionComponent = ({ filterType, sortYears = false }: { filterType: keyof typeof filterConfig, sortYears?: boolean }) => {
    const config = filterConfig[filterType]
    const IconComponent = config.icon
    
    let optionsToRender = config.options
    if (sortYears && filterType === 'year') {
      optionsToRender = [...config.options].sort((a, b) => parseInt(b) - parseInt(a))
    }

    return (
      <FilterSection>
        <FilterHeader>
          <FilterTitle>
            <IconComponent size={16} />
            {config.title}
          </FilterTitle>
          <FilterControls>
            <FilterButton onClick={() => handleSelectAll(filterType)}>
              All
            </FilterButton>
            <span>|</span>
            <FilterButton onClick={() => handleSelectNone(filterType)}>
              None
            </FilterButton>
          </FilterControls>
        </FilterHeader>
        <FilterOptions>
          {optionsToRender.map((value) => (
            <FilterOption key={value}>
              <Checkbox
                id={`${filterType}-${value}`}
                checked={!config.excluded.includes(value)}
                onChange={(e) => handleFilterChange(filterType, value, e.target.checked)}
              />
              <Label htmlFor={`${filterType}-${value}`}>
                {config.labels[value as keyof typeof config.labels] || value}
              </Label>
            </FilterOption>
          ))}
        </FilterOptions>
      </FilterSection>
    )
  }

  return (
    <WidgetContainer className="abundance-widget-container">
      <Container>
        <MainLayout>
          {showFilters && (
            <Sidebar>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Filter size={20} />
                    Filters
                  </CardTitle>
                  <Button onClick={clearAllFilters}>
                    Clear All
                  </Button>
                </CardHeader>
                <CardContent>
                  <FilterSectionComponent filterType="policyType" />
                  <Separator />
                  <FilterSectionComponent filterType="policyArea" />
                  <Separator />
                  <FilterSectionComponent filterType="region" />
                  <Separator />
                  <FilterSectionComponent filterType="type" />
                  <Separator />
                  <FilterSectionComponent filterType="year" sortYears={true} />
                </CardContent>
              </Card>
            </Sidebar>
          )}

          <Main>
            <SearchSort>
              <SearchContainer>
                <SearchIcon>
                  <Search size={16} />
                </SearchIcon>
                <SearchInput
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Latest First</option>
                <option value="title">Title A-Z</option>
                <option value="type">Content Type</option>
              </Select>
            </SearchSort>

            {/* Active Filters (showing excluded items) */}
            {showFilters && (excludedTypes.length > 0 ||
              excludedRegions.length > 0 ||
              excludedPolicyTypes.length > 0 ||
              excludedPolicyAreas.length > 0 ||
              excludedYears.length > 0) && (
              <ActiveFilters>
                <FilterLabel>Hidden:</FilterLabel>
                {excludedTypes.map((type) => (
                  <HiddenBadge key={type}>
                    {typeLabels[type as keyof typeof typeLabels]}
                  </HiddenBadge>
                ))}
                {excludedRegions.map((region) => (
                  <HiddenBadge key={region}>
                    {regionLabels[region as keyof typeof regionLabels]}
                  </HiddenBadge>
                ))}
                {excludedPolicyTypes.map((policy) => (
                  <HiddenBadge key={policy}>
                    {policyTypeLabels[policy as keyof typeof policyTypeLabels]}
                  </HiddenBadge>
                ))}
                {excludedPolicyAreas.map((area) => (
                  <HiddenBadge key={area}>
                    {policyAreaLabels[area as keyof typeof policyAreaLabels]}
                  </HiddenBadge>
                ))}
                {excludedYears.map((year) => (
                  <HiddenBadge key={year}>
                    {year}
                  </HiddenBadge>
                ))}
              </ActiveFilters>
            )}

            {displayedItems.length > 0 ? (
              <>
                <div style={{ marginBottom: '24px', color: '#6b7280', fontSize: '14px' }}>
                  Showing {displayedItems.length} of {filteredContent.length} resource
                  {filteredContent.length !== 1 ? "s" : ""}
                </div>
                <ResultsGrid>
                  {displayedItems.map((item) => {
                    const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
                    return (
                      <ResourceCard key={item.id} onClick={() => openModal(item)}>
                        <ResourceImage style={{ background: item.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                          <div>
                            <IconComponent size={32} style={{ marginBottom: '8px' }} />
                            <div style={{ fontSize: '14px', fontWeight: '500' }}>
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </div>
                          </div>
                          <PrimaryBadge style={{ position: 'absolute', top: '12px', left: '12px' }}>
                            <IconComponent size={12} style={{ marginRight: '4px' }} />
                            {typeLabels[item.type as keyof typeof typeLabels]}
                          </PrimaryBadge>
                        </ResourceImage>
                        <ResourceContent>
                          <ResourceTitle>{item.title}</ResourceTitle>
                          <ResourceDescription>{item.description}</ResourceDescription>
                          <div style={{ marginBottom: '12px' }}>
                            {item.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                            <span>{item.author}</span>
                            <span>{item.date.split('-')[0]}</span>
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                              {regionLabels[item.region as keyof typeof regionLabels]} | {policyTypeLabels[item.policyType as keyof typeof policyTypeLabels]}
                            </div>
                            <Badge>{policyAreaLabels[item.policyArea as keyof typeof policyAreaLabels]}</Badge>
                          </div>
                          {item.url && (
                            <PrimaryButton 
                              onClick={() => window.open(item.url, '_blank')}
                            >
                              <ExternalLink size={16} style={{ marginRight: '8px' }} />
                              View Resource
                            </PrimaryButton>
                          )}
                        </ResourceContent>
                      </ResourceCard>
                    )
                  })}
                </ResultsGrid>

                {isLoading && (
                  <LoadingSpinner>
                    <div className="spinner"></div>
                    <span className="text">Loading more resources...</span>
                  </LoadingSpinner>
                )}

                {!hasMore && displayedItems.length > 0 && (
                  <EndMessage>
                    You've reached the end of the results.
                  </EndMessage>
                )}
              </>
            ) : (
              <Card>
                <CardContent style={{ textAlign: 'center', padding: '64px 32px' }}>
                  <Search size={48} style={{ color: '#9ca3af', marginBottom: '24px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>No resources found</h3>
                  <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
                    We couldn't find any resources matching your current filters. Try adjusting your search criteria or clearing some filters.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </Main>
        </MainLayout>
      </Container>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {(() => {
                  const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                  return (
                    <PrimaryBadge>
                      <IconComponent size={12} style={{ marginRight: '4px' }} />
                      {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                    </PrimaryBadge>
                  )
                })()}
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Resource Details
                </h2>
              </div>
              <CloseButton onClick={closeModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {/* Image */}
              <ModalImageContainer 
                onClick={() => selectedItem.url && window.open(selectedItem.url, '_blank')}
                title={selectedItem.url ? "Click to open original source" : "No source available"}
              >
                {selectedItem.image ? (
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: selectedItem.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textAlign: 'center'
                    }}
                  >
                    {(() => {
                      const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                      return (
                        <div>
                          <IconComponent size={64} style={{ marginBottom: '16px', opacity: 0.8 }} />
                          <div style={{ fontSize: '20px', fontWeight: '500', opacity: 0.9 }}>
                            {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
                {selectedItem.url && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.2)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      padding: '12px'
                    }}>
                      <ExternalLink size={24} color="#374151" />
                    </div>
                  </div>
                )}
              </ModalImageContainer>

              {/* Title and Description */}
              <ModalTitle>{selectedItem.title}</ModalTitle>
              <ModalDescription>{selectedItem.description}</ModalDescription>

              {/* Metadata Grid */}
              <MetadataGrid>
                <MetadataSection>
                  <h3>Publication Details</h3>
                  <MetadataList>
                    <MetadataItem>
                      <span className="label">Author:</span>
                      <span className="value">{selectedItem.author}</span>
                    </MetadataItem>
                    <MetadataItem>
                      <span className="label">Date:</span>
                      <span className="value">{selectedItem.date.split('-')[0]}</span>
                    </MetadataItem>
                    <MetadataItem>
                      <span className="label">Type:</span>
                      <span className="value">{typeLabels[selectedItem.type as keyof typeof typeLabels]}</span>
                    </MetadataItem>
                  </MetadataList>
                </MetadataSection>

                <MetadataSection>
                  <h3>Policy Information</h3>
                  <MetadataList>
                    <MetadataItem>
                      <span className="label">Region:</span>
                      <span className="value">{regionLabels[selectedItem.region as keyof typeof regionLabels]}</span>
                    </MetadataItem>
                    <MetadataItem>
                      <span className="label">Policy Type:</span>
                      <span className="value">{policyTypeLabels[selectedItem.policyType as keyof typeof policyTypeLabels]}</span>
                    </MetadataItem>
                    <MetadataItem>
                      <span className="label">Policy Area:</span>
                      <Badge>{policyAreaLabels[selectedItem.policyArea as keyof typeof policyAreaLabels]}</Badge>
                    </MetadataItem>
                  </MetadataList>
                </MetadataSection>
              </MetadataGrid>

              {/* Tags */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Tags</h3>
                <div>
                  {selectedItem.tags.map((tag) => (
                    <Badge key={tag} style={{ marginRight: '8px', marginBottom: '4px' }}>{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              {(selectedItem.accessibilityScore || selectedItem.abundanceAlignment || selectedItem.strengths) && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Additional Information</h3>
                  <MetadataList>
                    {selectedItem.accessibilityScore && (
                      <MetadataItem>
                        <span className="label">Accessibility Score:</span>
                        <span className="value" style={{ textTransform: 'capitalize' }}>{selectedItem.accessibilityScore}</span>
                      </MetadataItem>
                    )}
                    {selectedItem.abundanceAlignment && (
                      <MetadataItem>
                        <span className="label">Abundance Alignment:</span>
                        <span className="value">{selectedItem.abundanceAlignment}</span>
                      </MetadataItem>
                    )}
                    {selectedItem.strengths && (
                      <MetadataItem>
                        <span className="label">Strengths:</span>
                        <span className="value">{selectedItem.strengths}</span>
                      </MetadataItem>
                    )}
                  </MetadataList>
                </div>
              )}

              {/* Action Button */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                {selectedItem.url ? (
                  <PrimaryButton 
                    onClick={() => window.open(selectedItem.url, '_blank')}
                    style={{ width: '100%' }}
                  >
                    <ExternalLink size={16} style={{ marginRight: '8px' }} />
                    View Original Source
                  </PrimaryButton>
                ) : (
                  <Button 
                    disabled
                    style={{ 
                      width: '100%', 
                      background: '#9ca3af', 
                      cursor: 'not-allowed',
                      color: 'white',
                      borderColor: '#9ca3af'
                    }}
                  >
                    <ExternalLink size={16} style={{ marginRight: '8px' }} />
                    No Source Available
                  </Button>
                )}
              </div>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </WidgetContainer>
  )
}
