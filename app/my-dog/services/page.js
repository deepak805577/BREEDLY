"use client";
import "./services.css";

export default function DogServicesPage() {
  const city = "Your City"; // later: dynamic from dog profile

  return (
    <main className="services-page">
      <h1>📍 Dog Services Near You</h1>
      <p className="subtitle">
        Helpful services for your dog in <strong>{city}</strong>
      </p>

      <div className="services-grid">

        <div className="service-card">
          <h3>🏥 Veterinary Clinics</h3>
          <p>Regular checkups, vaccinations, emergency care.</p>
          <span className="tag">Coming soon</span>
        </div>

        <div className="service-card">
          <h3>🛁 Grooming & Spa</h3>
          <p>Baths, nail trimming, coat care.</p>
          <span className="tag">Coming soon</span>
        </div>

        <div className="service-card">
          <h3>🏫 Trainers & Behavior</h3>
          <p>Basic obedience, puppy training.</p>
          <span className="tag">Coming soon</span>
        </div>

        <div className="service-card">
          <h3>🏠 Boarding & Daycare</h3>
          <p>Safe stay when you're away.</p>
          <span className="tag">Planned</span>
        </div>

      </div>
    </main>
  );
}
