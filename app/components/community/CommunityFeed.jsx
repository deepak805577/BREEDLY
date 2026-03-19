"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard               from "./PostCard";
import Sidebar from "./Sidebar";
import CreatePostModal from "./CreatePostModal";
import {
  TopBar,
  MobileTopBar,
  FilterBar,
  ComposeBanner,
  AIRecommendationBanner,
} from "./CommunityParts";
import { useAuth }            from "../../context/AuthContext";
import {
  fetchPosts, fetchStories, createPost,
  toggleLike, toggleSave, subscribeToNewPosts, deletePost,
} from "../../services/communityApi";

const FILTERS = ["All Posts", "Training", "Health", "Food & Treats", "Grooming", "Puppy Life", "Adoption"];

export default function CommunityFeed() {
  const { profile, user }              = useAuth();
  const [posts,        setPosts]       = useState([]);
  const [stories,      setStories]     = useState([]);
  const [activeFilter, setFilter]      = useState("All Posts");
  const [showModal,    setShowModal]   = useState(false);
  const [isLoading,    setIsLoading]   = useState(false);
  const [fetching,     setFetching]    = useState(true);
  const [page,         setPage]        = useState(1);
  const [hasMore,      setHasMore]     = useState(true);

const currentUser = {
  name:      profile?.full_name     ?? "Dog Lover",
  initials:  profile?.initials      ?? "DL",
  breed:     profile?.primary_breed ?? "Mixed Breed",
  avatarUrl: profile?.avatar_url    ?? null,   // ← add this line
};

  useEffect(() => {
    setFetching(true);
    Promise.all([fetchPosts({ page: 1, filter: activeFilter }), fetchStories()])
      .then(([{ posts: p, hasMore: m }, s]) => {
        setPosts(p); setStories(s); setHasMore(m); setPage(1);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [activeFilter]);

  useEffect(() => {
    const { unsubscribe } = subscribeToNewPosts(p =>
      setPosts(prev => prev.find(x => x.id === p.id) ? prev : [p, ...prev])
    );
    return unsubscribe;
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || fetching) return;
    setFetching(true);
    try {
      const { posts: more, hasMore: left } = await fetchPosts({ page: page + 1, filter: activeFilter });
      setPosts(prev => [...prev, ...more]);
      setPage(p => p + 1);
      setHasMore(left);
    } finally { setFetching(false); }
  }, [page, hasMore, fetching, activeFilter]);

  const handleLike = useCallback(async (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    try { await toggleLike(id); }
    catch { setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)); }
  }, []);

  const handleSave = useCallback(async (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
    try { await toggleSave(id); }
    catch { setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p)); }
  }, []);

  const handleDelete = useCallback((id) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleNewPost = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const p = await createPost(data);
      setPosts(prev => [p, ...prev]);
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("Failed to post. Please try again.");
    } finally { setIsLoading(false); }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg:#f3f0e6; --surface:#fff; --primary:#e8c8a6;
          --primary-soft:#f5ede3; --primary-dark:#A67B5B;
          --text:#8b7a6a; --muted:#A67B5B; --border:#e8ddd0;
          --font-display:'Playfair Display',Georgia,serif;
          --font-family: 'Fredoka', sans-serif;
          --radius-lg:18px; --radius-xl:24px; --radius-pill:99px;
          --shadow-card:0 4px 16px rgba(166,123,91,0.08);
        }
        .bc * { box-sizing:border-box; margin:0; padding:0; }
        .bc {
          font-family:var(--font-body);
          background:var(--bg);
          color:var(--text);
          display:flex;
          min-height:100vh;
        }
        /* Feed area */
        .bc-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
        .bc-scroll { flex:1; overflow-y:auto; padding:24px 28px 80px; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
        .bc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:20px; align-content:start; }
        /* Animations */
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .post-enter { animation:fadeUp 0.3s ease forwards; }
        @keyframes likePop { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 100%{transform:scale(1)} }
        .like-pop { animation:likePop 0.25s ease; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation:spin 0.7s linear infinite; }
        /* Skeleton shimmer */
        @keyframes shimmer { 0%{opacity:0.5} 50%{opacity:1} 100%{opacity:0.5} }
        .shimmer { animation:shimmer 1.4s ease-in-out infinite; background:var(--primary-soft); border-radius:8px; }
        /* Mobile FAB */
        .bc-fab {
          display:none; position:fixed; bottom:24px; right:24px;
          width:52px; height:52px; border-radius:50%;
          background:var(--primary-dark); border:none; cursor:pointer;
          align-items:center; justify-content:center;
          box-shadow:0 4px 20px rgba(166,123,91,0.35);
          transition:transform 0.15s; z-index:50;
        }
        .bc-fab:hover { transform:scale(1.08); }
        @media(max-width:768px) {
          .bc-scroll { padding:16px 16px 80px; }
          .bc-grid { grid-template-columns:1fr; }
          .bc-fab { display:flex; }
        }
      `}</style>

      <div className="bc">
        <Sidebar currentUser={currentUser} />

        <div className="bc-main">
          <MobileTopBar onPost={() => setShowModal(true)} />
          <TopBar breed={currentUser.breed} />
          <FilterBar filters={FILTERS} active={activeFilter} onChange={setFilter} />

          <div className="bc-scroll">
            <AIRecommendationBanner breed={currentUser.breed} />
            <ComposeBanner onOpen={() => setShowModal(true)} currentUser={currentUser} />

            <div className="bc-grid">
              {fetching && posts.length === 0
                ? <LoadingSkeleton />
                : posts.length === 0
                  ? <EmptyState filter={activeFilter} />
                  : posts.map((post, i) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        currentUserId={user?.id}
                        isNew={i === 0 && post.timeAgo === "Just now"}
                      />
                    ))
              }
              {hasMore && !fetching && (
                <button
                  onClick={loadMore}
                  style={{ gridColumn:"1/-1", padding:"12px", background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:"var(--radius-lg)", fontFamily:"var(--font-body)", fontWeight:500, fontSize:14, color:"var(--muted)", cursor:"pointer", transition:"all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background="var(--primary-soft)"; e.currentTarget.style.borderColor="var(--primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="var(--surface)"; e.currentTarget.style.borderColor="var(--border)"; }}
                >
                  Load more posts
                </button>
              )}
            </div>
          </div>
        </div>

        <button className="bc-fab" onClick={() => setShowModal(true)}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M11 4v14M4 11h14"/></svg>
        </button>
      </div>

      {showModal && <CreatePostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} isLoading={isLoading} />}
    </>
  );
}

function LoadingSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} style={{ background:"var(--surface)", borderRadius:"var(--radius-lg)", border:"1.5px solid var(--border)", overflow:"hidden" }}>
      <div className="shimmer" style={{ height:180 }} />
      <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div className="shimmer" style={{ width:38, height:38, borderRadius:"50%" }} />
          <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <div className="shimmer" style={{ height:12, width:"45%" }} />
            <div className="shimmer" style={{ height:10, width:"30%" }} />
          </div>
        </div>
        <div className="shimmer" style={{ height:12, width:"100%" }} />
        <div className="shimmer" style={{ height:12, width:"70%" }} />
      </div>
    </div>
  ));
}

function EmptyState({ filter }) {
  return (
    <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"64px 24px", background:"var(--surface)", borderRadius:"var(--radius-lg)", border:"1.5px dashed var(--border)" }}>
      <div style={{ fontSize:48, marginBottom:14 }}>🐾</div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:20, color:"var(--primary-dark)", marginBottom:8 }}>No posts in {filter} yet</div>
      <div style={{ fontSize:14, color:"var(--muted)" }}>Be the first to share something with the pack</div>
    </div>
  );
}
