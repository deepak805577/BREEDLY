"use client";

import { useState, useEffect } from "react";
import { healthData } from "../data/health";
import { useSearchParams } from "next/navigation";

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

// ─── Health Info Card (mirrors NutriCard) ─────────────────────────────────────
function HealthCard({ icon, title, desc }) {
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
function AccordionBlock({ icon = "🩺", title, children }) {
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
        .fg-tag-warn {
          background: #FFF4E5; color: #874D00; border-color: #FFD591;
        }
        .fg-tag-danger {
          background: #FAECEA; color: #B42318; border-color: #E89A8E;
        }

        .fg-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .breed-image {
          width: 50%; max-height: 320px; object-fit: cover;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
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
          {/* Dot texture */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.14, pointerEvents: "none" }}>
            <defs>
              <pattern id="dots-hg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-hg)" />
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
                <SectionPill icon="🩺" label="Health Guide" />
                <h1 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(30px, 4.5vw, 50px)",
                  fontWeight: 300, color: "var(--accent-dark)",
                  lineHeight: 1.2, marginBottom: 14,
                }}>
                  Keep your dog<br />
                  <em style={{ color: "var(--accent)", fontStyle: "italic" }}>healthy & thriving.</em>
                </h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.75, fontWeight: 300, maxWidth: 380 }}>
                  Because every wag deserves a little more care. Search your breed for personalised health insights.
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
                Find health tips by breed
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
                    const m = allBreeds.filter(b => b.toLowerCase().includes(val.toLowerCase()));
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
              {!selectedBreed ? (
                <div style={{ padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>🐾</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 300, color: "var(--accent-dark)", marginBottom: 8 }}>
                    {searchTerm && matchedBreeds.length === 0 ? "No breed matched" : searchTerm && matchedBreeds.length > 1 ? "Keep typing…" : "Start searching"}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.65 }}>
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
                  <div style={{
                    background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 100%)",
                    borderBottom: "1px solid var(--border)",
                    padding: "20px 24px",
                    display: "flex", flexWrap: "wrap",
                    alignItems: "center", justifyContent: "space-between", gap: 12,
                  }}>
                    <div>
                      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400, color: "var(--accent-dark)", marginBottom: 6 }}>
                        {selectedBreed}
                      </h2>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {autoLoaded && <span className="fg-tag">🐶 Your dog</span>}
                        {resolvedAge && <span className="fg-tag">{resolvedAge === "puppy" ? "🐶 Puppy" : "🐕 Adult"}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => { setSearchTerm(""); setSuggestions([]); setAutoLoaded(false); }}
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
        <section style={{ padding: "0 24px 80px", background: "var(--bg-soft)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 60 }}>
            <div className="fg-fade" style={{ textAlign: "center", marginBottom: 40 }}>
              <SectionPill icon="💡" label="Care Basics" />
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(20px,3vw,30px)", fontWeight: 300, color: "var(--accent-dark)" }}>
                What every dog owner should know
              </h2>
            </div>
            <div className="fg-grid">
              {[
                { icon: "🩺", title: "Common Health Issues",  desc: "Dogs can face joint problems, skin allergies, obesity, ear infections, or dental disease. Early detection saves lives." },
                { icon: "💉", title: "Preventive Care",        desc: "Vaccinations, deworming, flea & tick control and yearly vet checkups keep your dog protected year-round." },
                { icon: "🍽️", title: "Diet",                   desc: "Feed balanced meals, avoid overfeeding, and always keep fresh water available. Nutrition is the foundation of health." },
                { icon: "🏃", title: "Exercise",               desc: "Walks, playtime and mental stimulation help maintain ideal fitness, reduce anxiety, and boost mood." },
                { icon: "🧼", title: "Grooming",               desc: "Brushing, bathing, teeth cleaning and ear checks keep dogs fresh, comfortable, and free from infections." },
                { icon: "❤️", title: "Wellbeing",              desc: "Dogs thrive on affection, consistent training, bonding time and social play. A happy dog is a healthy dog." },
              ].map(c => <HealthCard key={c.title} {...c} />)}
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
            Happy tummies, happy tails 🐶 · © 2025
          </p>
        </footer>
      </div>
    </>
  );
}

