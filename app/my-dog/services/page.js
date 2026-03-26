"use client";
import { useEffect, useState } from "react";
import "./services.css";

export default function DogServicesPage() {
  const [activeDog, setActiveDog] = useState(null);

  useEffect(() => {
    const storedDogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const activeId = localStorage.getItem("activeDogId");
    
    // Find the dog marked as active, or default to the first one
    const dog = storedDogs.find(d => d.id === activeId) || storedDogs[0];
    if (dog) setActiveDog(dog);
  }, []);

  const locationName = activeDog?.city || "your area";

  return (
    <main className="services-page">
      <header className="services-header">
        <span className="location-badge">Nearby Services</span>
        <h1>Curated for <em>{locationName}</em></h1>
        <p className="subtitle">
          We are building a verified network of providers to help {activeDog?.name || "your dog"} thrive.
        </p>
      </header>

      <div className="services-grid">
        <div className="service-card highlight">
          <div className="service-icon">🏥</div>
          <h3>Veterinary Clinics</h3>
          <p>Emergency care, routine vaccinations, and wellness checkups.</p>
          <div className="status-pill">Beta Access Soon</div>
        </div>

        <div className="service-card">
          <div className="service-icon">🧼</div>
          <h3>Grooming & Spa</h3>
          <p>Professional coat care, nail trimming, and relaxing baths.</p>
          <div className="status-pill">Planned</div>
        </div>

        <div className="service-card">
          <div className="service-icon">🎾</div>
          <h3>Trainers & behavior</h3>
          <p>Certified experts for obedience and puppy socialization.</p>
          <div className="status-pill">Planned</div>
        </div>

        <div className="service-card">
          <div className="service-icon">🏡</div>
          <h3>Boarding & Sitting</h3>
          <p>Verified homes and boutiques for safe overnight stays.</p>
          <div className="status-pill">Planned</div>
        </div>
      </div>

      <footer className="services-footer">
        <p>Want to list a service? <a href="#">Contact our partnership team</a></p>
      </footer>
    </main>
  );
}