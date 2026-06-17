"use client";

import { useState, useEffect } from "react";
import { healthData } from "../data/health";
import { useSearchParams } from "next/navigation";
import {
  Heart,
  Activity,
  Sparkles,
  Search,
  X,
  ChevronDown,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Info,
  Calendar,
  DollarSign,
  Apple,
  Dumbbell,
  Lightbulb
} from "lucide-react";
import "./health.css";

// Icon mapping for care basics cards
const healthIconMap = {
  issues: Activity,
  preventive: Heart,
  diet: Apple,
  exercise: Dumbbell,
  grooming: Sparkles,
  wellbeing: Heart,
};

// ─── Section Pill ─────────────────────────────────────────────────────────────
function SectionPill({ icon: Icon, label }) {
  return (
    <div className="hg-section-pill">
      {Icon && <Icon size={12} className="hg-pill-icon" />}
      <span className="hg-pill-label">{label}</span>
    </div>
  );
}

// ─── Health Info Card ─────────────────────────────────────────────────────────
function HealthCard({ iconKey, title, desc }) {
  const IconComponent = healthIconMap[iconKey];
  return (
    <div className="hg-health-card">
      <div className="hg-health-icon-container">
        {IconComponent && <IconComponent size={24} className="hg-health-icon" />}
      </div>
      <h3 className="hg-health-title">{title}</h3>
      <p className="hg-health-desc">{desc}</p>
    </div>
  );
}

