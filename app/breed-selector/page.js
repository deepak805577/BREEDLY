// app/breed-selector/page.js
'use client';
import './breed-selector.css';
import { useState, useEffect } from 'react';
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti';

const questions = [
  // 1. Home & environment
  {
    question: "What type of home do you live in?",
    tip: "Apartment dwellers may prefer smaller or quieter breeds.",
    options: [
      { text: "1BHK", icon: "🏙️" },
      { text: "2-3BHK", icon: "🏢" },
      { text: "House", icon: "🏡" },
      { text: "Bungalow", icon: "🏯" }
    ]
  },
  {
    question: "How much indoor space will your dog have?",
    tip: "Dogs need space to stretch and move comfortably.",
    options: [
      { text: "Very little", icon: "📏" },
      { text: "Moderate", icon: "📐" },
      { text: "Spacious", icon: "🏡" }
    ]
  },
  {
    question: "How much outdoor space is available?",
    tip: "Some breeds need large yards, others are fine with less.",
    options: [
      { text: "None", icon: "🚫" },
      { text: "Small yard", icon: "🌱" },
      { text: "Large yard", icon: "🌳" },
      { text: "Open field", icon: "🌾" }
    ]
  },
  {
    question: "Do you have air conditioning?",
    tip: "Thick-fur breeds like Huskies need a cool environment.",
    options: [
      { text: "Yes", icon: "❄️" },
      { text: "No", icon: "🔥" }
    ]
  },
  // 2. Household & people
  {
    question: "Do you have children at home, and what are their ages?",
    tip: "Kid-friendly breeds are gentler and more patient.",
    options: [
      { text: "No children", icon: "🚫" },
      { text: "Ages 0–5", icon: "👶" },
      { text: "Ages 6–12", icon: "🧒" },
      { text: "Teenagers 13+", icon: "🧑" }
    ]
  },
  {
    question: "Will your dog interact with children regularly?",
    tip: "Cuddly breeds love being with children.",
    options: [
      { text: "Yes", icon: "❤️" },
      { text: "No", icon: "🛏️" }
    ]
  },
  {
    question: "Is anyone allergic to dogs or dog hair?",
    tip: "Hypoallergenic or low-shedding breeds may be better.",
    options: [
      { text: "Yes", icon: "🤧" },
      { text: "No", icon: "😊" },
      { text: "Not sure", icon: "❓" }
    ]
  },
  {
    question: "Do you have other pets at home?",
    tip: "Some breeds are more sociable with other animals.",
    options: [
      { text: "No", icon: "🚫" },
      { text: "Cats", icon: "🐱" },
      { text: "Other dogs", icon: "🐕" },
      { text: "Both", icon: "🐱🐕" }
    ]
  },
  // 3. Time & experience
  {
    question: "How much time can you dedicate to your dog daily?",
    tip: "Dogs thrive on attention and routine.",
    options: [
      { text: "< 1 hour", icon: "⏳" },
      { text: "1–2 hours", icon: "🕰️" },
      { text: "3+ hours", icon: "⏱️" }
    ]
  },
  {
    question: "How much daily exercise can you provide?",
    tip: "Some breeds require long walks or runs daily.",
    options: [
      { text: "< 30 mins", icon: "🛋️" },
      { text: "30–60 mins", icon: "🚶‍♀️" },
      { text: "1–2 hours", icon: "🏃‍♂️" },
      { text: "2+ hours", icon: "🏃‍♂️🏃‍♂️" }
    ]
  },
  {
    question: "How much time will your dog spend alone each day?",
    tip: "Independent breeds do better when left alone.",
    options: [
      { text: "< 2 hrs", icon: "⌛" },
      { text: "2–5 hrs", icon: "🕓" },
      { text: "5–8 hrs", icon: "🕗" },
      { text: "8+ hrs", icon: "🕘" }
    ]
  },
  {
    question: "Have you owned a dog before?",
    tip: "First-timers may want easier-to-train breeds.",
    options: [
      { text: "Yes", icon: "👍" },
      { text: "No", icon: "👎" }
    ]
  },
  // 4. Lifestyle & preferences
  {
    question: "What's your activity level?",
    tip: "Dogs need matching energy! Active people = active breeds.",
    options: [
      { text: "Very active", icon: "🏃‍♂️" },
      { text: "Moderate", icon: "🚶‍♀️" },
      { text: "Low", icon: "🛋️" }
    ]
  },
  {
    question: "How playful should your dog be?",
    tip: "Energetic dogs need families who can play with them.",
    options: [
      { text: "Very playful", icon: "🎾" },
      { text: "Moderately playful", icon: "🎲" },
      { text: "Low energy", icon: "🛌" }
    ]
  },
  {
    question: "Which best describes your ideal dog's personality?",
    tip: "Choose a personality that suits your lifestyle.",
    options: [
      { text: "Playful", icon: "😄" },
      { text: "Calm", icon: "😌" },
      { text: "Protective", icon: "🛡️" },
      { text: "Friendly", icon: "🤗" },
      { text: "Independent", icon: "😎" }
    ]
  },
  {
    question: "How much barking can you tolerate?",
    tip: "Quieter breeds are better for apartments.",
    options: [
      { text: "Loud & frequent", icon: "🔊" },
      { text: "Some barking", icon: "🔉" },
      { text: "Prefer quiet", icon: "🔇" }
    ]
  },
  {
    question: "How much training are you willing to provide?",
    tip: "Some breeds are easier to train than others.",
    options: [
      { text: "A lot — I enjoy it", icon: "🧠" },
      { text: "Just the basics", icon: "📘" },
      { text: "Prefer already trained", icon: "🎓" }
    ]
  },
  {
    question: "Are you okay with dogs prone to health issues or high maintenance?",
    tip: "Some breeds need regular vet care or special attention.",
    options: [
      { text: "Yes", icon: "💉" },
      { text: "No", icon: "❌" },
      { text: "Not sure", icon: "❓" }
    ]
  },
  // 5. Dog specifics
  {
    question: "What size of dog do you prefer?",
    tip: "If you live in a smaller space, consider a smaller dog.",
    options: [
      { text: "Small (7kg & under)", icon: "🐶" },
      { text: "Medium (7–14kg)", icon: "🐕" },
      { text: "Medium-Large (14–23kg)", icon: "🦮" },
      { text: "Large (23–50kg)", icon: "🐕‍🦺" },
      { text: "Very Large (50kg+)", icon: "🐾" },
      { text: "No preference", icon: "❔" }
    ]
  },
  {
    question: "How much grooming can you manage?",
    tip: "Long-coated breeds require more grooming time.",
    options: [
      { text: "Daily", icon: "🧴" },
      { text: "Weekly", icon: "🧼" },
      { text: "Occasional", icon: "🪮" },
      { text: "Minimal", icon: "✂️" }
    ]
  },
  {
    question: "How important is low shedding to you?",
    tip: "Low-shedding breeds are great for cleanliness & allergies.",
    options: [
      { text: "Very important", icon: "✅" },
      { text: "Somewhat", icon: "➖" },
      { text: "Not important", icon: "🚫" }
    ]
  }
];

