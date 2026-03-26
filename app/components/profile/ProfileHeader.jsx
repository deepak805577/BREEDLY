"use client";

import { useRef } from "react";

/**
 * ProfileHeader — mobile-first header layout (avatar top-left, stats top-right).
 * Uses the Breedly design system tokens defined in UserProfile.jsx's <style> block.
 */
export default function ProfileHeader({ profile, postCount, isOwnProfile, onEdit, onAvatarUpload }) {
  const fileRef = useRef(null);
  const initials = profile?.initials ?? profile?.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div style={{
      background: "var(--soft-white)",
      borderBottom: "1px solid var(--border)",
    }}>

      {/* ── Top row: avatar + stats + action ── */}
      <div style={{
        padding: "22px 20px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
      }}>

        {/* Avatar with upload button */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 86, height: 86,
            borderRadius: "50%",
            background: "var(--card-bg)",
            border: "3px solid var(--accent)",
            boxShadow: "0 4px 18px rgba(127,85,57,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontWeight: 300, fontSize: 26,
            color: "var(--accent-dark)",
            overflow: "hidden",
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
                  position: "absolute", bottom: 2, right: 2,
                  width: 27, height: 27,
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
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => onAvatarUpload(e.target.files[0])}
              />
            </>
          )}
        </div>

        {/* Stats + button */}
        <div style={{ flex: 1, paddingTop: 4 }}>
          <div style={{ display: "flex", gap: 24, marginBottom: 14 }}>
            <Stat value={postCount} label="Posts" />
            <Stat value="—" label="Followers" />
            <Stat value="—" label="Following" />
          </div>

          {isOwnProfile ? (
            <button
              onClick={onEdit}
              style={{
                width: "100%",
                padding: "9px 0",
                border: "1.5px solid var(--border-strong)",
                borderRadius: "var(--radius-pill)",
                background: "none",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 13,
                color: "var(--text-secondary)",
                cursor: "pointer",
                transition: "var(--transition)",
                letterSpacing: "0.02em",
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
              Edit Profile
            </button>
          ) : (
            <button
              style={{
                width: "100%",
                padding: "9px 0",
                border: "none",
                borderRadius: "var(--radius-pill)",
                background: "var(--accent-dark)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 13,
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
      </div>

      {/* ── Name / username / bio ── */}
      <div style={{ padding: "0 20px 16px" }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 17,
          color: "var(--accent-dark)",
          lineHeight: 1.25,
        }}>
          {profile?.full_name ?? "Dog Lover"}
        </div>

        {profile?.username && (
          <div style={{
            fontSize: 12,
            color: "var(--text-light)",
            marginTop: 2,
            letterSpacing: "0.02em",
          }}>
            @{profile.username}
          </div>
        )}

        {profile?.bio && (
          <p style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            fontWeight: 300,
            marginTop: 8,
            lineHeight: 1.70,
            fontFamily: "var(--font-body)",
          }}>
            {profile.bio}
          </p>
        )}
      </div>

      {/* ── Dog info card ── */}
      {(profile?.dog_name || profile?.primary_breed || profile?.dog_age || profile?.dog_photo_url) && (
        <div style={{
          margin: "0 16px 16px",
          background: "var(--bg-soft)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          padding: "13px 15px",
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: "var(--radius-sm)",
            background: "var(--card-bg)",
            border: "1.5px solid var(--accent)",
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, flexShrink: 0,
          }}>
            {profile?.dog_photo_url
              ? <img src={profile.dog_photo_url} alt={profile.dog_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : "🐶"
            }
          </div>

          <div style={{ flex: 1 }}>
            {profile?.dog_name && (
              <div style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: 15,
                color: "var(--accent-dark)",
                marginBottom: 6,
              }}>
                {profile.dog_name}
              </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {profile?.primary_breed && (
                <Badge>{profile.primary_breed}</Badge>
              )}
              {profile?.dog_age && (
                <Badge>{profile.dog_age} {profile.dog_age === 1 ? "yr" : "yrs"}</Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Empty dog prompt ── */}
      {isOwnProfile && !profile?.dog_name && !profile?.primary_breed && (
        <div
          onClick={onEdit}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && onEdit()}
          style={{
            margin: "0 16px 16px",
            background: "var(--bg-soft)",
            borderRadius: "var(--radius-md)",
            border: "1.5px dashed var(--border-strong)",
            padding: "13px 15px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--card-lite)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
        >
          <span style={{ fontSize: 30 }}>🐶</span>
          <div>
            <div style={{
              fontWeight: 500,
              fontSize: 13,
              color: "var(--accent-dark)",
              fontFamily: "var(--font-body)",
              marginBottom: 2,
            }}>
              Add your dog's info
            </div>
            <div style={{ fontSize: 12, color: "var(--text-light)" }}>
              Name, breed, age &amp; photo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontWeight: 300,
        fontSize: 20,
        color: "var(--accent-dark)",
        lineHeight: 1.1,
      }}>{value}</div>
      <div style={{
        fontSize: 10,
        color: "var(--text-light)",
        marginTop: 3,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        fontFamily: "var(--font-body)",
      }}>{label}</div>
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
      padding: "3px 10px",
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
