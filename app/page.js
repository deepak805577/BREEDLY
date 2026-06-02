"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

/* ─── PREMIUM SVG ICON SYSTEM ────────────────────────────────────────────── */
const SVG_ICONS = {
  paw: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z" />
    </svg>
  ),
  star: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  home: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  users: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  heart: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  book: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  target: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  leaf: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 22C2 12 10 4 22 2C22 12 14 20 2 22z" />
      <path d="M9 15L22 2" />
    </svg>
  ),
  shield: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  clock: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  wallet: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  scissors: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 10.12M20 20L8.12 13.88M8.12 12h6" />
    </svg>
  ),
  zap: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  sun: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  moon: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  nutrition: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20h18L19 9H5L3 20z" />
      <path d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3" />
    </svg>
  ),
  health: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  ),
  training: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  exercise: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18.36 18.36a9 9 0 0 1-12.72 0M19.78 19.78A11 11 0 0 1 4.22 4.22m14.14 0A11 11 0 0 1 19.78 19.78M18.36 5.64a9 9 0 0 1 0 12.72M5.64 5.64a9 9 0 0 1 12.72 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  camera: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  mic: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
    </svg>
  ),
  mapPin: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  wave: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 10c3-3 3-3 8 0s5 3 8 0 2-2 4-2" />
      <path d="M2 14c3-3 3-3 8 0s5 3 8 0 2-2 4-2" opacity="0.5" />
    </svg>
  ),
  map: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  sparkles: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  chart: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  bell: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  calendar: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  dog: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* Adorable Floppy Ears with cute organic folds */}
      <path d="M5.5 6c-1.5.5-2.5 2-2.5 4s1 4.5 2.5 5.5c.3.2.7.1.8-.2.2-.4.2-1.2.2-2.2V7.5" fill="none" stroke="currentColor" />
      <path d="M18.5 6c1.5.5 2.5 2 2.5 4s-1 4.5-2.5 5.5c-.3.2-.7.1-.8-.2-.2-.4-.2-1.2-.2-2.2V7.5" fill="none" stroke="currentColor" />

      {/* Main Head Structure */}
      <path d="M12 4.5c-3 0-5.5 1.8-6 5.5-.3 2 .3 4 1.5 5.5v.5c0 1.8 1.8 2.5 4.5 2.5s4.5-.7 4.5-2.5v-.5c1.2-1.5 1.8-3.5 1.5-5.5-.5-3.7-3-5.5-6-5.5z" />

      {/* Soft snout/muzzle */}
      <path d="M9.5 13c0 1.8 1 2.8 2.5 2.8s2.5-1 2.5-2.8c0-1.2-.8-2-2.5-2s-2.5.8-2.5 2z" />

      {/* Cute small nose with standard nostrils */}
      <path d="M11 12.2c.4-.3 1.6-.3 2 0 .2.2.3.4.2.6-.1.3-.5.5-1 .5s-.9-.2-1-.5c-.1-.2 0-.4.2-.6z" fill="currentColor" stroke="none" />

      {/* Smiling mouth with a cute pink tongue sticking out! */}
      <path d="M11.2 14.8c0 .8.4 1.4.8 1.4s.8-.6.8-1.4h-1.6z" fill="#ffb3ba" stroke="currentColor" strokeWidth="1" />
      <path d="M10.8 14c.2.4.6.6 1.2.6s1-.2 1.2-.6" />

      {/* Rosy Cheek Blush marks */}
      <path d="M6.5 12.5a1 1 0 0 0 1-1M16.5 11.5a1 1 0 0 1 1 1" opacity="0.6" strokeWidth="1" />

      {/* Large, glassy, expressive eyes (Cute Pixar/Anime style sparkles) */}
      <circle cx="8.8" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="8.3" cy="9.0" r="0.5" fill="#ffffff" stroke="none" />
      <circle cx="9.2" cy="9.9" r="0.25" fill="#ffffff" stroke="none" />

      <circle cx="15.2" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="9.0" r="0.5" fill="#ffffff" stroke="none" />
      <circle cx="15.6" cy="9.9" r="0.25" fill="#ffffff" stroke="none" />

      {/* Tiny cute eyebrows */}
      <path d="M7.8 7.5c.3-.3.7-.3 1 0M15.2 7.5c.3-.3.7-.3 1 0" strokeWidth="1" />
    </svg>
  ),
  // Specialized breed outlines
  golden: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14.5c.5-1.5.5-3.5-.5-4.5s-2.5-1-3.5.5c-1 1.5-2 1-3-.5-1-1.5-2.5-2.5-4-2.5S5 8.5 5 10c0 1 0 2.5.5 3.5s2 1.5 2 2.5v1.5c0 1 .5 1.5 1.5 1.5h4c1 0 1.5-.5 1.5-1.5V16c0-1 2-1.5 2.5-2.5.3-.7 1-1 2-1V14.5z" />
      <circle cx="7.5" cy="10" r="0.5" fill="currentColor" />
    </svg>
  ),
  shihtzu: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5c-2.5 0-4 1.5-4 4 0 .5-.5 1-1 1s-1.5.5-1.5 1.5S6.5 13 7.5 13c1 0 1.5-.5 2-1.5.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5c.5 1 1 1.5 2 1.5 1 0 2-.5 2-1.5s-1-1.5-1.5-1.5-1-.5-1-1c0-2.5-1.5-4-4-4z" />
      <circle cx="9.5" cy="9" r="0.5" fill="currentColor" />
      <circle cx="14.5" cy="9" r="0.5" fill="currentColor" />
    </svg>
  ),
  beagle: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 18V9a5 5 0 0 1 10 0v1.5a2.5 2.5 0 0 0 2.5 2.5h0A2.5 2.5 0 0 1 21 15.5v1c0 1-.5 1.5-1.5 1.5H6z" />
      <circle cx="13" cy="9" r="0.75" fill="currentColor" />
    </svg>
  ),
};

