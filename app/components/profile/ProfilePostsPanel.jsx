"use client";

import { useState, useEffect } from "react";
import { supabase }            from "../../../lib/supabase";

export default function ProfilePostsPanel({ posts = [], userId }) {
  const [activeTab,  setActiveTab]  = useState("posts");
  const [saved,      setSaved]      = useState([]);
  const [selected,   setSelected]   = useState(null);

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
    <div style={{ background:"var(--surface)", borderRadius:"var(--radius-xl)", border:"1.5px solid var(--border)", overflow:"hidden" }}>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)" }}>
        {["posts", ...(userId ? ["saved"] : [])].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex:1, padding:"14px", textAlign:"center",
              fontSize:13, fontWeight:500, cursor:"pointer",
              fontFamily:"var(--font-body)",
              background:"none", border:"none",
              borderBottom:`2.5px solid ${activeTab === tab ? "var(--primary-dark)" : "transparent"}`,
              color: activeTab === tab ? "var(--primary-dark)" : "var(--muted)",
              transition:"all 0.15s", display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            }}
            onMouseEnter={e => activeTab !== tab && (e.currentTarget.style.background = "var(--bg)")}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            {tab === "posts"
              ? <><GridIcon /> Posts ({posts.length})</>
              : <><BookmarkIcon /> Saved</>
            }
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayPosts.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, padding:2 }}>
          {displayPosts.map(post => (
            <PostThumb key={post.id} post={post} onClick={() => setSelected(post)} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && <PostDetailModal post={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PostThumb({ post, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ aspectRatio:"1", background:"var(--bg)", overflow:"hidden", cursor:"pointer", position:"relative", transition:"opacity 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.opacity="0.82"}
      onMouseLeave={e => e.currentTarget.style.opacity="1"}
    >
      {post.image_url ? (
        <img src={post.image_url} alt={post.caption} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
      ) : (
        <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, padding:8 }}>
          <span style={{ fontSize:22 }}>🐾</span>
          <span style={{ fontSize:10, color:"var(--muted)", textAlign:"center", lineHeight:1.3, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical" }}>
            {post.caption}
          </span>
        </div>
      )}
    </div>
  );
}

function PostDetailModal({ post, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(60,45,30,0.5)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"var(--surface)", borderRadius:"var(--radius-xl)", width:"100%", maxWidth:440, overflow:"hidden", position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.2)", border:"none", borderRadius:"50%", width:28, height:28, color:"#fff", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>✕</button>
        {post.image_url && (
          <img src={post.image_url} alt={post.caption} style={{ width:"100%", maxHeight:320, objectFit:"cover", display:"block" }} />
        )}
        <div style={{ padding:"16px 18px" }}>
          <p style={{ fontSize:14, color:"var(--text)", lineHeight:1.65, marginBottom:12, fontFamily:"var(--font-body)" }}>{post.caption}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {(post.tags ?? []).map(tag => (
              <span key={tag} style={{ fontSize:12, fontWeight:500, padding:"3px 11px", borderRadius:"var(--radius-pill)", background:"var(--bg)", color:"var(--muted)", border:"1px solid var(--border)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }) {
  return (
    <div style={{ padding:"56px 24px", textAlign:"center" }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🐾</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:18, color:"var(--primary-dark)", marginBottom:6 }}>
        {tab === "posts" ? "No posts yet" : "No saved posts"}
      </div>
      <div style={{ fontSize:13, color:"var(--muted)" }}>
        {tab === "posts" ? "Share your first moment with the pack!" : "Save posts you love to find them later"}
      </div>
    </div>
  );
}

function GridIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
}
function BookmarkIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 2h8a1 1 0 011 1v11l-5-2.5L3 14V3a1 1 0 011-1z"/></svg>;
}
