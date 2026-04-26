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

      {/* HERO */}
      <section className="cp-hero">
        <div className="cp-hero-glow" />
        <span className="cp-eyebrow">Paw Assistant</span>

        <h1 className="cp-hero-title">
          Ask anything about<br />
          <em>your dog.</em>
        </h1>

        <p className="cp-hero-sub">
          Breed-aware AI advice on food, health, training, and grooming —
          calm, practical answers whenever you need them.
        </p>

        <div className="cp-hero-chips">
          <span>🥗 Nutrition</span>
          <span>🩺 Health</span>
          <span>🐕 Training</span>
          <span>✂️ Grooming</span>
          <span>🧬 Breed info</span>
        </div>

        <button
          className="cp-hero-cta"
          onClick={() => handleNavigation("/chat/main")}
        >
          Start chatting →
        </button>
      </section>

      {/* SAMPLE QUESTIONS */}
      <section className="cp-samples">
        <div className="cp-samples-inner">
          <span className="cp-eyebrow" style={{ textAlign: "center", display: "block" }}>
            Try asking
          </span>

          <h2 className="cp-section-title">
            Questions dog owners ask every day.
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
                <span className="cp-sample-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="cp-trust">
        <span className="cp-eyebrow" style={{ color: "#B08968" }}>
          Responsible by design
        </span>

        <h2>Built for thoughtful dog care.</h2>

        <p>
          Paw Assistant gives you a starting point — not a replacement for your vet.
          Every answer encourages responsible, dog-first decisions.
        </p>

        <div className="cp-trust-pills">
          <span>✔ Breed-specific advice</span>
          <span>✔ Evidence-informed</span>
          <span>✔ Always vet-recommended</span>
        </div>
      </section>

    </div>
  );
}