export default function HomePage() {
  /* ─── Static premium data ───────────────────────────────────────────────── */
  const BREED_PREVIEWS = [
    { name: "Golden Retriever", energy: "High", size: "Large", grooming: "Medium", match: 94, icon: "golden" },
    { name: "Shih Tzu", energy: "Low", size: "Small", grooming: "High", match: 88, icon: "shihtzu" },
    { name: "Beagle", energy: "High", size: "Medium", grooming: "Low", match: 81, icon: "beagle" },
  ];

  const CARE_TOPICS = [
    { icon: "nutrition", title: "Nutrition", desc: "Right food by breed size & age.", href: "/care/nutrition", tag: "Food" },
    { icon: "health", title: "Health", desc: "Vaccines, deworming & vet visits.", href: "/care/health", tag: "Preventive" },
    { icon: "training", title: "Training", desc: "Reward-based methods that truly work.", href: "/care/training", tag: "Behaviour" },
  ];

  const CARE_TIPS = [
    { title: "Balanced Nutrition", text: "Breed size and age decide portion size and food type.", icon: "nutrition" },
    { title: "Preventive Health", text: "Vaccination and deworming prevent long-term issues.", icon: "health" },
    { title: "Positive Training", text: "Reward-based training builds trust and confidence.", icon: "training" },
    { title: "Daily Exercise", text: "Even 30 minutes of movement improves mood and health.", icon: "exercise" },
  ];

  const PUPHUB_TOOLS = [
    {
      icon: "camera",
      title: "Breed Identifier",
      desc: "Upload a photo of any dog and our AI instantly identifies the breed, traits, and care needs.",
      badge: "AI Vision",
      badgeColor: "teal",
      href: "/puphub/breed-identifier",
      demo: "Upload photo → Get breed in seconds",
      demoIcon: "search",
    },
    {
      icon: "mic",
      title: "Bark Analyser",
      desc: "Record your dog's bark and let AI decode what they're trying to tell you — stress, play, alert and more.",
      badge: "AI Audio",
      badgeColor: "amber",
      href: "/puphub/bark-analyser",
      demo: "Record bark → Understand mood",
      demoIcon: "wave",
    },
    {
      icon: "mapPin",
      title: "Nearby Pet Care",
      desc: "Find vets, groomers, pet stores and dog parks near you — with reviews from the Breedly community.",
      badge: "Location",
      badgeColor: "sage",
      href: "/puphub/nearby",
      demo: "Enable location → See nearby spots",
      demoIcon: "map",
    },
  ];

  const QUESTIONS = [
    "What should I feed my dog?",
    "Why is my dog barking at night?",
    "How to train a puppy?",
    "Best food for Golden Retriever?"
  ];

  const ANSWERS = [
    "A balanced high-protein diet with controlled portions is best for most dogs.",
    "Night barking can be due to anxiety, alertness, or boredom.",
    "Start with positive reinforcement and short sessions.",
    "Golden Retrievers need protein-rich food with healthy fats."
  ];

  const TRUST_ITEMS = [
    { icon: "home", label: "First-time owners" },
    { icon: "users", label: "Families" },
    { icon: "heart", label: "Adoption-focused" },
    { icon: "book", label: "Informed care" }
  ];

  const WHY_ITEMS = [
    { icon: "target", title: "Right Breed Match", desc: "Choose a dog that fits your lifestyle, space, and energy — not just your preference." },
    { icon: "leaf", title: "Responsible Care", desc: "Food, health, and training guides designed around each breed's specific needs.", accent: true },
    { icon: "shield", title: "Trusted Information", desc: "No myths. No confusion. Just clear, practical guidance based on evidence." }
  ];

  const QUIZ_QUESTIONS = [
    { icon: "clock", q: "How much time can you give your dog daily?" },
    { icon: "home", q: "Do you live in an apartment or a house?" },
    { icon: "wallet", q: "Are regular vet and food expenses manageable?" },
    { icon: "scissors", q: "How much grooming are you comfortable with?" },
    { icon: "zap", q: "How active is your daily lifestyle?" }
  ];

  const ORBIT_ITEMS = [
    { icon: "sun", text: "Morning walks", className: styles.orbit1 },
    { icon: "sparkles", text: "Playful moments", className: styles.orbit2 },
    { icon: "moon", text: "Quiet naps", className: styles.orbit3 },
    { icon: "scissors", text: "Gentle grooming", className: styles.orbit4 },
    { icon: "clock", text: "Shared routines", className: styles.orbit5 }
  ];

  const CARE_GUIDES = [
    { href: "/food-guide", bg: "#FDF3E7", icon: "nutrition", title: "Nutrition & Food", desc: "Portion sizes, ingredients to avoid, and breed-specific diets." },
    { href: "/health-guide", bg: "#EDF7F0", icon: "health", title: "Health & Vet Care", desc: "Vaccination schedules, common issues, and preventive routines." },
    { href: "/training-guide", bg: "#F0EDF7", icon: "training", title: "Training", desc: "Reward-based methods, basic commands, and building trust." },
    { href: "/care-grooming", bg: "#F7EDF0", icon: "scissors", title: "Grooming", desc: "Coat types, brushing frequency, and at-home grooming tips." },
  ];

  const MY_DOG_FEATURES = [
    { icon: "nutrition", text: "Smart food plans" },
    { icon: "health", text: "Health reminders" },
    { icon: "training", text: "Training guidance" },
    { icon: "chart", text: "Track growth & health" },
  ];

  /* ─── REACT STATE ───────────────────────────────────────────────────────── */
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [done, setDone] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const [tipOpacity, setTipOpacity] = useState(1);

  /* ─── EFFECTS ───────────────────────────────────────────────────────────── */
  // Typewriter for floating questions
  useEffect(() => {
    let i = 0;
    setTypedText("");
    setDone(false);

    const current = ANSWERS[index];

    const typing = setInterval(() => {
      i++;
      setTypedText(current.slice(0, i));

      if (i >= current.length) {
        clearInterval(typing);
        setDone(true);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % ANSWERS.length);
        }, 2500);
      }
    }, 25);

    return () => clearInterval(typing);
  }, [index]);

  // Fade-in observer & Tip Rotator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.visible);
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(`.${styles.fadeIn}`).forEach((el) => observer.observe(el));

    // Tip rotator state timer
    const rotator = setInterval(() => {
      setTipOpacity(0);
      setTimeout(() => {
        setTipIdx((prev) => (prev + 1) % CARE_TIPS.length);
        setTipOpacity(1);
      }, 300);
    }, 3200);

    return () => {
      observer.disconnect();
      clearInterval(rotator);
    };
  }, []);

  const bubbles = [
    { text: QUESTIONS[(index) % QUESTIONS.length] },
    { text: QUESTIONS[(index + 1) % QUESTIONS.length] },
    { text: QUESTIONS[(index + 2) % QUESTIONS.length] },
  ];

  return (
    <div className={styles.home}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={`${styles.heroContent} ${styles.fadeIn}`}>
            <span className={styles.heroBadge}>
              {SVG_ICONS.paw({ style: { width: 13, height: 13, color: "var(--accent-dark)", display: "inline-block", verticalAlign: "middle", marginRight: 6 } })}
              Thoughtful breed guidance
            </span>
            <h1 className={styles.heroHeadline}>
              Find a companion<br />
              <em>that truly fits</em><br />
              your life.
            </h1>
            <p className={styles.heroSub}>
              Thoughtful breed recommendations, real-life insights, and a calmer way to choose your dog.
            </p>
            <div className={styles.heroActions}>
              <Link href="/breed-selector" className={styles.btnPrimary}>Find My Match</Link>
              <Link href="/breeds" className={styles.btnGhost}>Explore Breeds</Link>
            </div>
            <p className={styles.heroMicro}>No pressure. Just guidance that feels right.</p>
          </div>
          <div className={`${styles.heroImageWrap} ${styles.fadeIn}`}>
            <div className={styles.heroBlobBg} />
            <img src="/assets/result (2).png" alt="Happy dog" className={styles.heroImg} />
            <div className={styles.floatCard1}>
              {SVG_ICONS.home({ style: { width: 14, height: 14, color: "var(--accent-dark)" } })}
              <span>Perfect match found</span>
            </div>
            <div className={styles.floatCard2}>
              {SVG_ICONS.star({ style: { width: 12, height: 12, color: "#B08968" } })}
              <span>Highly Recommended</span>
            </div>
          </div>
        </div>
        <div className={styles.heroFade} />
      </section>

      {/* ── TRUST STRIP ── */}
      <section className={`${styles.trustStrip} ${styles.fadeIn}`}>
        {TRUST_ITEMS.map((item, i) => (
          <div key={item.label} className={styles.trustItem}>
            {i > 0 && <div className={styles.trustDivider} />}
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {SVG_ICONS[item.icon]({ style: { width: 15, height: 15, color: "var(--accent)" } })}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      {/* ── WHY BREEDLY ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Why Breedly</p>
        <h2 className={styles.sectionTitle}>Built for the dog's wellbeing,<br />not impulse decisions.</h2>
        <div className={styles.grid3}>
          {WHY_ITEMS.map((item) => (
            <div key={item.title} className={`${styles.card} ${item.accent ? styles.cardAccent : ""}`}>
              <div className={styles.cardIcon}>
                {SVG_ICONS[item.icon]({ style: { width: 32, height: 32, color: item.accent ? "var(--cream)" : "var(--accent-dark)" } })}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BREED SELECTOR QUIZ TEASER ── */}
      <section className={`${styles.quizSection} ${styles.fadeIn}`}>
        <div className={styles.quizInner}>
          <div className={styles.quizLeft}>
            <p className={styles.eyebrowLight}>Breed Selector Quiz</p>
            <h2>We don't guess.<br />We ask the<br />right questions.</h2>
            <p>Our quiz considers your lifestyle, space, time, and commitment — so dogs don't end up in the wrong home.</p>
            <Link href="/breed-selector" className={styles.btnCream} style={{ width: "fit-content" }}> Start the Quiz → </Link>
            <p className={styles.microLight}>Takes less than 2 minutes · Free</p>
          </div>
          <div className={styles.quizRight}>
            {QUIZ_QUESTIONS.map((item, i) => (
              <div key={i} className={styles.quizQuestion}>
                <span className={styles.quizIcon}>
                  {SVG_ICONS[item.icon]({ style: { width: 16, height: 16, color: "rgba(255,255,255,0.85)" } })}
                </span>
                <span>{item.q}</span>
                <span className={styles.quizArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAY WITH YOUR DOG ── */}
      <section className={`${styles.daySection} ${styles.fadeIn}`}>
        <div className={styles.daySectionInner}>
          <div className={styles.dayContent}>
            <p className={styles.eyebrow}>A day with your future companion</p>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left", marginBottom: "16px" }}>
              Imagine how your life<br />might feel together.
            </h2>
            <p className={styles.daySubtext}>
              From morning walks to quiet evenings — every dog brings a rhythm of its own. Find the breed whose rhythm matches yours.
            </p>
          </div>
          <div className={styles.dayOrbit}>
            <div className={styles.orbitCenter} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {SVG_ICONS.dog({ style: { width: 52, height: 52, color: "var(--accent-dark)" } })}
            </div>
            {ORBIT_ITEMS.map((item, i) => (
              <div key={i} className={`${styles.orbitItem} ${item.className}`}>
                {SVG_ICONS[item.icon]({ style: { width: 20, height: 20, color: "var(--accent-dark)", marginBottom: 4 } })}
                <span>{item.text}</span>
              </div>
            ))}
            <svg className={styles.orbitRing} viewBox="0 0 300 300" fill="none">
              <circle cx="150" cy="150" r="120" stroke="#B08968" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── CARE GUIDE TEASER ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Care Guide</p>
        <h2 className={styles.sectionTitle}>Everything your dog needs,<br />explained simply.</h2>
        <div className={styles.careGrid}>
          {CARE_GUIDES.map((c) => (
            <Link href={c.href} key={c.href} className={styles.careCard}>
              <div className={styles.careCardTop} style={{ background: c.bg }}>
                {SVG_ICONS[c.icon]({ style: { width: 34, height: 34, color: "var(--accent-dark)" } })}
              </div>
              <div className={styles.careCardBody}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className={styles.careLink}>Read guides →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link href="/care" className={styles.btnOutline}></Link>
        </div>
      </section>

      {/* ── CARE TIP ROTATOR ── */}
      <section className={`${styles.section} ${styles.sectionCenter} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Daily Dog Care</p>
        <h2 className={styles.sectionTitle}>Tips that grow with your dog.</h2>
        <div className={styles.rotatorCard} style={{ opacity: tipOpacity, transition: "opacity 0.35s ease" }}>
          <span className={styles.rotatorIcon} style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            {SVG_ICONS[CARE_TIPS[tipIdx].icon]({ style: { width: 38, height: 38, color: "var(--accent-dark)" } })}
          </span>
          <h3>{CARE_TIPS[tipIdx].title}</h3>
          <p>{CARE_TIPS[tipIdx].text}</p>
        </div>
      </section>

      {/* ── PUPHUB AI ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <div className={styles.puphubHeader}>
          <div>
            <p className={styles.eyebrow}>PupHub AI</p>
            <h2 className={styles.sectionTitle} style={{ textAlign: "left", marginBottom: 0 }}>
              AI tools built<br />for dog parents.
            </h2>
          </div>
          <Link href="/puphub" className={styles.btnPrimary} style={{ alignSelf: "flex-end" }}></Link>
        </div>

        <div className={styles.puphubGrid}>
          {PUPHUB_TOOLS.map((tool) => (
            <Link href={tool.href} key={tool.title} className={`${styles.puphubCard} ${styles[`puphub_${tool.badgeColor}`]}`}>
              <div className={styles.puphubTop}>
                <span className={styles.puphubIcon}>
                  {SVG_ICONS[tool.icon]({ style: { width: 28, height: 28, color: "var(--accent-dark)" } })}
                </span>
                <span className={`${styles.puphubBadge} ${styles[`badge_${tool.badgeColor}`]}`}>{tool.badge}</span>
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.desc}</p>
              <div className={styles.puphubDemo}>
                <span className={styles.puphubDemoIcon}>
                  {SVG_ICONS[tool.demoIcon]({ style: { width: 14, height: 14, color: "var(--text-mid)" } })}
                </span>
                <span>{tool.demo}</span>
              </div>
              <span className={styles.puphubArrow}>Try it →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI ASSISTANT TEASER ── */}
      <section className={`${styles.aiSection} ${styles.fadeIn}`}>
        <div className={styles.aiInner}>
          <div className={styles.aiLeft}>
            <p className={styles.eyebrowLight}>Paw Assistant</p>
            <h2>Ask anything<br />about dogs.</h2>
            <p>Food, health, behaviour, training — our AI knows every breed inside out. Get instant, personalised answers anytime.</p>
            <Link href="/chat" className={styles.btnCream} style={{ display: "inline-flex", alignItems: "center", gap: 6, width: "fit-content" }}>
              <span>Try the AI Assistant</span>
              {SVG_ICONS.sparkles({ style: { width: 14, height: 14, color: "#fff" } })}
            </Link>
            <p className={styles.microLight}>Powered by Claude · Always free</p>
          </div>
          <div className={styles.aiRight}>
            <div className={styles.aiVisual}>
              {/* FLOATING QUESTIONS */}
              {bubbles.map((q, i) => (
                <div key={i} className={`${styles.bubble} ${styles["b" + i]}`}>
                  {q.text}
                </div>
              ))}

              {/* MAIN AI CARD */}
              <div className={styles.aiMainCard}>
                <div className={styles.aiHeader}>
                  <span className={styles.aiLive}></span>
                  Breedly AI is thinking...
                </div>

                <div className={styles.aiContent}>
                  {typedText}
                  {!done && <span className={styles.cursor}>|</span>}
                </div>

                <div className={styles.aiFooter}>
                  <span>Personalised · Instant · Smart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY TEASER ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Community</p>
        <h2 className={styles.sectionTitle}>Real stories from<br />real dog parents.</h2>
        <div className={styles.communityGrid}>
          {[
            { init: "S", bg: "#E8D5C4", name: "Sneha R.", breed: "Golden Retriever owner", text: "He finally learned to sit today! Three weeks in and I'm already obsessed. Breedly's training guide made it so clear.", tags: ["Training", "Golden Retriever"] },
            { init: "A", bg: "#D4E8D5", name: "Aryan M.", breed: "Beagle owner", text: "First walk together — couldn't be happier. Took the quiz, got matched with a Beagle, and it was the best decision of my life.", tags: ["Adoption", "Beagle"] },
            { init: "P", bg: "#D5D4E8", name: "Priya K.", breed: "Shih Tzu owner", text: "Any grooming tips for long coats? My Shih Tzu is getting fluffy. The care guide helped a lot but looking for more tips!", tags: ["Grooming", "Shih Tzu"] },
          ].map((c) => (
            <div key={c.name} className={styles.communityCard}>
              <div className={styles.communityCardTop}>
                <div className={styles.communityAvatar} style={{ background: c.bg }}>{c.init}</div>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.breed}</span>
                </div>
              </div>
              <p>"{c.text}"</p>
              <div className={styles.communityTags}>
                {c.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sectionCta}>
          <Link href="/community" className={styles.btnOutline}>Join the Community →</Link>
        </div>
      </section>

      {/* ── MY DOG ── */}
      <section className={`${styles.myDogSection} ${styles.fadeIn}`}>
        <div className={styles.myDogInner}>
          {/* LEFT */}
          <div className={styles.myDogLeft}>
            <div className={styles.myDogProfileCard}>
              <div className={styles.myDogTop}>
                <div className={styles.myDogAvatar}>
                  {SVG_ICONS.dog({ style: { width: 26, height: 26, color: "var(--accent-dark)" } })}
                </div>

                <div className={styles.myDogInfo}>
                  <span className={styles.myDogName}>Bruno</span>
                  <span className={styles.myDogBreed}>
                    Golden Retriever · 2 yrs
                  </span>
                </div>

                <span className={styles.myDogVerified}>
                  {SVG_ICONS.check({ style: { width: 10, height: 10, color: "currentColor", strokeWidth: 3 } })}
                </span>
              </div>

              {/* Stats */}
              <div className={styles.myDogStats}>
                <div className={styles.myDogStat}>
                  <span>Weight</span>
                  <strong>28 kg</strong>
                </div>
                <div className={styles.myDogStat}>
                  <span>Size</span>
                  <strong>Large</strong>
                </div>
                <div className={styles.myDogStat}>
                  <span>Health</span>
                  <strong className={styles.green}>Healthy</strong>
                </div>
              </div>

              {/* subtle progress */}
              <div className={styles.healthBar}>
                <div className={styles.healthFill}></div>
              </div>
            </div>

            {/* FLOATING PILLS */}
            <div className={styles.myDogPill} style={{ top: "0px", right: "-30px", display: "flex", alignItems: "center", gap: "6px" }}>
              {SVG_ICONS.nutrition({ style: { width: 13, height: 13, color: "var(--accent-dark)" } })}
              <span>Food tailored</span>
            </div>

            <div className={styles.myDogPill} style={{ bottom: "60px", left: "-20px", animationDelay: "1.2s", display: "flex", alignItems: "center", gap: "6px" }}>
              {SVG_ICONS.health({ style: { width: 13, height: 13, color: "var(--accent-dark)" } })}
              <span>Vaccine due soon</span>
            </div>

            <div className={styles.myDogPill} style={{ bottom: "-10px", right: "0px", animationDelay: "2s", display: "flex", alignItems: "center", gap: "6px" }}>
              {SVG_ICONS.exercise({ style: { width: 13, height: 13, color: "var(--accent-dark)" } })}
              <span>Daily walk ready</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.myDogRight}>
            <p className={styles.eyebrow}>My Dog</p>

            <h2>
              Build your dog’s profile.<br />
              <em>Get everything personalised.</em>
            </h2>

            <p className={styles.desc}>
              No more generic advice. Add your dog’s details and BreedLy
              creates a complete lifestyle guide — from food to health
              to training — built specifically for them.
            </p>

            {/* FEATURES */}
            <div className={styles.myDogFeatures}>
              {MY_DOG_FEATURES.map((f) => (
                <div key={f.text} className={styles.myDogFeature}>
                  {SVG_ICONS[f.icon]({ style: { width: 16, height: 16, color: "var(--accent-dark)" } })}
                  <p>{f.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className={styles.myDogActions}>
              <Link href="/my-dog/add" className={styles.btnPrimary} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span>Create Profile</span>
                {SVG_ICONS.paw({ style: { width: 14, height: 14, color: "#fff" } })}
              </Link>

              <Link href="/my-dog" className={styles.btnGhost}>
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={`${styles.section} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>How It Works</p>
        <h2 className={styles.sectionTitle}>Three steps to finding<br />your ideal dog.</h2>
        <div className={styles.steps}>
          <div className={styles.step}><span className={styles.stepNum}>01</span><h3>Answer Simple Questions</h3><p>Tell us about your home, activity level, and daily routine.</p></div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>02</span><h3>Get Breed Matches</h3><p>We recommend breeds that naturally suit your lifestyle.</p></div>
          <div className={styles.stepArrow}>→</div>
          <div className={styles.step}><span className={styles.stepNum}>03</span><h3>Learn & Care</h3><p>Access food, health, and training guides tailored for your dog.</p></div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className={`${styles.missionSection} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Our Mission</p>
        <h2>Built for thoughtful adoption.</h2>
        <p>Breedly exists to help people choose responsibly — not impulsively.<br />Because every dog deserves the right home.</p>
        <div className={styles.missionPills}>
          <span>
            {SVG_ICONS.check({ style: { width: 12, height: 12, color: "var(--accent-dark)", marginRight: 6, display: "inline-block", verticalAlign: "middle" } })}
            No forced decisions
          </span>
          <span>
            {SVG_ICONS.check({ style: { width: 12, height: 12, color: "var(--accent-dark)", marginRight: 6, display: "inline-block", verticalAlign: "middle" } })}
            Transparent insights
          </span>
          <span>
            {SVG_ICONS.check({ style: { width: 12, height: 12, color: "var(--accent-dark)", marginRight: 6, display: "inline-block", verticalAlign: "middle" } })}
            Long-term care focus
          </span>
        </div>
      </section>

      {/* ── EMAIL ── */}
      <section className={`${styles.emailSection} ${styles.fadeIn}`}>
        <p className={styles.eyebrow}>Stay Connected</p>
        <h2>Get occasional breed insights<br />and care tips.</h2>
        <p>Simple guidance — not overwhelming newsletters.</p>
        <div className={styles.emailForm}>
          <input type="email" placeholder="Enter your email" className={styles.emailInput} />
          <button className={styles.btnPrimary}>Join</button>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className={`${styles.ctaSection} ${styles.fadeIn}`}>
        <h2>Not sure which breed suits you?</h2>
        <p>Answer a few simple questions and we'll guide you gently.</p>
        <Link href="/breed-selector" className={styles.btnCream} style={{ display: "inline-block", textAlign: "center" }}>Start Breed Selector</Link>
        <p className={styles.ctaMicro}>
          {SVG_ICONS.check({ style: { width: 10, height: 10, color: "rgba(255,255,255,0.7)", marginRight: 4, display: "inline-block", verticalAlign: "middle" } })}
          Trusted by responsible dog lovers &nbsp;•&nbsp;
          {SVG_ICONS.check({ style: { width: 10, height: 10, color: "rgba(255,255,255,0.7)", marginRight: 4, display: "inline-block", verticalAlign: "middle", marginLeft: 8 } })}
          Adoption-first approach
        </p>
      </section>

    </div>
  );
}