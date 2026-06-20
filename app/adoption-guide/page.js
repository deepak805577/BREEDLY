"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import "./adoption.css";

export default function AdoptionGuide() {
  const router = useRouter();
  const [checked, setChecked] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checklist = [
    {
      id: "time",
      title: "Daily Time Commitment",
      desc: "Dogs require walks, play, feeding, and attention every single day, not just on weekends. I am prepared to dedicate the necessary time."
    },
    {
      id: "finance",
      title: "Financial Responsibility",
      desc: "Vaccines, high-quality nutrition, grooming, and unforeseen emergency veterinary bills are accepted as part of the adoption."
    },
    {
      id: "family",
      title: "Household Agreement",
      desc: "Everyone in the household has been consulted and is fully prepared to welcome and care for a new family member."
    },
    {
      id: "knowledge",
      title: "Breed Understanding",
      desc: "I have researched and understand the specific energy levels, grooming demands, and training requirements of the dog."
    },
    {
      id: "commitment",
      title: "Long-term Dedication",
      desc: "I am fully prepared to care for my dog through all life stages, committing to a potential 10-15 year relationship."
    },
    {
      id: "love",
      title: "Patience and Compassion",
      desc: "I understand that transition takes time. I am ready to train with positive reinforcement and endless patience."
    }
  ];

  const toggle = (id) => {
    setChecked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const progress = Math.round((checked.length / checklist.length) * 100);
  const isComplete = progress === 100;

  const handleContinue = () => {
    localStorage.setItem(
      "adoptionReadiness",
      JSON.stringify({
        completed: true,
        date: new Date().toISOString(),
      })
    );
    router.push("/adoption-success");
  };

  if (!mounted) return null;

  return (
    <main className="adoption-page">
      <div className="adoption-container">
        
        <header className="adoption-header">
          <span className="eyebrow">Preparation</span>
          <h1>Adoption Readiness</h1>
          <p>Adopting a dog is a lifetime promise. Please review and acknowledge these commitments to ensure you are fully prepared for the journey ahead.</p>
        </header>

        <section className="progress-section">
          <div className="progress-header">
            <span>Readiness Score</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </section>

        <section className="checklist-container">
          {checklist.map((item, index) => {
            const isChecked = checked.includes(item.id);
            return (
              <label
                key={item.id}
                className={`check-item ${isChecked ? "checked" : ""}`}
              >
                <div className="check-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="check-content">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
                <div className={`custom-checkbox ${isChecked ? "active" : ""}`}>
                  {isChecked && <Check size={16} strokeWidth={3} className="check-icon" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden-checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.id)}
                />
              </label>
            );
          })}
        </section>

        <div className="adoption-footer">
          <div className="footer-content">
            <p className={`status-text ${isComplete ? "success" : ""}`}>
              {isComplete
                ? "You are fully ready to adopt responsibly."
                : "Acknowledge all commitments to proceed."}
            </p>
            <button
              className="btn-primary continue-btn"
              disabled={!isComplete}
              onClick={handleContinue}
            >
              Continue to Adoption <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
