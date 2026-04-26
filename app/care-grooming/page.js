"use client";

import { useEffect, useState } from "react";
import { breedGroomingAndCare } from "../data/care";
import { supabase } from "@/lib/supabase";

// ─── Section Pill ─────────────────────────────────────────────────────────────
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

// ─── Care Info Card (mirrors NutriCard) ───────────────────────────────────────
function CareCard({ icon, title, desc }) {
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

// ─── Collapsible Accordion (mirrors RecipeBlock) ──────────────────────────────
function AccordionBlock({ icon = "✂️", title, children }) {
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
        <span>{icon} {title}</span>
        <span style={{
          fontSize: 10, color: "var(--text-light)",
          display: "inline-block",
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareGroomingGuidePage() {
  const [searchTerm, setSearchTerm]   = useState("");
  const [autoLoaded, setAutoLoaded]   = useState(false);
  const [ageGroup,   setAgeGroup]     = useState(null);
  const [dogWeight,  setDogWeight]    = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadDogFromSupabase = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user's dogs
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-main:        #F5EFE6;
          --bg-soft:        #EFE7DB;
          --card-bg:        #E8D8C4;
          --card-lite:      #F0E6D8;
          --accent:         #B08968;
          --accent-dark:    #7F5539;
          --soft-white:     #FAF7F2;
          --text-primary:   #3E3E3E;
          --text-secondary: #6F6F6F;
          --text-light:     #9A9A9A;
          --border:         rgba(176,137,104,0.20);
          --border-strong:  rgba(176,137,104,0.32);
          --radius-xl:      24px;
          --radius-lg:      16px;
          --radius-md:      12px;
          --radius-pill:    999px;
          --shadow-soft:    0 8px 30px rgba(100,70,40,0.06);
          --shadow-hover:   0 16px 48px rgba(100,70,40,0.12);
          --transition:     all 0.28s cubic-bezier(0.4,0,0.2,1);
        }

        body { font-family: 'DM Sans', system-ui, sans-serif; background: var(--bg-main); color: var(--text-primary); }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--card-bg); border-radius: 3px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fg-fade { animation: fadeUp 0.5s ease both; }

        .fg-input {
          width: 100%; max-width: 380px;
          padding: 13px 18px 13px 46px;
          border: 1.5px solid var(--border-strong);
          border-radius: var(--radius-pill);
          background: var(--soft-white);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 400;
          color: var(--text-primary);
          outline: none; transition: var(--transition);
          display: block; margin: 0 auto;
        }
        .fg-input:focus {
          border-color: var(--accent-dark);
          box-shadow: 0 0 0 3px rgba(127,85,57,0.10);
        }
        .fg-input::placeholder { color: var(--text-light); }

        .suggest-box {
          position: absolute; top: calc(100% + 6px); left: 50%;
          transform: translateX(-50%);
          width: 100%; max-width: 380px;
          background: var(--soft-white);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-hover);
          overflow: hidden; z-index: 20;
        }
        .suggest-item {
          padding: 11px 18px; margin: 0; cursor: pointer;
          font-size: 14px; color: var(--text-secondary);
          transition: var(--transition);
        }
        .suggest-item:hover { background: var(--bg-soft); color: var(--accent-dark); }

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
          font-size: 13.5px; color: var(--text-secondary);
          line-height: 1.75; font-weight: 300; margin-bottom: 3px;
        }
        .fg-tag {
          display: inline-flex; padding: 3px 11px;
          border-radius: var(--radius-pill);
          font-size: 12px; font-weight: 500;
          background: var(--card-bg); color: var(--accent-dark);
          border: 1px solid var(--border-strong);
          letter-spacing: 0.02em;
        }

        .fg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .puppy-top {
          width: 190px; position: absolute;
          top: -35px; left: 50%;
          transform: translateX(-50%);
          z-index: 10; pointer-events: none;
        }

        @media (max-width: 860px) { .fg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
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
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.14, pointerEvents: "none" }}>
            <defs>
              <pattern id="dots-cg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-cg)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(176,137,104,0.16) 0%, transparent 65%)", pointerEvents: "none" }} />

          <div className="fg-fade" style={{ maxWidth: 1000, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div className="fg-hero-inner" style={{ display: "flex", alignItems: "center", gap: 52, flexWrap: "wrap" }}>
                 <img
                src="/assets/puppy.png"
                alt="Puppy"
                style={{ width: 200, height: "auto", filter: "drop-shadow(0 12px 28px rgba(100,70,40,0.14))", flexShrink: 0 }}
              />
              
              <div>
                <SectionPill icon="✂️" label="Care & Grooming Guide" />
                <h1 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(30px, 4.5vw, 50px)",
                  fontWeight: 300, color: "var(--accent-dark)",
                  lineHeight: 1.2, marginBottom: 14,
                }}>
                  Groom your dog<br />
                  <em style={{ color: "var(--accent)", fontStyle: "italic" }}>the right way.</em>
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
                  Healthy coat, clean paws & a happy pup. Search your breed for a personalised grooming routine.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ── SEARCH SECTION ── */}
        <section style={{ padding: "60px 24px", background: "var(--bg-main)" }}>
          <div style={{ maxWidth: 780, margin: "0 auto" }}>

            <div className="fg-fade" style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionPill icon="🔍" label="Breed Search" />
              <h2 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(20px, 3vw, 30px)",
                fontWeight: 300, color: "var(--accent-dark)", marginBottom: 30,
              }}>
                Find grooming tips by breed
              </h2>
              <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: 380 }}>
                <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>🐾</span>
                <img src="/assets/download-removebg-preview.png" alt="Peeking Puppies" className="puppy-top" />
                <input
                  className="fg-input"
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
                  <div className="suggest-box">
                    {suggestions.map((name, i) => (
                      <p key={i} className="suggest-item" onClick={() => { setSearchTerm(name); setSuggestions([]); }}>
                        🐾 {name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── RESULT CARD ── */}
            <div style={{
              background: "var(--soft-white)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden", minHeight: 140,
            }}>
              {!matchedBreed ? (
                <div style={{ padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>✂️</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 300, color: "var(--accent-dark)", marginBottom: 8 }}>
                    {searchTerm ? "No breed matched" : "Start searching"}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.65 }}>
                    {searchTerm
                      ? `No results for "${searchTerm}". Try a different spelling.`
                      : "Type a breed name above to see their personalised grooming guide."}
                  </p>
                </div>
              ) : (
                <div className="fg-fade">

                  {/* Result header */}
                  <div style={{
                    background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 100%)",
                    borderBottom: "1px solid var(--border)",
                    padding: "20px 24px",
                    display: "flex", flexWrap: "wrap",
                    alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div>
                      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400, color: "var(--accent-dark)", marginBottom: 6 }}>
                        {matchedBreed}
                      </h2>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {autoLoaded  && <span className="fg-tag">🐶 Your dog</span>}
                        {ageGroup    && <span className="fg-tag">{ageGroup === "puppy" ? "🐶 Puppy" : "🐕 Adult"}</span>}
                        {dogWeight   && <span className="fg-tag">⚖️ {dogWeight} kg</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSearchTerm(""); setAutoLoaded(false); setSuggestions([]); }}
                      style={{
                        padding: "7px 16px", background: "none",
                        border: "1.5px solid var(--border-strong)",
                        borderRadius: "var(--radius-pill)",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 12, fontWeight: 500,
                        color: "var(--text-secondary)", cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--card-lite)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      ✕ Clear
                    </button>
                  </div>

                  {/* Result body */}
                  <div style={{ padding: "24px 24px 32px" }}>
                    <BreedCareCard data={breedData} ageGroup={ageGroup} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── QUICK CARE CARDS ── */}
        <section style={{ padding: "0 24px 80px", background: "var(--bg-soft)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 60 }}>
            <div className="fg-fade" style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionPill icon="🧼" label="Grooming Basics" />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,3vw,30px)", fontWeight: 300, color: "var(--accent-dark)" }}>
                What every dog owner should know
              </h2>
            </div>
            <div className="fg-grid">
              {[
                { icon: "🛁", title: "Bathing",      desc: "Use dog-safe shampoo. Avoid overbathing — it strips natural oils. Most breeds need a bath every 4–6 weeks." },
                { icon: "🪮", title: "Brushing",     desc: "Regular brushing reduces shedding, prevents matting, and keeps the coat shiny and healthy all year round." },
                { icon: "✂️", title: "Trimming",     desc: "Keep paw fur, face hair, and ear fringes neat and hygienic. Use rounded-tip scissors for safety around sensitive areas." },
                { icon: "🦷", title: "Dental Care",  desc: "Brush your dog's teeth 2–3 times a week to prevent gum disease, tooth decay and bad breath." },
                { icon: "🐾", title: "Paw Care",     desc: "Inspect and moisturise paw pads regularly. Protect from extreme heat, cold and rough surfaces on walks." },
                { icon: "🧼", title: "Clean Ears",   desc: "Check and gently clean ears weekly. Build-up of wax and moisture can lead to painful infections." },
              ].map(c => <CareCard key={c.title} {...c} />)}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          background: "var(--bg-main)",
          borderTop: "1px solid var(--border)",
          padding: "34px 24px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 300, color: "var(--accent-dark)", marginBottom: 5 }}>
            Breedly
          </div>
          <p style={{ fontSize: 12, color: "var(--text-light)" }}>
            Clean coats, happy paws 🐾 · © 2025
          </p>
        </footer>
      </div>
    </>
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
          <p className="fg-h3">Overview</p>
          <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px" }}>
            {Object.entries(data.overview).map(([key, value]) => (
              <p key={key} className="fg-li">
                <strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>{key.replace(/_/g, " ")}:</strong> {value}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Grooming */}
      {data.grooming && (
        <>
          <p className="fg-h3">Grooming</p>
          {Object.entries(data.grooming).map(([key, value]) => (
            <AccordionBlock key={key} icon="🛁" title={key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}>
              <p className="fg-li" style={{ marginTop: 12 }}>
                {typeof value === "object"
                  ? `${value.frequency || ""} ${value.purpose || value.notes || value.tips || ""}`.trim()
                  : value}
              </p>
            </AccordionBlock>
          ))}

          {data.grooming_tools && (
            <>
              <p className="fg-h3">Grooming Tools</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.grooming_tools.map((tool, i) => (
                  <span key={i} className="fg-tag">🧰 {tool}</span>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Routine Care */}
      {data.routine_care && (
        <>
          <p className="fg-h3">Routine Care</p>
          <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px", marginBottom: 8 }}>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Exercise:</strong> {data.routine_care.exercise}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Grooming Time:</strong> {data.routine_care.grooming_time}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Professional Grooming:</strong> {data.routine_care.professional_grooming}</p>
          </div>

          {data.routine_care.daily_upkeep && (
            <AccordionBlock icon="🗓️" title="Daily Upkeep">
              <ul style={{ paddingLeft: 18, marginTop: 12 }}>
                {data.routine_care.daily_upkeep.map((item, i) => (
                  <li key={i} className="fg-li">{item}</li>
                ))}
              </ul>
            </AccordionBlock>
          )}

          {data.routine_care.tips && (
            <AccordionBlock icon="💡" title="Tips">
              <ul style={{ paddingLeft: 18, marginTop: 12 }}>
                {data.routine_care.tips.map((tip, i) => (
                  <li key={i} className="fg-li">{tip}</li>
                ))}
              </ul>
            </AccordionBlock>
          )}
        </>
      )}

      {/* Seasonal Care */}
      {data.seasonal_care && (
        <>
          <p className="fg-h3">Seasonal Care</p>
          {Object.entries(data.seasonal_care).map(([season, tips]) => (
            <AccordionBlock key={season} icon="🌦️" title={season.charAt(0).toUpperCase() + season.slice(1)}>
              <ul style={{ paddingLeft: 18, marginTop: 12 }}>
                {tips.map((tip, i) => (
                  <li key={i} className="fg-li">{tip}</li>
                ))}
              </ul>
            </AccordionBlock>
          ))}
        </>
      )}

      {/* Cost Estimate */}
      {data.cost_estimate && (
        <>
          <p className="fg-h3">Grooming Cost Estimate</p>
          <div style={{
            background: "var(--bg-soft)", border: "1.5px dashed var(--border-strong)",
            borderRadius: "var(--radius-md)", padding: "16px",
          }}>
            <p style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 400, color: "var(--accent-dark)", marginBottom: 10 }}>
              💸 Monthly & Yearly Breakdown
            </p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Monthly:</strong> {data.cost_estimate.monthly}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Yearly:</strong> {data.cost_estimate.yearly}</p>
            {data.cost_estimate.includes && (
              <>
                <p className="fg-h4" style={{ marginTop: 10 }}>Includes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {data.cost_estimate.includes.map((item, i) => (
                    <span key={i} className="fg-tag">{item}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 22, fontStyle: "italic", lineHeight: 1.6 }}>
        ⚠️ Costs are approximate. Always consult a professional groomer for breed-specific advice.
      </p>
    </div>
  );
}
