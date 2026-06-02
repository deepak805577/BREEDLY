"use client";

import { useRouter } from "next/navigation";
import "./chat.css";

const SAMPLE_QS = [
  { q: "What should I feed my 3-month Labrador?", icon: "🥗" },
  { q: "How often should I bathe a Shih Tzu?", icon: "✂️" },
  { q: "My dog keeps barking at night — why?", icon: "🔊" },
  { q: "When does a puppy need its first vaccine?", icon: "🩺" },
  { q: "Is it safe for dogs to eat mango?", icon: "🍋" },
  { q: "How do I stop my dog from pulling on the leash?", icon: "🐕" },
];

export default function ChatLandingPage() {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    try {
      router.push(url);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  return (
    <div className="cp-page">

      {/* HERO SECTION */}
      <section className="cp-hero">
        <div className="cp-hero-glow" />
        
        <div className="cp-hero-content">
          <span className="cp-eyebrow">AI Canine Assistant</span>
          
          <h1 className="cp-hero-title">
            Ask anything about<br />
            <em>your companion.</em>
          </h1>

          <p className="cp-hero-sub">
            Breed-aware, veterinary-aligned intelligence. Instantly get tailored guidance on nutrition, wellness, behaviors, and grooming.
          </p>

          <div className="cp-hero-chips">
            <span className="chip-badge">Nutrition</span>
            <span className="chip-badge">Wellness</span>
            <span className="chip-badge">Training</span>
            <span className="chip-badge">Grooming</span>
            <span className="chip-badge">Breed Science</span>
          </div>

          <button
            className="cp-hero-cta"
            onClick={() => handleNavigation("/chat/main")}
          >
            Start Conversation
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* SAMPLE QUESTIONS SECTION */}
      <section className="cp-samples">
        <div className="cp-samples-inner">
          <span className="cp-eyebrow" style={{ textAlign: "center", display: "block" }}>
            Popular Queries
          </span>

          <h2 className="cp-section-title">
            What dog owners ask every day.
          </h2>

          <div className="cp-sample-grid">
            {SAMPLE_QS.map(({ q, icon }) => (
              <button
                key={q}
                className="cp-sample-q"
                onClick={() => handleNavigation(`/chat/main?q=${encodeURIComponent(q)}`)}
              >
                <span className="cp-sample-icon">{icon}</span>
                <span className="cp-sample-text">{q}</span>
                <span className="cp-sample-arrow">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="cp-trust">
        <div className="cp-trust-inner">
          <span className="cp-eyebrow">
            Safety & vet alignment
          </span>

          <h2>Responsible AI for thoughtful dog care.</h2>

          <p>
            Our assistant delivers personalized, breed-specific context derived from evidence-backed veterinary references. It serves as a helpful educational reference, not a replacement for professional clinic diagnostics.
          </p>

          <div className="cp-trust-pills">
            <span className="trust-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 6 }}><path d="M20 6L9 17l-5-5"/></svg>
              Breed-Specific Algorithms
            </span>
            <span className="trust-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 6 }}><path d="M20 6L9 17l-5-5"/></svg>
              Evidence-Informed Advice
            </span>
            <span className="trust-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: 6 }}><path d="M20 6L9 17l-5-5"/></svg>
              Always Vet-First Decisions
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}