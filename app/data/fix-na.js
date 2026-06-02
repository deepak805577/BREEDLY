import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { breeds } from './breeds.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeValue(val) {
  if (typeof val === 'object' && val !== null) {
    if (val.male && val.female) {
      return val; // already correct
    }
    // non-standard object like { toy, mini, standard }
    const keys = Object.keys(val);
    const str = keys.map(k => `${k.toUpperCase()}: ${val[k]}`).join(' | ');
    return { male: str, female: str };
  }
  
  if (typeof val === 'string') {
    // Check if it has separate male/female info
    if (val.toLowerCase().includes('for male') || val.toLowerCase().includes('for female') || val.toLowerCase().includes('males') || val.toLowerCase().includes('females')) {
      let male = val;
      let female = val;
      
      const parts = val.split(/;|for/);
      // Let's do a more robust split or search
      // Example: "48–55 kg (105–120 lbs) for females; 54–70 kg (120–155 lbs) for males"
      const subparts = val.split(/[;|,]/);
      let foundMale = false;
      let foundFemale = false;
      for (const part of subparts) {
        const trimmed = part.trim();
        if (trimmed.toLowerCase().includes('female')) {
          female = trimmed.replace(/for females/i, '').replace(/for female/i, '').replace(/females/i, '').replace(/female/i, '').trim();
          foundFemale = true;
        } else if (trimmed.toLowerCase().includes('male')) {
          male = trimmed.replace(/for males/i, '').replace(/for male/i, '').replace(/males/i, '').replace(/male/i, '').trim();
          foundMale = true;
        }
      }
      
      if (foundMale || foundFemale) {
        return { male, female };
      }
    }
    
    // Standard range string: just assign to both
    return { male: val, female: val };
  }
  
  return { male: 'N/A', female: 'N/A' };
}

function run() {
  console.log('Normalizing breed weights and heights to eliminate N/A fields...');
  
  let normalizedCount = 0;
  for (const [name, data] of Object.entries(breeds)) {
    if (data.quick_overview) {
      const originalWeight = data.quick_overview.weight;
      const originalHeight = data.quick_overview.height;
      
      const newWeight = normalizeValue(originalWeight);
      const newHeight = normalizeValue(originalHeight);
      
      if (JSON.stringify(originalWeight) !== JSON.stringify(newWeight) || 
          JSON.stringify(originalHeight) !== JSON.stringify(newHeight)) {
        data.quick_overview.weight = newWeight;
        data.quick_overview.height = newHeight;
        normalizedCount++;
      }
    }
  }
  
  console.log(`Normalized weight/height objects for ${normalizedCount} breeds.`);
  
  const breedsFilePath = path.join(__dirname, 'breeds.js');
  const fileHeader = `// app/data/breeds.js\n// Detailed breed profiles generated dynamically. Preserves existing 163 hand-crafted profiles intact.\n\nexport const breeds = `;
  const jsonContent = JSON.stringify(breeds, null, 2);
  const fileContent = `${fileHeader}${jsonContent};\n`;
  
  fs.writeFileSync(breedsFilePath, fileContent, 'utf-8');
  console.log(`Saved updated and fully normalized breeds data to ${breedsFilePath}`);
}

run();