// ─── Collapsible Accordion ────────────────────────────────────────────────────
function AccordionBlock({ icon: Icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="hg-accordion-block">
      <button onClick={() => setOpen(o => !o)} className="hg-accordion-toggle">
        <span className="hg-accordion-toggle-left">
          {Icon && <Icon size={16} className="hg-accordion-icon" />}
          {title}
        </span>
        <ChevronDown size={14} className={`hg-accordion-chevron ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="hg-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

// Helper to determine age group label from URL query param
const getAgeGroup = age => {
  if (age === null || age === undefined) return null;
  return age < 1 ? "puppy" : "adult";
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HealthGuidePage() {
  const params = useSearchParams();
  const breedFromUrl = params.get("breed");
  const ageFromUrl = params.get("age");

  const [searchTerm, setSearchTerm] = useState(breedFromUrl || "");
  const [suggestions, setSuggestions] = useState([]);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);

  useEffect(() => {
    if (breedFromUrl) return;
    const dogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const activeId = localStorage.getItem("activeDogId");
    const activeDog = dogs.find(d => d.id === activeId);
    if (activeDog) {
      setSearchTerm(activeDog.breed);
      setAgeGroup(activeDog.age < 1 ? "puppy" : "adult");
      setAutoLoaded(true);
    }
  }, [breedFromUrl]);

  const allBreeds = Object.keys(healthData);

  const matchedBreeds = searchTerm.trim().length > 0
    ? allBreeds.filter(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const selectedBreed = matchedBreeds.length === 1 ? matchedBreeds[0] : null;
  const resolvedAge = ageFromUrl ? getAgeGroup(Number(ageFromUrl)) : ageGroup;

  return (
    <div className="hg-main-container">
      {/* ── HERO ── */}
      <header className="hg-hero-header">
        {/* Dot texture */}
        <svg className="hg-dot-texture">
          <defs>
            <pattern id="dots-hg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-hg)" />
        </svg>
        <div className="hg-hero-radial-glow" />

        <div className="fg-fade hg-hero-content-wrapper">
          <div className="hg-hero-inner">
            <img
              src="/assets/puppy.png"
              alt="Puppy"
              className="hg-hero-image"
            />
            <div className="hg-hero-text-block">
              <SectionPill icon={Activity} label="Health Guide" />
              <h1 className="hg-hero-title">
                Keep your dog<br />
                <span className="hg-hero-title-italic">healthy & thriving.</span>
              </h1>
              <p className="hg-hero-subtitle">
                Because every wag deserves a little more care. Search your breed for personalised health insights.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEARCH SECTION ── */}
      <section className="hg-search-section">
        <div className="hg-search-container">

          <div className="fg-fade hg-search-bar-section">
            <SectionPill icon={Search} label="Breed Search" />
            <h2 className="hg-search-title">
              Find health tips by breed
            </h2>
            <div className="hg-search-input-wrapper">
              <Search size={16} className="hg-search-input-icon" />
              <img src="/assets/download-removebg-preview.png" alt="Peeking Puppies" className="puppy-top" />
              <input
                className="hg-input"
                type="text"
                placeholder="e.g. Golden Retriever, Beagle…"
                value={searchTerm}
                onChange={e => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  setAutoLoaded(false);
                  const m = allBreeds.filter(b => b.toLowerCase().includes(val.toLowerCase()));
                  setSuggestions(val && m.length > 1 ? m.slice(0, 4) : []);
                }}
              />
              {suggestions.length > 0 && (
                <div className="hg-suggest-box">
                  {suggestions.map((name, i) => (
                    <p key={i} className="hg-suggest-item" onClick={() => { setSearchTerm(name); setSuggestions([]); }}>
                      <Search size={12} className="hg-suggest-icon" /> {name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RESULT CARD ── */}
          <div className="hg-result-card-container">
            {!selectedBreed ? (
              <div className="hg-empty-state">
                <div className="hg-empty-icon-wrapper">
                  <Search size={32} className="hg-empty-icon" />
                </div>
                <h3 className="hg-empty-title">
                  {searchTerm && matchedBreeds.length === 0 ? "No breed matched" : searchTerm && matchedBreeds.length > 1 ? "Keep typing…" : "Start searching"}
                </h3>
                <p className="hg-empty-desc">
                  {searchTerm && matchedBreeds.length === 0
                    ? `No results for "${searchTerm}". Try a different spelling.`
                    : searchTerm && matchedBreeds.length > 1
                      ? "✨ Narrow it down to see the health guide."
                      : "Type a breed name above to see their personalised health guide."}
                </p>
              </div>
            ) : (
              <div className="fg-fade">
                {/* Result header */}
                <div className="hg-result-header">
                  <div>
                    <h2 className="hg-result-breed-title">
                      {selectedBreed}
                    </h2>
                    <div className="hg-tag-group">
                      {autoLoaded && (
                        <span className="hg-tag">
                          <Heart size={12} className="hg-tag-icon" /> Your dog
                        </span>
                      )}
                      {resolvedAge && (
                        <span className="hg-tag">
                          {resolvedAge === "puppy" ? (
                            <Sparkles size={12} className="hg-tag-icon" />
                          ) : (
                            <Activity size={12} className="hg-tag-icon" />
                          )}
                          {resolvedAge === "puppy" ? "Puppy" : "Adult"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setSearchTerm(""); setSuggestions([]); setAutoLoaded(false); }}
                    className="hg-clear-btn"
                  >
                    <X size={12} className="hg-clear-icon" /> Clear
                  </button>
                </div>

                {/* Result body */}
                <div className="hg-result-body">
                  <BreedHealthCard
                    name={selectedBreed}
                    data={healthData[selectedBreed]}
                    ageGroup={resolvedAge}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── GENERAL HEALTH CARDS ── */}
      <section className="hg-general-health-section">
        <div className="hg-general-health-container">
          <div className="fg-fade hg-general-health-header">
            <SectionPill icon={Lightbulb} label="Care Basics" />
            <h2 className="hg-general-health-title">
              What every dog owner should know
            </h2>
          </div>
          <div className="hg-grid">
            {[
              { iconKey: "issues", title: "Common Health Issues", desc: "Dogs can face joint problems, skin allergies, obesity, ear infections, or dental disease. Early detection saves lives." },
              { iconKey: "preventive", title: "Preventive Care", desc: "Vaccinations, deworming, flea & tick control and yearly vet checkups keep your dog protected year-round." },
              { iconKey: "diet", title: "Diet", desc: "Feed balanced meals, avoid overfeeding, and always keep fresh water available. Nutrition is the foundation of health." },
              { iconKey: "exercise", title: "Exercise", desc: "Walks, playtime and mental stimulation help maintain ideal fitness, reduce anxiety, and boost mood." },
              { iconKey: "grooming", title: "Grooming", desc: "Brushing, bathing, teeth cleaning and ear checks keep dogs fresh, comfortable, and free from infections." },
              { iconKey: "wellbeing", title: "Wellbeing", desc: "Dogs thrive on affection, consistent training, bonding time and social play. A happy dog is a healthy dog." },
            ].map(c => <HealthCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Breed Health Card ────────────────────────────────────────────────────────
function BreedHealthCard({ name, data, ageGroup }) {
  return (
    <div>
      {/* Disclaimer */}
      <div className="hg-allergy-banner hg-disclaimer-banner">
        <ShieldAlert size={16} className="hg-allergy-icon" />
        <span><strong>Educational only</strong> — not a replacement for veterinary advice.</span>
      </div>

      {/* Stats */}
      <div className="hg-stats-group">
        <div className="hg-stat-card">
          <div className="hg-stat-val">{data.lifespan}</div>
          <div className="hg-stat-lbl">Lifespan</div>
        </div>
        <div className="hg-stat-card">
          <div className="hg-stat-val">{data.weight}</div>
          <div className="hg-stat-lbl">Weight</div>
        </div>
      </div>

      {/* Age warnings */}
      {ageGroup && data.age_warnings?.[ageGroup] && (
        <div className="hg-allergy-banner hg-warning-banner">
          <AlertTriangle size={16} className="hg-warning-icon" />
          <div>
            <strong>{ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)} Warnings</strong>
            <ul className="hg-warning-list">
              {data.age_warnings[ageGroup].map((warn, i) => (
                <li key={i} className="hg-li">• {warn}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Daily care plan */}
      {ageGroup && data.daily_care_plan?.[ageGroup] && (
        <>
          <p className="hg-h3">Daily Care Plan</p>
          <div className="hg-card-panel">
            <p className="hg-portion-subtitle">
              {ageGroup === "puppy" ? <Sparkles size={13} className="hg-tag-icon" /> : <Activity size={13} className="hg-tag-icon" />}
              {ageGroup === "puppy" ? " Puppy" : " Adult"}
            </p>
            <p className="hg-li"><strong className="hg-li-strong">Meals:</strong> {data.daily_care_plan[ageGroup].meals}</p>
            <p className="hg-li"><strong className="hg-li-strong">Exercise:</strong> {data.daily_care_plan[ageGroup].exercise}</p>
            <p className="hg-li"><strong className="hg-li-strong">Grooming:</strong> {data.daily_care_plan[ageGroup].grooming}</p>
            <p className="hg-li"><strong className="hg-li-strong">Notes:</strong> {data.daily_care_plan[ageGroup].notes}</p>
          </div>
        </>
      )}

      {/* Nature */}
      <p className="hg-h3">Temperament</p>
      <div className="hg-tag-group">
        {data.nature.map((trait, i) => (
          <span key={i} className="hg-tag">{trait}</span>
        ))}
      </div>

      {/* Health Issues */}
      <p className="hg-h3">Common Health Concerns</p>
      {data.common_health_issues.map((issue, i) => (
        <AccordionBlock key={i} icon={AlertTriangle} title={issue.issue}>
          <p className="hg-li hg-accordion-p">{issue.description}</p>
          <p className="hg-prevention-tip">
            <Info size={12} className="hg-tip-icon" /> Prevention tip: {issue.tip}
          </p>
        </AccordionBlock>
      ))}

      {/* Preventive Care */}
      <p className="hg-h3">Preventive Care</p>
      <div className="hg-card-panel">
        <p className="hg-h4">Vaccines</p>
        <p className="hg-li">{data.preventive_care.vaccinations.join(", ")}</p>
        <p className="hg-h4">Deworming</p>
        <p className="hg-li"><strong className="hg-li-strong">Puppies:</strong> {data.preventive_care.deworming.puppies}</p>
        <p className="hg-li"><strong className="hg-li-strong">Adults:</strong> {data.preventive_care.deworming.adults}</p>
        <p className="hg-h4">Tick & Flea Control</p>
        <p className="hg-li">{data.preventive_care.tick_flea_control}</p>
        <p className="hg-h4">Spay / Neuter</p>
        <p className="hg-li">{data.preventive_care.spay_neuter}</p>
        <p className="hg-h4">Annual Vet Checks</p>
        <p className="hg-li">{data.preventive_care.annual_vet_checks.join(", ")}</p>
      </div>

      {/* Diet */}
      <p className="hg-h3">Diet</p>
      <AccordionBlock icon={Apple} title="Nutritional breakdown">
        <p className="hg-h4 hg-accordion-sub">Macros</p>
        <p className="hg-li"><strong className="hg-li-strong">Protein:</strong> {data.diet.protein}</p>
        <p className="hg-li"><strong className="hg-li-strong">Fat:</strong> {data.diet.fat}</p>
        <p className="hg-li"><strong className="hg-li-strong">Carbs:</strong> {data.diet.carbs}</p>
        <p className="hg-li"><strong className="hg-li-strong">Fiber:</strong> {data.diet.fiber}</p>
        <p className="hg-h4">Good Foods</p>
        <div className="hg-tag-group">
          {data.diet.good_foods.map((f, i) => <span key={i} className="hg-tag">{f}</span>)}
        </div>
        <p className="hg-h4">Treats</p>
        <p className="hg-li">{data.diet.treats}</p>
        <p className="hg-h4">Hydration</p>
        <p className="hg-li">{data.diet.hydration}</p>
      </AccordionBlock>

      {/* Exercise */}
      <p className="hg-h3">Exercise</p>
      <div className="hg-card-panel">
        <p className="hg-li"><strong className="hg-li-strong">Daily Walks:</strong> {data.exercise.daily_walks}</p>
        <p className="hg-li"><strong className="hg-li-strong">Play:</strong> {data.exercise.play.join(", ")}</p>
        <p className="hg-li"><strong className="hg-li-strong">Training:</strong> {data.exercise.training}</p>
      </div>

      {/* Grooming */}
      <p className="hg-h3">Grooming</p>
      <div className="hg-card-panel">
        <p className="hg-li"><strong className="hg-li-strong">Brushing:</strong> {data.grooming.brushing}</p>
        <p className="hg-li"><strong className="hg-li-strong">Bathing:</strong> {data.grooming.bathing}</p>
        <p className="hg-li"><strong className="hg-li-strong">Ears:</strong> {data.grooming.ear_cleaning}</p>
        <p className="hg-li"><strong className="hg-li-strong">Nails:</strong> {data.grooming.nail_clipping}</p>
        <p className="hg-li"><strong className="hg-li-strong">Dental:</strong> {data.grooming.dental_care}</p>
      </div>

      {/* Wellbeing Tips */}
      <p className="hg-h3">Wellbeing Tips</p>
      <div className="hg-notes-list">
        {data.wellbeing_tips.map((tip, i) => (
          <p key={i} className="hg-li">• {tip}</p>
        ))}
      </div>

      {/* Golden Rule */}
      <p className="hg-h3">Golden Rule</p>
      <div className="hg-golden-rule-box">
        <p className="hg-golden-rule-text">"{data.golden_rule}"</p>
      </div>

      <p className="hg-disclaimer-text">
        <ShieldAlert size={12} className="hg-disclaimer-icon" /> Always consult a vet before making changes to your dog's care routine.
      </p>
    </div>
  );
}
