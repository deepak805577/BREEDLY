"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, MessageSquare, Bone, 
  ArrowLeft, LogOut, Settings, BarChart2, ShieldAlert,
  MessageCircle, Star, Search, Plus, Bell, Monitor,
  Megaphone, SearchIcon, FileText
} from "lucide-react";
import AdminGuard from "../components/auth/AdminGuard";
import styles from "./admin.module.css";
import { useAuth } from "../context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  
  // As requested in the massive PRD
  const navSections = [
    {
      label: "Core",
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Breeds", href: "/admin/breeds", icon: SearchIcon },
        { name: "Dogs", href: "/admin/dogs", icon: Bone },
      ]
    },
    {
      label: "Community",
      items: [
        { name: "Community Posts", href: "/admin/posts", icon: MessageSquare },
        { name: "Reports", href: "/admin/reports", icon: ShieldAlert },
        { name: "Feedback", href: "/admin/feedback", icon: MessageCircle },
      ]
    },
    {
      label: "Growth & Insights",
      items: [
        { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
        { name: "Featured Content", href: "/admin/featured", icon: Star },
        { name: "Search Management", href: "/admin/search", icon: Search },
        { name: "Notifications", href: "/admin/notifications", icon: Bell },
      ]
    },
    {
      label: "System",
      items: [
        { name: "Global CMS", href: "/admin/cms", icon: FileText },
        { name: "Settings", href: "/admin/settings", icon: Settings },
        { name: "Super Admin", href: "/admin/super", icon: Monitor },
      ]
    }
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AdminGuard>
      <div className={styles.adminContainer}>
        {/* ─── SIDEBAR ─── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              🐾 <span>BreedLy Admin</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navSections.map((section, idx) => (
                <div key={section.label}>
                  <div className={styles.navSectionLabel}>{section.label}</div>
                  {section.items.map((item) => {
                    if (item.name === "Community Posts") {
                      return [
                        <li key="posts">
                          <Link 
                            href="/admin/posts" 
                            className={`${styles.navItem} ${pathname === "/admin/posts" ? styles.active : ""}`}
                          >
                            <MessageSquare size={20} />
                            <span>Community Posts</span>
                          </Link>
                        </li>,
                        <li key="comments">
                          <Link 
                            href="/admin/comments" 
                            className={`${styles.navItem} ${pathname === "/admin/comments" ? styles.active : ""}`}
                          >
                            <MessageSquare size={20} />
                            <span>Comments</span>
                          </Link>
                        </li>
                      ];
                    }
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
                          <Icon size={20} />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </div>
              ))}
            </ul>
          </nav>

          <div className={styles.sidebarFooter}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={18} />
              <span>Back to App</span>
            </Link>
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className={styles.mainContent}>
          {/* Top Header */}
          <header className={styles.topHeader}>
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={18} />
              <input type="text" placeholder="Search users, breeds, posts..." className={styles.searchInput} />
            </div>

            <div className={styles.headerActions}>
              <button className={styles.quickAddBtn}>
                <Plus size={16} /> Quick Add
              </button>
              
              <button className={styles.iconBtn} style={{ marginLeft: "8px" }}>
                <Bell size={20} />
              </button>

              <div className={styles.adminProfile} style={{ marginLeft: "12px", border: "none", background: "transparent", padding: 0 }}>
                <div className={styles.adminInfo} style={{ textAlign: "right" }}>
                  <span className={styles.adminName} style={{ fontSize: "13px" }}>{profile?.username || "Admin"}</span>
                  <span className={styles.adminRole} style={{ fontSize: "11px" }}>Super Admin</span>
                </div>
                <img 
                  src={profile?.avatar_url || "https://ui-avatars.com/api/?name=Admin&background=E8AD7F&color=fff"} 
                  alt="Avatar" 
                  className={styles.avatar} 
                />
                <button className={styles.logoutBtn} onClick={handleLogout} title="Log out" style={{ padding: "4px 8px" }}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
