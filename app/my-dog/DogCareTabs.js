"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { breedCards } from "@/app/data/breed";

// ─── BREED LOOKUP FROM breedCards ────────────────────────────────────────────
// Parses size strings like "Large (55-80 lbs)" → { minKg, maxKg }
function parseBreedSize(sizeStr = "") {
  const match = sizeStr.match(/\(([0-9.]+)[–\-]?([0-9.]+)?\s*lbs?\)/i);
  if (!match) return null;
  const minLbs = parseFloat(match[1]);
  const maxLbs = parseFloat(match[2] || match[1]);
  return {
    minKg: +(minLbs * 0.453592).toFixed(1),
    maxKg: +(maxLbs * 0.453592).toFixed(1),
  };
}

const ENERGY_MINUTES = { low: 30, moderate: 45, high: 60 };

// Fast lowercase lookup map: "labrador retriever" → breedCard
const BREED_MAP = Object.fromEntries(
  breedCards.map((b) => [b.name.toLowerCase(), b])
);

function getBreedCard(breedName) {
  if (!breedName) return null;
  return BREED_MAP[breedName.toLowerCase()] || null;
}

// ─── PORTION CALCULATION using dog.weight + dog.age (NRC-based) ──────────────
// RER = 70 × weight_kg^0.75  |  average kibble ≈ 350 kcal/cup
function calcPortionCups(weightKg, ageYears) {
  const w = parseFloat(weightKg);
  if (isNaN(w) || w <= 0) return null;
  const rer = 70 * Math.pow(w, 0.75);
  let multiplier = 1.6;             // adult maintenance
  if (ageYears != null) {
    if (ageYears < 1) multiplier = 3.0;   // puppy
    else if (ageYears >= 8) multiplier = 1.2; // senior
  }
  const cups = (rer * multiplier) / 350;
  return Math.round(cups * 4) / 4;  // nearest 0.25
}

function getLifeStage(age) {
  if (age == null) return "Unknown";
  if (age < 1) return "Puppy";
  if (age >= 8) return "Senior";
  return "Adult";
}

// ─── DYNAMIC CONTENT GENERATORS ─────────────────────────────────────────────
function getMealIdeas(dog, breedCard) {
  const age = dog.age || 0;
  const isPuppy = age < 1;
  const isSenior = age >= 8;
  const size = breedCard?.size?.toLowerCase() || "";

  const ideas = [];
  if (isPuppy) {
    ideas.push({ title: "Puppy Growth Bowl", desc: "High-protein puppy kibble topped with a tablespoon of plain greek yogurt and boiled carrots for healthy growth and digestion." });
    ideas.push({ title: "Brain Booster Mix", desc: "Puppy formula mixed with a sardine (in water, no salt) or salmon oil for Omega-3s to support brain and eye development." });
  } else if (isSenior) {
    ideas.push({ title: "Senior Joint Support", desc: "Senior kibble softened with warm bone broth (onion/garlic free), topped with glucosamine-rich green-lipped mussel powder." });
    ideas.push({ title: "Gentle Digestion Meal", desc: "Easily digestible lean boiled chicken breast, white rice, and a spoonful of plain canned pumpkin (not pie filling)." });
  } else {
    ideas.push({ title: "Active Adult Feast", desc: "Premium adult kibble topped with a boiled egg and some steamed green beans for extra protein and fiber without excess calories." });
    if (size.includes("large") || size.includes("giant")) {
      ideas.push({ title: "Large Breed Joint Care", desc: "Adult kibble formulated for large breeds, mixed with chunks of sweet potato and a dollop of fish oil to support heavy joints." });
    } else if (size.includes("small") || size.includes("toy")) {
      ideas.push({ title: "Small Breed Energy Mix", desc: "Small-bite kibble mixed with finely shredded boiled chicken and a pinch of parsley (great for fresh breath!)." });
    } else {
      ideas.push({ title: "Fresh Mix-in Bowl", desc: "Base kibble mixed with fresh blueberries, a spoonful of dog-safe peanut butter (xylitol-free), and a sprinkle of chia seeds." });
    }
  }
  return ideas;
}

function getDynamicVaccines(dog, breedCard) {
  const age = dog.age || 0;
  const breedName = (dog.breed || "").toLowerCase();
  const highRiskParvo = ["rottweiler", "doberman", "pit bull", "american staffordshire terrier", "german shepherd", "labrador retriever"].some(b => breedName.includes(b));
  const vaccines = [];

  vaccines.push({ id: "rabies", name: "Rabies", months: age < 1 ? 12 : 36, req: true, desc: "Legally required. 1-year booster for puppies, then typically every 3 years." });

  if (age < 1) {
    vaccines.push({ id: "dhpp", name: "DHPP (Puppy Series)", months: 1, req: true, desc: "Given at 6, 8, 12, and 16 weeks to build initial immunity." });
    if (highRiskParvo) {
      vaccines.push({ id: "parvo_extra", name: "Extra Parvo Booster", months: 1, req: true, desc: `Recommended extra booster at 18-20 weeks due to ${breedCard?.name || 'this breed'}'s higher susceptibility.` });
    }
  } else {
    vaccines.push({ id: "dhpp", name: "DHPP Booster", months: 12, req: true, desc: "Annual or 3-year booster for Distemper, Hepatitis, Parainfluenza, and Parvovirus." });
  }

  vaccines.push({ id: "bordetella", name: "Bordetella", months: 6, req: false, desc: "Essential if your dog goes to daycare, boarding, or dog parks." });
  vaccines.push({ id: "lepto", name: "Leptospirosis", months: 12, req: false, desc: "Recommended if your dog hikes, camps, or drinks from puddles/lakes." });
  vaccines.push({ id: "lyme", name: "Lyme Disease", months: 12, req: false, desc: "Crucial if you live in or visit tick-endemic wooded areas." });
  vaccines.push({ id: "influenza", name: "Canine Influenza", months: 12, req: false, desc: "Recommended for highly social dogs in areas with known outbreaks." });

  return vaccines;
}

