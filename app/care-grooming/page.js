"use client";
import "./care.css";
import { useEffect, useState } from "react";
import { breedGroomingAndCare } from "../data/care";

export default function CareGroomingGuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null);
  const [dogWeight, setDogWeight] = useState(null);

  useEffect(() => {
    const dogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const activeId = localStorage.getItem("activeDogId");

    if (!activeId || dogs.length === 0) return;

    const activeDog = dogs.find((d) => String(d.id) === String(activeId));
    if (!activeDog) return;

    setSearchTerm(activeDog.breed || "");
    setAgeGroup(activeDog.age < 1 ? "puppy" : "adult");
    setDogWeight(activeDog.weight || null);
    setAutoLoaded(true);
  }, []);

  const breeds = Object.keys(breedGroomingAndCare);
  const matchedBreed = searchTerm
    ? breeds.find((b) => b.toLowerCase().includes(searchTerm.toLowerCase()))
    : null;

  const breedData = matchedBreed ? breedGroomingAndCare[matchedBreed] : null;

  return (
    <div className="food-guide-page">
      {/* HEADER */}
      <header className="food-header">
        <div className="food-header-content">
          <img src="/care.png" alt="Dog Grooming" className="food-dog-img" />
          <div className="food-text">
            <h1>✂️ Care & Grooming Guide</h1>
            <p>Healthy coat, clean paws & a happy pup 🐶</p>
          </div>
        </div>
      </header>

      {/* SEARCH */}
      <section className="breed-food-search">
        <h2>🔍 Find Grooming Tips by Breed</h2>

        <input
          type="text"
          id="breedSearch"
          placeholder="Type a breed name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />


        <div className="breed-result-wrapper">
          <img
            src="/assets/download-removebg-preview.png"
            alt="Peeking Puppies"
            className="puppy-top"
          />

          <div className="food-result-box">
            {!matchedBreed && <p>🐶 Start typing a breed name</p>}

            {matchedBreed && breedData && (
              <>
                {autoLoaded && (
                  <p style={{ color: "#4e148c", fontWeight: 600 }}>
                    🐾 Showing care guide for your dog
                  </p>
                )}
                {ageGroup && (
                  <p style={{ color: "#4e148c", fontWeight: 600 }}>
                    🐾 {ageGroup === "puppy" ? "Puppy" : "Adult"} grooming routine
                  </p>
                )}

                <h2>{matchedBreed}</h2>

                {/* OVERVIEW */}
                {breedData.overview && (
                  <>
                    <h3>ℹ️ Overview</h3>
                    <ul>
                      {Object.entries(breedData.overview).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key.replace("_", " ")}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* GROOMING */}
                {breedData.grooming && (
                  <>
                    <h3>🛁 Grooming</h3>
                    <ul>
                      {Object.entries(breedData.grooming).map(([key, value]) =>
                        typeof value === "object" ? (
                          <li key={key}>
                            <strong>{key.replace("_", " ")}:</strong>{" "}
                            {value.frequency} {value.purpose || value.notes || value.tips || ""}
                          </li>
                        ) : (
                          <li key={key}>
                            <strong>{key.replace("_", " ")}:</strong> {value}
                          </li>
                        )
                      )}
                    </ul>

                    <h4>🧰 Grooming Tools</h4>
                    <ul>
                      {breedData.grooming_tools.map((tool, i) => (
                        <li key={i}>{tool}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* ROUTINE CARE */}
                {breedData.routine_care && (
                  <>
                    <h3>🩺 Routine Care</h3>
                    <p>
                      <strong>Exercise:</strong> {breedData.routine_care.exercise}
                    </p>
                    <p>
                      <strong>Grooming Time:</strong>{" "}
                      {breedData.routine_care.grooming_time}
                    </p>
                    <p>
                      <strong>Professional Grooming:</strong>{" "}
                      {breedData.routine_care.professional_grooming}
                    </p>

                    <h4>Daily Upkeep</h4>
                    <ul>
                      {breedData.routine_care.daily_upkeep.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>

                    <h4>💡 Tips</h4>
                    <ul>
                      {breedData.routine_care.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* SEASONAL CARE */}
                {breedData.seasonal_care && (
                  <>
                    <h3>🌦 Seasonal Care</h3>
                    {Object.entries(breedData.seasonal_care).map(([season, tips]) => (
                      <div key={season}>
                        <h4>{season.charAt(0).toUpperCase() + season.slice(1)}</h4>
                        <ul>
                          {tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </>
                )}

                {/* COST */}
                {breedData.cost_estimate && (
                  <div className="monthly-cost-box">
                    <h3>💰 Grooming Cost Estimate</h3>
                    <p>Monthly: {breedData.cost_estimate.monthly}</p>
                    <p>Yearly: {breedData.cost_estimate.yearly}</p>
                    <ul>
                      {breedData.cost_estimate.includes.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
 {/* QUICK CARDS */}
      <section className="food-section">
        {[
          ["🛁", "Bathing", "Use dog-safe shampoo and avoid frequent washing."],
          ["🪮", "Brushing", "Reduces shedding and keeps coat healthy."],
          ["✂️", "Trimming", "Keep paw and face hair neat & hygienic."],
          ["🦷", "Dental Care", "Prevents gum disease and bad breath."],
          ["🐾", "Paw Care", "Protect paws from heat, cold & cracks."],
          ["🧼", "Clean Ears", "Regular cleaning prevents infections."],
        ].map(([icon, title, desc], i) => (
          <div className="food-card" key={i}>
            <div className="icon">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
      {/* FOOTER */}
      <footer className="footer-note">
        <p>BreedLy © 2025 — Clean Coats, Happy Paws 🐾</p>
        <p>✂️ Crafted with care for every dog!</p>
      </footer>
    </div>
  );
}
