export default function ComposeBanner({ onOpen }) {
  return (
    <div
      onClick={onOpen}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "12px 14px 6px",
        background: "#fff",
        borderRadius: 20,
        border: "2px solid #EDD8F5",
        padding: "10px 12px",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#3B4FC8"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#EDD8F5"}
    >
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "#FFD54F",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, flexShrink: 0,
      }}>
        🐾
      </div>
      <div style={{ flex: 1, color: "#C4AED4", fontSize: 14, fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
        Share something with the pack...
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {["📷", "🎥", "📍"].map(icon => (
          <span
            key={icon}
            style={{
              fontSize: 17,
              background: "#F5EEF9",
              borderRadius: 10,
              padding: "4px 7px",
            }}
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
}
