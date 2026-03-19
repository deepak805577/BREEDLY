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
    .replace(/[^\w\s]/g, "")   // remove symbols ((), ., etc.)
    .replace(/\s+/g, " ")      // normalize spaces
    .trim();

const breedName = normalize(
  decodeURIComponent(params.breed).replace(/-/g, " ")
);

     // ✔ Find in object instead of array
 const breedKey = Object.keys(breeds).find(
  (b) => normalize(b) === breedName
);

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
      {/* Background */}
     { /*<div className="bg-image-wrapper">
        <img src="/assets/bgg1.png" alt="Dog background" />
      </div>
}
      {/* Breed Info Container */}
      <div className="breed-info">
     <section className="breed-hero">
  <img src={breed.image} alt={breedKey} />
  <div>
    <h1>{breedKey}</h1>
    <p className="tagline">{breed.bestFor}</p>
  </div>
</section>

        {/* Description */}
        <div className="desc">
          <h2>Description</h2>
          <p>{breed.description}</p>
        </div>
   
        {/* Traits */}
        {breed.traits && (
          <div className="traits">
            <h2>Key Traits</h2>
            <ul>{breed.traits.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </div>
        )}

        {/* Pros & Cons */}
        {breed.pros && breed.cons && (
          <div className="pros-cons">
            <h2>Pros</h2>
            <ul>{breed.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>

            <h2>Cons</h2>
            <ul>{breed.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </div>
        )}

        {/* Grooming */}
        {breed.grooming && (
          <div className="grooming">
            <h2>Grooming Needs</h2>
            <ul>{breed.grooming.map((g, i) => <li key={i}>{g}</li>)}</ul>
          </div>
        )}

        {/* Exercise */}
        {breed.exercise && (
          <div className="exercise">
            <h2>Daily Exercise</h2>
            <p>{breed.exercise}</p>
          </div>
        )}

        {/* Notes */}
        {breed.notes && (
          <div className="notes">
            <h2>Special Notes</h2>
            <ul>{breed.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
          </div>
        )}

        {/* Lifespan */}
        {breed.lifespan && (
          <div className="lifespan">
            <h2>Average Lifespan</h2>
            <p>{breed.lifespan}</p>
          </div>
        )}

        {/* Best For */}
        {breed.bestFor && (
          <div className="bestfor">
            <h2>Best For</h2>
            <p>{breed.bestFor}</p>
          </div>
        )}
<p className="health-disclaimer">
  ⚠️ Health information is for educational purposes only and not a substitute for veterinary advice.
</p>

        {/* Health Guide */}
    {breed.healthAwareness && (
  <section className="health-awareness">
    <h2>🩺 Health Awareness</h2>

    {breed.healthAwareness.commonIssues && (
      <>
        <h3>Common Health Concerns</h3>
        <ul>
          {breed.healthAwareness.commonIssues.map((issue, i) => (
            <li key={i}>
              <strong>{issue.name}:</strong> {issue.note}
            </li>
          ))}
        </ul>
      </>
    )}

    {breed.healthAwareness.preventionTips && (
      <>
        <h3>General Prevention Tips</h3>
        <ul>
          {breed.healthAwareness.preventionTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </>
    )}

    <p className="health-disclaimer">
      ⚠️ {breed.healthAwareness.disclaimer}
    </p>
  </section>
)}

      </div>

      
    {/* Video Section */}
{breed.video && !videoError && (
  <div className="video-section">
    <h2>🎥 Watch this Breed in Action!</h2>
    <video
      controls
      playsInline
      onError={() => setVideoError(true)} // auto-remove on failure
    >
      <source src={breed.video} type="video/mp4" />
    </video>
  </div>
)}


      {/* Fun Facts */}
      {breed.funFacts && (
        <div className="fun-facts">
          <h2>🐾 Fun Facts About This Breed!</h2>
          <ul>{breed.funFacts.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}

      {/* <div className="back-link">
        <a href="/results" className="back-link">← Back to results</a>
        <a href="/breeds" className="back-link">← Back to All Breeds</a>

      
      </div> */}
      
      <section className="next-steps">
  <h2>🐾 What’s the Next Step?</h2>
  <p>
    Choosing a dog is a long-term commitment. Let’s help you decide responsibly.
  </p>

  <div className="step-actions">
    <button onClick={() => router.push('/adoption-guide')}>
      🏡 Adoption Checklist
    </button>
  </div>
</section>

     

      {/* Dog Quote */}
      <div className="dog-quote-banner">
        🐶 Every dog is a story waiting to be loved. 🐾
      </div>
    </div>
  );
}
body {
  font-family: "Fredoka", sans-serif;
  margin: 0;
  text-align: center;
  animation: fadeIn 1s ease-in-out;
  position: relative;
  overflow-x: hidden;
  background: var(--bg);
  color: var(--text);
}
@font-face {
  font-family: "Dogica";
  src: url("/fonts/Dogica.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}

.breed-info {
  padding: 40px 20px;
}

.bg-image-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.bg-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
  pointer-events: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.breed-info {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: auto;
  background: #fffdf9;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px dashed #ffcc99;
  animation: slideUp 0.7s ease forwards;
}

.breed-info img {
  width: 100%;
  max-width: 480px;
  height: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.breed-info h1 {
  color: #8b4e1d;
  font-size: 2.4rem;
  margin-bottom: 10px;
  font-family: "Baloo 2", cursive;
  position: relative;
  z-index: 1;
}

.breed-info h1::before {
  content: "🐾";

  position: relative;
  z-index: 1 !important;
  left: -30px;
  top: 0;
}

.breed-info h1::after {
  content: "🐶";
  position: relative;
  z-index: 1 !important;
  right: -30px;
  top: 0;
}

.breed-info h2 {
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.breed-info .desc,
.breed-info .traits,
.breed-info .pros-cons,
.breed-info .grooming,
.breed-info .exercise,
.breed-info .notes,
.breed-info .lifespan,
.breed-info .bestfor {
  text-align: left;
  margin: 20px 0;
  animation: fadeIn 1s ease-in-out;
  padding: 10px 15px;
  background: #fff5e6;
  border-left: 5px solid #ffa94d;
  border-radius: 12px;
}

.breed-info ul {
  padding-left: 20px;
  color: #333;
}

.breed-info ul li {
  margin-bottom: 8px;
}

.video-section {
  padding-bottom: 20px;
  position: relative;
  z-index: 2;
  margin-top: 40px;
  text-align: center;
  animation: fadeIn 1.2s ease-in-out;
}

.video-section h2 {
  color: #8b4e1d;
  font-size: 1.6rem;
  margin-bottom: 20px;
  font-family: "Fredoka", sans-serif;
}

.video-section video {
  width: 100%;
  max-width: 500px;
  height: 400px;
  border-radius: 16px;
  box-shadow: 0 12px 18px rgba(0, 0, 0, 0.12);
  background-color: #000;
  transition: transform 0.3s ease;
}

.video-section video:hover {
  transform: scale(1.02);
}

.back-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px auto;
}

.back-link {
  background: #ff7a00;
  color: #fff;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #ffaa3c;
  transform: scale(1.05);
}
.next-steps {
  margin-top: 50px;
  padding: 30px;
  background: linear-gradient(135deg, #fff3e6, #fef9f4);
  border-radius: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.next-steps h2 {
  margin-bottom: 10px;
}

.next-steps p {
  color: #555;
  margin-bottom: 20px;
}

.step-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.step-actions button {
  padding: 12px 18px;
  border-radius: 12px;
  background: #645040;
  border: none;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.step-actions button:hover {
  background: #ab8b6f;
}

@media (max-width: 600px) {
  .breed-info h1 {
    font-size: 1.8rem;
  }

  .video-section h2 {
    font-size: 1.3rem;
  }

  .video-section video {
    height: auto;
    max-height: 300px;
    border-radius: 12px;
  }

  .breed-info img {
    width: 100%;
    height:100%;
  }
}
/* 🐶 Quote Banner */
.dog-quote-banner {
  position: absolute;
  margin: 0;
  background: transparent;
  padding: 15px 10px;
  width: 100%;
  color: #8b4e1d;
  font-size: 1.3rem;
  font-family: "Baloo 2", cursive;
  border-bottom: 3px dashed #ffcc99;
}

html,
body {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.bg-image-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.bg-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}
