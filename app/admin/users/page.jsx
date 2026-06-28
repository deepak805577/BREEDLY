"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { 
  Edit2, Trash2, Search, UserPlus, 
  MoreVertical, Shield, Mail, Ban, ChevronLeft, ChevronRight, Filter
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Action Menu State
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleEditRole = async (user) => {
    setActiveMenu(null);
    const newRole = window.prompt(`Enter new role for ${user.username} (admin, user, banned):`, user.role || 'user');
    if (!newRole || newRole === user.role) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", user.id);

      if (error) throw error;
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role. You might need to add an RLS policy allowing admins to update profiles.");
    }
  };

  const handleBanUser = async (user) => {
    setActiveMenu(null);
    if (!window.confirm(`Are you sure you want to ban ${user.username}?`)) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: 'banned' })
        .eq("id", user.id);

      if (error) throw error;
      setUsers(users.map(u => u.id === user.id ? { ...u, role: 'banned' } : u));
    } catch (error) {
      console.error("Error banning user:", error);
      alert("Failed to ban user.");
    }
  };

  // Filter and Search Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter || (!user.role && roleFilter === "user");
    
    return matchesSearch && matchesRole;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className={styles.tableContainer}>
        {/* TABLE HEADER & CONTROLS */}
        <div className={styles.tableHeader} style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className={styles.tableTitle}>User Management</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", marginTop: "4px", margin: 0 }}>
              Manage {users.length} registered accounts across the platform.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search by name or username..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
                style={{ width: "220px", borderRadius: "8px", padding: "8px 12px 8px 36px" }}
              />
            </div>
            
            {/* Filter */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Filter size={16} style={{ position: "absolute", left: "10px", color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
              <select 
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  appearance: "none",
                  backgroundColor: "var(--admin-bg)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  padding: "8px 32px",
                  color: "var(--admin-text-primary)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
                <option value="banned">Banned</option>
              </select>
            </div>

            {/* Action */}
            <button className={styles.tableActionBtn} style={{ padding: "8px 16px", borderRadius: "8px" }}>
              <UserPlus size={16} />
              <span>Invite User</span>
            </button>
          </div>
        </div>

        {/* TABLE CONTENT */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No users found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px" }}>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id} style={{ position: "relative" }}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=FFF8F3&color=E8AD7F`} 
                          alt={user.username} 
                          style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--admin-border)" }} 
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600", color: "var(--admin-text-primary)" }}>
                            {user.full_name || user.username || "Unknown User"}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                            @{user.username || "anonymous"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {user.role === 'admin' ? <Shield size={14} color="var(--admin-primary)" /> : null}
                        <span style={{ textTransform: "capitalize", fontWeight: "500" }}>
                          {user.role || 'User'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        display: "inline-block",
                        backgroundColor: user.role === 'banned' ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                        color: user.role === 'banned' ? "var(--admin-danger)" : "var(--admin-success)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        {user.role === 'banned' ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "var(--admin-text-secondary)" }}>
                        {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "32px" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button 
                          className={styles.iconBtn} 
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeMenu === user.id && (
                          <div style={{
                            position: "absolute",
                            right: 0,
                            top: "30px",
                            backgroundColor: "var(--admin-surface)",
                            border: "1px solid var(--admin-border)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                            padding: "8px",
                            zIndex: 10,
                            width: "160px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px"
                          }}>
                            <button onClick={() => window.location.href = `/admin/users/${user.id}`} style={{ textAlign: "left", padding: "8px 12px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", color: "var(--admin-text-primary)", display: "flex", alignItems: "center", gap: "8px" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <Search size={14} /> View Profile
                            </button>
                            <button onClick={() => handleEditRole(user)} style={{ textAlign: "left", padding: "8px 12px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", color: "var(--admin-text-primary)", display: "flex", alignItems: "center", gap: "8px" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <Shield size={14} /> Change Role
                            </button>
                            <div style={{ height: "1px", backgroundColor: "var(--admin-border)", margin: "4px 0" }}></div>
                            <button onClick={() => handleBanUser(user)} disabled={user.role === 'banned'} style={{ textAlign: "left", padding: "8px 12px", background: "none", border: "none", borderRadius: "6px", cursor: user.role === 'banned' ? "not-allowed" : "pointer", fontSize: "13px", color: "var(--admin-danger)", display: "flex", alignItems: "center", gap: "8px", opacity: user.role === 'banned' ? 0.5 : 1 }} onMouseEnter={(e) => {if(user.role !== 'banned') e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                              <Ban size={14} /> Suspend User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && filteredUsers.length > 0 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 32px",
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-surface)"
          }}>
            <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "8px",
                  backgroundColor: currentPage === 1 ? "transparent" : "var(--admin-bg)",
                  border: "1px solid", borderColor: currentPage === 1 ? "transparent" : "var(--admin-border)",
                  color: currentPage === 1 ? "#cbd5e1" : "var(--admin-text-primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "32px", height: "32px", borderRadius: "8px",
                  backgroundColor: currentPage === totalPages ? "transparent" : "var(--admin-bg)",
                  border: "1px solid", borderColor: currentPage === totalPages ? "transparent" : "var(--admin-border)",
                  color: currentPage === totalPages ? "#cbd5e1" : "var(--admin-text-primary)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {activeMenu && (
        <div 
          onClick={() => setActiveMenu(null)}
          style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 5 }}
        />
      )}
    </div>
  );
}
