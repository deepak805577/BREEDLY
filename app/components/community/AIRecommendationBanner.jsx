export default function AIRecommendationBanner({ breed = "your dog" }) {
  return (
    <div style={{
      margin: "6px 14px",
      background: "linear-gradient(90deg, #3B4FC8 0%, #7B5EA7 100%)",
      borderRadius: 16,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <div style={{
        width: 32, height: 32,
        background: "#FFD54F",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, flexShrink: 0,
      }}>
        ✨
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
          Recommended for {breed} owners
        </div>
        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 500, marginTop: 2, fontFamily: "'Nunito', sans-serif" }}>
          Personalized based on your dog's profile & activity
        </div>
      </div>
      <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>
        AI
      </div>
    </div>
  );
}
