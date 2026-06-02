import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { breedCards } from './breed.js';
import { breedFoodData as existingFoodData } from './food.js';
import { healthData as existingHealthData } from './health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert size label (e.g. "Small (7-10 lbs)") to kg string for healthData
function parseWeightKg(sizeStr) {
  const match = sizeStr.match(/(\d+)-(\d+)\s*lbs/i);
  if (match) {
    const minLbs = parseInt(match[1]);
    const maxLbs = parseInt(match[2]);
    const minKg = Math.round(minLbs * 0.453592 * 10) / 10;
    const maxKg = Math.round(maxLbs * 0.453592 * 10) / 10;
    return `${minKg}–${maxKg} kg`;
  }
  const lower = sizeStr.toLowerCase();
  if (lower.includes('toy') || lower.includes('small')) return "3–7 kg";
  if (lower.includes('medium')) return "12–25 kg";
  if (lower.includes('large')) return "27–41 kg";
  return "45–70 kg";
}

// Generate realistic food profile for a breed
function generateFoodProfile(card) {
  const { name, size, group, temperament, idealOwner, energy } = card;
  const sizeCategory = size.split(' ')[0] || 'Medium';
  const traits = temperament.split(',').map(t => t.trim());
  const mainTrait = traits[0] || 'Active';
  const secondTrait = traits[1] || 'Loyal';

  // Customize nutrition ratios based on size/energy
  let protein = "24–28%";
  let fat = "12–15%";
  let carbs = "40–50%";
  let fiber = "3–5%";
  let keyAddons = "Omega-3 fatty acids, Joint support supplements";

  if (energy.toLowerCase() === 'high' || energy.toLowerCase() === 'very high') {
    protein = "26–30%";
    fat = "14–18%";
    carbs = "35–45%";
  }
  if (sizeCategory.toLowerCase() === 'large' || sizeCategory.toLowerCase() === 'giant') {
    keyAddons = "Glucosamine, Chondroitin for large joints, Anti-bloat diet";
  } else if (sizeCategory.toLowerCase() === 'small' || sizeCategory.toLowerCase() === 'toy') {
    keyAddons = "Small-kibble formula, Dental support enzymes";
  }

  // Good foods tailored to size/group
  let proteinsList = ["Chicken", "Turkey", "Beef"];
  if (group.toLowerCase() === 'hunter' || group.toLowerCase() === 'athlete') {
    proteinsList = ["Duck", "Salmon", "Venison", "Rabbit"];
  }

  // Portions based on size category
  let portionAmount = "400–600g cooked mix";
  if (sizeCategory.toLowerCase() === 'small' || sizeCategory.toLowerCase() === 'toy') portionAmount = "150–250g cooked mix";
  else if (sizeCategory.toLowerCase() === 'large' || sizeCategory.toLowerCase() === 'giant') portionAmount = "800–1200g cooked mix";

  return {
    breed: name,
    size: sizeCategory,
    nutrient_needs: {
      protein,
      fat,
      carbs,
      fiber,
      key_addons: keyAddons
    },
    good_foods: {
      proteins: proteinsList,
      carbs: ["Brown rice", "Sweet potato", "Oatmeal"],
      veggies: ["Green beans", "Carrots", "Pumpkin"],
      fruits: ["Blueberries", "Apple (no seeds)"],
      healthy_fats: ["Salmon oil", "Flaxseed oil"]
    },
    daily_portions: {
      adult: {
        meals_per_day: 2,
        amount: portionAmount,
        example: [`Morning: ${proteinsList[0]} & sweet potato`, `Evening: ${proteinsList[1] || proteinsList[0]} & green beans`]
      },
      puppy: {
        meals_per_day: sizeCategory.toLowerCase() === 'small' ? "4" : "3",
        note: sizeCategory.toLowerCase() === 'large' ? "Avoid rapid growth formulas to protect bones" : "High calorie intake to support fast metabolism"
      }
    },
    foods_to_avoid: ["Chocolate", "Grapes", "Onions", "Garlic", "Avocado", "Xylitol"],
    routine_care: {
      exercise: energy.toLowerCase() === 'high' ? "1.5–2 hours of high-intensity exercise" : "45–60 minutes of daily walking and play",
      brushing: "Weekly brushing is recommended to maintain a healthy coat",
      vet: sizeCategory.toLowerCase() === 'large' ? "Annual vet checks; check for cardiac and hip health" : "Annual vet checks; check knees and dental hygiene",
      deworm: "Every 4 months",
      good_kibble_brands: ["Orijen Fit & Trim", "Purina Pro Plan Sport", "Royal Canin Size Health"]
    },
    recipes: [
      {
        title: `${name} Active Nourishment Bowl`,
        ingredients: [proteinsList[0], "Sweet potato", "Pumpkin"],
        instructions: [`Thoroughly cook the ${proteinsList[0].toLowerCase()}.`, "Boil and mash the sweet potato and pumpkin.", "Mix all ingredients together and let cool before serving."]
      }
    ],
    notes: [
      `A deeply ${mainTrait.toLowerCase()} and ${secondTrait.toLowerCase()} breed.`,
      `Perfect companion for ${idealOwner.toLowerCase()} households.`,
      `Responds exceptionally well to positive reinforcement and routine structure.`
    ]
  };
}

