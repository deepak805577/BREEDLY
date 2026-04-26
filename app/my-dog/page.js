"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./my-dog.css";
import ProtectedRoute from "../components/ProtectedRoute";
import { breedCards } from "@/app/data/breed";
import { supabase } from "@/lib/supabase";
export default function MyDogPage() {
  const [dogs, setDogs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

useEffect(() => {
  const fetchDogs = async () => {
    const { data, error } = await supabase
      .from("dogs")
      .select("*");

    if (!error) {
      setDogs(data);
      if (data.length > 0) setActiveId(data[0].id);
    }
  };

  fetchDogs();
}, []);

  const activeDog = dogs.find(d => d.id === activeId);

  // Calculate Life Stage Percentage for Progress Bar
  const getLifeProgress = (age) => {
    const percentage = (age / 15) * 100; // Assuming 15 is max life expectancy
    return Math.min(percentage, 100);
  };

  const handleDelete = (id) => {
    if (confirm("Permanently remove this family member?")) {
      const updated = dogs.filter(d => d.id !== id);
      setDogs(updated);
      localStorage.setItem("breedlyDogs", JSON.stringify(updated));
      if (id === activeId) setActiveId(updated[0]?.id || null);
    }
  };

  return (
    <ProtectedRoute>
      <main className="my-dog-page">
        <div className="dashboard-layout">
          
          {/* LEFT SIDEBAR */}
          <aside className="sidebar-nav">
            <h3 style={{fontFamily: 'Fraunces', marginLeft: '10px'}}>The Pack</h3>
            {dogs.map(dog => (
              <div 
                key={dog.id} 
                className={`dog-nav-item ${activeId === dog.id ? 'active' : ''}`}
                onClick={() => { setActiveId(dog.id); localStorage.setItem("activeDogId", dog.id); setIsEditing(false); }}
              >
                <span style={{fontSize: '1.5rem'}}>🐕</span>
                <div>
                  <div style={{fontWeight: '600', fontSize: '0.95rem'}}>{dog.name}</div>
                  <div style={{fontSize: '0.75rem', opacity: 0.6}}>{dog.breed}</div>
                </div>
              </div>
            ))}
            <Link href="/my-dog/add" className="p-btn p-btn-outline" style={{marginTop: '10px', justifyContent: 'center'}}>
              + Add Member
            </Link>
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className="profile-container">
            {!activeDog ? (
              <div className="profile-card" style={{textAlign: 'center'}}>
                <h2>Start your journey</h2>
                <p>Add your first dog to unlock personalized health tracking.</p>
                <Link href="/my-dog/add" className="p-btn p-btn-main">Add My Dog</Link>
              </div>
            ) : isEditing ? (
              <div className="profile-card">
                <h2 style={{fontFamily: 'Fraunces'}}>Refine Profile</h2>
                {/* Simplified Edit Form */}
                <div style={{display: 'grid', gap: '15px', marginTop: '20px'}}>
                  <input className="info-tile" type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                  <div style={{display: 'flex', gap: '10px'}}>
                     <button onClick={() => {
                       const updated = dogs.map(d => d.id === activeId ? editData : d);
                       setDogs(updated);
                       localStorage.setItem("breedlyDogs", JSON.stringify(updated));
                       setIsEditing(false);
                     }} className="p-btn p-btn-main">Save</button>
                     <button onClick={() => setIsEditing(false)} className="p-btn p-btn-outline">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-card">
                <div className="profile-header">
                  <div>
                    <span className="progress-labels" style={{color: '#A3B18A', fontWeight: '700'}}>Active Profile</span>
                    <h2>{activeDog.name}</h2>
                    <span style={{color: '#B08968', fontSize: '0.9rem'}}>{activeDog.breed}</span>
                  </div>
                  <div className="btn-group" style={{marginTop: '0'}}>
                    <button onClick={() => { setEditData(activeDog); setIsEditing(true); }} className="p-btn p-btn-outline">Edit</button>
                    <button onClick={() => handleDelete(activeDog.id)} className="p-btn" style={{color: '#b85c5c'}}>Remove</button>
                  </div>
                </div>

                {/* Life Stage Progress */}
                <div className="life-stage-container">
                  <div className="progress-labels">
                    <span>Puppy</span>
                    <span>Adult</span>
                    <span>Senior</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{width: `${getLifeProgress(activeDog.age)}%`}}></div>
                  </div>
                  <p style={{fontSize: '0.8rem', marginTop: '10px', color: '#666'}}>
                    {activeDog.name} is currently in the <strong>{activeDog.age < 1 ? 'Development' : activeDog.age < 7 ? 'Maintenance' : 'Golden'}</strong> stage of life.
                  </p>
                </div>

                {/* Quick Info Grid */}
                <div className="info-grid">
                  <div className="info-tile"><span>Age</span><strong>{activeDog.age} Years</strong></div>
                  <div className="info-tile"><span>Weight</span><strong>{activeDog.weight} kg</strong></div>
                  <div className="info-tile"><span>Location</span><strong>{activeDog.city}</strong></div>
                  <div className="info-tile"><span>Status</span><strong style={{color: '#A3B18A'}}>Healthy</strong></div>
                </div>

                {/* Split Care Content */}
                <div className="care-grid">
                  <div className="care-section">
                    <h4>🦴 Nutrition & Health</h4>
                    <ul className="care-list">
                      <li><span>Daily Diet</span> <strong>{activeDog.food?.recommended || "Standard"}</strong></li>
                      <li><span>Restrictions</span> <strong>{activeDog.allergies || "None"}</strong></li>
                      <li><span>Next Checkup</span> <strong>In 4 Months</strong></li>
                    </ul>
                    <Link href={`/health-guide?breed=${activeDog.breed}`} className="p-btn p-btn-main" style={{width: '100%', marginTop: '15px', justifyContent: 'center'}}>
                      View Health Guide
                    </Link>
                  </div>

                  <div className="care-section">
                    <h4>🎾 Activity & Routine</h4>
                    <ul className="care-list">
                      <li><span>Exercise</span> <strong>{activeDog.age < 7 ? '60 mins' : '30 mins'}</strong></li>
                      <li><span>Socialization</span> <strong>High Priority</strong></li>
                      <li><span>Grooming</span> <strong>Every 2 Weeks</strong></li>
                    </ul>
                    <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                      <Link href={`/food-guide?breed=${activeDog.breed}`} className="p-btn p-btn-outline" style={{flex: 1, justifyContent: 'center'}}>Food</Link>
                      <Link href="/care-grooming" className="p-btn p-btn-outline" style={{flex: 1, justifyContent: 'center'}}>Groom</Link>
                      <Link href="/my-dog/services" className="p-btn p-btn-outline" style={{flex: 1, justifyContent: 'center'}}>Vets</Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}