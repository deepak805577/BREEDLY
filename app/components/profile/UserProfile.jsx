"use client";

import { useState, useEffect } from "react";
import { useSearchParams }     from "next/navigation";
import { useAuth }             from "../../context/AuthContext";
import { supabase }            from "../../../lib/supabase";
import Sidebar                 from "../community/Sidebar";
import ProfileCard             from "./ProfileCard";
import ProfilePostsPanel       from "./ProfilePostsPanel";
import ProfileEditModal        from "./ProfileEditModal";

export default function UserProfile({ userId = null }) {
  const { user, profile: myProfile, updateProfile } = useAuth();
  const searchParams = useSearchParams();
  const queryUserId  = searchParams.get("id");

  const targetId     = userId ?? queryUserId ?? user?.id;
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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg-main:       #F5EFE6;
          --bg-soft:       #EFE7DB;
          --card-bg:       #E8D8C4;
          --card-lite:     #F0E6D8;
          --accent:        #B08968;
          --accent-dark:   #7F5539;
          --sage:          #A3B18A;
          --soft-white:    #FAF7F2;
          --text-primary:  #3E3E3E;
          --text-secondary:#6F6F6F;
          --text-light:    #9A9A9A;
          --border:        rgba(176,137,104,0.18);
          --border-strong: rgba(176,137,104,0.30);
          --shadow-soft:   0 8px 30px rgba(100,70,40,0.06);
          --shadow-hover:  0 16px 48px rgba(100,70,40,0.12);
          --danger:        #c0635a;
          --danger-soft:   #fdf0ef;
          --radius-xl:     24px;
          --radius-lg:     16px;
          --radius-md:     12px;
          --radius-sm:     8px;
          --radius-pill:   999px;
          --font-display:  'Fraunces', Georgia, serif;
          --font-body:     'DM Sans', system-ui, sans-serif;
          --transition:    all 0.30s cubic-bezier(0.4,0,0.2,1);
        }

        .up-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .up-root .bc-sidebar {
          --surface:       #ffffff;
          --border:        #e8ddd0;
          --primary-soft:  #f5ede3;
          --primary-dark:  #A67B5B;
          --text:          #8b7a6a;
        }

        .up-root {
          font-family: var(--font-body);
          background: var(--bg-main);
          color: var(--text-primary);
          display: flex;
          min-height: 100vh;
        }

        .up-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }        .up-topbar {
          display: flex;
          background: rgba(250, 247, 242, 0.80);
          backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(176, 137, 104, 0.16);
          border-radius: var(--radius-lg);
          margin: 16px 24px 8px;
          padding: 0 24px;
          height: 60px;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 16px;
          z-index: 100;
          box-shadow: 0 8px 30px rgba(100, 70, 40, 0.04);
          transition: var(--transition);
        }
        .up-topbar:hover {
          box-shadow: 0 12px 36px rgba(100, 70, 40, 0.08);
          border-color: rgba(176, 137, 104, 0.28);
        }
        .up-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 32px 28px;
          scrollbar-width: thin;
          scrollbar-color: var(--card-bg) transparent;
        }

        .up-grid {
          display: flex;
          flex-direction: column;
          gap: 28px;
          max-width: 860px;
          margin: 0 auto;
          width: 100%;
        }

        .up-topbar-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--accent-dark);
          letter-spacing: 0.2px;
        }

        .up-btn-back {
          padding: 8px 18px;
          background: none;
          border: 1.5px solid var(--border-strong);
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .up-btn-back:hover {
          background: var(--card-lite);
          border-color: var(--accent);
          color: var(--accent-dark);
          transform: translateX(-2px);
        }

        .up-btn-edit {
          padding: 9px 20px;
          background: var(--accent-dark);
          border: none;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--soft-white);
          cursor: pointer;
          transition: var(--transition);
          letter-spacing: 0.02em;
          box-shadow: 0 4px 12px rgba(127, 85, 57, 0.15);
        }
        .up-btn-edit:hover {
          background: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(127, 85, 57, 0.22);
        }

        @media (max-width: 768px) {
          .up-scroll { padding: 16px; }
          .up-topbar {
            margin: 10px 12px 6px !important;
            padding: 0 16px !important;
            height: 56px !important;
            top: 10px !important;
            border-radius: var(--radius-lg) !important;
            box-shadow: 0 6px 20px rgba(100, 70, 40, 0.03) !important;
          }
        }
      `}</style>

      <div className="up-root">
        <Sidebar currentUser={currentUser} />

        <div className="up-main">
          <div className="up-topbar">
            <style>{`
              .up-drawer-btn {
                display: none; background: none; border: none; cursor: pointer; padding: 6px;
                color: var(--accent-dark); align-items: center; justify-content: center;
                border-radius: var(--radius-sm); transition: background 0.15s; margin-right: 8px;
              }
              .up-drawer-btn:active { background: var(--bg-soft); }
              @media(max-width:768px) {
                .up-drawer-btn { display: inline-flex !important; }
              }
            `}</style>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="up-drawer-btn" onClick={() => {
                const sidebar = document.querySelector(".bc-sidebar");
                const overlay = document.querySelector(".bc-overlay");
                if (sidebar && overlay) {
                  sidebar.classList.add("open");
                  overlay.classList.add("show");
                }
              }} aria-label="Open navigation menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="16" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>
              <span className="up-topbar-title">
                {isOwnProfile ? "My Profile" : (profile?.full_name ?? "Profile")}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {isOwnProfile && (
                <button className="up-btn-edit" onClick={() => setShowEdit(true)}>
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #F8F3EC 0%, #F5EFE6 60%, #ECE0D0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 16,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @keyframes breathe { 0%, 100% { opacity: 0.6; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } }
        .loading-breathe { animation: breathe 2s ease-in-out infinite; }
      `}</style>
      <div className="loading-breathe" style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: "#7F5539", letterSpacing: "0.02em" }}>
        Breedly
      </div>
      <div className="loading-breathe" style={{ fontSize: 13, color: "#B08968", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Loading profile…
      </div>
    </div>
  );
}