/* Section labels for the step indicator */
const SECTIONS = [
  { label: "Home",       range: [0, 3]  },
  { label: "Household",  range: [4, 7]  },
  { label: "Time",       range: [8, 11] },
  { label: "Lifestyle",  range: [12, 17]},
  { label: "Your Dog",   range: [18, 20]},
];

export default function BreedSelector() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers,          setAnswers]         = useState([]);
  const [fade,             setFade]            = useState(true);
  const [finished,         setFinished]        = useState(false);
  const [progressWidth,    setProgressWidth]   = useState(0);
  const [isBouncing,       setIsBouncing]      = useState(false);

  useEffect(() => {
    const pct = ((currentQuestion + 1) / questions.length) * 100;
    const t = setTimeout(() => setProgressWidth(pct), 50);
    return () => clearTimeout(t);
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestion === 0) return;
    setIsBouncing(true);
    const t = setTimeout(() => setIsBouncing(false), 500);
    return () => clearTimeout(t);
  }, [currentQuestion]);

  const q = questions[currentQuestion];

  /* Which section are we in? */
  const currentSection = SECTIONS.findIndex(
    (s) => currentQuestion >= s.range[0] && currentQuestion <= s.range[1]
  );

  const handleAnswer = (answer) => {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFade(true);
      } else {
        setFinished(true);
        localStorage.setItem('breedlyAnswers', JSON.stringify(updated));
        setTimeout(() => router.push('/results'), 2200);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    setFade(false);
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setFade(true);
    }, 200);
  };

  /* ── Finished screen ── */
  if (finished) {
    return (
      <ProtectedRoute>
        <div className="qs-page">
          <Confetti recycle={false} numberOfPieces={260} colors={["#B08968","#E8D8C4","#7F5539","#FAF7F2","#D4A97A"]} />
          <div className="qs-done">
            <div className="qs-done-emoji">🐾</div>
            <h2>All done!</h2>
            <p>Finding your perfect match…</p>
            <div className="qs-done-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="qs-page">

        {/* ── TOP HEADER ── */}
        <div className="qs-top">
          <div className="qs-brand">
            <span>🐾</span> BreedLy
          </div>
          <p className="qs-tagline">Find your perfect pup match</p>
        </div>

        {/* ── SECTION TABS ── */}
        <div className="qs-sections">
          {SECTIONS.map((s, i) => (
            <div
              key={s.label}
              className={`qs-section-dot${i < currentSection ? " qs-section-done" : ""}${i === currentSection ? " qs-section-active" : ""}`}
            >
              <span>{i < currentSection ? "✓" : i + 1}</span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── QUIZ CARD ── */}
        <section className={`qs-card ${fade ? "qs-fade-in" : "qs-fade-out"}`}>

          {/* Question */}
          <div className="qs-question-wrap">
            <span className="qs-q-num">Q{currentQuestion + 1} of {questions.length}</span>
            <h2 className="qs-question">{q.question}</h2>
            <p className="qs-tip">💡 {q.tip}</p>
          </div>

          {/* Options */}
          <div className={`qs-options${q.options.length > 4 ? " qs-options--wide" : ""}`}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`qs-option${answers[currentQuestion] === opt.text ? " qs-option--selected" : ""}`}
                onClick={() => handleAnswer(opt.text)}
              >
                <span className="qs-opt-icon">{opt.icon}</span>
                <span className="qs-opt-text">{opt.text}</span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="qs-progress-wrap">
            <div className="qs-progress-track">
              <div
                className="qs-progress-fill"
                style={{ width: `${progressWidth}%` }}
              />
              <span
                className={`qs-paw-icon${isBouncing ? " qs-paw-bounce" : ""}`}
                style={{ left: `${progressWidth}%` }}
              >
                🐾
              </span>
            </div>
            <div className="qs-progress-labels">
              <span>Start</span>
              <span>{Math.round(progressWidth)}% done</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="qs-nav">
            <button
              className="qs-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              ← Back
            </button>
            <span className="qs-step">{currentQuestion + 1} / {questions.length}</span>
            {answers[currentQuestion] && currentQuestion < questions.length - 1 && (
              <button
                className="qs-skip-btn"
                onClick={() => handleAnswer(answers[currentQuestion])}
              >
                Next →
              </button>
            )}
            {!answers[currentQuestion] && <span className="qs-hint">Tap any option</span>}
          </div>

        </section>

        {/* ── QUOTE ── */}
        <p className="qs-quote">
          "Dogs do speak, but only to those who know how to listen."
        </p>

      </div>
    </ProtectedRoute>
  );
}