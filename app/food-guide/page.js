"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { breedFoodData } from "../data/food";
import { supabase } from "@/lib/supabase";
import {
  Utensils,
  Search,
  X,
  AlertTriangle,
  Scale,
  Dumbbell,
  Flame,
  BookOpen,
  Sparkles,
  Heart,
  Droplets,
  DollarSign,
  ChevronDown,
  Ban,
  Apple,
  Info,
  ShieldAlert,
  Activity,
  Feather
} from "lucide-react";
import "./food.css";

// Icon mapping for nutrition cards
const iconMap = {
  protein: Flame,
  balanced_diet: Heart,
  foods_to_avoid: Ban,
  healthy_treats: Apple,
  hydration: Droplets,
  portion_control: Scale,
};

// ─── Section pill ─────────────────────────────────────────────────────────────
function SectionPill({ icon: Icon, label }) {
  return (
    <div className="fg-section-pill">
      {Icon && <Icon size={12} className="fg-pill-icon" />}
      <span className="fg-pill-label">{label}</span>
    </div>
  );
}

// ─── Nutrition card ───────────────────────────────────────────────────────────
function NutriCard({ iconKey, title, desc }) {
  const IconComponent = iconMap[iconKey];
  return (
    <div className="fg-nutri-card">
      <div className="fg-nutri-icon-container">
        {IconComponent && <IconComponent size={24} className="fg-nutri-icon" />}
      </div>
      <h3 className="fg-nutri-title">{title}</h3>
      <p className="fg-nutri-desc">{desc}</p>
    </div>
  );
}

