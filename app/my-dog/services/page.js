"use client";
import { useEffect, useState } from "react";
import { Activity, Scissors, Award, Home, Sparkles, Clock } from "lucide-react";
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
      <header className="services-hero-header">
        {/* Dot texture */}
        <svg className="services-dot-texture">
          <defs>
            <pattern id="dots-sv" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="#7F5539" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-sv)" />
        </svg>
        <div className="services-hero-radial-glow" />

        <div className="fg-fade services-hero-content-wrapper">
          <div className="services-hero-inner">
            <div className="services-hero-text-block">
              <span className="location-badge">Nearby Services</span>
              <h1 className="services-hero-title">
                Curated for <span className="services-location-italic">{locationName}</span>
              </h1>
              <p className="services-hero-subtitle">
                We are building a verified network of providers to help {activeDog?.name || "your dog"} thrive.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="services-content-section">
        <div className="services-grid">
          <div className="service-card highlight">
            <div className="service-icon-container">
              <Activity size={24} className="service-icon-svg" />
            </div>
            <h3>Veterinary Clinics</h3>
            <p>Emergency care, routine vaccinations, and wellness checkups.</p>
            <div className="status-pill">
              <Sparkles size={11} className="status-pill-icon" /> Beta Access Soon
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <Scissors size={24} className="service-icon-svg" />
            </div>
            <h3>Grooming & Spa</h3>
            <p>Professional coat care, nail trimming, and relaxing baths.</p>
            <div className="status-pill">
              <Clock size={11} className="status-pill-icon" /> Planned
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <Award size={24} className="service-icon-svg" />
            </div>
            <h3>Trainers & behavior</h3>
            <p>Certified experts for obedience and puppy socialization.</p>
            <div className="status-pill">
              <Clock size={11} className="status-pill-icon" /> Planned
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon-container">
              <Home size={24} className="service-icon-svg" />
            </div>
            <h3>Boarding & Sitting</h3>
            <p>Verified homes and boutiques for safe overnight stays.</p>
            <div className="status-pill">
              <Clock size={11} className="status-pill-icon" /> Planned
            </div>
          </div>
        </div>
      </section>

      {/* <footer className="services-footer">
        <p>Want to list a service? <a href="#">Contact our partnership team</a></p>
      </footer> */}
    </main>
  );
}