"use client";
import "./breed.css";
import { useParams, useRouter } from "next/navigation";
import { breeds } from "../../data/breeds";
import { useState } from "react";

export default function BreedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const breedName = normalize(decodeURIComponent(params.breed).replace(/-/g, " "));
  const breedKey = Object.keys(breeds).find((b) => normalize(b) === breedName);
  const breed = breeds[breedKey];

  if (!breed) {
    return (
      <div className="breed-info" style={{ padding: "20px", textAlign: "center" }}>
        <h1>Breed Not Found</h1>
        <p>Try going back and selecting again.</p>
      </div>
    );
  }

  return (
    <div className="breed-detail-page">
      <div className="breed-info">
        {/* Breed Hero */}
        <section className="breed-hero">
          <img src={breed.image || ""} alt={breedKey} />
          <div>
            <h1>{breed.basic_info?.name || "N/A"}</h1>
            <p className="tagline">{breed.basic_info?.ideal_home || "N/A"}</p>
          </div>
        </section>

        {/* Basic Info */}
        <section className="basic-info">
          <h2>🐶 Basic Info</h2>
          <ul>
            <li><strong>Nicknames:</strong> {breed.basic_info?.nicknames?.join(", ") || "N/A"}</li>
            <li><strong>Origin:</strong> {breed.basic_info?.origin || "N/A"}</li>
            <li><strong>Breed Group:</strong> {breed.basic_info?.breed_group || "N/A"}</li>
            <li><strong>Size:</strong> {breed.basic_info?.size || "N/A"}</li>
            <li><strong>Popularity:</strong> {breed.basic_info?.popularity || "N/A"}</li>
            <li><strong>Best Known For:</strong> {breed.basic_info?.best_known_for || "N/A"}</li>
            <li><strong>One-line Summary:</strong> {breed.basic_info?.one_sentence_summary || "N/A"}</li>
            <li><strong>Climate Note:</strong> {breed.basic_info?.climate_note || "N/A"}</li>
          </ul>
        </section>

        {/* Quick Overview */}
        <section className="quick-overview">
          <h2>⚡ Quick Overview</h2>
          <ul>
            <li><strong>Lifespan:</strong> {breed.quick_overview?.lifespan || "N/A"}</li>
            <li><strong>Weight:</strong> Male: {breed.quick_overview?.weight?.male || "N/A"}, Female: {breed.quick_overview?.weight?.female || "N/A"}</li>
            <li><strong>Height:</strong> Male: {breed.quick_overview?.height?.male || "N/A"}, Female: {breed.quick_overview?.height?.female || "N/A"}</li>
            <li><strong>Energy Level:</strong> {breed.quick_overview?.energy_level || "N/A"}</li>
            <li><strong>Maintenance Level:</strong> {breed.quick_overview?.maintenance_level || "N/A"}</li>
            <li><strong>Shedding Level:</strong> {breed.quick_overview?.shedding_level || "N/A"}</li>
            <li><strong>Trainability:</strong> {breed.quick_overview?.trainability || "N/A"}</li>
            <li><strong>Temperament:</strong> {breed.quick_overview?.temperament || "N/A"}</li>
            <li><strong>Apartment Friendly:</strong> {breed.quick_overview?.apartment_friendly || "N/A"}</li>
            <li><strong>First-time Owner Friendly:</strong> {breed.quick_overview?.first_time_owner_friendly || "N/A"}</li>
          </ul>
        </section>

        {/* Personality */}
        <section className="personality">
          <h2>💛 Personality & Temperament</h2>
          <p>{breed.personality_and_temperament?.overview || "N/A"}</p>

          <h3>Key Traits</h3>
          <ul>
            {breed.personality_and_temperament?.key_traits?.length > 0 
              ? breed.personality_and_temperament.key_traits.map((t, i) => <li key={i}>{t}</li>)
              : <li>N/A</li>
            }
          </ul>

          <h3>Social Behavior</h3>
          <ul>
            {breed.personality_and_temperament?.social_behavior
              ? Object.entries(breed.personality_and_temperament.social_behavior).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Personality Highlights</h3>
          <ul>
            {breed.personality_and_temperament?.personality_highlights?.length > 0
              ? breed.personality_and_temperament.personality_highlights.map((p, i) => <li key={i}>{p}</li>)
              : <li>N/A</li>
            }
          </ul>

          <h3>Quirky Habits</h3>
          <ul>
            {breed.personality_and_temperament?.quirky_habits?.length > 0
              ? breed.personality_and_temperament.quirky_habits.map((q, i) => <li key={i}>{q}</li>)
              : <li>N/A</li>
            }
          </ul>

          <h3>Behavioral Traits</h3>
          <ul>
            {breed.personality_and_temperament?.behavioral_traits
              ? Object.entries(breed.personality_and_temperament.behavioral_traits).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>
        </section>

        {/* Appearance & Coat */}
        <section className="appearance">
          <h2>🎨 Appearance & Coat</h2>
          <p>{breed.appearance_and_coat?.general_look || "N/A"}</p>

          <h3>Coat Details</h3>
          <ul>
            {breed.appearance_and_coat?.coat_details
              ? Object.entries(breed.appearance_and_coat.coat_details).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {Array.isArray(v) ? v.join(", ") : v.toString()}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Distinct Features</h3>
          <ul>
            {breed.appearance_and_coat?.distinct_features?.length > 0
              ? breed.appearance_and_coat.distinct_features.map((f, i) => <li key={i}>{f}</li>)
              : <li>N/A</li>
            }
          </ul>

          <p>
            <strong>Climate Challenges:</strong> {breed.appearance_and_coat?.climate_challenges || "N/A"}
          </p>
        </section>

        {/* Exercise & Training */}
        <section className="exercise">
          <h2>🏃‍♂️ Exercise & Activity</h2>
          <p>{breed.exercise_and_activity?.daily_requirement || "N/A"}</p>
          <p>{breed.exercise_and_activity?.why_exercise_is_critical || "N/A"}</p>
          <h3>Recommended Activities</h3>
          <ul>
            {breed.exercise_and_activity?.recommended_activities?.length > 0
              ? breed.exercise_and_activity.recommended_activities.map((a, i) => <li key={i}>{a}</li>)
              : <li>N/A</li>
            }
          </ul>
          <p><strong>Energy Note:</strong> {breed.exercise_and_activity?.energy_note || "N/A"}</p>
        </section>

        <section className="training">
          <h2>🧠 Training & Intelligence</h2>
          <p><strong>Intelligence Level:</strong> {breed.training_and_intelligence?.intelligence_level || "N/A"}</p>
          <p>{breed.training_and_intelligence?.training_experience || "N/A"}</p>

          <h3>Learning Ability</h3>
          <ul>
            {breed.training_and_intelligence?.learning_ability
              ? Object.entries(breed.training_and_intelligence.learning_ability).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Common Roles</h3>
          <ul>
            {breed.training_and_intelligence?.common_roles?.length > 0
              ? breed.training_and_intelligence.common_roles.map((r, i) => <li key={i}>{r}</li>)
              : <li>N/A</li>
            }
          </ul>
        </section>

        {/* Grooming & Maintenance */}
        <section className="grooming">
          <h2>🧹 Grooming & Maintenance</h2>
          <p>{breed.grooming_and_maintenance?.overall_effort || "N/A"}</p>

          <h3>Grooming Needs</h3>
          <ul>
            {breed.grooming_and_maintenance?.grooming_needs
              ? Object.entries(breed.grooming_and_maintenance.grooming_needs).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Seasonal Notes</h3>
          <ul>
            {breed.grooming_and_maintenance?.seasonal_notes
              ? Object.entries(breed.grooming_and_maintenance.seasonal_notes).map(([k, v], i) => (
                  <li key={i}><strong>{k}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <p><strong>Shedding Warning:</strong> {breed.grooming_and_maintenance?.shedding_warning || "N/A"}</p>

          <h3>Professional Grooming</h3>
          <ul>
            <li><strong>Frequency:</strong> {breed.grooming_and_maintenance?.professional_grooming?.frequency || "N/A"}</li>
            <li><strong>Services:</strong> {breed.grooming_and_maintenance?.professional_grooming?.services?.join(", ") || "N/A"}</li>
          </ul>
        </section>

        {/* Lifestyle & Living Requirements */}
        <section className="lifestyle">
          <h2>🏡 Living Requirements & Lifestyle Compatibility</h2>

          <h3>Space</h3>
          <ul>
            <li><strong>Minimum:</strong> {breed.living_requirements?.space?.minimum || "N/A"}</li>
            <li><strong>Ideal:</strong> {breed.living_requirements?.space?.ideal || "N/A"}</li>
          </ul>

          <h3>Home Lifestyle</h3>
          <ul>
            {breed.living_requirements?.home_lifestyle
              ? Object.entries(breed.living_requirements.home_lifestyle).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {v}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Climate</h3>
          <ul>
            {breed.living_requirements?.climate
              ? Object.entries(breed.living_requirements.climate).map(([k, v], i) => (
                  <li key={i}><strong>{k.replace("_", " ")}:</strong> {Array.isArray(v) ? v.join(", ") : v.toString()}</li>
                ))
              : <li>N/A</li>
            }
          </ul>

          <h3>Quick Decision Guide</h3>
          <p><strong>Get a Golden if:</strong> {breed.lifestyle_compatibility?.quick_decision_guide?.get?.join(", ") || "N/A"}</p>
          <p><strong>Skip a Golden if:</strong> {breed.lifestyle_compatibility?.quick_decision_guide?.skip?.join(", ") || "N/A"}</p>
        </section>

        {/* History & Origin */}
        <section className="history">
          <h2>📜 History & Origin</h2>
          <ul>
            <li><strong>Origin Country:</strong> {breed.history_origin?.origin_country || "N/A"}</li>
            <li><strong>Developed In:</strong> {breed.history_origin?.developed_in || "N/A"}</li>
            <li><strong>Developed By:</strong> {breed.history_origin?.developed_by || "N/A"}</li>
            <li><strong>Original Purpose:</strong> {breed.history_origin?.original_purpose || "N/A"}</li>
            <li><strong>Key Traits Developed For:</strong> {breed.history_origin?.key_traits_developed_for?.join(", ") || "N/A"}</li>
            <li><strong>Recognition:</strong> UK: {breed.history_origin?.recognition?.uk || "N/A"}, US: {breed.history_origin?.recognition?.us || "N/A"}</li>
            <li><strong>Modern Roles:</strong> {breed.history_origin?.modern_roles?.join(", ") || "N/A"}</li>
          </ul>
        </section>

        {/* Fun Facts */}
        {breed.fun_facts?.length > 0 && (
          <section className="fun-facts">
            <h2>🐾 Fun Facts</h2>
            <ul>{breed.fun_facts.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </section>
        )}

        {/* FAQs */}
        {breed.common_questions?.length > 0 && (
          <section className="faqs">
            <h2>❓ Common Questions</h2>
            {breed.common_questions.map((q, i) => (
              <div key={i}>
                <p><strong>{q.question}</strong></p>
                <p>{q.answer}</p>
              </div>
            ))}
          </section>
        )}

        {/* Real Owner Reviews */}
        {breed.real_owner_reviews && (
          <section className="owner-reviews">
            <h2>📝 Real Owner Reviews</h2>
            <h3>Positive</h3>
            <ul>{breed.real_owner_reviews?.positive?.length > 0 ? breed.real_owner_reviews.positive.map((r, i) => <li key={i}>{r}</li>) : <li>N/A</li>}</ul>
            <h3>Challenges</h3>
            <ul>{breed.real_owner_reviews?.challenges?.length > 0 ? breed.real_owner_reviews.challenges.map((c, i) => <li key={i}>{c}</li>) : <li>N/A</li>}</ul>
            <p><strong>Overall Sentiment:</strong> {breed.real_owner_reviews?.overall_sentiment || "N/A"}</p>
          </section>
        )}

        {/* Final Verdict */}
        {breed.final_verdict && (
          <section className="final-verdict">
            <h2>🏅 Final Verdict</h2>
            <p>{breed.final_verdict}</p>
          </section>
        )}
      </div>

      {/* Video Section */}
      {breed.video && !videoError && (
        <div className="video-section">
          <h2>🎥 Watch this Breed in Action!</h2>
          <video controls playsInline onError={() => setVideoError(true)}>
            <source src={breed.video} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Next Steps */}
      <section className="next-steps">
        <h2>🐾 What’s the Next Step?</h2>
        <p>Choosing a dog is a long-term commitment. Let’s help you decide responsibly.</p>
        <div className="step-actions">
          <button onClick={() => router.push('/adoption-guide')}>🏡 Adoption Checklist</button>
        </div>
      </section>

      <div className="dog-quote-banner">🐶 Every dog is a story waiting to be loved. 🐾</div>
    </div>
  );
}
