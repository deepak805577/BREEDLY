"use client";
import "./success.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AdoptionSuccess() {
  const router = useRouter();

  useEffect(() => {
    // optional confetti later
  }, []);

  return (
    <div className="adoption-success-page">
      {/* Background */}
      <div className="success-bg" />

      {/* Content */}
      <div className="success-card">
        <div className="success-icon">🐾</div>

        <h1>Congratulations!</h1>
        <p className="subtitle">
          You’ve taken a beautiful step toward giving a dog a loving home.
        </p>

        <p className="message">
          Adoption is not just a choice — it’s a commitment.  
          BreedLy will guide you every step of the way 💛
        </p>

        <button
          className="primary-btn"
          onClick={() => router.push("/care-plan")}
        >
          Start Care Journey →
        </button>
      </div>
    </div>
  );
}
