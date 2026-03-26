"use client";

import { useState, useEffect } from "react";
import { supabase }            from "../../../lib/supabase";

export default function ProfilePostsPanel({ posts = [], userId }) {
  const [activeTab, setActiveTab] = useState("posts");
  const [saved,     setSaved]     = useState([]);
  const [selected,  setSelected]  = useState(null);

  useEffect(() => {
    if (activeTab === "saved" && userId) {
      supabase
        .from("post_saves")
        .select("post_id, posts(id, caption, image_url, tags)")
        .eq("user_id", userId)
        .then(({ data }) => setSaved((data ?? []).map(r => r.posts).filter(Boolean)));
    }
  }, [activeTab, userId]);

  const displayPosts = activeTab === "posts" ? posts : saved;

  return (
    <div style={{
      background: "var(--soft-white)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      overflow: "hidden",
      boxShadow: "var(--shadow-soft)",
    }}>

      {/* ── Tabs ── */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-soft)",
      }}>
        {["posts", ...(userId ? ["saved"] : [])].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "15px",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeTab === tab ? "var(--accent-dark)" : "transparent"}`,
              color: activeTab === tab ? "var(--accent-dark)" : "var(--text-light)",
              transition: "var(--transition)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            }}
            onMouseEnter={e => activeTab !== tab && (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={e => activeTab !== tab && (e.currentTarget.style.color = "var(--text-light)")}
          >
            {tab === "posts"
              ? <><GridIcon /> Posts ({posts.length})</>
              : <><BookmarkIcon /> Saved</>
            }
          </button>
        ))}
      </div>

      {/* ── Grid or empty ── */}
      {displayPosts.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          padding: 3,
        }}>
          {displayPosts.map(post => (
            <PostThumb key={post.id} post={post} onClick={() => setSelected(post)} />
          ))}
        </div>
      )}

      {selected && <PostDetailModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PostThumb({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%", /* forces square via padding trick */
        background: "var(--card-bg)",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: "var(--radius-sm)",
        transition: "var(--transition)",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.80"; e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
    >
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.caption}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", display: "block",
          }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 5, padding: 10,
        }}>
          <span style={{ fontSize: 22 }}>🐾</span>
          <span style={{
            fontSize: 10, color: "var(--text-secondary)",
            textAlign: "center", lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            fontFamily: "var(--font-body)",
          }}>
            {post.caption}
          </span>
        </div>
      )}
    </div>
  );
}

function PostDetailModal({ post, onClose }) {
  return (
    <>
      <style>{`
        @keyframes modalFadeIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .post-modal-inner { animation: modalFadeIn 0.28s cubic-bezier(0.34,1.1,0.64,1) forwards; }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(60,45,30,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          className="post-modal-inner"
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--soft-white)",
            borderRadius: "var(--radius-xl)",
            width: "100%",
            maxWidth: 440,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 32px 80px rgba(60,40,20,0.20)",
            border: "1px solid var(--border)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              background: "rgba(127,85,57,0.18)",
              backdropFilter: "blur(4px)",
              border: "none",
              borderRadius: "50%",
              width: 30, height: 30,
              color: "var(--soft-white)",
              cursor: "pointer",
              fontSize: 13,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 1,
              transition: "var(--transition)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(127,85,57,0.40)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(127,85,57,0.18)"}
          >
            ✕
          </button>

          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.caption}
              style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }}
            />
          )}

          <div style={{ padding: "18px 20px" }}>
            <p style={{
              fontSize: 14,
              color: "var(--text-primary)",
              lineHeight: 1.75,
              marginBottom: 14,
              fontFamily: "var(--font-body)",
              fontWeight: 300,
            }}>
              {post.caption}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(post.tags ?? []).map(tag => (
                <span key={tag} style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "3px 11px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--card-bg)",
                  color: "var(--accent-dark)",
                  border: "1px solid var(--border-strong)",
                  letterSpacing: "0.03em",
                  fontFamily: "var(--font-body)",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyState({ tab }) {
  return (
    <div style={{ padding: "64px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 44, marginBottom: 14 }}>🐾</div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 20, fontWeight: 300,
        color: "var(--accent-dark)",
        marginBottom: 8,
      }}>
        {tab === "posts" ? "No posts yet" : "No saved posts"}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.65 }}>
        {tab === "posts"
          ? "Share your first moment with the pack!"
          : "Save posts you love to find them later"}
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 2h8a1 1 0 011 1v11l-5-2.5L3 14V3a1 1 0 011-1z" />
    </svg>
  );
}
