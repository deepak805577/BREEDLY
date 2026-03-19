"use client";

import { useState } from "react";

export default function ProfilePostsGrid({ posts = [] }) {
  const [selected, setSelected] = useState(null);

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px", fontFamily: "'Nunito', sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
        <div style={{ fontWeight: 800, fontSize: 16, color: "#3B4FC8", marginBottom: 6 }}>No posts yet</div>
        <div style={{ fontSize: 13, color: "#B7A5C4", fontWeight: 600 }}>Share your first moment with the pack!</div>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 2, padding: 2 }}>
        {posts.map(post => (
          <div
            key={post.id}
            onClick={() => setSelected(post)}
            style={{
              aspectRatio: "1", background: post.image_url ? "transparent" : "#F3EAF6",
              overflow: "hidden", cursor: "pointer", position: "relative",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {post.image_url ? (
              <img src={post.image_url} alt={post.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8 }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>🐾</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9B8AAB", textAlign: "center", fontFamily: "'Nunito', sans-serif", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                  {post.caption}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post detail modal */}
      {selected && (
        <PostDetailModal post={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function PostDetailModal({ post, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(40,30,60,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 420, overflow: "hidden", position: "relative" }}>

        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>✕</button>

        {post.image_url && (
          <img src={post.image_url} alt={post.caption} style={{ width: "100%", maxHeight: 320, objectFit: "cover", display: "block" }} />
        )}

        <div style={{ padding: "14px 16px" }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#2D2340", lineHeight: 1.6, fontFamily: "'Nunito', sans-serif", marginBottom: 10 }}>
            {post.caption}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(post.tags ?? []).map(tag => (
              <span key={tag} style={{ fontSize: 12, fontWeight: 700, color: "#3B4FC8", background: "#E8ECFF", padding: "3px 10px", borderRadius: 20, fontFamily: "'Nunito', sans-serif" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
