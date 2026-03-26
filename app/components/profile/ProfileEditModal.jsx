"use client";

import { useState, useRef } from "react";
import { supabase }         from "../../../lib/supabase";

const BREEDS = [
  "Golden Retriever","Labrador","German Shepherd","Beagle","Poodle",
  "Bulldog","Rottweiler","Yorkshire Terrier","Dachshund","Shih Tzu",
  "Siberian Husky","Dobermann","Great Dane","Boxer","Maltese",
  "Border Collie","Cocker Spaniel","Pomeranian","Mixed Breed","Other",
];

export default function ProfileEditModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    full_name:     profile?.full_name     ?? "",
    username:      profile?.username      ?? "",
    primary_breed: profile?.primary_breed ?? "",
    bio:           profile?.bio           ?? "",
    dog_name:      profile?.dog_name      ?? "",
    dog_age:       profile?.dog_age       ?? "",
  });
  const [dogPreview, setDogPreview] = useState(profile?.dog_photo_url ?? null);
  const [dogFile,    setDogFile]    = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState("");
  const [section,    setSection]    = useState("you");
  const dogRef = useRef(null);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  function handleDogPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setDogFile(file);
    const r = new FileReader();
    r.onload = ev => setDogPreview(ev.target.result);
    r.readAsDataURL(file);
  }

  async function handleSave() {
    if (!form.full_name.trim()) { setError("Display name is required"); return; }
    setSaving(true); setError("");
    try {
      let updates = { ...form, dog_age: form.dog_age ? parseInt(form.dog_age) : null };
      if (dogFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const ext = dogFile.name.split(".").pop();
        const { error: upErr } = await supabase.storage
          .from("community-posts")
          .upload(`dogs/${user.id}.${ext}`, dogFile, { upsert: true });
        if (!upErr) {
          const { data: u } = supabase.storage.from("community-posts").getPublicUrl(`dogs/${user.id}.${ext}`);
          updates.dog_photo_url = u.publicUrl;
        }
      }
      await onSave(updates);
    } catch (e) { setError(e.message ?? "Failed to save"); }
    finally { setSaving(false); }
  }

  const inputStyle = {
    width: "100%",
    border: "1.5px solid var(--border-strong)",
    borderRadius: "var(--radius-md)",
    padding: "12px 14px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 300,
    color: "var(--text-primary)",
    background: "var(--bg-soft)",
    outline: "none",
    transition: "border-color 0.2s",
    lineHeight: 1.5,
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 500,
    color: "var(--text-light)",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    marginBottom: 7,
  };

  return (
    <>
      <style>{`
        @keyframes sheetUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        .edit-modal-sheet { animation: sheetUp 0.32s cubic-bezier(0.34,1.15,0.64,1) forwards; }
        .edit-input:focus { border-color: var(--accent-dark) !important; background: var(--soft-white) !important; }
        .edit-input::placeholder { color: var(--text-light); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(50,35,20,0.50)",
          backdropFilter: "blur(5px)",
          zIndex: 100,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {/* Sheet */}
        <div
          className="edit-modal-sheet"
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--soft-white)",
            borderRadius: "var(--radius-xl) var(--radius-xl) 0 0",
            padding: "0 24px 40px",
            width: "100%",
            maxWidth: 520,
            maxHeight: "92vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 -24px 80px rgba(60,40,20,0.18)",
          }}
        >
          {/* Drag handle */}
          <div style={{
            width: 36, height: 4,
            background: "var(--border-strong)",
            borderRadius: 2,
            margin: "14px auto 20px",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 16,
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 30, height: 30,
              cursor: "pointer",
              color: "var(--text-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
              transition: "var(--transition)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-soft)"; e.currentTarget.style.color = "var(--text-light)"; }}
          >✕</button>

          {/* Title */}
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 24, fontWeight: 300,
            color: "var(--accent-dark)",
            marginBottom: 22,
            lineHeight: 1.2,
          }}>Edit Profile</div>

          {/* Section toggle */}
          <div style={{
            display: "flex",
            background: "var(--bg-soft)",
            borderRadius: "var(--radius-md)",
            padding: 4,
            marginBottom: 24,
            border: "1px solid var(--border)",
          }}>
            {[{ key: "you", label: "About You" }, { key: "dog", label: "My Dog" }].map(s => (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: 13, fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--transition)",
                  background: section === s.key ? "var(--soft-white)" : "transparent",
                  color: section === s.key ? "var(--accent-dark)" : "var(--text-light)",
                  boxShadow: section === s.key ? "0 2px 8px rgba(127,85,57,0.10)" : "none",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* ── About You section ── */}
          {section === "you" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input
                  className="edit-input"
                  style={inputStyle}
                  value={form.full_name}
                  onChange={set("full_name")}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label style={labelStyle}>Username</label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: 14, top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-light)",
                    fontSize: 14, pointerEvents: "none",
                  }}>@</span>
                  <input
                    className="edit-input"
                    style={{ ...inputStyle, paddingLeft: 30 }}
                    value={form.username}
                    onChange={set("username")}
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                  className="edit-input"
                  style={{ ...inputStyle, resize: "none" }}
                  rows={3}
                  value={form.bio}
                  onChange={set("bio")}
                  placeholder="Tell the pack about you and your dog…"
                  maxLength={150}
                />
                <div style={{
                  textAlign: "right",
                  fontSize: 11,
                  color: form.bio.length > 130 ? "#c0635a" : "var(--text-light)",
                  marginTop: 5,
                }}>
                  {form.bio.length}/150
                </div>
              </div>
            </div>

          ) : (
            /* ── My Dog section ── */
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Dog photo */}
              <div>
                <label style={labelStyle}>Dog Photo</label>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    onClick={() => dogRef.current?.click()}
                    style={{
                      width: 82, height: 82,
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-soft)",
                      border: `2px dashed ${dogPreview ? "var(--accent)" : "var(--border-strong)"}`,
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      transition: "var(--transition)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-dark)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = dogPreview ? "var(--accent)" : "var(--border-strong)"}
                  >
                    {dogPreview
                      ? <img src={dogPreview} alt="Dog" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ fontSize: 30 }}>🐶</span>
                    }
                  </div>

                  <div>
                    <button
                      onClick={() => dogRef.current?.click()}
                      style={{
                        padding: "8px 16px",
                        background: "var(--bg-soft)",
                        border: "1.5px solid var(--border-strong)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-body)",
                        fontSize: 12, fontWeight: 500,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        marginBottom: 7,
                        display: "block",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--card-lite)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-soft)"; e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                    >
                      {dogPreview ? "Change photo" : "Upload photo"}
                    </button>
                    <div style={{ fontSize: 11, color: "var(--text-light)" }}>JPG or PNG · max 5 MB</div>
                  </div>

                  <input ref={dogRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleDogPhoto} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Dog's Name</label>
                <input
                  className="edit-input"
                  style={inputStyle}
                  value={form.dog_name}
                  onChange={set("dog_name")}
                  placeholder="What's your dog's name?"
                />
              </div>

              <div>
                <label style={labelStyle}>Dog's Breed</label>
                <select
                  className="edit-input"
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  value={form.primary_breed}
                  onChange={set("primary_breed")}
                >
                  <option value="">Select breed</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Dog's Age (years)</label>
                <input
                  className="edit-input"
                  style={inputStyle}
                  type="number"
                  min="0" max="25"
                  value={form.dog_age}
                  onChange={set("dog_age")}
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: 16,
              background: "#fdf0ef",
              border: "1px solid #f5c8c4",
              borderRadius: "var(--radius-md)",
              padding: "11px 15px",
              fontSize: 13,
              color: "#c0635a",
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: 24,
              background: saving ? "var(--card-bg)" : "var(--accent-dark)",
              color: saving ? "var(--text-light)" : "var(--soft-white)",
              border: "none",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-display)",
              fontSize: 16,
              fontWeight: 300,
              cursor: saving ? "default" : "pointer",
              transition: "var(--transition)",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={e => !saving && (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
