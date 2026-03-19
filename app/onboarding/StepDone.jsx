"use client";

export default function StepDone({ data, onFinish, saving }) {
  return (
    <div style={{ background: "#fff", borderRadius: 28, border: "2px solid #EDD8F5", padding: "40px 28px", textAlign: "center" }}>

      {/* Dog photo or placeholder */}
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        border: "3px solid #FFD54F",
        margin: "0 auto 20px",
        overflow: "hidden", background: "#F3EAF6",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 48,
      }}>
        {data.dog_photo_url
          ? <img src={data.dog_photo_url} alt={data.dog_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : "🐶"
        }
      </div>

      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#3B4FC8", marginBottom: 6 }}>
        {data.dog_name ? `Say hi to ${data.dog_name}!` : "You're all set!"}
      </div>
      <p style={{ fontSize: 14, color: "#7B5EA7", fontWeight: 600, lineHeight: 1.6, marginBottom: 28, fontFamily: "'Nunito', sans-serif" }}>
        Your profile is ready. Time to join the pack 🐾
      </p>

      {/* Summary card */}
      <div style={{ background: "#F9F2FC", borderRadius: 18, border: "2px solid #EDD8F5", padding: "16px 18px", marginBottom: 28, textAlign: "left" }}>
        {[
          { label: "Owner",  value: data.full_name     || "—" },
          { label: "Dog",    value: data.dog_name      || "—" },
          { label: "Breed",  value: data.primary_breed || "—" },
          { label: "Age",    value: data.dog_age ? `${data.dog_age} ${data.dog_age === "0" ? "< 1 year" : data.dog_age === "1" ? "year" : "years"}` : "—" },
        ].map(row => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #EDD8F5" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#9B8AAB", fontFamily: "'Nunito', sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2D2340", fontFamily: "'Nunito', sans-serif" }}>{row.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onFinish}
        disabled={saving}
        style={{
          width: "100%", padding: "15px",
          background: saving ? "#C5B0DF" : "#3B4FC8",
          color: "#fff", border: "none", borderRadius: 16,
          fontFamily: "'Fredoka One', cursive", fontSize: 20,
          cursor: saving ? "default" : "pointer", letterSpacing: 0.5,
          transition: "transform 0.1s",
        }}
        onMouseEnter={e => !saving && (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {saving ? "Saving..." : "Join the Pack! 🐾"}
      </button>
    </div>
  );
}
