"use client";
import "./health.css";
import { useState, useEffect } from "react";
import { healthData } from "../data/health";
import { useSearchParams } from "next/navigation";


export default function HealthGuidePage() {
  const params = useSearchParams();

  const breedFromUrl = params.get("breed");
  const ageFromUrl = params.get("age");

  const [searchTerm, setSearchTerm] = useState(breedFromUrl || "");
  const [suggestions, setSuggestions] = useState([]);

  // Load active dog from localStorage (fallback)
  useEffect(() => {
    if (breedFromUrl) return;

    const dogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const activeId = localStorage.getItem("activeDogId");
    const activeDog = dogs.find((d) => d.id === activeId);

    if (activeDog) setSearchTerm(activeDog.breed);
  }, [breedFromUrl]);

  const allBreeds = Object.keys(healthData);

  const matchedBreeds =
    searchTerm.trim().length > 0
      ? allBreeds.filter((b) =>
          b.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const selectedBreed = matchedBreeds.length === 1 ? matchedBreeds[0] : null;

  const ageGroup = ageFromUrl ? getAgeGroup(Number(ageFromUrl)) : null;

  return (
    <div className="health-guide-page">
      {/* HEADER */}
      <header className="health-header">
        <div className="health-header-content">
          <img
            src="/assets/puppy.png"
            alt="Smiling Puppy"
            className="puppy-left-img"
          />
          <div className="health-text">
            <h1>🩺 Dog Health Guide</h1>
            <p className="slogan">Because every wag deserves a little more care 💛</p>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <section className="breed-health-search">
        <h2>❤️ Keep Your Dog Healthy</h2>

        <input
          type="text"
          id="breedSearch"
          placeholder="Type a breed name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSuggestions(e.target.value ? matchedBreeds.slice(0, 3) : []);
          }}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggest-box">
            {suggestions.map((name, i) => (
              <p
                key={i}
                className="suggest-item"
                onClick={() => {
                  setSearchTerm(name);
                  setSuggestions([]);
                }}
              >
                {name}
              </p>
            ))}
          </div>
        )}

        {/* Auto-load hint */}
        {searchTerm && (
          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Showing health guide based on your dog’s breed 🐾
          </p>
        )}

        {/* RESULTS */}
        <div className="breed-result-wrapper">
          <img
            src="/assets/download-removebg-preview.png"
            alt="Peeking Puppies"
            className="puppy-top"
          />

          <div className="health-result-box">
            {searchTerm === "" ? (
              <p>🐶 Start typing a breed name…</p>
            ) : selectedBreed ? (
             <BreedHealthCard
  name={selectedBreed}
  data={healthData[selectedBreed]}
  ageGroup={ageGroup}
/>

            ) : matchedBreeds.length > 1 ? (
              <p>✨ Keep typing to narrow the breed…</p>
            ) : (
              <p>❌ No breed found</p>
            )}
          </div>
        </div>

        {searchTerm && (
          <button
            id="backButton"
            onClick={() => {
              setSearchTerm("");
              setSuggestions([]);
            }}
          >
            🔙 Clear
          </button>
        )}
      </section>

      {/* GENERAL HEALTH SECTION */}
      <section className="health-section">
        <div className="health-card">
          <div className="icon">🩺</div>
          <h3>Common Health Issues</h3>
          <p>
            Dogs can face issues like joint problems, skin allergies,
            obesity, ear infections, or dental disease.
          </p>
        </div>

        <div className="health-card">
          <div className="icon">💉</div>
          <h3>Preventive Care</h3>
          <p>
            Vaccinations, deworming, flea & tick control and yearly vet checkups
            keep your dog safe.
          </p>
        </div>

        <div className="health-card">
          <div className="icon">🍽️</div>
          <h3>Diet</h3>
          <p>
            Feed balanced meals, avoid overfeeding, and keep water available.
          </p>
        </div>

        <div className="health-card">
          <div className="icon">🏃‍♂️</div>
          <h3>Exercise</h3>
          <p>
            Walks, playtime and mental stimulation help maintain ideal fitness.
          </p>
        </div>

        <div className="health-card">
          <div className="icon">🧼</div>
          <h3>Grooming</h3>
          <p>
            Brushing, bathing, teeth cleaning and ear checks keep dogs fresh.
          </p>
        </div>

        <div className="health-card">
          <div className="icon">❤️</div>
          <h3>Wellbeing Tips</h3>
          <p>
            Dogs thrive on affection, training, bonding and social play.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-note">
        <p>BreedLy © 2025 — For Every Tail Wag and Happy Bark 🐾</p>
        <p style={{ fontSize: "1.1rem" }}>🐕 Built with Love for Every Pup</p>
      </footer>
    </div>
  );
}

