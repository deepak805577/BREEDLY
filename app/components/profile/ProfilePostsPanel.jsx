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
        .select("post_id, posts(id, caption, image_url, tags, created_at)")
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
      boxShadow: "0 8px 30px rgba(100,70,40,0.03)",
    }}>
      <style>{`
        .tab-button {
          flex: 1;
          padding: 18px 15px;
          text-align: center;
          fontSize: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: var(--font-body);
          background: none;
          border: none;
          color: var(--text-light);
          position: relative;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tab-button.active {
          color: var(--accent-dark);
        }
        .tab-button::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 15%;
          width: 70%;
          height: 3px;
          border-radius: 2px 2px 0 0;
          background: var(--accent-dark);
          transform: scaleX(0);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-button.active::after {
          transform: scaleX(1);
        }
        
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 24px;
        }
        @media (max-width: 576px) {
          .posts-grid {
            gap: 6px;
            padding: 8px;
          }
        }
      `}</style>

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
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
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
        <div className="posts-grid">
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
    <>
      <style>{`
        .post-thumb-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          background: var(--card-bg);
          overflow: hidden;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 4px 12px rgba(127, 85, 57, 0.04);
        }
        .post-thumb-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(127, 85, 57, 0.12);
        }
        .post-thumb-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .post-thumb-wrapper:hover .post-thumb-img {
          transform: scale(1.08);
        }
        .post-thumb-overlay {
          position: absolute;
          inset: 0;
          background: rgba(127, 85, 57, 0.42);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
          color: var(--soft-white);
        }
        .post-thumb-wrapper:hover .post-thumb-overlay {
          opacity: 1;
        }
        .post-thumb-text-card {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--card-lite) 0%, var(--bg-soft) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .post-thumb-wrapper:hover .post-thumb-text-card {
          background: linear-gradient(135deg, var(--soft-white) 0%, var(--card-lite) 100%);
        }
      `}</style>
      <div onClick={onClick} className="post-thumb-wrapper">
        {post.image_url ? (
          <>
            <img
              className="post-thumb-img"
              src={post.image_url}
              alt={post.caption}
            />
            <div className="post-thumb-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
          </>
        ) : (
          <div className="post-thumb-text-card">
            <div style={{ color: "var(--accent-dark)", opacity: 0.65 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
            </div>
            <span style={{
              fontSize: 11, color: "var(--text-primary)",
              textAlign: "center", lineHeight: 1.45,
              fontWeight: 500,
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
    </>
  );
}

function PostDetailModal({ post, onClose }) {
  return (
    <>
      <style>{`
        @keyframes backdropFadeIn {
          from { background: rgba(50,35,20,0); backdrop-filter: blur(0px); }
          to   { background: rgba(50,35,20,0.55); backdrop-filter: blur(6px); }
        }
        @keyframes modalFadeIn { 
          from { opacity: 0; transform: scale(0.96) translateY(12px); } 
          to   { opacity: 1; transform: scale(1) translateY(0); } 
        }
        
        .post-modal-overlay {
          position: fixed; inset: 0;
          z-index: 2000;
          display: flex; alignItems: center; justifyContent: center;
          padding: 24px;
          animation: backdropFadeIn 0.28s ease-out forwards;
        }
        
        .post-modal-inner { 
          display: flex;
          background: var(--soft-white);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 800px;
          height: 520px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 32px 80px rgba(60, 40, 20, 0.24);
          border: 1px solid var(--border);
          animation: modalFadeIn 0.32s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
        }
        
        .post-detail-media {
          flex: 1.25;
          background: #000;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .post-detail-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .post-detail-media-text {
          flex: 1.25;
          background: linear-gradient(135deg, var(--card-lite) 0%, var(--bg-soft) 100%);
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          text-align: center;
        }
        .post-text-decor {
          position: absolute;
          font-family: var(--font-display);
          font-size: 260px;
          line-height: 1;
          color: var(--accent);
          opacity: 0.08;
          top: -20px;
          left: 20px;
          pointer-events: none;
        }
        .post-text-preview {
          font-family: var(--font-display);
          font-size: 20px;
          font-style: italic;
          color: var(--accent-dark);
          line-height: 1.6;
          z-index: 1;
          font-weight: 300;
        }
        
        .post-detail-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 32px;
          height: 100%;
          overflow-y: auto;
          background: var(--soft-white);
          border-left: 1px solid var(--border);
        }
        
        @media (max-width: 768px) {
          .post-modal-overlay {
            padding: 16px;
          }
          .post-modal-inner {
            flex-direction: column;
            height: auto;
            max-height: 85vh;
            max-width: 440px;
          }
          .post-detail-media, .post-detail-media-text {
            flex: none;
            height: 260px;
            width: 100%;
          }
          .post-detail-media-text {
            padding: 24px;
          }
          .post-text-preview {
            font-size: 16px;
          }
          .post-detail-content {
            flex: none;
            height: auto;
            border-left: none;
            border-top: 1px solid var(--border);
            padding: 24px;
          }
        }
      `}</style>
      <div className="post-modal-overlay" onClick={onClose}>
        <div className="post-modal-inner" onClick={e => e.stopPropagation()}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(50, 35, 20, 0.45)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              width: 32, height: 32,
              color: "#FFF",
              cursor: "pointer",
              fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 10,
              transition: "var(--transition)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--accent-dark)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(50, 35, 20, 0.45)"}
          >
            ✕
          </button>

          {/* Left panel */}
          {post.image_url ? (
            <div className="post-detail-media">
              <img src={post.image_url} alt={post.caption} />
            </div>
          ) : (
            <div className="post-detail-media-text">
              <div className="post-text-decor">“</div>
              <p className="post-text-preview">
                {post.caption.length > 120 ? `${post.caption.slice(0, 120)}...` : post.caption}
              </p>
            </div>
          )}

          {/* Right panel */}
          <div className="post-detail-content">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--soft-white)" }}><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3z"/></svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-dark)", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>Breedly Member</span>
            </div>
            
            <p style={{
              fontSize: 14,
              color: "var(--text-primary)",
              lineHeight: 1.75,
              marginBottom: 20,
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              whiteSpace: "pre-wrap",
            }}>
              {post.caption}
            </p>

            <div style={{ marginTop: "auto" }}>
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 12px",
                      borderRadius: "var(--radius-pill)",
                      background: "rgba(176,137,104,0.12)",
                      color: "var(--accent-dark)",
                      border: "1px solid rgba(176,137,104,0.18)",
                      letterSpacing: "0.03em",
                      fontFamily: "var(--font-body)",
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Date */}
              {post.created_at && (
                <div style={{ 
                  fontSize: 11, 
                  color: "var(--text-light)", 
                  fontWeight: 500, 
                  fontFamily: "var(--font-body)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                }}>
                  Posted on {new Date(post.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyState({ tab }) {
  return (
    <div style={{ 
      padding: "80px 24px", 
      textAlign: "center",
      background: "rgba(239, 231, 219, 0.2)",
    }}>
      <div style={{ marginBottom: 16, color: "var(--accent)", display: "flex", justifyContent: "center" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.65 }}><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
      </div>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 22, fontWeight: 300,
        color: "var(--accent-dark)",
        marginBottom: 8,
      }}>
        {tab === "posts" ? "No posts shared yet" : "No saved posts"}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: 300, margin: "0 auto" }}>
        {tab === "posts"
          ? "Share your canine adventures and connect with the pack!"
          : "Keep track of posts you love by saving them"}
      </div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 2h8a1 1 0 011 1v11l-5-2.5L3 14V3a1 1 0 011-1z" />
    </svg>
  );
}
