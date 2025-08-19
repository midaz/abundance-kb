"use client"

import styled from 'styled-components'
import { Search, Filter, FileText, Headphones, BookOpen, Users, MapPin, Building, X, ExternalLink, Calendar } from "lucide-react"
import Image from "next/image"
import { useAbundanceData } from "@/hooks/useAbundanceData"

// Styled Components
const WidgetContainer = styled.div`
  font-family: "TT Hoves Pro", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  color: #374151;
  background: #f8fafc;
  min-height: 100vh;
  box-sizing: border-box;
  
  * {
    box-sizing: border-box !important;
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
  
  @media (min-width: 1024px) {
    width: 320px;
    flex-shrink: 0;
  }
`

const Main = styled.main`
  flex: 1;
  min-width: 0;
`

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const CardHeader = styled.div`
  padding: 24px 24px 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`

const CardTitle = styled.h2`
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111827 !important;
`

const CardContent = styled.div`
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Button = styled.button`
  background: transparent !important;
  border: 1px solid #d1d5db !important;
  color: #374151 !important;
  padding: 8px 16px !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  margin: 0 !important;
  
  &:hover {
    background: #7a5cff !important;
    border-color: #7a5cff !important;
    color: white !important;
  }
`

const SearchContainer = styled.div`
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`

const SearchInputContainer = styled.div`
  position: relative;
  flex: 1;
`

const SearchInput = styled.input`
  width: 100% !important;
  padding: 12px 12px 12px 40px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px) !important;
  font-size: 14px !important;
  color: #374151 !important;
  margin: 0 !important;
  
  &::placeholder {
    color: #9ca3af !important;
  }
  
  &:focus {
    outline: none !important;
    border-color: #7a5cff !important;
    box-shadow: 0 0 0 3px rgba(122, 92, 255, 0.1) !important;
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 16px;
  height: 16px;
`

const Select = styled.select`
  width: 100% !important;
  padding: 12px 16px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px) !important;
  font-size: 14px !important;
  color: #374151 !important;
  cursor: pointer !important;
  margin: 0 !important;
  
  @media (min-width: 640px) {
    width: 192px !important;
  }
  
  &:focus {
    outline: none !important;
    border-color: #7a5cff !important;
    box-shadow: 0 0 0 3px rgba(122, 92, 255, 0.1) !important;
  }
`

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FilterTitle = styled.h3`
  font-size: 16px !important;
  font-weight: 600 !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111827 !important;
`

const FilterControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
`

const FilterButton = styled.button`
  background: none !important;
  border: none !important;
  color: #7a5cff !important;
  cursor: pointer !important;
  font-size: 12px !important;
  padding: 0 !important;
  margin: 0 !important;
  
  &:hover {
    color: #6366f1 !important;
    text-decoration: underline !important;
  }
`

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const FilterOption = styled.div`
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 6px 0 !important;
  margin: 0 !important;
  width: 100% !important;
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  min-height: 16px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  background: white !important;
  cursor: pointer !important;
  transition: all 0.2s !important;
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  position: relative !important;
  flex-shrink: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  outline: none !important;

  &:checked {
    background: #7a5cff !important;
    border-color: #7a5cff !important;
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
    border-color: #7a5cff !important;
  }

  &:focus {
    border-color: #7a5cff !important;
    box-shadow: 0 0 0 2px rgba(122, 92, 255, 0.2) !important;
  }
`

const Label = styled.label`
  font-size: 14px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  flex: 1 !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.4 !important;
  color: #374151 !important;
  user-select: none !important;
  display: flex !important;
  align-items: center !important;
`

const Separator = styled.hr`
  border: none;
  height: 1px;
  background: #e5e7eb;
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  height: fit-content;
  
  &:hover {
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    background: white;
  }
`

const Badge = styled.span<{ variant?: string; color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.color || '#7a5cff'};
  color: white;
  border: 1px solid transparent;
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

interface WidgetConfig {
  theme?: 'light' | 'dark'
  maxHeight?: string
  showFilters?: boolean
  compactMode?: boolean
}

interface AbundanceWidgetProps {
  config?: WidgetConfig
}

