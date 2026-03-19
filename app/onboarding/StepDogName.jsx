"use client";

export default function StepDogName({ data, update, onNext, onBack }) {
  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "36px 28px" }}>
      <div style={{ fontSize: 52, textAlign: "center", marginBottom: 16 }}>🐶</div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: "#3B4FC8", marginBottom: 6, textAlign: "center" }}>
        Who's your dog?
      </div>
      <p style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, textAlign: "center", marginBottom: 28, fontFamily: "'Nunito', sans-serif" }}>
        Tell us your name and your dog's name
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Your Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Priya"
            value={data.full_name}
            onChange={e => update({ full_name: e.target.value })}
            onFocus={e => e.target.style.borderColor = "#3B4FC8"}
            onBlur={e  => e.target.style.borderColor = "#EDD8F5"}
          />
        </div>

        <div>
          <label style={labelStyle}>Your Dog's Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. Buddy, Luna, Max..."
            value={data.dog_name}
            onChange={e => update({ dog_name: e.target.value })}
            onFocus={e => e.target.style.borderColor = "#3B4FC8"}
            onBlur={e  => e.target.style.borderColor = "#EDD8F5"}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        <BackBtn onClick={onBack} />
        <NextBtn onClick={onNext} disabled={!data.dog_name.trim()} />
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 800, color: "#7B5EA7",
  textTransform: "uppercase", letterSpacing: "0.06em",
  marginBottom: 7, fontFamily: "'Nunito', sans-serif",
};

const inputStyle = {
  width: "100%", border: "2px solid #EDD8F5", borderRadius: 14,
  padding: "12px 14px", fontFamily: "'Nunito', sans-serif",
  fontSize: 15, fontWeight: 600, color: "#2D2340",
  background: "#FAF5FF", outline: "none", transition: "border-color 0.15s",
};

export function NextBtn({ onClick, disabled, label = "Next →" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ flex: 1, padding: "13px", background: disabled ? "#C5B0DF" : "#3B4FC8", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Fredoka One', cursive", fontSize: 17, cursor: disabled ? "default" : "pointer", transition: "opacity 0.15s" }}
    >
      {label}
    </button>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: "13px 18px", background: "#F3EAF6", border: "none", borderRadius: 14, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 15, color: "#7B5EA7", cursor: "pointer" }}
    >
      ←
    </button>
  );
}
