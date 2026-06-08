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

  // Cycle through icons
  useEffect(() => {
    const iconTimer = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 250); // Change every 250ms for smooth animation
    return () => clearInterval(iconTimer);
  }, [icons.length]);

  // Fade out and unmount transitions
  useEffect(() => {
    const fadeTimer = setTimeout(() => setExiting(true), 2000); // Start fade after 2s
    const removeTimer = setTimeout(() => setLoading(false), 4000); // Remove after fade completes

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

      {/* Hidden container to preload images and prevent flickering during transitions */}
      <div style={{ display: "none" }} aria-hidden="true">
        {icons.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>
    </div>
  );
}
