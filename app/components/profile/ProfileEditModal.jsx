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
  const [section,    setSection]    = useState("you"); // "you" | "dog"
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
        const { error: upErr } = await supabase.storage.from("community-posts").upload(`dogs/${user.id}.${ext}`, dogFile, { upsert: true });
        if (!upErr) {
          const { data: u } = supabase.storage.from("community-posts").getPublicUrl(`dogs/${user.id}.${ext}`);
          updates.dog_photo_url = u.publicUrl;
        }
      }
      await onSave(updates);
    } catch (e) { setError(e.message ?? "Failed to save"); }
    finally { setSaving(false); }
  }

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:12, padding:"11px 14px", fontFamily:"var(--font-body)", fontSize:14, color:"var(--text)", background:"var(--bg)", outline:"none", transition:"border-color 0.15s" };
  const labelStyle = { display:"block", fontSize:11, fontWeight:500, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 };

  return (
    <>
      <style>{`
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .edit-modal{animation:sheetUp 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards}
      `}</style>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(60,45,30,0.45)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div className="edit-modal" onClick={e => e.stopPropagation()} style={{ background:"var(--surface)", borderRadius:"var(--radius-xl) var(--radius-xl) 0 0", padding:"0 24px 36px", width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

          <div style={{ width:40, height:4, background:"var(--border)", borderRadius:2, margin:"14px auto 18px" }} />
          <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"50%", width:28, height:28, cursor:"pointer", color:"var(--muted)", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>

          <div style={{ fontFamily:"var(--font-display)", fontSize:22, color:"var(--primary-dark)", marginBottom:20 }}>Edit Profile</div>

          {/* Section toggle */}
          <div style={{ display:"flex", background:"var(--bg)", borderRadius:12, padding:4, marginBottom:22, border:"1px solid var(--border)" }}>
            {[{ key:"you", label:"About You" }, { key:"dog", label:"My Dog" }].map(s => (
              <button key={s.key} onClick={() => setSection(s.key)} style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", fontFamily:"var(--font-body)", fontSize:13, fontWeight:500, cursor:"pointer", transition:"all 0.15s", background:section===s.key?"var(--surface)":"transparent", color:section===s.key?"var(--primary-dark)":"var(--muted)", boxShadow:section===s.key?"0 1px 4px rgba(166,123,91,0.10)":"none" }}>
                {s.label}
              </button>
            ))}
          </div>

          {section === "you" ? (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input style={inputStyle} value={form.full_name} onChange={set("full_name")} placeholder="Your name"
                  onFocus={e=>e.target.style.borderColor="var(--primary-dark)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Username</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"var(--border)", fontSize:14 }}>@</span>
                  <input style={{ ...inputStyle, paddingLeft:28 }} value={form.username} onChange={set("username")} placeholder="username"
                    onFocus={e=>e.target.style.borderColor="var(--primary-dark)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Bio</label>
                <textarea style={{ ...inputStyle, resize:"none" }} rows={3} value={form.bio} onChange={set("bio")} placeholder="Tell the pack about you and your dog..."
                  onFocus={e=>e.target.style.borderColor="var(--primary-dark)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
                <div style={{ textAlign:"right", fontSize:11, color:form.bio.length>130?"#c0635a":"var(--border)", marginTop:4 }}>{form.bio.length}/150</div>
              </div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {/* Dog photo */}
              <div>
                <label style={labelStyle}>Dog Photo</label>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div onClick={() => dogRef.current?.click()} style={{ width:80, height:80, borderRadius:16, background:"var(--bg)", border:`2px dashed ${dogPreview?"var(--primary)":"var(--border)"}`, overflow:"hidden", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"border-color 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--primary-dark)"} onMouseLeave={e=>e.currentTarget.style.borderColor=dogPreview?"var(--primary)":"var(--border)"}>
                    {dogPreview
                      ? <img src={dogPreview} alt="Dog" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <span style={{ fontSize:28 }}>🐶</span>
                    }
                  </div>
                  <div>
                    <button onClick={() => dogRef.current?.click()} style={{ padding:"8px 16px", background:"var(--bg)", border:"1.5px solid var(--border)", borderRadius:10, fontFamily:"var(--font-body)", fontSize:12, fontWeight:500, color:"var(--muted)", cursor:"pointer", marginBottom:6, display:"block", transition:"all 0.15s" }}
                      onMouseEnter={e=>{e.currentTarget.style.background="var(--primary-soft)";e.currentTarget.style.borderColor="var(--primary)";e.currentTarget.style.color="var(--primary-dark)"}}
                      onMouseLeave={e=>{e.currentTarget.style.background="var(--bg)";e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)"}}>
                      {dogPreview ? "Change photo" : "Upload photo"}
                    </button>
                    <div style={{ fontSize:11, color:"var(--border)" }}>JPG or PNG · max 5MB</div>
                  </div>
                  <input ref={dogRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleDogPhoto} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Dog's Name</label>
                <input style={inputStyle} value={form.dog_name} onChange={set("dog_name")} placeholder="What's your dog's name?"
                  onFocus={e=>e.target.style.borderColor="var(--primary-dark)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Dog's Breed</label>
                <select style={{ ...inputStyle, appearance:"none", cursor:"pointer" }} value={form.primary_breed} onChange={set("primary_breed")}>
                  <option value="">Select breed</option>
                  {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Dog's Age (years)</label>
                <input style={inputStyle} type="number" min="0" max="25" value={form.dog_age} onChange={set("dog_age")} placeholder="e.g. 3"
                  onFocus={e=>e.target.style.borderColor="var(--primary-dark)"} onBlur={e=>e.target.style.borderColor="var(--border)"} />
              </div>
            </div>
          )}

          {error && <div style={{ marginTop:14, background:"#fdf0ef", border:"1px solid #f5c8c4", borderRadius:12, padding:"10px 14px", fontSize:13, color:"#c0635a" }}>{error}</div>}

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ width:"100%", padding:"13px", marginTop:22, background:saving?"var(--border)":"var(--primary-dark)", color:"#fff", border:"none", borderRadius:"var(--radius-lg)", fontFamily:"var(--font-display)", fontSize:17, cursor:saving?"default":"pointer", transition:"opacity 0.15s", letterSpacing:"0.3px" }}
            onMouseEnter={e => !saving && (e.currentTarget.style.opacity="0.88")}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
