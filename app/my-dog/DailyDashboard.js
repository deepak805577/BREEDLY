"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { breedCards } from "@/app/data/breed";

// ─── HELPERS ───────────────────────────────────────────────────────────────
const todayKey = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const weekKey = () => {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const wk = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(wk).padStart(2, "0")}`;
};
const fmtDate = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";
const BREED_MAP = Object.fromEntries(breedCards.map((b) => [b.name.toLowerCase(), b]));
const getBreedCard = (n) => n ? BREED_MAP[n.toLowerCase()] || null : null;
const ENERGY_MINUTES = { low: 30, moderate: 45, high: 60 };

// Streak milestone badges
const MILESTONES = [
  { days: 3, label: "3-Day" },
  { days: 7, label: "1 Week" },
  { days: 14, label: "2 Weeks" },
  { days: 30, label: "1 Month" },
  { days: 60, label: "2 Months" },
  { days: 100, label: "100 Days" },
];

// ─── CARE SCORE CALCULATION ────────────────────────────────────────────────
function calcCareScore(dog, todayLog, breedCard) {
  const meals = dog.meals || [];
  const mealsDone = todayLog.meals_done || [];
  const totalMeals = meals.length || 1;
  const foodScore = Math.round((mealsDone.filter(Boolean).length / totalMeals) * 100);

  const routines = (dog.checklist || {}).daily_routine || [];
  const walksDone = todayLog.walks_done || [];
  const totalWalks = routines.length || 1;
  const exerciseScore = Math.round((walksDone.filter(Boolean).length / totalWalks) * 100);

  const groomingScore = todayLog.grooming_done ? 100 : 0;

  // Health: based on vaccination status
  const vaccinations = dog.vaccinations || {};
  const vaccKeys = Object.keys(vaccinations);
  const vaccLoggedCount = vaccKeys.filter(k => vaccinations[k]?.lastGiven).length;
  const healthScore = vaccKeys.length > 0 ? Math.round((vaccLoggedCount / Math.max(vaccKeys.length, 4)) * 100) : 50;

  const overall = Math.round((foodScore * 0.35) + (exerciseScore * 0.3) + (groomingScore * 0.15) + (healthScore * 0.2));
  return { food: Math.min(foodScore, 100), exercise: Math.min(exerciseScore, 100), grooming: Math.min(groomingScore, 100), health: Math.min(healthScore, 100), overall: Math.min(overall, 100) };
}

// ─── STREAK CALCULATION ────────────────────────────────────────────────────
function calcStreak(dailyLogs) {
  const today = todayKey();
  const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();

  let streak = 0;
  let checkDate = new Date();

  // If today is completed, start from today, otherwise from yesterday
  const todayLog = dailyLogs[today];
  const todayComplete = todayLog && (todayLog.meals_done || []).filter(Boolean).length > 0;

  if (!todayComplete) {
    // Check if yesterday was complete
    const ydLog = dailyLogs[yesterday];
    if (!ydLog || !(ydLog.meals_done || []).filter(Boolean).length) return 0;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const key = checkDate.getFullYear() + "-" + String(checkDate.getMonth() + 1).padStart(2, "0") + "-" + String(checkDate.getDate()).padStart(2, "0");
    const log = dailyLogs[key];
    if (log && (log.meals_done || []).filter(Boolean).length > 0) {
      streak++;
    } else {
      break;
    }
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}

// ─── UPCOMING VACCINE CHECK ────────────────────────────────────────────────
function getUpcomingVaccines(dog) {
  const vaccinations = dog.vaccinations || {};
  const upcoming = [];
  const today = new Date();

  Object.entries(vaccinations).forEach(([id, data]) => {
    if (!data.lastGiven) return;
    const last = new Date(data.lastGiven + "T00:00:00");
    const next = new Date(last);
    next.setMonth(next.getMonth() + 12); // approximate
    const daysLeft = Math.round((next - today) / 86400000);
    if (daysLeft <= 30 && daysLeft >= 0) {
      upcoming.push({ id, daysLeft, date: next.toISOString().split("T")[0] });
    }
  });
  return upcoming;
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const DASHBOARD_STYLES = `
  .dd-card {
    background: #FFFFFF; border-radius: 24px; padding: 28px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.03);
    margin-bottom: 20px; font-family: 'DM Sans', sans-serif;
  }
  .dd-greeting {
    font-family: 'Fraunces', serif; font-size: 1.25rem;
    color: #7F5539; margin: 0 0 2px 0; line-height: 1.3;
  }
  .dd-subtitle { font-size: 0.78rem; color: #AAA; margin: 0 0 22px 0; font-weight: 400; }

  /* Progress Ring */
  .dd-progress-ring-container {
    display: flex; align-items: center; gap: 24px;
    margin-bottom: 20px;
  }
  .dd-ring-wrap { position: relative; width: 96px; height: 96px; flex-shrink: 0; }
  .dd-ring-svg { transform: rotate(-90deg); }
  .dd-ring-bg { stroke: #F0EBE3; fill: none; stroke-width: 5; }
  .dd-ring-fill {
    fill: none; stroke-width: 5; stroke-linecap: round;
    transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .dd-ring-text {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .dd-ring-pct { font-family: 'Fraunces', serif; font-size: 1.5rem; color: #7F5539; font-weight: 600; line-height: 1; }
  .dd-ring-label { font-size: 0.58rem; color: #BBB; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

  /* Task Grid */
  .dd-tasks {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    flex: 1;
  }
  .dd-task {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; border-radius: 14px;
    cursor: pointer; transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    background: #FAF7F2;
    border: 1px solid rgba(0,0,0,0.02);
  }
  .dd-task:hover { background: #F5EFE6; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .dd-task:active { transform: scale(0.98); }
  .dd-task-check {
    width: 24px; height: 24px; border-radius: 50%; border: 2px solid #DDD;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.25s; font-size: 12px; color: white;
  }
  .dd-task-check.done { background: #A3B18A; border-color: #A3B18A; box-shadow: 0 2px 8px rgba(163,177,138,0.3); }
  .dd-task-check.partial { background: #F5DEB3; border-color: #B08968; }
  .dd-task-info { display: flex; flex-direction: column; min-width: 0; }
  .dd-task-title { font-size: 0.82rem; font-weight: 600; color: #3E3E3E; }
  .dd-task-sub { font-size: 0.68rem; color: #AAA; margin-top: 1px; }
  .dd-task-title.done { color: #BBB; text-decoration: line-through; }

  /* Streak */
  .dd-streak-row {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 20px; padding: 16px 20px;
    background: linear-gradient(135deg, #FFF8F0 0%, #FFFDF9 100%);
    border-radius: 20px; border: 1px solid rgba(176,137,104,0.08);
    box-shadow: 0 4px 16px rgba(176,137,104,0.06);
  }
  .dd-streak-fire { font-size: 1.8rem; line-height: 1; }
  .dd-streak-count { font-family: 'Fraunces', serif; font-size: 1.4rem; color: #7F5539; font-weight: 600; line-height: 1; }
  .dd-streak-label { font-size: 0.72rem; color: #B08968; font-weight: 500; margin-top: 2px; }
  .dd-streak-badges { display: flex; gap: 6px; margin-left: auto; flex-wrap: wrap; }
  .dd-badge {
    padding: 5px 10px; border-radius: 20px; font-size: 0.62rem;
    font-weight: 700; letter-spacing: 0.3px; display: flex; align-items: center; gap: 3px;
  }
  .dd-badge.earned { background: #F0F5EC; color: #587B45; border: 1px solid rgba(163,177,138,0.2); }
  .dd-badge.locked { background: #F8F8F8; color: #D0D0D0; border: 1px solid rgba(0,0,0,0.03); }

  /* Care Score */
  .dd-score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .dd-score-item {
    padding: 14px 16px; border-radius: 16px;
    background: #FAF7F2; display: flex; flex-direction: column; gap: 8px;
    border: 1px solid rgba(0,0,0,0.02);
    transition: all 0.2s;
  }
  .dd-score-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .dd-score-header { display: flex; justify-content: space-between; align-items: center; }
  .dd-score-label { font-size: 0.7rem; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
  .dd-score-val { font-family: 'Fraunces', serif; font-size: 1.15rem; font-weight: 600; }
  .dd-score-bar { height: 4px; background: #EFE7DB; border-radius: 10px; overflow: hidden; }
  .dd-score-fill { height: 100%; border-radius: 10px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); }

  /* Vaccine Alert */
  .dd-vacc-alert {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 14px;
    background: #FFF6ED; border: 1px solid rgba(176,137,104,0.12);
    margin-top: 16px;
  }
  .dd-vacc-alert-icon { font-size: 1rem; flex-shrink: 0; }
  .dd-vacc-alert-text { font-size: 0.78rem; color: #7F5539; font-weight: 500; }

  /* Section Title */
  .dd-section-title {
    font-family: 'Fraunces', serif; font-size: 1.05rem; color: #7F5539;
    margin: 0 0 14px 0;
  }

  /* Suggestions */
  .dd-report-suggestion {
    padding: 14px 18px; border-radius: 14px; margin-top: 14px;
    background: #F4F8F0; border: 1px solid rgba(163,177,138,0.15);
    font-size: 0.78rem; color: #587B45; line-height: 1.5;
    display: flex; align-items: flex-start; gap: 10px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .dd-card { padding: 20px 16px; border-radius: 20px; }
    .dd-progress-ring-container { flex-direction: column; align-items: stretch; gap: 16px; }
    .dd-ring-wrap { align-self: center; }
    .dd-tasks { grid-template-columns: 1fr 1fr; gap: 8px; }
    .dd-task { padding: 10px 12px; }
    .dd-streak-row { flex-direction: column; align-items: flex-start; gap: 10px; padding: 14px 16px; }
    .dd-streak-badges { margin-left: 0; }
    .dd-score-grid { grid-template-columns: 1fr 1fr; }
    .dd-score-item { padding: 12px 14px; }
  }
`;

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function DailyDashboard({ dog, onUpdate }) {
  const tk = todayKey();
  const dailyLogs = dog.daily_logs || {};
  const todayLog = dailyLogs[tk] || {};
  const breedCard = getBreedCard(dog.breed);

  const meals = dog.meals || [];
  const routines = (dog.checklist || {}).daily_routine || [];

  // Initialize today's log if empty
  useEffect(() => {
    if (!dailyLogs[tk]) {
      const init = {
        meals_done: meals.map(() => false),
        walks_done: routines.map(() => false),
        grooming_done: false,
      };
      const updated = { ...dailyLogs, [tk]: init };
      supabase.from("dogs").update({ daily_logs: updated }).eq("id", dog.id).then(({ error }) => {
        if (!error) onUpdate({ ...dog, daily_logs: updated });
      });
    }
  }, [tk, dog.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const mealsDone = todayLog.meals_done || meals.map(() => false);
  const walksDone = todayLog.walks_done || routines.map(() => false);
  const groomingDone = todayLog.grooming_done || false;

  // Progress calc
  const totalTasks = meals.length + routines.length + 1; // +1 for grooming
  const completedTasks = mealsDone.filter(Boolean).length + walksDone.filter(Boolean).length + (groomingDone ? 1 : 0);
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Streak
  const streak = useMemo(() => calcStreak(dailyLogs), [dailyLogs]);
  const bestStreak = Math.max(streak, dog.streak?.best || 0);

  // Care Score
  const score = useMemo(() => calcCareScore(dog, todayLog, breedCard), [dog, todayLog, breedCard]);

  // Upcoming vaccines
  const upcomingVaccs = useMemo(() => getUpcomingVaccines(dog), [dog]);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Toggle handlers
  const toggleMeal = async (idx) => {
    const updated = [...mealsDone];
    updated[idx] = !updated[idx];
    const newLog = { ...todayLog, meals_done: updated };
    const newLogs = { ...dailyLogs, [tk]: newLog };

    onUpdate({ ...dog, daily_logs: newLogs });
    const { error } = await supabase.from("dogs").update({ daily_logs: newLogs }).eq("id", dog.id);
    if (error) onUpdate(dog); // revert

    // Update streak
    const newStreak = calcStreak(newLogs);
    if (newStreak !== streak) {
      const streakData = { current: newStreak, best: Math.max(newStreak, bestStreak), last_completed: tk };
      await supabase.from("dogs").update({ streak: streakData }).eq("id", dog.id);
      onUpdate({ ...dog, daily_logs: newLogs, streak: streakData });
    }
  };

  const toggleWalk = async (idx) => {
    const updated = [...walksDone];
    updated[idx] = !updated[idx];
    const newLog = { ...todayLog, walks_done: updated };
    const newLogs = { ...dailyLogs, [tk]: newLog };
    onUpdate({ ...dog, daily_logs: newLogs });
    const { error } = await supabase.from("dogs").update({ daily_logs: newLogs }).eq("id", dog.id);
    if (error) onUpdate(dog);
  };

  const toggleGrooming = async () => {
    const newLog = { ...todayLog, grooming_done: !groomingDone };
    const newLogs = { ...dailyLogs, [tk]: newLog };
    onUpdate({ ...dog, daily_logs: newLogs });
    const { error } = await supabase.from("dogs").update({ daily_logs: newLogs }).eq("id", dog.id);
    if (error) onUpdate(dog);
  };

  // SVG ring
  const R = 40;
  const C = 2 * Math.PI * R;
  const offset = C - (progressPct / 100) * C;
  const ringColor = progressPct === 100 ? "#A3B18A" : progressPct >= 50 ? "#B08968" : "#DDD";

  const scoreColor = (v) => v >= 80 ? "#587B45" : v >= 50 ? "#B08968" : "#b85c5c";

  // Week summary (simplified)
  const getWeekSuggestions = () => {
    const suggestions = [];
    if (score.food < 80) suggestions.push(`Try to complete all ${meals.length} meals today — consistency matters for ${dog.name}'s digestion.`);
    if (score.exercise < 60) {
      const target = breedCard ? (ENERGY_MINUTES[breedCard.energy] || 45) : 45;
      suggestions.push(`Increase daily walks by 10-15 mins to reach the ${target}-minute target.`);
    }
    if (score.grooming === 0) suggestions.push(`Quick grooming check today — brush coat and check ears.`);
    if (suggestions.length === 0) suggestions.push(`Great job! ${dog.name} is getting excellent care. Keep up the routine!`);
    return suggestions;
  };

  return (
    <>
      <style>{DASHBOARD_STYLES}</style>

      {/* ── Today Card ── */}
      <div className="dd-card">
        <h3 className="dd-greeting">{greeting} — Today for {dog.name}</h3>
        <p className="dd-subtitle">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>

        {/* Progress Ring + Tasks */}
        <div className="dd-progress-ring-container">
          <div className="dd-ring-wrap">
            <svg className="dd-ring-svg" width="96" height="96" viewBox="0 0 96 96">
              <circle className="dd-ring-bg" cx="48" cy="48" r={R} />
              <circle className="dd-ring-fill" cx="48" cy="48" r={R}
                stroke={ringColor}
                strokeDasharray={C}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="dd-ring-text">
              <span className="dd-ring-pct">{progressPct}%</span>
              <span className="dd-ring-label">Done</span>
            </div>
          </div>

          <div className="dd-tasks">
            {/* Meals summary */}
            <div className="dd-task" onClick={() => meals.length > 0 && toggleMeal(mealsDone.findIndex(m => !m) >= 0 ? mealsDone.findIndex(m => !m) : 0)}>
              <div className={`dd-task-check ${mealsDone.every(Boolean) && meals.length > 0 ? "done" : mealsDone.some(Boolean) ? "partial" : ""}`}>
                {mealsDone.every(Boolean) && meals.length > 0 ? "✓" : ""}
              </div>
              <div className="dd-task-info">
                <span className={`dd-task-title ${mealsDone.every(Boolean) && meals.length > 0 ? "done" : ""}`}>Meals</span>
                <span className="dd-task-sub">{mealsDone.filter(Boolean).length}/{meals.length} completed</span>
              </div>
            </div>

            {/* Walks summary */}
            <div className="dd-task" onClick={() => routines.length > 0 && toggleWalk(walksDone.findIndex(w => !w) >= 0 ? walksDone.findIndex(w => !w) : 0)}>
              <div className={`dd-task-check ${walksDone.every(Boolean) && routines.length > 0 ? "done" : walksDone.some(Boolean) ? "partial" : ""}`}>
                {walksDone.every(Boolean) && routines.length > 0 ? "✓" : ""}
              </div>
              <div className="dd-task-info">
                <span className={`dd-task-title ${walksDone.every(Boolean) && routines.length > 0 ? "done" : ""}`}>Exercise</span>
                <span className="dd-task-sub">{walksDone.filter(Boolean).length}/{routines.length} activities</span>
              </div>
            </div>

            {/* Grooming */}
            <div className="dd-task" onClick={toggleGrooming}>
              <div className={`dd-task-check ${groomingDone ? "done" : ""}`}>
                {groomingDone ? "✓" : ""}
              </div>
              <div className="dd-task-info">
                <span className={`dd-task-title ${groomingDone ? "done" : ""}`}>Grooming</span>
                <span className="dd-task-sub">{groomingDone ? "Done today" : "Pending"}</span>
              </div>
            </div>

            {/* Health */}
            <div className="dd-task" style={{ cursor: "default" }}>
              <div className={`dd-task-check ${upcomingVaccs.length === 0 ? "done" : ""}`}>
                {upcomingVaccs.length === 0 ? "✓" : ""}
              </div>
              <div className="dd-task-info">
                <span className="dd-task-title">Health</span>
                <span className="dd-task-sub">{upcomingVaccs.length > 0 ? `${upcomingVaccs.length} vaccine due soon` : "All clear"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Vaccines Alert */}
        {upcomingVaccs.length > 0 && (
          <div className="dd-vacc-alert">
            <span className="dd-vacc-alert-icon" style={{ color: '#b85c5c' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.4 0-3.4L15 5" /><path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" /></svg>
            </span>
            <span className="dd-vacc-alert-text">
              {upcomingVaccs.length === 1
                ? `Vaccination due in ${upcomingVaccs[0].daysLeft} days (${fmtDate(upcomingVaccs[0].date)})`
                : `${upcomingVaccs.length} vaccinations due within 30 days`}
            </span>
          </div>
        )}
      </div>

      {/* ── Streak Card ── */}
      <div className="dd-streak-row">
        <span className="dd-streak-fire" style={{ display: 'flex', alignItems: 'center', color: streak > 0 ? '#d97706' : '#9ca3af' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {streak > 0 ? (
              <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
            ) : (
              <path d="M12 2v20M2 12h20M19 5l-14 14M5 5l14 14M16.5 7.5l-9 9M7.5 7.5l9 9" />
            )}
          </svg>
        </span>
        <div>
          <div className="dd-streak-count">{streak} Day{streak !== 1 ? "s" : ""}</div>
          <div className="dd-streak-label">{streak > 0 ? "Care Streak" : "Start your streak today"}</div>
        </div>
        <div className="dd-streak-badges">
          {MILESTONES.slice(0, 4).map(m => (
            <div key={m.days} className={`dd-badge ${streak >= m.days ? "earned" : "locked"}`}>
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Care Score ── */}
      <div className="dd-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="dd-section-title" style={{ margin: 0 }}>Care Score</h3>
          <span style={{ fontFamily: "Fraunces, serif", fontSize: "1.6rem", fontWeight: 600, color: scoreColor(score.overall) }}>
            {score.overall}<span style={{ fontSize: "0.8rem", color: "#AAA" }}>/100</span>
          </span>
        </div>
        <div className="dd-score-grid">
          {[
            { key: "food", label: "Food", val: score.food },
            { key: "exercise", label: "Exercise", val: score.exercise },
            { key: "grooming", label: "Grooming", val: score.grooming },
            { key: "health", label: "Health", val: score.health },
          ].map(s => (
            <div key={s.key} className="dd-score-item">
              <div className="dd-score-header">
                <span className="dd-score-label">{s.label}</span>
                <span className="dd-score-val" style={{ color: scoreColor(s.val) }}>{s.val}</span>
              </div>
              <div className="dd-score-bar">
                <div className="dd-score-fill" style={{ width: `${s.val}%`, background: scoreColor(s.val) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Suggestion */}
        {getWeekSuggestions().map((sug, i) => (
          <div key={i} className="dd-report-suggestion">
            <span style={{ flexShrink: 0, color: '#A3B18A' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
            </span>
            <span>{sug}</span>
          </div>
        ))}
      </div>
    </>
  );
}
