"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./AndroidMyDog.module.css";
import BottomNav from "../home/BottomNav";
import { MoreHorizontal, Plus, Edit2, Clock, Scale, MapPin, CheckCircle2, Circle, Utensils, Syringe, ClipboardCheck, Stethoscope, Image as ImageIcon } from "lucide-react";

export default function AndroidMyDog({ dogs, activeId }) {
  const activeDog = dogs?.find(d => d.id === activeId) || dogs?.[0];

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  if (!activeDog) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconBtn}><MoreHorizontal size={24} /></div>
          <h1 className={styles.headerTitle}>My Dog</h1>
          <Link href="/my-dog/add" className={styles.addBtn}><Plus size={24} /></Link>
        </div>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h2>Start your journey</h2>
          <p>Add your first dog to unlock personalized health tracking.</p>
          <Link href="/my-dog/add" style={{ display: 'inline-block', marginTop: 20, padding: '12px 24px', background: '#745137', color: '#fff', borderRadius: 24, textDecoration: 'none', fontWeight: 600 }}>Add My Dog</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Calculate generic values if missing
  const age = activeDog.age || "2 yrs";
  const weight = activeDog.weight ? `${activeDog.weight} kg` : "25 kg";
  const location = "Boisar";
  
  // Try to find image from breeds data if user hasn't uploaded one
  const dogImage = activeDog.image_url || "/assets/Dogs/Golden Retriever.jpg"; 

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconBtn}><MoreHorizontal size={24} /></div>
        <h1 className={styles.headerTitle}>My Dog</h1>
        <Link href="/my-dog/add" className={styles.addBtn}><Plus size={24} /></Link>
      </div>

      <div className={styles.profileCardWrapper}>
        <div className={styles.profileCard}>
          <div className={styles.dogImageWrapper}>
            <Image 
              src={dogImage}
              alt={activeDog.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="100vw"
              priority
            />
          </div>
          
          <div className={styles.infoSheet}>
            <div className={styles.nameRow}>
              <h2>{activeDog.name}</h2>
              <Edit2 size={16} className={styles.editIcon} />
            </div>
            <p className={styles.breedName}>{activeDog.breed}</p>
            
            <div className={styles.tagsRow}>
              <div className={styles.tag}><Clock size={16} color="#A67B5B" /> {age}</div>
              <div className={styles.tag}><Scale size={16} color="#A67B5B" /> {weight}</div>
              <div className={styles.tag}><MapPin size={16} color="#A67B5B" /> {location}</div>
            </div>
          </div>
        </div>
        
        <div className={styles.pawIconWrapper}>
           <i className="fa-solid fa-paw" style={{ fontSize: '24px' }}></i>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h3>Today's Overview</h3>
        <span className={styles.dateText}>{dateStr}</span>
      </div>

      <div className={styles.overviewLayout}>
        <div className={styles.progressCircleWrapper}>
           {/* SVG Circle Progress */}
           <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
             <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
             <circle cx="60" cy="60" r="54" fill="none" stroke="#745137" strokeWidth="8" strokeDasharray="339" strokeDashoffset="101" strokeLinecap="round" />
           </svg>
           <div className={styles.progressText}>
             <h4>70%</h4>
             <span>Day Progress</span>
           </div>
        </div>

        <div className={styles.checklist}>
          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <div className={styles.checkIcon}><Utensils size={14} color="#A67B5B" /></div> Meals
            </div>
            <div className={styles.checkRight}>2 / 3 done</div>
          </div>
          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <div className={styles.checkIcon}><i className="fa-solid fa-dog" style={{ color: '#A67B5B', fontSize: 12 }}></i></div> Walk
            </div>
            <div className={styles.checkRight}>1 / 2 done</div>
          </div>
          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <div className={styles.checkIcon}><i className="fa-solid fa-scissors" style={{ color: '#A67B5B', fontSize: 12 }}></i></div> Grooming
            </div>
            <div className={styles.checkRight}>Pending</div>
          </div>
          <div className={styles.checkItem}>
            <div className={styles.checkLeft}>
              <CheckCircle2 size={24} color="#4ade80" /> Health
            </div>
            <div className={styles.checkRight}>All clear</div>
          </div>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h3>Quick Actions</h3>
      </div>

      <div className={styles.quickActionsGrid}>
        <Link href="#" className={styles.actionButton}>
          <Utensils size={28} strokeWidth={1.5} />
          <span>Feeding</span>
        </Link>
        <Link href="#" className={styles.actionButton}>
          <Syringe size={28} strokeWidth={1.5} />
          <span>Vaccinations</span>
        </Link>
        <Link href="#" className={styles.actionButton}>
          <ClipboardCheck size={28} strokeWidth={1.5} />
          <span>Checklist</span>
        </Link>
        <Link href="#" className={styles.actionButton}>
          <Stethoscope size={28} strokeWidth={1.5} />
          <span>Vet Visits</span>
        </Link>
        <Link href="#" className={styles.actionButton}>
          <Scale size={28} strokeWidth={1.5} />
          <span>Weight</span>
        </Link>
        <Link href="#" className={styles.actionButton}>
          <ImageIcon size={28} strokeWidth={1.5} />
          <span>Gallery</span>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