export default function AbundanceWidget({ config = {} }: AbundanceWidgetProps) {
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
    
    // Configuration
    filterConfig,
    config: widgetConfig,
    
    // Label mappings
    typeLabels,
    regionLabels,
    policyTypeLabels,
    policyAreaLabels,
  } = useAbundanceData({ config })

  const FilterSectionComponent = ({ filterType, sortYears = false }: { filterType: keyof typeof filterConfig, sortYears?: boolean }) => {
    const configData = filterConfig[filterType]
    const IconComponent = typeIcons[configData.icon as keyof typeof typeIcons] || Filter
    
    let optionsToRender = configData.options
    if (sortYears && filterType === 'year') {
      optionsToRender = [...configData.options].sort((a, b) => parseInt(b) - parseInt(a))
    }

    return (
      <FilterSection>
        <FilterHeader>
          <FilterTitle>
            <IconComponent size={16} />
            {configData.title}
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
            <FilterOption key={`${filterType}-option-${value}`}>
              <Checkbox
                id={`${filterType}-${value}`}
                checked={!configData.excluded.includes(value)}
                onChange={(e) => handleFilterChange(filterType, value, e.target.checked)}
              />
              <Label htmlFor={`${filterType}-${value}`}>
                {configData.labels[value as keyof typeof configData.labels] || value}
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
          {widgetConfig.showFilters && (
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
            {/* Search and Sort */}
            <SearchContainer>
              <SearchInputContainer>
                <SearchIcon />
                <SearchInput
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchInputContainer>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date">Latest First</option>
                <option value="title">Title A-Z</option>
                <option value="type">Content Type</option>
              </Select>
            </SearchContainer>

            {/* Results */}
            {displayedItems.length > 0 ? (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Showing {displayedItems.length} of {filteredContent.length} resource
                    {filteredContent.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <Grid>
                  {displayedItems.map((item) => {
                    const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
                    return (
                      <ItemCard key={item.id} onClick={() => openModal(item)}>
                        <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
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
                                background: item.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textAlign: 'center',
                                padding: '16px'
                              }}
                            >
                              <div>
                                <IconComponent size={32} style={{ marginBottom: '8px', opacity: 0.8 }} />
                                <div style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9 }}>
                                  {typeLabels[item.type as keyof typeof typeLabels]}
                                </div>
                              </div>
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                            <Badge>
                              <IconComponent size={12} />
                              {typeLabels[item.type as keyof typeof typeLabels]}
                            </Badge>
                          </div>
                        </div>
                        
                        <div style={{ padding: '16px' }}>
                          <h3 style={{ 
                            fontSize: '16px', 
                            fontWeight: '600', 
                            margin: '0 0 8px 0', 
                            lineHeight: '1.3',
                            color: '#111827'
                          }}>
                            {item.title}
                          </h3>
                          <p style={{ 
                            fontSize: '14px', 
                            color: '#6b7280', 
                            margin: '0 0 12px 0',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.description}
                          </p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                            <span>{item.author}</span>
                            <span>{item.date.split('-')[0]}</span>
                          </div>
                          
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            <span>{regionLabels[item.region as keyof typeof regionLabels]}</span>
                            <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
                            <span>{policyTypeLabels[item.policyType as keyof typeof policyTypeLabels]}</span>
                          </div>
                        </div>
                      </ItemCard>
                    )
                  })}
                </Grid>

                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      border: '2px solid #e5e7eb', 
                      borderTop: '2px solid #7a5cff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    <span style={{ color: '#6b7280' }}>Loading more resources...</span>
                  </div>
                )}

                {!hasMore && displayedItems.length > 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <p style={{ color: '#6b7280' }}>You've reached the end of the results.</p>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 16px' }}>
                  <div style={{ 
                    width: '96px', 
                    height: '96px', 
                    background: '#f3f4f6', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <Search size={48} style={{ color: '#9ca3af' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>No resources found</h3>
                  <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: '448px', marginBottom: '24px' }}>
                    We couldn't find any resources matching your current filters. Try adjusting your search criteria or
                    clearing some filters.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                </div>
              </Card>
            )}
          </Main>
        </MainLayout>
      </Container>

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={closeModal}
          />
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '896px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              borderBottom: '1px solid #e5e7eb',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '12px 12px 0 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge>
                  {(() => {
                    const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                    return (
                      <>
                        <IconComponent size={12} />
                        {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                      </>
                    )
                  })()}
                </Badge>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Resource Details</h2>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden', borderRadius: '12px', marginBottom: '24px' }}>
                {selectedItem.image ? (
                  <div 
                    style={{ width: '100%', height: '100%', cursor: selectedItem.url ? 'pointer' : 'default', position: 'relative' }}
                    onClick={() => selectedItem.url && window.open(selectedItem.url, '_blank')}
                    title={selectedItem.url ? "Click to open original source" : "No source available"}
                  >
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
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '50%',
                          padding: '12px'
                        }}>
                          <ExternalLink size={24} style={{ color: '#374151' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      background: selectedItem.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: selectedItem.url ? 'pointer' : 'default',
                      position: 'relative'
                    }}
                    onClick={() => selectedItem.url && window.open(selectedItem.url, '_blank')}
                    title={selectedItem.url ? "Click to open original source" : "No source available"}
                  >
                    <div style={{ textAlign: 'center', color: 'white' }}>
                      {(() => {
                        const IconComponent = typeIcons[selectedItem.type as keyof typeof typeIcons]
                        return <IconComponent size={64} style={{ marginBottom: '16px', opacity: 0.8 }} />
                      })()}
                      <div style={{ fontSize: '20px', fontWeight: 500, opacity: 0.9 }}>
                        {typeLabels[selectedItem.type as keyof typeof typeLabels]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>{selectedItem.title}</h1>
                <p style={{ color: '#374151', lineHeight: 1.6 }}>{selectedItem.description}</p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '24px', 
                marginBottom: '24px' 
              }}>
                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Publication Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Author:</span>
                      <span style={{ color: '#111827' }}>{selectedItem.author}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Date:</span>
                      <span style={{ color: '#111827' }}>{selectedItem.date.split('-')[0]}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Type:</span>
                      <span style={{ color: '#111827' }}>{typeLabels[selectedItem.type as keyof typeof typeLabels]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Policy Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Region:</span>
                      <span style={{ color: '#111827' }}>
                        {regionLabels[selectedItem.region as keyof typeof regionLabels]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280' }}>Policy Type:</span>
                      <span style={{ color: '#111827' }}>
                        {policyTypeLabels[selectedItem.policyType as keyof typeof policyTypeLabels]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                {selectedItem.url ? (
                  <button 
                    style={{
                      width: '100%',
                      background: '#7a5cff',
                      color: 'white',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onClick={() => window.open(selectedItem.url, '_blank')}
                  >
                    <ExternalLink size={16} />
                    View Original Source
                  </button>
                ) : (
                  <button 
                    style={{
                      width: '100%',
                      background: '#9ca3af',
                      color: 'white',
                      border: 'none',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    disabled
                  >
                    <ExternalLink size={16} />
                    No Source Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </WidgetContainer>
  )
}
