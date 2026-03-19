"use client";

import { useState } from "react";
import { NextBtn, BackBtn } from "./StepDogName";

const BREEDS = [
  { name: "Golden Retriever", emoji: "🐕" },
  { name: "Labrador",         emoji: "🐶" },
  { name: "German Shepherd",  emoji: "🐕‍🦺" },
  { name: "Beagle",           emoji: "🐩" },
  { name: "Poodle",           emoji: "🐩" },
  { name: "Bulldog",          emoji: "🐶" },
  { name: "Rottweiler",       emoji: "🐕" },
  { name: "Husky",            emoji: "🐺" },
  { name: "Dachshund",        emoji: "🌭" },
  { name: "Shih Tzu",         emoji: "🐶" },
  { name: "Yorkshire Terrier",emoji: "🐕" },
  { name: "Boxer",            emoji: "🥊" },
  { name: "Dobermann",        emoji: "🐕" },
  { name: "Great Dane",       emoji: "🐕" },
  { name: "Maltese",          emoji: "🤍" },
  { name: "Pomeranian",       emoji: "🦊" },
  { name: "Border Collie",    emoji: "🐑" },
  { name: "Cocker Spaniel",   emoji: "🐶" },
  { name: "Mixed Breed",      emoji: "🐾" },
  { name: "Other",            emoji: "❓" },
];

export default function StepBreed({ data, update, onNext, onBack }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? BREEDS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    : BREEDS;

  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "36px 28px" }}>
      <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>🏷️</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#3B4FC8", marginBottom: 6, textAlign: "center" }}>
        What's {data.dog_name || "their"} breed?
      </div>
      <p style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, textAlign: "center", marginBottom: 20, fontFamily: "'Nunito', sans-serif" }}>
        Search or scroll to find the right one
      </p>

      {/* Search */}
      <input
        placeholder="Search breeds..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", border: "2px solid #EDD8F5", borderRadius: 14, padding: "11px 14px", fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 600, color: "#2D2340", background: "#FAF5FF", outline: "none", marginBottom: 14 }}
        onFocus={e => e.target.style.borderColor = "#3B4FC8"}
        onBlur={e  => e.target.style.borderColor = "#EDD8F5"}
      />

      {/* Breed grid */}
      <div style={{ maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 4, marginBottom: 20, scrollbarWidth: "thin" }}>
        {filtered.map(breed => {
          const selected = data.primary_breed === breed.name;
          return (
            <button
              key={breed.name}
              onClick={() => update({ primary_breed: breed.name })}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 14, border: "none",
                background: selected ? "#3B4FC8" : "#F9F2FC",
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                outline: selected ? "2px solid #3B4FC8" : "none",
              }}
              onMouseEnter={e => !selected && (e.currentTarget.style.background = "#EDD8F5")}
              onMouseLeave={e => !selected && (e.currentTarget.style.background = "#F9F2FC")}
            >
              <span style={{ fontSize: 20 }}>{breed.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: selected ? "#fff" : "#2D2340", fontFamily: "'Nunito', sans-serif" }}>
                {breed.name}
              </span>
              {selected && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <BackBtn onClick={onBack} />
        <NextBtn onClick={onNext} disabled={!data.primary_breed} />
      </div>
    </div>
  );
}
