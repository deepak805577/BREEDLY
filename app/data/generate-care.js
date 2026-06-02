import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { breedCards } from './breed.js';
import { breedGroomingAndCare as existingCareData } from './care.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to estimate lifespan based on size
function getLifespan(sizeCategory) {
  if (sizeCategory.toLowerCase().includes('large')) return "10–12 years";
  if (sizeCategory.toLowerCase().includes('giant') || sizeCategory.toLowerCase().includes('xl')) return "8–10 years";
  return "12–15 years";
}

// Generate highly tailored care and grooming profile
function generateCareProfile(card) {
  const { name, size, group, temperament, grooming, energy } = card;
  const sizeCategory = size.split(' ')[0] || 'Medium';
  const lifespan = getLifespan(sizeCategory);
  
  // Coat type estimation
  let coatType = "Medium-length dense double coat";
  if (grooming.toLowerCase() === 'easy') coatType = "Short, smooth single coat";
  else if (grooming.toLowerCase() === 'busy') coatType = "Long, shaggy thick double coat";

  // Grooming lists and details
  let brushingFreq = "2–3 times per week";
  let brushingPurpose = "Removes loose hairs, prevents minor mats, and distributes natural oils.";
  let bathingFreq = "Every 6–8 weeks";
  let bathingNotes = "Use a gentle, dog-safe shampoo; overbathing can dry out their skin.";
  let sheddingLevel = "Moderate; seasonal coat blows";
  let proGrooming = "Every 3–4 months";
  let groomingTime = "15–20 minutes per session";
  let toolsList = ["Slicker brush", "Pin brush", "Undercoat rake", "Mild dog shampoo", "Nail clippers", "Ear cleaner", "Toothbrush kit"];

  if (grooming.toLowerCase() === 'easy') {
    brushingFreq = "Once a week";
    brushingPurpose = "Clears away loose dander and maintains a healthy skin surface.";
    bathingFreq = "Every 8–10 weeks (or when dirty)";
    bathingNotes = "A quick wipe-down with a damp towel is often sufficient; use mild shampoo.";
    sheddingLevel = "Low to Moderate";
    proGrooming = "Rarely required; easily managed at home";
    groomingTime = "5–10 minutes per session";
    toolsList = ["Rubber grooming mitt", "Soft bristle brush", "Mild dog shampoo", "Nail clippers", "Ear wipes", "Toothbrush kit"];
  } else if (grooming.toLowerCase() === 'busy') {
    brushingFreq = "Daily brushing";
    brushingPurpose = "Essential to prevent painful mats and tangles, especially in joint creases.";
    bathingFreq = "Every 4–6 weeks";
    bathingNotes = "Apply high-quality detangling conditioner to keep the coat manageable.";
    sheddingLevel = "High; regular undercoat blow-outs";
    proGrooming = "Every 6–8 weeks (highly recommended)";
    groomingTime = "30–45 minutes per session";
    toolsList = ["Slicker brush", "Undercoat rake", "Dematting comb", "Detangling spray", "Professional blow dryer", "Nail grinder", "Ear cleaner", "Toothbrush kit"];
  }

  // Cost estimates
  let monthlyCost = "₹600 – ₹1,200";
  let yearlyCost = "₹8,000 – ₹15,000";
  if (sizeCategory.toLowerCase() === 'small' || sizeCategory.toLowerCase() === 'toy') {
    monthlyCost = "₹400 – ₹800";
    yearlyCost = "₹5,000 – ₹10,000";
  } else if (sizeCategory.toLowerCase() === 'large') {
    monthlyCost = "₹800 – ₹1,600";
    yearlyCost = "₹10,000 – ₹20,000";
  } else if (sizeCategory.toLowerCase() === 'giant' || sizeCategory.toLowerCase() === 'xl') {
    monthlyCost = "₹1,200 – ₹2,200";
    yearlyCost = "₹15,000 – ₹26,000";
  }

  return {
    overview: {
      coat_type: coatType,
      temperament: temperament,
      size: sizeCategory,
      lifespan: lifespan
    },
    grooming: {
      brushing: {
        frequency: brushingFreq,
        purpose: brushingPurpose
      },
      bathing: {
        frequency: bathingFreq,
        notes: bathingNotes
      },
      nail_care: {
        frequency: "Every 3–4 weeks",
        tips: "Trim carefully to avoid cutting the quick; use a grinder for smooth edges."
      },
      ear_care: {
        frequency: "Weekly",
        tips: "Clean gently with damp cloth or veterinary wash; keep dry to prevent infections."
      },
      dental_care: {
        frequency: "2–3 times per week",
        tips: "Use soft canine toothbrush and enzymatic toothpaste to prevent tartar build-up."
      },
      shedding: sheddingLevel
    },
    routine_care: {
      exercise: energy.toLowerCase() === 'high' ? "60–90 minutes daily" : "30–45 minutes daily",
      daily_upkeep: [
        "Inspect eyes and ears for signs of redness or debris",
        "Wipe paws clean after outdoor walks",
        "Gently brush through coat to catch early knots",
        "Provide fresh water and maintain consistent meal schedule"
      ],
      grooming_time: groomingTime,
      professional_grooming: proGrooming,
      tips: [
        "Start grooming routines early in puppyhood to build confidence.",
        "Keep grooming sessions positive with plenty of praise and small rewards.",
        "Always dry their ears thoroughly after baths or wet walks.",
        "Maintain a steady brushing calendar to drastically reduce house shedding."
      ]
    },
    seasonal_care: {
      summer: [
        "Brush more frequently to help clear their coat and avoid heat retention.",
        "Provide clean shade and constant hydration during outdoor play."
      ],
      monsoon: [
        "Always dry their coat completely after rain or muddy walks.",
        "Check skin folds and paw pads for signs of moisture-induced yeast infections."
      ],
      winter: [
        "Reduce bathing frequency to prevent skin drying and itching.",
        "Brush consistently to prevent winter sweaters/mats from tangling."
      ]
    },
    grooming_tools: toolsList,
    cost_estimate: {
      monthly: monthlyCost,
      yearly: yearlyCost,
      includes: [
        "High-quality shampoo and home tools",
        "Standard professional trim/bath sessions"
      ]
    }
  };
}

// Perform generation and update file
function run() {
  console.log('Generating missing breed care and grooming detailed data...');

  const breedCardsNames = breedCards.map(b => b.name);
  const existingNames = Object.keys(existingCareData);

  const missingNames = breedCardsNames.filter(name => !existingNames.includes(name));
  console.log(`Care Database: Missing ${missingNames.length} breeds.`);

  const finalCareData = { ...existingCareData };
  for (const name of missingNames) {
    const card = breedCards.find(c => c.name === name);
    if (card) {
      finalCareData[name] = generateCareProfile(card);
    }
  }

  const careFilePath = path.join(__dirname, 'care.js');
  const careHeader = `// app/data/care.js\n// Detailed breed care/grooming profiles generated dynamically. Preserves existing profiles intact.\n\nexport const breedGroomingAndCare = `;
  fs.writeFileSync(careFilePath, `${careHeader}${JSON.stringify(finalCareData, null, 2)};\n`, 'utf-8');
  console.log(`Saved updated care data to ${careFilePath}`);

  console.log('Care data generation completed successfully!');
}

run();
