"use client";
import { useMemo } from "react";
import { breedCards } from "@/app/data/breed";

const BREED_MAP = Object.fromEntries(breedCards.map((b) => [b.name.toLowerCase(), b]));
const getBreedCard = (n) => n ? BREED_MAP[n.toLowerCase()] || null : null;

// ─── INSIGHT ENGINE ────────────────────────────────────────────────────────
function generateInsights(dog) {
  const breedCard = getBreedCard(dog.breed);
  const age = dog.age || 0;
  const weight = dog.weight || 0;
  const breed = dog.breed || "Unknown";
  const insights = [];

  // Life stage insights
  if (age < 0.5) {
    insights.push({
      type: "puppy",
      priority: "high",
      title: "Critical Socialization Window",
      text: `${breed} puppies between 3-14 weeks need exposure to new people, sounds, and environments. This window closes fast — prioritize socialization outings.`,
      action: "Schedule a socialization outing this week",
    });
  } else if (age < 1) {
    insights.push({
      type: "puppy",
      priority: "medium",
      title: "Growth Phase Nutrition",
      text: `At ${Math.round(age * 12)} months, ${dog.name} is still growing. Puppy-formulated food with DHA for brain development is essential until 12-18 months.`,
      action: "Ensure puppy-grade food is being used",
    });
  } else if (age >= 7 && age < 10) {
    insights.push({
      type: "senior",
      priority: "medium",
      title: "Entering Senior Years",
      text: `At ${age} years, ${dog.name} is transitioning to senior care. Consider bi-annual vet checkups instead of annual, and monitor for mobility changes.`,
      action: "Schedule a senior wellness exam",
    });
  } else if (age >= 10) {
    insights.push({
      type: "senior",
      priority: "high",
      title: "Senior Joint Support Recommended",
      text: `Senior dogs over 10 benefit greatly from glucosamine/chondroitin supplements and orthopedic bedding. Watch for signs of arthritis or cognitive decline.`,
      action: "Add joint supplement to daily routine",
    });
  }

  // Weight insights
  if (breedCard) {
    const sizeStr = breedCard.size || "";
    const match = sizeStr.match(/\(([0-9.]+)[–\-]?([0-9.]+)?\s*lbs?\)/i);
    if (match && weight > 0) {
      const minKg = parseFloat(match[1]) * 0.453592;
      const maxKg = parseFloat(match[2] || match[1]) * 0.453592;
      if (weight > maxKg * 1.15) {
        insights.push({
          type: "weight",
          priority: "high",
          title: "Above Ideal Weight Range",
          text: `${dog.name} weighs ${weight} kg but the ideal range for ${breed} is ${Math.round(minKg)}–${Math.round(maxKg)} kg. Excess weight increases risk of joint problems, diabetes, and heart disease.`,
          action: "Reduce portion by 10% and increase exercise",
        });
      } else if (weight < minKg * 0.85) {
        insights.push({
          type: "weight",
          priority: "medium",
          title: "Below Ideal Weight Range",
          text: `${dog.name} weighs ${weight} kg, which is below the typical ${Math.round(minKg)}–${Math.round(maxKg)} kg range for ${breed}. This could indicate nutritional deficiency or an underlying health issue.`,
          action: "Consult your vet about calorie intake",
        });
      }
    }

    // Breed-specific insights
    const energy = (breedCard.energy || "").toLowerCase();
    if (energy === "high") {
      insights.push({
        type: "exercise",
        priority: "medium",
        title: `High Energy Breed — ${breed}`,
        text: `${breed} dogs need 60+ minutes of vigorous exercise daily. Under-exercised high-energy breeds often develop destructive behaviors, anxiety, and excessive barking.`,
        action: "Ensure daily vigorous exercise (run, fetch, agility)",
      });
    }

    const grooming = (breedCard.grooming || "").toLowerCase();
    if (grooming === "busy") {
      insights.push({
        type: "grooming",
        priority: "medium",
        title: `High-Maintenance Coat — ${breed}`,
        text: `${breed} requires daily brushing to prevent matting and regular professional grooming every 4-6 weeks. Neglected coats can lead to skin infections.`,
        action: "Book professional grooming appointment",
      });
    }

    // Health predispositions
    const healthIssues = breedCard.healthIssues || breedCard.health || "";
    if (typeof healthIssues === "string" && healthIssues.toLowerCase().includes("hip")) {
      insights.push({
        type: "health",
        priority: "low",
        title: "Hip Dysplasia Risk",
        text: `${breed} is predisposed to hip dysplasia. Maintaining ideal weight, moderate low-impact exercise, and omega-3 fatty acids can help reduce risk.`,
        action: "Add fish oil supplement to meals",
      });
    }
  }

  // Dental care (universal)
  if (age >= 2) {
    insights.push({
      type: "health",
      priority: "low",
      title: "Dental Health Check",
      text: `By age 3, 80% of dogs show signs of dental disease. Regular brushing (3x/week) and dental chews significantly reduce plaque buildup and prevent gum infections.`,
      action: "Brush teeth or provide dental chew today",
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return insights.slice(0, 4); // Max 4 insights
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const INSIGHT_STYLES = `
  .si-container {
    margin-bottom: 20px; font-family: 'DM Sans', sans-serif;
  }
  .si-title {
    font-family: 'Fraunces', serif; font-size: 1rem; color: #7F5539;
    margin: 0 0 14px 0; display: flex; align-items: center; gap: 8px;
  }
  .si-list { display: flex; flex-direction: column; gap: 12px; }
  .si-card {
    background: #FFFFFF; border-radius: 18px; padding: 18px 20px;
    border: 1px solid rgba(0,0,0,0.03);
    box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    display: flex; gap: 14px; align-items: flex-start;
    transition: all 0.2s;
  }
  .si-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.05); }
  .si-icon {
    width: 36px; height: 36px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .si-icon.high { background: #FFF0F0; }
  .si-icon.medium { background: #FFF6ED; }
  .si-icon.low { background: #F0F5EC; }
  .si-body { flex: 1; min-width: 0; }
  .si-card-title {
    font-size: 0.86rem; font-weight: 700; color: #3E3E3E;
    margin-bottom: 4px;
  }
  .si-card-text {
    font-size: 0.78rem; color: #777; line-height: 1.5; margin-bottom: 8px;
  }
  .si-action {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.72rem; font-weight: 600; color: #B08968;
    padding: 5px 12px; border-radius: 10px;
    background: #FFF9F4; border: 1px solid rgba(176,137,104,0.12);
  }
  .si-priority {
    font-size: 0.6rem; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; padding: 2px 8px; border-radius: 8px;
    margin-left: auto; flex-shrink: 0;
  }
  .si-priority.high { background: #FFF0F0; color: #b85c5c; }
  .si-priority.medium { background: #FFF6ED; color: #B08968; }
  .si-priority.low { background: #F0F5EC; color: #587B45; }

  @media (max-width: 640px) {
    .si-card { padding: 16px; }
    .si-icon { width: 32px; height: 32px; font-size: 0.9rem; border-radius: 10px; }
  }
`;

// ─── ICON MAPPING ──────────────────────────────────────────────────────────
const typeIcons = {
  puppy: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c2 0 4 2 4 5s-2 5-4 5-4-2-4-5 2-5 4-5z"/><circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="5" cy="14" r="2"/><circle cx="19" cy="14" r="2"/></svg>,
  senior: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  weight: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  exercise: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  grooming: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v20M18 2v20M12 2v20"/></svg>,
  health: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>,
  dental: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v16M8 8l8 8M16 8l-8 8"/></svg>
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function SmartInsights({ dog }) {
  const insights = useMemo(() => generateInsights(dog), [dog]);

  if (insights.length === 0) return null;

  return (
    <>
      <style>{INSIGHT_STYLES}</style>
      <div className="si-container">
        <h3 className="si-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B08968" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Smart Insights for {dog.name}
        </h3>
        <div className="si-list">
          {insights.map((ins, i) => (
            <div key={i} className="si-card">
              <div className={`si-icon ${ins.priority}`}>
                {typeIcons[ins.type] || <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>}
              </div>
              <div className="si-body">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div className="si-card-title">{ins.title}</div>
                  <span className={`si-priority ${ins.priority}`}>{ins.priority}</span>
                </div>
                <p className="si-card-text">{ins.text}</p>
                <div className="si-action">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  {ins.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
