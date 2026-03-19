"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useState } from "react";
import ProfileAvatarModal from "@/app/components/AvatarModal";
import { useRouter } from "next/navigation";



export default function Navbar() {
  const pathname = usePathname();
  const [guideOpen, setGuideOpen] = useState(false);
  const [AIOpen,setAIOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [avatarOpen, setAvatarOpen] = useState(false);

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
    pathname.startsWith("/health-guide")||
    pathname.startsWith("/training-guide")||
    pathname.startsWith("/care-grooming")||
    pathname.startsWith("/bark-analyzer")||
    pathname.startsWith("/pet-services")||
    pathname.startsWith("/detect-dog")||
    pathname.startsWith("/chat")||
    pathname.startsWith("/community")||
    pathname.startsWith("/profile")||
    pathname.startsWith("/onboarding");


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
          <div className="logo-text">
            <h1>BreedLy 🐾</h1>
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
  <li
    className="nav-dropdown"
    onMouseEnter={() => setAIOpen(true)}
    onMouseLeave={() => setAIOpen(false)}
  >
    <span className="dropdown-title">
    PupAI Hub
 <span className="arrow">▾</span>
    </span>

    {AIOpen && (
      <div className="dropdown-menu">
        <Link href="/detect-dog">Breed Identify</Link>
  <Link href="/bark-analyzer">PupTone Analyzer</Link>
  <Link href="/pet-services">Nearby pet care</Link>
        
      </div>
    )}
  </li>
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
        <Link href="/food-guide"> 🍖 Food Guide</Link>
        <Link href="/health-guide"> 🩺 Health Guide</Link>
        <Link href="/care-grooming"> 🛁 Care Guide</Link>
        <Link href="/training-guide"> 🐶 Training Guide</Link>
        
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
    <Link href="/login" className="btn-primary">
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
    <Link href="/" className="button">
      <img src="/assets/icons/home-icon(1).png" alt="Home" className="icon" />
    </Link>

    <Link href="/breed-selector" className="button">
      <img src="/assets/icons/quiz-icon(1).png" alt="Quiz" className="icon" />
    </Link>

    <Link href="/breeds" className="button">
      <img src="/assets/icons/breed-icon(1).png" alt="Breeds" className="icon" />
    </Link>

    {/* GUIDE BUTTON */}
    <button
      className="button"
      onClick={() => setMobileGuideOpen(!mobileGuideOpen)}
    >
      <img
        src="/assets/icons/user-guide.png"
        alt="Guide"
        className="icon"
      />
    </button>

    <Link href="/my-dog" className="button">
      <img src="/assets/icons/paw-icon(1).png" alt="My Dog" className="icon" />
    </Link>
  </div>

  {/* MOBILE GUIDE MENU */}
 {/* OVERLAY */}
{mobileGuideOpen && (
  <div
    className="guide-overlay"
    onClick={() => setMobileGuideOpen(false)}
  />
)}

{/* BOTTOM SHEET */}
<div
  className={`mobile-guide-sheet ${
    mobileGuideOpen ? "open" : ""
  }`}
>
  <div className="sheet-handle" />

  <h3 className="sheet-title">Guides</h3>

  <Link href="/food-guide" onClick={() => setMobileGuideOpen(false)}>
    🍖 Food Guide
  </Link>

  <Link href="/health-guide" onClick={() => setMobileGuideOpen(false)}>
    🩺 Health Guide
  </Link>

  <Link href="/care-grooming" onClick={() => setMobileGuideOpen(false)}>
    🛁 Care Guide
  </Link>

  <Link href="/training-guide" onClick={() => setMobileGuideOpen(false)}>
    🐶 Training Guide
  </Link>
</div>

</div>

    </>
  );
}