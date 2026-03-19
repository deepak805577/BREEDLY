"use client";

import { useAuth }        from "../context/AuthContext";
import  OnboardingFlow  from "./OnboardingFlow";
import { useRouter }      from "next/navigation";

export default function OnboardingPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f3f0e6", fontFamily:"sans-serif", color:"#A67B5B" }}>
      Loading...
    </div>
  );

  if (!isLoggedIn) {
    router.replace("/login");
    return null;
  }

  return (
    <OnboardingFlow
      onComplete={() => router.replace("/community")}
    />
  );
}