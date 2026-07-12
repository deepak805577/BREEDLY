"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AndroidHome.module.css";
import { Search, Mic, Bell, Play, ChevronRight, Lightbulb, Heart, BookOpen, Compass, Dog } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

export default function AndroidHome() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  if (!mounted) return null;

  const quickActions = [
    { name: "Resume Quiz", icon: <Play color="#cc6b49" size={24} />, bg: "#fceee9", link: "/breed-selector" },
    { name: "Browse", icon: <Compass color="#2e7d32" size={24} />, bg: "#e8f5e9", link: "/breeds" },
    { name: "Saved", icon: <Heart color="#c62828" size={24} />, bg: "#ffebee", link: "/saved" },
    { name: "My Dogs", icon: <Dog color="#1565c0" size={24} />, bg: "#e3f2fd", link: "/my-dog" },
  ];

  const recommended = [
    { id: 1, name: "Golden Retriever", score: "98%", img: "/golden.jpg", tags: ["Family", "Active"] },
    { id: 2, name: "French Bulldog", score: "94%", img: "/frenchie.jpg", tags: ["Apartment", "Low Maintenance"] },
    { id: 3, name: "Poodle", score: "91%", img: "/poodle.jpg", tags: ["Hypoallergenic", "Smart"] }
  ];

  const categories = ["Apartment Friendly", "Family Friendly", "First Time Owner", "Large Dogs", "Small Dogs", "Hypoallergenic"];

  const popular = [
    { id: 4, name: "Labrador Retriever", desc: "Friendly, active and outgoing", img: "/lab.jpg" },
    { id: 5, name: "German Shepherd", desc: "Confident, courageous, and smart", img: "/gsd.jpg" }
  ];

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || "Guest";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.greeting}>
          <p>{greeting},</p>
          <h1>{firstName}</h1>
        </div>
        <div className={styles.headerIcons}>
          <button className={styles.iconBtn}>
            <Bell size={20} color="#333" />
            <span className={styles.badge}></span>
          </button>
          <Link href="/profile">
            <div className={styles.avatar} style={{ background: '#ddd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <Dog size={24} color="#fff" />
            </div>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={20} />
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Search breeds..." 
          readOnly
          onClick={() => { /* Navigate to search screen or open modal */ }}
        />
        <Mic className={styles.micIcon} size={20} />
      </div>

      {/* Continue Section */}
      <Link href="/breed-selector" className={styles.continueCard}>
        <div className={styles.continueInfo}>
          <h3>Continue Quiz</h3>
          <p>You're 3 questions away from your match!</p>
        </div>
        <div className={styles.continueIcon}>
          <ChevronRight size={24} color="white" />
        </div>
      </Link>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.link} className={styles.actionCard}>
            <div className={styles.actionIconWrapper} style={{ backgroundColor: action.bg }}>
              {action.icon}
            </div>
            <span>{action.name}</span>
          </Link>
        ))}
      </div>

      {/* Recommended Breeds */}
      <div className={styles.sectionTitle}>
        <span>Recommended for You</span>
        <Link href="/results" className={styles.seeAll}>See All</Link>
      </div>
      <div className={styles.carousel}>
        {recommended.map(breed => (
          <Link key={breed.id} href={`/breeds/${breed.id}`} className={styles.breedCard}>
            <div style={{ position: 'relative' }}>
               {/* Using fallback div for image if the image doesn't exist locally */}
               <div className={styles.breedImage} style={{ background: 'var(--accent-light)' }}></div>
               <span className={styles.scoreBadge}>{breed.score} Match</span>
            </div>
            <div className={styles.breedInfo}>
              <h3>{breed.name}</h3>
              <div className={styles.breedTags}>
                {breed.tags.map(tag => (
                  <span key={tag} className={styles.breedTag}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Categories */}
      <div className={styles.chipsContainer}>
        {categories.map((cat, idx) => (
          <div key={idx} className={`${styles.chip} ${idx === 0 ? styles.active : ''}`}>
            {cat}
          </div>
        ))}
      </div>

      {/* Popular Breeds */}
      <div className={styles.sectionTitle}>
        <span>Popular Breeds</span>
      </div>
      <div className={styles.popularGrid}>
        {popular.map(breed => (
          <Link key={breed.id} href={`/breeds/${breed.id}`} className={styles.popularCard}>
            <div className={styles.popularImg} style={{ background: '#eee' }}></div>
            <div className={styles.popularInfo}>
              <h4>{breed.name}</h4>
              <p>{breed.desc}</p>
            </div>
            <ChevronRight size={20} className={styles.chevron} />
          </Link>
        ))}
      </div>

      {/* Daily Dog Tip */}
      <div className={styles.tipCard}>
        <div className={styles.tipHeader}>
          <div className={styles.tipIcon}>
            <Lightbulb size={24} />
          </div>
          <h4>Daily Dog Tip</h4>
        </div>
        <p>A tired dog is a good dog. Engage your pup with puzzle toys to mentally exhaust them, which is often more effective than a long walk!</p>
      </div>

      {/* Community Preview */}
      <div className={styles.sectionTitle}>
        <span>Community</span>
        <Link href="/community" className={styles.seeAll}>See All</Link>
      </div>
      <div className={styles.communityCard}>
        <div className={styles.communityHeader}>
          <div className={styles.communityAvatar} style={{ background: '#ff9800' }}>S</div>
          <div className={styles.communityName}>
            <strong>Sarah & Max</strong>
            <span>First time owner</span>
          </div>
        </div>
        <p>"Just got my first Golden Retriever puppy! Any tips on crate training for the first few nights?"</p>
        <div className={styles.communityTags}>
          <span className={styles.communityTag}>Training</span>
          <span className={styles.communityTag}>Puppy</span>
        </div>
      </div>
    </div>
  );
}
