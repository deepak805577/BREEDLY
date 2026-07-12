"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./AndroidHome.module.css";
import { Search, Compass, BookOpen, Users, Bookmark, PawPrint } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { breeds } from "@/app/data/breeds";
import { fetchPosts } from "@/app/services/communityApi";

export default function AndroidHome() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [mounted, setMounted] = useState(false);
  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    fetchPosts({ page: 1 })
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          const quotePost = data.posts.find(p => p.content?.length > 30 && p.content?.length < 120) || data.posts[0];
          setFeaturedPost(quotePost);
        }
      })
      .catch(console.error);
  }, []);

  if (!mounted) return null;

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || "Deepak";

  // Data
  const cinematicBreeds = ["Golden Retriever", "French Bulldog", "Siberian Husky"].map(key => breeds[key]).filter(Boolean);
  const discoverBreeds = ["Poodle", "Beagle", "German Shepherd Dog", "Bulldog"].map(key => breeds[key]).filter(Boolean);
  const heroDogImage = breeds["Golden Retriever"]?.image || "/assets/Dogs/Golden Retriever.jpg";

  return (
    <div className={styles.container}>
      
      {/* SECTION 1: Immersive Hero */}
      <div style={{ position: 'relative' }}>
        <div className={styles.heroWrapper}>
          <div className={styles.heroBackground}>
            <Image 
              src={heroDogImage} 
              alt="Hero Dog" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div>
              <h1 className={styles.greetingText}>{greeting},<br/>{firstName}</h1>
              <p className={styles.greetingSub}>Your next best friend might already be waiting.</p>
            </div>
            
            <Link href="/breeds" className={styles.searchPill}>
              <Search size={20} />
              <span>Search Breeds</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: Chosen For Your Lifestyle */}
      <div className={styles.sectionHeader}>
        <h2>Chosen For Your Lifestyle</h2>
      </div>
      <div className={styles.horizontalScroll}>
        {cinematicBreeds.map(breed => {
          const slug = breed.basic_info.name.toLowerCase().replace(/ /g, '-');
          return (
            <Link key={slug} href={`/breeds/${slug}`} className={styles.cinematicCard}>
              <Image src={breed.image} alt={breed.basic_info.name} fill style={{ objectFit: 'cover' }} />
              <div className={styles.cardOverlay}></div>
              
              <div className={styles.badgeTopLeft}>
                98% Match
              </div>

              <div className={styles.cinematicContent}>
                <h3>{breed.basic_info.name}</h3>
                <div className={styles.cinematicTags}>
                  <span className={styles.tag}>{breed.basic_info.breed_group}</span>
                  <span className={styles.tag}>{breed.basic_info.size}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* SECTION 3: Continue Your Journey */}
      <div className={styles.sectionHeader}>
        <h2>Continue Your Journey</h2>
      </div>
      <div className={styles.editorialGrid}>
        <Link href="/breed-selector" className={`${styles.tile} ${styles.tileLarge}`}>
          <div style={{ flex: 1 }}>
            <h3>Resume Quiz</h3>
          </div>
          <Compass className={styles.tileIcon} />
        </Link>
        <Link href="/my-dog" className={`${styles.tile} ${styles.tileSecondary}`}>
          <h3>My Dogs</h3>
          <PawPrint size={28} className={styles.tileIcon} />
        </Link>
        <Link href="/community" className={`${styles.tile} ${styles.tileTertiary}`}>
          <h3>Community</h3>
          <Users size={28} className={styles.tileIcon} />
        </Link>
        <Link href="/food-guide" className={`${styles.tile} ${styles.tilePrimary}`}>
          <h3>Food Guide</h3>
          <BookOpen size={28} className={styles.tileIcon} />
        </Link>
        <Link href="/profile" className={`${styles.tile} ${styles.tileTertiary}`}>
          <h3>Saved</h3>
          <Bookmark size={28} className={styles.tileIcon} />
        </Link>
      </div>

      {/* SECTION 4: Discover Companions (Edge to Edge) */}
      <div className={styles.sectionHeader}>
        <h2>Discover Companions</h2>
      </div>
      <div className={styles.alternatingFeed}>
        {discoverBreeds.map((breed, index) => {
          const slug = breed.basic_info.name.toLowerCase().replace(/ /g, '-');
          // Alternate heights between 300px and 380px for organic feel
          const height = index % 2 === 0 ? '300px' : '380px';
          
          return (
            <Link key={slug} href={`/breeds/${slug}`} className={styles.altCardFullBleed} style={{ height }}>
              <Image src={breed.image} alt={breed.basic_info.name} fill style={{ objectFit: 'cover' }} />
              <div className={styles.altContentBleed}>
                <h3>{breed.basic_info.name}</h3>
                <p>{breed.basic_info.origin}</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* SECTION 5: Stories From Dog Parents */}
      {featuredPost && (
        <>
          <div className={styles.sectionHeader}>
            <h2>Stories From Dog Parents</h2>
          </div>
          <div className={styles.storySection}>
            <Link href="/community" className={styles.storyCard}>
              <p className={styles.storyQuote}>{featuredPost.content}</p>
              
              {featuredPost.media_url && (
                <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px' }}>
                  <Image src={featuredPost.media_url} alt="Post media" fill style={{ objectFit: 'cover' }} />
                </div>
              )}

              <div className={styles.storyUser}>
                <div className={styles.storyAvatar}>
                  {featuredPost.author_avatar_url && (
                     <Image src={featuredPost.author_avatar_url} alt="avatar" fill style={{ borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                </div>
                <div>
                  <h4>{featuredPost.author_name}</h4>
                  <p>{featuredPost.author_breed || "Dog Parent"}</p>
                </div>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* SECTION 6: Today's Dog Wisdom */}
      <div className={styles.sectionHeader}>
        <h2>Today's Dog Wisdom</h2>
      </div>
      <div className={styles.wisdomSection}>
        <div className={styles.wisdomCard}>
          <PawPrint size={40} className={styles.wisdomIcon} />
          <h3 className={styles.wisdomQuote}>"A dog is the only thing on earth that loves you more than he loves himself."</h3>
          <div className={styles.wisdomLine}></div>
          <p className={styles.wisdomTip}>Tip: 15 minutes of training tires a dog more than a 1 hour walk.</p>
        </div>
      </div>

    </div>
  );
}