// ============================================================
//                    BREED HEALTH CARD
// ============================================================
function BreedHealthCard({ name, data, ageGroup }) {
  return (
    <div>
      <div className="health-warning">
        ⚠️ Educational only — not a vet replacement
      </div>

      <h3>{name}</h3>

      {ageGroup && (
        <p className="age-context">
          Showing guidance for a <strong>{ageGroup}</strong> dog 🐾
        </p>
      )}

      <img src={data.image} alt={name} />

      {ageGroup && data.age_warnings?.[ageGroup] && (
        <div className="age-warning-box">
          <h4>⚠️ {ageGroup.toUpperCase()} WARNINGS</h4>
          <ul>
            {data.age_warnings[ageGroup].map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {ageGroup && data.daily_care_plan?.[ageGroup] && (
        <div className="daily-care-box">
          <h4>🗓️ Daily Care Plan</h4>
          <p><strong>Meals:</strong> {data.daily_care_plan[ageGroup].meals}</p>
          <p><strong>Exercise:</strong> {data.daily_care_plan[ageGroup].exercise}</p>
          <p><strong>Grooming:</strong> {data.daily_care_plan[ageGroup].grooming}</p>
          <p><strong>Notes:</strong> {data.daily_care_plan[ageGroup].notes}</p>
        </div>
      )}
  
      <p><strong>Lifespan:</strong> {data.lifespan}</p>
      <p><strong>Weight:</strong> {data.weight}</p>

      <h4>🐶 Nature</h4>
      <ul>
        {data.nature.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h4>⚠️ Health Issues</h4>
      {data.common_health_issues.map((issue, i) => (
        <div key={i}>
          <p><strong>{issue.issue}</strong></p>
          <p>{issue.description}</p>
          <p><em>Tip:</em> {issue.tip}</p>
        </div>
      ))}

      <h4>🛡️ Preventive Care</h4>
      <p><strong>Vaccines:</strong> {data.preventive_care.vaccinations.join(", ")}</p>
      <p><strong>Deworming (Puppies):</strong> {data.preventive_care.deworming.puppies}</p>
      <p><strong>Deworming (Adults):</strong> {data.preventive_care.deworming.adults}</p>
      <p><strong>Tick/Flea:</strong> {data.preventive_care.tick_flea_control}</p>
      <p><strong>Spay/Neuter:</strong> {data.preventive_care.spay_neuter}</p>
      <p><strong>Vet Checks:</strong> {data.preventive_care.annual_vet_checks.join(", ")}</p>

      <h4>🍽️ Diet</h4>
      <p>Protein: {data.diet.protein}</p>
      <p>Fat: {data.diet.fat}</p>
      <p>Carbs: {data.diet.carbs}</p>
      <p>Fiber: {data.diet.fiber}</p>
      <p><strong>Good Foods:</strong> {data.diet.good_foods.join(", ")}</p>
      <p><strong>Treats:</strong> {data.diet.treats}</p>
      <p><strong>Water:</strong> {data.diet.hydration}</p>

      <h4>🏃 Exercise</h4>
      <p><strong>Daily Walks:</strong> {data.exercise.daily_walks}</p>
      <p><strong>Play:</strong> {data.exercise.play.join(", ")}</p>
      <p><strong>Training:</strong> {data.exercise.training}</p>

      <h4>🛁 Grooming</h4>
      <p><strong>Brushing:</strong> {data.grooming.brushing}</p>
      <p><strong>Bathing:</strong> {data.grooming.bathing}</p>
      <p><strong>Ears:</strong> {data.grooming.ear_cleaning}</p>
      <p><strong>Nails:</strong> {data.grooming.nail_clipping}</p>
      <p><strong>Dental:</strong> {data.grooming.dental_care}</p>

      <h4>💛 Tips</h4>
      <ul>
        {data.wellbeing_tips.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>

      <h4>🌟 Golden Rule</h4>
      <blockquote>{data.golden_rule}</blockquote>
    </div>
  );
}
