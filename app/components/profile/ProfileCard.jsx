"use client";

import { useRef } from "react";

export default function ProfileCard({ profile, postCount, isOwnProfile, onEdit, onAvatarUpload }) {
  const fileRef = useRef(null);
  const initials = profile?.initials ?? profile?.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{
      background: "var(--soft-white)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow-soft)",
      transition: "var(--transition)",
    }}>

      {/* ── Cover ── */}
      <div style={{
        height: 120,
        background: "linear-gradient(135deg, #F0E6D8 0%, #E8D8C4 50%, #DFC9AE 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle dot texture */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#B08968" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        {/* Soft radial glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 60%, rgba(176,137,104,0.22) 0%, transparent 65%)",
        }} />
      </div>

      {/* ── Avatar row ── */}
      <div style={{
        padding: "0 20px",
        marginTop: -36,
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 16,
      }}>
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: "50%",
            background: "var(--card-bg)",
            border: "3px solid var(--soft-white)",
            boxShadow: "0 4px 16px rgba(127,85,57,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: 24, fontWeight: 300,
            color: "var(--accent-dark)",
            overflow: "hidden",
            flexShrink: 0,
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
                aria-label="Upload avatar"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 24, height: 24,
                  borderRadius: "50%",
                  background: "var(--accent-dark)",
                  border: "2px solid var(--soft-white)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--accent-dark)"}
              >
                <CameraIcon />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => onAvatarUpload(e.target.files[0])} />
            </>
          )}
        </div>

        {/* Action button */}
        {isOwnProfile ? (
          <button
            onClick={onEdit}
            style={{
              padding: "7px 18px",
              background: "none",
              border: "1.5px solid var(--border-strong)",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
              transition: "var(--transition)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--card-lite)";
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent-dark)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <EditIcon />
            Edit
          </button>
        ) : (
          <button
            style={{
              padding: "7px 20px",
              background: "var(--accent-dark)",
              border: "none",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)",
              fontSize: 12, fontWeight: 500,
              color: "var(--soft-white)",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-dark)"; e.currentTarget.style.transform = "none"; }}
          >
            Follow
          </button>
        )}
      </div>

      {/* ── Info ── */}
      <div style={{ padding: "0 20px 22px" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 300,
          color: "var(--accent-dark)",
          marginBottom: 3,
          lineHeight: 1.2,
        }}>
          {profile?.full_name ?? "Dog Lover"}
        </div>

        {profile?.username && (
          <div style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 10, letterSpacing: "0.02em" }}>
            @{profile.username}
          </div>
        )}

        {profile?.bio && (
          <p style={{ fontSize: 13, lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: 18 }}>
            {profile.bio}
          </p>
        )}

        {/* ── Stats ── */}
        <div style={{
          display: "flex",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "14px 0",
          marginBottom: 18,
        }}>
          {[
            { val: postCount, label: "Posts" },
            { val: "—",      label: "Followers" },
            { val: "—",      label: "Following" },
          ].map((s, i, arr) => (
            <div key={s.label} style={{
              flex: 1,
              textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontWeight: 300,
                color: "var(--accent-dark)",
              }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--text-light)", marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Dog card ── */}
        {(profile?.dog_name || profile?.primary_breed || profile?.dog_age) ? (
          <div style={{
            background: "var(--bg-soft)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            padding: "14px 15px",
            display: "flex",
            gap: 13,
            alignItems: "center",
          }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: "var(--radius-sm)",
              background: "var(--card-bg)",
              border: "1.5px solid var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
              overflow: "hidden",
            }}>
              {profile?.dog_photo_url
                ? <img src={profile.dog_photo_url} alt={profile.dog_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "🐶"
              }
            </div>
            <div>
              {profile?.dog_name && (
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15, fontWeight: 400,
                  color: "var(--accent-dark)",
                  marginBottom: 7,
                }}>
                  {profile.dog_name}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {profile?.primary_breed && <Badge>{profile.primary_breed}</Badge>}
                {profile?.dog_age       && <Badge>{profile.dog_age} {profile.dog_age === 1 ? "yr" : "yrs"}</Badge>}
              </div>
            </div>
          </div>
        ) : isOwnProfile ? (
          <div
            onClick={onEdit}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && onEdit()}
            style={{
              background: "var(--bg-soft)",
              borderRadius: "var(--radius-md)",
              border: "1.5px dashed var(--border-strong)",
              padding: "14px 15px",
              display: "flex",
              gap: 13,
              alignItems: "center",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--card-lite)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
          >
            <div style={{
              width: 52, height: 52,
              borderRadius: "var(--radius-sm)",
              background: "var(--card-bg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>🐾</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--accent-dark)", fontFamily: "var(--font-body)", marginBottom: 3 }}>
                Add your dog's info
              </div>
              <div style={{ fontSize: 12, color: "var(--text-light)" }}>Name, breed, age &amp; photo</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      fontSize: 11,
      fontWeight: 500,
      padding: "3px 11px",
      borderRadius: "var(--radius-pill)",
      background: "var(--card-bg)",
      color: "var(--accent-dark)",
      border: "1px solid var(--accent)",
      letterSpacing: "0.02em",
    }}>
      {children}
    </span>
  );
}

function CameraIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="#FAF7F2" strokeWidth="1.6">
      <rect x="1" y="3" width="12" height="9" rx="1.5" />
      <circle cx="7" cy="7.5" r="2" />
      <path d="M5 3l1-2h2l1 2" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" />
    </svg>
  );
}
