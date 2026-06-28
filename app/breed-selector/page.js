'use client';
import './breed-selector.css';
import { useState, useEffect } from 'react';
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti';
import {
  Building2, Home, Box, LayoutGrid, Maximize,
  Sprout, Trees, Mountain, Wind, Flame, Baby, Smile,
  Gamepad2, CheckCircle, XCircle, Stethoscope, HelpCircle,
  Cat, Dog, PawPrint, Timer, Clock, Hourglass, User, Footprints,
  Dumbbell, Sparkles, Activity, Moon, Coffee, Shield, Compass,
  Volume2, Volume1, VolumeX, Brain, BookOpen, GraduationCap,
  Syringe, Minimize2, Scale, Maximize2, Droplet, Bath, Brush,
  Scissors, MinusCircle, Heart
} from 'lucide-react';

const PawIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z" />
  </svg>
);

const TipIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
  </svg>
);

const OPTION_ICONS = {
  home1: Building2, home2: Home, house: Home, bungalow: Trees, space1: Box,
  space2: LayoutGrid, space3: Maximize, yard1: Sprout, yard2: Trees, yard3: Mountain,
  ac_yes: Wind, ac_no: Flame, child1: Baby, child2: Smile, child3: Gamepad2,
  check: CheckCircle, cross: XCircle, allergy: Stethoscope, smile: Smile,
  question: HelpCircle, cat: Cat, dog: Dog, both: PawPrint, time1: Timer,
  time2: Clock, time3: Hourglass, exercise1: User, exercise2: Footprints,
  exercise3: Dumbbell, playful1: Sparkles, playful2: Activity, sleep: Moon,
  calm: Coffee, shield: Shield, independent: Compass, sound_high: Volume2,
  sound_medium: Volume1, sound_mute: VolumeX, brain: Brain, book: BookOpen,
  cap: GraduationCap, needle: Syringe, size_small: Minimize2, size_medium: Scale,
  size_large: Maximize2, bottle: Droplet, soap: Bath, comb: Brush, scissors: Scissors,
  subtract: MinusCircle
};

