"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AndroidHome.module.css";
import { Search, Mic, Bell, Play, ChevronRight, Compass, Dog, BookOpen, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { breeds } from "@/app/data/breeds";

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
    { name: "Quiz", icon: <Play color="#b9854a" size={24} />, bg: "var(--primary-soft)", link: "/breed-selector" },
    { name: "Browse", icon: <Compass color="#A67B5B" size={24} />, bg: "var(--surface)", link: "/breeds" },
    { name: "My Dogs", icon: <Dog color="#b9854a" size={24} />, bg: "var(--primary-soft)", link: "/my-dog" },
    { name: "Guides", icon: <BookOpen color="#A67B5B" size={24} />, bg: "var(--surface)", link: "/food-guide" },
    { name: "Community", icon: <MessageCircle color="#b9854a" size={24} />, bg: "var(--primary-soft)", link: "/community" },
  ];

  // Get specific breeds from real data for demo
  const recommendedKeys = ["Golden Retriever", "French Bulldog", "Poodle"];
  const popularKeys = ["Labrador Retriever", "German Shepherd Dog", "Beagle"];

  const getBreedData = (keys) => {
    return keys.map(key => breeds[key]).filter(Boolean);
  };

  const recommended = getBreedData(recommendedKeys);
  const popular = getBreedData(popularKeys);

  const categories = ["Apartment Friendly", "Family Friendly", "First Time Owner", "Large Dogs", "Small Dogs", "Hypoallergenic"];

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
            <Bell size={20} color="var(--muted)" />
            <span className={styles.badge}></span>
          </button>
          <Link href="/profile">
            <div className={styles.avatar} style={{ background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <p>Find your perfect match!</p>
        </div>
        <div className={styles.continueIcon}>
          <ChevronRight size={24} />
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
        <Link href="/breeds" className={styles.seeAll}>See All</Link>
      </div>
      <div className={styles.carousel}>
        {recommended.map(breed => {
           const slug = breed.basic_info.name.toLowerCase().replace(/ /g, '-');
           const tags = [breed.basic_info.size, breed.quick_overview.energy_level.split(' ')[0]];
           return (
            <Link key={breed.basic_info.name} href={`/breeds/${slug}`} className={styles.breedCard}>
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <Image 
                  src={breed.image} 
                  alt={breed.basic_info.name} 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <span className={styles.scoreBadge}>98% Match</span>
              </div>
              <div className={styles.breedInfo}>
                <h3>{breed.basic_info.name}</h3>
                <div className={styles.breedTags}>
                  {tags.map(tag => (
                    <span key={tag} className={styles.breedTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          )
        })}
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
        {popular.map(breed => {
          const slug = breed.basic_info.name.toLowerCase().replace(/ /g, '-');
          return (
            <Link key={breed.basic_info.name} href={`/breeds/${slug}`} className={styles.popularCard}>
              <div style={{ position: 'relative', width: '75px', height: '75px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                <Image 
                  src={breed.image} 
                  alt={breed.basic_info.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="75px"
                />
              </div>
              <div className={styles.popularInfo}>
                <h4>{breed.basic_info.name}</h4>
                <p>{breed.basic_info.one_sentence_summary}</p>
              </div>
              <ChevronRight size={20} className={styles.chevron} />
            </Link>
          );
        })}
      </div>

      {/* Community Preview */}
      <div className={styles.sectionTitle}>
        <span>Community</span>
        <Link href="/community" className={styles.seeAll}>See All</Link>
      </div>
      <div className={styles.communityCard}>
        <div className={styles.communityHeader}>
          <div className={styles.communityAvatar}>S</div>
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
