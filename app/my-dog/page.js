"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "./my-dog.css";
import DogCareTabs from "./DogCareTabs";
import DailyDashboard from "./DailyDashboard";
import SmartInsights from "./SmartInsights";
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dogs")
        .select("*")
        .eq("user_id", user.id);

      if (!error) {
        setDogs(data);
        if (data.length > 0) {
          const savedId = localStorage.getItem("activeDogId");
          const exists = data.find(d => d.id === savedId);
          setActiveId(exists ? savedId : data[0].id);
        }
      }
    };

    fetchDogs();
  }, []);

  const activeDog = dogs.find(d => d.id === activeId);

  // Calculate Life Stage Percentage for Progress Bar
  const getLifeProgress = (age) => {
    const percentage = (age / 15) * 100;
    return Math.min(percentage, 100);
  };

  const handleDelete = async (id) => {
    if (confirm("Permanently remove this family member?")) {
      const { error } = await supabase
        .from("dogs")
        .delete()
        .eq("id", id);

      if (!error) {
        const updated = dogs.filter(d => d.id !== id);
        setDogs(updated);
        if (id === activeId) setActiveId(updated[0]?.id || null);
      } else {
        alert("Failed to delete dog: " + error.message);
      }
    }
  };

  const handleUpdate = (updated) => setDogs(dogs.map(d => d.id === updated.id ? updated : d));

  return (
    <ProtectedRoute>
      <main className="my-dog-page">
        <div className="dashboard-layout">

          {/* LEFT SIDEBAR */}
          <aside className="sidebar-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header stays pinned on mobile */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', color: '#7F5539', margin: 0 }}>The Pack</h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#A3B18A', background: '#F0F5EC', padding: '3px 10px', borderRadius: '12px' }}>{dogs.length}</span>
            </div>

            {/* Nav area that becomes horizontal on mobile via CSS */}
            <div className="sidebar-nav">
              {dogs.map(dog => {
                const isActive = activeId === dog.id;
                const initial = dog.name ? dog.name.charAt(0).toUpperCase() : 'D';
                return (
                  <div
                    key={dog.id}
                    onClick={() => { setActiveId(dog.id); localStorage.setItem("activeDogId", dog.id); setIsEditing(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 16px', borderRadius: '20px', cursor: 'pointer',
                      background: isActive ? 'linear-gradient(135deg, #7F5539 0%, #5D3A22 100%)' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#3E3E3E',
                      boxShadow: isActive ? '0 10px 24px rgba(127,85,57,0.25)' : '0 4px 12px rgba(0,0,0,0.03)',
                      border: isActive ? '1px solid transparent' : '1px solid rgba(176,137,104,0.1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      flexShrink: 0, minWidth: '220px', scrollSnapAlign: 'start'
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                      background: isActive ? 'rgba(255,255,255,0.15)' : '#FFF6ED',
                      color: isActive ? '#FFFFFF' : '#B08968',
                      fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 600,
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      boxShadow: isActive ? 'none' : 'inset 0 2px 4px rgba(176,137,104,0.1)'
                    }}>
                      {initial}
                    </div>
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', fontSize: '1rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', marginBottom: '2px' }}>{dog.name}</div>
                      <div style={{ fontSize: '0.78rem', opacity: isActive ? 0.85 : 0.5, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{dog.breed}</div>
                    </div>
                  </div>
                );
              })}

              <Link href="/my-dog/add" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '0 20px', borderRadius: '20px', height: '68px',
                background: 'transparent', border: '1.5px dashed rgba(176,137,104,0.3)',
                color: '#B08968', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.2s', flexShrink: 0, scrollSnapAlign: 'start'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(176,137,104,0.05)'; e.currentTarget.style.borderColor = 'rgba(176,137,104,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(176,137,104,0.3)'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Add Member
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <section className="profile-container">
            {!activeDog ? (
              <div className="profile-card" style={{ textAlign: 'center', padding: '60px 30px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}></div>
                <h2 style={{ fontFamily: 'Fraunces', fontSize: '1.6rem', color: '#7F5539', marginBottom: '8px' }}>Start your journey</h2>
                <p style={{ fontStyle: 'italic', color: '#999', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto 24px' }}>Add your first dog to unlock personalized health tracking, smart insights, and daily care tools.</p>
                <Link href="/my-dog/add" className="p-btn p-btn-main" style={{ padding: '14px 32px' }}>Add My Dog</Link>
              </div>
            ) : isEditing ? (
              <div className="profile-card">
                <h2 style={{ fontFamily: 'Fraunces' }}>Refine Profile</h2>
                <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px', display: 'block' }}>Name</label>
                      <input className="info-tile" style={{ width: '100%', padding: '10px' }} type="text" value={editData.name || ""} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px', display: 'block' }}>Age (Years)</label>
                      <input className="info-tile" style={{ width: '100%', padding: '10px' }} type="number" step="0.1" value={editData.age || ""} onChange={e => setEditData({ ...editData, age: e.target.value ? Number(e.target.value) : null })} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px', display: 'block' }}>Weight (kg)</label>
                      <input className="info-tile" style={{ width: '100%', padding: '10px' }} type="number" step="0.1" value={editData.weight || ""} onChange={e => setEditData({ ...editData, weight: e.target.value ? Number(e.target.value) : null })} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                    <button onClick={async () => {
                      const { error } = await supabase
                        .from("dogs")
                        .update({
                          name: editData.name,
                          age: editData.age,
                          weight: editData.weight
                        })
                        .eq("id", activeId);

                      if (!error) {
                        const updated = dogs.map(d => d.id === activeId ? editData : d);
                        setDogs(updated);
                        setIsEditing(false);
                      } else {
                        alert("Failed to update dog: " + error.message);
                      }
                    }} className="p-btn p-btn-main">Save</button>
                    <button onClick={() => setIsEditing(false)} className="p-btn p-btn-outline">Cancel</button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* ─── PROFILE HEADER ─── */}
                <div className="profile-card" style={{ marginBottom: '20px', background: 'linear-gradient(180deg, #FFFFFF 0%, #FDFAF6 100%)' }}>
                  <div className="profile-header" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#A3B18A', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Active Profile</span>
                      <h2 style={{ fontSize: '2rem', lineHeight: 1.1, marginBottom: '4px' }}>{activeDog.name}</h2>
                      <span style={{ color: '#B08968', fontSize: '0.85rem', fontWeight: 400 }}>{activeDog.breed}</span>
                    </div>
                    <div className="btn-group" style={{ marginTop: '0', gap: '8px' }}>
                      <button onClick={() => { setEditData(activeDog); setIsEditing(true); }} className="p-btn p-btn-outline p-btn-sm" style={{ borderColor: '#B0896844', background: 'rgba(176,137,104,0.04)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(activeDog.id)} className="p-btn p-btn-sm" style={{ color: '#b85c5c', background: '#FFF0F0', border: '1px solid #b85c5c15' }}>
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Info Chips */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px', paddingTop: '18px', borderTop: '1px solid rgba(176,137,104,0.08)' }}>
                    {[
                      { label: 'Age', value: `${activeDog.age} Yrs`, color: '#7F5539' },
                      { label: 'Weight', value: `${activeDog.weight} kg`, color: '#7F5539' },
                      { label: 'Location', value: activeDog.city || '—', color: '#7F5539' },
                      { label: 'Stage', value: activeDog.age < 1 ? 'Puppy' : activeDog.age < 7 ? 'Adult' : 'Senior', color: activeDog.age < 1 ? '#587B45' : activeDog.age >= 8 ? '#b85c5c' : '#7F5539' },
                    ].map((chip, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 14px', borderRadius: '12px',
                        background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.03)',
                        flex: '1 1 auto', minWidth: '90px',
                      }}>
                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#BBB', fontWeight: 700 }}>{chip.label}</span>
                        <strong style={{ fontSize: '0.85rem', color: chip.color, marginLeft: 'auto', fontFamily: 'Fraunces, serif' }}>{chip.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                {/* ─── 2. CARE TABS ─── */}
                <div className="profile-card" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#B08968', fontWeight: 700 }}>Care Management</span>
                      <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.15rem', color: '#7F5539', margin: '4px 0 0 0' }}>{activeDog.name}'s Care Plan</h3>
                    </div>
                  </div>
                  <DogCareTabs dog={activeDog} onUpdate={handleUpdate} />
                </div>

                {/* ─── 1. DAILY DASHBOARD ─── */}
                <DailyDashboard dog={activeDog} onUpdate={handleUpdate} />



                {/* ─── 3. SMART INSIGHTS ─── */}
                <SmartInsights dog={activeDog} />
                {/* ─── 4. QUICK ACTIONS ─── */}
                <div style={{ marginTop: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', color: '#7F5539', margin: 0 }}>Quick Actions</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

                    {/* Food Plan - Hero Card */}
                    <Link href={`/food-guide?dogId=${activeDog.id}`} style={{
                      background: 'linear-gradient(135deg, #7F5539 0%, #5D3A22 100%)',
                      borderRadius: '24px', padding: '24px', textDecoration: 'none', color: 'white',
                      display: 'flex', flexDirection: 'column', gap: '20px',
                      boxShadow: '0 10px 30px rgba(127, 85, 57, 0.2)', transition: 'transform 0.25s, box-shadow 0.25s',
                      position: 'relative', overflow: 'hidden'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(127, 85, 57, 0.3)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(127, 85, 57, 0.2)'; }}
                    >
                      <div style={{ position: 'absolute', right: '-15px', top: '-15px', opacity: 0.08, transform: 'scale(2.5)' }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 2.2 1.8 4 4 4h0c2.2 0 4-1.8 4-4V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.15)', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 2.2 1.8 4 4 4h0c2.2 0 4-1.8 4-4V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
                      </div>
                      <div style={{ zIndex: 1 }}>
                        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 600 }}>Food Plan</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Current: {activeDog.food?.recommended || "Standard"}</p>
                      </div>
                    </Link>

                    {/* Health Guide */}
                    <Link href={`/health-guide?breed=${activeDog.breed}`} style={{
                      background: '#FFFFFF', border: '1px solid rgba(176,137,104,0.1)',
                      borderRadius: '24px', padding: '24px', textDecoration: 'none', color: '#7F5539',
                      display: 'flex', flexDirection: 'column', gap: '20px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.02)', transition: 'all 0.25s'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.02)'; }}
                    >
                      <div style={{ background: '#FFF6ED', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B08968' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 600 }}>Health Guide</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Breed-specific insights</p>
                      </div>
                    </Link>

                    {/* Grooming */}
                    <Link href="/care-grooming" style={{
                      background: '#FFFFFF', border: '1px solid rgba(176,137,104,0.1)',
                      borderRadius: '24px', padding: '24px', textDecoration: 'none', color: '#7F5539',
                      display: 'flex', flexDirection: 'column', gap: '20px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.02)', transition: 'all 0.25s'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.02)'; }}
                    >
                      <div style={{ background: '#F0F5EC', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#587B45' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><path d="M6 9v12" /><path d="M13 6h3a2 2 0 0 1 2 2v3" /><path d="M18 15v6" /><path d="M15 18h6" /></svg>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 600 }}>Grooming</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Care instructions</p>
                      </div>
                    </Link>

                    {/* Find Vets */}
                    <Link href="/my-dog/services" style={{
                      background: '#FFFFFF', border: '1px solid rgba(176,137,104,0.1)',
                      borderRadius: '24px', padding: '24px', textDecoration: 'none', color: '#7F5539',
                      display: 'flex', flexDirection: 'column', gap: '20px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.02)', transition: 'all 0.25s'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.02)'; }}
                    >
                      <div style={{ background: '#F4F4F9', width: '52px', height: '52px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A6C8A' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.25rem', margin: '0 0 4px 0', fontWeight: 600 }}>Find Vets</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Nearby clinics</p>
                      </div>
                    </Link>

                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}