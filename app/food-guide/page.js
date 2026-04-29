"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { breedFoodData } from "../data/food";
import { supabase } from "@/lib/supabase";

// ─── Section pill ─────────────────────────────────────────────────────────────
function SectionPill({ icon, label }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(127,85,57,0.10)",
      borderRadius: 999, padding: "4px 14px", marginBottom: 12,
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11, fontWeight: 500,
        color: "var(--accent-dark)",
        letterSpacing: "0.09em", textTransform: "uppercase",
      }}>{label}</span>
    </div>
  );
}

// ─── Nutrition card ───────────────────────────────────────────────────────────
function NutriCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--soft-white)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        padding: "24px 20px",
        boxShadow: hovered ? "var(--shadow-hover)" : "var(--shadow-soft)",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "var(--transition)",
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 12 }}>{icon}</div>
      <h3 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: 17, fontWeight: 400,
        color: "var(--accent-dark)", marginBottom: 8,
      }}>{title}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-secondary)", fontWeight: 300 }}>
        {desc}
      </p>
    </div>
  );
}

// ─── Collapsible recipe ───────────────────────────────────────────────────────
function RecipeBlock({ recipe }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--bg-soft)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden", marginBottom: 8,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 16px",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14, fontWeight: 500,
          color: "var(--accent-dark)", textAlign: "left",
        }}
      >
        <span>🍳 {recipe.title}</span>
        <span style={{ fontSize: 10, color: "var(--text-light)", display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-light)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 12, marginBottom: 6 }}>Ingredients</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {recipe.ingredients.map((ing, j) => (
              <li key={j} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300 }}>{ing}</li>
            ))}
          </ul>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-light)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 12, marginBottom: 6 }}>Instructions</p>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            {recipe.instructions.map((step, j) => (
              <li key={j} style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: 4, fontWeight: 300 }}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
function FoodGuideContent() {
  const [searchTerm,   setSearchTerm]   = useState("");
  const [ageGroup,     setAgeGroup]     = useState(null);
  const [dogAllergies, setDogAllergies] = useState([]);
  const [dogWeight,    setDogWeight]    = useState(null);
  const [autoLoaded,   setAutoLoaded]   = useState(false);

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

  const breeds       = Object.keys(breedFoodData);
  const matchedBreed = searchTerm
    ? breeds.find(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;

  const getWeightNote = w => {
    if (!w) return null;
    if (w < 5)   return { icon: "🪶", text: "Small dog — feed slightly smaller portions" };
    if (w <= 20) return { icon: "⚖️", text: "Medium-sized dog — standard portions apply" };
    return             { icon: "💪", text: "Large dog — may require higher protein & quantity" };
  };

  const estimateMonthlyCost = w => {
    if (!w) return null;
    if (w < 5)   return { food: "6–8 kg / month",   cost: "₹1,500 – ₹2,500", note: "Small breeds eat less but need quality nutrition" };
    if (w <= 20) return { food: "10–14 kg / month",  cost: "₹2,500 – ₹4,000", note: "Balanced diet with controlled portions" };
    return              { food: "18–25 kg / month",  cost: "₹4,000 – ₹6,500", note: "Large dogs need higher quantity & protein" };
  };

  const weightNote = getWeightNote(dogWeight);
  const costEst    = estimateMonthlyCost(dogWeight);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-main:       #F5EFE6;
          --bg-soft:       #EFE7DB;
          --card-bg:       #E8D8C4;
          --card-lite:     #F0E6D8;
          --accent:        #B08968;
          --accent-dark:   #7F5539;
          --soft-white:    #FAF7F2;
          --text-primary:  #3E3E3E;
          --text-secondary:#6F6F6F;
          --text-light:    #9A9A9A;
          --border:        rgba(176,137,104,0.20);
          --border-strong: rgba(176,137,104,0.32);
          --radius-xl:     24px;
          --radius-lg:     16px;
          --radius-md:     12px;
          --radius-pill:   999px;
          --shadow-soft:   0 8px 30px rgba(100,70,40,0.06);
          --shadow-hover:  0 16px 48px rgba(100,70,40,0.12);
          --transition:    all 0.28s cubic-bezier(0.4,0,0.2,1);
        }

        body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: var(--bg-main);
          color: var(--text-primary);
        }
           .puppy-top {
      width: 190px;
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      pointer-events: none;
    }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--card-bg); border-radius: 3px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fg-fade { animation: fadeUp 0.5s ease both; }

        .fg-input {
          width: 100%;
          max-width: 380px;
          padding: 13px 18px 13px 46px;
          border: 1.5px solid var(--border-strong);
          border-radius: var(--radius-pill);
          background: var(--soft-white);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-primary);
          outline: none;
          transition: var(--transition);
          display: block; margin: 0 auto;
        }
        .fg-input:focus {
          border-color: var(--accent-dark);
          box-shadow: 0 0 0 3px rgba(127,85,57,0.10);
        }
        .fg-input::placeholder { color: var(--text-light); }

        .fg-h3 {
          font-family: 'Fraunces', serif;
          font-size: 17px; font-weight: 400;
          color: var(--accent-dark);
          margin: 24px 0 10px;
          padding-left: 12px;
          border-left: 3px solid var(--accent);
          line-height: 1.3;
        }
        .fg-h4 {
          font-size: 11px; font-weight: 500;
          color: var(--text-light);
          letter-spacing: 0.08em; text-transform: uppercase;
          margin: 14px 0 6px;
        }
        .fg-li {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.75; font-weight: 300;
          margin-bottom: 3px;
        }
        .fg-tag {
          display: inline-flex;
          padding: 3px 11px;
          border-radius: var(--radius-pill);
          font-size: 12px; font-weight: 500;
          background: var(--card-bg);
          color: var(--accent-dark);
          border: 1px solid var(--border-strong);
          letter-spacing: 0.02em;
        }
        .fg-tag-danger {
          background: #FAECEA; color: #B42318;
          border-color: #E89A8E;
        }

        .fg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        @media (max-width: 860px) {
          .fg-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 520px) {
          .fg-grid { grid-template-columns: 1fr !important; }
          .fg-hero-inner { flex-direction: column !important; text-align: center !important; align-items: center !important; }
        }
      `}</style>

      <div style={{ background: "var(--bg-main)", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <header style={{
          background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 50%, #DFC9AE 100%)",
          borderBottom: "1px solid var(--border)",
          padding: "56px 28px 48px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Dot texture */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.14, pointerEvents:"none" }}>
            <defs>
              <pattern id="dots-fg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="#7F5539"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-fg)"/>
          </svg>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 70% 50%, rgba(176,137,104,0.16) 0%, transparent 65%)", pointerEvents:"none" }} />

          <div className="fg-fade" style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div className="fg-hero-inner" style={{ display:"flex", alignItems:"center", gap: 52, flexWrap: "wrap" }}>
              <img
                src="/assets/dog eating.png"
                alt="Dog eating"
                style={{ width: 200, height: "auto", filter: "drop-shadow(0 12px 28px rgba(100,70,40,0.14))", flexShrink: 0 }}
              />
              <div>
                <SectionPill icon="🍽️" label="Food Guide" />
                <h1 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(30px, 4.5vw, 50px)",
                  fontWeight: 300, color: "var(--accent-dark)",
                  lineHeight: 1.2, marginBottom: 14,
                }}>
                  Feed your dog<br />
                  <em style={{ color: "var(--accent)", fontStyle: "italic" }}>the right way.</em>
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
                  Every breed, age, and weight deserves a tailored nutrition plan. Search yours below.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── SEARCH SECTION ── */}
        <section style={{ padding: "60px 24px", background: "var(--bg-main)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>

            {/* Search bar */}
            <div className="fg-fade" style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionPill icon="🔍" label="Breed Search" />
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(20px, 3vw, 30px)",
                fontWeight: 300, color: "var(--accent-dark)", marginBottom: 30,
              }}>
                Find feeding tips by breed
                
              </h2>
              <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: 380 }}>
                <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none" }}>🐾</span>
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
            <div style={{
              background: "var(--soft-white)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
              minHeight: 140,
            }}>
              {!matchedBreed ? (
                <div style={{ padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🐾</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:300, color:"var(--accent-dark)", marginBottom:8 }}>
                    {searchTerm ? "No breed matched" : "Start searching"}
                  </div>
                  <p style={{ fontSize:13, color:"var(--text-light)", lineHeight:1.65 }}>
                    {searchTerm
                      ? `No results for "${searchTerm}". Try a different spelling.`
                      : "Type a breed name above to see their personalised food guide."
                    }
                  </p>
                </div>
              ) : (
                <div>
                  {/* Result header */}
                  <div style={{
                    background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 100%)",
                    borderBottom: "1px solid var(--border)",
                    padding: "20px 24px",
                    display: "flex", flexWrap: "wrap",
                    alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div>
                      <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:400, color:"var(--accent-dark)", marginBottom:6 }}>
                        {matchedBreed}
                      </h2>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {autoLoaded  && <span className="fg-tag">🐶 Your dog</span>}
                        {ageGroup    && <span className="fg-tag">{ageGroup === "puppy" ? "🐶 Puppy" : "🐕 Adult"}</span>}
                        {dogWeight   && <span className="fg-tag">⚖️ {dogWeight} kg</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSearchTerm(""); setAutoLoaded(false); }}
                      style={{
                        padding: "7px 16px", background: "none",
                        border: "1.5px solid var(--border-strong)",
                        borderRadius: "var(--radius-pill)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12, fontWeight: 500,
                        color: "var(--text-secondary)", cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="var(--card-lite)"; e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent-dark)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor="var(--border-strong)"; e.currentTarget.style.color="var(--text-secondary)"; }}
                    >
                      ✕ Clear
                    </button>
                  </div>

                  {/* Result body */}
                  <div style={{ padding: "24px 24px 32px" }}>

                    {/* Allergy banner */}
                    {dogAllergies.length > 0 && (
                      <div style={{
                        background: "#FDF3DC", border: "1px solid #F0C060",
                        borderRadius: "var(--radius-md)", padding: "12px 16px",
                        marginBottom: 20, fontSize: 13, color: "#7A5200", lineHeight: 1.6,
                      }}>
                        ⚠️ <strong>Allergy alert:</strong> Avoid foods containing <strong>{dogAllergies.join(", ")}</strong>
                      </div>
                    )}

                    {/* Nutrient needs */}
                    <p className="fg-h3">Nutrient Needs</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                      {Object.entries(breedFoodData[matchedBreed].nutrient_needs).map(([k, v]) => (
                        <p key={k} className="fg-li">
                          <strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>{k.replace(/_/g," ")}:</strong> {v}
                        </p>
                      ))}
                    </div>

                    {/* Good foods */}
                    <p className="fg-h3">Good Foods</p>
                    {Object.entries(breedFoodData[matchedBreed].good_foods).map(([cat, items]) => (
                      <div key={cat} style={{ marginBottom: 14 }}>
                        <p className="fg-h4">{cat.toUpperCase()}</p>
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                          {items.map((item, i) => {
                            const flagged = dogAllergies.some(a => item.toLowerCase().includes(a));
                            return (
                              <span key={i} className={`fg-tag${flagged ? " fg-tag-danger" : ""}`}>
                                {flagged && "⚠️ "}{item}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Weight note */}
                    {weightNote && (
                      <div style={{
                        background: "var(--bg-soft)", border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)", padding: "11px 16px",
                        margin: "18px 0 6px", fontSize: 13,
                        color: "var(--accent-dark)", display:"flex", gap:8, alignItems:"center", fontWeight:500,
                      }}>
                        {weightNote.icon} {weightNote.text}
                      </div>
                    )}

                    {/* Daily portions */}
                    <p className="fg-h3">Daily Portions</p>
                    {ageGroup === "adult" && (
                      <div style={{ background:"var(--bg-soft)", borderRadius:"var(--radius-md)", border:"1px solid var(--border)", padding:"16px", marginBottom:8 }}>
                        <p className="fg-h4">🐕 Adult</p>
                        <p className="fg-li"><strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>Meals/day:</strong> {breedFoodData[matchedBreed].daily_portions.adult.meals_per_day}</p>
                        <p className="fg-li"><strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>Amount:</strong> {breedFoodData[matchedBreed].daily_portions.adult.amount}</p>
                        {breedFoodData[matchedBreed].daily_portions.adult.example?.map((ex, i) => (
                          <p key={i} className="fg-li">• {ex}</p>
                        ))}
                      </div>
                    )}
                    {ageGroup === "puppy" && (
                      <div style={{ background:"var(--bg-soft)", borderRadius:"var(--radius-md)", border:"1px solid var(--border)", padding:"16px", marginBottom:8 }}>
                        <p className="fg-h4">🐶 Puppy</p>
                        <p className="fg-li"><strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>Meals/day:</strong> {breedFoodData[matchedBreed].daily_portions.puppy.meals_per_day}</p>
                        <p className="fg-li">{breedFoodData[matchedBreed].daily_portions.puppy.note}</p>
                      </div>
                    )}
                    {!ageGroup && (
                      <p className="fg-li" style={{ color:"var(--text-light)", fontStyle:"italic" }}>
                        ℹ️ Link a dog profile to see age-specific portions.
                      </p>
                    )}

                    {/* Monthly cost */}
                    {costEst && (
                      <div style={{
                        background: "var(--bg-soft)", border: "1.5px dashed var(--border-strong)",
                        borderRadius: "var(--radius-md)", padding: "16px", margin: "20px 0",
                      }}>
                        <p style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:400, color:"var(--accent-dark)", marginBottom:10 }}>
                          💸 Monthly Food Estimate
                        </p>
                        <p className="fg-li"><strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>Food:</strong> {costEst.food}</p>
                        <p className="fg-li"><strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>Est. cost:</strong> {costEst.cost}</p>
                        <p style={{ fontSize:12, color:"var(--text-light)", marginTop:6 }}>ℹ️ {costEst.note}</p>
                      </div>
                    )}

                    {/* Foods to avoid */}
                    <p className="fg-h3">Foods to Avoid</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {breedFoodData[matchedBreed].foods_to_avoid.map((item, i) => (
                        <span key={i} className="fg-tag fg-tag-danger">✕ {item}</span>
                      ))}
                    </div>

                    {/* Routine care */}
                    <p className="fg-h3">Routine Care</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                      {Object.entries(breedFoodData[matchedBreed].routine_care).map(([k, v]) => (
                        <p key={k} className="fg-li">
                          <strong style={{ fontWeight:500, color:"var(--accent-dark)" }}>{k.replace(/_/g," ")}:</strong>{" "}
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
                    <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                      {breedFoodData[matchedBreed].notes.map((n, i) => (
                        <p key={i} className="fg-li">• {n}</p>
                      ))}
                    </div>

                    <p style={{ fontSize:12, color:"var(--text-light)", marginTop:22, fontStyle:"italic", lineHeight:1.6 }}>
                      ⚠️ Costs are approximate. Always consult a vet before making dietary changes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── NUTRITION CARDS ── */}
        <section style={{ padding: "0 24px 80px", background: "var(--bg-soft)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 60 }}>
            <div className="fg-fade" style={{ textAlign:"center", marginBottom: 40 }}>
              <SectionPill icon="🥗" label="Nutrition Basics" />
              <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(20px,3vw,30px)", fontWeight:300, color:"var(--accent-dark)" }}>
                What every dog owner should know
              </h2>
            </div>
            <div className="fg-grid">
              {[
                { icon:"🥩", title:"Protein",          desc:"Dogs thrive on protein-rich diets from chicken, fish, or eggs. Adjust the percentage to your dog's breed, age, and activity level." },
                { icon:"🥗", title:"Balanced Diet",     desc:"Include quality carbs (rice, oats), vegetables, and fibre for digestion. Tailor portions to size, weight, and health condition." },
                { icon:"🚫", title:"Foods to Avoid",    desc:"Never feed chocolate, onions, grapes, xylitol, or excess human treats. Always check for breed-specific intolerances." },
                { icon:"🥕", title:"Healthy Treats",    desc:"Use carrot sticks, apple slices (no seeds), or boiled eggs for guilt-free rewards. Avoid sugary or processed snacks." },
                { icon:"💧", title:"Hydration",         desc:"Fresh, clean water must always be available. Essential for digestion, joint health, and temperature regulation." },
                { icon:"📏", title:"Portion Control",   desc:"Measure every meal. Overfeeding is a leading cause of canine obesity. Stick to a schedule and adjust as your dog ages." },
              ].map(c => <NutriCard key={c.title} {...c} />)}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: "var(--bg-main)",
          borderTop: "1px solid var(--border)",
          padding: "34px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:300, color:"var(--accent-dark)", marginBottom:5 }}>
            Breedly
          </div>
          <p style={{ fontSize:12, color:"var(--text-light)" }}>
          </p>
        </footer>
      </div>
    </>
  );
}

export default function FoodGuidePage() {
  return (
    <Suspense fallback={<div style={{ padding: 100, textAlign: "center" }}>Loading...</div>}>
      <FoodGuideContent />
    </Suspense>
  );
}