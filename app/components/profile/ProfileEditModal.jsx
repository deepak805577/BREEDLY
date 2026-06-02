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
    padding: "12px 16px",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    fontWeight: 400,
    color: "var(--text-primary)",
    background: "var(--bg-soft)",
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    lineHeight: 1.5,
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-light)",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    marginBottom: 7,
  };

  return (
    <>
      <style>{`
        @keyframes fadeInBg {
          from { background: rgba(50,35,20,0); backdrop-filter: blur(0px); }
          to   { background: rgba(50,35,20,0.45); backdrop-filter: blur(6px); }
        }
        @keyframes modalPopUp {
          from { transform: scale(0.95) translateY(24px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        .edit-modal-backdrop {
          animation: fadeInBg 0.28s ease-out forwards;
        }
        
        .edit-modal-sheet { 
          animation: modalPopUp 0.35s cubic-bezier(0.34, 1.3, 0.64, 1) forwards; 
        }
        
        .edit-input:focus { 
          border-color: var(--accent) !important; 
          background: var(--soft-white) !important; 
          box-shadow: 0 0 0 3.5px rgba(176, 137, 104, 0.16);
        }
        .edit-input::placeholder { color: var(--text-light); }
        
        .dog-photo-uploader {
          transition: var(--transition);
        }
        .dog-photo-uploader:hover {
          border-color: var(--accent) !important;
          background: var(--card-lite) !important;
          transform: scale(1.02);
        }
        
        @media(max-width: 576px) {
          .edit-modal-backdrop {
            align-items: flex-end !important;
          }
          .edit-modal-sheet { 
            animation: sheetSlideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1) forwards !important;
            border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
            max-height: 92vh !important;
            margin: 0 !important;
            padding: 16px 20px 32px !important;
          }
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="edit-modal-backdrop"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        {/* Sheet */}
        <div
          className="edit-modal-sheet"
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--soft-white)",
            borderRadius: "var(--radius-xl)",
            padding: "32px 32px 40px",
            width: "100%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 24px 64px rgba(60,40,20,0.18)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Drag handle visible only on mobile */}
          <div className="mobile-only-handle" style={{
            width: 36, height: 4,
            background: "var(--border-strong)",
            borderRadius: 2,
            margin: "0 auto 20px",
            display: "none",
          }} />
          <style>{`
            @media (max-width: 576px) {
              .mobile-only-handle { display: block !important; }
            }
          `}</style>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 20,
              background: "var(--bg-soft)",
              border: "1px solid var(--border)",
              borderRadius: "50%",
              width: 32, height: 32,
              cursor: "pointer",
              color: "var(--text-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
              transition: "var(--transition)",
              zIndex: 5,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--card-bg)"; e.currentTarget.style.color = "var(--accent-dark)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-soft)"; e.currentTarget.style.color = "var(--text-light)"; }}
          >✕</button>

          {/* Title */}
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 300,
            color: "var(--accent-dark)",
            marginBottom: 24,
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
                  padding: "11px 0",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: 13, fontWeight: 500,
                  cursor: "pointer",
                  transition: "var(--transition)",
                  background: section === s.key ? "var(--soft-white)" : "transparent",
                  color: section === s.key ? "var(--accent-dark)" : "var(--text-light)",
                  boxShadow: section === s.key ? "0 2px 8px rgba(127,85,57,0.08)" : "none",
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
                    position: "absolute", left: 16, top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-light)",
                    fontSize: 14, pointerEvents: "none",
                    fontWeight: 500,
                  }}>@</span>
                  <input
                    className="edit-input"
                    style={{ ...inputStyle, paddingLeft: 32 }}
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
                  color: form.bio.length > 130 ? "var(--danger)" : "var(--text-light)",
                  marginTop: 6,
                  fontWeight: 500,
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
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    onClick={() => dogRef.current?.click()}
                    className="dog-photo-uploader"
                    style={{
                      width: 86, height: 86,
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-soft)",
                      border: `2px dashed ${dogPreview ? "var(--accent)" : "var(--border-strong)"}`,
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {dogPreview
                      ? <img src={dogPreview} alt="Dog preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}><path d="M12 5c-1.5 0-3 1-3.5 2.5a3 3 0 0 0-4.5 3c0 2 1.5 3.5 3 4v1c0 2 1.5 3 3.5 3s3.5-1 3.5-3v-1c1.5-.5 3-2 3-4a3 3 0 0 0-4.5-3C15 6 13.5 5 12 5z" /><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/><path d="M11 13a1 1 0 0 1 2 0"/></svg>
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

          {/* Error message alert box */}
          {error && (
            <div style={{
              marginTop: 16,
              background: "rgba(192, 99, 90, 0.06)",
              border: "1.5px solid rgba(192, 99, 90, 0.2)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              fontSize: 13,
              color: "var(--danger)",
              lineHeight: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: "shake 0.4s ease",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
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
              fontWeight: 400,
              cursor: saving ? "default" : "pointer",
              transition: "var(--transition)",
              letterSpacing: "0.04em",
              boxShadow: saving ? "none" : "0 4px 14px rgba(127, 85, 57, 0.2)",
            }}
            onMouseEnter={e => !saving && (e.currentTarget.style.opacity = "0.92")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
