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
        }

        .up-topbar {
          background: var(--soft-white);
          border-bottom: 1px solid var(--border);
          padding: 0 28px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(8px);
        }

        .up-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 32px 28px;
          scrollbar-width: thin;
          scrollbar-color: var(--card-bg) transparent;
        }

        .up-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
          max-width: 1100px;
          margin: 0 auto;
        }

        .up-topbar-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 400;
          color: var(--accent-dark);
          letter-spacing: 0.01em;
        }

        .up-btn-back {
          padding: 7px 16px;
          background: none;
          border: 1.5px solid var(--border-strong);
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
        }
        .up-btn-back:hover {
          background: var(--card-lite);
          border-color: var(--accent);
          color: var(--accent-dark);
        }

        .up-btn-edit {
          padding: 8px 20px;
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
        }
        .up-btn-edit:hover {
          background: var(--accent);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(127,85,57,0.22);
        }

        @media (max-width: 900px) {
          .up-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .up-scroll { padding: 16px; }
          .up-topbar  { padding: 0 16px; }
        }
      `}</style>

      <div className="up-root">
        <Sidebar currentUser={currentUser} />

        <div className="up-main">
          <div className="up-topbar">
            <span className="up-topbar-title">
              {isOwnProfile ? "My Profile" : (profile?.full_name ?? "Profile")}
            </span>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="up-btn-back" onClick={() => window.history.back()}>
                ← Back
              </button>
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
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 300, color: "#7F5539", letterSpacing: "0.02em" }}>
        Breedly
      </div>
      <div style={{ fontSize: 13, color: "#B08968", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Loading profile…
      </div>
    </div>
  );
}
