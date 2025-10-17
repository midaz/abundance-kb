const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const ROOT = '/Users/deviyer/repos/abundance-kb';
const housing1Path = path.join(ROOT, 'housing1.csv');
const housing2Path = path.join(ROOT, 'housing2.csv');
const outputPath = path.join(ROOT, 'housing2_pruned.csv');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractHeader(csvText) {
  const firstNewlineIdx = csvText.indexOf('\n');
  if (firstNewlineIdx === -1) return csvText.trimEnd();
  return csvText.slice(0, firstNewlineIdx).replace(/\r$/, '');
}

function parseCsv(csvText) {
  // Parse entire CSV (including header row) as arrays
  const result = Papa.parse(csvText, {
    header: false,
    skipEmptyLines: true,
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '"',
  });
  if (result.errors && result.errors.length > 0) {
    const msg = result.errors.slice(0, 3).map(e => `${e.type || 'parse'}: ${e.message} at row ${e.row ?? 'n/a'}`).join('; ');
    throw new Error(`CSV parse error(s): ${msg}`);
  }
  return result.data;
}

function writeCsv(headerLine, rows, outPath) {
  const body = Papa.unparse(rows, { header: false });
  const finalText = `${headerLine}\n${body}\n`;
  fs.writeFileSync(outPath, finalText, 'utf8');
}

function main() {
  // Read source files
  const h1Text = readFile(housing1Path);
  const h2Text = readFile(housing2Path);

  // Extract target header (must match prod schema exactly)
  const targetHeader = extractHeader(h1Text);

  // Parse new data
  const rows = parseCsv(h2Text);
  if (rows.length === 0) {
    throw new Error('housing2.csv appears to be empty.');
  }

  // Drop source header row from housing2
  const dataRows = rows.slice(1);

  // Map each row from housing2 -> housing1 schema (by index, not header text)
  // housing1 indices:
  // 0 Resource Name
  // 1 Org
  // 2 Date
  // 3 URL
  // 4 Summary
  // 5 Tool Type
  // 6 "" (blank column)
  // 7 Policy Area
  // 8 Region
  // 9 "" (blank column)
  // 10 Accessibility Score (not present in housing2 -> leave blank)
  // 11 Abundance Alignment (maps from housing2 col 10 Abundance Tag)
  // 12 Strengths (maps from housing2 col 11 Abundance Note)

  const mapped = dataRows.map((row, idx) => {
    // Ensure row has at least 12 columns (0..11) for safe access
    const safe = Array.isArray(row) ? row.slice() : [];
    // Fill missing indices up to 12 with empty strings
    for (let i = 0; i <= 12; i += 1) {
      if (typeof safe[i] === 'undefined') safe[i] = '';
    }

    return [
      safe[0], // Resource Name
      safe[1], // Org
      safe[2], // Date
      safe[3], // URL
      safe[4], // Summary
      safe[5], // Tool Type
      safe[6], // blank
      safe[7], // Policy Area
      safe[8], // Region
      safe[9], // blank
      '',      // Accessibility Score (intentionally blank)
      safe[10], // Abundance Alignment <- Abundance Tag
      safe[11], // Strengths <- Abundance Note
    ];
  });

  writeCsv(targetHeader, mapped, outputPath);

  // Basic report
  console.log(`Wrote ${mapped.length} rows to ${outputPath}`);
}

try {
  main();
} catch (err) {
  console.error(err && err.stack ? err.stack : String(err));
  process.exit(1);
}


