"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { label: "Community Feed", href: "/community", icon: <GridIcon /> },
  { label: "My Profile", href: "/profile", icon: <UserIcon /> },
  { label: "Saved Posts", href: "/profile", icon: <BookmarkIcon /> },
  { label: "Discover", href: "/community", icon: <StarIcon /> },
];

export default function Sidebar() {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const overlay = document.querySelector(".bc-overlay");
    const sidebar = document.querySelector(".bc-sidebar");

    function closeSidebar() {
      sidebar?.classList.remove("open");
      overlay?.classList.remove("show");
    }

    overlay?.addEventListener("click", closeSidebar);
    return () => overlay?.removeEventListener("click", closeSidebar);
  }, []);

  return (
    <>
      <style>{`
        .bc-sidebar { display:flex; flex-direction: column; width: 240px; height: 100vh; background: var(--surface); border-right: 1px solid var(--border); position: sticky; top: 0; }
        .bc-overlay { display:none; position: fixed; inset:0; background: rgba(0,0,0,0.2); z-index: 900; }
        .bc-overlay.show { display:block; }

        @media(max-width:768px) {
          .bc-sidebar { position: fixed; left: -260px; top:0; width: 260px; height: 100%; transition: left 0.3s ease; z-index:1000; }
          .bc-sidebar.open { left: 0; }
          .sidebar-close { display: flex !important; }
        }

        .sidebar-close { display:none; position:absolute; top:14px; right:14px; background: var(--bg); border:1px solid var(--border); border-radius:50%; width:28px; height:28px; cursor:pointer; color: var(--muted); font-size:14px; align-items:center; justify-content:center; z-index:10; }
      `}</style>

      {/* Overlay */}
      <div className="bc-overlay"></div>

      {/* Sidebar */}
      <aside className="bc-sidebar">
        {/* Logo */}
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: 'Dogica', fontSize: 22, fontWeight: 600, color: "var(--primary-dark)", letterSpacing: "0.3px" }}>
            BreedLy
          </div>
          <div style={{ fontFamily: "'Fedoka', sans-serif", fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
            Community
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 0" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  width: "100%", padding: "11px 24px",
                  background: active ? "var(--primary-soft)" : "none",
                  border: "none", borderLeft: `3px solid ${active ? "var(--primary-dark)" : "transparent"}`,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  color: active ? "var(--primary-dark)" : "var(--text)",
                  transition: "all 0.15s", textAlign: "left",
                }}
                onMouseEnter={e => !active && (e.currentTarget.style.background = "#faf8f5")}
                onMouseLeave={e => !active && (e.currentTarget.style.background = "none")}
              >
                <span style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "18px 24px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
              background: "var(--primary-soft)", border: "2px solid var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "var(--primary-dark)", overflow: "hidden",
            }}>
              {profile?.avatarUrl
                ? <img src={profile.avatarUrl} alt={profile.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : profile?.initials ?? "?"
              }
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{profile?.username ?? "Dog Lover"}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{profile?.dog_breed ?? "Mixed Breed"}</div>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{
              width: "100%", padding: "8px", background: "none",
              border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 500,
              color: "var(--muted)", cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fdf0ef"; e.currentTarget.style.borderColor = "#c0635a"; e.currentTarget.style.color = "#c0635a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

// Icons
function GridIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>; }
function UserIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="4"/><path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>; }
function BookmarkIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z"/></svg>; }
function StarIcon() { return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l2.4 4.9 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.6.9-5.5L2 7.7l5.6-.8z"/></svg>; }