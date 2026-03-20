"use client";

import { useState, useRef } from "react";
import { addComment, fetchComments, deletePost } from "../../services/communityApi";

export default function PostCard({ post, onLike, onSave, onDelete, currentUserId, isNew }) {
  const [likeAnim, setLikeAnim] = useState(false);
  const [showCmts, setShowCmts] = useState(false);
  const [comments, setComments] = useState([]);
  const [cmtText, setCmtText] = useState("");
  const [loadingCmts, setLoadingCmts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cmtRef = useRef(null);

  const isOwner = currentUserId && post.userId === currentUserId;

  const handleLike = () => {
    setLikeAnim(true);
    onLike(post.id);
    setTimeout(() => setLikeAnim(false), 280);
  };

  const handleToggleCmts = async () => {
    const next = !showCmts;
    setShowCmts(next);
    if (next && comments.length === 0) {
      setLoadingCmts(true);
      try { setComments(await fetchComments(post.id)); }
      catch (e) { console.error(e); }
      finally { setLoadingCmts(false); setTimeout(() => cmtRef.current?.focus(), 80); }
    }
  };

  const handleSubmitCmt = async () => {
    if (!cmtText.trim()) return;
    try {
      const c = await addComment(post.id, cmtText.trim());
      setComments(prev => [...prev, c]);
      setCmtText("");
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deletePost(post.id); onDelete?.(post.id); }
    catch (e) { console.error(e); setDeleting(false); setShowConfirm(false); }
  };

  return (
    <div
      className={isNew ? "post-enter" : ""}
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.4)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: "0 6px 30px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 30px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image */}
      {/* IMAGE + OVERLAY UI */}
      <div style={{ position: "relative" }}>
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.caption}
            style={{
              width: "100%",
              height: 400,
              objectFit: "cover",
              display: "block",
            }}
          />
          
        ) : (
          <div style={{
            width: "100%",
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 50,
            background: "var(--bg)"
          }}>🐾</div>
        )}

        {/* 🔝 TOP OVERLAY */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
            }}>
              {post.user.initials}
            </div>

            <div style={{ color: "#fff" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{post.user.name}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{post.timeAgo}</div>
            </div>
          </div>

          <div style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.9)",
            fontWeight: 500
          }}>
            {post.breed}
          </div>
        </div>

        {/* 🔽 BOTTOM OVERLAY (Caption) */}

      </div>
      <div style={{ padding: "10px 12px 8px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 1 }}>
          {isOwner && (
            <div style={{ position: "absolute" }}>
              <button
                onClick={() => setShowMenu(v => !v)}
                style={{
                  background: "rgba(0,0,0,0.04)",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 10,
                  fontSize: 16,
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"}
              >
                ···
              </button>
              {showMenu && (
                <div style={{ position: "absolute", right: 0, top: 30, background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-md)", padding: 6, zIndex: 10, minWidth: 140, boxShadow: "0 4px 16px rgba(166,123,91,0.12)" }}>
                  <button
                    onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    style={{ width: "100%", padding: "9px 12px", background: "none", border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, color: "var(--danger,#c0635a)", display: "flex", alignItems: "center", gap: 8, transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fdf0ef"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,6 5,6 19,6" /><path d="M8 6V4h4v2M19 6l-1 14H2L1 6" /></svg>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete confirm */}


        {/* Caption */}
        <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text)", marginBottom: 6 }}>{post.caption}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 0 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ fontSize: 12, fontWeight: 500, padding: "4px 11px", borderRadius: "var(--radius-pill)", background: "var(--bg)", color: "var(--muted)", border: "1px solid var(--border)", cursor: "pointer" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        {/* Actions */} <div style={{ display: "flex", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)", gap: 4 }}> <ActBtn icon={post.liked ? <svg width="16" height="16" viewBox="0 0 20 20" fill="#c0635a"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z" /></svg> : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z" /></svg>} label={post.likes} active={post.liked} activeColor="#c0635a" animating={likeAnim} onClick={handleLike} /> <ActBtn icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h14v9a2 2 0 01-2 2H7l-4 2V5z" /></svg>} label={post.comments + comments.length} onClick={handleToggleCmts} /> <ActBtn icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 8l-5-5-5 5M10 3v10M5 17h10" /></svg>} label={post.shares} /> <div style={{ marginLeft: "auto" }}> <ActBtn icon={post.saved ? <svg width="16" height="16" viewBox="0 0 20 20" fill="#A67B5B"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z" /></svg> : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z" /></svg>} label="" active={post.saved} activeColor="var(--primary-dark)" onClick={() => onSave(post.id)} /> </div> </div>
        {/* Comments */}
        {showCmts && (
          <div style={{ paddingTop: 14, borderTop: "1px solid var(--border)", marginTop: 12 }}>
            {loadingCmts && <div style={{ fontSize: 13, color: "var(--border)", padding: "8px 0" }}>Loading...</div>}
            {comments.map(c => (
              <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--primary-soft)", border: "1.5px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--primary-dark)", flexShrink: 0 }}>
                  {c.initials}
                </div>
                <div style={{ background: "var(--bg)", borderRadius: "0 12px 12px 12px", padding: "7px 11px", fontSize: 13, color: "var(--text)", flex: 1, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 500, color: "var(--primary-dark)", marginRight: 6 }}>{c.author}</span>{c.text}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                ref={cmtRef}
                value={cmtText}
                onChange={e => setCmtText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmitCmt()}
                placeholder="Add a comment..."
                style={{ flex: 1, border: "1.5px solid var(--border)", borderRadius: "var(--radius-pill)", padding: "8px 14px", fontSize: 13, fontFamily: "var(--font-body)", outline: "none", background: "var(--bg)", color: "var(--text)", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "var(--primary-dark)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button
                onClick={handleSubmitCmt}
                style={{ padding: "0 16px", background: "var(--primary-dark)", color: "#fff", border: "none", borderRadius: "var(--radius-pill)", fontSize: 14, cursor: "pointer", fontFamily: "var(--font-body)" }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
      {showConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999
        }}>
          <div style={{
            width: 300,
            background: "#fff",
            borderRadius: 16,
            padding: 18,
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              Delete Post?
            </div>

            <div style={{ fontSize: 13, color: "#777", marginBottom: 16 }}>
              This cannot be undone.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  border: "none",
                  background: "#c0635a",
                  color: "#fff",
                  cursor: deleting ? "default" : "pointer",
                  opacity: deleting ? 0.7 : 1
                }}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActBtn({ icon, label, active, activeColor, animating, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        padding: "6px 10px", background: "none", border: "none",
        borderRadius: 10, cursor: "pointer",
        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
        color: active && activeColor ? activeColor : "var(--muted)",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = "var(--bg)")}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span className={animating ? "like-pop" : ""}>{icon}</span>
      {label !== "" && label}
    </button>
  );
}
