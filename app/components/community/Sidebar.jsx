"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { label: "Community Feed", href: "/community",  icon: <GridIcon /> },
  { label: "My Profile",     href: "/profile",    icon: <UserIcon /> },
  { label: "Saved Posts",    href: "/profile",    icon: <BookmarkIcon /> },
  { label: "Discover",       href: "/community",  icon: <StarIcon /> },
];

export default function Sidebar({ currentUser }) {
  const router   = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}
      className="bc-sidebar"
    >
      <style>{`
        .bc-sidebar { display:flex; }
        @media(max-width:768px) { .bc-sidebar { display:none !important; } }
      `}</style>

      {/* Logo */}
      <div style={{ padding: "24px 24px 22px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ fontfamily: 'Dogica', fontSize: 22, fontWeight: 600, color: "var(--primary-dark)", letterSpacing: "0.3px" }}>
          BreedLy
        </div>
        <div style={{ fontFamily: "'Fedoka', sans-serif", fontSize: 11, color: "var(--muted)", marginTop: 2, fontWeight: 400 }}>
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
  {currentUser?.avatarUrl
    ? <img src={currentUser.avatarUrl} alt={currentUser.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : currentUser?.initials ?? "?"
  }
</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{currentUser?.name ?? "Dog Lover"}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{currentUser?.breed ?? "Mixed Breed"}</div>
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
  );
}

function GridIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>;
}
function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="4"/><path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>;
}
function BookmarkIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z"/></svg>;
}
function StarIcon() {
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l2.4 4.9 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.6.9-5.5L2 7.7l5.6-.8z"/></svg>;
}
