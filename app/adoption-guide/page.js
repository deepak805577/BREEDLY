'use client';
import { useState } from 'react';
import './adoption.css';

export default function AdoptionGuide() {
const checklist = [
  {
    title: "I have enough time daily",
    desc: "Dogs need walks, play, feeding, and attention every day"
  },
  {
    title: "I can afford vet & food costs",
    desc: "Vaccines, grooming, emergencies are part of adoption"
  },
  {
    title: "My family agrees with adoption",
    desc: "Everyone in the house should be comfortable"
  },
  {
    title: "I understand the breed’s needs",
    desc: "Energy, grooming, training differ by breed"
  }
];


  const [checked, setChecked] = useState([]);

  const toggle = (i) => {
    setChecked(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const progress = Math.round((checked.length / checklist.length) * 100);


  return (
    <main className="adoption-page">
      <header className="adoption-header">
        <h1>🏡 Adoption Readiness Checklist</h1>
        <p>Adopting a dog is a lifetime promise. Let’s make sure you’re ready.</p>
      </header>

      <section className="progress-box">
        <div className="progress-bar">
          <div className="fill" style={{ width: `${progress}%` }} />
        </div>
        <p>{progress}% ready</p>
      </section>

  <section className="check-section">
  <h3>🐾 Adoption Readiness Checklist</h3>

  <ul className="checklist">
    {checklist.map((item, i) => (
      <li
        key={i}
        className={`check-item ${checked.includes(i) ? 'checked' : ''}`}
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <input
          type="checkbox"
          checked={checked.includes(i)}
          onChange={() => toggle(i)}
        />

        <div className="check-content">
          <strong>{item.title}</strong>
          <span>{item.desc}</span>
        </div>
      </li>
    ))}
  </ul>
</section>

  <p className={`result-text ${progress >= 80 ? 'good' : 'warn'}`}>
  {progress >= 80
    ? "✅ You’re ready to adopt responsibly!"
    : "⚠️ Please review responsibilities before adopting"}
</p>
<button
  className="continue-btn"
  disabled={progress < 100}
  onClick={() => {
    localStorage.setItem(
      "adoptionReadiness",
      JSON.stringify({
        completed: true,
        date: new Date().toISOString(),
      })
      
    );
    window.location.href = "/adoption-success";
  }}
>
  Continue to Adoption 🎉
</button>

    </main>
  );
}
