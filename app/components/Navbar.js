"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useState, useEffect } from "react";
import ProfileAvatarModal from "@/app/components/AvatarModal";
import { useRouter } from "next/navigation";

/* ─── PREMIUM NAVIGATION SVG SYSTEM ──────────────────────────────────────── */
const NAV_SVGS = {
  home: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  quiz: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  breeds: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  aiBot: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />
    </svg>
  ),
  community: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="icon" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  paw: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="icon" {...props}>
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z" />
    </svg>
  ),
  camera: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  wave: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
    </svg>
  ),
  map: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  chat: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  food: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20h18L19 9H5L3 20z" />
      <path d="M9 9c0-1.66 1.34-3 3-3s3 1.34 3 3" />
    </svg>
  ),
  health: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  care: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4L8.12 10.12M20 20L8.12 13.88M8.12 12h6" />
    </svg>
  ),
  training: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  book: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  dog: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {/* Adorable Floppy Ears with cute organic folds */}
      <path d="M5.5 6c-1.5.5-2.5 2-2.5 4s1 4.5 2.5 5.5c.3.2.7.1.8-.2.2-.4.2-1.2.2-2.2V7.5" fill="none" stroke="currentColor" />
      <path d="M18.5 6c1.5.5 2.5 2 2.5 4s-1 4.5-2.5 5.5c-.3.2-.7.1-.8-.2-.2-.4-.2-1.2-.2-2.2V7.5" fill="none" stroke="currentColor" />

      {/* Main Head Structure */}
      <path d="M12 4.5c-3 0-5.5 1.8-6 5.5-.3 2 .3 4 1.5 5.5v.5c0 1.8 1.8 2.5 4.5 2.5s4.5-.7 4.5-2.5v-.5c1.2-1.5 1.8-3.5 1.5-5.5-.5-3.7-3-5.5-6-5.5z" />

      {/* Soft snout/muzzle */}
      <path d="M9.5 13c0 1.8 1 2.8 2.5 2.8s2.5-1 2.5-2.8c0-1.2-.8-2-2.5-2s-2.5.8-2.5 2z" />

      {/* Cute small nose with standard nostrils */}
      <path d="M11 12.2c.4-.3 1.6-.3 2 0 .2.2.3.4.2.6-.1.3-.5.5-1 .5s-.9-.2-1-.5c-.1-.2 0-.4.2-.6z" fill="currentColor" stroke="none" />

      {/* Smiling mouth with a cute pink tongue sticking out! */}
      <path d="M11.2 14.8c0 .8.4 1.4.8 1.4s.8-.6.8-1.4h-1.6z" fill="#ffb3ba" stroke="currentColor" strokeWidth="1" />
      <path d="M10.8 14c.2.4.6.6 1.2.6s1-.2 1.2-.6" />

      {/* Rosy Cheek Blush marks */}
      <path d="M6.5 12.5a1 1 0 0 0 1-1M16.5 11.5a1 1 0 0 1 1 1" opacity="0.6" strokeWidth="1" />

      {/* Large, glassy, expressive eyes (Cute Pixar/Anime style sparkles) */}
      <circle cx="8.8" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="8.3" cy="9.0" r="0.5" fill="#ffffff" stroke="none" />
      <circle cx="9.2" cy="9.9" r="0.25" fill="#ffffff" stroke="none" />

      <circle cx="15.2" cy="9.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="14.7" cy="9.0" r="0.5" fill="#ffffff" stroke="none" />
      <circle cx="15.6" cy="9.9" r="0.25" fill="#ffffff" stroke="none" />

      {/* Tiny cute eyebrows */}
      <path d="M7.8 7.5c.3-.3.7-.3 1 0M15.2 7.5c.3-.3.7-.3 1 0" strokeWidth="1" />
    </svg>
  ),
};

