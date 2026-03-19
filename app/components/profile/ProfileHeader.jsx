"use client";

import { useRef } from "react";

export default function ProfileHeader({ profile, postCount, isOwnProfile, onEdit, onAvatarUpload }) {
  const fileRef = useRef(null);
  const initials = profile?.initials ?? profile?.full_name?.[0]?.toUpperCase() ?? "?";
  const color    = profile?.avatar_color ?? "#FFD54F";

  return (
    <div style={{ background: "#fff", borderBottom: "1.5px solid #F0E0EC" }}>

      {/* ── Top section: avatar + stats ── */}
      <div style={{ padding: "24px 20px 16px", display: "flex", alignItems: "flex-start", gap: 20 }}>

        {/* Avatar with upload button */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 88, height: 88, borderRadius: "50%",
            background: color, border: "3px solid #FFD54F",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 28, color: "#6B4C00",
            fontFamily: "'Nunito', sans-serif", overflow: "hidden",
          }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials
            }
          </div>
          {isOwnProfile && (
            <>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, borderRadius: "50%", background: "#3B4FC8", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}
              >📷</button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => onAvatarUpload(e.target.files[0])} />
            </>
          )}
        </div>

        {/* Stats + action button */}
        <div style={{ flex: 1, paddingTop: 6 }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
            <Stat value={postCount} label="Posts" />
            <Stat value="—" label="Followers" />
            <Stat value="—" label="Following" />
          </div>
          {isOwnProfile ? (
            <button
              onClick={onEdit}
              style={{ width: "100%", padding: "8px 0", border: "2px solid #EDD8F5", borderRadius: 12, background: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#3B4FC8", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#F3EAF6"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              Edit Profile
            </button>
          ) : (
            <button style={{ width: "100%", padding: "8px 0", border: "none", borderRadius: 12, background: "#3B4FC8", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: "#fff", cursor: "pointer" }}>
              Follow
            </button>
          )}
        </div>
      </div>

      {/* ── Name + username + bio ── */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#2D2340", fontFamily: "'Nunito', sans-serif" }}>
          {profile?.full_name ?? "Dog Lover"}
        </div>
        {profile?.username && (
          <div style={{ fontSize: 13, color: "#9B8AAB", fontWeight: 600, fontFamily: "'Nunito', sans-serif", marginTop: 2 }}>
            @{profile.username}
          </div>
        )}
        {profile?.bio && (
          <p style={{ fontSize: 13, color: "#5A4D6E", fontWeight: 600, marginTop: 8, lineHeight: 1.6, fontFamily: "'Nunito', sans-serif" }}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* ── Dog info card ── */}
      {(profile?.dog_name || profile?.primary_breed || profile?.dog_age || profile?.dog_photo_url) && (
        <div style={{ margin: "0 16px 16px", background: "#FBF2F8", borderRadius: 18, border: "2px solid #EDD8F5", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>

          {/* Dog photo */}
          <div style={{
            width: 58, height: 58, borderRadius: 14, flexShrink: 0,
            background: "#F3EAF6", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #FFD54F", fontSize: 28,
          }}>
            {profile?.dog_photo_url
              ? <img src={profile.dog_photo_url} alt={profile.dog_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "🐶"
            }
          </div>

          {/* Dog details */}
          <div style={{ flex: 1 }}>
            {profile?.dog_name && (
              <div style={{ fontWeight: 900, fontSize: 15, color: "#2D2340", fontFamily: "'Nunito', sans-serif" }}>
                {profile.dog_name}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5 }}>
              {profile?.primary_breed && (
                <span style={{ fontSize: 11, fontWeight: 800, background: "#FFD54F", color: "#6B4C00", padding: "3px 10px", borderRadius: 20, fontFamily: "'Nunito', sans-serif" }}>
                  {profile.primary_breed}
                </span>
              )}
              {profile?.dog_age && (
                <span style={{ fontSize: 11, fontWeight: 800, background: "#E8ECFF", color: "#3B4FC8", padding: "3px 10px", borderRadius: 20, fontFamily: "'Nunito', sans-serif" }}>
                  {profile.dog_age} {profile.dog_age === 1 ? "year" : "years"} old
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder if no dog info and own profile */}
      {isOwnProfile && !profile?.dog_name && !profile?.primary_breed && (
        <div
          onClick={onEdit}
          style={{ margin: "0 16px 16px", background: "#F9F2FC", borderRadius: 18, border: "2px dashed #EDD8F5", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
        >
          <span style={{ fontSize: 32 }}>🐶</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#3B4FC8", fontFamily: "'Nunito', sans-serif" }}>Add your dog's info</div>
            <div style={{ fontSize: 12, color: "#C4AED4", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>Name, breed, age & photo</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 18, color: "#2D2340", fontFamily: "'Nunito', sans-serif" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#9B8AAB", fontWeight: 600, fontFamily: "'Nunito', sans-serif" }}>{label}</div>
    </div>
  );
}
