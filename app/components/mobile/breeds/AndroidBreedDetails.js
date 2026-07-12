"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./AndroidBreedDetails.module.css";
import { ArrowLeft, Heart, Home, Stethoscope, Dumbbell, Shield, Image as ImageIcon, ArrowRight } from "lucide-react";

export default function AndroidBreedDetails({ breed }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  if (!breed) return null;

  const { basic_info, quick_overview, appearance_and_coat, personality_and_temperament } = breed;

  const tags = [];
  if (basic_info.size) tags.push(basic_info.size);
  if (quick_overview.temperament) {
    const tempWords = quick_overview.temperament.split(', ').slice(0, 3);
    tags.push(...tempWords);
  }

  return (
    <div className={styles.container}>
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.topNav}>
          <button className={styles.iconBtn} onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </button>
          <button className={styles.iconBtn}>
            <Heart size={24} />
          </button>
        </div>
        
        {/* Floating tag inside hero */}
        <div className={styles.floatingTag}>
           <i className="fa-solid fa-paw" style={{ color: '#b9854a' }}></i> Perfect Family Dog
        </div>

        <Image 
          src={breed.image || "/assets/Dogs/Golden Retriever.jpg"}
          alt={basic_info.name}
          fill
          style={{ objectFit: 'cover', objectPosition: 'top' }}
          priority
        />
      </div>

      {/* Bottom Sheet */}
      <div className={styles.infoSheet}>
        <h1 className={styles.breedTitle}>{basic_info.name}</h1>
        <p className={styles.summary}>{basic_info.one_sentence_summary}</p>

        {/* Tags */}
        <div className={styles.tagsScroll}>
          {tags.map((tag, i) => (
            <div key={i} className={styles.pill}>{tag}</div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Life Expectancy</span>
            <span className={styles.statValue}>{quick_overview.lifespan}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Origin</span>
            <span className={styles.statValue}>{basic_info.origin.replace(/[\u1F1E6-\u1F1FF]/g, '')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Group</span>
            <span className={styles.statValue}>{basic_info.breed_group}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>
            <Home size={24} strokeWidth={activeTab === 'overview' ? 2 : 1.5} />
            Overview
          </button>
          <button className={`${styles.tab} ${activeTab === 'care' ? styles.active : ''}`} onClick={() => setActiveTab('care')}>
            <Shield size={24} strokeWidth={activeTab === 'care' ? 2 : 1.5} />
            Care
          </button>
          <button className={`${styles.tab} ${activeTab === 'training' ? styles.active : ''}`} onClick={() => setActiveTab('training')}>
            <Dumbbell size={24} strokeWidth={activeTab === 'training' ? 2 : 1.5} />
            Training
          </button>
          <button className={`${styles.tab} ${activeTab === 'health' ? styles.active : ''}`} onClick={() => setActiveTab('health')}>
            <Stethoscope size={24} strokeWidth={activeTab === 'health' ? 2 : 1.5} />
            Health
          </button>
          <button className={`${styles.tab} ${activeTab === 'gallery' ? styles.active : ''}`} onClick={() => setActiveTab('gallery')}>
            <ImageIcon size={24} strokeWidth={activeTab === 'gallery' ? 2 : 1.5} />
            Gallery
          </button>
        </div>

        {/* Content */}
        <div className={styles.contentArea}>
          <h3>About {basic_info.name}</h3>
          <p>{personality_and_temperament?.overview || "No overview available."}</p>
          
          <button className={styles.primaryBtn}>
            Learn More <ArrowRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
}