export default function Navbar() {
  const pathname = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);
  const [AIOpen, setAIOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileAIOpen, setMobileAIOpen] = useState(false);
  const username = profile?.username;
  const profilePic = profile?.avatar_url;

  // 🚫 Hide navbar on immersive flows
  const hideNavbar =
    pathname.startsWith("/breed-selector") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/adoption-guide") ||
    pathname.startsWith("/adoption-success") ||
    pathname.startsWith("/breeds") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/my-dog") ||
    pathname.startsWith("/food-guide") ||
    pathname.startsWith("/health-guide") ||
    pathname.startsWith("/training-guide") ||
    pathname.startsWith("/care-grooming") ||
    pathname.startsWith("/bark-analyzer") ||
    pathname.startsWith("/pet-services") ||
    pathname.startsWith("/detect-dog") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/community") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/onboarding")||
    pathname.startsWith("/admin");

  useEffect(() => {
    setMobileAIOpen(false);
    setMobileGuideOpen(false);
  }, [pathname]);

  if (hideNavbar || loading) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* TOP NAV */}
      <nav className="navbar">
        <div className="nav-left">
          <img
            src="/assets/dog (2).png"
            alt="BreedLy Logo"
            className="logo-img"
          />
          <div className="logo-text" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              BreedLy
              {NAV_SVGS.paw({ style: { width: 18, height: 18, color: "#b9854a" } })}
            </h1>
            <span>Know About Paws</span>
          </div>
        </div>

        <ul className="nav-center">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/breed-selector">Breed Selector</Link></li>
          <li><Link href="/breeds">Breeds</Link></li>
          <li><Link href="/chat">Paw Assistant</Link></li>
          <li><Link href="/community">Paw community</Link></li>

          {/* AI DROPDOWN */}
          {/* <li
            className="nav-dropdown"
            onMouseEnter={() => setAIOpen(true)}
            onMouseLeave={() => setAIOpen(false)}
          >
            <span className="dropdown-title"> */}
              {/* PupAI Hub <span className="arrow">▾</span>
            </span> */}

            {/* {AIOpen && (
              <div className="dropdown-menu">
                <Link href="/detect-dog">Breed Identify</Link>
                {/* <Link href="/bark-analyzer">PupTone Analyzer</Link>
                <Link href="/pet-services">Nearby pet care</Link> */}
              {/* </div>
            )}
          </li> */}

          {/* GUIDE DROPDOWN */}
          <li
            className="nav-dropdown"
            onMouseEnter={() => setGuideOpen(true)}
            onMouseLeave={() => setGuideOpen(false)}
          >
            <span className="dropdown-title">
              Guide <span className="arrow">▾</span>
            </span>

            {guideOpen && (
              <div className="dropdown-menu">
                <Link href="/food-guide">Food Guide</Link>
                <Link href="/health-guide">Health Guide</Link>
                <Link href="/care-grooming">Care Guide</Link>
                <Link href="/training-guide">Training Guide</Link>
              </div>
            )}
          </li>

          <li><Link href="/my-dog">My Dog</Link></li>
        </ul>

        {user ? (
          <div className="nav-avatar" onClick={() => router.push("/profile")}>
            {profilePic ? (
              <img src={profilePic} alt="Profile" key={profilePic} />
            ) : (
              <span className="nav-avatar-fallback">
                {username?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "?"}
              </span>
            )}
          </div>
        ) : (
          <div className="nav-right">
            <Link href="/profile" className="btn-primary">
              Login
            </Link>
          </div>
        )}
      </nav>

      {/* AVATAR MODAL */}
      <ProfileAvatarModal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        onAvatarUpdated={() => window.location.reload()}
      />

      {/* MOBILE BOTTOM NAV */}
      <div className={`bottom-navbar ${hideNavbar ? "nav-hidden" : ""}`}>
        <div className="button-container">
          <Link href="/" className={`button ${pathname === "/" ? "active" : ""}`} title="Home">
            {NAV_SVGS.home()}
          </Link>

          <Link href="/breed-selector" className={`button ${pathname === "/breed-selector" ? "active" : ""}`} title="Quiz">
            {NAV_SVGS.quiz()}
          </Link>

          <Link href="/breeds" className={`button ${(pathname === "/breeds" || pathname.startsWith("/breeds/")) ? "active" : ""}`} title="Breeds">
            {NAV_SVGS.breeds()}
          </Link>

          <button
            className={`button highlight ${mobileAIOpen ? "active" : ""}`}
            onClick={() => setMobileAIOpen(!mobileAIOpen)}
            title="PupAI Hub & Guides"
          >
            {NAV_SVGS.aiBot()}
          </button>

          <Link href="/community" className={`button ${pathname === "/community" ? "active" : ""}`} title="Community">
            {NAV_SVGS.community()}
          </Link>

          <Link href="/my-dog" className={`button ${(pathname === "/my-dog" || pathname.startsWith("/my-dog/")) ? "active" : ""}`} title="My Dog">
            {NAV_SVGS.paw()}
          </Link>
        </div>

        {/* OVERLAY */}
        {(mobileAIOpen || mobileGuideOpen) && (
          <div
            className="guide-overlay"
            onClick={() => {
              setMobileAIOpen(false);
              setMobileGuideOpen(false);
            }}
          />
        )}

        {/* BOTTOM SHEET */}
        <div className={`mobile-guide-sheet ${mobileAIOpen ? "open" : ""}`}>
          <div className="sheet-handle" />

          <h3 className="sheet-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {NAV_SVGS.paw({ style: { width: 16, height: 16, color: "var(--accent-dark)" } })}
            PupAI Hub
          </h3>
{/* 
          <Link href="/detect-dog" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.camera({ style: { width: 18, height: 18 } })}
            <span>Breed Identify</span>
          </Link>

          <Link href="/bark-analyzer" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.wave({ style: { width: 18, height: 18 } })}
            <span>Bark Analyzer</span>
          </Link>

          <Link href="/pet-services" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.map({ style: { width: 18, height: 18 } })}
            <span>Nearby Pet Care</span>
          </Link> */}

          <Link href="/chat" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.chat({ style: { width: 18, height: 18 } })}
            <span>Paw Assistant</span>
          </Link>

          <hr style={{ border: "0", height: "1px", background: "rgba(0,0,0,0.08)", margin: "12px 0" }} />

          <h3 className="sheet-title" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            {NAV_SVGS.book({ style: { width: 16, height: 16, color: "var(--accent-dark)" } })}
            Guides
          </h3>

          <Link href="/food-guide" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.food({ style: { width: 18, height: 18 } })}
            <span>Food Guide</span>
          </Link>

          <Link href="/health-guide" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.health({ style: { width: 18, height: 18 } })}
            <span>Health Guide</span>
          </Link>

          <Link href="/care-grooming" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.care({ style: { width: 18, height: 18 } })}
            <span>Care Guide</span>
          </Link>

          <Link href="/training-guide" onClick={() => setMobileAIOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {NAV_SVGS.training({ style: { width: 18, height: 18 } })}
            <span>Training Guide</span>
          </Link>
        </div>
      </div>
    </>
  );
}