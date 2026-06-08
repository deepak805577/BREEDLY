// app/breed-selector/page.js
'use client';
import './breed-selector.css';
import { useState, useEffect } from 'react';
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import Confetti from 'react-confetti';

const PawIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z" />
  </svg>
);

const TipIcon = ({ style, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <line x1="9" y1="18" x2="15" y2="18" />
    <line x1="10" y1="22" x2="14" y2="22" />
  </svg>
);

const OPTION_ICONS = {
  home1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="22" x2="9" y2="16" />
      <line x1="15" y1="22" x2="15" y2="16" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zm-6 4h2v2H8v-2zm6 0h2v2h-2v-2z" />
    </svg>
  ),
  home2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 22V8l7-4 7 4v14" />
      <path d="M17 10h5v12" />
      <line x1="7" y1="8" x2="7" y2="8.01" />
      <line x1="7" y1="12" x2="7" y2="12.01" />
      <line x1="7" y1="16" x2="7" y2="16.01" />
      <line x1="13" y1="8" x2="13" y2="8.01" />
      <line x1="13" y1="12" x2="13" y2="12.01" />
      <line x1="13" y1="16" x2="13" y2="16.01" />
    </svg>
  ),
  house: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  bungalow: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 22h20" />
      <path d="M4 22V10l8-5 8 5v12" />
      <path d="M12 22V12h6" />
      <circle cx="8" cy="14" r="1" />
    </svg>
  ),
  space1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="10" rx="1" />
      <line x1="6" y1="7" x2="6" y2="11" />
      <line x1="10" y1="7" x2="10" y2="11" />
      <line x1="14" y1="7" x2="14" y2="11" />
      <line x1="18" y1="7" x2="18" y2="11" />
    </svg>
  ),
  space2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  space3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <polyline points="9 10 12 7 15 10" />
      <polyline points="9 14 12 17 15 14" />
    </svg>
  ),
  yard1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22V10" />
      <path d="M12 12c2.5-2.5 5-2.5 5 0s-2.5 5-5 5" />
      <path d="M12 14C9.5 11.5 7 11.5 7 14s2.5 5 5 5" />
    </svg>
  ),
  yard2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2v20" />
      <path d="M17 14a5 5 0 1 0-10 0c0 2 2 3.5 5 3.5s5-1.5 5-3.5z" />
      <path d="M12 5C9 8 7 11 7 13" />
      <path d="M12 5c3 3 5 6 5 8" />
    </svg>
  ),
  yard3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 20c4-4 8-4 12 0" />
      <path d="M9 20c4-4 8-4 12 0" />
      <line x1="6" y1="14" x2="6" y2="10" />
      <line x1="18" y1="13" x2="18" y2="9" />
    </svg>
  ),
  ac_yes: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="m20 16-4-4 4-4" />
      <path d="m4 8 4 4-4 4" />
      <path d="m16 4-4 4-4-4" />
      <path d="m8 20 4-4 4 4" />
    </svg>
  ),
  ac_no: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  ),
  child1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="7" r="4" />
      <path d="M12 12c-3.3 0-6 2.7-6 6v3h12v-3c0-3.3-2.7-6-6-6z" />
    </svg>
  ),
  child2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 2-7 7 7 7 7-7-7-7z" />
      <path d="m12 16 2 6-4-3-2 3z" />
    </svg>
  ),
  child3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  check: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  cross: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  allergy: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  ),
  smile: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  question: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  cat: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 5c-2 0-3 1-3 3v2c0 1.5 1 2.5 3 2.5s3-1 3-2.5V8c0-2-1-3-3-3z" />
      <path d="M7 6v4c0 3 2 4 5 4s5-1 5-4V6" />
      <path d="m9 5-2-3 1.5 3.5M15 5l2-3-1.5 3.5" />
    </svg>
  ),
  dog: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c.5-1.5.5-3.5-.5-4.5s-2.5-1-3.5.5c-1 1.5-2 1-3-.5-1-1.5-2.5-2.5-4-2.5S5 8 5 9.5c0 1 0 2.5.5 3.5s2 1.5 2 2.5v1.5C7.5 18 8 18.5 9 18.5h4c1 0 1.5-.5 1.5-1.5v-1c0-1 2-1.5 2.5-2.5.3-.7 1-1 2-1V14z" />
      <circle cx="7.5" cy="9.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  both: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="9" r="4" />
      <circle cx="15" cy="15" r="4" />
      <path d="M9 13v6M15 19v-4" />
    </svg>
  ),
  time1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 2h14" />
      <path d="M5 22h14" />
      <path d="M19 2v4c0 3.3-2.7 6-6 6s-6-2.7-6-6V2" />
      <path d="M5 22v-4c0-3.3 2.7-6 6-6s6 2.7 6 6v4" />
    </svg>
  ),
  time2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  time3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 5V2" />
      <path d="M10 2h4" />
      <line x1="12" y1="9" x2="12" y2="13" />
    </svg>
  ),
  exercise1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M21 9h-4V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3" />
    </svg>
  ),
  exercise2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3" />
      <path d="M12 7h6a3 3 0 0 1 3 3v4" />
    </svg>
  ),
  exercise3: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 8h4" />
      <path d="M6 8h4" />
      <path d="M2 17h20" />
      <path d="M12 3v14" />
    </svg>
  ),
  playful1: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M6.2 6.2c2.4 2.4 2.4 6.2 0 8.6" />
      <path d="M17.8 9.2c-2.4 2.4-2.4 6.2 0 8.6" />
    </svg>
  ),
  playful2: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <circle cx="9" cy="9" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </svg>
  ),
  sleep: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 22h20" />
      <path d="M5 22v-5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5" />
      <path d="M2 11h3v3H2z" />
    </svg>
  ),
  calm: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a10 10 0 0 1 10 10c0 2-2 3-4 3s-3-2-6-2-4 2-6 2-4-1-4-3A10 10 0 0 1 12 2z" />
      <line x1="2" y1="18" x2="22" y2="18" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  shield: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  independent: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  sound_high: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  sound_medium: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  sound_mute: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
  brain: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  ),
  book: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  cap: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  needle: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="2" x2="22" y2="6" />
      <line x1="14" y1="6" x2="18" y2="10" />
      <line x1="16" y1="4" x2="8" y2="12" />
      <path d="M9 11v4H5l-3 3v4h4l3-3v-4z" />
    </svg>
  ),
  size_small: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  size_medium: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="7" />
    </svg>
  ),
  size_large: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  bottle: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="9" width="12" height="13" rx="2" ry="2" />
      <path d="M9 9V5a3 3 0 1 1 6 0v4" />
      <path d="M12 2v3M9 2h6" />
    </svg>
  ),
  soap: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="7" cy="10" r="4" />
      <circle cx="16" cy="14" r="5" />
      <circle cx="12" cy="6" r="2" />
    </svg>
  ),
  comb: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="1" />
      <line x1="6" y1="10" x2="6" y2="18" />
      <line x1="10" y1="10" x2="10" y2="18" />
      <line x1="14" y1="10" x2="14" y2="18" />
      <line x1="18" y1="10" x2="18" y2="18" />
    </svg>
  ),
  scissors: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="10.12" />
      <line x1="20" y1="20" x2="8.12" y2="13.88" />
    </svg>
  ),
  subtract: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};

