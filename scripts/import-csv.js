const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Import CSV and transform to application format
function importCSV(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  
  const { data } = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true
  });

  console.log(`Parsed ${data.length} rows from CSV`);

  const transformedData = data.map((row, index) => {
    // Extract and clean data
    const title = row['Resource Name']?.trim() || '';
    const org = row['Org']?.trim() || '';
    const summary = row['Summary']?.trim() || '';
    const toolType = row['Tool Type']?.trim() || '';
    const policyArea = row['Policy Area']?.trim() || '';
    const region = row['Region']?.trim() || '';
    const url = row['URL']?.trim() || '';
    const date = row['Date']?.trim() || '2025';
    const accessibilityScore = row['Accessibility Score']?.trim() || '';
    const abundanceAlignment = row['Abundance Alignment']?.trim() || '';
    const strengths = row['Strengths']?.trim() || '';

    // Skip empty rows
    if (!title || !summary) {
      console.log(`Skipping row ${index + 1}: missing title or summary`);
      return null;
    }

    // Map tool types to consistent format
    const typeMapping = {
      'Simulator': 'simulator',
      'Research Brief': 'brief',
      'Catalog or Library': 'catalog',
      'Assessment': 'assessment',
      'Interactive map': 'map',
      'Training & Consulting': 'training',
      'Guide or Toolkit': 'guide',
      'Case study': 'case',
      'News Article or Blog': 'news',
      'Model Policy': 'model'
    };

    // Handle multiple tool types (comma-separated)
    const primaryType = toolType.split(',')[0]?.trim() || 'article';
    const mappedType = typeMapping[primaryType] || 'article';

    // Map regions to consistent format
    const regionMapping = {
      'National': 'national',
      'West': 'west',
      'Midwest': 'midwest',
      'Northeast': 'northeast',
      'South': 'south'
    };

    // Handle multiple regions
    const primaryRegion = region.split(',')[0]?.trim() || 'National';
    const mappedRegion = regionMapping[primaryRegion] || 'national';

    // Extract policy areas (comma-separated) and map all of them
    const policyAreas = policyArea.split(',').map(area => area.trim()).filter(area => area);
    const mappedPolicyAreas = policyAreas.map(area => getPolicyAreaMapping(area)).filter(area => area);
    const primaryPolicyArea = mappedPolicyAreas[0] || 'landuse';

    // Create tags from policy areas only (exclude strengths)
    const tags = [];
    policyAreas.forEach(area => {
      if (area) tags.push(area.toLowerCase());
    });
    // Remove duplicates and limit to 5 tags
    const uniqueTags = [...new Set(tags)].slice(0, 5);

    // Generate gradient background instead of external images
    const gradientInfo = getGradientForCategory(primaryPolicyArea, index);
    const imageUrl = undefined; // Will use gradients instead

    return {
      id: index + 1,
      title,
      description: summary,
      type: mappedType,
      region: mappedRegion,
      policyType: 'housing', // All items in this dataset are housing-related
      policyArea: primaryPolicyArea,
      policyAreas: mappedPolicyAreas, // Array of all applicable policy areas
      date: formatDate(date),
      author: org,
      tags: uniqueTags,
      url,
      accessibilityScore,
      abundanceAlignment,
      strengths,
      image: imageUrl,
      gradient: gradientInfo
    };
  }).filter(item => item !== null);

  console.log(`Transformed ${transformedData.length} valid records`);
  return transformedData;
}

function getPolicyAreaMapping(policyAreaText) {
  const mapping = {
    'Land Use': 'landuse',
    'Financing Projects': 'financing',
    'Rental / Tenant Protections': 'rental',
    'Cost of Building': 'cost',
    'Climate Resiliency': 'climate',
    'Homelessness Prevention': 'homelessness',
    'Homeownership': 'homeownership'
  };

  // Find exact or partial matches
  for (const [key, value] of Object.entries(mapping)) {
    if (policyAreaText.includes(key)) {
      return value;
    }
  }
  
  return null; // Return null if no match found
}

function generateImageKeywords(type, policyArea, title) {
  const baseKeywords = ['government', 'policy', 'housing'];
  
  const typeKeywords = {
    'simulator': ['technology', 'data', 'analysis'],
    'brief': ['research', 'document', 'report'],
    'catalog': ['library', 'resources', 'database'],
    'assessment': ['evaluation', 'checklist', 'planning'],
    'map': ['geography', 'visualization', 'planning'],
    'training': ['education', 'workshop', 'learning'],
    'guide': ['handbook', 'toolkit', 'guidance'],
    'case': ['example', 'implementation', 'success'],
    'news': ['media', 'journalism', 'article'],
    'model': ['framework', 'template', 'legislation']
  };

  const policyKeywords = {
    'landuse': ['urban planning', 'zoning', 'development'],
    'financing': ['investment', 'economics', 'funding'],
    'rental': ['apartment', 'tenant', 'residential'],
    'cost': ['construction', 'building', 'economics'],
    'climate': ['sustainable', 'green', 'environment'],
    'homelessness': ['community', 'support', 'assistance'],
    'homeownership': ['home', 'property', 'family']
  };

  const keywords = [
    ...baseKeywords,
    ...(typeKeywords[type] || []),
    ...(policyKeywords[policyArea] || [])
  ];

  // Add context from title if relevant
  if (title.toLowerCase().includes('affordable')) keywords.push('affordable');
  if (title.toLowerCase().includes('development')) keywords.push('development');
  if (title.toLowerCase().includes('community')) keywords.push('community');

  return keywords.slice(0, 4); // Limit to 4 keywords for URL length
}

function getGradientForCategory(policyArea, index) {
  // Create beautiful gradients for each policy area
  const gradients = {
    'landuse': [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ],
    'financing': [
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ],
    'rental': [
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)'
    ],
    'cost': [
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ],
    'climate': [
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    ],
    'homelessness': [
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    ],
    'homeownership': [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ]
  };

  const categoryGradients = gradients[policyArea] || gradients['landuse'];
  return categoryGradients[index % categoryGradients.length];
}

function formatDate(dateStr) {
  // Handle year-only dates
  if (dateStr && dateStr.length === 4) {
    return `${dateStr}-01-01`;
  }
  
  // Return as-is for other formats, or default
  return dateStr || '2025-01-01';
}

// Main execution
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node import-csv.js <path-to-csv>');
  process.exit(1);
}

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`);
  process.exit(1);
}

try {
  const data = importCSV(csvPath);
  
  // Generate TypeScript file
  const tsContent = `// Auto-generated from CSV import
import { PolicyResource } from './policy-types'

export const policyResources: PolicyResource[] = ${JSON.stringify(data, null, 2)}
`;

  const outputPath = path.join(__dirname, '..', 'lib', 'policy-data.ts');
  fs.writeFileSync(outputPath, tsContent);
  
  console.log(`✅ Successfully imported ${data.length} records to ${outputPath}`);
  console.log('\nSample record:');
  console.log(JSON.stringify(data[0], null, 2));
  
} catch (error) {
  console.error('Error importing CSV:', error);
  process.exit(1);
}
