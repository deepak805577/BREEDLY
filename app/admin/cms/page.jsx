"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { Edit2, Trash2, Plus, Search, Image as ImageIcon, Type } from "lucide-react";

export default function CMSManagement() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ id: null, key: "", value: "", type: "text" });

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cms_content")
        .select("*")
        .order("key", { ascending: true });

      if (error) {
        // Handle case where table doesn't exist yet
        if (error.code === '42P01') {
          console.warn("CMS table does not exist. Please run the setup SQL.");
        } else {
          throw error;
        }
      }
      setContent(data || []);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.key || !editForm.value) return;

    try {
      if (editForm.id) {
        // Update
        const { error } = await supabase
          .from("cms_content")
          .update({ key: editForm.key, value: editForm.value, type: editForm.type })
          .eq("id", editForm.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("cms_content")
          .insert({ key: editForm.key, value: editForm.value, type: editForm.type });
        if (error) throw error;
      }
      
      setIsEditing(false);
      fetchContent();
    } catch (error) {
      console.error("Error saving CMS content:", error);
      alert("Failed to save content. " + error.message);
    }
  };

  const handleDelete = async (id, key) => {
    if (!window.confirm(`Are you sure you want to delete the key '${key}'? Pages relying on this will fall back to their defaults.`)) return;
    
    try {
      const { error } = await supabase.from("cms_content").delete().eq("id", id);
      if (error) throw error;
      setContent(content.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting CMS content:", error);
    }
  };

  const openNew = () => {
    setEditForm({ id: null, key: "", value: "", type: "text" });
    setIsEditing(true);
  };

  const openEdit = (item) => {
    setEditForm({ id: item.id, key: item.key, value: item.value, type: item.type || 'text' });
    setIsEditing(true);
  };

  const filteredContent = content.filter((item) =>
    item.key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.value?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Global Content Management</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
              Update text and images dynamically across the application.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input 
                type="text" 
                placeholder="Search keys..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "8px 12px 8px 36px",
                  color: "#f8fafc",
                  fontSize: "14px",
                  outline: "none",
                  width: "200px"
                }}
              />
            </div>
            <button className={styles.tableActionBtn} onClick={openNew}>
              <Plus size={16} />
              Add Content
            </button>
          </div>
        </div>

        {isEditing && (
          <div style={{ padding: "24px", borderBottom: "1px solid #334155", backgroundColor: "rgba(30, 41, 59, 0.5)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#f8fafc" }}>
              {editForm.id ? "Edit Content" : "New Content"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Key (e.g. home_hero_title)</label>
                <input 
                  type="text"
                  required
                  value={editForm.key}
                  onChange={e => setEditForm({...editForm, key: e.target.value})}
                  disabled={editForm.id !== null}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff" }}
                />
              </div>
              <div style={{ width: "120px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Type</label>
                <select 
                  value={editForm.type}
                  onChange={e => setEditForm({...editForm, type: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff" }}
                >
                  <option value="text">Text</option>
                  <option value="image">Image URL</option>
                </select>
              </div>
              <div style={{ flex: "2", minWidth: "300px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>Content Value</label>
                {editForm.type === 'text' ? (
                  <textarea 
                    required
                    value={editForm.value}
                    onChange={e => setEditForm({...editForm, value: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", minHeight: "80px", resize: "vertical" }}
                  />
                ) : (
                  <input 
                    type="url"
                    required
                    value={editForm.value}
                    onChange={e => setEditForm({...editForm, value: e.target.value})}
                    placeholder="https://..."
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff" }}
                  />
                )}
              </div>
              <div style={{ display: "flex", gap: "8px", alignSelf: "flex-end", paddingBottom: "4px" }}>
                <button type="submit" className={styles.tableActionBtn} style={{ height: "40px" }}>Save</button>
                <button type="button" onClick={() => setIsEditing(false)} className={styles.tableActionBtn} style={{ height: "40px", backgroundColor: "transparent", border: "1px solid #334155", color: "#94a3b8" }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading CMS data...</p>
          </div>
        ) : filteredContent.length === 0 && !isEditing ? (
          <div className={styles.emptyState}>
            <p>No content keys found. Add one to get started.</p>
          </div>
        ) : (
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item) => (
                <tr key={item.id}>
                  <td style={{ width: "30%" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {item.type === 'image' ? <ImageIcon size={14} color="#3b82f6" /> : <Type size={14} color="#10b981" />}
                      <span style={{ fontWeight: "500", color: "#f8fafc" }}>{item.key}</span>
                    </div>
                  </td>
                  <td style={{ width: "55%" }}>
                    <div style={{ 
                      maxWidth: "400px", 
                      whiteSpace: "nowrap", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      color: item.type === 'image' ? "#3b82f6" : "#e2e8f0"
                    }}>
                      {item.value}
                    </div>
                  </td>
                  <td style={{ width: "15%" }}>
                    <div className={styles.actionCell}>
                      <button 
                        className={`${styles.iconBtn} ${styles.edit}`} 
                        title="Edit Content"
                        onClick={() => openEdit(item)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={`${styles.iconBtn} ${styles.delete}`} 
                        title="Delete Content"
                        onClick={() => handleDelete(item.id, item.key)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
