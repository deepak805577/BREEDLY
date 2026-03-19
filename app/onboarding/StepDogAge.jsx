"use client";

import { NextBtn, BackBtn } from "./StepDogName";

const AGE_OPTIONS = [
  { label: "< 1 year",  value: "0", emoji: "🍼" },
  { label: "1 year",    value: "1", emoji: "🐣" },
  { label: "2 years",   value: "2", emoji: "🐾" },
  { label: "3 years",   value: "3", emoji: "🐾" },
  { label: "4 years",   value: "4", emoji: "🐾" },
  { label: "5 years",   value: "5", emoji: "⭐" },
  { label: "6 years",   value: "6", emoji: "⭐" },
  { label: "7 years",   value: "7", emoji: "🌟" },
  { label: "8+ years",  value: "8", emoji: "👴" },
];

export default function StepDogAge({ data, update, onNext, onBack }) {
  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "36px 28px" }}>
      <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>🎂</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#3B4FC8", marginBottom: 6, textAlign: "center" }}>
        How old is {data.dog_name || "your dog"}?
      </div>
      <p style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, textAlign: "center", marginBottom: 24, fontFamily: "'Nunito', sans-serif" }}>
        Pick the closest age
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
        {AGE_OPTIONS.map(opt => {
          const selected = data.dog_age === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => update({ dog_age: opt.value })}
              style={{
                padding: "14px 8px", borderRadius: 16, border: "2px solid",
                borderColor: selected ? "#3B4FC8" : "#EDD8F5",
                background: selected ? "#3B4FC8" : "#FAF5FF",
                cursor: "pointer", transition: "all 0.15s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 24 }}>{opt.emoji}</span>
              <span style={{ fontWeight: 800, fontSize: 12, color: selected ? "#fff" : "#5A4D6E", fontFamily: "'Nunito', sans-serif", textAlign: "center" }}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <BackBtn onClick={onBack} />
        <NextBtn onClick={onNext} disabled={!data.dog_age} />
      </div>

      <button
        onClick={onNext}
        style={{ display: "block", width: "100%", marginTop: 12, background: "none", border: "none", fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: "#C4AED4", cursor: "pointer" }}
      >
        Skip this step
      </button>
    </div>
  );
}
