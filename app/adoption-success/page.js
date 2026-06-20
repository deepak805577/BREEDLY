"use client";
import "./success.css";
import { useRouter } from "next/navigation";
import { Ribbon, ArrowRight } from "lucide-react";

export default function AdoptionSuccess() {
  const router = useRouter();

  return (
    <main className="adoption-success-page">
      <div className="success-container">
        
        <div className="success-icon-badge">
          <Ribbon size={32} strokeWidth={1.5} className="ribbon-icon" />
        </div>

        <span className="eyebrow">Milestone Reached</span>
        <h1>Congratulations</h1>
        
        <p className="subtitle">
          You have taken a beautiful step toward giving a dog a loving home. Your journey as a dedicated pet parent begins now.
        </p>

        <div className="success-actions">
          <button
            className="btn-primary"
            onClick={() => router.push("/my-dog/add")}
          >
            Start Care Journey <ArrowRight size={16} style={{marginLeft: "8px"}} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => router.push("/")}
          >
            Return Home
          </button>
        </div>

      </div>
    </main>
  );
}
