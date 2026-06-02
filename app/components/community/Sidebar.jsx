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
        .bc-sidebar {
          display: flex;
          flex-direction: column;
          width: 240px;
          height: 100vh;
          background: var(--surface);
          border-right: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 150;
        }
        .bc-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(50, 35, 20, 0.4);
          backdrop-filter: blur(4px);
          z-index: 900;
          animation: fadeIn 0.2s ease-out;
        }
        .bc-overlay.show {
          display: block;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          width: calc(100% - 24px);
          margin: 4px 12px;
          padding: 11px 16px;
          background: none;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          text-align: left;
        }
        .sidebar-link.active {
          background: var(--primary-soft);
          color: var(--primary-dark);
          font-weight: 600;
          box-shadow: inset 2px 0 0 var(--primary-dark);
        }
        .sidebar-link:hover:not(.active) {
          background: rgba(176, 137, 104, 0.08);
          color: var(--accent-dark);
          transform: translateX(4px);
        }

        .sidebar-user-card {
          background: var(--bg-soft);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          transition: var(--transition);
          cursor: pointer;
        }
        .sidebar-user-card:hover {
          border-color: var(--accent);
          background: var(--card-lite);
        }

        .sidebar-close-btn {
          display: none;
          position: absolute;
          top: 18px;
          right: 18px;
          background: var(--bg-soft);
          border: 1px solid var(--border);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 12px;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: var(--transition);
        }
        .sidebar-close-btn:hover {
          background: var(--card-bg);
          color: var(--accent-dark);
        }

        @media(max-width: 768px) {
          .bc-sidebar {
            position: fixed;
            left: -260px;
            top: 0;
            width: 260px;
            height: 100%;
            transition: left 0.3s cubic-bezier(0.22, 1, 0.36, 1);
            z-index: 1500;
            box-shadow: 16px 0 40px rgba(0, 0, 0, 0.15);
          }
          .bc-sidebar.open {
            left: 0;
          }
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>

      {/* Overlay */}
      <div className="bc-overlay"></div>

      {/* Sidebar */}
      <aside className="bc-sidebar">
        {/* Close Button on Mobile */}
        <button 
          className="sidebar-close-btn" 
          onClick={() => {
            document.querySelector(".bc-sidebar")?.classList.remove("open");
            document.querySelector(".bc-overlay")?.classList.remove("show");
          }}
          aria-label="Close sidebar"
        >
          ✕
        </button>

        {/* Logo */}
        <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              background: "var(--accent-dark)",
              width: 32, height: 32,
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 4px 10px rgba(127, 85, 57, 0.2)",
            }}>
              🐾
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500, color: "var(--accent-dark)", letterSpacing: "0.5px" }}>
              BreedLy
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-light)", marginTop: 4, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, paddingLeft: 2 }}>
            Community
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px 0" }}>
          {NAV.map(item => {
            const active = pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <span style={{ opacity: active ? 1 : 0.7, display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: "18px 24px", borderTop: "1px solid var(--border)" }}>
          <div 
            className="sidebar-user-card"
            onClick={() => router.push("/profile")}
          >
            <div style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "var(--primary-soft)", border: "2px solid var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, color: "var(--primary-dark)", overflow: "hidden",
            }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={profile.full_name || profile.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : profile?.initials ?? "?"
              }
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile?.full_name ?? profile?.username ?? "Dog Lover"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-light)", fontFamily: "var(--font-body)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile?.primary_breed ?? "Mixed Breed"}
              </div>
            </div>
          </div>
          
          <button
            onClick={signOut}
            style={{
              width: "100%", padding: "10px", background: "none",
              border: "1.5px solid var(--border-strong)", borderRadius: "var(--radius-md)",
              fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600,
              color: "var(--text-secondary)", cursor: "pointer", transition: "all 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fdf0ef"; e.currentTarget.style.borderColor = "#c0635a"; e.currentTarget.style.color = "#c0635a"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
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