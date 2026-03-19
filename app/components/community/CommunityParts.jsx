"use client";

import { useState } from "react";
import UserMenu from "../auth/UserMenu";

// ── TopBar (desktop) ──────────────────────────────────────────────────────────
export function TopBar({ breed }) {
  return (
    <div style={{
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
      padding: "0 28px", height: 60,
      display: "flex", alignItems: "center", gap: 16,
    }}
      className="bc-topbar"
    >
      <style>{`
        .bc-topbar { display:flex; }
        @media(max-width:768px){ .bc-topbar{ display:none !important; } }
      `}</style>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 500, color: "var(--primary-dark)", flex: 1 }}>
        Community Feed
      </div>

      {/* Search */}
      <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
        <svg style={{ position:"absolute", left:12, top
          :"50%", transform:"translateY(-50%)", opacity:0.4 }} width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#8b7a6a" strokeWidth="1.8"><circle cx="9" cy="9" r="6"/><path d="M15 15l3 3"/></svg>
        <input
          placeholder="Search posts, breeds, tags..."
          style={{
            width: "100%", padding: "9px 14px 9px 36px",
            border: "1.5px solid var(--border)", borderRadius: "var(--radius-pill)",
            background: "var(--bg)", fontFamily: "var(--font-body)",
            fontSize: 13, color: "var(--text)", outline: "none", transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = "var(--primary-dark)"}
          onBlur={e  => e.target.style.borderColor = "var(--border)"}
        />
      </div>

      <UserMenu />
    </div>
  );
}

// ── MobileTopBar ──────────────────────────────────────────────────────────────
export function MobileTopBar({ onPost }) {
  return (
    <div style={{
      display: "none", background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "14px 18px",
      alignItems: "center", justifyContent: "space-between",
    }}
      className="bc-mobile-top"
    >
      <style>{`
        .bc-mobile-top { display:none !important; }
        @media(max-width:768px){ .bc-mobile-top{ display:flex !important; } }
      `}</style>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--primary-dark)", fontWeight: 600 }}>
        BreedLy
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <NotifBtn />
        <UserMenu compact />
      </div>
    </div>
  );
}

function NotifBtn() {
  return (
    <button style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "var(--bg)", border: "1.5px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", transition: "background 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--primary-soft)"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--bg)"}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#8b7a6a" strokeWidth="1.8"><path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z"/><path d="M8.5 17a1.5 1.5 0 003 0"/></svg>
    </button>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
export function FilterBar({ filters = [], active, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 8, padding: "14px 28px",
      overflowX: "auto", scrollbarWidth: "none",
      background: "var(--surface)", borderBottom: "1px solid var(--border)",
    }}>
      <style>{`
        .bc-filter-row::-webkit-scrollbar{display:none}
        @media(max-width:768px){.bc-filter-row{padding:12px 16px !important}}
      `}</style>
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            flexShrink: 0, padding: "7px 18px",
            borderRadius: "var(--radius-pill)",
            fontSize: 13, fontWeight: 500,
            fontFamily: "var(--font-body)",
            border: `1.5px solid ${active === f ? "var(--primary-dark)" : "var(--border)"}`,
            background: active === f ? "var(--primary-dark)" : "transparent",
            color: active === f ? "#fff" : "var(--text)",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => { if (active !== f) { e.currentTarget.style.background="var(--primary-soft)"; e.currentTarget.style.borderColor="var(--primary)"; e.currentTarget.style.color="var(--primary-dark)"; } }}
          onMouseLeave={e => { if (active !== f) { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text)"; } }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

// ── ComposeBanner ─────────────────────────────────────────────────────────────
export function ComposeBanner({ onOpen, currentUser }) {
  return (
    <div
      onClick={onOpen}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "12px 16px", cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
        marginBottom: 20,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="var(--primary)"; e.currentTarget.style.boxShadow="0 2px 12px rgba(166,123,91,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"; }}
    >
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
      <div style={{ flex: 1, fontSize: 14, color: "var(--border)", fontFamily: "var(--font-body)" }}>
        Share something with the pack...
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          <svg key="img" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8b7a6a" strokeWidth="1.5"><rect x="1" y="2" width="12" height="10" rx="2"/><circle cx="5" cy="6" r="1.2"/><path d="M1 10l3-3 3 3 2-2 3 2"/></svg>,
          <svg key="vid" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#8b7a6a" strokeWidth="1.5"><polygon points="2,2 12,7 2,12"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ width:30, height:30, borderRadius:10, background:"var(--bg)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Recommendation Banner ──────────────────────────────────────────────────
export function AIRecommendationBanner({ breed = "your dog" }) {
  return (
    <div style={{
      background: "var(--primary-dark)",
      borderRadius: "var(--radius-lg)",
      padding: "12px 18px",
      display: "flex", alignItems: "center", gap: 12,
      marginBottom: 16,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%",
        background: "var(--primary)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#A67B5B" strokeWidth="1.6"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.2 3.2l1.4 1.4M9.4 9.4l1.4 1.4M3.2 10.8l1.4-1.4M9.4 4.6l1.4-1.4"/><circle cx="7" cy="7" r="2"/></svg>
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-body)" }}>
          Recommended for {breed} owners
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2, fontFamily: "var(--font-body)" }}>
          Personalized based on your dog's profile & activity
        </div>
      </div>
      <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-body)" }}>
        AI
      </div>
    </div>
  );
}
