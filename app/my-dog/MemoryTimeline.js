"use client";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

// ─── HELPERS ───────────────────────────────────────────────────────────────
const fmtDate = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const todayStr = () => {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

const EVENT_ICONS = {
  vaccine: "💉", vet: "🩺", milestone: "🎉", photo: "📸", note: "📝",
};
const EVENT_COLORS = {
  vaccine: { bg: "#F0F5EC", border: "#A3B18A" },
  vet: { bg: "#FFF6ED", border: "#B08968" },
  milestone: { bg: "#FFF9F4", border: "#DEB887" },
  photo: { bg: "#F5F0FF", border: "#9B8EC4" },
  note: { bg: "#F0F8FF", border: "#7EB5D6" },
};

// ─── STYLES ────────────────────────────────────────────────────────────────
const TL_STYLES = `
  .mt-container { font-family: 'DM Sans', sans-serif; margin-bottom: 20px; }
  .mt-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .mt-title {
    font-family: 'Fraunces', serif; font-size: 1rem; color: #7F5539; margin: 0;
  }
  .mt-add-btn {
    padding: 8px 16px; border-radius: 12px; border: none;
    background: #7F5539; color: white; font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem; font-weight: 500; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .mt-add-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(127,85,57,0.2); }

  /* Timeline */
  .mt-timeline { position: relative; padding-left: 28px; }
  .mt-timeline::before {
    content: ''; position: absolute; left: 12px; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(180deg, #B08968, #EFE7DB);
    border-radius: 2px;
  }
  .mt-event {
    position: relative; margin-bottom: 20px; padding: 16px 20px;
    border-radius: 16px; border: 1px solid transparent;
    box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    transition: all 0.2s;
  }
  .mt-event:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.05); }
  .mt-event::before {
    content: ''; position: absolute; left: -22px; top: 18px;
    width: 10px; height: 10px; border-radius: 50%;
    border: 2px solid #B08968; background: white;
  }
  .mt-event-header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; margin-bottom: 6px;
  }
  .mt-event-type {
    font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px;
    font-weight: 700; padding: 3px 8px; border-radius: 8px;
  }
  .mt-event-date { font-size: 0.72rem; color: #AAA; }
  .mt-event-title { font-size: 0.9rem; font-weight: 600; color: #3E3E3E; margin-bottom: 4px; }
  .mt-event-desc { font-size: 0.78rem; color: #777; line-height: 1.5; }
  .mt-event-photo {
    width: 100%; max-height: 200px; object-fit: cover;
    border-radius: 12px; margin-top: 10px;
  }
  .mt-event-actions {
    display: flex; gap: 8px; margin-top: 10px;
  }
  .mt-delete-btn {
    font-size: 0.7rem; color: #b85c5c; background: #FFF0F0;
    border: 1px solid #b85c5c22; border-radius: 8px;
    padding: 4px 10px; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
  }
  .mt-delete-btn:hover { background: #FFE0E0; }

  /* Form */
  .mt-form {
    background: #FFFFFF; border-radius: 20px; padding: 24px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
    border: 1px solid rgba(0,0,0,0.04); margin-bottom: 24px;
  }
  .mt-form-title {
    font-family: 'Fraunces', serif; font-size: 1rem; color: #7F5539;
    margin: 0 0 18px 0;
  }
  .mt-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .mt-field { display: flex; flex-direction: column; gap: 5px; }
  .mt-field.full { grid-column: 1 / -1; }
  .mt-field label {
    font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;
    color: #888; font-weight: 500;
  }
  .mt-field input, .mt-field select, .mt-field textarea {
    padding: 10px 14px; border-radius: 11px;
    border: 1.5px solid rgba(176,137,104,0.2); font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem; color: #3E3E3E; background: #FAF7F2;
    outline: none; transition: border-color 0.2s; width: 100%;
    resize: none;
  }
  .mt-field input:focus, .mt-field select:focus, .mt-field textarea:focus {
    border-color: #B08968;
  }
  .mt-form-actions { display: flex; gap: 10px; margin-top: 16px; }
  .mt-form-btn {
    padding: 10px 20px; border-radius: 12px; font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 500; cursor: pointer; border: none;
    transition: all 0.2s;
  }
  .mt-form-btn.primary { background: #7F5539; color: white; }
  .mt-form-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(127,85,57,0.2); }
  .mt-form-btn.ghost { background: transparent; color: #888; }

  /* Empty state */
  .mt-empty {
    text-align: center; padding: 40px 20px; color: #AAA;
    background: #FAF7F2; border-radius: 18px;
  }
  .mt-empty p { margin: 6px 0; }

  @media (max-width: 640px) {
    .mt-form-grid { grid-template-columns: 1fr; }
    .mt-event { padding: 14px 16px; }
  }
`;

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function MemoryTimeline({ dog, onUpdate }) {
  const timeline = dog.timeline || [];
  const vaccinations = dog.vaccinations || {};

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: "milestone", date: todayStr(), title: "", description: "" });

  // Merge vaccination logs into timeline view
  const allEvents = useMemo(() => {
    const events = [...timeline];

    // Auto-populate from vaccinations
    Object.entries(vaccinations).forEach(([id, data]) => {
      if (data.lastGiven && !events.find(e => e.id === `vacc_${id}`)) {
        events.push({
          id: `vacc_${id}`,
          type: "vaccine",
          date: data.lastGiven,
          title: `${id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, " ")} Vaccination`,
          description: data.notes || "Logged from Vaccination Calendar",
          auto: true,
        });
      }
    });

    // Sort newest first
    events.sort((a, b) => b.date.localeCompare(a.date));
    return events;
  }, [timeline, vaccinations]);

  const addEvent = async () => {
    if (!form.title.trim() || !form.date) return;
    setSaving(true);
    const newEvent = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    };
    const updated = [...timeline, newEvent];
    const { error } = await supabase.from("dogs").update({ timeline: updated }).eq("id", dog.id);
    setSaving(false);
    if (!error) {
      onUpdate({ ...dog, timeline: updated });
      setForm({ type: "milestone", date: todayStr(), title: "", description: "" });
      setShowForm(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Remove this memory?")) return;
    const updated = timeline.filter(e => e.id !== eventId);
    const { error } = await supabase.from("dogs").update({ timeline: updated }).eq("id", dog.id);
    if (!error) onUpdate({ ...dog, timeline: updated });
  };

  return (
    <>
      <style>{TL_STYLES}</style>
      <div className="mt-container">
        <div className="mt-header">
          <h3 className="mt-title">Memory Timeline</h3>
          <button className="mt-add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Moment
              </>
            )}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="mt-form">
            <h4 className="mt-form-title">Record a Moment</h4>
            <div className="mt-form-grid">
              <div className="mt-field">
                <label>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="milestone">Milestone</option>
                  <option value="vet">Vet Visit</option>
                  <option value="photo">Photo Moment</option>
                  <option value="note">Note</option>
                </select>
              </div>
              <div className="mt-field">
                <label>Date</label>
                <input type="date" value={form.date} max={todayStr()} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="mt-field full">
                <label>Title *</label>
                <input type="text" placeholder="First walk in the park..." value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="mt-field full">
                <label>Description</label>
                <textarea rows={3} placeholder="Add details or notes..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-form-actions">
              <button className="mt-form-btn primary" onClick={addEvent} disabled={saving || !form.title.trim()}>
                {saving ? "Saving..." : "Save Moment"}
              </button>
              <button className="mt-form-btn ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Timeline */}
        {allEvents.length === 0 ? (
          <div className="mt-empty">
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>📖</div>
            <p style={{ fontWeight: 600, color: "#888" }}>No memories yet</p>
            <p style={{ fontSize: "0.8rem" }}>Start recording {dog.name}'s journey — milestones, vet visits, and special moments.</p>
          </div>
        ) : (
          <div className="mt-timeline">
            {allEvents.map(event => {
              const colors = EVENT_COLORS[event.type] || EVENT_COLORS.note;
              return (
                <div
                  key={event.id}
                  className="mt-event"
                  style={{ background: colors.bg, borderColor: colors.border + "33" }}
                >
                  <div className="mt-event-header">
                    <span className="mt-event-type" style={{ background: colors.border + "22", color: colors.border }}>
                      {EVENT_ICONS[event.type] || "📝"} {event.type}
                    </span>
                    <span className="mt-event-date">{fmtDate(event.date)}</span>
                  </div>
                  <div className="mt-event-title">{event.title}</div>
                  {event.description && <p className="mt-event-desc">{event.description}</p>}
                  {event.photo_url && (
                    <img src={event.photo_url} alt={event.title} className="mt-event-photo" />
                  )}
                  {!event.auto && (
                    <div className="mt-event-actions">
                      <button className="mt-delete-btn" onClick={() => deleteEvent(event.id)}>Remove</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
