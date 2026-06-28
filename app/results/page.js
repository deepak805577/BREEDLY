'use client';
import './results.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { breeds } from '../data/breeds';
import { createClient } from '@supabase/supabase-js';

/* ──────────────────────────────────────────────────────────
   CIRCULAR COMPATIBILITY RING
   Pure SVG — no library dependency
   ────────────────────────────────────────────────────────── */
const CircleRing = ({ percent, animated, size = 'lg' }) => {
  const isLg = size === 'lg';
  const dim = isLg ? 140 : 64;
  const r = isLg ? 56 : 25;
  const circ = 2 * Math.PI * r;
  const cx = dim / 2;
  const cy = dim / 2;
  const sw = isLg ? 6 : 4;
  const offset = animated ? circ * (1 - percent / 100) : circ;

  return (
    <div className={`rp-ring-wrap rp-ring-wrap--${size}`}>
      <svg
        viewBox={`0 0 ${dim} ${dim}`}
        width={dim}
        height={dim}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
        aria-label={`${percent}% compatibility`}
      >
        <circle
          cx={cx} cy={cy} r={r}
          className="rp-ring-track"
          strokeWidth={sw}
        />
        <circle
          cx={cx} cy={cy} r={r}
          className="rp-ring-fill"
          strokeWidth={sw}
          strokeLinecap="round"
          style={{
            strokeDasharray: circ,
            strokeDashoffset: offset,
            transition: animated
              ? `stroke-dashoffset 1.3s cubic-bezier(0.4, 0, 0.2, 1) ${isLg ? '0.4s' : '0.6s'}`
              : 'none',
          }}
        />
      </svg>
      <div className="rp-ring-label-wrap">
        <span className={`rp-ring-pct rp-ring-pct--${size}`}>{percent}%</span>
        {isLg && <span className="rp-ring-caption">Match</span>}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   ICONS
   ────────────────────────────────────────────────────────── */
const DogIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M19 14c.5-1.5.5-3.5-.5-4.5s-2.5-1-3.5.5c-1 1.5-2 1-3-.5-1-1.5-2.5-2.5-4-2.5S5 8 5 9.5c0 1 0 2.5.5 3.5s2 1.5 2 2.5v1.5C7.5 18 8 18.5 9 18.5h4c1 0 1.5-.5 1.5-1.5v-1c0-1 2-1.5 2.5-2.5.3-.7 1-1 2-1V14z" />
    <circle cx="7.5" cy="9.5" r="0.5" fill="currentColor" />
  </svg>
);

const LifestyleIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z" />
  </svg>
);

const HomeIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const HeartIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

/* ──────────────────────────────────────────────────────────
   BREED PROFILES
   ────────────────────────────────────────────────────────── */