const questions = [
  // 1. Home & environment
  {
    question: "What type of home do you live in?",
    tip: "Apartment dwellers may prefer smaller or quieter breeds.",
    options: [
      { text: "1BHK", icon: "home1" },
      { text: "2-3BHK", icon: "home2" },
      { text: "House", icon: "house" },
      { text: "Bungalow", icon: "bungalow" }
    ]
  },
  {
    question: "How much indoor space will your dog have?",
    tip: "Dogs need space to stretch and move comfortably.",
    options: [
      { text: "Very little", icon: "space1" },
      { text: "Moderate", icon: "space2" },
      { text: "Spacious", icon: "space3" }
    ]
  },
  {
    question: "How much outdoor space is available?",
    tip: "Some breeds need large yards, others are fine with less.",
    options: [
      { text: "None", icon: "cross" },
      { text: "Small yard", icon: "yard1" },
      { text: "Large yard", icon: "yard2" },
      { text: "Open field", icon: "yard3" }
    ]
  },
  {
    question: "Do you have air conditioning?",
    tip: "Thick-fur breeds like Huskies need a cool environment.",
    options: [
      { text: "Yes", icon: "ac_yes" },
      { text: "No", icon: "ac_no" }
    ]
  },
  // 2. Household & people
  {
    question: "Do you have children at home, and what are their ages?",
    tip: "Kid-friendly breeds are gentler and more patient.",
    options: [
      { text: "No children", icon: "cross" },
      { text: "Ages 0–5", icon: "child1" },
      { text: "Ages 6–12", icon: "child2" },
      { text: "Teenagers 13+", icon: "child3" }
    ]
  },
  {
    question: "Will your dog interact with children regularly?",
    tip: "Cuddly breeds love being with children.",
    options: [
      { text: "Yes", icon: "check" },
      { text: "No", icon: "cross" }
    ]
  },
  {
    question: "Is anyone allergic to dogs or dog hair?",
    tip: "Hypoallergenic or low-shedding breeds may be better.",
    options: [
      { text: "Yes", icon: "allergy" },
      { text: "No", icon: "smile" },
      { text: "Not sure", icon: "question" }
    ]
  },
  {
    question: "Do you have other pets at home?",
    tip: "Some breeds are more sociable with other animals.",
    options: [
      { text: "No", icon: "cross" },
      { text: "Cats", icon: "cat" },
      { text: "Other dogs", icon: "dog" },
      { text: "Both", icon: "both" }
    ]
  },
  // 3. Time & experience
  {
    question: "How much time can you dedicate to your dog daily?",
    tip: "Dogs thrive on attention and routine.",
    options: [
      { text: "< 1 hour", icon: "time1" },
      { text: "1–2 hours", icon: "time2" },
      { text: "3+ hours", icon: "time3" }
    ]
  },
  {
    question: "How much daily exercise can you provide?",
    tip: "Some breeds require long walks or runs daily.",
    options: [
      { text: "< 30 mins", icon: "exercise1" },
      { text: "30–60 mins", icon: "exercise2" },
      { text: "1–2 hours", icon: "exercise3" },
      { text: "2+ hours", icon: "exercise3" }
    ]
  },
  {
    question: "How much time will your dog spend alone each day?",
    tip: "Independent breeds do better when left alone.",
    options: [
      { text: "< 2 hrs", icon: "time1" },
      { text: "2–5 hrs", icon: "time2" },
      { text: "5–8 hrs", icon: "time2" },
      { text: "8+ hrs", icon: "time3" }
    ]
  },
  {
    question: "Have you owned a dog before?",
    tip: "First-timers may want easier-to-train breeds.",
    options: [
      { text: "Yes", icon: "check" },
      { text: "No", icon: "cross" }
    ]
  },
  // 4. Lifestyle & preferences
  {
    question: "What's your activity level?",
    tip: "Dogs need matching energy! Active people = active breeds.",
    options: [
      { text: "Very active", icon: "exercise3" },
      { text: "Moderate", icon: "exercise2" },
      { text: "Low", icon: "exercise1" }
    ]
  },
  {
    question: "How playful should your dog be?",
    tip: "Energetic dogs need families who can play with them.",
    options: [
      { text: "Very playful", icon: "playful1" },
      { text: "Moderately playful", icon: "playful2" },
      { text: "Low energy", icon: "sleep" }
    ]
  },
  {
    question: "Which best describes your ideal dog's personality?",
    tip: "Choose a personality that suits your lifestyle.",
    options: [
      { text: "Playful", icon: "playful1" },
      { text: "Calm", icon: "calm" },
      { text: "Protective", icon: "shield" },
      { text: "Friendly", icon: "smile" },
      { text: "Independent", icon: "independent" }
    ]
  },
  {
    question: "How much barking can you tolerate?",
    tip: "Quieter breeds are better for apartments.",
    options: [
      { text: "Loud & frequent", icon: "sound_high" },
      { text: "Some barking", icon: "sound_medium" },
      { text: "Prefer quiet", icon: "sound_mute" }
    ]
  },
  {
    question: "How much training are you willing to provide?",
    tip: "Some breeds are easier to train than others.",
    options: [
      { text: "A lot — I enjoy it", icon: "brain" },
      { text: "Just the basics", icon: "book" },
      { text: "Prefer already trained", icon: "cap" }
    ]
  },
  {
    question: "Are you okay with dogs prone to health issues or high maintenance?",
    tip: "Some breeds need regular vet care or special attention.",
    options: [
      { text: "Yes", icon: "needle" },
      { text: "No", icon: "cross" },
      { text: "Not sure", icon: "question" }
    ]
  },
  // 5. Dog specifics
  {
    question: "What size of dog do you prefer?",
    tip: "If you live in a smaller space, consider a smaller dog.",
    options: [
      { text: "Small (7kg & under)", icon: "size_small" },
      { text: "Medium (7–14kg)", icon: "size_medium" },
      { text: "Medium-Large (14–23kg)", icon: "size_large" },
      { text: "Large (23–50kg)", icon: "size_large" },
      { text: "Very Large (50kg+)", icon: "size_large" },
      { text: "No preference", icon: "question" }
    ]
  },
  {
    question: "How much grooming can you manage?",
    tip: "Long-coated breeds require more grooming time.",
    options: [
      { text: "Daily", icon: "bottle" },
      { text: "Weekly", icon: "soap" },
      { text: "Occasional", icon: "comb" },
      { text: "Minimal", icon: "scissors" }
    ]
  },
  {
    question: "How important is low shedding to you?",
    tip: "Low-shedding breeds are great for cleanliness & allergies.",
    options: [
      { text: "Very important", icon: "check" },
      { text: "Somewhat", icon: "subtract" },
      { text: "Not important", icon: "cross" }
    ]
  }
];