// ─── Collapsible recipe ───────────────────────────────────────────────────────
function RecipeBlock({ recipe }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fg-recipe-block">
      <button onClick={() => setOpen(o => !o)} className="fg-recipe-toggle">
        <span className="fg-recipe-toggle-left">
          <BookOpen size={16} className="fg-recipe-icon" />
          {recipe.title}
        </span>
        <ChevronDown size={14} className={`fg-recipe-chevron ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="fg-recipe-content">
          <p className="fg-recipe-section-title">Ingredients</p>
          <ul className="fg-recipe-list">
            {recipe.ingredients.map((ing, j) => (
              <li key={j} className="fg-recipe-item">{ing}</li>
            ))}
          </ul>
          <p className="fg-recipe-section-title">Instructions</p>
          <ol className="fg-recipe-ordered-list">
            {recipe.instructions.map((step, j) => (
              <li key={j} className="fg-recipe-ordered-item">{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function FoodGuideContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageGroup, setAgeGroup] = useState(null);
  const [dogAllergies, setDogAllergies] = useState([]);
  const [dogWeight, setDogWeight] = useState(null);
  const [autoLoaded, setAutoLoaded] = useState(false);

  const searchParams = useSearchParams();
  const dogId = searchParams.get("dogId");

  useEffect(() => {
    const loadDogFromSupabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let query = supabase.from("dogs").select("*").eq("user_id", user.id);

        if (dogId) {
          query = query.eq("id", dogId);
        } else {
          query = query.order("created_at", { ascending: false }).limit(1);
        }

        const { data: dogs, error } = await query;

        if (error || !dogs || dogs.length === 0) return;

        const dog = dogs[0];
        setSearchTerm(dog.breed || "");
        setAgeGroup(dog.age < 1 ? "puppy" : "adult");
        setDogWeight(dog.weight || null);
        setAutoLoaded(true);

        if (dog.allergies) {
          setDogAllergies(dog.allergies.split(",").map(a => a.trim().toLowerCase()));
        }
      } catch (err) {
        console.error("Error loading dog from Supabase:", err);
      }
    };

    loadDogFromSupabase();
  }, [dogId]);

  const breeds = Object.keys(breedFoodData);
  const matchedBreed = searchTerm
    ? breeds.find(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;

  const getWeightNote = w => {
    if (!w) return null;
    if (w < 5) return { type: "small", text: "Small dog — feed slightly smaller portions" };
    if (w <= 20) return { type: "medium", text: "Medium-sized dog — standard portions apply" };
    return { type: "large", text: "Large dog — may require higher protein & quantity" };
  };

  const estimateMonthlyCost = w => {
    if (!w) return null;
    if (w < 5) return { food: "6–8 kg / month", cost: "₹1,500 – ₹2,500", note: "Small breeds eat less but need quality nutrition" };
    if (w <= 20) return { food: "10–14 kg / month", cost: "₹2,500 – ₹4,000", note: "Balanced diet with controlled portions" };
    return { food: "18–25 kg / month", cost: "₹4,000 – ₹6,500", note: "Large dogs need higher quantity & protein" };
  };

  const weightNote = getWeightNote(dogWeight);
  const costEst = estimateMonthlyCost(dogWeight);

  return (
    <div className="fg-main-container">
      {/* ── HERO ── */}
      <header className="fg-hero-header">
        {/* Dot texture */}
        <svg className="fg-dot-texture">
          <defs>
            <pattern id="dots-fg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-fg)" />
        </svg>
        <div className="fg-hero-radial-glow" />

        <div className="fg-fade fg-hero-content-wrapper">
          <div className="fg-hero-inner">
            <img
              src="/assets/dog eating.png"
              alt="Dog eating"
              className="fg-hero-image"
            />
            <div className="fg-hero-text-block">
              <SectionPill icon={Utensils} label="Food Guide" />
              <h1 className="fg-hero-title">
                Feed your dog<br />
                <span className="fg-hero-title-italic">the right way.</span>
              </h1>
              <p className="fg-hero-subtitle">
                Every breed, age, and weight deserves a tailored nutrition plan. Search yours below.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── SEARCH SECTION ── */}
      <section className="fg-search-section">
        <div className="fg-search-container">

          {/* Search bar */}
          <div className="fg-fade fg-search-bar-section">
            <SectionPill icon={Search} label="Breed Search" />
            <h2 className="fg-search-title">
              Find feeding tips by breed
            </h2>
            <div className="fg-search-input-wrapper">
              <Search size={16} className="fg-search-input-icon" />
              <img
                src="/assets/download-removebg-preview.png"
                alt="Peeking Puppies"
                className="puppy-top"
              />
              <input
                className="fg-input"
                type="text"
                placeholder="e.g. Golden Retriever, Beagle…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Result card */}
          <div className="fg-result-card-container">
            {!matchedBreed ? (
              <div className="fg-empty-state">
                <div className="fg-empty-icon-wrapper">
                  <Search size={32} className="fg-empty-icon" />
                </div>
                <h3 className="fg-empty-title">
                  {searchTerm ? "No breed matched" : "Start searching"}
                </h3>
                <p className="fg-empty-desc">
                  {searchTerm
                    ? `No results for "${searchTerm}". Try a different spelling.`
                    : "Type a breed name above to see their personalised food guide."
                  }
                </p>
              </div>
            ) : (
              <div>
                {/* Result header */}
                <div className="fg-result-header">
                  <div>
                    <h2 className="fg-result-breed-title">
                      {matchedBreed}
                    </h2>
                    <div className="fg-tag-group">
                      {autoLoaded && (
                        <span className="fg-tag">
                          <Heart size={12} className="fg-tag-icon" /> Your dog
                        </span>
                      )}
                      {ageGroup && (
                        <span className="fg-tag">
                          {ageGroup === "puppy" ? (
                            <Sparkles size={12} className="fg-tag-icon" />
                          ) : (
                            <Activity size={12} className="fg-tag-icon" />
                          )}
                          {ageGroup === "puppy" ? "Puppy" : "Adult"}
                        </span>
                      )}
                      {dogWeight && (
                        <span className="fg-tag">
                          <Scale size={12} className="fg-tag-icon" /> {dogWeight} kg
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { setSearchTerm(""); setAutoLoaded(false); }}
                    className="fg-clear-btn"
                  >
                    <X size={12} className="fg-clear-icon" /> Clear
                  </button>
                </div>

                {/* Result body */}
                <div className="fg-result-body">

                  {/* Allergy banner */}
                  {dogAllergies.length > 0 && (
                    <div className="fg-allergy-banner">
                      <AlertTriangle size={16} className="fg-allergy-icon" />
                      <span><strong>Allergy alert:</strong> Avoid foods containing <strong>{dogAllergies.join(", ")}</strong></span>
                    </div>
                  )}

                  {/* Nutrient needs */}
                  <p className="fg-h3">Nutrient Needs</p>
                  <div className="fg-nutrient-needs-list">
                    {Object.entries(breedFoodData[matchedBreed].nutrient_needs).map(([k, v]) => (
                      <p key={k} className="fg-li">
                        <strong className="fg-li-strong">{k.replace(/_/g, " ")}:</strong> {v}
                      </p>
                    ))}
                  </div>

                  {/* Good foods */}
                  <p className="fg-h3">Good Foods</p>
                  {Object.entries(breedFoodData[matchedBreed].good_foods).map(([cat, items]) => (
                    <div key={cat} className="fg-good-foods-category">
                      <p className="fg-h4">{cat.toUpperCase()}</p>
                      <div className="fg-tag-group">
                        {items.map((item, i) => {
                          const flagged = dogAllergies.some(a => item.toLowerCase().includes(a));
                          return (
                            <span key={i} className={`fg-tag${flagged ? " fg-tag-danger" : ""}`}>
                              {flagged && <AlertTriangle size={11} className="fg-tag-icon-danger" />}
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Weight note */}
                  {weightNote && (
                    <div className="fg-weight-note-banner">
                      {weightNote.type === "small" && <Feather size={14} className="fg-weight-note-icon" />}
                      {weightNote.type === "medium" && <Scale size={14} className="fg-weight-note-icon" />}
                      {weightNote.type === "large" && <Dumbbell size={14} className="fg-weight-note-icon" />}
                      <span>{weightNote.text}</span>
                    </div>
                  )}

                  {/* Daily portions */}
                  <p className="fg-h3">Daily Portions</p>
                  {ageGroup === "adult" && (
                    <div className="fg-portion-card">
                      <p className="fg-portion-subtitle">
                        <Activity size={13} className="fg-tag-icon" /> Adult
                      </p>
                      <p className="fg-li"><strong className="fg-li-strong">Meals/day:</strong> {breedFoodData[matchedBreed].daily_portions.adult.meals_per_day}</p>
                      <p className="fg-li"><strong className="fg-li-strong">Amount:</strong> {breedFoodData[matchedBreed].daily_portions.adult.amount}</p>
                      {breedFoodData[matchedBreed].daily_portions.adult.example?.map((ex, i) => (
                        <p key={i} className="fg-li">• {ex}</p>
                      ))}
                    </div>
                  )}
                  {ageGroup === "puppy" && (
                    <div className="fg-portion-card">
                      <p className="fg-portion-subtitle">
                        <Sparkles size={13} className="fg-tag-icon" /> Puppy
                      </p>
                      <p className="fg-li"><strong className="fg-li-strong">Meals/day:</strong> {breedFoodData[matchedBreed].daily_portions.puppy.meals_per_day}</p>
                      <p className="fg-li">{breedFoodData[matchedBreed].daily_portions.puppy.note}</p>
                    </div>
                  )}
                  {!ageGroup && (
                    <p className="fg-li fg-li-info">
                      <Info size={13} className="fg-info-icon" /> Link a dog profile to see age-specific portions.
                    </p>
                  )}

                  {/* Monthly cost */}
                  {costEst && (
                    <div className="fg-cost-estimate-box">
                      <p className="fg-cost-title">
                        <DollarSign size={16} className="fg-cost-icon" />
                        Monthly Food Estimate
                      </p>
                      <p className="fg-li"><strong className="fg-li-strong">Food:</strong> {costEst.food}</p>
                      <p className="fg-li"><strong className="fg-li-strong">Est. cost:</strong> {costEst.cost}</p>
                      <p className="fg-cost-note">
                        <Info size={12} className="fg-cost-note-icon" />
                        {costEst.note}
                      </p>
                    </div>
                  )}

                  {/* Foods to avoid */}
                  <p className="fg-h3">Foods to Avoid</p>
                  <div className="fg-tag-group">
                    {breedFoodData[matchedBreed].foods_to_avoid.map((item, i) => (
                      <span key={i} className="fg-tag fg-tag-danger">
                        <Ban size={12} className="fg-tag-icon-danger" /> {item}
                      </span>
                    ))}
                  </div>

                  {/* Routine care */}
                  <p className="fg-h3">Routine Care</p>
                  <div className="fg-routine-care-list">
                    {Object.entries(breedFoodData[matchedBreed].routine_care).map(([k, v]) => (
                      <p key={k} className="fg-li">
                        <strong className="fg-li-strong">{k.replace(/_/g, " ")}:</strong>{" "}
                        {Array.isArray(v) ? v.join(", ") : v}
                      </p>
                    ))}
                  </div>

                  {/* Recipes — collapsible */}
                  <p className="fg-h3">Easy Recipes</p>
                  {breedFoodData[matchedBreed].recipes.map((recipe, i) => (
                    <RecipeBlock key={i} recipe={recipe} />
                  ))}

                  {/* Notes */}
                  <p className="fg-h3">Notes</p>
                  <div className="fg-notes-list">
                    {breedFoodData[matchedBreed].notes.map((n, i) => (
                      <p key={i} className="fg-li">• {n}</p>
                    ))}
                  </div>

                  <p className="fg-disclaimer-text">
                    <ShieldAlert size={12} className="fg-disclaimer-icon" /> Costs are approximate. Always consult a vet before making dietary changes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── NUTRITION CARDS ── */}
      <section className="fg-nutrition-basics-section">
        <div className="fg-nutrition-basics-container">
          <div className="fg-fade fg-nutrition-basics-header">
            <SectionPill icon={Heart} label="Nutrition Basics" />
            <h2 className="fg-nutrition-basics-title">
              What every dog owner should know
            </h2>
          </div>
          <div className="fg-grid">
            {[
              { iconKey: "protein", title: "Protein", desc: "Dogs thrive on protein-rich diets from chicken, fish, or eggs. Adjust the percentage to your dog's breed, age, and activity level." },
              { iconKey: "balanced_diet", title: "Balanced Diet", desc: "Include quality carbs (rice, oats), vegetables, and fibre for digestion. Tailor portions to size, weight, and health condition." },
              { iconKey: "foods_to_avoid", title: "Foods to Avoid", desc: "Never feed chocolate, onions, grapes, xylitol, or excess human treats. Always check for breed-specific intolerances." },
              { iconKey: "healthy_treats", title: "Healthy Treats", desc: "Use carrot sticks, apple slices (no seeds), or boiled eggs for guilt-free rewards. Avoid sugary or processed snacks." },
              { iconKey: "hydration", title: "Hydration", desc: "Fresh, clean water must always be available. Essential for digestion, joint health, and temperature regulation." },
              { iconKey: "portion_control", title: "Portion Control", desc: "Measure every meal. Overfeeding is a leading cause of canine obesity. Stick to a schedule and adjust as your dog ages." },
            ].map(c => <NutriCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      {/* <footer className="fg-footer">
        <div className="fg-footer-brand">
          Breedly
        </div>
      </footer> */}
    </div>
  );
}

export default function FoodGuidePage() {
  return (
    <Suspense fallback={<div className="fg-loader">Loading...</div>}>
      <FoodGuideContent />
    </Suspense>
  );
}