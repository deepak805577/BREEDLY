"use client";

import { useState } from "react";

/**
 * ProfilePostsGrid — single-column post list for mobile profile view.
 * Uses Breedly design tokens from UserProfile.jsx's :root block.
 */
export default function ProfilePostsGrid({ posts = [] }) {
  const [selected, setSelected] = useState(null);

  if (posts.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "64px 24px",
        fontFamily: "var(--font-body)",
      }}>
        <div style={{ marginBottom: 14, color: "var(--accent-dark)", display: "flex", justifyContent: "center" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.8 }}><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
        </div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 20, fontWeight: 300,
          color: "var(--accent-dark)",
          marginBottom: 8,
        }}>
          No posts yet
        </div>
        <div style={{ fontSize: 13, color: "var(--text-light)", lineHeight: 1.65 }}>
          Share your first moment with the pack!
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Grid — 1 column on mobile, 3 columns on larger screens */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 3,
        padding: 3,
      }}>
        {posts.map(post => (
          <div
            key={post.id}
            onClick={() => setSelected(post)}
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "100%",
              background: post.image_url ? "transparent" : "var(--card-bg)",
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
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: 8, gap: 5,
              }}>
                <div style={{ color: "var(--accent)", opacity: 0.5, display: "flex", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
                </div>
                <div style={{
                  fontSize: 10,
                  color: "var(--text-secondary)",
                  textAlign: "center",
                  lineHeight: 1.4,
                  fontFamily: "var(--font-body)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}>
                  {post.caption}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <PostDetailModal post={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function PostDetailModal({ post, onClose }) {
  return (
    <>
      <style>{`
        @keyframes gridModalIn { from { opacity:0; transform:scale(0.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .grid-modal-inner { animation: gridModalIn 0.28s cubic-bezier(0.34,1.1,0.64,1) forwards; }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(50,35,20,0.55)",
          backdropFilter: "blur(4px)",
          zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
      >
        <div
          className="grid-modal-inner"
          onClick={e => e.stopPropagation()}
          style={{
            background: "var(--soft-white)",
            borderRadius: "var(--radius-xl)",
            width: "100%",
            maxWidth: 420,
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
          >✕</button>

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
              fontWeight: 300,
              color: "var(--text-primary)",
              lineHeight: 1.75,
              marginBottom: 14,
              fontFamily: "var(--font-body)",
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
