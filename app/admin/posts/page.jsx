"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { Trash2, Search, ExternalLink, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id ( username, avatar_url, full_name )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to permanently delete this post?")) return;
    
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      setPosts(posts.filter(p => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Check permissions.");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    const contentMatch = post.caption?.toLowerCase().includes(searchLower);
    const authorMatch = post.profiles?.username?.toLowerCase().includes(searchLower) || post.profiles?.full_name?.toLowerCase().includes(searchLower);
    return contentMatch || authorMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className={styles.tableContainer}>
        {/* TABLE HEADER & CONTROLS */}
        <div className={styles.tableHeader} style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className={styles.tableTitle}>Community Posts</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", marginTop: "4px", margin: 0 }}>
              Monitor and moderate {posts.length} user discussions.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search content or author..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
                style={{ width: "240px", borderRadius: "10px", padding: "8px 12px 8px 36px" }}
              />
            </div>
          </div>
        </div>

        {/* TABLE CONTENT */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No posts found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px", width: "25%" }}>Author</th>
                  <th style={{ width: "40%" }}>Content</th>
                  <th>Media</th>
                  <th>Posted On</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.id}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={post.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${post.profiles?.username || 'User'}&background=FFF8F3&color=E8AD7F`} 
                          alt={post.profiles?.username} 
                          style={{ width: "36px", height: "36px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--admin-border)" }} 
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600", color: "var(--admin-text-primary)", fontSize: "14px" }}>
                            {post.profiles?.full_name || post.profiles?.username || "Unknown"}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                            @{post.profiles?.username || "anonymous"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontSize: "13px", 
                        lineHeight: "1.5", 
                        color: "var(--admin-text-primary)",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}>
                        {post.caption || <span style={{ color: "var(--admin-text-secondary)", fontStyle: "italic" }}>No text content</span>}
                      </div>
                    </td>
                    <td>
                      {post.image_url ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--admin-primary)", fontSize: "12px", fontWeight: "500", backgroundColor: "rgba(232, 173, 127, 0.1)", padding: "4px 8px", borderRadius: "6px", width: "fit-content" }}>
                          <ImageIcon size={14} /> Image
                        </div>
                      ) : (
                        <span style={{ color: "var(--admin-text-secondary)", fontSize: "12px" }}>None</span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: "var(--admin-text-secondary)", fontSize: "13px" }}>
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "32px" }}>
                      <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                        <Link href={`/community?post=${post.id}`} target="_blank">
                          <button className={styles.iconBtn} title="View Post on Frontend">
                            <ExternalLink size={16} />
                          </button>
                        </Link>
                        <button 
                          className={`${styles.iconBtn} ${styles.delete}`} 
                          title="Delete Post"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER */}
        {!loading && filteredPosts.length > 0 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 32px",
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-surface)"
          }}>
            <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
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
                  color: currentPage === 1 ? "var(--admin-border)" : "var(--admin-text-primary)",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
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
                  color: currentPage === totalPages ? "var(--admin-border)" : "var(--admin-text-primary)",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