const SECTIONS = [
  { label: "Home", range: [0, 3] },
  { label: "Household", range: [4, 7] },
  { label: "Time", range: [8, 11] },
  { label: "Lifestyle", range: [12, 17] },
  { label: "Your Dog", range: [18, 20] },
];

export default function BreedSelector() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [fade, setFade] = useState(true);
  const [finished, setFinished] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [statusText, setStatusText] = useState("Analyzing your space & schedule...");

  // Cycle status texts during loading redirection
  useEffect(() => {
    if (!finished) return;
    const t1 = setTimeout(() => setStatusText("Calculating activity compatibility..."), 700);
    const t2 = setTimeout(() => setStatusText("Matching your ideal dog breeds..."), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [finished]);

  useEffect(() => {
    const pct = ((currentQuestion + 1) / questions.length) * 100;
    const t = setTimeout(() => setProgressWidth(pct), 50);
    return () => clearTimeout(t);
  }, [currentQuestion]);

  useEffect(() => {
    if (currentQuestion === 0) return;
    setIsBouncing(true);
    const t = setTimeout(() => setIsBouncing(false), 500);
    return () => clearTimeout(t);
  }, [currentQuestion]);

  const q = questions[currentQuestion];

  const currentSection = SECTIONS.findIndex(
    (s) => currentQuestion >= s.range[0] && currentQuestion <= s.range[1]
  );

  const handleAnswer = (answer) => {
    const updated = [...answers];
    updated[currentQuestion] = answer;
    setAnswers(updated);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFade(true);
      } else {
        setFinished(true);
        localStorage.setItem('breedlyAnswers', JSON.stringify(updated));
        setTimeout(() => router.push('/results'), 2200);
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentQuestion === 0) return;
    setFade(false);
    setTimeout(() => {
      setCurrentQuestion(currentQuestion - 1);
      setFade(true);
    }, 200);
  };

  if (finished) {
    return (
      <ProtectedRoute>
        <div className="qs-page">
          <div className="qs-done">
            <div className="qs-done-icon-wrap">
              <div className="qs-done-ring"></div>
              <div className="qs-done-paw">
                <PawIcon style={{ width: 56, height: 56 }} />
              </div>
            </div>
            
            <h2>Analyzing matches</h2>
            <p className="qs-done-status">{statusText}</p>
            
            <div className="qs-done-progress">
              <div className="qs-done-progress-fill"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="qs-page">

        <div className="qs-top">
          <div className="qs-brand">
            <PawIcon style={{ width: 22, height: 22, color: 'var(--qs-accent-dark)' }} /> BreedLy
          </div>
          <p className="qs-tagline">Find your perfect pup match</p>
        </div>

        <div className="qs-sections">
          {SECTIONS.map((s, i) => (
            <div
              key={s.label}
              className={`qs-section-dot${i < currentSection ? " qs-section-done" : ""}${i === currentSection ? " qs-section-active" : ""}`}
            >
              <span>{i < currentSection ? "✓" : i + 1}</span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <section className={`qs-card ${fade ? "qs-fade-in" : "qs-fade-out"}`}>

          <div className="qs-question-wrap">
            <span className="qs-q-num">Q{currentQuestion + 1} of {questions.length}</span>
            <h2 className="qs-question">{q.question}</h2>
            <p className="qs-tip">
              <TipIcon style={{ width: 14, height: 14, marginRight: 5, color: 'var(--qs-accent-dark)' }} />
              {q.tip}
            </p>
          </div>

          <div className={`qs-options${q.options.length > 4 ? " qs-options--wide" : ""}`}>
            {q.options.map((opt, i) => {
              const IconComp = OPTION_ICONS[opt.icon];
              return (
                <button
                  key={i}
                  className={`qs-option${answers[currentQuestion] === opt.text ? " qs-option--selected" : ""}`}
                  onClick={() => handleAnswer(opt.text)}
                >
                  <span className="qs-opt-icon">
                    {IconComp ? <IconComp style={{ width: 34, height: 34 }} /> : null}
                  </span>
                  <span className="qs-opt-text">{opt.text}</span>
                </button>
              );
            })}
          </div>

          <div className="qs-progress-wrap">
            <div className="qs-progress-track">
              <div
                className="qs-progress-fill"
                style={{ width: `${progressWidth}%` }}
              />
              <span
                className={`qs-paw-icon${isBouncing ? " qs-paw-bounce" : ""}`}
                style={{ left: `${progressWidth}%`, color: 'var(--qs-accent-dark)' }}
              >
                <PawIcon style={{ width: 22, height: 22 }} />
              </span>
            </div>
            <div className="qs-progress-labels">
              <span>Start</span>
              <span>{Math.round(progressWidth)}% done</span>
            </div>
          </div>

          <div className="qs-nav">
            <button
              className="qs-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
            >
              ← Back
            </button>
            <span className="qs-step">{currentQuestion + 1} / {questions.length}</span>
            {answers[currentQuestion] && currentQuestion < questions.length - 1 && (
              <button
                className="qs-skip-btn"
                onClick={() => handleAnswer(answers[currentQuestion])}
              >
                Next →
              </button>
            )}
            {!answers[currentQuestion] && <span className="qs-hint">Tap any option</span>}
          </div>

        </section>

        <p className="qs-quote">
          "Dogs do speak, but only to those who know how to listen."
        </p>

      </div>
    </ProtectedRoute>
  );
}