const questions = [
  // 1. Home & environment
  {
    question: "What type of home do you live in?",
    tip: "Apartment dwellers may prefer smaller or quieter breeds.",
    why: "Some breeds are prone to excessive barking or have high energy levels that require space, making them unsuitable for close neighbors.",
    options: [
      { text: "1BHK", subtitle: "Small Space", icon: "home1" },
      { text: "2-3BHK", subtitle: "Medium Space", icon: "home2" },
      { text: "House", subtitle: "More Space", icon: "house" },
      { text: "Bungalow", subtitle: "Abundant Space", icon: "bungalow" }
    ]
  },
  {
    question: "How much indoor space will your dog have?",
    tip: "Dogs need space to stretch and move comfortably.",
    why: "Indoor space dictates how easily a dog can maneuver and play inside without knocking things over.",
    options: [
      { text: "Very little", subtitle: "Cozy setup", icon: "space1" },
      { text: "Moderate", subtitle: "Average layout", icon: "space2" },
      { text: "Spacious", subtitle: "Room to run", icon: "space3" }
    ]
  },
  {
    question: "How much outdoor space is available?",
    tip: "Some breeds need large yards, others are fine with less.",
    why: "Certain working breeds require a secure area to roam, whereas others are happy with leash walks.",
    options: [
      { text: "None", subtitle: "Indoors only", icon: "cross" },
      { text: "Small yard", subtitle: "Potty breaks", icon: "yard1" },
      { text: "Large yard", subtitle: "Space to fetch", icon: "yard2" },
      { text: "Open field", subtitle: "Unrestricted", icon: "yard3" }
    ]
  },
  {
    question: "Do you have air conditioning?",
    tip: "Thick-fur breeds like Huskies need a cool environment.",
    why: "Breeds adapted to cold climates can suffer heatstroke easily in warm, unconditioned environments.",
    options: [
      { text: "Yes", subtitle: "Climate control", icon: "ac_yes" },
      { text: "No", subtitle: "Natural temp", icon: "ac_no" }
    ]
  },
  // 2. Household & people
  {
    question: "Do you have children at home?",
    tip: "Kid-friendly breeds are gentler and more patient.",
    why: "Small children may inadvertently play rough. We look for sturdy, tolerant breeds for families.",
    options: [
      { text: "No children", subtitle: "Adults only", icon: "cross" },
      { text: "Ages 0–5", subtitle: "Toddlers", icon: "child1" },
      { text: "Ages 6–12", subtitle: "Kids", icon: "child2" },
      { text: "Teenagers 13+", subtitle: "Older kids", icon: "child3" }
    ]
  },
  {
    question: "Will your dog interact with children regularly?",
    tip: "Cuddly breeds love being with children.",
    why: "Even if you don't have kids, a dog in a neighborhood with children needs to have a calm disposition.",
    options: [
      { text: "Yes", subtitle: "Frequent visitors", icon: "check" },
      { text: "No", subtitle: "Rarely", icon: "cross" }
    ]
  },
  {
    question: "Is anyone allergic to dogs or dog hair?",
    tip: "Hypoallergenic or low-shedding breeds may be better.",
    why: "Allergies are triggered by dander. We will filter for breeds that produce minimal dander.",
    options: [
      { text: "Yes", subtitle: "Need hypoallergenic", icon: "allergy" },
      { text: "No", subtitle: "No issues", icon: "smile" },
      { text: "Not sure", subtitle: "Play it safe", icon: "question" }
    ]
  },
  {
    question: "Do you have other pets at home?",
    tip: "Some breeds are more sociable with other animals.",
    why: "Certain breeds have high prey drives (chasing cats) or can be territorial with other dogs.",
    options: [
      { text: "No", subtitle: "Only pet", icon: "cross" },
      { text: "Cats", subtitle: "Feline friends", icon: "cat" },
      { text: "Other dogs", subtitle: "Canine pack", icon: "dog" },
      { text: "Both", subtitle: "Full house", icon: "both" }
    ]
  },
  // 3. Time & experience
  {
    question: "How much time can you dedicate to your dog daily?",
    tip: "Dogs thrive on attention and routine.",
    why: "Includes walking, training, and bonding. High-energy dogs become destructive if ignored.",
    options: [
      { text: "< 1 hour", subtitle: "Very busy", icon: "time1" },
      { text: "1–2 hours", subtitle: "Balanced schedule", icon: "time2" },
      { text: "3+ hours", subtitle: "Lots of free time", icon: "time3" }
    ]
  },
  {
    question: "How much daily exercise can you provide?",
    tip: "Some breeds require long walks or runs daily.",
    why: "Physical activity is non-negotiable for working and sporting breeds to stay healthy.",
    options: [
      { text: "< 30 mins", subtitle: "Quick strolls", icon: "exercise1" },
      { text: "30–60 mins", subtitle: "Daily walks", icon: "exercise2" },
      { text: "1–2 hours", subtitle: "Active routine", icon: "exercise3" },
      { text: "2+ hours", subtitle: "Athlete", icon: "exercise3" }
    ]
  },
  {
    question: "How much time will your dog spend alone each day?",
    tip: "Independent breeds do better when left alone.",
    why: "Dogs are pack animals. Too much isolation causes separation anxiety in certain breeds.",
    options: [
      { text: "< 2 hrs", subtitle: "Rarely alone", icon: "time1" },
      { text: "2–5 hrs", subtitle: "Part-time away", icon: "time2" },
      { text: "5–8 hrs", subtitle: "Work day", icon: "time2" },
      { text: "8+ hrs", subtitle: "Long shifts", icon: "time3" }
    ]
  },
  {
    question: "Have you owned a dog before?",
    tip: "First-timers may want easier-to-train breeds.",
    why: "Stubborn or giant breeds require confident handling and prior experience to train effectively.",
    options: [
      { text: "Yes", subtitle: "Experienced", icon: "check" },
      { text: "No", subtitle: "First timer", icon: "cross" }
    ]
  },
  // 4. Lifestyle & preferences
  {
    question: "What's your activity level?",
    tip: "Dogs need matching energy! Active people = active breeds.",
    why: "Aligning your lifestyle ensures neither you nor the dog is overwhelmed or under-stimulated.",
    options: [
      { text: "Very active", subtitle: "Hiking/Running", icon: "exercise3" },
      { text: "Moderate", subtitle: "Walking/Yoga", icon: "exercise2" },
      { text: "Low", subtitle: "Relaxed/Indoors", icon: "exercise1" }
    ]
  },
  {
    question: "How playful should your dog be?",
    tip: "Energetic dogs need families who can play with them.",
    why: "A highly playful dog demands constant engagement, which can be exhausting for a relaxed household.",
    options: [
      { text: "Very playful", subtitle: "Always ready", icon: "playful1" },
      { text: "Moderately playful", subtitle: "Balanced", icon: "playful2" },
      { text: "Low energy", subtitle: "Couch potato", icon: "sleep" }
    ]
  },
  {
    question: "Which best describes your ideal dog's personality?",
    tip: "Choose a personality that suits your lifestyle.",
    why: "Personality traits are deeply ingrained in breed genetics.",
    options: [
      { text: "Playful", subtitle: "Goofy & fun", icon: "playful1" },
      { text: "Calm", subtitle: "Gentle & relaxed", icon: "calm" },
      { text: "Protective", subtitle: "Watchful guard", icon: "shield" },
      { text: "Friendly", subtitle: "Loves everyone", icon: "smile" },
      { text: "Independent", subtitle: "Does their thing", icon: "independent" }
    ]
  },
  {
    question: "How much barking can you tolerate?",
    tip: "Quieter breeds are better for apartments.",
    why: "Some breeds were bred specifically to bark and alert (hounds, terriers), which is hard to train out.",
    options: [
      { text: "Loud & frequent", subtitle: "I don't mind", icon: "sound_high" },
      { text: "Some barking", subtitle: "Alerts only", icon: "sound_medium" },
      { text: "Prefer quiet", subtitle: "Silent type", icon: "sound_mute" }
    ]
  },
  {
    question: "How much training are you willing to provide?",
    tip: "Some breeds are easier to train than others.",
    why: "Highly intelligent breeds can become destructive if they aren't given 'jobs' or mental puzzles.",
    options: [
      { text: "A lot", subtitle: "I enjoy training", icon: "brain" },
      { text: "Just the basics", subtitle: "Sit & stay", icon: "book" },
      { text: "Already trained", subtitle: "Prefer older dog", icon: "cap" }
    ]
  },
  {
    question: "Are you okay with dogs prone to health issues?",
    tip: "Some breeds need regular vet care or special attention.",
    why: "Flat-faced breeds (pugs, bulldogs) or giants often come with steep medical bills and shorter lifespans.",
    options: [
      { text: "Yes", subtitle: "Financially ready", icon: "needle" },
      { text: "No", subtitle: "Want robust health", icon: "cross" },
      { text: "Not sure", subtitle: "Prefer fewer risks", icon: "question" }
    ]
  },
  // 5. Dog specifics
  {
    question: "What size of dog do you prefer?",
    tip: "If you live in a smaller space, consider a smaller dog.",
    why: "Size affects food costs, physical handling, and space requirements in your home.",
    options: [
      { text: "Small", subtitle: "Under 7kg", icon: "size_small" },
      { text: "Medium", subtitle: "7–14kg", icon: "size_medium" },
      { text: "Medium-Large", subtitle: "14–23kg", icon: "size_large" },
      { text: "Large", subtitle: "23–50kg", icon: "size_large" },
      { text: "Very Large", subtitle: "50kg+", icon: "size_large" },
      { text: "No preference", subtitle: "Any size fits", icon: "question" }
    ]
  },
  {
    question: "How much grooming can you manage?",
    tip: "Long-coated breeds require more grooming time.",
    why: "Grooming requirements vary significantly. Heavy shedders or dogs with hair (like poodles) need frequent professional cuts.",
    options: [
      { text: "Daily", subtitle: "High Maintenance", icon: "bottle" },
      { text: "Weekly", subtitle: "Moderate Care", icon: "soap" },
      { text: "Occasional", subtitle: "Easy Care", icon: "comb" },
      { text: "Minimal Care", subtitle: "Wash & Go", icon: "scissors" }
    ]
  },
  {
    question: "How important is low shedding to you?",
    tip: "Low-shedding breeds are great for cleanliness & allergies.",
    why: "Some breeds 'blow their coat' twice a year, leaving hair on every piece of furniture.",
    options: [
      { text: "Very important", subtitle: "Clean house", icon: "check" },
      { text: "Somewhat", subtitle: "I can vacuum", icon: "subtract" },
      { text: "Not important", subtitle: "Hair is fine", icon: "cross" }
    ]
  }
];

