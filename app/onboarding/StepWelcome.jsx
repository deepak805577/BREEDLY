"use client";

export default function StepWelcome({ onNext }) {
  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "40px 28px", textAlign: "center" }}>
      <div style={{ fontSize: 72, marginBottom: 20 }}>🐾</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#3B4FC8", marginBottom: 8 }}>
        Welcome to BreedLy!
      </div>

      <p style={{ fontSize: 15, color: "#7B5EA7", fontWeight: 600, lineHeight: 1.6, marginBottom: 32, fontFamily: "'Nunito', sans-serif" }}>
        Let's set up your dog's profile so the pack can get to know you both 🐶
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {[
          { icon: "🐶", text: "Tell us about your dog" },
          { icon: "🏷️", text: "Pick their breed" },
          { icon: "📷", text: "Add a photo" },
        ].map(item => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, background: "#F9F2FC", borderRadius: 14, padding: "12px 16px" }}>
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#5A4D6E", fontFamily: "'Nunito', sans-serif" }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        style={{ width: "100%", padding: "15px", background: "#3B4FC8", color: "#fff", border: "none", borderRadius: 16, fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer", letterSpacing: 0.5, transition: "transform 0.1s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        Let's go! 🚀
      </button>

      <button
        onClick={onNext}
        style={{ marginTop: 14, background: "none", border: "none", fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 700, color: "#C4AED4", cursor: "pointer" }}
      >
        Skip for now
      </button>
    </div>
  );
}
