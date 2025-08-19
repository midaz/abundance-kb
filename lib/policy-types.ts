// TypeScript interfaces for policy resource data
export interface PolicyResource {
  id: number
  title: string
  description: string
  type: string
  region: string
  policyType: string
  policyArea: string
  policyAreas: string[] // Array of all applicable policy areas
  date: string
  author: string
  tags: string[]
  url?: string
  accessibilityScore?: string
  abundanceAlignment?: string
  strengths?: string
  image?: string | null
  gradient?: string
}

// Mapping from CSV columns to our interface
export interface CSVRow {
  'Resource Name': string
  'Org': string
  'Date': string
  'URL': string
  'Summary': string
  'Tool Type': string
  'Policy Area': string
  'Region': string
  'Accessibility Score': string
  'Abundance Alignment': string
  'Strengths': string
}

// Type mappings for consistent categorization
export const typeMapping: Record<string, string> = {
  'Simulator': 'simulator',
  'Research Brief': 'brief',
  'Catalog or Library': 'catalog',
  'Assessment': 'assessment',
  'Interactive map': 'map',
  'Training & Consulting': 'training',
  'Guide or Toolkit': 'guide',
  'Case study': 'case',
  'News Article or Blog': 'news',
  'Model Policy': 'model',
  'Academic Paper': 'paper',
  'Podcast': 'podcast',
  'Book': 'book'
}

export const regionMapping: Record<string, string> = {
  'National': 'national',
  'West': 'west',
  'Midwest': 'midwest',
  'Northeast': 'northeast',
  'South': 'south'
}

export const policyAreaMapping: Record<string, string[]> = {
  'Land Use': ['landuse'],
  'Financing Projects': ['financing'],
  'Rental / Tenant Protections': ['rental'],
  'Cost of Building': ['cost'],
  'Climate Resiliency': ['climate'],
  'Homelessness Prevention': ['homelessness'],
  'Homeownership': ['homeownership']
}

// Unsplash keyword mapping for contextual images
export const unsplashKeywords: Record<string, string[]> = {
  'landuse': ['urban planning', 'city development', 'architecture', 'zoning'],
  'financing': ['construction finance', 'investment', 'development', 'economics'],
  'rental': ['apartment building', 'residential', 'tenant', 'housing'],
  'cost': ['construction', 'building materials', 'development cost', 'economics'],
  'climate': ['sustainable building', 'green architecture', 'climate resilience', 'environment'],
  'homelessness': ['community support', 'social services', 'housing assistance', 'shelter'],
  'homeownership': ['home buying', 'residential property', 'family home', 'real estate']
}

export const toolTypeKeywords: Record<string, string[]> = {
  'simulator': ['technology', 'computer', 'data analysis', 'modeling'],
  'brief': ['research', 'documents', 'policy', 'analysis'],
  'catalog': ['library', 'resources', 'database', 'collection'],
  'assessment': ['evaluation', 'checklist', 'analysis', 'review'],
  'map': ['geography', 'mapping', 'data visualization', 'planning'],
  'training': ['education', 'workshop', 'learning', 'professional development'],
  'guide': ['handbook', 'instructions', 'toolkit', 'guidance'],
  'case': ['example', 'study', 'success story', 'implementation'],
  'news': ['journalism', 'media', 'news', 'current events'],
  'model': ['template', 'framework', 'policy document', 'legislation'],
  'paper': ['academic', 'research', 'university', 'scholarship'],
  'podcast': ['microphone', 'audio', 'interview', 'discussion'],
  'book': ['books', 'reading', 'literature', 'knowledge']
}
