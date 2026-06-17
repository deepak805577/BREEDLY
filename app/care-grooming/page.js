"use client";

import { useEffect, useState } from "react";
import { breedGroomingAndCare } from "../data/care";
import { supabase } from "@/lib/supabase";
import {
  Scissors,
  Search,
  X,
  ChevronDown,
  BookOpen,
  Heart,
  Sparkles,
  Activity,
  Scale,
  DollarSign,
  Info,
  ShieldAlert,
  Wrench,
  Calendar,
  Lightbulb,
  Sun,
  Bath
} from "lucide-react";
import "./care-grooming.css";

// Icon mapping for grooming basics cards
const careIconMap = {
  bathing: Bath,
  brushing: Sparkles,
  trimming: Scissors,
  dental: Heart,
  paw: Sparkles,
  ears: Activity,
};

// ─── Section Pill ─────────────────────────────────────────────────────────────
function SectionPill({ icon: Icon, label }) {
  return (
    <div className="cg-section-pill">
      {Icon && <Icon size={12} className="cg-pill-icon" />}
      <span className="cg-pill-label">{label}</span>
    </div>
  );
}

// ─── Care Info Card ───────────────────────────────────────────────────────────
function CareCard({ iconKey, title, desc }) {
  const IconComponent = careIconMap[iconKey];
  return (
    <div className="cg-care-card">
      <div className="cg-care-icon-container">
        {IconComponent && <IconComponent size={24} className="cg-care-icon" />}
      </div>
      <h3 className="cg-care-title">{title}</h3>
      <p className="cg-care-desc">{desc}</p>
    </div>
  );
}

