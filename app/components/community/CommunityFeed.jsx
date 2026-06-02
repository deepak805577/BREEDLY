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

  const [searchQuery,     setSearchQuery]     = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const currentUser = {
    name:      profile?.full_name     ?? "Dog Lover",
    initials:  profile?.initials      ?? "DL",
    breed:     profile?.primary_breed ?? "Mixed Breed",
    avatarUrl: profile?.avatar_url    ?? null,
  };

  // Debounce search query changes to prevent rapid database queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setFetching(true);
    Promise.all([
      fetchPosts({ page: 1, filter: activeFilter, search: debouncedSearch }),
      fetchStories()
    ])
      .then(([{ posts: p, hasMore: m }, s]) => {
        setPosts(p); setStories(s); setHasMore(m); setPage(1);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [activeFilter, debouncedSearch]);

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
      const { posts: more, hasMore: left } = await fetchPosts({ page: page + 1, filter: activeFilter, search: debouncedSearch });
      setPosts(prev => [...prev, ...more]);
      setPage(p => p + 1);
      setHasMore(left);
    } finally { setFetching(false); }
  }, [page, hasMore, fetching, activeFilter, debouncedSearch]);

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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg:#f3f0e6; --bg-main:#F5EFE6; --bg-soft:#EFE7DB;
          --surface:#fff; --primary:#e8c8a6;
          --primary-soft:#f5ede3; --primary-dark:#A67B5B;
          --accent:#B08968; --accent-dark:#7F5539;
          --card-bg:#E8D8C4; --card-lite:#F0E6D8;
          --soft-white:#FAF7F2;
          --text:#8b7a6a; --text-primary:#3E3E3E;
          --text-secondary:#6F6F6F; --text-light:#9A9A9A;
          --muted:#A67B5B; --border:#e8ddd0;
          --border-strong:rgba(176,137,104,0.30);
          --danger:#c0635a; --danger-soft:#fdf0ef;
          --font-display:'Fraunces', Georgia, serif;
          --font-body:'DM Sans', system-ui, sans-serif;
          --radius-sm:8px; --radius-md:12px; --radius-lg:16px;
          --radius-xl:24px; --radius-pill:999px;
          --shadow-soft:0 8px 30px rgba(100,70,40,0.06);
          --shadow-hover:0 16px 48px rgba(100,70,40,0.12);
          --shadow-card:0 4px 16px rgba(166,123,91,0.08);
          --transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
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
        .bc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:22px; align-content:start; }
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
        /* Global FAB */
        .bc-fab {
          display:flex; position:fixed; bottom:24px; right:24px;
          width:52px; height:52px; border-radius:50%;
          background:var(--accent-dark); border:none; cursor:pointer;
          align-items:center; justify-content:center;
          box-shadow:0 4px 20px rgba(127,85,57,0.35);
          transition:transform 0.15s; z-index:50;
        }
        .bc-fab:hover { transform:scale(1.08); }
        @media(max-width:768px) {
          .bc-scroll { padding:16px 16px 80px; }
          .bc-grid { grid-template-columns:1fr; }
        }
      `}</style>
 
      <div className="bc">
        <Sidebar currentUser={currentUser} />
 
        <div className="bc-main">
          <MobileTopBar onPost={() => setShowModal(true)} />
          <TopBar breed={currentUser.breed} searchQuery={searchQuery} onSearchChange={setSearchQuery} onPost={() => setShowModal(true)} />
          <FilterBar filters={FILTERS} active={activeFilter} onChange={setFilter} />
 
          <div className="bc-scroll">
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
      <div style={{ marginBottom:14, color:"var(--primary-dark)" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline-block", opacity: 0.8 }}><path d="M12 14c-1.66 0-3 1.34-3 3 0 2 2 3.5 3 3.5s3-1.5 3-3.5c0-1.66-1.34-3-3-3zm-5.5-5c-1.1 0-2 .9-2 2s1.5 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm11 0c-1.1 0-2 .9-2 2s.9 2.5 2 2.5 2-1.4 2-2.5-.9-2-2-2zm-8.25-3.5c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75zm5.5 0c-.97 0-1.75.78-1.75 1.75s.78 1.75 1.75 1.75 1.75-.78 1.75-1.75-.78-1.75-1.75-1.75z"/></svg>
      </div>
      <div style={{ fontFamily:"var(--font-display)", fontSize:20, color:"var(--primary-dark)", marginBottom:8 }}>No posts in {filter} yet</div>
      <div style={{ fontSize:14, color:"var(--muted)" }}>Be the first to share something with the pack</div>
    </div>
  );
}
