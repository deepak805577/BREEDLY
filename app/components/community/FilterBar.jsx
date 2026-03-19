export default function FilterBar({ filters = [], active, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: 8,
      padding: "12px 14px 10px",
      overflowX: "auto",
      scrollbarWidth: "none",
      background: "#fff",
      borderBottom: "1.5px solid #F0E0EC",
    }}>
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          style={{
            flexShrink: 0,
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'Fedoka', sans-serif",
            border: active === filter ? "2px solid #3B4FC8" : "2px solid transparent",
            cursor: "pointer",
            transition: "all 0.18s",
            background: active === filter ? "#3B4FC8" : "#F3EAF6",
            color: active === filter ? "#fff" : "#7B5EA7",
            transform: active === filter ? "scale(1.05)" : "scale(1)",
          }}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