// ─── Collapsible Accordion ────────────────────────────────────────────────────
function AccordionBlock({ icon: Icon, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cg-accordion-block">
      <button onClick={() => setOpen(o => !o)} className="cg-accordion-toggle">
        <span className="cg-accordion-toggle-left">
          {Icon && <Icon size={16} className="cg-accordion-icon" />}
          {title}
        </span>
        <ChevronDown size={14} className={`cg-accordion-chevron ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="cg-accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareGroomingGuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [dogWeight, setDogWeight] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadDogFromSupabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: dogs, error } = await supabase
          .from("dogs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error || !dogs || dogs.length === 0) return;

        const dog = dogs[0];
        setSearchTerm(dog.breed || "");
        setAgeGroup(dog.age < 1 ? "puppy" : "adult");
        setDogWeight(dog.weight || null);
        setAutoLoaded(true);
      } catch (err) {
        console.error("Error loading dog from Supabase:", err);
      }
    };

    loadDogFromSupabase();
  }, []);

  const breeds = Object.keys(breedGroomingAndCare);
  const matchedBreed = searchTerm
    ? breeds.find(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;
  const breedData = matchedBreed ? breedGroomingAndCare[matchedBreed] : null;

  return (
    <div className="cg-main-container">
      {/* ── HERO ── */}
      <header className="cg-hero-header">
        <svg className="cg-dot-texture">
          <defs>
            <pattern id="dots-cg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-cg)" />
        </svg>
        <div className="cg-hero-radial-glow" />

        <div className="fg-fade cg-hero-content-wrapper">
          <div className="cg-hero-inner">
            <img
              src="/assets/puppy.png"
              alt="Puppy"
              className="cg-hero-image"
            />
            <div className="cg-hero-text-block">
              <SectionPill icon={Scissors} label="Care & Grooming Guide" />
              <h1 className="cg-hero-title">
                Groom your dog<br />
                <span className="cg-hero-title-italic">the right way.</span>
              </h1>
              <p className="cg-hero-subtitle">
                Healthy coat, clean paws & a happy pup. Search your breed for a personalised grooming routine.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEARCH SECTION ── */}
      <section className="cg-search-section">
        <div className="cg-search-container">

          <div className="fg-fade cg-search-bar-section">
            <SectionPill icon={Search} label="Breed Search" />
            <h2 className="cg-search-title">
              Find grooming tips by breed
            </h2>
            <div className="cg-search-input-wrapper">
              <Search size={16} className="cg-search-input-icon" />
              <img src="/assets/download-removebg-preview.png" alt="Peeking Puppies" className="puppy-top" />
              <input
                className="cg-input"
                type="text"
                placeholder="e.g. Golden Retriever, Beagle…"
                value={searchTerm}
                onChange={e => {
                  const val = e.target.value;
                  setSearchTerm(val);
                  setAutoLoaded(false);
                  const m = breeds.filter(b => b.toLowerCase().includes(val.toLowerCase()));
                  setSuggestions(val && m.length > 1 ? m.slice(0, 4) : []);
                }}
              />
              {suggestions.length > 0 && (
                <div className="cg-suggest-box">
                  {suggestions.map((name, i) => (
                    <p key={i} className="cg-suggest-item" onClick={() => { setSearchTerm(name); setSuggestions([]); }}>
                      <Search size={12} className="cg-suggest-icon" /> {name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RESULT CARD ── */}
          <div className="cg-result-card-container">
            {!matchedBreed ? (
              <div className="cg-empty-state">
                <div className="cg-empty-icon-wrapper">
                  <Scissors size={32} className="cg-empty-icon" />
                </div>
                <h3 className="cg-empty-title">
                  {searchTerm ? "No breed matched" : "Start searching"}
                </h3>
                <p className="cg-empty-desc">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different spelling.`
                    : "Type a breed name above to see their personalised grooming guide."}
                </p>
              </div>
            ) : (
              <div className="fg-fade">
                {/* Result header */}
                <div className="cg-result-header">
                  <div>
                    <h2 className="cg-result-breed-title">
                      {matchedBreed}
                    </h2>
                    <div className="cg-tag-group">
                      {autoLoaded && (
                        <span className="cg-tag">
                          <Heart size={12} className="cg-tag-icon" /> Your dog
                        </span>
                      )}
                      {ageGroup && (
                        <span className="cg-tag">
                          {ageGroup === "puppy" ? (
                            <Sparkles size={12} className="cg-tag-icon" />
                          ) : (
                            <Activity size={12} className="cg-tag-icon" />
                          )}
                          {ageGroup === "puppy" ? "Puppy" : "Adult"}
                        </span>
                      )}
                      {dogWeight && (
                        <span className="cg-tag">
                          <Scale size={12} className="cg-tag-icon" /> {dogWeight} kg
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setSearchTerm(""); setAutoLoaded(false); setSuggestions([]); }}
                    className="cg-clear-btn"
                  >
                    <X size={12} className="cg-clear-icon" /> Clear
                  </button>
                </div>

                {/* Result body */}
                <div className="cg-result-body">
                  <BreedCareCard data={breedData} ageGroup={ageGroup} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── QUICK CARE CARDS ── */}
      <section className="cg-quick-care-section">
        <div className="cg-quick-care-container">
          <div className="fg-fade cg-quick-care-header">
            <SectionPill icon={Sparkles} label="Grooming Basics" />
            <h2 className="cg-quick-care-title">
              What every dog owner should know
            </h2>
          </div>
          <div className="cg-grid">
            {[
              { iconKey: "bathing", title: "Bathing", desc: "Use dog-safe shampoo. Avoid overbathing — it strips natural oils. Most breeds need a bath every 4–6 weeks." },
              { iconKey: "brushing", title: "Brushing", desc: "Regular brushing reduces shedding, prevents matting, and keeps the coat shiny and healthy all year round." },
              { iconKey: "trimming", title: "Trimming", desc: "Keep paw fur, face hair, and ear fringes neat and hygienic. Use rounded-tip scissors for safety around sensitive areas." },
              { iconKey: "dental", title: "Dental Care", desc: "Brush your dog's teeth 2–3 times a week to prevent gum disease, tooth decay and bad breath." },
              { iconKey: "paw", title: "Paw Care", desc: "Inspect and moisturise paw pads regularly. Protect from extreme heat, cold and rough surfaces on walks." },
              { iconKey: "ears", title: "Clean Ears", desc: "Check and gently clean ears weekly. Build-up of wax and moisture can lead to painful infections." },
            ].map(c => <CareCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Breed Care Card ──────────────────────────────────────────────────────────
function BreedCareCard({ data, ageGroup }) {
  if (!data) return null;

  return (
    <div>
      {/* Overview */}
      {data.overview && (
        <>
          <p className="cg-h3">Overview</p>
          <div className="cg-card-panel">
            {Object.entries(data.overview).map(([key, value]) => (
              <p key={key} className="cg-li">
                <strong className="cg-li-strong">{key.replace(/_/g, " ")}:</strong> {value}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Grooming */}
      {data.grooming && (
        <>
          <p className="cg-h3">Grooming</p>
          {Object.entries(data.grooming).map(([key, value]) => (
            <AccordionBlock key={key} icon={Bath} title={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}>
              <p className="cg-li cg-accordion-p">
                {typeof value === "object"
                  ? `${value.frequency || ""} ${value.purpose || value.notes || value.tips || ""}`.trim()
                  : value}
              </p>
            </AccordionBlock>
          ))}

          {data.grooming_tools && (
            <>
              <p className="cg-h3">Grooming Tools</p>
              <div className="cg-tag-group">
                {data.grooming_tools.map((tool, i) => (
                  <span key={i} className="cg-tag">
                    <Wrench size={12} className="cg-tag-icon" /> {tool}
                  </span>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Routine Care */}
      {data.routine_care && (
        <>
          <p className="cg-h3">Routine Care</p>
          <div className="cg-card-panel">
            <p className="cg-li"><strong className="cg-li-strong">Exercise:</strong> {data.routine_care.exercise}</p>
            <p className="cg-li"><strong className="cg-li-strong">Grooming Time:</strong> {data.routine_care.grooming_time}</p>
            <p className="cg-li"><strong className="cg-li-strong">Professional Grooming:</strong> {data.routine_care.professional_grooming}</p>
          </div>

          {data.routine_care.daily_upkeep && (
            <AccordionBlock icon={Calendar} title="Daily Upkeep">
              <ul className="cg-accordion-list">
                {data.routine_care.daily_upkeep.map((item, i) => (
                  <li key={i} className="cg-li">• {item}</li>
                ))}
              </ul>
            </AccordionBlock>
          )}

          {data.routine_care.tips && (
            <AccordionBlock icon={Lightbulb} title="Tips">
              <ul className="cg-accordion-list">
                {data.routine_care.tips.map((tip, i) => (
                  <li key={i} className="cg-li">• {tip}</li>
                ))}
              </ul>
            </AccordionBlock>
          )}
        </>
      )}

      {/* Seasonal Care */}
      {data.seasonal_care && (
        <>
          <p className="cg-h3">Seasonal Care</p>
          {Object.entries(data.seasonal_care).map(([season, tips]) => (
            <AccordionBlock key={season} icon={Sun} title={season.charAt(0).toUpperCase() + season.slice(1)}>
              <ul className="cg-accordion-list">
                {tips.map((tip, i) => (
                  <li key={i} className="cg-li">• {tip}</li>
                ))}
              </ul>
            </AccordionBlock>
          ))}
        </>
      )}

      {/* Cost Estimate */}
      {data.cost_estimate && (
        <>
          <p className="cg-h3">Grooming Cost Estimate</p>
          <div className="cg-cost-estimate-box">
            <p className="cg-cost-title">
              <DollarSign size={16} className="cg-cost-icon" />
              Monthly & Yearly Breakdown
            </p>
            <p className="cg-li"><strong className="cg-li-strong">Monthly:</strong> {data.cost_estimate.monthly}</p>
            <p className="cg-li"><strong className="cg-li-strong">Yearly:</strong> {data.cost_estimate.yearly}</p>
            {data.cost_estimate.includes && (
              <>
                <p className="cg-h4">Includes</p>
                <div className="cg-tag-group">
                  {data.cost_estimate.includes.map((item, i) => (
                    <span key={i} className="cg-tag">{item}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <p className="cg-disclaimer-text">
        <ShieldAlert size={12} className="cg-disclaimer-icon" /> Costs are approximate. Always consult a professional groomer for breed-specific advice.
      </p>
    </div>
  );
}