const breedProfiles = {
  "Labrador Retriever": { traits: ["House", "Spacious", "Large yard", "Yes", "Ages 6–12", "Yes", "No", "No", "3+ hours", "1–2 hours", "< 2 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Labrador Retriever.jpg", desc: "Friendly, playful, and always ready for family fun." },
  "Golden Retriever": { traits: ["House", "Spacious", "Large yard", "Yes", "Ages 6–12", "Yes", "No", "No", "3+ hours", "1–2 hours", "< 2 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Golden Retriever.webp", desc: "Loyal, gentle, and perfect for active families with kids." },
  "German Shepherd Dog": { traits: ["House", "Spacious", "Open field", "Yes", "Teenagers 13+", "Yes", "No", "No", "3+ hours", "2+ hours", "< 2 hrs", "Yes", "Very active", "Very playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/German Shepherd.jpg", desc: "Intelligent and loyal — great for security and companionship." },
  "Beagle": { traits: ["2-3BHK", "Moderate", "Small yard", "Yes", "Ages 6–12", "Yes", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Medium (7–14kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Beagle.jpg", desc: "Curious, merry, and loves to sniff out fun with kids." },
  "Pug": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "Yes", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Small (7kg & under)", "Weekly", "Somewhat"], image: "/assets/Dogs/Pug.jpg", desc: "Charming and comical — perfect for apartment life." },
  "Shih Tzu": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "Yes", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Small (7kg & under)", "Daily", "Very important"], image: "/assets/Dogs/Shih Tzu.jpg", desc: "Affectionate lapdog — loves pampering and cuddles." },
  "Lhasa Apso": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "Yes", "Low", "Low energy", "Independent", "Prefer quiet", "Just the basics", "Yes", "Small (7kg & under)", "Daily", "Very important"], image: "/assets/Dogs/Lhasa Apso.jpg", desc: "Small, loyal, and full of personality — great for apartments." },
  "Pomeranian": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "Yes", "Moderate", "Very playful", "Friendly", "Some barking", "Just the basics", "Yes", "Small (7kg & under)", "Weekly", "Very important"], image: "/assets/Dogs/Pomeranian.jpg", desc: "Fluffy, energetic, and full of charm — loves attention." },
  "Indian Spitz": { traits: ["2-3BHK", "Moderate", "Small yard", "No", "0–5", "Yes", "Yes", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Moderately playful", "Friendly", "Some barking", "Just the basics", "No", "Medium (7–14kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Indian Spitz.jpg", desc: "Lively and intelligent — perfect family companion for Indian homes." },
  "Dachshund": { traits: ["Apartment", "Very little", "None", "No", "0–5", "No", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "Yes", "Low", "Moderately playful", "Friendly", "Some barking", "Just the basics", "No", "Small (7kg & under)", "Weekly", "Very important"], image: "/assets/Dogs/Dachshund.jpg", desc: "Bold and curious — tiny but full of personality." },
  "Cocker Spaniel (American)": { traits: ["2-3BHK", "Moderate", "Moderate yard", "Yes", "Ages 6–12", "Yes", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Medium (7–14kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Cocker Spaniel.jpg", desc: "Sweet-natured, loves cuddles and playtime." },
  "Boxer": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "Yes", "No", "No", "2–3 hours", "1–2 hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Boxer.jpg", desc: "Energetic, fun-loving, and protective family clown." },
  "Doberman Pinscher": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "Yes", "No", "No", "3+ hours", "1–2 hours", "< 2 hrs", "Yes", "Very active", "Moderately playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Doberman Pinscher.jpg", desc: "Alert, loyal, and brave — needs structure and exercise." },
  "Rottweiler": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "Yes", "No", "No", "2–3 hours", "1–2 hours", "< 2 hrs", "Yes", "Moderate", "Moderately playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Rottweiler.jpg", desc: "Confident and strong — devoted guardian for experienced owners." },
  "Great Dane": { traits: ["House", "Spacious", "Open yard", "Yes", "Ages 6–12", "Yes", "No", "No", "2–3 hours", "1–2 hours", "< 2 hrs", "Yes", "Moderate", "Low energy", "Calm", "Some barking", "Just the basics", "No", "Very Large (50kg+)", "Weekly", "Somewhat"], image: "/assets/Dogs/Great Dane.jpg", desc: "Gentle giant — affectionate and easy-going." },
  "Saint Bernard": { traits: ["House", "Spacious", "Open yard", "Yes", "Ages 6–12", "Yes", "No", "No", "1–2 hours", "1–2 hours", "< 2 hrs", "Yes", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "No", "Very Large (50kg+)", "Weekly", "Somewhat"], image: "/assets/Dogs/Saint Bernard.jpg", desc: "Patient and gentle — loves kids and cold weather." },
  "Siberian Husky": { traits: ["House", "Spacious", "Open field", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Independent", "Loud & frequent", "A lot — I enjoy it", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Siberian Husky.jpg", desc: "Adventurous and vocal — best for active families with space." },
  "Alaskan Malamute": { traits: ["House", "Spacious", "Open field", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Independent", "Loud & frequent", "A lot — I enjoy it", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Alaskan Malamute.jpg", desc: "Strong, hardy, loves snow — needs space and activity." },
  "French Bulldog": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Small (7kg & under)", "Weekly", "Very important"], image: "/assets/Dogs/French Bulldog.jpg", desc: "Easy-going and comical — loves apartment life." },
  "Bulldog": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Medium (7–14kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/English Bulldog.jpg", desc: "Chilled-out and loving — great for relaxed homes." },
  "Bullmastiff": { traits: ["House", "Spacious", "Large yard", "No", "Teenagers 13+", "No", "No", "No", "1–2 hours", "1–2 hours", "< 2 hrs", "Yes", "Low", "Low energy", "Protective", "Prefer quiet", "Just the basics", "No", "Very Large (50kg+)", "Weekly", "Somewhat"], image: "/assets/Dogs/Bullmastiff.jpg", desc: "Loyal guardian — calm, brave, and protective." },
  "Staffordshire Bull Terrier": { traits: ["House", "Spacious", "Moderate yard", "No", "Teenagers 13+", "No", "No", "No", "2–3 hours", "1–2 hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Pit Bull Terrier.jpg", desc: "Energetic, loyal, and loving — needs strong leadership." },
  "American Bully (Standard)": { traits: ["House", "Spacious", "Moderate yard", "No", "Teenagers 13+", "No", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/American Bully.jpg", desc: "Friendly and sturdy — great companion with proper training." },
  "Maltese": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Small (7kg & under)", "Daily", "Very important"], image: "/assets/Dogs/Maltese.jpg", desc: "Tiny, loving, hypoallergenic — perfect lapdog for small spaces." },
  "Chihuahua": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Independent", "Loud & frequent", "Just the basics", "Yes", "Small (7kg & under)", "Weekly", "Very important"], image: "/assets/Dogs/Chihuahua.jpg", desc: "Small but bold — big personality in a tiny package!" },
  "Yorkshire Terrier": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Independent", "Some barking", "Just the basics", "Yes", "Small (7kg & under)", "Daily", "Very important"], image: "/assets/Dogs/Yorkshire Terrier.jpg", desc: "Tiny, clever, and charming — loves attention and pampering." },
  "Miniature Pinscher": { traits: ["Apartment", "Very little", "None", "No", "0–5", "No", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Moderate", "Very playful", "Independent", "Some barking", "Just the basics", "Yes", "Small (7kg & under)", "Weekly", "Very important"], image: "/assets/Dogs/Miniature Pinscher.jpg", desc: "Tiny, brave, and energetic — loves to explore and play." },
  "Standard Poodle": { traits: ["Apartment", "Moderate", "Small yard", "No", "0–5", "Yes", "Yes", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "No", "Low", "Moderately playful", "Friendly", "Some barking", "A lot — I enjoy it", "Yes", "Medium (7–14kg)", "Daily", "Very important"], image: "/assets/Dogs/Poodle.jpg", desc: "Smart, hypoallergenic, and stylish — easy to train." },
  "Dalmatian": { traits: ["House", "Spacious", "Large yard", "No", "0–5", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Independent", "Some barking", "A lot — I enjoy it", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Dalmatian.jpg", desc: "Spotted, energetic, and fun-loving — loves open spaces." },
  "English Cocker Spaniel": { traits: ["2-3BHK", "Moderate", "Moderate yard", "Yes", "Ages 6–12", "Yes", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Medium (7–14kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/English Cocker Spaniel.jpg", desc: "Happy and cheerful — loves playtime and cuddles." },
  "English Setter": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "No", "No", "No", "2–3 hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/English Setter.jpg", desc: "Gentle, friendly, and energetic — loves big yards." },
  "Basset Hound": { traits: ["Apartment", "Very little", "Small yard", "No", "0–5", "No", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Low energy", "Calm", "Prefer quiet", "Just the basics", "Yes", "Medium-Large (14–23kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Basset Hound.jpg", desc: "Laid-back with adorable droopy ears — calm and loyal." },
  "Boston Terrier": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "2–5 hrs", "No", "Low", "Moderately playful", "Friendly", "Prefer quiet", "Just the basics", "Yes", "Medium (7–14kg)", "Weekly", "Very important"], image: "/assets/Dogs/Boston Terrier.jpg", desc: "Friendly, playful, and perfect for apartment living." },
  "Border Collie": { traits: ["House", "Spacious", "Open field", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Friendly", "Loud & frequent", "A lot — I enjoy it", "No", "Medium-Large (14–23kg)", "Weekly", "Not important"], image: "/assets/Dogs/Border Collie.jpg", desc: "Super smart and energetic — loves tasks and big spaces." },
  "Belgian Malinois": { traits: ["House", "Spacious", "Open field", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "< 2 hrs", "2–5 hrs", "Yes", "Very active", "Very playful", "Protective", "Loud & frequent", "A lot — I enjoy it", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Belgian Malinois.jpg", desc: "Brilliant and loyal — best for experienced, active families." },
  "Irish Setter": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Irish Setter.jpg", desc: "Joyful and playful — needs space to run and explore." },
  "Weimaraner": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Protective", "Some barking", "A lot — I enjoy it", "No", "Large (23–50kg)", "Weekly", "Not important"], image: "/assets/Dogs/Weimaraner.jpg", desc: "Sleek, loyal, and adventurous — loves outdoor activities." },
  "Afghan Hound": { traits: ["House", "Moderate", "Moderate yard", "No", "0–5", "No", "No", "No", "2–3 hours", "1–2 hours", "2–5 hrs", "No", "Moderate", "Calm", "Independent", "Prefer quiet", "Just the basics", "No", "Large (23–50kg)", "Daily", "Somewhat"], image: "/assets/Dogs/Afghan Hound.jpg", desc: "Elegant and graceful — independent spirit with stunning looks." },
  "Bichon Frise": { traits: ["Apartment", "Very little", "None", "No", "0–5", "Yes", "Yes", "No", "< 1 hour", "< 30 mins", "< 2 hrs", "No", "Low", "Moderately playful", "Friendly", "Prefer quiet", "Just the basics", "Yes", "Medium (7–14kg)", "Daily", "Very important"], image: "/assets/Dogs/Bichon Frise.jpg", desc: "Happy, hypoallergenic fluffball — perfect for allergy sufferers." },
  "Collie (Rough)": { traits: ["House", "Spacious", "Large yard", "Yes", "Ages 6–12", "Yes", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Protective", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Rough Collie.jpg", desc: "Loyal and gentle — loves kids and watching over the family." },
  "Samoyed": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "2+ hours", "2–5 hrs", "Yes", "Very active", "Very playful", "Friendly", "Some barking", "A lot — I enjoy it", "No", "Large (23–50kg)", "Daily", "Somewhat"], image: "/assets/Dogs/Samoyed.jpg", desc: "Fluffy and friendly — loves people and cold weather." },
  "Newfoundland": { traits: ["House", "Spacious", "Large yard", "Yes", "Ages 0–5", "Yes", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Low", "Calm", "Friendly", "Prefer quiet", "Just the basics", "No", "Very Large (50kg+)", "Weekly", "Somewhat"], image: "/assets/Dogs/Newfoundland Dog.jpg", desc: "Gentle giant — calm, loving, and great with kids." },
  "Bull Terrier": { traits: ["House", "Moderate", "Moderate yard", "Yes", "Teenagers 13+", "No", "No", "No", "1–2 hours", "1–2 hours", "2–5 hrs", "Yes", "Moderate", "Very playful", "Friendly", "Some barking", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Bull Terrier.jpg", desc: "Bold and fun-loving — always ready to play." },
  "Chinese Shar-Pei": { traits: ["House", "Moderate", "Small yard", "No", "0–5", "No", "No", "No", "< 1 hour", "< 2 hrs", "2–5 hrs", "No", "Low", "Calm", "Protective", "Prefer quiet", "Just the basics", "No", "Large (23–50kg)", "Weekly", "Somewhat"], image: "/assets/Dogs/Shar Pei.jpg", desc: "Loyal and calm — famous for unique wrinkles." },
  "Dogo Argentino": { traits: ["House", "Spacious", "Large yard", "Yes", "Teenagers 13+", "No", "No", "No", "3+ hours", "< 2 hrs", "2–5 hrs", "Yes", "Very active", "Protective", "Protective", "Some barking", "A lot — I enjoy it", "No", "Very Large (50kg+)", "Weekly", "Not important"], image: "/assets/Dogs/Dogo Argentino.jpg", desc: "Powerful and loyal — needs experienced owners and open space." },
};

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */

/** Extract 3–4 short trait pills from a breed's profile */
function getTraitPills(breedName) {
  const t = breedProfiles[breedName]?.traits || [];
  const pills = [];

  const energyMap = {
    'Very active': 'High Energy', 'Moderate': 'Moderate Energy', 'Low': 'Low Energy',
  };
  const tempMap = {
    'Friendly': 'Friendly', 'Calm': 'Calm',
    'Protective': 'Protective', 'Independent': 'Independent',
  };
  const sizeMap = {
    'Small (7kg & under)': 'Small',
    'Medium (7–14kg)': 'Medium',
    'Medium-Large (14–23kg)': 'Med-Large',
    'Large (23–50kg)': 'Large',
    'Very Large (50kg+)': 'Extra Large',
  };

  if (energyMap[t[12]]) pills.push(energyMap[t[12]]);
  if (tempMap[t[14]]) pills.push(tempMap[t[14]]);
  if (t[3] === 'Yes') pills.push('Family Friendly');
  if (sizeMap[t[18]]) pills.push(sizeMap[t[18]]);
  if (t[6] === 'Yes') pills.push('Apartment OK');

  return pills.slice(0, 4);
}

/** Derive the 3 lifestyle/home/personality "why" cards from quiz answers + top breed */
function getWhyCards(answers, topBreed) {
  const traits = breedProfiles[topBreed?.name]?.traits || [];

  /* Lifestyle */
  let lifestyle = 'Matches your energy and daily routine.';
  if (answers.includes('3+ hours')) lifestyle = 'Your active lifestyle is a natural match for this high-energy breed.';
  else if (answers.includes('2–3 hours')) lifestyle = 'Well-matched to your engaged, active everyday rhythm.';
  else if (answers.includes('1–2 hours')) lifestyle = 'A balanced breed for your moderate activity level.';
  else if (answers.includes('< 1 hour')) lifestyle = 'Ideal for your calm, relaxed pace of life.';

  /* Home */
  let home = 'Well-suited to your living environment.';
  if (answers.includes('Apartment')) home = 'Thrives in apartment settings — adapts effortlessly to compact living.';
  else if (answers.includes('House')) home = 'Loves having space to roam — a natural fit for your home.';
  else if (answers.includes('2-3BHK')) home = 'Comfortable in a mid-sized home with your layout.';

  /* Personality */
  let personality = 'Loyal, adaptable, and a genuine joy to be around.';
  const temp = traits[14];
  if (temp === 'Friendly') personality = 'Gentle and outgoing — bonds easily with every member of the family.';
  else if (temp === 'Protective') personality = 'Devoted and watchful — a natural guardian who loves deeply.';
  else if (temp === 'Independent') personality = 'Self-assured yet loyal — respects your space and routine.';
  else if (temp === 'Calm') personality = 'Calm and composed — brings quiet warmth to your home.';

  return [
    { icon: <LifestyleIcon style={{ width: 22, height: 22 }} />, title: 'Lifestyle', desc: lifestyle },
    { icon: <HomeIcon style={{ width: 22, height: 22 }} />, title: 'Home', desc: home },
    { icon: <HeartIcon style={{ width: 22, height: 22 }} />, title: 'Personality', desc: personality },
  ];
}

/** Build 1–3 personalised reasons for the "Why we picked this" expansion panel */
function getWhyReasons(breed, answers) {
  const t = breedProfiles[breed.name]?.traits || [];
  const reasons = [];

  if ((answers.includes('3+ hours') || answers.includes('2–3 hours')) && t[12] === 'Very active')
    reasons.push('You enjoy staying active — this breed loves to match your energy.');
  if (answers.includes('Apartment') && t[6] === 'Yes')
    reasons.push('Adapts beautifully to apartment living, just like your home.');
  if (answers.includes('House') && t[0] === 'House')
    reasons.push('Thrives with space to roam — a natural fit for your home.');
  if (t[3] === 'Yes' && answers.some(a => a.includes('Ages') || a.includes('Teenagers')))
    reasons.push('Excellent with children and thrives in a family setting.');
  if (t[16] === 'Just the basics')
    reasons.push('Easy grooming and straightforward care routine — suits your lifestyle perfectly.');
  if (!reasons.length)
    reasons.push('Your overall lifestyle profile aligns naturally with this breed\'s temperament and needs.');

  return reasons.slice(0, 3);
}

/* ──────────────────────────────────────────────────────────
   ALT CARD — with expandable "Why we picked this"
   ────────────────────────────────────────────────────────── */
function AltCard({ breed, rank, animated, openBreed, answers }) {
  const [expanded, setExpanded] = useState(false);
  const pills = getTraitPills(breed.name);
  const reasons = getWhyReasons(breed, answers);
  const label = rank === 1 ? '✦ Great Match' : '✦ Good Alternative';

  return (
    <article
      id={`alt-card-${breed.name.replace(/\s+/g, '-').toLowerCase()}`}
      className="rp-alt-card rp-fade-up"
      style={{ animationDelay: `${0.48 + rank * 0.12}s` }}
      onClick={() => openBreed(breed.name)}
    >
      {/* Image */}
      <div className="rp-alt-img-wrap">
        <img src={breed.image} alt={breed.name} loading="lazy" />
        <div className="rp-alt-overlay" />
        <span className="rp-alt-badge">{label}</span>
      </div>

      {/* Body */}
      <div className="rp-alt-body">
        {/* Name + Ring */}
        <div className="rp-alt-top">
          <h3 className="rp-alt-name">{breed.name}</h3>
          <CircleRing percent={breed.percent} animated={animated} size="sm" />
        </div>

        {/* Trait pills */}
        {pills.length > 0 && (
          <div className="rp-trait-pills">
            {pills.map(p => (
              <span key={p} className="rp-pill rp-pill--sm">{p}</span>
            ))}
          </div>
        )}

        {/* Description */}
        {breed.description && (
          <p className="rp-alt-desc">{breed.description}</p>
        )}

        {/* Expand toggle */}
        <button
          id={`expand-btn-${breed.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="rp-expand-btn"
          aria-expanded={expanded}
          onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
        >
          ✨ Why we picked this
          <span className="rp-expand-chevron">{expanded ? '↑' : '↓'}</span>
        </button>

        {/* Expand panel */}
        {expanded && (
          <div className="rp-expand-panel" role="region" aria-label="Why we picked this">
            {reasons.map((r, i) => (
              <p key={i} className="rp-expand-item">
                <span className="rp-expand-dot" aria-hidden="true" />
                {r}
              </p>
            ))}
          </div>
        )}

        {/* Explore CTA */}
        <button
          id={`explore-btn-${breed.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="rp-explore-btn rp-explore-btn--alt"
          onClick={(e) => { e.stopPropagation(); openBreed(breed.name); }}
        >
          Explore breed →
        </button>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────────────────────
   SUPABASE CLIENT
   ────────────────────────────────────────────────────────── */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────── */
export default function ResultsPage() {
  const router = useRouter();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fallbackText, setFallbackText] = useState('');
  const [animated, setAnimated] = useState(false);
  const [answers, setAnswers] = useState([]);

  /* ── Load & score quiz answers ─────────────────────────── */
  useEffect(() => {
    const raw =
      sessionStorage.getItem('quizAnswers') ||
      localStorage.getItem('breedlyAnswers') ||
      localStorage.getItem('quizAnswers');

    if (!raw) {
      const saved = localStorage.getItem('breedlySavedResults');
      if (saved) {
        try { setMatches(JSON.parse(saved)); setLoading(false); return; } catch { }
      }
      setFallbackText('No saved results found. Please take the quiz.');
      setLoading(false);
      return;
    }

    let ans;
    try {
      ans = JSON.parse(raw);
      if (!Array.isArray(ans)) throw new Error();
      setAnswers(ans);
    } catch {
      setFallbackText('There was a problem reading your answers. Please retake the quiz.');
      setLoading(false);
      return;
    }

    const scored = Object.entries(breedProfiles).map(([name, profile]) => {
      const score = profile.traits?.filter(t => ans.includes(t)).length || 0;
      const percent = Math.round((score / (profile.traits?.length || 1)) * 100);
      const found = Array.isArray(breeds) ? breeds.find(b => b.name === name) : undefined;
      return {
        name, score, percent,
        image: found?.image || profile.image,
        description: found?.description || profile.desc || '',
        pros: found?.pros || [],
        cons: found?.cons || [],
        grooming: found?.grooming || [],
        notes: found?.notes || [],
      };
    })
      .filter(b => b.score > 0)
      .sort((a, b) => b.percent - a.percent || b.score - a.score);

    if (!scored.length) {
      setFallbackText('No matches found. Try adjusting your answers and retake the quiz.');
      setLoading(false);
      return;
    }

    const top3 = scored.slice(0, 3);
    setMatches(top3);
    localStorage.setItem('breedlySavedResults', JSON.stringify(top3));
    setLoading(false);
    /* stagger the animation trigger slightly after render */
    setTimeout(() => setAnimated(true), 120);
  }, []);

  /* ── Actions ───────────────────────────────────────────── */
  const restartQuiz = () => {
    ['quizAnswers', 'breedlyAnswers', 'quizAnswers'].forEach(k => {
      try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch { }
    });
    router.push('/breed-selector');
  };

  const openBreed = name =>
    window.open(`/breeds/${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer');

  /* ── Derived data ──────────────────────────────────────── */
  const hero = matches[0];
  const alts = matches.slice(1);
  const whyCards = hero ? getWhyCards(answers, hero) : [];
  const heroPills = hero ? getTraitPills(hero.name) : [];

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <main className="rp-page" id="results-page">

      {/* ── CINEMATIC HEADER ─────────────────────────────── */}
      <header
        className="rp-header rp-fade-up"
        style={{ animationDelay: '0s' }}
      >
        <span className="rp-eyebrow">Your Match</span>
        <h1 className="rp-title">
          We found your<br />
          <em>perfect companion.</em>
        </h1>
        <p className="rp-subtitle">
          Finding your perfect companion isn't about popularity—<br />
          it's about compatibility.
        </p>
      </header>

      {/* ── LOADING STATE ────────────────────────────────── */}
      {loading && (
        <div className="rp-loading" aria-live="polite">
          <div className="rp-loading-dots">
            <span /><span /><span />
          </div>
          <p>Finding your perfect match…</p>
        </div>
      )}

      {/* ── FALLBACK STATE ───────────────────────────────── */}
      {!loading && matches.length === 0 && (
        <div className="rp-fallback">
          <DogIcon style={{ width: 60, height: 60, color: '#A8A199', marginBottom: 8 }} />
          <p>{fallbackText}</p>
          <button
            id="retake-quiz-fallback"
            onClick={restartQuiz}
            className="rp-btn-primary"
            style={{ marginTop: 8 }}
          >
            Find My Match
          </button>
        </div>
      )}

      {/* ── RESULTS FLOW ─────────────────────────────────── */}
      {!loading && matches.length > 0 && (
        <>
          {/* TOP LAYOUT (HERO + WHY) */}
          <section className="rp-hero-layout">
            {/* HERO SIDE */}
            <div className="rp-hero-main" aria-labelledby="featured-label">
              <p id="featured-label" className="rp-section-label">Featured Match</p>

              <article
                id="hero-match-card"
                className="rp-hero-card rp-fade-up"
                style={{ animationDelay: '0.1s' }}
                onClick={() => openBreed(hero.name)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && openBreed(hero.name)}
                aria-label={`View details for ${hero.name}, ${hero.percent}% match`}
              >
                {/* Full-bleed image */}
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="rp-hero-img"
                  loading="eager"
                />

                {/* Dark gradient overlay */}
                <div className="rp-hero-overlay" aria-hidden="true" />

                {/* Overlaid content */}
                <div className="rp-hero-content">
                  {/* Badge */}
                  <span className="rp-hero-badge" aria-hidden="true">
                    ✦ Best Match
                  </span>

                  {/* Bottom row: info + ring */}
                  <div className="rp-hero-bottom">
                    <div className="rp-hero-info">
                      <h2 className="rp-hero-name">{hero.name}</h2>

                      {/* Trait pills */}
                      {heroPills.length > 0 && (
                        <div className="rp-trait-pills">
                          {heroPills.map(p => (
                            <span key={p} className="rp-pill">{p}</span>
                          ))}
                        </div>
                      )}

                      {/* Description */}
                      {hero.description && (
                        <p className="rp-hero-desc">"{hero.description}"</p>
                      )}

                      {/* CTA */}
                      <button
                        id="hero-explore-btn"
                        className="rp-explore-btn"
                        onClick={e => { e.stopPropagation(); openBreed(hero.name); }}
                      >
                        Explore breed →
                      </button>
                    </div>

                    {/* Circular compatibility ring */}
                    <div className="rp-hero-ring" aria-hidden="true">
                      <CircleRing
                        percent={hero.percent}
                        animated={animated}
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* WHY SIDEBAR */}
            <aside className="rp-hero-sidebar" aria-labelledby="why-heading">
              <div className="rp-section-header">
                <h2 id="why-heading" className="rp-section-heading">
                  Why this is your match
                </h2>
                <div className="rp-section-divider" aria-hidden="true" />
              </div>
              <div className="rp-why-list">
                {whyCards.map((card, i) => (
                  <div
                    key={card.title}
                    className="rp-why-item"
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                  >
                    <span className="rp-why-icon" aria-hidden="true">{card.icon}</span>
                    <div className="rp-why-text">
                      <h3>{card.title}</h3>
                      <p>{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          {/* 3 — ALTERNATIVE MATCHES */}
          {alts.length > 0 && (
            <section className="rp-alts-section" aria-labelledby="alts-heading">
              <div className="rp-section-header">
                <h2 id="alts-heading" className="rp-section-heading">
                  Other great matches
                </h2>
                <div className="rp-section-divider" aria-hidden="true" />
              </div>
              <div className="rp-alt-grid">
                {alts.map((breed, i) => (
                  <AltCard
                    key={breed.name}
                    breed={breed}
                    rank={i + 1}
                    animated={animated}
                    openBreed={openBreed}
                    answers={answers}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4 — RETAKE / FIND ANOTHER MATCH */}
          <section
            className="rp-retake-section rp-fade-up"
            style={{ animationDelay: '0.7s' }}
            aria-labelledby="retake-heading"
          >
            <div className="rp-retake-card">
              <h2 id="retake-heading">Every family is unique.</h2>
              <p>
                Retake the assessment to discover more companions
                that truly suit your lifestyle.
              </p>
              <button
                id="find-another-match-btn"
                className="rp-retake-btn"
                onClick={restartQuiz}
              >
                Find Another Match
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}