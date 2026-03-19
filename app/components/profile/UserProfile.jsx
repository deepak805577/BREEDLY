"use client";

import { useState, useEffect } from "react";
import { useAuth }             from "../../context/AuthContext";
import { supabase }            from "../../../lib/supabase";
import Sidebar                 from "../community/Sidebar";
import ProfileCard             from "./ProfileCard";
import ProfilePostsPanel       from "./ProfilePostsPanel";
import ProfileEditModal        from "./ProfileEditModal";

export default function UserProfile({ userId = null }) {
  const { user, profile: myProfile, updateProfile } = useAuth();

  const targetId     = userId ?? user?.id;
  const isOwnProfile = targetId === user?.id;

  const [profile,  setProfile]  = useState(null);
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    loadProfile();
    loadPosts();
  }, [targetId]);

  useEffect(() => {
    if (isOwnProfile && myProfile) setProfile(myProfile);
  }, [myProfile, isOwnProfile]);

  async function loadProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, initials, avatar_url, avatar_color, primary_breed, bio, username, dog_name, dog_age, dog_photo_url")
      .eq("id", targetId)
      .single();
    if (!error && data) setProfile(data);
    setLoading(false);
  }

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("id, caption, image_url, tags, breed, created_at")
      .eq("user_id", targetId)
      .order("created_at", { ascending: false });
    setPosts(data ?? []);
  }

  async function handleSaveProfile(updates) {
    await updateProfile(updates);
    setProfile(prev => ({ ...prev, ...updates }));
    setShowEdit(false);
  }

  async function handleAvatarUpload(file) {
    if (!file || !user) return;
    const ext      = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage
      .from("community-posts")
      .upload(filePath, file, { upsert: true });
    if (error) { console.error(error); return; }
    const { data: urlData } = supabase.storage.from("community-posts").getPublicUrl(filePath);
    await updateProfile({ avatar_url: urlData.publicUrl });
    setProfile(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
  }

  const currentUser = {
    name:      profile?.full_name     ?? "Dog Lover",
    initials:  profile?.initials      ?? "DL",
    breed:     profile?.primary_breed ?? "Mixed Breed",
    avatarUrl: profile?.avatar_url    ?? null,
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg:#f3f0e6;--surface:#fff;--primary:#e8c8a6;
          --primary-soft:#f5ede3;--primary-dark:#A67B5B;
          --text:#8b7a6a;--muted:#A67B5B;--border:#e8ddd0;
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --radius-lg:18px;--radius-xl:24px;--radius-pill:99px;
        }
        .up-root * { box-sizing:border-box; margin:0; padding:0; }
        .up-root {
          font-family:var(--font-body);
          background:var(--bg);
          color:var(--text);
          display:flex;
          min-height:100vh;
        }
        .up-main { flex:1; display:flex; flex-direction:column; min-width:0; overflow:hidden; }
        .up-scroll { flex:1; overflow-y:auto; padding:28px; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
        .up-grid {
          display:grid;
          grid-template-columns:300px 1fr;
          gap:24px;
          align-items:start;
        }
        @media(max-width:900px) {
          .up-grid { grid-template-columns:1fr; }
        }
        @media(max-width:768px) {
          .up-scroll { padding:16px; }
        }
      `}</style>

      <div className="up-root">
        <Sidebar currentUser={currentUser} />

        <div className="up-main">
          {/* Top bar */}
          <div style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:19, color:"var(--primary-dark)", fontWeight:500 }}>
              {isOwnProfile ? "My Profile" : profile?.full_name ?? "Profile"}
            </div>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <button
                onClick={() => window.history.back()}
                style={{ padding:"7px 14px", background:"none", border:"1.5px solid var(--border)", borderRadius:"var(--radius-pill)", fontFamily:"var(--font-body)", fontSize:12, color:"var(--muted)", cursor:"pointer" }}
              >
                ← Back
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setShowEdit(true)}
                  style={{ padding:"8px 18px", background:"var(--primary-dark)", border:"none", borderRadius:"var(--radius-pill)", fontFamily:"var(--font-body)", fontSize:13, fontWeight:500, color:"#fff", cursor:"pointer", transition:"opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity="0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity="1"}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="up-scroll">
            <div className="up-grid">
              <ProfileCard
                profile={profile}
                postCount={posts.length}
                isOwnProfile={isOwnProfile}
                onEdit={() => setShowEdit(true)}
                onAvatarUpload={handleAvatarUpload}
              />
              <ProfilePostsPanel
                posts={posts}
                userId={isOwnProfile ? user?.id : null}
              />
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"#f3f0e6", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, color:"#A67B5B" }}>BreedLy</div>
      <div style={{ fontSize:13, color:"#A67B5B" }}>Loading profile...</div>
    </div>
  );
}
