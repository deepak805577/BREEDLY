'use client';
import './results.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { breeds } from '../data/breeds';
import { createClient } from '@supabase/supabase-js';

const PawIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/>
  </svg>
);

const TipIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
  </svg>
);

const DogIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M19 14c.5-1.5.5-3.5-.5-4.5s-2.5-1-3.5.5c-1 1.5-2 1-3-.5-1-1.5-2.5-2.5-4-2.5S5 8 5 9.5c0 1 0 2.5.5 3.5s2 1.5 2 2.5v1.5C7.5 18 8 18.5 9 18.5h4c1 0 1.5-.5 1.5-1.5v-1c0-1 2-1.5 2.5-2.5.3-.7 1-1 2-1V14z" />
    <circle cx="7.5" cy="9.5" r="0.5" fill="currentColor" />
  </svg>
);

const GoldMedal = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <circle cx="12" cy="12" r="10" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5"/>
    <path d="M12 7V17M8 12H16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="6" fill="#FFF" opacity="0.3"/>
  </svg>
);

const SilverMedal = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <circle cx="12" cy="12" r="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5"/>
    <path d="M12 7V17M8 12H16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="6" fill="#FFF" opacity="0.4"/>
  </svg>
);

const BronzeMedal = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <circle cx="12" cy="12" r="10" fill="#FDBA74" stroke="#C2410C" strokeWidth="1.5"/>
    <path d="M12 7V17M8 12H16" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="6" fill="#FFF" opacity="0.3"/>
  </svg>
);



const CheckIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', width: 14, height: 14, marginRight: 6, ...style }} {...props}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WarningIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', width: 14, height: 14, marginRight: 6, ...style }} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const GroomIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', width: 14, height: 14, marginRight: 6, ...style }} {...props}>
    <rect x="6" y="9" width="12" height="13" rx="2" ry="2"/>
    <path d="M9 9V5a3 3 0 1 1 6 0v4"/>
  </svg>
);

