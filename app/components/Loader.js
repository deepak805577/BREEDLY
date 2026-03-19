"use client";
import { useEffect, useState } from "react";
import "./loader.css";

export default function Loader() {
  const icons = [
    "/assets/loader/face.png",
    "/assets/loader/bowl.png",
    "/assets/loader/quiz.png",
    "/assets/loader/guide.png",
    "/assets/loader/training.png",
    "/assets/loader/care.png",
    "/assets/loader/home.png",
    "/assets/loader/medi.png",
    "/assets/loader/paws.png",
    
  ];

  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);

  // Cycle through icons #ffe6ce;
  useEffect(() => {
    const iconTimer = setInterval(() => {
  setCurrentIcon((prev) => (prev + 1) % icons.length);
},250); // switch every 1s
// Change every 400ms for smooth animation
    return () => clearInterval(iconTimer);
  }, []);

  // Loader // Loader fade + remove (longer)
useEffect(() => {
  const fadeTimer = setTimeout(() => setExiting(true), 2000); // fade after 5s
  const removeTimer = setTimeout(() => setLoading(false), 4000); // remove after fade

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div id="dog-loader" className={exiting ? "fade-out" : ""}>
      <h1 className="loader-title">BreedLy</h1>

      <img
        src={icons[currentIcon]}
        alt="Loading"
        className="loader-icon"
      />
    </div>
  );
}
