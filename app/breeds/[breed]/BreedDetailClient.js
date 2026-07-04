"use client";
// app/breeds/[breed]/BreedDetailClient.js
import "./breed.css";
import { useParams, useRouter } from "next/navigation";
import { breeds } from "../../data/breeds";
import { useState } from "react";

/* ── helpers ─────────────────────────────────────────────── */
const normalize = (str) =>
  str.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

const fmt = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const levelToNum = (val) => {
  if (!val) return 0;
  const v = val.toString().toLowerCase().trim();

  // 1. Excellent / Exceptional / Maximum / Extreme / Very High / Perfect / Quintessential
  if (
    v.includes("very high") ||
    v.includes("excellent") ||
    v.includes("exceptional") ||
    v.includes("maximum") ||
    v.includes("extreme") ||
    v.includes("top-tier") ||
    v.includes("perfect") ||
    v.includes("quintessential")
  ) {
    return 5;
  }

  // 2. High / Great / Good / Yes
  if (
    v.includes("high") ||
    v.includes("great") ||
    v.includes("good") ||
    v.includes("yes")
  ) {
    return 4;
  }

  // 3. Moderate / Medium / Med / Average / Fair / Possible / Size-dependent
  if (
    v.includes("mod") ||
    v.includes("med") ||
    v.includes("average") ||
    v.includes("fair") ||
    v.includes("possible") ||
    v.includes("size-dependent") ||
    v.includes("do well")
  ) {
    return 3;
  }

  // 4. Low / Easy
  if (
    v.includes("low") ||
    v.includes("easy")
  ) {
    return 2;
  }

  // 5. Very Low / Poor / Zero / None / No / Unsuitable
  if (
    v.includes("very low") ||
    v.includes("poor") ||
    v.includes("zero") ||
    v.includes("none") ||
    v.includes("no") ||
    v.includes("strictly unsuitable") ||
    v.includes("unsuitable")
  ) {
    return 1;
  }

  return 0;
};

function RatingBar({ label, value }) {
  const n = levelToNum(value);
  if (!n) return (
    <li className="bd-trait-row bd-trait-row--no-bar">
      <span className="bd-trait-label">{label}</span>
      <span className="bd-trait-val">{value || "N/A"}</span>
    </li>
  );
  return (
    <li className="bd-trait-row">
      <div className="bd-trait-header">
        <span className="bd-trait-label">{label}</span>
        <span className="bd-trait-val bd-trait-val--sm">{value}</span>
      </div>
      <div className="bd-bar-wrap">
        <div className="bd-bar" style={{ width: `${n * 20}%`, "--bar-w": `${n * 20}%` }} />
      </div>
    </li>
  );
}

