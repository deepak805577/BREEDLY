"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AndroidDiscover.module.css";
import BottomNav from "../home/BottomNav";
import { Search, ArrowRight } from "lucide-react";
import { breeds } from "@/app/data/breeds";

export default function AndroidDiscover() {
  const [activeGroup, setActiveGroup] = useState("All");
  
  const breedList = Object.values(breeds);
  const groups = ["All", "Sporting", "Hound", "Working", "Terrier", "Toy", "Non-Sporting", "Herding"];

  const filteredBreeds = activeGroup === "All" 
    ? breedList 
    : breedList.filter(b => b.basic_info.breed_group.includes(activeGroup));

  // Limit to first 20 for performance in mobile view
  const displayBreeds = filteredBreeds.slice(0, 20);

  // We need a hero dog image for the top feature card
  const heroDogImage = breeds["Siberian Husky"]?.image || "/assets/Dogs/Siberian Husky.jpg";

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Discover</h1>
        <button className={styles.iconBtn}>
          <Search size={20} />
        </button>
      </div>

      {/* Feature Card */}
      <div className={styles.featureCardWrapper}>
        <div className={styles.featureCard}>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>375+ Breeds</h2>
            <p className={styles.featureSubtitle}>Find the one that matches your lifestyle.</p>
            <Link href="/breed-selector" className={styles.exploreBtn}>Explore Now</Link>
          </div>
          <div className={styles.featureImageWrapper}>
            <Image 
              src={heroDogImage} 
              alt="Husky" 
              fill
              style={{ objectFit: 'contain', objectPosition: 'bottom right' }}
              sizes="180px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {groups.map(group => (
          <button 
            key={group}
            className={`${styles.filterTab} ${activeGroup === group ? styles.active : ''}`}
            onClick={() => setActiveGroup(group)}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Breed List */}
      <div className={styles.listSection}>
        <div className={styles.sectionHeader}>
          <h3>Popular Breeds</h3>
        </div>
        
        <div className={styles.breedList}>
          {displayBreeds.map(breed => {
            const slug = breed.basic_info.name.toLowerCase().replace(/ /g, '-');
            return (
              <Link key={breed.basic_info.name} href={`/breeds/${slug}`} className={styles.breedItem}>
                <div className={styles.breedAvatar}>
                  <Image 
                    src={breed.image} 
                    alt={breed.basic_info.name} 
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="70px"
                  />
                </div>
                <div className={styles.breedInfo}>
                  <h4 className={styles.breedName}>{breed.basic_info.name}</h4>
                  <span className={styles.breedGroup}>{breed.basic_info.breed_group}</span>
                </div>
                <div className={styles.breedArrow}>
                  <ArrowRight size={18} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