// ─── Breed Health Card ────────────────────────────────────────────────────────
function BreedHealthCard({ name, data, ageGroup }) {
  return (
    <div>

      {/* Disclaimer */}
      <div style={{
        background: "#FDF3DC", border: "1px solid #F0C060",
        borderRadius: "var(--radius-md)", padding: "12px 16px",
        marginBottom: 20, fontSize: 13, color: "#7A5200", lineHeight: 1.6,
      }}>
        ⚠️ <strong>Educational only</strong> — not a replacement for veterinary advice.
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        <div style={{ flex: 1, background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "var(--accent-dark)" }}>{data.lifespan}</div>
          <div style={{ fontSize: 11, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Lifespan</div>
        </div>
        <div style={{ flex: 1, background: "var(--bg-soft)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "var(--accent-dark)" }}>{data.weight}</div>
          <div style={{ fontSize: 11, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>Weight</div>
        </div>
      </div>

      {/* Age warnings */}
      {ageGroup && data.age_warnings?.[ageGroup] && (
        <div style={{
          background: "#FFF4E5", border: "1px solid #FFD591",
          borderRadius: "var(--radius-md)", padding: "12px 16px",
          margin: "16px 0", fontSize: 13, color: "#874D00",
        }}>
          <strong>⚠️ {ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)} Warnings</strong>
          <ul style={{ paddingLeft: 18, marginTop: 8 }}>
            {data.age_warnings[ageGroup].map((warn, i) => (
              <li key={i} className="fg-li">{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily care plan */}
      {ageGroup && data.daily_care_plan?.[ageGroup] && (
        <>
          <p className="fg-h3">Daily Care Plan</p>
          <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px", marginBottom: 8 }}>
            <p className="fg-h4">{ageGroup === "puppy" ? "🐶 Puppy" : "🐕 Adult"}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Meals:</strong> {data.daily_care_plan[ageGroup].meals}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Exercise:</strong> {data.daily_care_plan[ageGroup].exercise}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Grooming:</strong> {data.daily_care_plan[ageGroup].grooming}</p>
            <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Notes:</strong> {data.daily_care_plan[ageGroup].notes}</p>
          </div>
        </>
      )}

      {/* Temperament */}
      <p className="fg-h3">Temperament</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
        {data.nature.map((trait, i) => (
          <span key={i} className="fg-tag">{trait}</span>
        ))}
      </div>

      {/* Health Issues */}
      <p className="fg-h3">Common Health Concerns</p>
      {data.common_health_issues.map((issue, i) => (
        <AccordionBlock key={i} icon="⚠️" title={issue.issue}>
          <p className="fg-li" style={{ marginTop: 12 }}>{issue.description}</p>
          <p style={{ fontSize: 12, color: "var(--accent)", fontStyle: "italic", marginTop: 4 }}>Prevention tip: {issue.tip}</p>
        </AccordionBlock>
      ))}

      {/* Preventive Care */}
      <p className="fg-h3">Preventive Care</p>
      <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px" }}>
        <p className="fg-h4">Vaccines</p>
        <p className="fg-li">{data.preventive_care.vaccinations.join(", ")}</p>
        <p className="fg-h4">Deworming</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Puppies:</strong> {data.preventive_care.deworming.puppies}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Adults:</strong> {data.preventive_care.deworming.adults}</p>
        <p className="fg-h4">Tick & Flea Control</p>
        <p className="fg-li">{data.preventive_care.tick_flea_control}</p>
        <p className="fg-h4">Spay / Neuter</p>
        <p className="fg-li">{data.preventive_care.spay_neuter}</p>
        <p className="fg-h4">Annual Vet Checks</p>
        <p className="fg-li">{data.preventive_care.annual_vet_checks.join(", ")}</p>
      </div>

      {/* Diet */}
      <p className="fg-h3">Diet</p>
      <AccordionBlock icon="🍽️" title="Nutritional breakdown">
        <p className="fg-h4" style={{ marginTop: 12 }}>Macros</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Protein:</strong> {data.diet.protein}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Fat:</strong> {data.diet.fat}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Carbs:</strong> {data.diet.carbs}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Fiber:</strong> {data.diet.fiber}</p>
        <p className="fg-h4">Good Foods</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {data.diet.good_foods.map((f, i) => <span key={i} className="fg-tag">{f}</span>)}
        </div>
        <p className="fg-h4">Treats</p>
        <p className="fg-li">{data.diet.treats}</p>
        <p className="fg-h4">Hydration</p>
        <p className="fg-li">{data.diet.hydration}</p>
      </AccordionBlock>

      {/* Exercise */}
      <p className="fg-h3">Exercise</p>
      <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px" }}>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Daily Walks:</strong> {data.exercise.daily_walks}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Play:</strong> {data.exercise.play.join(", ")}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Training:</strong> {data.exercise.training}</p>
      </div>

      {/* Grooming */}
      <p className="fg-h3">Grooming</p>
      <div style={{ background: "var(--bg-soft)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", padding: "16px" }}>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Brushing:</strong> {data.grooming.brushing}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Bathing:</strong> {data.grooming.bathing}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Ears:</strong> {data.grooming.ear_cleaning}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Nails:</strong> {data.grooming.nail_clipping}</p>
        <p className="fg-li"><strong style={{ fontWeight: 500, color: "var(--accent-dark)" }}>Dental:</strong> {data.grooming.dental_care}</p>
      </div>

      {/* Wellbeing Tips */}
      <p className="fg-h3">Wellbeing Tips</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {data.wellbeing_tips.map((tip, i) => (
          <p key={i} className="fg-li">• {tip}</p>
        ))}
      </div>

      {/* Golden Rule */}
      <p className="fg-h3">Golden Rule</p>
      <div style={{
        background: "var(--bg-soft)", border: "1.5px dashed var(--border-strong)",
        borderRadius: "var(--radius-md)", padding: "16px", marginTop: 4,
      }}>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 300, color: "var(--accent-dark)", fontStyle: "italic", lineHeight: 1.7 }}>
          "{data.golden_rule}"
        </p>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 22, fontStyle: "italic", lineHeight: 1.6 }}>
        ⚠️ Always consult a vet before making changes to your dog's care routine.
      </p>
    </div>
  );
}
