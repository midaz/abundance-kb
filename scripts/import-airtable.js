const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env at project root if present
dotenv.config();

// Configuration: defaults can be overridden via CLI args or env vars
const DEFAULT_BASE_ID = 'appp4QinpvtEldbq2';
const DEFAULT_TABLE_ID = 'tblQq8U7LQSQcN9YE';
const DEFAULT_VIEW_ID = 'viwzabB3G62D0L57K';

function loadLocalConfig() {
  // Support a local, git-ignored config file to avoid hardcoding secrets in repo
  const candidatePaths = [
    path.join(process.cwd(), '.airtable.local.json'),
    path.join(process.cwd(), '.airtable.config.json'),
    path.join(__dirname, '.airtable.local.json'),
    path.join(__dirname, '.airtable.config.json'),
  ];
  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
        return {
          accessToken: parsed.accessToken || parsed.token || parsed.apiKey,
          baseId: parsed.baseId,
          tableId: parsed.tableId || parsed.tableName,
          viewId: parsed.viewId || parsed.viewName,
        };
      }
    } catch {
      // ignore malformed config and continue
    }
  }
  return {};
}

/**
 * Safe getter for Airtable field values.
 * - If value is an array (e.g., multi-select), join with ', '
 * - If value is an object, attempt to stringify or coerce to ''
 * - Always returns a string
 */
function coerceFieldToString(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') {
    // Some Airtable fields can be rich objects; take a conservative approach
    // If it's a { url, text } or similar, prefer 'url' or 'text'
    if (value.url) return String(value.url);
    if (value.text) return String(value.text);
    try {
      return String(value.toString ? value.toString() : JSON.stringify(value));
    } catch {
      return '';
    }
  }
  return String(value);
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

  for (const [key, value] of Object.entries(mapping)) {
    if (policyAreaText.includes(key)) {
      return value;
    }
  }
  return null;
}

function getGradientForCategory(policyArea, index) {
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
  if (dateStr && dateStr.length === 4) {
    return `${dateStr}-01-01`;
  }
  return dateStr || '2025-01-01';
}

async function fetchAllAirtableRecords({ baseId, tableId, viewId, apiKey }) {
  if (!apiKey) {
    console.error('❌ Missing AIRTABLE_API_KEY (set env var AIRTABLE_API_KEY)');
    process.exit(1);
  }
  const urlBase = `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableId)}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
  };

  let records = [];
  let params = new URLSearchParams();
  if (viewId) params.set('view', viewId);
  params.set('pageSize', '100');

  while (true) {
    const url = `${urlBase}?${params.toString()}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Airtable request failed: ${res.status} ${res.statusText}\n${text}`);
      process.exit(1);
    }
    const json = await res.json();
    if (Array.isArray(json.records)) {
      records = records.concat(json.records);
    }
    if (json.offset) {
      params.set('offset', json.offset);
    } else {
      break;
    }
  }
  return records;
}

function transformAirtableRecords(records) {
  console.log(`Fetched ${records.length} records from Airtable`);

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
  const regionMapping = {
    'National': 'national',
    'West': 'west',
    'Midwest': 'midwest',
    'Northeast': 'northeast',
    'South': 'south'
  };

  const transformed = [];

  records.forEach((rec, index) => {
    const f = rec.fields || {};

    const title = coerceFieldToString(f['Resource Name']).trim();
    const org = coerceFieldToString(f['Org']).trim();
    const summary = coerceFieldToString(f['Summary']).trim();
    const abundanceNote = coerceFieldToString(f['Abundance Note']).trim();
    const orgDescription =
      (typeof f['Org Description'] === 'object' && f['Org Description'] && f['Org Description'].value
        ? String(f['Org Description'].value).trim()
        : coerceFieldToString(f['Org Description']).trim());
    const description = summary || abundanceNote || orgDescription || '';
    const toolTypeRaw = coerceFieldToString(f['Tool Type']).trim();
    const policyAreaRaw = coerceFieldToString(f['Policy Area']).trim();
    const regionRaw = coerceFieldToString(f['Region']).trim();
    const url = coerceFieldToString(f['URL']).trim();
    const dateRaw = coerceFieldToString(f['Date']).trim() || '2025';
    const accessibilityScore =
      coerceFieldToString(f['Accessibility Score']).trim() ||
      coerceFieldToString(f['Accessible?']).trim();
    const abundanceAlignment =
      coerceFieldToString(f['Abundance Alignment']).trim() ||
      coerceFieldToString(f['Abundance Tag']).trim();
    const strengths =
      coerceFieldToString(f['Strengths']).trim() ||
      abundanceNote;

    if (!title) {
      // Skip incomplete rows
      return;
    }

    const primaryType = toolTypeRaw.split(',')[0]?.trim() || 'article';
    const mappedType = typeMapping[primaryType] || 'article';

    const primaryRegion = regionRaw.split(',')[0]?.trim() || 'National';
    const mappedRegion = regionMapping[primaryRegion] || 'national';

    const rawAreas = policyAreaRaw
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const mappedPolicyAreas = rawAreas
      .map((area) => getPolicyAreaMapping(area))
      .filter(Boolean);
    const primaryPolicyArea = mappedPolicyAreas[0] || 'landuse';

    const tags = Array.from(new Set(rawAreas.map((a) => a.toLowerCase()))).slice(0, 5);

    const gradient = getGradientForCategory(primaryPolicyArea, index);

    transformed.push({
      id: transformed.length + 1,
      title,
      description,
      type: mappedType,
      region: mappedRegion,
      policyType: 'housing',
      policyArea: primaryPolicyArea,
      policyAreas: mappedPolicyAreas,
      date: formatDate(dateRaw),
      author: org,
      tags,
      url,
      accessibilityScore,
      abundanceAlignment,
      strengths,
      image: undefined,
      gradient
    });
  });

  console.log(`Transformed ${transformed.length} valid records`);
  return transformed;
}

async function main() {
  const [
    cliBaseId,
    cliTableId,
    cliViewId,
    cliToken
  ] = process.argv.slice(2);

  const localCfg = loadLocalConfig();

  const baseId = cliBaseId || process.env.AIRTABLE_BASE_ID || localCfg.baseId || DEFAULT_BASE_ID;
  const tableId = cliTableId || process.env.AIRTABLE_TABLE_ID || localCfg.tableId || DEFAULT_TABLE_ID;
  const viewId = cliViewId || process.env.AIRTABLE_VIEW_ID || localCfg.viewId || DEFAULT_VIEW_ID;
  const apiKey = cliToken || process.env.AIRTABLE_API_KEY || localCfg.accessToken;

  console.log(`→ Importing from Airtable base=${baseId} table=${tableId} view=${viewId}`);

  if (typeof fetch !== 'function') {
    console.error('❌ This script requires Node 18+ (global fetch).');
    process.exit(1);
  }

  try {
    const airtableRecords = await fetchAllAirtableRecords({ baseId, tableId, viewId, apiKey });
    const data = transformAirtableRecords(airtableRecords);

    const tsContent = `// Auto-generated from Airtable import
import { PolicyResource } from './policy-types'

export const policyResources: PolicyResource[] = ${JSON.stringify(data, null, 2)}
`;

    const outputPath = path.join(__dirname, '..', 'lib', 'policy-data.ts');
    fs.writeFileSync(outputPath, tsContent);
    console.log(`✅ Successfully imported ${data.length} records to ${outputPath}`);
    if (data.length > 0) {
      console.log('\nSample record:');
      console.log(JSON.stringify(data[0], null, 2));
    }
  } catch (err) {
    console.error('Error importing from Airtable:', err);
    process.exit(1);
  }
}

main();


