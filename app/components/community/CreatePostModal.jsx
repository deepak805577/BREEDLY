"use client";

import { useState, useRef } from "react";

const TAGS = ["#Training","#Health","#Puppy","#Food","#Grooming","#DogLove","#GoldenRetriever","#Labrador","#Beagle","#Poodle","#Husky","#Vet","#Rescue","#Adoption"];

export default function CreatePostModal({ onClose, onSubmit, isLoading }) {
  const [caption, setCaption]   = useState("");
  const [selTags, setSelTags]   = useState([]);
  const [preview, setPreview]   = useState(null);
  const [file,    setFile]      = useState(null);
  const fileRef = useRef(null);

  const toggleTag = t => setSelTags(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
  };

  return (
    <>
      <style>{`
        @keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .modal-sheet{animation:sheetUp 0.3s cubic-bezier(0.34,1.2,0.64,1) forwards}
      `}</style>

      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(60,45,30,0.45)", zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
        <div className="modal-sheet" onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)", borderRadius:"var(--radius-xl) var(--radius-xl) 0 0", padding:"0 24px 36px", width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", position:"relative" }}>

          <div style={{ width:40, height:4, background:"var(--border)", borderRadius:2, margin:"14px auto 18px" }} />

          <button onClick={onClose} style={{ position:"absolute", top:14, right:16, background:"var(--bg)", border:"1px solid var(--border)", borderRadius:"50%", width:30, height:30, fontSize:15, cursor:"pointer", color:"var(--muted)", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>

          <div style={{ fontFamily:"var(--font-display)", fontSize:22, color:"var(--primary-dark)", marginBottom:20 }}>
            Share with the pack
          </div>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current?.click()}
            style={{ border:`2px dashed ${preview?"var(--primary)":"var(--border)"}`, borderRadius:"var(--radius-lg)", padding:20, textAlign:"center", cursor:"pointer", marginBottom:16, background:preview?"transparent":"var(--bg)", overflow:"hidden", transition:"border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="var(--primary-dark)"}
            onMouseLeave={e => e.currentTarget.style.borderColor=preview?"var(--primary)":"var(--border)"}
          >
            {preview
              ? <img src={preview} alt="Preview" style={{ width:"100%", maxHeight:220, objectFit:"cover", borderRadius:10 }} />
              : <>
                  <div style={{ fontSize:32, marginBottom:8 }}>📷</div>
                  <div style={{ fontSize:14, fontWeight:500, color:"var(--muted)" }}>Tap to add a photo</div>
                  <div style={{ fontSize:12, color:"var(--border)", marginTop:4 }}>JPG, PNG or MP4 · max 20MB</div>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display:"none" }} onChange={handleFile} />
          </div>

          {/* Caption */}
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="What's your pup up to? Share tips, moments, or advice..."
            rows={3}
            style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:"var(--radius-md)", padding:"11px 14px", fontFamily:"var(--font-body)", fontSize:14, color:"var(--text)", background:"var(--bg)", resize:"none", outline:"none", transition:"border-color 0.15s", marginBottom:4 }}
            onFocus={e => e.target.style.borderColor="var(--primary-dark)"}
            onBlur={e  => e.target.style.borderColor="var(--border)"}
          />
          <div style={{ textAlign:"right", fontSize:11, color:caption.length>250?"#c0635a":"var(--border)", marginBottom:14 }}>
            {caption.length}/280
          </div>

          {/* Tags */}
          <div style={{ fontSize:11, fontWeight:600, color:"var(--muted)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:8 }}>Add tags</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:22 }}>
            {TAGS.map(tag => {
              const sel = selTags.includes(tag);
              return (
                <button key={tag} onClick={() => toggleTag(tag)} style={{ padding:"5px 13px", borderRadius:"var(--radius-pill)", fontSize:12, fontWeight:500, fontFamily:"var(--font-body)", background:sel?"var(--primary-dark)":"var(--bg)", color:sel?"#fff":"var(--muted)", border:`1.5px solid ${sel?"var(--primary-dark)":"var(--border)"}`, cursor:"pointer", transition:"all 0.14s" }}>
                  {tag}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => caption.trim() && onSubmit({ caption, tags: selTags, file })}
            disabled={isLoading || !caption.trim()}
            style={{ width:"100%", padding:"14px", background:caption.trim()?"var(--primary-dark)":"var(--border)", color:"#fff", border:"none", borderRadius:"var(--radius-lg)", fontFamily:"var(--font-display)", fontSize:18, cursor:caption.trim()?"pointer":"default", letterSpacing:"0.3px", transition:"opacity 0.15s, transform 0.1s", opacity:isLoading?0.7:1 }}
            onMouseEnter={e => caption.trim() && (e.currentTarget.style.transform="scale(1.02)")}
            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
          >
            {isLoading ? "Posting..." : "Post to Community"}
          </button>
        </div>
      </div>
    </>
  );
}
