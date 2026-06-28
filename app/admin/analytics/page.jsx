"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { 
  Users, SearchIcon, MessageSquare, Bone, 
  TrendingUp, Download, ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  
  // KPI States
  const [stats, setStats] = useState({
    users: 0,
    breeds: 0,
    posts: 0,
    comments: 0
  });

  // Chart Data State
  const [activityData, setActivityData] = useState([]);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  async function fetchAnalyticsData() {
    setLoading(true);
    try {
      // 1. Fetch total counts using HEAD requests for performance
      const [usersRes, breedsRes, postsRes, commentsRes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("breeds").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("post_comments").select("*", { count: "exact", head: true })
      ]);

      setStats({
        users: usersRes.count || 0,
        breeds: breedsRes.count || 0,
        posts: postsRes.count || 0,
        comments: commentsRes.count || 0
      });

      // 2. Generate Chart Data (Fetching last 30 days of posts)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentPosts } = await supabase
        .from("posts")
        .select("created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());

      // Group posts by day
      const dailyCounts = {};
      
      // Initialize last 30 days with 0
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyCounts[dateStr] = 0;
      }

      if (recentPosts) {
        recentPosts.forEach(post => {
          const d = new Date(post.created_at);
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (dailyCounts[dateStr] !== undefined) {
            dailyCounts[dateStr]++;
          }
        });
      }

      const formattedChartData = Object.keys(dailyCounts).map(date => ({
        date,
        posts: dailyCounts[date]
      }));

      setActivityData(formattedChartData);

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }

  const KpiCard = ({ title, value, icon: Icon, trend, color }) => (
    <div style={{
      backgroundColor: "var(--admin-surface)",
      borderRadius: "16px",
      padding: "24px",
      border: "1px solid var(--admin-border)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.05)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.02)";
    }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ 
          backgroundColor: `${color}15`, 
          padding: "12px", 
          borderRadius: "12px",
          color: color
        }}>
          <Icon size={24} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--admin-success)", fontSize: "13px", fontWeight: "600", backgroundColor: "rgba(34, 197, 94, 0.1)", padding: "4px 8px", borderRadius: "20px" }}>
          <ArrowUpRight size={14} /> {trend}%
        </div>
      </div>
      <div>
        <h3 style={{ fontSize: "32px", fontWeight: "700", color: "var(--admin-text-primary)", margin: "0 0 4px 0" }}>
          {value.toLocaleString()}
        </h3>
        <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: "14px", fontWeight: "500" }}>
          {title}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "var(--admin-text-primary)", margin: "0 0 8px 0" }}>
            Platform Analytics
          </h2>
          <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: "15px" }}>
            Real-time insights and performance metrics for BreedLy.
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: "8px",
          backgroundColor: "var(--admin-primary)", color: "white",
          border: "none", padding: "10px 20px", borderRadius: "10px",
          fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
        }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState} style={{ minHeight: "400px" }}>
          <div className={styles.spinner}></div>
          <p>Analyzing platform data...</p>
        </div>
      ) : (
        <>
          {/* KPI GRID */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
            gap: "24px", 
            marginBottom: "32px" 
          }}>
            <KpiCard title="Total Users" value={stats.users} icon={Users} trend="12.5" color="#3B82F6" />
            <KpiCard title="Dog Breeds" value={stats.breeds} icon={SearchIcon} trend="4.2" color="#E8AD7F" />
            <KpiCard title="Community Posts" value={stats.posts} icon={MessageSquare} trend="28.4" color="#8B5CF6" />
            <KpiCard title="User Comments" value={stats.comments} icon={MessageSquare} trend="15.1" color="#10B981" />
          </div>

          {/* CHARTS GRID */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr", 
            gap: "24px",
            marginBottom: "32px"
          }}>
            {/* Primary Chart */}
            <div style={{
              backgroundColor: "var(--admin-surface)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid var(--admin-border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "var(--admin-text-primary)" }}>Community Engagement</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--admin-text-secondary)" }}>Posts created over the last 30 days</p>
                </div>
                <div style={{ padding: "6px 12px", backgroundColor: "var(--admin-bg)", borderRadius: "8px", fontSize: "13px", fontWeight: "500", color: "var(--admin-text-secondary)" }}>
                  Last 30 Days
                </div>
              </div>
              
              <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--admin-text-secondary)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "var(--admin-text-secondary)", fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--admin-surface)", borderRadius: "8px", border: "1px solid var(--admin-border)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", color: "var(--admin-text-primary)" }}
                      itemStyle={{ color: "var(--admin-primary)", fontWeight: "600" }}
                    />
                    <Area type="monotone" dataKey="posts" name="Posts" stroke="var(--admin-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPosts)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Secondary Chart */}
            <div style={{
              backgroundColor: "var(--admin-surface)",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid var(--admin-border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "600", color: "var(--admin-text-primary)" }}>Content Distribution</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--admin-text-secondary)" }}>Platform data ratio</p>
                </div>
              </div>
              
              <div style={{ height: "260px", width: "100%", display: "flex", alignItems: "flex-end", paddingBottom: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Profiles', value: stats.users, fill: '#3B82F6' },
                    { name: 'Posts', value: stats.posts, fill: '#8B5CF6' },
                    { name: 'Breeds', value: stats.breeds, fill: '#E8AD7F' }
                  ]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--admin-text-secondary)", fontSize: 12 }} dy={10} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: "var(--admin-surface)", borderRadius: "8px", border: "1px solid var(--admin-border)" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
