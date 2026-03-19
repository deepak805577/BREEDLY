"use client";

import { useState, useRef } from "react";
import { addComment, fetchComments, deletePost } from "../../services/communityApi";

export default function PostCard({ post, onLike, onSave, onDelete, currentUserId, isNew }) {
  const [likeAnim,    setLikeAnim]    = useState(false);
  const [showCmts,    setShowCmts]    = useState(false);
  const [comments,    setComments]    = useState([]);
  const [cmtText,     setCmtText]     = useState("");
  const [loadingCmts, setLoadingCmts] = useState(false);
  const [showMenu,    setShowMenu]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting,    setDeleting]    = useState(false);
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
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        border: "1.5px solid var(--border)",
        overflow: "hidden",
        transition: "transform 0.18s, border-color 0.18s, box-shadow 0.18s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor="var(--primary)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(166,123,91,0.10)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.borderColor="var(--border)";  e.currentTarget.style.boxShadow="none"; }}
    >
      {/* Image */}
      {post.imageUrl ? (
        <img src={post.imageUrl} alt={post.caption} style={{ width:"100%", height:200, objectFit:"cover", display:"block" }} />
      ) : (
        <div style={{ width:"100%", height:160, background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>🐾</div>
      )}

      <div style={{ padding:"16px 18px 14px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{
            width:38, height:38, borderRadius:"50%", flexShrink:0,
            background:"var(--primary-soft)", border:"2px solid var(--primary)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:600, color:"var(--primary-dark)", overflow:"hidden",
          }}>
            {post.user.avatarUrl
              ? <img src={post.user.avatarUrl} alt={post.user.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : post.user.initials
            }
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:500, fontSize:14, color:"var(--primary-dark)", fontFamily:"var(--font-body)" }}>{post.user.name}</div>
            <div style={{ fontSize:12, color:"var(--muted)", marginTop:1 }}>{post.timeAgo} · {post.breed}</div>
          </div>
          <div style={{ fontSize:11, fontWeight:500, padding:"4px 10px", borderRadius:"var(--radius-pill)", background:"var(--primary-soft)", color:"var(--primary-dark)", border:"1px solid var(--primary)" }}>
            {post.breed}
          </div>
          {isOwner && (
            <div style={{ position:"relative" }}>
              <button
                onClick={() => setShowMenu(v => !v)}
                style={{ background:"none", border:"none", cursor:"pointer", padding:"4px 6px", borderRadius:8, color:"var(--border)", fontSize:18, lineHeight:1 }}
                onMouseEnter={e => e.currentTarget.style.color="var(--muted)"}
                onMouseLeave={e => e.currentTarget.style.color="var(--border)"}
              >
                ···
              </button>
              {showMenu && (
                <div style={{ position:"absolute", right:0, top:30, background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--radius-md)", padding:6, zIndex:10, minWidth:140, boxShadow:"0 4px 16px rgba(166,123,91,0.12)" }}>
                  <button
                    onClick={() => { setShowMenu(false); setShowConfirm(true); }}
                    style={{ width:"100%", padding:"9px 12px", background:"none", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:13, color:"var(--danger,#c0635a)", display:"flex", alignItems:"center", gap:8, transition:"background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background="#fdf0ef"}
                    onMouseLeave={e => e.currentTarget.style.background="none"}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,6 5,6 19,6"/><path d="M8 6V4h4v2M19 6l-1 14H2L1 6"/></svg>
                    Delete post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Delete confirm */}
        {showConfirm && (
          <div style={{ background:"#fdf0ef", border:"1px solid #f5c8c4", borderRadius:"var(--radius-md)", padding:"12px 14px", marginBottom:12 }}>
            <div style={{ fontSize:13, fontWeight:500, color:"#c0635a", marginBottom:10 }}>Delete this post? This cannot be undone.</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex:1, padding:"8px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:10, fontFamily:"var(--font-body)", fontSize:13, color:"var(--muted)", cursor:"pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleting} style={{ flex:1, padding:"8px", background:"#c0635a", border:"none", borderRadius:10, fontFamily:"var(--font-body)", fontSize:13, color:"#fff", cursor:deleting?"default":"pointer", opacity:deleting?0.7:1 }}>
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        )}

        {/* Caption */}
        <p style={{ fontSize:14, lineHeight:1.65, color:"var(--text)", marginBottom:12 }}>{post.caption}</p>

        {/* Tags */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ fontSize:12, fontWeight:500, padding:"4px 11px", borderRadius:"var(--radius-pill)", background:"var(--bg)", color:"var(--muted)", border:"1px solid var(--border)", cursor:"pointer" }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", alignItems:"center", paddingTop:12, borderTop:"1px solid var(--border)", gap:4 }}>
          <ActBtn
            icon={post.liked
              ? <svg width="16" height="16" viewBox="0 0 20 20" fill="#c0635a"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z"/></svg>
              : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 17s-7-4.6-7-9a4 4 0 018 0 4 4 0 018 0c0 4.4-7 9-7 9z"/></svg>
            }
            label={post.likes}
            active={post.liked}
            activeColor="#c0635a"
            animating={likeAnim}
            onClick={handleLike}
          />
          <ActBtn
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h14v9a2 2 0 01-2 2H7l-4 2V5z"/></svg>}
            label={post.comments + comments.length}
            onClick={handleToggleCmts}
          />
          <ActBtn
            icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 8l-5-5-5 5M10 3v10M5 17h10"/></svg>}
            label={post.shares}
          />
          <div style={{ marginLeft:"auto" }}>
            <ActBtn
              icon={post.saved
                ? <svg width="16" height="16" viewBox="0 0 20 20" fill="#A67B5B"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z"/></svg>
                : <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 2h10a1 1 0 011 1v15l-6-3-6 3V3a1 1 0 011-1z"/></svg>
              }
              label=""
              active={post.saved}
              activeColor="var(--primary-dark)"
              onClick={() => onSave(post.id)}
            />
          </div>
        </div>

        {/* Comments */}
        {showCmts && (
          <div style={{ paddingTop:14, borderTop:"1px solid var(--border)", marginTop:12 }}>
            {loadingCmts && <div style={{ fontSize:13, color:"var(--border)", padding:"8px 0" }}>Loading...</div>}
            {comments.map(c => (
              <div key={c.id} style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--primary-soft)", border:"1.5px solid var(--primary)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"var(--primary-dark)", flexShrink:0 }}>
                  {c.initials}
                </div>
                <div style={{ background:"var(--bg)", borderRadius:"0 12px 12px 12px", padding:"7px 11px", fontSize:13, color:"var(--text)", flex:1, lineHeight:1.5 }}>
                  <span style={{ fontWeight:500, color:"var(--primary-dark)", marginRight:6 }}>{c.author}</span>{c.text}
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <input
                ref={cmtRef}
                value={cmtText}
                onChange={e => setCmtText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmitCmt()}
                placeholder="Add a comment..."
                style={{ flex:1, border:"1.5px solid var(--border)", borderRadius:"var(--radius-pill)", padding:"8px 14px", fontSize:13, fontFamily:"var(--font-body)", outline:"none", background:"var(--bg)", color:"var(--text)", transition:"border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor="var(--primary-dark)"}
                onBlur={e  => e.target.style.borderColor="var(--border)"}
              />
              <button
                onClick={handleSubmitCmt}
                style={{ padding:"0 16px", background:"var(--primary-dark)", color:"#fff", border:"none", borderRadius:"var(--radius-pill)", fontSize:14, cursor:"pointer", fontFamily:"var(--font-body)" }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActBtn({ icon, label, active, activeColor, animating, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:"flex", alignItems:"center", gap:5,
        padding:"6px 10px", background:"none", border:"none",
        borderRadius:10, cursor:"pointer",
        fontFamily:"var(--font-body)", fontSize:13, fontWeight:500,
        color: active && activeColor ? activeColor : "var(--muted)",
        transition:"all 0.15s",
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = "var(--bg)")}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <span className={animating ? "like-pop" : ""}>{icon}</span>
      {label !== "" && label}
    </button>
  );
}
