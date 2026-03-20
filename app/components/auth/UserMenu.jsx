"use client";

import { useAuth } from "../../context/AuthContext";

export default function UserMenu() {
  const { profile } = useAuth();

  const initials = profile?.initials ?? "?";
  const color = profile?.avatar_color ?? "#e8c8a6";

  function toggleSidebar() {
    const sidebar = document.querySelector(".bc-sidebar");
    const overlay = document.querySelector(".bc-overlay");

    if (!sidebar || !overlay) return;

    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  }

  return (
    <button
      onClick={toggleSidebar}
      title="Toggle menu"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: color,
        border: "2px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: 13,
        color: "#6B4C00",
        cursor: "pointer",
        outline: "none",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
        transition: "border-color 0.15s, transform 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary-dark)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        initials
      )}
    </button>
  );
}