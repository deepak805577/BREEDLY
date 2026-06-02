"use client";

import { useRef, useState } from "react";

export default function ProfileCard({ profile, postCount, isOwnProfile, onEdit, onAvatarUpload }) {
  const fileRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);
  const initials = profile?.initials ?? profile?.full_name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="profile-card-container">
      <style>{`
        .profile-card-container {
          background: var(--soft-white);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(127, 85, 57, 0.04);
          transition: var(--transition);
          width: 100%;
        }
        .profile-card-container:hover {
          box-shadow: 0 20px 50px rgba(127, 85, 57, 0.08);
          transform: translateY(-2px);
        }
        
        @keyframes gradientBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .profile-cover {
          height: 160px;
          background: linear-gradient(-45deg, #F0E6D8, #E8D8C4, #DFC9AE, #E8D8C4);
          background-size: 400% 400%;
          animation: gradientBg 15s ease infinite;
          position: relative;
          overflow: hidden;
          transition: var(--transition);
        }
        .profile-header-body {
          padding: 24px 32px 32px;
          display: flex;
          gap: 36px;
          margin-top: -48px;
          position: relative;
          z-index: 2;
        }
        .profile-left-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .profile-right-col {
          width: 230px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 12px;
          margin-top: 48px; /* Aligns visually below cover overlap */
          flex-shrink: 0;
        }
        .profile-avatar-wrapper {
          position: relative;
          margin-bottom: 16px;
        }
        .profile-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--card-bg);
          border: 4px solid var(--soft-white);
          box-shadow: 0 8px 24px rgba(127,85,57,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 300;
          color: var(--accent-dark);
          overflow: hidden;
          flex-shrink: 0;
          cursor: pointer;
          transition: var(--transition);
        }
        .profile-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(127,85,57,0.28);
          border-color: var(--card-lite);
        }
        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .profile-display-name {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 300;
          color: var(--accent-dark);
          line-height: 1.2;
        }
        .profile-post-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--accent-dark);
          background: rgba(176,137,104,0.12);
          border: 1px solid rgba(176,137,104,0.24);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-family: var(--font-body);
        }
        .profile-username {
          font-size: 13px;
          color: var(--text-light);
          margin-bottom: 14px;
          letter-spacing: 0.02em;
          font-family: var(--font-body);
        }
        .profile-bio {
          font-size: 14px;
          line-height: 1.75;
          color: var(--text-secondary);
          margin-bottom: 22px;
          font-family: var(--font-body);
          font-weight: 300;
        }
        .profile-actions {
          display: flex;
          gap: 8px;
        }
        .dog-info-card-header {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
          font-family: var(--font-body);
        }

        /* Avatar Preview Lightbox Overlay */
        .avatar-preview-overlay {
          position: fixed;
          inset: 0;
          background: rgba(40, 28, 20, 0.78);
          backdrop-filter: blur(14px) saturate(180%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 24px;
        }
        .avatar-preview-container {
          position: relative;
          max-width: 400px;
          width: 90%;
          aspect-ratio: 1;
          background: var(--soft-white);
          border-radius: 50%;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.35);
          border: 6px solid var(--soft-white);
          overflow: hidden;
          transform: scale(0.9);
          animation: scaleUp 0.32s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-preview-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-preview-initials {
          font-family: var(--font-display);
          font-size: 120px;
          font-weight: 300;
          color: var(--accent-dark);
          background: var(--card-bg);
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-preview-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(250, 247, 242, 0.12);
          border: 1px solid rgba(250, 247, 242, 0.2);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--soft-white);
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
        }
        .avatar-preview-close:hover {
          background: var(--soft-white);
          color: var(--accent-dark);
          transform: rotate(90deg);
        }
        .avatar-preview-info {
          margin-top: 24px;
          text-align: center;
          color: var(--soft-white);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .avatar-preview-name {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 300;
          margin-bottom: 4px;
          color: var(--soft-white);
        }
        .avatar-preview-username {
          font-size: 14px;
          color: var(--card-lite);
          opacity: 0.9;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); }
          to { transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .profile-header-body {
            flex-direction: column;
            gap: 20px;
            align-items: center;
            text-align: center;
            padding: 16px;
          }
          .profile-left-col {
            align-items: center;
            width: 100%;
          }
          .profile-right-col {
            width: 100%;
            max-width: 260px;
            margin-top: 0;
          }
          .profile-name-row {
            justify-content: center;
          }
          .profile-bio {
            max-width: 100%;
          }
          .profile-actions {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      {/* ── Cover ── */}
      <div className="profile-cover">
        {/* Subtle dot texture */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.25 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profile-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#B08968" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profile-dots)" />
        </svg>
        {/* Soft radial glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 30% 60%, rgba(176,137,104,0.22) 0%, transparent 65%)",
        }} />
      </div>

      {/* ── Body ── */}
      <div className="profile-header-body">
        {/* Left Column (User details) */}
        <div className="profile-left-col">
          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <div 
              className="profile-avatar" 
              onClick={() => setShowPreview(true)}
              title="Click to preview photo"
            >
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
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "var(--accent-dark)",
                    border: "2px solid var(--soft-white)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
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

          {/* Name & Post Count Badge */}
          <div className="profile-name-row">
            <h1 className="profile-display-name">
              {profile?.full_name ?? "Dog Lover"}
            </h1>
            <span className="profile-post-badge">
              {postCount} {postCount === 1 ? "post" : "posts"}
            </span>
          </div>

          {/* Username */}
          {profile?.username && (
            <div className="profile-username">
              @{profile.username}
            </div>
          )}

          {/* Bio */}
          {profile?.bio && (
            <p className="profile-bio">
              {profile.bio}
            </p>
          )}

          {/* Actions */}
          <div className="profile-actions">
            {isOwnProfile ? (
              <button
                onClick={onEdit}
                style={{
                  padding: "10px 22px",
                  background: "none",
                  border: "1.5px solid var(--border-strong)",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
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
                Edit Profile
              </button>
            ) : (
              <button
                style={{
                  padding: "10px 26px",
                  background: "var(--accent-dark)",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13, fontWeight: 500,
                  color: "var(--soft-white)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                  letterSpacing: "0.02em",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-dark)"; e.currentTarget.style.transform = "none"; }}
              >
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Right Column (Dog Card) */}
        <div className="profile-right-col">
          {(profile?.dog_name || profile?.primary_breed || profile?.dog_age) ? (
            <div>
              <div className="dog-info-card-header">Canine Companion</div>
              <div style={{
                background: "var(--bg-soft)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                padding: "12px 14px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(100,70,40,0.03)",
                transition: "var(--transition)",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                <div style={{
                  width: 42, height: 42,
                  borderRadius: "50%",
                  background: "var(--card-bg)",
                  border: "1.5px solid var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                  color: "var(--accent-dark)",
                }}>
                  {profile?.dog_photo_url
                    ? <img src={profile.dog_photo_url} alt={profile.dog_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5c-1.5 0-3 1-3.5 2.5a3 3 0 0 0-4.5 3c0 2 1.5 3.5 3 4v1c0 2 1.5 3 3.5 3s3.5-1 3.5-3v-1c1.5-.5 3-2 3-4a3 3 0 0 0-4.5-3C15 6 13.5 5 12 5z" /><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/><path d="M11 13a1 1 0 0 1 2 0"/></svg>
                  }
                </div>
                <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                  {profile?.dog_name && (
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15, fontWeight: 500,
                      color: "var(--accent-dark)",
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {profile.dog_name}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    {profile?.primary_breed && <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-body)" }}>{profile.primary_breed}</span>}
                    {profile?.primary_breed && profile?.dog_age && <span style={{ fontSize: 10, color: "var(--text-light)" }}>•</span>}
                    {profile?.dog_age       && <span style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, fontFamily: "var(--font-body)" }}>{profile.dog_age} {profile.dog_age === 1 ? "yr" : "yrs"}</span>}
                  </div>
                </div>
              </div>
            </div>
          ) : isOwnProfile ? (
            <div>
              <div className="dog-info-card-header">Canine Companion</div>
              <div
                onClick={onEdit}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === "Enter" && onEdit()}
                style={{
                  background: "var(--bg-soft)",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px dashed var(--border-strong)",
                  padding: "12px 14px",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--card-lite)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--bg-soft)"; }}
              >
                <div style={{
                  width: 36, height: 36,
                  borderRadius: "50%",
                  background: "var(--card-bg)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  color: "var(--accent-dark)",
                  opacity: 0.8,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--accent-dark)", fontFamily: "var(--font-body)" }}>
                    Add dog info
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-light)" }}>Name, breed, age &amp; photo</div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Avatar Lightbox Preview Modal ── */}
      {showPreview && (
        <div 
          className="avatar-preview-overlay"
          onClick={() => setShowPreview(false)}
        >
          <button 
            className="avatar-preview-close" 
            onClick={() => setShowPreview(false)}
            aria-label="Close preview"
          >
            ✕
          </button>
          
          <div 
            className="avatar-preview-container"
            onClick={e => e.stopPropagation()}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || "Profile Picture"} />
            ) : (
              <div className="avatar-preview-initials">
                {initials}
              </div>
            )}
          </div>
          
          <div className="avatar-preview-info">
            <h2 className="avatar-preview-name">{profile?.full_name ?? "Dog Lover"}</h2>
            {profile?.username && (
              <div className="avatar-preview-username">@{profile.username}</div>
            )}
          </div>
        </div>
      )}
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
      fontFamily: "var(--font-body)",
    }}>
      {children}
    </span>
  );
}

function CameraIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="#FAF7F2" strokeWidth="1.6">
      <rect x="1" y="3" width="12" height="9" rx="1.5" />
      <circle cx="7" cy="7.5" r="2" />
      <path d="M5 3l1-2h2l1 2" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M11 2l3 3-9 9H2v-3l9-9z" />
    </svg>
  );
}
