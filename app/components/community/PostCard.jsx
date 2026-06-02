"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addComment, fetchComments, deletePost } from "../../services/communityApi";

export default function PostCard({ post, onLike, onSave, onDelete, currentUserId, isNew }) {
  const router = useRouter();
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
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(255,255,255,0.4)",
        overflow: "hidden",
        transition: "var(--transition)",
        boxShadow: "var(--shadow-soft)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
        e.currentTarget.style.boxShadow = "var(--shadow-hover)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-soft)";
      }}
    >
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
            background: "var(--bg-soft)",
            color: "var(--accent)",
            opacity: 0.35,
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
          </div>
        )}

        {/* TOP OVERLAY */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
        }}>
          <div 
            onClick={() => router.push(`/profile?id=${post.userId}`)}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "opacity 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--soft-white)",
              border: "2px solid rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent-dark)",
              overflow: "hidden",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              {post.user.avatarUrl
                ? <img src={post.user.avatarUrl} alt={post.user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : post.user.initials
              }
            </div>

            <div style={{ color: "#fff" }}>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-body)" }}>{post.user.name}</div>
              <div style={{ fontSize: 11, opacity: 0.75, fontFamily: "var(--font-body)" }}>{post.timeAgo}</div>
            </div>
          </div>

          <div style={{
            fontSize: 11,
            padding: "5px 12px",
            borderRadius: "var(--radius-pill)",
            background: "rgba(255,255,255,0.92)",
            fontWeight: 500,
            color: "var(--accent-dark)",
            fontFamily: "var(--font-body)",
            backdropFilter: "blur(4px)",
          }}>
            {post.breed}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "14px 16px 10px" }}>
        {/* Owner menu */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
          {isOwner && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowMenu(v => !v)}
                style={{
                  background: "var(--bg-soft)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--card-lite)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-soft)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--text-secondary)">
                  <circle cx="3" cy="8" r="1.5" />
                  <circle cx="8" cy="8" r="1.5" />
                  <circle cx="13" cy="8" r="1.5" />
                </svg>
              </button>
              {showMenu && (
                <div style={{
                  position: "absolute", right: 0, top: 34,
                  background: "var(--soft-white)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: 6, zIndex: 10, minWidth: 140,
                  boxShadow: "var(--shadow-hover)",
                }}>
                  <button
                    onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    style={{
                      width: "100%", padding: "9px 12px",
                      background: "none", border: "none",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer", fontFamily: "var(--font-body)",
                      fontSize: 13, color: "var(--danger)",
                      display: "flex", alignItems: "center", gap: 8,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--danger-soft)"}
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

        {/* Caption */}
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)", marginBottom: 8, fontFamily: "var(--font-body)", fontWeight: 300 }}>{post.caption}</p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 4 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 500,
              padding: "4px 12px",
              borderRadius: "var(--radius-pill)",
              background: "var(--bg-soft)",
              color: "var(--accent-dark)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              transition: "var(--transition)",
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: "flex",
          alignItems: "center",
          paddingTop: 12,
          borderTop: "1px solid var(--border)",
          gap: 4,
        }}>
          {/* Like */}
          <ActBtn
            icon={post.liked
              ? <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--danger)"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z" /></svg>
              : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z" /></svg>
            }
            label={post.likes}
            active={post.liked}
            activeColor="var(--danger)"
            animating={likeAnim}
            onClick={handleLike}
          />

          {/* Comment */}
          <ActBtn
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h14v9a2 2 0 01-2 2H7l-4 2V5z" /></svg>}
            label={post.comments + comments.length}
            onClick={handleToggleCmts}
          />

          {/* Share */}
          <ActBtn
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 8l-5-5-5 5M10 3v10M5 17h10" /></svg>}
            label={post.shares}
          />

          {/* Save (pushed right) */}
          <div style={{ marginLeft: "auto" }}>
            <ActBtn
              icon={post.saved
                ? <svg width="16" height="16" viewBox="0 0 20 20" fill="var(--accent-dark)"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z" /></svg>
                : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z" /></svg>
              }
              label=""
              active={post.saved}
              activeColor="var(--accent-dark)"
              onClick={() => onSave(post.id)}
            />
          </div>
        </div>

        {/* Comments */}
        {showCmts && (
          <div style={{ paddingTop: 14, borderTop: "1px solid var(--border)", marginTop: 12 }}>
            {loadingCmts && <div style={{ fontSize: 13, color: "var(--text-light)", padding: "8px 0" }}>Loading...</div>}
            {comments.map(c => (
              <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "var(--primary-soft)",
                  border: "1.5px solid var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600,
                  color: "var(--accent-dark)", flexShrink: 0,
                }}>
                  {c.initials}
                </div>
                <div style={{
                  background: "var(--bg-soft)",
                  borderRadius: "0 var(--radius-md) var(--radius-md) var(--radius-md)",
                  padding: "8px 12px",
                  fontSize: 13, color: "var(--text-primary)",
                  flex: 1, lineHeight: 1.55,
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                }}>
                  <span style={{ fontWeight: 500, color: "var(--accent-dark)", marginRight: 6, fontFamily: "var(--font-body)" }}>{c.author}</span>{c.text}
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
                style={{
                  flex: 1,
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-pill)",
                  padding: "9px 16px",
                  fontSize: 13,
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  background: "var(--bg-soft)",
                  color: "var(--text-primary)",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "var(--accent-dark)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button
                onClick={handleSubmitCmt}
                style={{
                  padding: "0 18px",
                  background: "var(--accent-dark)",
                  color: "var(--soft-white)",
                  border: "none",
                  borderRadius: "var(--radius-pill)",
                  fontSize: 15,
                  cursor: "pointer",
                  fontFamily: "var(--font-body)",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--accent-dark)"}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(50,35,20,0.45)",
          backdropFilter: "blur(5px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}>
          <div style={{
            width: 320,
            background: "var(--soft-white)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border)",
            padding: "26px 22px 22px",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(60,40,20,0.22)",
          }}>
            <div style={{ marginBottom: 12, color: "var(--danger)", display: "flex", justifyContent: "center" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
            </div>
            <div style={{
              fontSize: 17,
              fontWeight: 400,
              fontFamily: "var(--font-display)",
              color: "var(--accent-dark)",
              marginBottom: 6,
            }}>
              Delete Post?
            </div>
            <div style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginBottom: 20,
              lineHeight: 1.5,
              fontFamily: "var(--font-body)",
              fontWeight: 300,
            }}>
              This action cannot be undone.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: 12,
                  borderRadius: "var(--radius-pill)",
                  border: "1.5px solid var(--border-strong)",
                  background: "var(--soft-white)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13, fontWeight: 500,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-soft)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--soft-white)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  flex: 1, padding: 12,
                  borderRadius: "var(--radius-pill)",
                  border: "none",
                  background: "var(--danger)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: 13, fontWeight: 500,
                  cursor: deleting ? "default" : "pointer",
                  opacity: deleting ? 0.7 : 1,
                  transition: "var(--transition)",
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
        borderRadius: "var(--radius-sm)", cursor: "pointer",
        fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
        color: active && activeColor ? activeColor : "var(--text-secondary)",
        transition: "var(--transition)",
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = "var(--bg-soft)")}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span className={animating ? "like-pop" : ""}>{icon}</span>
      {label !== "" && label}
    </button>
  );
}
