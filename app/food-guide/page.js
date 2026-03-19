"use client";
import "./food.css";
import { useEffect, useState } from "react";
import { breedFoodData } from "../data/food";

export default function FoodGuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoLoaded, setAutoLoaded] = useState(false);
  const [ageGroup, setAgeGroup] = useState(null); // "puppy" | "adult"
  const [dogAllergies, setDogAllergies] = useState([]);
  const [dogWeight, setDogWeight] = useState(null);

  useEffect(() => {
    const dogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const activeId = localStorage.getItem("activeDogId");

    if (!activeId || dogs.length === 0) return;

    const activeDog = dogs.find((d) => d.id === activeId);
    if (!activeDog) return;

    setSearchTerm(activeDog.breed);

    // Age group
    setAgeGroup(activeDog.age < 1 ? "puppy" : "adult");
    setDogWeight(activeDog.weight);

    // 🧠 Allergies
    if (activeDog.allergies) {
      setDogAllergies(
        activeDog.allergies.split(",").map((a) => a.trim().toLowerCase())
      );
    }
  }, []);

  const getWeightNote = (weight) => {
    if (!weight) return null;

    if (weight < 5) {
      return "🪶 Small dog — feed slightly smaller portions";
    }
    if (weight >= 5 && weight <= 20) {
      return "⚖️ Medium-sized dog — standard portions apply";
    }
    if (weight > 20) {
      return "💪 Large dog — may require higher protein & quantity";
    }
  };
  const estimateMonthlyCost = (weight) => {
    if (!weight) return null;

    if (weight < 5) {
      return {
        food: "6–8 kg / month",
        cost: "₹1,500 – ₹2,500",
        note: "Small breeds eat less but need quality nutrition",
      };
    }

    if (weight >= 5 && weight <= 20) {
      return {
        food: "10–14 kg / month",
        cost: "₹2,500 – ₹4,000",
        note: "Balanced diet with controlled portions",
      };
    }

    if (weight > 20) {
      return {
        food: "18–25 kg / month",
        cost: "₹4,000 – ₹6,500",
        note: "Large dogs need higher quantity & protein",
      };
    }
  };

  const breeds = Object.keys(breedFoodData);
  // Only match breed if user has typed something
  const matchedBreed = searchTerm
    ? breeds.find((breed) =>
        breed.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : null;

  return (
    <div className="food-guide-page">
      {/* HEADER */}
      <header className="food-header">
        <div className="food-header-content">
          <img
            src="/assets/dog eating.png"
            alt="Dog Bowl"
            className="food-dog-img"
          />
          <div className="food-text">
            <h1>🍽️ Dog Food Guide</h1>
            <p>Because every tail wag starts with the right bite 🐕</p>
          </div>
        </div>
      </header>

      {/* SEARCH SECTION */}
      <section className="breed-food-search">
        <h2>🔍 Find Feeding Tips by Breed</h2>

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

          <div id="breedResult" className="food-result-box">
            {!matchedBreed && (
              <p>🐾 Start typing a breed to see specific food tips!</p>
            )}

            {matchedBreed && (
              <div>
                {autoLoaded && (
                  <p style={{ color: "#4e148c", fontWeight: 600 }}>
                    🐾 Showing food guide for your dog
                  </p>
                )}
                {ageGroup && (
                  <p style={{ color: "#4e148c", fontWeight: 600 }}>
                    🐾 Showing {ageGroup === "puppy" ? "Puppy" : "Adult"}{" "}
                    feeding guide
                  </p>
                )}

                <h2>{matchedBreed} 🍖</h2>
                {dogAllergies.length > 0 && (
                  <div className="allergy-warning">
                    ⚠️ <strong>Allergy Alert:</strong> Avoid foods containing{" "}
                    {dogAllergies.join(", ")}
                  </div>
                )}

                {/* Nutrient Needs */}
                <h3>📌 Nutrient Needs</h3>
                <ul>
                  {Object.entries(
                    breedFoodData[matchedBreed].nutrient_needs
                  ).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key.replace("_", " ")}:</strong> {value}
                    </li>
                  ))}
                </ul>

                {/* Good Foods */}
                <h3>🥗 Good Foods</h3>
                {Object.entries(breedFoodData[matchedBreed].good_foods).map(
                  ([category, items]) => (
                    <div key={category}>
                      <h4>{category.toUpperCase()}</h4>
                      <ul>
                        {items.map((item, i) => (
                          <li
                            key={i}
                            className={
                              dogAllergies.some((allergy) =>
                                item.toLowerCase().includes(allergy)
                              )
                                ? "unsafe-food"
                                : ""
                            }
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}

                {dogWeight && (
                  <p className="weight-note">{getWeightNote(dogWeight)}</p>
                )}

                <h3>🍱 Daily Portions</h3>

                {ageGroup === "adult" && (
                  <>
                    <h4>🐕 Adult Dog</h4>
                    <p>
                      Meals per day:{" "}
                      {
                        breedFoodData[matchedBreed].daily_portions.adult
                          .meals_per_day
                      }
                    </p>
                    <p>
                      Amount:{" "}
                      {breedFoodData[matchedBreed].daily_portions.adult.amount}
                    </p>
                    <ul>
                      {breedFoodData[
                        matchedBreed
                      ].daily_portions.adult.example.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </>
                )}

                {ageGroup === "puppy" && (
                  <>
                    <h4>🐶 Puppy</h4>
                    <p>
                      Meals per day:{" "}
                      {
                        breedFoodData[matchedBreed].daily_portions.puppy
                          .meals_per_day
                      }
                    </p>
                    <p>
                      {breedFoodData[matchedBreed].daily_portions.puppy.note}
                    </p>
                  </>
                )}

                {/* fallback if user searched manually */}
                {!ageGroup && (
                  <p>ℹ️ Select a dog profile to see age-specific portions.</p>
                )}
                {dogWeight && (
                  <div className="monthly-cost-box">
                    <h3>💸 Monthly Food Estimate</h3>
                    {(() => {
                      const estimate = estimateMonthlyCost(dogWeight);
                      if (!estimate) return null;

                      return (
                        <>
                          <p>
                            <strong>Estimated food:</strong> {estimate.food}
                          </p>
                          <p>
                            <strong>Approx cost:</strong> {estimate.cost}
                          </p>
                          <p className="cost-note">ℹ️ {estimate.note}</p>
                        </>
                      );
                    })()}
                  </div>
                )}
                <p className="disclaimer">
                  ⚠️ Costs are approximate and depend on food quality, portion
                  size, and activity level.
                </p>

                {/* Foods to Avoid */}
                <h3>❌ Foods to Avoid</h3>
                <ul>
                  {breedFoodData[matchedBreed].foods_to_avoid.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>

                {/* Routine Care */}
                <h3>🩺 Routine Care</h3>
                {Object.entries(breedFoodData[matchedBreed].routine_care).map(
                  ([key, value]) => (
                    <p key={key}>
                      <strong>{key.replace("_", " ")}:</strong>{" "}
                      {Array.isArray(value) ? value.join(", ") : value}
                    </p>
                  )
                )}

                {/* Recipes */}
                <h3>🍳 Easy Recipes</h3>
                {breedFoodData[matchedBreed].recipes.map((recipe, i) => (
                  <div className="recipe-box" key={i}>
                    <h4>{recipe.title}</h4>
                    <strong>Ingredients:</strong>
                    <ul>
                      {recipe.ingredients.map((ing, j) => (
                        <li key={j}>{ing}</li>
                      ))}
                    </ul>
                    <strong>Instructions:</strong>
                    <ul>
                      {recipe.instructions.map((step, j) => (
                        <li key={j}>{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Notes */}
                <h3>📝 Notes</h3>
                <ul>
                  {breedFoodData[matchedBreed].notes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOD CARDS SECTION */}
      <section className="food-section">
        <div className="food-card">
          <div className="icon">🥩</div>
          <h3>Protein</h3>
          <p>
            Dogs thrive on a protein-rich diet from meats like chicken, fish, or
            eggs. Adjust % to breed, age & activity.
          </p>
        </div>
        <div className="food-card">
          <div className="icon">🥗</div>
          <h3>Balanced Diet</h3>
          <p>
            Include carbs (rice, oats), veggies, and fiber for digestion. Tailor
            portions to size & health.
          </p>
        </div>
        <div className="food-card">
          <div className="icon">🚫</div>
          <h3>Foods to Avoid</h3>
          <p>
            Never feed chocolate, onions, grapes, or excess human treats. Watch
            for allergies!
          </p>
        </div>
        <div className="food-card">
          <div className="icon">🥕</div>
          <h3>Healthy Treats</h3>
          <p>
            Use carrot sticks, apple slices, or boiled eggs for guilt-free
            rewards. Avoid sugary treats.
          </p>
        </div>
        <div className="food-card">
          <div className="icon">💧</div>
          <h3>Hydration</h3>
          <p>
            Fresh, clean water should always be available. Hydration is key for
            digestion and health.
          </p>
        </div>
        <div className="food-card">
          <div className="icon">📏</div>
          <h3>Portion Control</h3>
          <p>
            Measure meals. Overfeeding causes obesity. Stick to a schedule &
            adjust as your dog ages.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-note">
        <p>BreedLy © 2025 — Happy Tummies, Happy Tails 🐶</p>
        <p>🍖 Crafted with care for every hungry pup!</p>
      </footer>
    </div>
  );
}
