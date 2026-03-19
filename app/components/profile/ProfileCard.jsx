"use client";

import { useRef } from "react";

export default function ProfileCard({ profile, postCount, isOwnProfile, onEdit, onAvatarUpload }) {
  const fileRef = useRef(null);
  const initials = profile?.initials ?? profile?.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{ background:"var(--surface)", borderRadius:"var(--radius-xl)", border:"1.5px solid var(--border)", overflow:"hidden" }}>

      {/* Cover */}
      <div style={{ height:150, background:"var(--primary-soft)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%, #e8c8a6 1px, transparent 1px), radial-gradient(circle at 80% 20%, #e8c8a6 1px, transparent 1px)", backgroundSize:"20px 20px", opacity:0.4 }} />
      </div>

      {/* Avatar row */}
      <div style={{ padding:"0 20px", marginTop:-36, position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
        <div style={{ position:"relative" }}>
          <div style={{
            width:72, height:72, borderRadius:"50%",
            background:"var(--primary-soft)",
            border:"3px solid var(--surface)",
            boxShadow:"0 2px 10px rgba(166,123,91,0.18)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"var(--font-display)", fontSize:24, color:"var(--primary-dark)",
            overflow:"hidden", flexShrink:0,
          }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : initials
            }
          </div>
          {isOwnProfile && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position:"absolute", bottom:0, right:0, width:24, height:24, borderRadius:"50%", background:"var(--primary-dark)", border:"2px solid var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="1.6"><rect x="1" y="3" width="12" height="9" rx="1.5"/><circle cx="7" cy="7.5" r="2"/><path d="M5 3l1-2h2l1 2"/></svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => onAvatarUpload(e.target.files[0])} />
            </>
          )}
        </div>

        {isOwnProfile ? (
          <button
            onClick={onEdit}
            style={{ padding:"7px 16px", background:"none", border:"1.5px solid var(--border)", borderRadius:"var(--radius-pill)", fontFamily:"var(--font-body)", fontSize:12, fontWeight:500, color:"var(--text)", cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background="var(--primary-soft)"; e.currentTarget.style.borderColor="var(--primary)"; e.currentTarget.style.color="var(--primary-dark)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text)"; }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 2l3 3-9 9H2v-3l9-9z"/></svg>
            Edit
          </button>
        ) : (
          <button style={{ padding:"7px 18px", background:"var(--primary-dark)", border:"none", borderRadius:"var(--radius-pill)", fontFamily:"var(--font-body)", fontSize:12, fontWeight:500, color:"#fff", cursor:"pointer" }}>
            Follow
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:20, color:"var(--primary-dark)", fontWeight:500, marginBottom:2 }}>
          {profile?.full_name ?? "Dog Lover"}
        </div>
        {profile?.username && (
          <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>@{profile.username}</div>
        )}
        {profile?.bio && (
          <p style={{ fontSize:13, lineHeight:1.65, color:"var(--text)", marginBottom:14 }}>
            {profile.bio}
          </p>
        )}

        {/* Stats */}
        <div style={{ display:"flex", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"14px 0", marginBottom:16 }}>
          {[
            { val: postCount, label: "Posts" },
            { val: "—", label: "Followers" },
            { val: "—", label: "Following" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{ flex:1, textAlign:"center", borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:18, color:"var(--primary-dark)", fontWeight:500 }}>{s.val}</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dog card */}
        {(profile?.dog_name || profile?.primary_breed || profile?.dog_age) ? (
          <div style={{ background:"var(--bg)", borderRadius:14, border:"1.5px solid var(--border)", padding:"13px 15px", display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:52, height:52, borderRadius:12, background:"var(--primary-soft)", border:"2px solid var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, overflow:"hidden" }}>
              {profile?.dog_photo_url
                ? <img src={profile.dog_photo_url} alt={profile.dog_name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : "🐶"
              }
            </div>
            <div>
              {profile?.dog_name && (
                <div style={{ fontFamily:"var(--font-display)", fontSize:15, color:"var(--primary-dark)", fontWeight:500, marginBottom:6 }}>
                  {profile.dog_name}
                </div>
              )}
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {profile?.primary_breed && <Badge>{profile.primary_breed}</Badge>}
                {profile?.dog_age      && <Badge>{profile.dog_age} {profile.dog_age === 1 ? "year" : "years"} old</Badge>}
              </div>
            </div>
          </div>
        ) : isOwnProfile ? (
          <div
            onClick={onEdit}
            style={{ background:"var(--bg)", borderRadius:14, border:"1.5px dashed var(--border)", padding:"13px 15px", display:"flex", gap:12, alignItems:"center", cursor:"pointer" }}
            onMouseEnter={e => e.currentTarget.style.borderColor="var(--primary)"}
            onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}
          >
            <div style={{ width:52, height:52, borderRadius:12, background:"var(--primary-soft)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🐾</div>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:"var(--primary-dark)", fontFamily:"var(--font-body)", marginBottom:3 }}>Add your dog's info</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>Name, breed, age & photo</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:"var(--radius-pill)", background:"var(--primary-soft)", color:"var(--primary-dark)", border:"1px solid var(--primary)" }}>
      {children}
    </span>
  );
}
