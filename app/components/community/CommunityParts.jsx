"use client";

import { useState } from "react";
import UserMenu from "../auth/UserMenu";

// ── TopBar (desktop) ──────────────────────────────────────────────────────────
export function TopBar({ breed, searchQuery, onSearchChange, onPost }) {
  return (
    <div className="bc-topbar-wrapper">
      <style>{`
        .bc-topbar-wrapper {
          display: flex;
          background: rgba(250, 247, 242, 0.80);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(176, 137, 104, 0.16);
          border-radius: var(--radius-lg);
          margin: 16px 24px 8px;
          padding: 0 24px;
          height: 60px;
          align-items: center;
          gap: 20px;
          position: sticky;
          top: 16px;
          z-index: 100;
          box-shadow: 0 8px 30px rgba(100, 70, 40, 0.04);
          transition: var(--transition);
        }
        .bc-topbar-wrapper:hover {
          box-shadow: 0 12px 36px rgba(100, 70, 40, 0.08);
          border-color: rgba(176, 137, 104, 0.28);
        }
        .bc-brand-path {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .bc-brand-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--accent-dark);
          letter-spacing: 0.01em;
          margin-left: 2px;
        }
        .bc-search-container {
          position: relative;
          flex: 1;
          max-width: 280px;
          transition: var(--transition);
        }
        .bc-search-input {
          width: 100%;
          padding: 9px 36px 9px 36px;
          border: 1.5px solid var(--border-strong);
          border-radius: var(--radius-pill);
          background: var(--bg-soft);
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          transition: all 0.25s ease;
        }
        .bc-search-input:focus {
          border-color: var(--accent) !important;
          background: var(--soft-white);
          box-shadow: 0 0 0 3px rgba(176, 137, 104, 0.15);
          max-width: 320px;
        }
        .bc-search-input::placeholder {
          color: var(--text-light);
        }
        .bc-search-kbd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: 700;
          color: var(--text-light);
          background: var(--bg-soft);
          border: 1px solid var(--border-strong);
          border-radius: 4px;
          padding: 1px 5px;
          pointer-events: none;
          font-family: var(--font-body);
        }
        .bc-btn-share {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          background: var(--accent-dark);
          color: var(--soft-white);
          border: none;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(127, 85, 57, 0.15);
        }
        .bc-btn-share:hover {
          background: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(127, 85, 57, 0.22);
        }
        @media(max-width: 768px) {
          .bc-topbar-wrapper {
            display: none !important;
          }
        }
      `}</style>

      {/* Brand Indicator / Title */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "flex-start" }}>
        <div className="bc-brand-path">
          <span>BreedLy</span>
          <span style={{ fontSize: 9, opacity: 0.6 }}>🐾</span>
          <span style={{ color: "var(--accent)" }}>Feed</span>
        </div>
        <h1 className="bc-brand-title">Community</h1>
      </div>

      {/* Search */}
      <div className="bc-search-container">
        <svg 
          style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5, color: "var(--accent-dark)" }} 
          width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M15 15l3 3" />
        </svg>
        <input
          value={searchQuery || ""}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search pack..."
          className="bc-search-input"
        />
        <span className="bc-search-kbd">/</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {onPost && (
          <button className="bc-btn-share" onClick={onPost}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Share Post
          </button>
        )}
        <NotifBtn />
        <UserMenu />
      </div>
    </div>
  );
}

// ── MobileTopBar ──────────────────────────────────────────────────────────────
export function MobileTopBar({ onPost }) {
  const toggleDrawer = () => {
    const sidebar = document.querySelector(".bc-sidebar");
    const overlay = document.querySelector(".bc-overlay");
    if (sidebar && overlay) {
      sidebar.classList.add("open");
      overlay.classList.add("show");
    }
  };

  return (
    <div className="bc-mobile-top-wrapper">
      <style>{`
        .bc-mobile-top-wrapper {
          display: none;
          background: rgba(250, 247, 242, 0.82);
          backdrop-filter: blur(14px) saturate(180%);
          border: 1px solid rgba(176, 137, 104, 0.16);
          border-radius: var(--radius-lg);
          margin: 10px 12px 6px;
          padding: 0 16px;
          height: 56px;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 10px;
          z-index: 100;
          box-shadow: 0 6px 20px rgba(100, 70, 40, 0.03);
          transition: var(--transition);
        }
        .bc-drawer-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: var(--accent-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
        }
        .bc-drawer-btn:active {
          background: var(--bg-soft);
          transform: scale(0.92);
        }
        .bc-mobile-logo {
          font-family: var(--font-display);
          font-size: 20px;
          color: var(--accent-dark);
          fontWeight: 400;
          letter-spacing: 0.2px;
        }
        @media(max-width: 768px) {
          .bc-mobile-top-wrapper {
            display: flex !important;
          }
        }
      `}</style>
      
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button className="bc-drawer-btn" onClick={toggleDrawer} aria-label="Open navigation menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="16" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        <span className="bc-mobile-logo">BreedLy</span>
      </div>
      
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <NotifBtn />
        <UserMenu />
      </div>
    </div>
  );
}

function NotifBtn() {
  return (
    <button 
      style={{
        width: 36, height: 36,
        borderRadius: "50%",
        background: "var(--bg-soft)",
        border: "1.5px solid var(--border-strong)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        color: "var(--text-secondary)",
        position: "relative",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "var(--card-lite)";
        e.currentTarget.style.color = "var(--accent-dark)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "var(--bg-soft)";
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" />
        <path d="M8.5 17a1.5 1.5 0 003 0" />
      </svg>
      {/* Pulse notification badge */}
      <span style={{
        position: "absolute",
        top: 3, right: 3,
        width: 8, height: 8,
        borderRadius: "50%",
        background: "var(--danger)",
        border: "1.5px solid var(--soft-white)",
        display: "block",
        boxShadow: "0 0 0 rgba(192, 99, 90, 0.4)",
        animation: "pulseDot 1.6s infinite",
      }} />
      <style>{`
        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0px rgba(192, 99, 90, 0.7); }
          100% { box-shadow: 0 0 0 8px rgba(192, 99, 90, 0); }
        }
      `}</style>
    </button>
  );
}
export function FilterBar({ filters = [], active, onChange }) {
  return (
    <div className="bc-filter-wrapper">
      <style>{`
        .bc-filter-wrapper {
          position: relative;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 10px 24px;
        }
        .bc-filter-scroll-container {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 4px 0;
          mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 4%, rgba(0,0,0,1) 96%, rgba(0,0,0,0) 100%);
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 4%, rgba(0,0,0,1) 96%, rgba(0,0,0,0) 100%);
        }
        .bc-filter-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .bc-filter-pill {
          flex-shrink: 0;
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          border: 1.5px solid var(--border-strong);
          background: var(--bg-soft);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .bc-filter-pill.active {
          background: var(--accent-dark);
          border-color: var(--accent-dark);
          color: var(--soft-white);
          box-shadow: 0 4px 12px rgba(127, 85, 57, 0.2);
          transform: translateY(-1px);
        }
        .bc-filter-pill:hover:not(.active) {
          background: var(--card-lite);
          border-color: var(--accent);
          color: var(--accent-dark);
          transform: translateY(-1px);
        }
        @media(max-width: 768px) {
          .bc-filter-wrapper {
            padding: 8px 16px;
          }
        }
      `}</style>
      <div className="bc-filter-scroll-container">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => onChange(f)}
            className={`bc-filter-pill ${active === f ? "active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>
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
      <div style={{ flex: 1, fontSize: 14, color: "var(--text-light)", fontFamily: "var(--font-body)" }}>
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