function getDynamicChecklist(dog, breedCard) {
  const age = dog.age || 0;
  const isPuppy = age < 1;
  const isSenior = age >= 8;
  const groomingLevel = breedCard ? breedCard.grooming.toLowerCase() : "moderate";
  const energyLevel = breedCard ? breedCard.energy.toLowerCase() : "moderate";

  const health = ["Monthly flea & tick prevention", "Monthly heartworm prevention"];
  if (isSenior) {
    health.push("Check for joint stiffness or mobility issues", "Add joint supplements to meal");
  } else if (isPuppy) {
    health.push("Puppy weight check", "Check teething progress");
  } else {
    health.push("Routine body check (lumps, ears, eyes)");
  }

  const grooming = ["Nail trim (every 3-4 weeks)", "Ear cleaning", "Brush teeth (3× this week)"];
  if (groomingLevel === "busy") {
    grooming.unshift("Daily brushing to prevent matting", "Book professional grooming (every 4-6 weeks)");
  } else if (groomingLevel === "moderate") {
    grooming.unshift("Brush coat (2-3 times a week)");
  } else {
    grooming.unshift("Quick weekly brush to remove loose hair");
  }

  const activity = [];
  if (isPuppy) {
    activity.push("Short structured walks (prevent joint stress)", "Socialization outing (new people/sounds)", "Basic obedience training session");
  } else if (energyLevel === "high") {
    activity.push("Vigorous exercise (60+ mins)", "Agility or fetch session", "Mental stimulation (puzzle toys/sniffari)");
  } else if (energyLevel === "moderate") {
    activity.push("Daily walk (45 mins)", "Interactive play session");
  } else {
    activity.push("Leisurely walk (30 mins)", "Light indoor play");
  }

  return { "Health": health, "Grooming": grooming, "Activity": activity };
}