/* ─── breed profiles (unchanged) ─────────────────────────── */
const breedProfiles = {
  "Labrador Retriever": { traits: ["House","Spacious","Large yard","Yes","Ages 6–12","Yes","No","No","3+ hours","1–2 hours","< 2 hrs","Yes","Very active","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Labrador Retriever.jpg", desc: "Friendly, playful, and always ready for family fun." },
  "Golden Retriever":   { traits: ["House","Spacious","Large yard","Yes","Ages 6–12","Yes","No","No","3+ hours","1–2 hours","< 2 hrs","Yes","Very active","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Golden Retriever.webp", desc: "Loyal, gentle, and perfect for active families with kids." },
  "German Shepherd Dog":    { traits: ["House","Spacious","Open field","Yes","Teenagers 13+","Yes","No","No","3+ hours","2+ hours","< 2 hrs","Yes","Very active","Very playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/German Shepherd.jpg", desc: "Intelligent and loyal — great for security and companionship." },
  "Beagle":             { traits: ["2-3BHK","Moderate","Small yard","Yes","Ages 6–12","Yes","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Friendly","Some barking","Just the basics","No","Medium (7–14kg)","Weekly","Somewhat"], image: "/assets/Dogs/Beagle.jpg", desc: "Curious, merry, and loves to sniff out fun with kids." },
  "Pug":                { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","Yes","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/Pug.jpg", desc: "Charming and comical — perfect for apartment life." },
  "Shih Tzu":           { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","Yes","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Small (7kg & under)","Daily","Very important"], image: "/assets/Dogs/Shih Tzu.jpg", desc: "Affectionate lapdog — loves pampering and cuddles." },
  "Lhasa Apso":         { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","Yes","Low","Low energy","Independent","Prefer quiet","Just the basics","Yes","Small (7kg & under)","Daily","Very important"], image: "/assets/Dogs/Lhasa Apso.jpg", desc: "Small, loyal, and full of personality — great for apartments." },
  "Pomeranian":         { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","Yes","Moderate","Very playful","Friendly","Some barking","Just the basics","Yes","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/Pomeranian.jpg", desc: "Fluffy, energetic, and full of charm — loves attention." },
  "Indian Spitz":       { traits: ["2-3BHK","Moderate","Small yard","No","0–5","Yes","Yes","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Moderately playful","Friendly","Some barking","Just the basics","No","Medium (7–14kg)","Weekly","Somewhat"], image: "/assets/Dogs/Indian Spitz.jpg", desc: "Lively and intelligent — perfect family companion for Indian homes." },
  "Dachshund":          { traits: ["Apartment","Very little","None","No","0–5","No","Yes","No","< 1 hour","< 30 mins","2–5 hrs","Yes","Low","Moderately playful","Friendly","Some barking","Just the basics","No","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/Dachshund.jpg", desc: "Bold and curious — tiny but full of personality." },
  "Cocker Spaniel (American)":     { traits: ["2-3BHK","Moderate","Moderate yard","Yes","Ages 6–12","Yes","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Friendly","Some barking","Just the basics","No","Medium (7–14kg)","Weekly","Somewhat"], image: "/assets/Dogs/Cocker Spaniel.jpg", desc: "Sweet-natured, loves cuddles and playtime." },
  "Boxer":              { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","Yes","No","No","2–3 hours","1–2 hours","2–5 hrs","Yes","Very active","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], fill: "#FFF", image: "/assets/Dogs/Boxer.jpg", desc: "Energetic, fun-loving, and protective family clown." },
  "Doberman Pinscher":  { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","Yes","No","No","3+ hours","1–2 hours","< 2 hrs","Yes","Very active","Moderately playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Doberman Pinscher.jpg", desc: "Alert, loyal, and brave — needs structure and exercise." },
  "Rottweiler":         { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","Yes","No","No","2–3 hours","1–2 hours","< 2 hrs","Yes","Moderate","Moderately playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Rottweiler.jpg", desc: "Confident and strong — devoted guardian for experienced owners." },
  "Great Dane":         { traits: ["House","Spacious","Open yard","Yes","Ages 6–12","Yes","No","No","2–3 hours","1–2 hours","< 2 hrs","Yes","Moderate","Low energy","Calm","Some barking","Just the basics","No","Very Large (50kg+)","Weekly","Somewhat"], image: "/assets/Dogs/Great Dane.jpg", desc: "Gentle giant — affectionate and easy-going." },
  "Saint Bernard":      { traits: ["House","Spacious","Open yard","Yes","Ages 6–12","Yes","No","No","1–2 hours","1–2 hours","< 2 hrs","Yes","Low","Low energy","Calm","Prefer quiet","Just the basics","No","Very Large (50kg+)","Weekly","Somewhat"], image: "/assets/Dogs/Saint Bernard.jpg", desc: "Patient and gentle — loves kids and cold weather." },
  "Siberian Husky":     { traits: ["House","Spacious","Open field","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Independent","Loud & frequent","A lot — I enjoy it","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Siberian Husky.jpg", desc: "Adventurous and vocal — best for active families with space." },
  "Alaskan Malamute":   { traits: ["House","Spacious","Open field","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Independent","Loud & frequent","A lot — I enjoy it","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Alaskan Malamute.jpg", desc: "Strong, hardy, loves snow — needs space and activity." },
  "French Bulldog":     { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/French Bulldog.jpg", desc: "Easy-going and comical — loves apartment life." },
  "Bulldog":    { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Medium (7–14kg)","Weekly","Somewhat"], image: "/assets/Dogs/English Bulldog.jpg", desc: "Chilled-out and loving — great for relaxed homes." },
  "Bullmastiff":        { traits: ["House","Spacious","Large yard","No","Teenagers 13+","No","No","No","1–2 hours","1–2 hours","< 2 hrs","Yes","Low","Low energy","Protective","Prefer quiet","Just the basics","No","Very Large (50kg+)","Weekly","Somewhat"], image: "/assets/Dogs/Bullmastiff.jpg", desc: "Loyal guardian — calm, brave, and protective." },
  "Staffordshire Bull Terrier":   { traits: ["House","Spacious","Moderate yard","No","Teenagers 13+","No","No","No","2–3 hours","1–2 hours","2–5 hrs","Yes","Very active","Very playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Pit Bull Terrier.jpg", desc: "Energetic, loyal, and loving — needs strong leadership." },
  "American Bully (Standard)":     { traits: ["House","Spacious","Moderate yard","No","Teenagers 13+","No","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/American Bully.jpg", desc: "Friendly and sturdy — great companion with proper training." },
  "Maltese":            { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Small (7kg & under)","Daily","Very important"], image: "/assets/Dogs/Maltese.jpg", desc: "Tiny, loving, hypoallergenic — perfect lapdog for small spaces." },
  "Chihuahua":          { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Independent","Loud & frequent","Just the basics","Yes","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/Chihuahua.jpg", desc: "Small but bold — big personality in a tiny package!" },
  "Yorkshire Terrier":  { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Independent","Some barking","Just the basics","Yes","Small (7kg & under)","Daily","Very important"], image: "/assets/Dogs/Yorkshire Terrier.jpg", desc: "Tiny, clever, and charming — loves attention and pampering." },
  "Miniature Pinscher": { traits: ["Apartment","Very little","None","No","0–5","No","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Moderate","Very playful","Independent","Some barking","Just the basics","Yes","Small (7kg & under)","Weekly","Very important"], image: "/assets/Dogs/Miniature Pinscher.jpg", desc: "Tiny, brave, and energetic — loves to explore and play." },
  "Standard Poodle":             { traits: ["Apartment","Moderate","Small yard","No","0–5","Yes","Yes","No","1–2 hours","1–2 hours","2–5 hrs","No","Low","Moderately playful","Friendly","Some barking","A lot — I enjoy it","Yes","Medium (7–14kg)","Daily","Very important"], image: "/assets/Dogs/Poodle.jpg", desc: "Smart, hypoallergenic, and stylish — easy to train." },
  "Dalmatian":          { traits: ["House","Spacious","Large yard","No","0–5","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Independent","Some barking","A lot — I enjoy it","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Dalmatian.jpg", desc: "Spotted, energetic, and fun-loving — loves open spaces." },
  "English Cocker Spaniel": { traits: ["2-3BHK","Moderate","Moderate yard","Yes","Ages 6–12","Yes","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Friendly","Some barking","Just the basics","No","Medium (7–14kg)","Weekly","Somewhat"], image: "/assets/Dogs/English Cocker Spaniel.jpg", desc: "Happy and cheerful — loves playtime and cuddles." },
  "English Setter":     { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","No","No","No","2–3 hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/English Setter.jpg", desc: "Gentle, friendly, and energetic — loves big yards." },
  "Basset Hound":       { traits: ["Apartment","Very little","Small yard","No","0–5","No","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Low energy","Calm","Prefer quiet","Just the basics","Yes","Medium-Large (14–23kg)","Weekly","Somewhat"], image: "/assets/Dogs/Basset Hound.jpg", desc: "Laid-back with adorable droopy ears — calm and loyal." },
  "Boston Terrier":     { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","2–5 hrs","No","Low","Moderately playful","Friendly","Prefer quiet","Just the basics","Yes","Medium (7–14kg)","Weekly","Very important"], image: "/assets/Dogs/Boston Terrier.jpg", desc: "Friendly, playful, and perfect for apartment living." },
  "Border Collie":      { traits: ["House","Spacious","Open field","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Friendly","Loud & frequent","A lot — I enjoy it","No","Medium-Large (14–23kg)","Weekly","Not important"], image: "/assets/Dogs/Border Collie.jpg", desc: "Super smart and energetic — loves tasks and big spaces." },
  "Belgian Malinois":   { traits: ["House","Spacious","Open field","Yes","Teenagers 13+","No","No","No","3+ hours","< 2 hrs","2–5 hrs","Yes","Very active","Very playful","Protective","Loud & frequent","A lot — I enjoy it","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Belgian Malinois.jpg", desc: "Brilliant and loyal — best for experienced, active families." },
  "Irish Setter":       { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Irish Setter.jpg", desc: "Joyful and playful — needs space to run and explore." },
  "Weimaraner":         { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Protective","Some barking","A lot — I enjoy it","No","Large (23–50kg)","Weekly","Not important"], image: "/assets/Dogs/Weimaraner.jpg", desc: "Sleek, loyal, and adventurous — loves outdoor activities." },
  "Afghan Hound":       { traits: ["House","Moderate","Moderate yard","No","0–5","No","No","No","2–3 hours","1–2 hours","2–5 hrs","No","Moderate","Calm","Independent","Prefer quiet","Just the basics","No","Large (23–50kg)","Daily","Somewhat"], image: "/assets/Dogs/Afghan Hound.jpg", desc: "Elegant and graceful — independent spirit with stunning looks." },
  "Bichon Frise":       { traits: ["Apartment","Very little","None","No","0–5","Yes","Yes","No","< 1 hour","< 30 mins","< 2 hrs","No","Low","Moderately playful","Friendly","Prefer quiet","Just the basics","Yes","Medium (7–14kg)","Daily","Very important"], image: "/assets/Dogs/Bichon Frise.jpg", desc: "Happy, hypoallergenic fluffball — perfect for allergy sufferers." },
  "Collie (Rough)":       { traits: ["House","Spacious","Large yard","Yes","Ages 6–12","Yes","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Protective","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Rough Collie.jpg", desc: "Loyal and gentle — loves kids and watching over the family." },
  "Samoyed":            { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","No","No","No","3+ hours","2+ hours","2–5 hrs","Yes","Very active","Very playful","Friendly","Some barking","A lot — I enjoy it","No","Large (23–50kg)","Daily","Somewhat"], image: "/assets/Dogs/Samoyed.jpg", desc: "Fluffy and friendly — loves people and cold weather." },
  "Newfoundland":   { traits: ["House","Spacious","Large yard","Yes","Ages 0–5","Yes","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Low","Calm","Friendly","Prefer quiet","Just the basics","No","Very Large (50kg+)","Weekly","Somewhat"], image: "/assets/Dogs/Newfoundland Dog.jpg", desc: "Gentle giant — calm, loving, and great with kids." },
  "Bull Terrier":       { traits: ["House","Moderate","Moderate yard","Yes","Teenagers 13+","No","No","No","1–2 hours","1–2 hours","2–5 hrs","Yes","Moderate","Very playful","Friendly","Some barking","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Bull Terrier.jpg", desc: "Bold and fun-loving — always ready to play." },
  "Chinese Shar-Pei":           { traits: ["House","Moderate","Small yard","No","0–5","No","No","No","< 1 hour","< 2 hrs","2–5 hrs","No","Low","Calm","Protective","Prefer quiet","Just the basics","No","Large (23–50kg)","Weekly","Somewhat"], image: "/assets/Dogs/Shar Pei.jpg", desc: "Loyal and calm — famous for unique wrinkles." },
  "Dogo Argentino":     { traits: ["House","Spacious","Large yard","Yes","Teenagers 13+","No","No","No","3+ hours","< 2 hrs","2–5 hrs","Yes","Very active","Protective","Protective","Some barking","A lot — I enjoy it","No","Very Large (50kg+)","Weekly","Not important"], image: "/assets/Dogs/Dogo Argentino.jpg", desc: "Powerful and loyal — needs experienced owners and open space." },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function buildWhyMatch(answers = []) {
  const reasons = [];
  if (answers.includes('3+ hours'))      reasons.push('You have ample daily time — suits active and social breeds.');
  if (answers.includes('Apartment'))     reasons.push('You prefer compact living — adaptable or small breeds work best.');
  if (answers.includes('First-time owner')) reasons.push('You re new to dog parenting — beginner-friendly breeds suit you.');
  if (answers.includes('Low maintenance'))  reasons.push('You prefer easy grooming and simple care routines.');
  if (answers.includes('Very active'))   reasons.push('Your energetic lifestyle matches high-energy, playful breeds.');
  return reasons.length ? reasons : ['Your lifestyle answers align well with balanced, adaptable dog breeds.'];
}

const RANK_LABELS = [
  { label: "Best Match",       MedalIcon: GoldMedal,   cls: "rp-gold"   },
  { label: "Great Match",      MedalIcon: SilverMedal, cls: "rp-silver" },
  { label: "Good Alternative", MedalIcon: BronzeMedal, cls: "rp-bronze" },
];

export default function ResultsPage() {
  const router   = useRouter();
  const [matches,      setMatches]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [fallbackText, setFallbackText] = useState('');
  const [animated,     setAnimated]     = useState(false);
  const [answers,      setAnswers]       = useState([]);


  /* load + score quiz answers */
  useEffect(() => {
    const raw = sessionStorage.getItem('quizAnswers') ||
                localStorage.getItem('breedlyAnswers') ||
                localStorage.getItem('quizAnswers');

    if (!raw) {
      const saved = localStorage.getItem('breedlySavedResults');
      if (saved) {
        try { setMatches(JSON.parse(saved)); setLoading(false); return; } catch {}
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
      return { name, score, percent,
        image:       found?.image       || profile.image,
        description: found?.description || profile.desc || '',
        pros:        found?.pros        || profile.pros  || [],
        cons:        found?.cons        || profile.cons  || [],
        grooming:    found?.grooming    || profile.grooming || [],
        notes:       found?.notes       || profile.notes || [],
      };
    }).filter(b => b.score > 0).sort((a, b) => b.percent - a.percent || b.score - a.score);

    if (!scored.length) {
      setFallbackText('No matches found. Try adjusting your answers and retake the quiz.');
      setLoading(false);
      return;
    }

    const top3 = scored.slice(0, 3);
    setMatches(top3);
    localStorage.setItem('breedlySavedResults', JSON.stringify(top3));
    setLoading(false);
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const restartQuiz = () => {
    ['quizAnswers','breedlyAnswers','quizAnswers'].forEach(k => {
      try { sessionStorage.removeItem(k); localStorage.removeItem(k); } catch {}
    });
    router.push('/breed-selector');
  };

  const openBreed = (name) =>
    window.open(`/breeds/${encodeURIComponent(name)}`, '_blank', 'noopener,noreferrer');

  /* ── render ── */
  return (
    <main className="rp-page">

      {/* HEADER */}
      <header className="rp-header">
        <p className="rp-eyebrow">Your Results</p>
        <h1 className="rp-title">Your perfect pup<br /><em>matches are here.</em></h1>
        <p className="rp-quote">"The better I get to know men, the more I find myself loving dogs." — Charles de Gaulle</p>
      </header>

      {/* WHY MATCH */}
      {answers.length > 0 && (
        <section className="rp-why">
          <h2>
            <TipIcon style={{ width: 22, height: 22, marginRight: 8, color: 'var(--rp-accent-dark)' }} />
            Why these breeds fit you
          </h2>
          <ul>
            {buildWhyMatch(answers).map((text, i) => (
              <li key={i}>
                <PawIcon style={{ width: 14, height: 14, marginRight: 8, color: 'var(--rp-accent-dark)' }} />
                {text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CARDS */}
      <section className="rp-cards-wrap">
        {loading ? (
          <div className="rp-loading">
            <div className="rp-loading-dots"><span /><span /><span /></div>
            <p>Finding your matches…</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="rp-fallback">
            <DogIcon style={{ width: 64, height: 64, color: 'var(--rp-text-light)', marginBottom: 16 }} />
            <p>{fallbackText}</p>
            <button onClick={restartQuiz} className="rp-btn-primary">Retake Quiz</button>
          </div>
        ) : (
          <div className="rp-cards">
            {matches.map((breed, i) => (
              <article
                className="rp-card"
                key={breed.name}
                onClick={() => openBreed(breed.name)}
                style={{ cursor: 'pointer' }}
              >

                {/* rank badge */}
                <div className={`rp-rank-badge ${RANK_LABELS[i].cls}`}>
                  {(() => {
                    const Medal = RANK_LABELS[i].MedalIcon;
                    return <Medal style={{ width: 18, height: 18, marginRight: 5, verticalAlign: 'middle' }} />;
                  })()}
                  {RANK_LABELS[i].label}
                </div>

                {/* image */}
                <div className="rp-card-img-wrap">
                  <img src={breed.image} alt={breed.name} />
                </div>

                {/* body */}
                <div className="rp-card-body">
                  <h3>{breed.name}</h3>

                  {/* match bar */}
                  <div className="rp-match-wrap">
                    <div className="rp-match-track">
                      <div
                        className="rp-match-fill"
                        style={{ width: animated ? `${breed.percent}%` : '0%' }}
                      />
                    </div>
                    <span className="rp-match-pct">{breed.percent}% match</span>
                  </div>

                  {breed.description && <p className="rp-desc">{breed.description}</p>}

                  {breed.pros?.length > 0 && (
                    <ul className="rp-list rp-list--pros">
                      {breed.pros.slice(0, 3).map((p, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckIcon style={{ flexShrink: 0 }} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                  {breed.cons?.length > 0 && (
                    <ul className="rp-list rp-list--cons">
                      {breed.cons.slice(0, 3).map((c, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <WarningIcon style={{ flexShrink: 0 }} />
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                  {breed.grooming?.length > 0 && (
                    <ul className="rp-list rp-list--groom">
                      {breed.grooming.slice(0, 2).map((g, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <GroomIcon style={{ flexShrink: 0 }} />
                          {g}
                        </li>
                      ))}
                    </ul>
                  )}
                  {breed.notes?.length > 0 && (
                    <ul className="rp-list">
                      {breed.notes.slice(0, 2).map((n, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PawIcon style={{ width: 14, height: 14, color: 'var(--rp-accent)', flexShrink: 0 }} />
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    className="rp-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBreed(breed.name);
                    }}
                  >
                    View Full Info →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* RETAKE QUIZ CTA SECTION */}
      {!loading && matches.length > 0 && (
        <section className="rp-retake-section">
          <div className="rp-retake-card">
            <div className="rp-retake-content">
              <h2>Not quite the right match?</h2>
              <p>Your lifestyle and preferences are unique. Try taking the quiz again with different choices to see other wonderful breeds that might fit your home.</p>
            </div>
            <button className="rp-retake-btn" onClick={restartQuiz}>
              Retake the Quiz
            </button>
          </div>
        </section>
      )}

    </main>
  );
}