const SECTIONS = [
  { label: "Home", icon: Home, range: [0, 3] },
  { label: "Household", icon: Building2, range: [4, 7] },
  { label: "Time", icon: Clock, range: [8, 11] },
  { label: "Lifestyle", icon: Heart, range: [12, 17] },
  { label: "Dog", icon: Dog, range: [18, 20] },
];

export default function BreedSelector() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [slideAnim, setSlideAnim] = useState("qs-slide-left-in");
  const [finished, setFinished] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [statusText, setStatusText] = useState("🐾 Finding your perfect match...");

  // Smooth percentage counter for the loader
  useEffect(() => {
    if (!finished) return;
    const duration = 3000;
    const interval = 30;
    const step = 100 / (duration / interval);
    
    const timer = setInterval(() => {
      setLoadPct(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [finished]);

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

  const currentSection = SECTIONS.findIndex(
    (s) => currentQuestion >= s.range[0] && currentQuestion <= s.range[1]
  );

  const handleAnswer = (answer) => {
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);

    // Proceed to next slide with delay to let user see selection
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setSlideAnim("qs-slide-left-out");
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setShowWhy(false);
          setSlideAnim("qs-slide-left-in");
        }, 200);
      } else {
        setSlideAnim("qs-fade-out");
        setTimeout(() => {
          setFinished(true);
          localStorage.setItem('breedlyAnswers', JSON.stringify(updated));
          setTimeout(() => router.push('/results'), 3200);
        }, 200);
      }
    }, 350);
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    setSlideAnim("qs-slide-right-out");
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setShowWhy(false);
      setSlideAnim("qs-slide-right-in");
    }, 200);
  };

  if (finished) {
    return (
      <ProtectedRoute>
        <div className="qs-page" style={{ background: '#FBF7F2', padding: 0, justifyContent: 'center' }}>
          
          <div className="qs-premium-loader">
            {/* Background Decorative Landscape */}
            <div className="qs-loader-bg">
              <svg className="qs-wave qs-wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="#F2EBE1" fillOpacity="0.5" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
              <svg className="qs-wave qs-wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="#EAE0D3" fillOpacity="0.4" d="M0,256L60,245.3C120,235,240,213,360,213.3C480,213,600,235,720,240C840,245,960,235,1080,208C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
              </svg>
              
              <div className="qs-bg-dog-left">
                <Dog strokeWidth={1} style={{ width: 48, height: 48, color: '#8B5E3C' }} />
              </div>
              <div className="qs-bg-dog-right">
                <PawPrint strokeWidth={1} style={{ width: 32, height: 32, color: '#8B5E3C' }} />
              </div>
            </div>

            <div className="qs-loader-content">
              {/* Circular Indicator */}
              <div className="qs-circle-wrap">
                <svg className="qs-circle-svg" viewBox="0 0 100 100">
                  <circle className="qs-circle-track" cx="50" cy="50" r="46" />
                  <circle 
                    className="qs-circle-fill" 
                    cx="50" cy="50" r="46" 
                    style={{ strokeDashoffset: 289 - (289 * loadPct) / 100 }} 
                  />
                </svg>
                <div 
                  className="qs-circle-dot" 
                  style={{ transform: `rotate(${loadPct * 3.6}deg)` }}
                />
                <div className="qs-circle-inner-paw">
                  <PawIcon style={{ width: 28, height: 28, color: '#8B5E3C' }} />
                </div>
              </div>

              {/* Text */}
              <h1 className="qs-loader-title">Finding your perfect match</h1>
              <p className="qs-loader-desc">
                Analyzing your answers and matching you with the best dog breeds.
              </p>

              {/* Horizontal Progress */}
              <div className="qs-loader-progress-wrap">
                <div className="qs-loader-progress-track">
                  <div className="qs-loader-progress-fill" style={{ width: `${loadPct}%` }}>
                    <div className="qs-loader-thumb">
                      <PawIcon style={{ width: 10, height: 10, color: '#8B5E3C' }} />
                    </div>
                  </div>
                </div>
                <div className="qs-loader-pct">{Math.round(loadPct)}%</div>
              </div>
            </div>

            {/* Footer */}
            <div className="qs-loader-footer">
              <Shield style={{ width: 14, height: 14, color: '#A3A3A3' }} />
              <span>Your answers are safe</span>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="qs-page">

        <div className="qs-top">
          <div className="qs-brand">
            <PawIcon style={{ width: 22, height: 22, color: 'var(--qs-accent-dark)' }} /> BreedLy
          </div>
          <p className="qs-tagline">Find your perfect pup match</p>
        </div>

        <div className="qs-sections">
          {SECTIONS.map((s, i) => {
            const SectionIcon = s.icon;
            return (
              <div
                key={s.label}
                className={`qs-section-dot${i < currentSection ? " qs-section-done" : ""}${i === currentSection ? " qs-section-active" : ""}`}
              >
                <span><SectionIcon /></span>
                <p>{s.label}</p>
              </div>
            );
          })}
        </div>

        <section className={`qs-card ${slideAnim}`}>

          <div className="qs-question-wrap">
            {currentQuestion === questions.length - 2 && (
              <span className="qs-almost"> Almost there! Just one more question.</span>
            )}
            <span className="qs-q-num">Step {currentQuestion + 1} of {questions.length}</span>
            <h2 className="qs-question">{q.question}</h2>
            
            <div className="qs-tip-wrap">
              <p className="qs-tip">
                <TipIcon style={{ width: 14, height: 14, marginRight: 5, color: 'var(--qs-accent-dark)' }} />
                {q.tip}
              </p>
              <button className="qs-why-ask" onClick={() => setShowWhy(!showWhy)}>
                {showWhy ? "Hide" : "Why we ask?"}
              </button>
              {showWhy && (
                <div className="qs-why-content">
                  {q.why}
                </div>
              )}
            </div>
          </div>

          <div className={`qs-options${q.options.length > 4 ? " qs-options--wide" : ""}`}>
            {q.options.map((opt, i) => {
              const IconComp = OPTION_ICONS[opt.icon];
              return (
                <button
                  key={i}
                  className={`qs-option${answers[currentQuestion] === opt.text ? " qs-option--selected" : ""}`}
                  onClick={() => handleAnswer(opt.text)}
                >
                  <span className="qs-opt-icon">
                    {IconComp ? <IconComp style={{ width: 26, height: 26 }} /> : null}
                  </span>
                  <span className="qs-opt-text">{opt.text}</span>
                  {opt.subtitle && <span className="qs-opt-sub">{opt.subtitle}</span>}
                </button>
              );
            })}
          </div>

          <div className="qs-progress-wrap">
            <div className="qs-progress-track">
              <div
                className="qs-progress-fill"
                style={{ width: `${progressWidth}%` }}
              />
              <span
                className={`qs-paw-icon${isBouncing ? " qs-paw-bounce" : ""}`}
                style={{ left: `${progressWidth}%`, color: 'var(--qs-accent-dark)' }}
              >
                <PawIcon style={{ width: 22, height: 22 }} />
              </span>
            </div>
            <div className="qs-progress-labels">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progressWidth)}% Complete</span>
            </div>
          </div>

          <div className="qs-nav">
            <button
              className="qs-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              ← Back
            </button>
            
            <span className="qs-step">{currentQuestion + 1} / {questions.length}</span>
            
            {answers[currentQuestion] && currentQuestion < questions.length - 1 ? (
              <button
                className="qs-skip-btn"
                onClick={() => handleAnswer(answers[currentQuestion])}
              >
                Next →
              </button>
            ) : (
              <span className="qs-hint">Tap any option</span>
            )}
          </div>

        </section>

        <p className="qs-quote">
          "Dogs do speak, but only to those who know how to listen."
        </p>

      </div>
    </ProtectedRoute>
  );
}