// ─── DATE UTILS ──────────────────────────────────────────────────────────────
const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const fmtDate = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const addMonths = (dateStr, m) => {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + m);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const daysUntil = (dateStr) => {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
};
const monthKey = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`; };
const monthLabel = () => new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

function vaccStatus(lastGiven, months) {
  if (!lastGiven) return { label: "Not logged", color: "#999", bg: "#F5F5F5" };
  const next = addMonths(lastGiven, months);
  const d = daysUntil(next);
  if (d < 0) return { label: `Overdue ${Math.abs(d)}d`, color: "#b85c5c", bg: "#FFF0F0", next };
  if (d <= 30) return { label: `Due in ${d}d`, color: "#B08968", bg: "#FFF6ED", next };
  return { label: `Due ${fmtDate(next)}`, color: "#A3B18A", bg: "#F0F5EC", next };
}

// ─── BROWSER PUSH NOTIFICATIONS ──────────────────────────────────────────────
async function requestNotifPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission !== "default") return Notification.permission;
  return await Notification.requestPermission();
}

function scheduleReminder(item, titleStr) {
  if (typeof window === "undefined") return null;
  if (!("Notification" in window) || Notification.permission !== "granted") return null;
  if (!item.time) return null;
  const [h, m] = item.time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;

  const fire = new Date();
  fire.setHours(h, m, 0, 0);
  if (fire <= new Date()) fire.setDate(fire.getDate() + 1);
  const delay = fire.getTime() - Date.now();

  return setTimeout(() => {
    new Notification(titleStr, {
      body: `${item.label} — ${item.time}`,
      icon: "/favicon.ico",
      tag: `rem-${item.id || item.label}`,
    });
  }, delay);
}

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "feeding", label: "Feeding" },
  { id: "vaccinations", label: "Vaccinations" },
  { id: "checklist", label: "Checklist" },
];

// ══════════════════════════════════════════════════════════════════
// FEEDING TAB
// ══════════════════════════════════════════════════════════════════
function FeedingTab({ dog, onUpdate, notifPerm, handleEnableNotif }) {
  const breedCard = getBreedCard(dog.breed);
  const breedSize = breedCard ? parseBreedSize(breedCard.size) : null;
  const exMins = breedCard ? (ENERGY_MINUTES[breedCard.energy] || 45) : null;
  const lifeStage = getLifeStage(dog.age);
  const autoCups = calcPortionCups(dog.weight, dog.age);
  const kcalPerDay = autoCups ? Math.round(autoCups * 350) : null;

  const meals = dog.meals || [];

  const [overrideVal, setOverrideVal] = useState(dog.portion_override ?? "");
  const [editingOverride, setEditingOverride] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const effectiveCups = dog.portion_override != null ? dog.portion_override : autoCups;
  const perMealCups = meals.length && effectiveCups
    ? Math.round((effectiveCups / meals.length) * 4) / 4
    : null;

  const updateMealField = async (idx, field, value) => {
    setErrorMsg("");
    const updated = meals.map((m, i) => i === idx ? { ...m, [field]: value } : m);
    const { error } = await supabase.from("dogs").update({ meals: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, meals: updated });
    else setErrorMsg("Failed to update meal: " + error.message);
  };

  const addMeal = async () => {
    setErrorMsg("");
    const newMeal = { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: `Meal ${meals.length + 1}`, time: "08:00", reminder: false };
    const updated = [...meals, newMeal];
    const { error } = await supabase.from("dogs").update({ meals: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, meals: updated });
    else setErrorMsg("Failed to add meal: " + error.message);
  };

  const removeMeal = async (idx) => {
    if (!window.confirm("Remove this meal?")) return;
    setErrorMsg("");
    const updated = meals.filter((_, i) => i !== idx);
    const { error } = await supabase.from("dogs").update({ meals: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, meals: updated });
    else setErrorMsg("Failed to remove meal: " + error.message);
  };

  const generateSchedule = async () => {
    setErrorMsg("");
    let newMeals = [];
    
    // Determine age in months (defaulting to adult if missing)
    const ageYrs = dog.age != null ? dog.age : 3;
    const ageMonths = ageYrs * 12;
    
    // Determine breed size modifiers
    const isToy = breedSize?.maxKg <= 5;
    const isLarge = breedSize?.maxKg >= 25;

    // Calculate required number of core meals based on medical guidelines
    let numMeals = 2; // Default for healthy adults
    if (ageMonths < 3) { // 6 to 12 weeks
      numMeals = isToy ? 5 : 4;
    } else if (ageMonths < 6) { // 3 to 6 months
      numMeals = isToy ? 4 : 3;
    } else if (ageMonths < 12) { // 6 to 12 months
      numMeals = isToy || isLarge ? 3 : 2; // Toy breeds risk hypoglycemia, large breeds need slow growth
    }

    // Build the core meal schedule
    if (numMeals === 2) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Breakfast", time: "07:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Dinner", time: "18:30", reminder: false });
    } else if (numMeals === 3) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Breakfast", time: "07:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Lunch", time: "13:00", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Dinner", time: "18:30", reminder: false });
    } else if (numMeals === 4) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Morning Meal", time: "07:00", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Mid-Day Meal", time: "11:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Afternoon Meal", time: "15:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Evening Meal", time: "19:30", reminder: false });
    } else if (numMeals >= 5) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Early Morning", time: "06:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Late Morning", time: "10:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Mid-Day", time: "14:00", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Late Afternoon", time: "17:30", reminder: false });
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Evening", time: "20:30", reminder: false });
    }

    // Incorporate daily snacks and treats based on lifestyle/age
    if (ageYrs < 1) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Training Treats", time: "16:00", reminder: false });
    } else if (exMins >= 60) {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Post-Exercise Snack", time: "15:00", reminder: false });
    } else {
      newMeals.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Daily Dental Chew", time: "20:00", reminder: false });
    }

    // Sort chronologically
    newMeals.sort((a, b) => a.time.localeCompare(b.time));

    const { error } = await supabase.from("dogs").update({ meals: newMeals }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, meals: newMeals });
    else setErrorMsg("Failed to generate schedule: " + error.message);
  };

  const saveOverride = async () => {
    setErrorMsg("");
    const val = parseFloat(overrideVal);
    if (isNaN(val) || val <= 0 || val > 30) {
      setErrorMsg("Please enter a valid portion (0.25 – 30 cups).");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("dogs").update({ portion_override: val }).eq("id", dog.id);
    setSaving(false);
    if (!error) { onUpdate({ ...dog, portion_override: val }); setEditingOverride(false); }
    else setErrorMsg("Failed to save: " + error.message);
  };

  const resetToAuto = async () => {
    setErrorMsg("");
    setSaving(true);
    const { error } = await supabase.from("dogs").update({ portion_override: null }).eq("id", dog.id);
    setSaving(false);
    if (!error) {
      setOverrideVal("");
      setEditingOverride(false);
      onUpdate({ ...dog, portion_override: null });
    } else setErrorMsg("Failed to reset: " + error.message);
  };

  const mealIdeas = getMealIdeas(dog, breedCard);

  return (
    <div className="dct-content">
      {errorMsg && (
        <div className="dct-notif-banner dct-notif-warn" style={{ marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {/* ── Dog data summary ── */}
      <div className="dct-dog-summary">
        {dog.weight != null && (
          <div className="dct-summary-item">
            <span className="dct-slabel">Weight</span>
            <strong>{dog.weight} kg</strong>
          </div>
        )}
        {dog.age != null && (
          <div className="dct-summary-item">
            <span className="dct-slabel">Age</span>
            <strong>{dog.age} yr{dog.age !== 1 ? "s" : ""}</strong>
          </div>
        )}
        <div className="dct-summary-item">
          <span className="dct-slabel">Life Stage</span>
          <strong style={{
            color: lifeStage === "Senior" ? "#b85c5c"
              : lifeStage === "Puppy" ? "#587B45"
                : "#7F5539"
          }}>{lifeStage}</strong>
        </div>
        {breedSize && (
          <div className="dct-summary-item">
            <span className="dct-slabel">Breed Range</span>
            <strong>{breedSize.minKg}–{breedSize.maxKg} kg</strong>
          </div>
        )}
        {exMins && (
          <div className="dct-summary-item">
            <span className="dct-slabel">Exercise</span>
            <strong>{exMins} min/day</strong>
          </div>
        )}
      </div>

      {/* ── Portion hero ── */}
      <div className="dct-portion-hero">
        <div style={{ flex: 1 }}>
          <div className="dct-sec-title" style={{ marginBottom: 3 }}>Daily Food Portion</div>
          <p className="dct-sub">
            {dog.weight != null
              ? `Calculated from ${dog.name}'s weight (${dog.weight} kg)${dog.age != null ? ` & age (${dog.age} yrs)` : ""}.`
              : "Please enter your dog's weight in their profile to get an exact calculation."}
          </p>
          {dog.portion_override != null && (
            <span className="dct-override-badge">✏️ Custom amount active</span>
          )}
      
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {!editingOverride ? (
            <>
              <div className="dct-portion-num">
                {effectiveCups ?? "—"}
              </div>
              <div className="dct-sub">cups / day</div>
              {effectiveCups && (
                <div className="dct-sub" style={{ fontSize: "0.7rem", marginTop: 2, color: "#AAA" }}>
                  (~{Math.round(effectiveCups * 350)} kcal)
                </div>
              )}
              <div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 8 }}>
                <button className="dct-ghost-btn" onClick={() => { setOverrideVal(effectiveCups ?? ""); setEditingOverride(true); }}>
                  Override
                </button>
                {dog.portion_override != null && (
                  <button className="dct-ghost-btn" style={{ color: "#b85c5c" }} onClick={resetToAuto}>
                    Reset
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="30"
                  value={overrideVal}
                  onChange={(e) => setOverrideVal(e.target.value)}
                  className="dct-override-input"
                  placeholder={autoCups ?? ""}
                  autoFocus
                />
                <span className="dct-sub">cups</span>
              </div>
              {autoCups && (
                <p className="dct-sub" style={{ fontSize: "0.7rem" }}>
                  Suggested: {autoCups} cups
                </p>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button className="dct-btn-main" onClick={saveOverride} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
                <button className="dct-ghost-btn" onClick={() => setEditingOverride(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Notification banner ── */}
      {notifPerm === "default" && (
        <div className="dct-notif-banner dct-notif-cta">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Enable notifications to get meal-time reminders</span>
          </div>
          <button className="dct-btn-main" style={{ padding: "7px 14px", fontSize: "0.78rem" }} onClick={handleEnableNotif}>
            Enable
          </button>
        </div>
      )}
      {notifPerm === "denied" && (
        <div className="dct-notif-banner dct-notif-warn">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
            <span>Notifications blocked — allow them in browser settings</span>
          </div>
        </div>
      )}
      {notifPerm === "granted" && meals.some(m => m.reminder) && (
        <div className="dct-notif-banner dct-notif-ok">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Reminders active — you'll be notified at meal times</span>
          </div>
        </div>
      )}
      {notifPerm === "unsupported" && (
        <div className="dct-notif-banner dct-notif-warn">
          ⚠️ Your browser doesn't support push notifications
        </div>
      )}

      {/* ── Meal schedule ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "18px 0 10px", flexWrap: "wrap", gap: 10 }}>
        <div className="dct-sec-title">Meal Schedule</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {perMealCups && (
            <span className="dct-sub">{perMealCups} cups per meal</span>
          )}
          <button className="dct-ghost-btn" onClick={addMeal} style={{ background: "#F0F5EC", color: "#587B45", padding: "4px 10px", borderRadius: "8px" }}>
            + Add Meal
          </button>
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="dct-empty">
          <div style={{ marginBottom: 12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D3D3D3" strokeWidth="1.5"><path d="M3 2v7c0 2.2 1.8 4 4 4h0c2.2 0 4-1.8 4-4V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </div>
          <p style={{ fontWeight: 600, color: "#888", margin: 0 }}>No meals set up yet</p>
          <p className="dct-sub" style={{ marginTop: 4 }}>
            Generate a personalized schedule or add a custom meal.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button className="dct-btn-main" onClick={generateSchedule}>
              Generate Schedule
            </button>
            <button className="dct-ghost-btn" onClick={addMeal} style={{ background: "#F0F5EC", color: "#587B45" }}>
              + Custom
            </button>
          </div>
        </div>
      ) : (
        meals.map((m, i) => (
          <div key={m.id || i} className="dct-meal-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: "4px", height: "40px", background: "#B08968", borderRadius: "4px", flexShrink: 0 }}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  type="text"
                  defaultValue={m.label}
                  onBlur={(e) => {
                    if (e.target.value !== m.label) updateMealField(i, "label", e.target.value);
                  }}
                  className="dct-label-input"
                  placeholder="Meal Name"
                />
                <input
                  type="time"
                  defaultValue={m.time}
                  onBlur={(e) => {
                    if (e.target.value !== m.time) updateMealField(i, "time", e.target.value);
                  }}
                  className="dct-time-input"
                />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div className="dct-toggle-label">Reminder</div>
                <label className="dct-toggle">
                  <input
                    type="checkbox"
                    checked={!!m.reminder}
                    onChange={(e) => updateMealField(i, "reminder", e.target.checked)}
                    disabled={notifPerm === "denied" || notifPerm === "unsupported"}
                  />
                  <span className="dct-toggle-track" />
                </label>
              </div>
              <button
                className="dct-ghost-btn"
                style={{ padding: "4px", color: "#b85c5c", fontSize: "1.1rem" }}
                onClick={() => removeMeal(i)}
                title="Remove Meal"
              >
                ×
              </button>
            </div>
          </div>
        ))
      )}

      {/* ── Meal Ideas & Recipes ── */}
      <div style={{ margin: "24px 0 10px" }}>
        <div className="dct-sec-title" style={{ marginBottom: 12 }}>Personalized Meal Ideas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mealIdeas.map((idea, idx) => (
            <div key={idx} className="dct-tip">
              <div style={{ fontWeight: 600, color: "#7F5539", marginBottom: 4, fontSize: "0.86rem" }}>
                {idea.title}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#666", lineHeight: 1.5, margin: 0 }}>
                {idea.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// VACCINATIONS TAB
// ══════════════════════════════════════════════════════════════════
function VaccinationsTab({ dog, onUpdate }) {
  const vaccinations = dog.vaccinations || {};
  const breedCard = getBreedCard(dog.breed);
  const VACCINES = getDynamicVaccines(dog, breedCard);
  const [openForm, setOpenForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sorted = [...VACCINES].sort((a, b) => {
    const rank = (v) => {
      const s = vaccStatus(vaccinations[v.id]?.lastGiven, v.months);
      if (s.label.startsWith("Overdue")) return 0;
      if (s.label.startsWith("Due in")) return 1;
      if (s.label === "Not logged") return 3;
      return 2;
    };
    return rank(a) - rank(b);
  });

  const overdueCnt = sorted.filter(v => vaccStatus(vaccinations[v.id]?.lastGiven, v.months).label.startsWith("Overdue")).length;
  const dueSoonCnt = sorted.filter(v => vaccStatus(vaccinations[v.id]?.lastGiven, v.months).label.startsWith("Due in")).length;

  const logVacc = async (vaccId) => {
    setErrorMsg("");
    const date = formData[`${vaccId}_date`] || "";
    const notes = (formData[`${vaccId}_notes`] || "").trim();
    if (!date) { setErrors(e => ({ ...e, [vaccId]: "Date is required." })); return; }
    if (date > todayStr()) { setErrors(e => ({ ...e, [vaccId]: "Date cannot be in the future." })); return; }
    setErrors(e => ({ ...e, [vaccId]: null }));
    setSaving(true);
    const updated = { ...vaccinations, [vaccId]: { lastGiven: date, notes } };
    const { error } = await supabase.from("dogs").update({ vaccinations: updated }).eq("id", dog.id);
    setSaving(false);
    if (!error) {
      onUpdate({ ...dog, vaccinations: updated });
      setOpenForm(null);
    } else setErrorMsg("Failed to save: " + error.message);
  };

  const deleteVacc = async (vaccId) => {
    if (!window.confirm("Remove this vaccination record?")) return;
    setErrorMsg("");
    setSaving(true);
    const updated = { ...vaccinations };
    delete updated[vaccId];
    const { error } = await supabase.from("dogs").update({ vaccinations: updated }).eq("id", dog.id);
    setSaving(false);
    if (!error) {
      onUpdate({ ...dog, vaccinations: updated });
      setOpenForm(null);
    } else setErrorMsg("Failed to delete: " + error.message);
  };

  return (
    <div className="dct-content">
      <div className="dct-sec-title" style={{ marginBottom: 12 }}>Vaccination Calendar</div>

      {errorMsg && (
        <div className="dct-notif-banner dct-notif-warn" style={{ marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {/* Status strip */}
      <div className="dct-vacc-summary">
        {overdueCnt > 0 && <span style={{ color: "#b85c5c", display: "flex", alignItems: "center", gap: 6 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{overdueCnt} overdue</span>}
        {dueSoonCnt > 0 && <span style={{ color: "#B08968", display: "flex", alignItems: "center", gap: 6 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>{dueSoonCnt} due soon</span>}
        {overdueCnt === 0 && dueSoonCnt === 0 && (
          <span style={{ color: "#587B45", display: "flex", alignItems: "center", gap: 6 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>All vaccinations up to date</span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {sorted.map((v) => {
          const vacc = vaccinations[v.id] || {};
          const st = vaccStatus(vacc.lastGiven, v.months);
          const isOpen = openForm === v.id;

          return (
            <div key={v.id}>
              <div className="dct-vacc-card" style={{ background: st.bg, borderColor: st.color + "44" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{v.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      {v.name}
                      {v.req && <span className="dct-core-badge">Core</span>}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#888", marginTop: 2 }}>
                      {vacc.lastGiven ? `Last: ${fmtDate(vacc.lastGiven)}` : "Never logged"} · Every {v.months} mo
                    </div>
                    {st.next && (
                      <div style={{ fontSize: "0.72rem", color: st.color, marginTop: 2, fontWeight: 500 }}>
                        Next due: {fmtDate(st.next)}
                      </div>
                    )}
                    <div style={{ fontSize: "0.71rem", color: "#666", marginTop: 4, lineHeight: 1.4 }}>
                      {v.desc}
                    </div>
                    {vacc.notes && (
                      <div style={{ fontSize: "0.71rem", color: "#999", fontStyle: "italic", marginTop: 2 }}>
                        {vacc.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span className="dct-vacc-badge" style={{ color: st.color, background: st.color + "18" }}>
                    {st.label}
                  </span>
                  <button
                    className="dct-ghost-btn"
                    onClick={() => {
                      if (isOpen) { setOpenForm(null); return; }
                      setOpenForm(v.id);
                      setFormData(f => ({
                        ...f,
                        [`${v.id}_date`]: vacc.lastGiven || "",
                        [`${v.id}_notes`]: vacc.notes || "",
                      }));
                    }}
                  >
                    {isOpen ? "Close" : "Log"}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="dct-vacc-form">
                  <div className="dct-vacc-form-grid">
                    <div className="dct-field">
                      <label>Date Given *</label>
                      <input
                        type="date"
                        max={todayStr()}
                        value={formData[`${v.id}_date`] || ""}
                        onChange={e => setFormData(f => ({ ...f, [`${v.id}_date`]: e.target.value }))}
                      />
                      {errors[v.id] && <span className="dct-field-error">{errors[v.id]}</span>}
                    </div>
                    <div className="dct-field">
                      <label>Notes (optional)</label>
                      <input
                        type="text"
                        placeholder="Clinic name, batch no., vet name…"
                        value={formData[`${v.id}_notes`] || ""}
                        onChange={e => setFormData(f => ({ ...f, [`${v.id}_notes`]: e.target.value }))}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                      <button className="dct-btn-main" style={{ flex: 1 }} onClick={() => logVacc(v.id)} disabled={saving}>
                        {saving ? "Saving…" : "Save"}
                      </button>
                      {vacc.lastGiven && (
                        <button className="dct-ghost-btn" style={{ padding: "10px", color: "#b85c5c", background: "#FFF0F0", borderRadius: "12px" }} onClick={() => deleteVacc(v.id)} disabled={saving} title="Delete Record">
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CHECKLIST TAB
// ══════════════════════════════════════════════════════════════════
function ChecklistTab({ dog, onUpdate, notifPerm, handleEnableNotif }) {
  const mk = monthKey();
  const checks = (dog.checklist || {})[mk] || {};
  const routines = (dog.checklist || {}).daily_routine || [];
  const breedCard = getBreedCard(dog.breed);
  const CHECKLIST_ITEMS = getDynamicChecklist(dog, breedCard);
  const all = Object.values(CHECKLIST_ITEMS).flat();
  const makeKey = (str) => "chk_" + str.replace(/[^a-zA-Z0-9]/g, "").substring(0, 15);
  const done = all.filter(item => checks[makeKey(item)]).length;
  const total = all.length;
  const pct = Math.round((done / total) * 100);

  const [errorMsg, setErrorMsg] = useState("");

  const generateRoutine = async () => {
    setErrorMsg("");
    const energy = breedCard ? breedCard.energy.toLowerCase() : "moderate";
    const newRoutines = [];
    
    if (energy === "high") {
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Morning Run", time: "06:30", reminder: false });
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Agility/Play Session", time: "14:00", reminder: false });
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Evening Walk", time: "19:00", reminder: false });
    } else if (energy === "moderate") {
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Morning Walk", time: "07:30", reminder: false });
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Evening Walk", time: "18:30", reminder: false });
    } else {
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Daily Leisure Walk", time: "08:00", reminder: false });
      newRoutines.push({ id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "Light Play", time: "17:00", reminder: false });
    }

    const updated = { ...(dog.checklist || {}), daily_routine: newRoutines };
    const { error } = await supabase.from("dogs").update({ checklist: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, checklist: updated });
    else setErrorMsg("Failed to generate routine.");
  };

  const updateRoutine = async (idx, field, value) => {
    setErrorMsg("");
    const updatedRoutines = routines.map((r, i) => i === idx ? { ...r, [field]: value } : r);
    const updated = { ...(dog.checklist || {}), daily_routine: updatedRoutines };
    const { error } = await supabase.from("dogs").update({ checklist: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, checklist: updated });
    else setErrorMsg("Failed to update routine.");
  };

  const removeRoutine = async (idx) => {
    if (!window.confirm("Remove this routine?")) return;
    setErrorMsg("");
    const updatedRoutines = routines.filter((_, i) => i !== idx);
    const updated = { ...(dog.checklist || {}), daily_routine: updatedRoutines };
    const { error } = await supabase.from("dogs").update({ checklist: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, checklist: updated });
    else setErrorMsg("Failed to remove routine.");
  };

  const addRoutine = async () => {
    setErrorMsg("");
    const newRoutines = [...routines, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), label: "New Activity", time: "12:00", reminder: false }];
    const updated = { ...(dog.checklist || {}), daily_routine: newRoutines };
    const { error } = await supabase.from("dogs").update({ checklist: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, checklist: updated });
    else setErrorMsg("Failed to add routine.");
  };

  const toggle = async (key) => {
    setErrorMsg("");
    const newValue = !checks[key];
    const updatedChecks = { ...checks, [key]: newValue };
    const updated = { ...(dog.checklist || {}), [mk]: updatedChecks };

    // Optimistic update
    onUpdate({ ...dog, checklist: updated });

    const { error } = await supabase.from("dogs").update({ checklist: updated }).eq("id", dog.id);
    if (error) {
      setErrorMsg("Failed to update checklist.");
      onUpdate(dog); // Revert
    }
  };

  return (
    <div className="dct-content">
      {/* ── Notification banner for Checklist ── */}
      {notifPerm === "default" && (
        <div className="dct-notif-banner dct-notif-cta" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>Enable notifications for activity reminders</span>
          </div>
          <button className="dct-btn-main" style={{ padding: "7px 14px", fontSize: "0.78rem" }} onClick={handleEnableNotif}>
            Enable
          </button>
        </div>
      )}

      {/* ── Daily Routine ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div className="dct-sec-title">Daily Routine</div>
        <button className="dct-ghost-btn" onClick={addRoutine} style={{ background: "#F0F5EC", color: "#587B45", padding: "4px 10px", borderRadius: "8px" }}>
          + Add Activity
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="dct-empty" style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D3D3D3" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <p style={{ fontWeight: 600, color: "#888", margin: 0 }}>No daily routine set up yet</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
            <button className="dct-btn-main" onClick={generateRoutine}>
              Generate Schedule
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 24 }}>
          {routines.map((r, i) => (
            <div key={r.id || i} className="dct-meal-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: "4px", height: "40px", background: "#A3B18A", borderRadius: "4px", flexShrink: 0 }}></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <input
                    type="text"
                    defaultValue={r.label}
                    onBlur={(e) => {
                      if (e.target.value !== r.label) updateRoutine(i, "label", e.target.value);
                    }}
                    className="dct-label-input"
                    placeholder="Activity"
                  />
                  <input
                    type="time"
                    defaultValue={r.time}
                    onBlur={(e) => {
                      if (e.target.value !== r.time) updateRoutine(i, "time", e.target.value);
                    }}
                    className="dct-time-input"
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="dct-toggle-label">Reminder</div>
                  <label className="dct-toggle">
                    <input
                      type="checkbox"
                      checked={!!r.reminder}
                      onChange={(e) => updateRoutine(i, "reminder", e.target.checked)}
                      disabled={notifPerm === "denied" || notifPerm === "unsupported"}
                    />
                    <span className="dct-toggle-track" />
                  </label>
                </div>
                <button 
                  className="dct-ghost-btn" 
                  style={{ padding: "4px", color: "#b85c5c", fontSize: "1.1rem" }} 
                  onClick={() => removeRoutine(i)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Monthly Checklist ── */}
      <div className="dct-checklist-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="dct-sec-title" style={{ marginBottom: 0 }}>
            Care Checklist — {monthLabel()}
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.88rem", color: pct === 100 ? "#587B45" : "#B08968" }}>
            {pct === 100 ? "🎉 Done!" : `${done}/${total}`}
          </span>
        </div>
        <div className="dct-progress-track">
          <div className="dct-progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "#A3B18A" : "#B08968" }} />
        </div>
        {pct > 0 && pct < 100 && (
          <p className="dct-sub" style={{ marginTop: 6 }}>{total - done} item{total - done !== 1 ? "s" : ""} remaining this month</p>
        )}
      </div>

      {errorMsg && (
        <div className="dct-notif-banner dct-notif-warn" style={{ marginBottom: 16 }}>
          {errorMsg}
        </div>
      )}

      {Object.entries(CHECKLIST_ITEMS).map(([cat, items]) => {
        const catItems = items.map((item) => {
          const key = makeKey(item);
          const checked = !!checks[key];
          return { item, key, checked };
        });
        const catDone = catItems.filter(c => c.checked).length;

        return (
          <div key={cat} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div className="dct-cat-label">{cat}</div>
              <span style={{ fontSize: "0.7rem", color: "#AAA" }}>{catDone}/{catItems.length}</span>
            </div>
            <div className="dct-check-group">
              {catItems.map(({ item, key, checked }) => (
                <div key={key} className="dct-check-item" onClick={() => toggle(key)}>
                  <div className={`dct-checkbox${checked ? " done" : ""}`}>{checked ? "✓" : ""}</div>
                  <span className={`dct-check-label${checked ? " done" : ""}`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {pct === 100 && (
        <div className="dct-tip" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>🐾</div>
          <p style={{ fontWeight: 600, color: "#7F5539", margin: 0 }}>
            {dog.name}'s care is complete for {monthLabel()}!
          </p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════
const STYLES = `
  .dct-wrapper { margin-top: 24px; font-family: 'DM Sans', sans-serif; }

  .dct-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .dct-tab {
    padding: 9px 18px; border-radius: 11px; font-size: 0.82rem; font-weight: 500;
    cursor: pointer; border: 1.5px solid transparent; background: #FAF7F2;
    color: #777; font-family: 'DM Sans', sans-serif; transition: all 0.22s;
  }
  .dct-tab:hover { border-color: #B08968; color: #7F5539; }
  .dct-tab.active { background: #7F5539; color: white; border-color: #7F5539; }

  .dct-content { display: flex; flex-direction: column; }
  .dct-sec-title { font-family: 'Fraunces', serif; font-size: 1rem; color: #7F5539; margin: 0; }
  .dct-sub { font-size: 0.78rem; color: #888; margin: 0; }

  /* dog summary strip */
  .dct-dog-summary {
    display: flex; gap: 8px; flex-wrap: wrap; background: #FFFFFF;
    border-radius: 16px; padding: 13px 18px; margin-bottom: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
  }
  .dct-summary-item { display: flex; flex-direction: column; gap: 2px; min-width: 72px; flex: 1; }
  .dct-slabel { font-size: 0.67rem; text-transform: uppercase; letter-spacing: 0.5px; color: #BBB; font-weight: 600; }
  .dct-summary-item strong { font-size: 0.9rem; color: #3E3E3E; }

  /* portion hero */
  .dct-portion-hero {
    background: #FFFFFF; border-radius: 18px; padding: 18px 22px;
    margin-bottom: 14px; display: flex; justify-content: space-between;
    align-items: flex-start; gap: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); 
    border: 1px solid rgba(0,0,0,0.04);
  }
  .dct-portion-num {
    font-family: 'Fraunces', serif; font-size: 2.8rem;
    color: #7F5539; font-weight: 600; line-height: 1;
  }
  .dct-override-badge {
    display: inline-block; margin-top: 6px; padding: 2px 10px; border-radius: 7px;
    font-size: 0.7rem; background: #FFF6ED; color: #B08968;
    border: 1px solid #B0896833; font-weight: 500;
  }
  .dct-auto-badge {
    display: inline-block; margin-top: 6px; padding: 2px 10px; border-radius: 7px;
    font-size: 0.7rem; background: #F0F5EC; color: #587B45;
    border: 1px solid #A3B18A44; font-weight: 500;
  }
  .dct-override-input {
    width: 80px; padding: 8px 10px; border-radius: 10px;
    border: 1.5px solid #B08968; font-family: 'DM Sans', sans-serif;
    font-size: 1rem; color: #3E3E3E; background: white;
    outline: none; text-align: center;
  }

  /* notification banner */
  .dct-notif-banner {
    border-radius: 13px; padding: 11px 16px; font-size: 0.82rem;
    margin-bottom: 14px; display: flex; justify-content: space-between;
    align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .dct-notif-cta  { background: #FFF6ED; color: #7F5539; border: 1px solid #B0896833; }
  .dct-notif-warn { background: #FFF0F0; color: #b85c5c; border: 1px solid #b85c5c33; }
  .dct-notif-ok   { background: #F0F5EC; color: #587B45; border: 1px solid #A3B18A44; }

  /* meal cards */
  .dct-meal-card {
    background: #FFFFFF; border-radius: 16px; padding: 14px 20px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 10px; gap: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); 
    border: 1px solid rgba(0,0,0,0.04);
  }
  .dct-time-input {
    border: none; background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem; color: #888; cursor: pointer; padding: 0;
    margin-top: 3px; outline: none;
  }
  .dct-label-input {
    border: none; background: transparent; font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; font-weight: 600; color: #3E3E3E; padding: 0; outline: none;
    width: 140px; margin-bottom: 2px;
  }
  .dct-label-input:focus {
    border-bottom: 1.5px solid #B08968;
  }
  .dct-cups-badge { font-size: 0.86rem; color: #B08968; font-weight: 600; }
  .dct-toggle-label { font-size: 0.67rem; color: #AAA; margin-bottom: 4px; text-align: center; }
  .dct-toggle { position: relative; display: inline-block; width: 42px; height: 23px; }
  .dct-toggle input { opacity: 0; width: 0; height: 0; }
  .dct-toggle-track {
    position: absolute; inset: 0; border-radius: 23px;
    background: #DDD; cursor: pointer; transition: 0.3s;
  }
  .dct-toggle input:checked + .dct-toggle-track { background: #A3B18A; }
  .dct-toggle input:disabled + .dct-toggle-track { opacity: 0.4; cursor: not-allowed; }
  .dct-toggle-track::after {
    content: ''; position: absolute; width: 17px; height: 17px; border-radius: 50%;
    background: white; left: 3px; top: 3px; transition: 0.3s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .dct-toggle input:checked + .dct-toggle-track::after { transform: translateX(19px); }

  /* tip */
  .dct-tip {
    background: #FFF9F4; border-radius: 14px; padding: 14px 18px;
    border: 1px solid rgba(176,137,104,0.12);
  }

  /* empty */
  .dct-empty {
    text-align: center; padding: 28px 20px; color: #AAA;
    background: #FAF7F2; border-radius: 16px;
  }

  /* vaccinations */
  .dct-vacc-summary {
    background: #FFFFFF; border-radius: 12px; padding: 10px 16px;
    font-size: 0.82rem; font-weight: 600; display: flex; gap: 16px;
    flex-wrap: wrap; box-shadow: 0 2px 12px rgba(0,0,0,0.03); 
    border: 1px solid rgba(0,0,0,0.04);
  }
  .dct-vacc-card {
    padding: 13px 18px; border-radius: 15px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px; border: 1.5px solid;
  }
  .dct-core-badge {
    font-size: 0.64rem; background: #EEE; padding: 2px 7px;
    border-radius: 5px; color: #888;
  }
  .dct-vacc-badge {
    padding: 4px 11px; border-radius: 7px; font-size: 0.72rem;
    font-weight: 600; white-space: nowrap;
  }
  .dct-vacc-form {
    background: white; border: 1.5px solid #B08968; border-top: none;
    border-radius: 0 0 14px 14px; padding: 14px 18px;
  }
  .dct-vacc-form-grid {
    display: grid; grid-template-columns: 1fr 2fr auto;
    gap: 12px; align-items: flex-end;
  }

  /* fields */
  .dct-field { display: flex; flex-direction: column; gap: 5px; }
  .dct-field label {
    font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;
    color: #888; font-weight: 500;
  }
  .dct-field input {
    padding: 10px 14px; border-radius: 11px;
    border: 1.5px solid rgba(176,137,104,0.2); font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; color: #3E3E3E; background: #FAF7F2;
    outline: none; transition: border-color 0.2s; width: 100%;
  }
  .dct-field input:focus { border-color: #B08968; }
  .dct-field-error { font-size: 0.72rem; color: #b85c5c; }

  /* buttons */
  .dct-btn-main {
    padding: 10px 20px; border-radius: 12px; background: #7F5539; color: white;
    border: none; font-weight: 500; cursor: pointer; font-size: 0.86rem;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s; white-space: nowrap;
  }
  .dct-btn-main:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(127,85,57,0.2); }
  .dct-btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
  .dct-ghost-btn {
    background: transparent; border: none; cursor: pointer; color: #B08968;
    font-size: 0.8rem; padding: 6px 10px; font-family: 'DM Sans', sans-serif;
    transition: color 0.2s; white-space: nowrap;
  }
  .dct-ghost-btn:hover { color: #7F5539; }

  /* checklist */
  .dct-checklist-header {
    background: #FFFFFF; border-radius: 18px; padding: 18px 22px; margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04);
  }
  .dct-progress-track { height: 8px; background: #EFE7DB; border-radius: 10px; }
  .dct-progress-fill  { height: 100%; border-radius: 10px; transition: width 0.6s ease; }
  .dct-cat-label {
    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px;
    color: #B08968; font-weight: 700;
  }
  .dct-check-group { background: #FAF7F2; border-radius: 16px; padding: 4px 18px; }
  .dct-check-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 0;
    border-bottom: 1px solid rgba(0,0,0,0.04); cursor: pointer; user-select: none;
  }
  .dct-check-item:last-child { border: none; }
  .dct-check-item:hover .dct-checkbox { border-color: #A3B18A; }
  .dct-checkbox {
    width: 19px; height: 19px; border-radius: 5px; border: 2px solid #B08968;
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: white; transition: all 0.18s;
  }
  .dct-checkbox.done { background: #A3B18A; border-color: #A3B18A; }
  .dct-check-label { font-size: 0.86rem; color: #3E3E3E; transition: all 0.18s; }
  .dct-check-label.done { text-decoration: line-through; color: #BBB; }

  @media (max-width: 640px) {
    .dct-vacc-form-grid { grid-template-columns: 1fr !important; }
    .dct-portion-hero   { flex-direction: column; }
    .dct-dog-summary    { gap: 6px; }
  }
`;

// ══════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════════
/**
 * DogCareTabs — production-ready tabbed component for Breedly
 *
 * Props:
 *   dog      {object}   — active dog row from Supabase
 *   onUpdate {function} — callback(updatedDog) after any write
 *
 * Required columns on `dogs` table (add via Supabase dashboard if missing):
 *   weight           numeric   — dog's current weight in kg
 *   age              numeric   — dog's age in years
 *   breed            text      — must match a breedCards[].name exactly
 *   meals            jsonb     — array of { id, label, time, reminder }
 *   vaccinations     jsonb     — { [vaccId]: { lastGiven: "YYYY-MM-DD", notes: "" } }
 *   checklist        jsonb     — { [monthKey]: { [itemKey]: boolean } }
 *   portion_override numeric   — nullable, user-set cups/day override
 *
 * Drop into my-dog.jsx:
 *   import DogCareTabs from "./DogCareTabs";
 *   ...
 *   <DogCareTabs
 *     dog={activeDog}
 *     onUpdate={(updated) => setDogs(dogs.map(d => d.id === updated.id ? updated : d))}
 *   />
 */
export default function DogCareTabs({ dog, onUpdate }) {
  const [activeTab, setActiveTab] = useState(null);
  const [notifPerm, setNotifPerm] = useState("unsupported");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    }
  }, []);

  const handleEnableNotif = async () => {
    const perm = await requestNotifPermission();
    setNotifPerm(perm);
  };

  useEffect(() => {
    if (notifPerm !== "granted" || !dog) return;
    const map = {};
    
    // Schedule Meals
    const meals = dog.meals || [];
    meals.forEach((m, i) => {
      if (m.reminder) {
        const timerId = scheduleReminder(m, `🍽️ Time to feed ${dog.name}!`);
        if (timerId != null) map[m.id || `meal_${i}`] = timerId;
      }
    });

    // Schedule Daily Routines
    const routines = (dog.checklist || {}).daily_routine || [];
    routines.forEach((r, i) => {
      if (r.reminder) {
        const timerId = scheduleReminder(r, `Activity Time for ${dog.name}!`);
        if (timerId != null) map[r.id || `rtn_${i}`] = timerId;
      }
    });

    // Schedule Monthly Checklist Reminder (8:00 PM daily if not done)
    const mk = monthKey();
    const checks = (dog.checklist || {})[mk] || {};
    const breedCard = getBreedCard(dog.breed);
    const CHECKLIST_ITEMS = getDynamicChecklist(dog, breedCard);
    const all = Object.values(CHECKLIST_ITEMS).flat();
    const makeKey = (str) => "chk_" + str.replace(/[^a-zA-Z0-9]/g, "").substring(0, 15);
    const unchecked = all.filter(item => !checks[makeKey(item)]);
    
    if (unchecked.length > 0) {
      const timerId = scheduleReminder({ 
        label: `${unchecked.length} care tasks left (e.g., ${unchecked[0]})`, 
        time: "20:00", 
        id: "monthly_nag" 
      }, `Care Reminder for ${dog.name}`);
      if (timerId != null) map["monthly_nag"] = timerId;
    }

    return () => Object.values(map).forEach(clearTimeout);
  }, [notifPerm, dog]);

  if (!dog) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="dct-wrapper">
        <div className="dct-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`dct-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(activeTab === t.id ? null : t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === "feeding" && <FeedingTab dog={dog} onUpdate={onUpdate} notifPerm={notifPerm} handleEnableNotif={handleEnableNotif} />}
        {activeTab === "vaccinations" && <VaccinationsTab dog={dog} onUpdate={onUpdate} />}
        {activeTab === "checklist" && <ChecklistTab dog={dog} onUpdate={onUpdate} notifPerm={notifPerm} handleEnableNotif={handleEnableNotif} />}
      </div>
    </>
  );
}
