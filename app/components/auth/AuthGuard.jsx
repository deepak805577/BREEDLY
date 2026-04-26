"use client";

import { useAuth }          from "../../context/AuthContext";
import AuthPage             from "./AuthPage";


export default function AuthGuard({ children }) {
  const { isLoggedIn, isLoading, profile } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isLoggedIn) return <AuthPage />;
  return children;
}

function LoadingScreen() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.1);opacity:0.7} }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#FBF2F8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 52, animation: "breathe 1.4s ease-in-out infinite" }}>🐾</div>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 24, color: "#3B4FC8" }}>BreedLy</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#C4AED4", fontFamily: "sans-serif" }}>Fetching your pack...</div>
      </div>
    </>
  );
}
