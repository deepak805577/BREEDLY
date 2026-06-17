"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./loader.css";

const ICONS = [
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

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    ICONS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % ICONS.length);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setExiting(true), 2000);
    const removeTimer = setTimeout(() => setLoading(false), 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div id="dog-loader" className={exiting ? "fade-out" : ""}>
      <h1 className="loader-title">
        BreedLy
      </h1>

      <Image
        src={ICONS[currentIcon]}
        alt="Loading"
        width={90}
        height={90}
        priority
        className="loader-icon"
      />
    </div>
  );
}