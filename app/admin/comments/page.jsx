"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { Trash2, Search, ExternalLink, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CommentsManagement() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          *,
          profiles:user_id ( username, avatar_url, full_name ),
          posts:post_id ( id, caption )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to permanently delete this comment?")) return;
    
    try {
      const { error } = await supabase.from("post_comments").delete().eq("id", commentId);
      if (error) throw error;
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Check permissions.");
    }
  };

  // Filter and Search Logic
  const filteredComments = comments.filter((comment) => {
    const searchLower = searchQuery.toLowerCase();
    const contentMatch = comment.text?.toLowerCase().includes(searchLower);
    const authorMatch = comment.profiles?.username?.toLowerCase().includes(searchLower) || comment.profiles?.full_name?.toLowerCase().includes(searchLower);
    return contentMatch || authorMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className={styles.tableContainer}>
        {/* TABLE HEADER & CONTROLS */}
        <div className={styles.tableHeader} style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className={styles.tableTitle}>Comments Moderation</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", marginTop: "4px", margin: 0 }}>
              Monitor and moderate {comments.length} user comments across all posts.
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
            <p>Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className={styles.emptyState}>
            <div style={{ backgroundColor: "rgba(232, 173, 127, 0.1)", padding: "16px", borderRadius: "50%", marginBottom: "8px" }}>
              <MessageSquare size={32} color="var(--admin-primary)" />
            </div>
            <p style={{ fontWeight: "500", color: "var(--admin-text-primary)" }}>No comments found.</p>
            <p style={{ fontSize: "13px" }}>There are no comments matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px", width: "25%" }}>Author</th>
                  <th style={{ width: "35%" }}>Comment</th>
                  <th style={{ width: "20%" }}>Parent Post</th>
                  <th>Posted On</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedComments.map((comment) => (
                  <tr key={comment.id}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.username || 'User'}&background=FFF8F3&color=E8AD7F`} 
                          alt={comment.profiles?.username} 
                          style={{ width: "32px", height: "32px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--admin-border)" }} 
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600", color: "var(--admin-text-primary)", fontSize: "13px" }}>
                            {comment.profiles?.full_name || comment.profiles?.username || "Unknown"}
                          </span>
                          <span style={{ fontSize: "11px", color: "var(--admin-text-secondary)" }}>
                            @{comment.profiles?.username || "anonymous"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontSize: "13px", 
                        lineHeight: "1.5", 
                        color: "var(--admin-text-primary)",
                      }}>
                        {comment.text || <span style={{ color: "var(--admin-text-secondary)", fontStyle: "italic" }}>No text</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "var(--admin-text-secondary)",
                        display: "-webkit-box",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        backgroundColor: "var(--admin-bg)",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--admin-border)"
                      }} title={comment.posts?.caption}>
                        {comment.posts?.caption || "Deleted Post"}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "var(--admin-text-secondary)", fontSize: "13px" }}>
                        {new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "32px" }}>
                      <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                        {comment.post_id && (
                          <Link href={`/community?post=${comment.post_id}`} target="_blank">
                            <button className={styles.iconBtn} title="View Post on Frontend">
                              <ExternalLink size={16} />
                            </button>
                          </Link>
                        )}
                        <button 
                          className={`${styles.iconBtn} ${styles.delete}`} 
                          title="Delete Comment"
                          onClick={() => handleDelete(comment.id)}
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
        {!loading && filteredComments.length > 0 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 32px",
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-surface)"
          }}>
            <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredComments.length)} of {filteredComments.length} comments
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
