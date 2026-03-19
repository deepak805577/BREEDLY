// app/breed-selector/page.js
'use client';
import './breed-selector.css';
import { useState } from 'react';
import { useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti'; // npm install react-confetti
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
    question: "Which best describes your ideal dog’s personality?",
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


export default function BreedSelector() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fade, setFade] = useState(true);
  const [finished, setFinished] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);


useEffect(() => {
  const newProgress = ((currentQuestion + 1) / questions.length) * 100;
  const timer = setTimeout(() => setProgressWidth(newProgress), 50);
  return () => clearTimeout(timer);
}, [currentQuestion]);
useEffect(() => {
  if (currentQuestion === 0) return; // skip initial load
  setIsBouncing(true);
  const timer = setTimeout(() => setIsBouncing(false), 500);
  return () => clearTimeout(timer);
}, [currentQuestion]);


useEffect(() => {
  const newProgress = ((currentQuestion + 1) / questions.length) * 100;
  const timer = setTimeout(() => setProgressWidth(newProgress), 50);
  return () => clearTimeout(timer);
}, [currentQuestion]);


  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    // Save answer
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);

    // Trigger fade-out

    //setFade(false);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFade(true); // fade-in next question
      } else {
        // Quiz finished
        setFinished(true);
        localStorage.setItem('breedlyAnswers', JSON.stringify(updatedAnswers));

        // Redirect after 2s
        setTimeout(() => router.push('/results'), 2000);
      }
    }, 300); // fade duration
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    setFade(false);

    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setFade(true);
    }, 200);
  };

  return (
        <ProtectedRoute>
    <div className="quiz-page">
      {finished && <Confetti />}
      {/* Header */}
      <div className="quiz-header-banner">
        <h1>BreedLy 🐶</h1>
        <p>Find your perfect pup match</p>
      </div>

      {/* Quote */}
      <div className="quote-bar">
        “Dogs do speak, but only to those who know how to listen.”
      </div>

      {/* Quiz */}
      <section className={`quiz-container ${fade ? 'fade-in' : 'fade-out'}`}>
        <div className="quiz-header">
          <h2>{q.question}</h2>
          <p className="quiz-tip">{q.tip}</p>
        </div>

        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-circle ${answers[currentQuestion] === opt.text ? 'selected' : ''}`}
              onClick={() => handleAnswer(opt.text)}
            >
              <span>{opt.icon}</span>
              <p>{opt.text}</p>
            </button>
          ))}
        </div>

     <div className="paw-progress">
  <div className="paw-fill" style={{ width: `${progressWidth}%` }} />
  <span
  className={`paw-icon ${isBouncing ? 'bounce' : ''}`}
  style={{ left: `${progressWidth}%` }}
>
  🐾
</span>

</div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="back-btn"
            onClick={handleBack}
            disabled={currentQuestion === 0}
          >
            ← Back
          </button>
          <span className="step-count">{currentQuestion + 1} / {questions.length}</span>
        </div>
      </section>
    </div>
    </ProtectedRoute>
  );
}