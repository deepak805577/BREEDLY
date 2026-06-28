"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "../../admin.module.css";
import { 
  ArrowLeft, Mail, Calendar, Shield, MapPin, 
  Bone, MessageSquare, Heart, Clock, MoreVertical
} from "lucide-react";
import Link from "next/link";

export default function UserProfileDetail() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.emptyState}>
        <p>User not found.</p>
        <button className={styles.tableActionBtn} onClick={() => router.push('/admin/users')}>
          Go Back
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "dogs", label: "Dogs (0)" },
    { id: "posts", label: "Posts (0)" },
    { id: "comments", label: "Comments (0)" },
    { id: "saved", label: "Saved Breeds" }
  ];

  return (
    <div>
      {/* ─── BREADCRUMBS & HEADER ─── */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/admin/users" style={{ 
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "36px", borderRadius: "12px",
          backgroundColor: "var(--admin-surface)", border: "1px solid var(--admin-border)",
          color: "var(--admin-text-secondary)", textDecoration: "none", transition: "all 0.2s"
        }}>
          <ArrowLeft size={18} />
        </Link>
        <h2 className={styles.pageTitle}>User Profile</h2>
      </div>

      {/* ─── PROFILE HEADER CARD ─── */}
      <div style={{
        backgroundColor: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        borderRadius: "20px",
        padding: "32px",
        marginBottom: "24px",
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.02)"
      }}>
        <img 
          src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=FFF8F3&color=E8AD7F`}
          alt="Avatar"
          style={{ width: "120px", height: "120px", borderRadius: "24px", objectFit: "cover", border: "4px solid var(--admin-bg)" }}
        />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", color: "var(--admin-text-primary)" }}>
                {user.full_name || user.username || "Unknown User"}
              </h1>
              <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                @{user.username || "anonymous"}
                <span style={{ 
                  display: "inline-block",
                  backgroundColor: user.role === 'admin' ? "rgba(232, 173, 127, 0.15)" : user.role === 'banned' ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                  color: user.role === 'admin' ? "var(--admin-primary-dark)" : user.role === 'banned' ? "var(--admin-danger)" : "var(--admin-success)",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "capitalize"
                }}>
                  {user.role || 'User'}
                </span>
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button className={styles.tableActionBtn} style={{ backgroundColor: "var(--admin-surface)", color: "var(--admin-text-primary)", border: "1px solid var(--admin-border)", boxShadow: "none" }}>
                Send Message
              </button>
              <button className={styles.tableActionBtn}>
                Edit Profile
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "24px", marginTop: "24px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--admin-text-secondary)", fontSize: "14px" }}>
              <Mail size={16} /> <span>No email visible</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--admin-text-secondary)", fontSize: "14px" }}>
              <Calendar size={16} /> <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--admin-text-secondary)", fontSize: "14px" }}>
              <MapPin size={16} /> <span>Unknown Location</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div style={{
        display: "flex",
        gap: "32px",
        borderBottom: "1px solid var(--admin-border)",
        marginBottom: "24px",
        padding: "0 16px"
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "none",
              border: "none",
              padding: "16px 0",
              fontSize: "14px",
              fontWeight: activeTab === tab.id ? "600" : "500",
              color: activeTab === tab.id ? "var(--admin-primary-dark)" : "var(--admin-text-secondary)",
              borderBottom: activeTab === tab.id ? "2px solid var(--admin-primary)" : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div style={{ 
        backgroundColor: "var(--admin-surface)", 
        borderRadius: "20px", 
        border: "1px solid var(--admin-border)",
        minHeight: "300px",
        padding: "32px"
      }}>
        {activeTab === "overview" && (
          <div>
            <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)" }}>Activity Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
              
              <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>
                  <Bone size={18} /> <span style={{ fontSize: "14px", fontWeight: "500" }}>Dogs Owned</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--admin-text-primary)" }}>0</div>
              </div>

              <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>
                  <MessageSquare size={18} /> <span style={{ fontSize: "14px", fontWeight: "500" }}>Community Posts</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--admin-text-primary)" }}>0</div>
              </div>

              <div style={{ padding: "20px", borderRadius: "16px", backgroundColor: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>
                  <Heart size={18} /> <span style={{ fontSize: "14px", fontWeight: "500" }}>Total Likes Given</span>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--admin-text-primary)" }}>0</div>
              </div>

            </div>
          </div>
        )}

        {activeTab !== "overview" && (
          <div className={styles.emptyState}>
            <Clock size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
            <p>This user has no recorded activity in this section yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
