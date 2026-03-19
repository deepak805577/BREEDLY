"use client";

import { useRef } from "react";
import { NextBtn, BackBtn } from "./StepDogName";

export default function StepDogPhoto({ data, update, onNext, onBack }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    update({ dog_photo_file: file });
    const reader = new FileReader();
    reader.onload = ev => update({ dog_photo_url: ev.target.result });
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "36px 28px" }}>
      <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>📷</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#3B4FC8", marginBottom: 6, textAlign: "center" }}>
        Show us {data.dog_name || "your dog"}!
      </div>
      <p style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, textAlign: "center", marginBottom: 24, fontFamily: "'Nunito', sans-serif" }}>
        Add a photo to complete the profile
      </p>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: "100%", aspectRatio: "1", maxHeight: 240,
          borderRadius: 24, border: "2.5px dashed #C5B0DF",
          background: data.dog_photo_url ? "transparent" : "#F9F2FC",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          cursor: "pointer", overflow: "hidden", marginBottom: 16,
          transition: "border-color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#3B4FC8"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#C5B0DF"}
      >
        {data.dog_photo_url ? (
          <img src={data.dog_photo_url} alt="Dog preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <span style={{ fontSize: 48, marginBottom: 10 }}>🐶</span>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#B7A5C4", fontFamily: "'Nunito', sans-serif" }}>Tap to upload a photo</span>
            <span style={{ fontWeight: 600, fontSize: 11, color: "#C9B8D8", marginTop: 4, fontFamily: "'Nunito', sans-serif" }}>JPG or PNG, max 10MB</span>
          </>
        )}
      </div>

      {data.dog_photo_url && (
        <button
          onClick={() => { update({ dog_photo_url: null, dog_photo_file: null }); }}
          style={{ display: "block", width: "100%", marginBottom: 16, background: "#F3EAF6", border: "none", borderRadius: 12, padding: "9px", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#7B5EA7", cursor: "pointer" }}
        >
          Remove photo
        </button>
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      <div style={{ display: "flex", gap: 10 }}>
        <BackBtn onClick={onBack} />
        <NextBtn onClick={onNext} label={data.dog_photo_url ? "Next →" : "Skip →"} />
      </div>
    </div>
  );
}