// Generate realistic health profile for a breed
function generateHealthProfile(card) {
  const { name, image, temperament, energy, grooming, size, group } = card;
  const sizeCategory = size.split(' ')[0] || 'Medium';
  const traits = temperament.split(',').map(t => t.trim());
  const weightKg = parseWeightKg(size);

  let lifespan = '12–15 years';
  if (sizeCategory.toLowerCase().includes('large')) lifespan = '10–12 years';
  else if (sizeCategory.toLowerCase().includes('giant') || sizeCategory.toLowerCase().includes('xl')) lifespan = '8–10 years';

  // Common health issues tailored to size/group
  let commonHealthIssues = [];
  if (sizeCategory.toLowerCase() === 'small' || sizeCategory.toLowerCase() === 'toy') {
    commonHealthIssues = [
      {
        issue: "Luxating Patella",
        description: "Kneecaps that slip out of their normal anatomical position.",
        tip: "Keep them at an ideal weight and minimize jumps from tall sofas."
      },
      {
        issue: "Collapsed Trachea",
        description: "cartilage rings in the windpipe become weak or flattened.",
        tip: "Always walk them with a chest harness rather than a neck collar."
      },
      {
        issue: "Dental Crowding",
        description: "Tiny jaw structure causes teeth to crowd, accelerating decay.",
        tip: "Perform daily brushing and schedule professional cleanings annually."
      }
    ];
  } else if (sizeCategory.toLowerCase() === 'large' || sizeCategory.toLowerCase() === 'giant') {
    commonHealthIssues = [
      {
        issue: "Hip Dysplasia",
        description: "Malformation of the hip joint socket, leading to arthritis.",
        tip: "Provide orthopedic bedding and supplement their diet with Glucosamine."
      },
      {
        issue: "Bloat (GDV)",
        description: "Stomach fills with gas and twists, a life-threatening emergency.",
        tip: "Use slow-feeders and avoid strenuous exercise for 1 hour after meals."
      },
      {
        issue: "Elbow Dysplasia",
        description: "Abnormal joint development in the forelimbs causing limping.",
        tip: "Minimize impact jumping during their first 12-18 months of growth."
      }
    ];
  } else {
    commonHealthIssues = [
      {
        issue: "Hip Dysplasia",
        description: "Malformation of the hip joints causing early stiffness.",
        tip: "Maintain a lean body condition to minimize joint load."
      },
      {
        issue: "Ear Infections",
        description: "Floppy or folded ears trap moisture, inducing yeast/bacterial growth.",
        tip: "Check and dry ears thoroughly after swimming, wet walks, or baths."
      }
    ];
  }

  // Diet nutrients
  let dProtein = "24–28%";
  let dFat = "12–15%";
  if (energy.toLowerCase() === 'high' || energy.toLowerCase() === 'very high') {
    dProtein = "26–30%";
    dFat = "14–18%";
  }

  return {
    image,
    lifespan,
    weight: weightKg,
    nature: traits,
    common_health_issues: commonHealthIssues,
    preventive_care: {
      vaccinations: ["Rabies", "DHPP", "Bordetella", "Leptospirosis"],
      deworming: {
        puppies: "Every 2 weeks until 12 weeks",
        adults: "Every 4–6 months"
      },
      tick_flea_control: "Monthly oral or topical veterinarian preventative",
      spay_neuter: sizeCategory.toLowerCase() === 'large' ? "12–18 months" : "6–9 months",
      annual_vet_checks: sizeCategory.toLowerCase() === 'large' ? ["Hip assessment", "Cardiac screen", "Joint check"] : ["Dental check", "Knee patella check", "Ophthalmic exam"]
    },
    diet: {
      protein: dProtein,
      fat: dFat,
      carbs: "35–45%",
      fiber: "3–5%",
      good_foods: ["Turkey", "Salmon", "Sweet Potato", "Carrots", "Blueberries", "Pumpkin"],
      treats: "Freeze-dried liver cubes, carrot sticks",
      hydration: "Constant access to fresh, clean drinking water"
    },
    exercise: {
      daily_walks: energy.toLowerCase() === 'high' ? "60–95 minutes" : "35–45 minutes",
      play: ["Interactive fetching", "Scent tracking games", "Puzzle toys"],
      training: "Highly intelligent and responsive; requires patient, positive reinforcement"
    },
    grooming: {
      brushing: grooming.toLowerCase() === 'easy' ? "Weekly brushing" : "2–3 times per week to prevent matting",
      bathing: "Every 6–8 weeks",
      ear_cleaning: "Weekly check and clean",
      nail_clipping: "Monthly nail trim or grinding",
      dental_care: "3–5 times per week dental brushing"
    },
    wellbeing_tips: [
      `They are deeply devoted; do not leave them isolated from family activities.`,
      `Sufficient physical exercise and mental puzzles prevent anxiety and boredom.`,
      `Highly responsive to structural routine and clear, gentle guidelines.`
    ],
    golden_rule: `A majestic and noble soul—give them your heart, a clear daily routine, and a warm place in your family! 🐾✨`
  };
}

