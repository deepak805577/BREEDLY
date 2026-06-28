"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./admin.module.css";
import { 
  Users, MessageSquare, Bone, Activity, AlertTriangle, 
  CheckCircle, Target, Eye, MessageCircle, UserPlus 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    dogs: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, postsRes, dogsRes, commentsRes] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("dogs").select("*", { count: "exact", head: true }),
          supabase.from("post_comments").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          users: usersRes.count || 0,
          posts: postsRes.count || 0,
          dogs: dogsRes.count || 0,
          comments: commentsRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.users, icon: Users, trend: "+12%", trendType: "up" },
    { title: "Active Users (DAU)", value: Math.floor(stats.users * 0.4), icon: Activity, trend: "+5%", trendType: "up" },
    { title: "New Users Today", value: "24", icon: UserPlus, trend: "+2%", trendType: "up" },
    { title: "Dog Profiles", value: stats.dogs, icon: Bone, trend: "+18%", trendType: "up" },
    { title: "Community Posts", value: stats.posts, icon: MessageSquare, trend: "+8%", trendType: "up" },
    { title: "Total Comments", value: stats.comments, icon: MessageCircle, trend: "+14%", trendType: "up" },
    { title: "Quiz Attempts", value: "1,204", icon: Target, trend: "+24%", trendType: "up" },
    { title: "Breed Views", value: "8,432", icon: Eye, trend: "+32%", trendType: "up" },
    { title: "Reported Posts", value: "3", icon: AlertTriangle, trend: "-2", trendType: "down" },
    { title: "Pending Approvals", value: "12", icon: CheckCircle, trend: "0", trendType: "neutral" },
  ];

  return (
    <div>
      {/* ─── DASHBOARD HERO ─── */}
      <div className={styles.dashboardHero}>
        <div className={styles.heroContent}>
          <h1>Welcome back, Admin 👋</h1>
          <p>Here’s what’s happening on BreedLy today.</p>
        </div>
        <div>
          {/* Decorative graphic or action button could go here */}
          <button className={styles.tableActionBtn}>Generate Report</button>
        </div>
      </div>

      {/* ─── STAT CARDS GRID ─── */}
      <div className={styles.statGrid}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span>{stat.title}</span>
                <div className={styles.statIcon}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={styles.statValue}>
                {stat.value.toLocaleString()}
              </div>
              <div className={styles.statTrend}>
                <span className={
                  stat.trendType === 'up' ? styles.trendUp : 
                  stat.trendType === 'down' ? styles.trendDown : 
                  styles.trendNeutral
                }>
                  {stat.trendType === 'up' ? '↑' : stat.trendType === 'down' ? '↓' : '-'} {stat.trend}
                </span>
                <span style={{ color: "var(--admin-text-secondary)", marginLeft: "4px" }}>vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── RECENT ACTIVITY FEED ─── */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Activity Feed</h2>
        </div>
        <div style={{ padding: "0" }}>
          {[
            { action: "New dog profile added: Max (Golden Retriever)", time: "2 mins ago" },
            { action: "User 'johndoe' completed the Breed Selector Quiz", time: "15 mins ago" },
            { action: "New community post created in 'Training Tips'", time: "1 hour ago" },
            { action: "Post reported for spam by 'janedoe'", time: "3 hours ago" },
          ].map((item, i) => (
            <div key={i} style={{ 
              padding: "16px 24px", 
              borderBottom: i === 3 ? "none" : "1px solid var(--admin-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "background-color 0.2s"
            }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg)'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--admin-primary)" }}></div>
                <span style={{ color: "var(--admin-text-primary)", fontSize: "14px", fontWeight: "500" }}>{item.action}</span>
              </div>
              <span style={{ color: "var(--admin-text-secondary)", fontSize: "13px" }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