function FaqItem({ q }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bd-faq-item${open ? " bd-faq-open" : ""}`}>
      <button className="bd-faq-q" onClick={() => setOpen((o) => !o)}>
        {q.question}
        <span className="bd-faq-chevron">{open ? "▴" : "▾"}</span>
      </button>
      {open && <p className="bd-faq-a">{q.answer}</p>}
    </div>
  );
}

function Stat({ label, value }) {
  if (!value || value === "N/A") return null;
  return (
    <div className="bd-stat">
      <span className="bd-stat-label">{label}</span>
      <strong className="bd-stat-value">{value}</strong>
    </div>
  );
}

const DogIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M19 14c.5-1.5.5-3.5-.5-4.5s-2.5-1-3.5.5c-1 1.5-2 1-3-.5-1-1.5-2.5-2.5-4-2.5S5 8 5 9.5c0 1 0 2.5.5 3.5s2 1.5 2 2.5v1.5C7.5 18 8 18.5 9 18.5h4c1 0 1.5-.5 1.5-1.5v-1c0-1 2-1.5 2.5-2.5.3-.7 1-1 2-1V14z" />
    <circle cx="7.5" cy="9.5" r="0.5" fill="currentColor" />
  </svg>
);

/* ── Page ─────────────────────────────────────────────────── */
const COUNTRY_FLAGS = {
  "United States": "🇺🇸",
  "USA": "🇺🇸",
  "Germany": "🇩🇪",
  "United Kingdom": "🇬🇧",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "France": "🇫🇷",
  "China": "🇨🇳",
  "Japan": "🇯🇵",
  "Russia": "🇷🇺",
  "Mexico": "🇲🇽",
  "Italy": "🇮🇹",
  "Spain": "🇪🇸",
  "Australia": "🇦🇺",
  "Switzerland": "🇨🇭",
  "Belgium": "🇧🇪",
  "Ireland": "🇮🇪",
  "Canada": "🇨🇦",
  "Netherlands": "🇳🇱",
  "Madagascar": "🇲🇬",
  "Cuba": "🇨🇺",
  "Afghanistan": "🇦🇫",
  "Mali": "🇲🇱",
  "Tibet": "🇨🇳",
  "Croatia": "🇭🇷",
  "Turkey": "🇹🇷",
  "Hungary": "🇭🇺",
  "Portugal": "🇵🇹",
  "Sweden": "🇸🇪",
  "Norway": "🇳🇴",
  "Finland": "🇫🇮",
  "Denmark": "🇩🇰",
  "South Africa": "🇿🇦",
  "Egypt": "🇪🇬"
};

function getOriginText(originVal) {
  if (!originVal) return "Dog Breed";
  
  // Convert to string in case it's an array
  let originStr = Array.isArray(originVal) ? originVal.join(", ") : String(originVal);
  
  // Remove any existing emojis so we don't double up
  let cleanName = originStr.replace(/[\u1F1E6-\u1F1FF]{2}/g, "").trim();
  cleanName = cleanName.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "").trim();
  
  for (const [country, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (cleanName.toLowerCase().includes(country.toLowerCase())) {
      return `${flag} ${cleanName}`;
    }
  }
  
  return originStr;
}

export default function BreedDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);

  const breedName = normalize(decodeURIComponent(params.breed).replace(/-/g, " "));
  const breedKey = Object.keys(breeds).find((b) => normalize(b) === breedName);
  const breed = breeds[breedKey];

  if (!breed) {
    return (
      <div className="breed-info bd-not-found">
        <DogIcon style={{ width: 64, height: 64, color: 'var(--bd-text-light)' }} />
        <h1>Breed Not Found</h1>
        <p>We couldn't find that breed. Try going back and selecting again.</p>
        <button className="bd-btn" onClick={() => router.push("/breeds")}>
          ← Browse All Breeds
        </button>
      </div>
    );
  }

  const ov = breed.quick_overview || {};
  const RATINGS = [
    { label: "Energy Level", value: ov.energy_level },
    { label: "Maintenance", value: ov.maintenance_level },
    { label: "Shedding", value: ov.shedding_level },
    { label: "Trainability", value: ov.trainability },
    { label: "Apartment Friendly", value: ov.apartment_friendly },
    { label: "First-time Owner", value: ov.first_time_owner_friendly },
  ];

  return (
    <div className="breed-detail-page">
      <div className="breed-info">

        {/* ── HERO ── */}
        <section className="breed-hero">
          <div className="bd-hero-img-wrap">
            <img src={breed.image || ""} alt={breedKey} />
            {breed.basic_info?.breed_group && (
              <span className="bd-hero-badge">{breed.basic_info.breed_group}</span>
            )}
          </div>
          <div className="bd-hero-text">
            <span className="bd-eyebrow">{getOriginText(breed.basic_info?.origin)}</span>
            <h1>{breed.basic_info?.name || breedKey}</h1>
            <p className="bd-tagline">
              {breed.basic_info?.one_sentence_summary || breed.basic_info?.ideal_home || ""}
            </p>
            <div className="bd-hero-chips">
              {breed.basic_info?.size && <span>{breed.basic_info.size}</span>}
              {ov.lifespan && <span>{ov.lifespan}</span>}
              {ov.energy_level && <span>{ov.energy_level} energy</span>}
              {ov.temperament && <span>{ov.temperament}</span>}
            </div>
          </div>
        </section>

        {/* ── BASIC INFO ── */}
        <section className="basic-info">
          <h2>Basic Info</h2>
          <div className="bd-info-grid">
            <Stat label="Nicknames" value={breed.basic_info?.nicknames?.join(", ")} />
            <Stat label="Origin" value={breed.basic_info?.origin} />
            <Stat label="Breed Group" value={breed.basic_info?.breed_group} />
            <Stat label="Size" value={breed.basic_info?.size} />
            <Stat label="Popularity" value={breed.basic_info?.popularity} />
            <Stat label="Best Known For" value={breed.basic_info?.best_known_for} />
            <Stat label="Climate Note" value={breed.basic_info?.climate_note} />
          </div>
          {breed.basic_info?.one_sentence_summary && (
            <p className="bd-summary-note">
              <em>"{breed.basic_info.one_sentence_summary}"</em>
            </p>
          )}
        </section>

        {/* ── QUICK OVERVIEW ── */}
        <section className="quick-overview">
          <h2>Quick Overview</h2>
          <div className="bd-size-row">
            <div className="bd-size-box"><span>Weight — Male</span><strong>{ov.weight?.male || "N/A"}</strong></div>
            <div className="bd-size-box"><span>Weight — Female</span><strong>{ov.weight?.female || "N/A"}</strong></div>
            <div className="bd-size-box"><span>Height — Male</span><strong>{ov.height?.male || "N/A"}</strong></div>
            <div className="bd-size-box"><span>Height — Female</span><strong>{ov.height?.female || "N/A"}</strong></div>
            <div className="bd-size-box bd-size-box--wide"><span>Lifespan</span><strong>{ov.lifespan || "N/A"}</strong></div>
          </div>
          <ul className="bd-ratings-list">
            {RATINGS.map((r) => <RatingBar key={r.label} label={r.label} value={r.value} />)}
          </ul>
        </section>

        {/* ── PERSONALITY ── */}
        <section className="personality">
          <h2>Personality & Temperament</h2>
          {breed.personality_and_temperament?.overview && <p>{breed.personality_and_temperament.overview}</p>}

          {breed.personality_and_temperament?.key_traits?.length > 0 && (
            <><h3>Key Traits</h3>
              <div className="bd-trait-chips">
                {breed.personality_and_temperament.key_traits.map((t, i) => <span key={i} className="bd-chip">{t}</span>)}
              </div></>
          )}

          {breed.personality_and_temperament?.social_behavior && (
            <><h3>Social Behaviour</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.personality_and_temperament.social_behavior).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}

          {breed.personality_and_temperament?.personality_highlights?.length > 0 && (
            <><h3>Personality Highlights</h3>
              <ul>{breed.personality_and_temperament.personality_highlights.map((p, i) => <li key={i}>{p}</li>)}</ul></>
          )}

          {breed.personality_and_temperament?.quirky_habits?.length > 0 && (
            <><h3>Quirky Habits</h3>
              <ul>{breed.personality_and_temperament.quirky_habits.map((q, i) => <li key={i}>{q}</li>)}</ul></>
          )}

          {breed.personality_and_temperament?.behavioral_traits && (
            <><h3>Behavioural Traits</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.personality_and_temperament.behavioral_traits).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}
        </section>

        {/* ── APPEARANCE ── */}
        <section className="appearance">
          <h2>Appearance & Coat</h2>
          {breed.appearance_and_coat?.general_look && <p>{breed.appearance_and_coat.general_look}</p>}

          {breed.appearance_and_coat?.coat_details && (
            <><h3>Coat Details</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.appearance_and_coat.coat_details).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {Array.isArray(v) ? v.join(", ") : v.toString()}</li>
                ))}
              </ul></>
          )}

          {breed.appearance_and_coat?.distinct_features?.length > 0 && (
            <><h3>Distinct Features</h3>
              <div className="bd-trait-chips">
                {breed.appearance_and_coat.distinct_features.map((f, i) => <span key={i} className="bd-chip bd-chip--sage">{f}</span>)}
              </div></>
          )}

          {breed.appearance_and_coat?.climate_challenges && (
            <div className="bd-callout">
              <p><strong>Climate Note:</strong> {breed.appearance_and_coat.climate_challenges}</p>
            </div>
          )}
        </section>

        {/* ── EXERCISE ── */}
        <section className="exercise">
          <h2>Exercise & Activity</h2>
          {breed.exercise_and_activity?.daily_requirement && (
            <div className="bd-callout">
              <p>{breed.exercise_and_activity.daily_requirement}</p>
            </div>
          )}
          {breed.exercise_and_activity?.why_exercise_is_critical && <p>{breed.exercise_and_activity.why_exercise_is_critical}</p>}
          {breed.exercise_and_activity?.recommended_activities?.length > 0 && (
            <><h3>Recommended Activities</h3>
              <div className="bd-trait-chips">
                {breed.exercise_and_activity.recommended_activities.map((a, i) => <span key={i} className="bd-chip bd-chip--teal">{a}</span>)}
              </div></>
          )}
          {breed.exercise_and_activity?.energy_note && <p className="bd-note">{breed.exercise_and_activity.energy_note}</p>}
        </section>

        {/* ── TRAINING ── */}
        <section className="training">
          <h2>Training & Intelligence</h2>
          {(breed.training_and_intelligence?.intelligence_level || ov.trainability) && (
            <div className="bd-intelligence-badge">
              <div>
                <strong>Intelligence Level</strong>
                <p>{breed.training_and_intelligence?.intelligence_level || ov.trainability}</p>
              </div>
            </div>
          )}
          {breed.training_and_intelligence?.training_experience && <p>{breed.training_and_intelligence.training_experience}</p>}
          {breed.training_and_intelligence?.learning_ability && (
            <><h3>Learning Ability</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.training_and_intelligence.learning_ability).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}
          {breed.training_and_intelligence?.common_roles?.length > 0 && (
            <><h3>Common Roles</h3>
              <div className="bd-trait-chips">
                {breed.training_and_intelligence.common_roles.map((r, i) => <span key={i} className="bd-chip bd-chip--teal">{r}</span>)}
              </div></>
          )}
        </section>

        {/* ── GROOMING ── */}
        <section className="grooming">
          <h2>Grooming & Maintenance</h2>
          {breed.grooming_and_maintenance?.overall_effort && <p>{breed.grooming_and_maintenance.overall_effort}</p>}
          {breed.grooming_and_maintenance?.shedding_warning && (
            <div className="bd-callout">
              <p><strong>Shedding Warning:</strong> {breed.grooming_and_maintenance.shedding_warning}</p>
            </div>
          )}
          {breed.grooming_and_maintenance?.grooming_needs && (
            <><h3>Grooming Needs</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.grooming_and_maintenance.grooming_needs).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}
          {breed.grooming_and_maintenance?.seasonal_notes && (
            <><h3>Seasonal Notes</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.grooming_and_maintenance.seasonal_notes).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}
          {breed.grooming_and_maintenance?.professional_grooming && (
            <div className="bd-pro-grooming">
              <div>
                <strong>Professional Grooming</strong>
                <p>
                  {breed.grooming_and_maintenance.professional_grooming.frequency}
                  {breed.grooming_and_maintenance.professional_grooming.services?.length > 0 &&
                    ` · Services: ${breed.grooming_and_maintenance.professional_grooming.services.join(", ")}`}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── LIFESTYLE ── */}
        <section className="lifestyle">
          <h2>Living Requirements & Lifestyle</h2>
          {breed.living_requirements?.space && (
            <div className="bd-size-row bd-size-row--2">
              <div className="bd-size-box"><span>Minimum Space</span><strong>{breed.living_requirements.space.minimum || "N/A"}</strong></div>
              <div className="bd-size-box"><span>Ideal Space</span><strong>{breed.living_requirements.space.ideal || "N/A"}</strong></div>
            </div>
          )}
          {breed.living_requirements?.home_lifestyle && (
            <><h3>Home Lifestyle</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.living_requirements.home_lifestyle).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {v}</li>
                ))}
              </ul></>
          )}
          {breed.living_requirements?.climate && (
            <><h3>Climate Compatibility</h3>
              <ul className="bd-kv-list">
                {Object.entries(breed.living_requirements.climate).map(([k, v], i) => (
                  <li key={i}><strong>{fmt(k)}:</strong> {Array.isArray(v) ? v.join(", ") : v.toString()}</li>
                ))}
              </ul></>
          )}
          {breed.lifestyle_compatibility?.quick_decision_guide && (
            <div className="bd-decision-grid">
              <div className="bd-decision-yes">
                <h3>Get one if…</h3>
                <ul>
                  {breed.lifestyle_compatibility.quick_decision_guide.get?.map((g, i) => <li key={i}>{g}</li>)}
                </ul>
              </div>
              <div className="bd-decision-no">
                <h3>Skip if…</h3>
                <ul>
                  {breed.lifestyle_compatibility.quick_decision_guide.skip?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ── HISTORY ── */}
        <section className="history">
          <h2>History & Origin</h2>
          <div className="bd-info-grid">
            <Stat label="Origin Country" value={breed.history_origin?.origin_country} />
            <Stat label="Developed In" value={breed.history_origin?.developed_in} />
            <Stat label="Developed By" value={breed.history_origin?.developed_by} />
            <Stat label="Original Purpose" value={breed.history_origin?.original_purpose} />
            <Stat label="AKC Recognition" value={breed.history_origin?.recognition?.us} />
            <Stat label="KC Recognition" value={breed.history_origin?.recognition?.uk} />
          </div>
          {breed.history_origin?.key_traits_developed_for?.length > 0 && (
            <><h3>Key Traits Developed For</h3>
              <div className="bd-trait-chips">
                {breed.history_origin.key_traits_developed_for.map((t, i) => <span key={i} className="bd-chip">{t}</span>)}
              </div></>
          )}
          {breed.history_origin?.modern_roles?.length > 0 && (
            <><h3>Modern Roles</h3>
              <div className="bd-trait-chips">
                {breed.history_origin.modern_roles.map((r, i) => <span key={i} className="bd-chip bd-chip--sage">{r}</span>)}
              </div></>
          )}
        </section>

        {/* ── FUN FACTS ── */}
        {breed.fun_facts?.length > 0 && (
          <section className="fun-facts">
            <h2>Fun Facts</h2>
            <ul className="bd-fun-list">
              {breed.fun_facts.map((f, i) => (
                <li key={i}>
                  <span className="bd-fun-num">{String(i + 1).padStart(2, "0")}</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── FAQs ── */}
        {breed.common_questions?.length > 0 && (
          <section className="faqs">
            <h2>Common Questions</h2>
            <div className="bd-faq-list">
              {breed.common_questions.map((q, i) => <FaqItem key={i} q={q} />)}
            </div>
          </section>
        )}

        {/* ── OWNER REVIEWS ── */}
        {breed.real_owner_reviews && (
          <section className="owner-reviews">
            <h2>Real Owner Reviews</h2>
            {breed.real_owner_reviews?.overall_sentiment && (
              <div className="bd-sentiment">
                <p><strong>Overall Sentiment:</strong> {breed.real_owner_reviews.overall_sentiment}</p>
              </div>
            )}
            <div className="bd-reviews-grid">
              {breed.real_owner_reviews?.positive?.length > 0 && (
                <div className="bd-review-col bd-review-col--pos">
                  <h3>What owners love</h3>
                  <ul>{breed.real_owner_reviews.positive.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}
              {breed.real_owner_reviews?.challenges?.length > 0 && (
                <div className="bd-review-col bd-review-col--neg">
                  <h3>Challenges noted</h3>
                  <ul>{breed.real_owner_reviews.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── FINAL VERDICT ── */}
        {breed.final_verdict && (
          <section className="final-verdict">
            <h2>Final Verdict</h2>
            <p>{breed.final_verdict}</p>
          </section>
        )}

      </div>

      {/* ── VIDEO ── */}
      {breed.video && !videoError && (
        <div className="video-section">
          <h2>Watch this Breed in Action</h2>
          <video controls playsInline onError={() => setVideoError(true)}>
            <source src={breed.video} type="video/mp4" />
          </video>
        </div>
      )}

      {/* ── NEXT STEPS ── */}
      <section className="next-steps">
        <div className="bd-next-inner">
          <div>
            <h2>Ready for the Next Step?</h2>
            <p>Choosing a dog is a long-term commitment. Let's help you decide responsibly.</p>
          </div>
          <div className="step-actions">
            <button onClick={() => router.push("/adoption-guide")}>Adoption Checklist</button>
            <button onClick={() => router.push("/breed-selector")}>Retake Quiz</button>
            <button onClick={() => router.push("/breeds")}>Browse Breeds</button>
          </div>
        </div>
      </section>

      <div className="dog-quote-banner">
        Every dog is a story waiting to be loved.
      </div>
    </div>
  );
}