// Perform generation and update files
function run() {
  console.log('Generating missing food and health detailed data...');

  const breedCardsNames = breedCards.map(b => b.name);
  const existingFoodNames = Object.keys(existingFoodData);
  const existingHealthNames = Object.keys(existingHealthData);

  const missingFoodNames = breedCardsNames.filter(name => !existingFoodNames.includes(name));
  const missingHealthNames = breedCardsNames.filter(name => !existingHealthNames.includes(name));

  console.log(`Food Database: Missing ${missingFoodNames.length} breeds.`);
  console.log(`Health Database: Missing ${missingHealthNames.length} breeds.`);

  // 1. Rebuild and merge Food database
  const finalFoodData = { ...existingFoodData };
  for (const name of missingFoodNames) {
    const card = breedCards.find(c => c.name === name);
    if (card) {
      finalFoodData[name] = generateFoodProfile(card);
    }
  }

  const foodFilePath = path.join(__dirname, 'food.js');
  const foodHeader = `// app/data/food.js\n// Detailed breed food profiles generated dynamically. Preserves existing profiles intact.\n\nexport const breedFoodData = `;
  fs.writeFileSync(foodFilePath, `${foodHeader}${JSON.stringify(finalFoodData, null, 2)};\n`, 'utf-8');
  console.log(`Saved updated food data to ${foodFilePath}`);

  // 2. Rebuild and merge Health database
  const finalHealthData = { ...existingHealthData };
  for (const name of missingHealthNames) {
    const card = breedCards.find(c => c.name === name);
    if (card) {
      finalHealthData[name] = generateHealthProfile(card);
    }
  }

  const healthFilePath = path.join(__dirname, 'health.js');
  const healthHeader = `// app/data/health.js\n// Detailed breed health profiles generated dynamically. Preserves existing profiles intact.\n\nexport const healthData = `;
  fs.writeFileSync(healthFilePath, `${healthHeader}${JSON.stringify(finalHealthData, null, 2)};\n`, 'utf-8');
  console.log(`Saved updated health data to ${healthFilePath}`);

  console.log('Food and health data generation completed successfully!');
}

run();
