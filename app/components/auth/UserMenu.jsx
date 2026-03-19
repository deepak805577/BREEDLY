"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth }   from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref    = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = profile?.initials ?? user?.email?.[0]?.toUpperCase() ?? "?";
  const name     = profile?.full_name ?? user?.email ?? "Dog Lover";
  const breed    = profile?.primary_breed ?? "Mixed Breed";
  const color    = profile?.avatar_color  ?? "#FFD54F";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: 34, height: 34, borderRadius: "50%", background: color, border: "2.5px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#6B4C00", cursor: "pointer", outline: "none", fontFamily: "'Nunito', sans-serif", overflow: "hidden" }}
      >
        {profile?.avatar_url
          ? <img src={profile.avatar_url} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          : initials
        }
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: 42, background: "#fff", border: "2px solid #EDD8F5", borderRadius: 18, padding: 12, minWidth: 200, zIndex: 200, boxShadow: "0 8px 24px rgba(59,79,200,0.10)" }}>
          {/* Profile summary */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", paddingBottom: 10, borderBottom: "1.5px solid #F5EEF9", marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#6B4C00", flexShrink: 0, fontFamily: "'Nunito', sans-serif", overflow: "hidden" }}>
              {profile?.avatar_url ? <img src={profile.avatar_url} alt={name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : initials}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#2D2340", fontFamily: "'Nunito', sans-serif" }}>{name}</div>
              <div style={{ fontSize: 11, color: "#9B8AAB", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>{breed}</div>
            </div>
          </div>

          {[{ icon: "🐶", label: "My Profile", href: "/profile" }, { icon: "🔖", label: "Saved Posts", href: "/profile" }, { icon: "⚙️", label: "Settings", href: "/profile" }].map(item => (
            <button key={item.label} onClick={() => { router.push(item.href); setOpen(false); }} style={{ width: "100%", padding: "9px 10px", background: "none", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#2D2340", display: "flex", alignItems: "center", gap: 8, textAlign: "left", transition: "background 0.12s" }} onMouseEnter={e => e.currentTarget.style.background = "#F5EEF9"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </button>
          ))}

          <div style={{ borderTop: "1.5px solid #F5EEF9", marginTop: 6, paddingTop: 6 }}>
            <button onClick={signOut} style={{ width: "100%", padding: "9px 10px", background: "none", border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 13, color: "#A32D2D", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = "#FCEBEB"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <span style={{ fontSize: 16 }}>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
