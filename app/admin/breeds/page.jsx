"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { 
  Search, Plus, LayoutGrid, List, Edit2, Trash2, 
  MoreVertical, CheckCircle, XCircle, Filter
} from "lucide-react";
import Link from "next/link";

export default function BreedManagement() {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const { data, error } = await supabase
          .from("breeds")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setBreeds(data || []);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBreeds();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("breeds")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBreeds(breeds.filter(b => b.id !== id));
    } catch (error) {
      console.error("Error deleting breed:", error);
      alert("Failed to delete breed.");
    }
  };

  // Filter Logic
  const filteredBreeds = breeds.filter((breed) => {
    const matchesSearch = breed.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = groupFilter === "all" || breed.group?.toLowerCase() === groupFilter.toLowerCase();
    return matchesSearch && matchesGroup;
  });

  // Migration Logic
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigration = async () => {
    if (!window.confirm("This will migrate all 375 local breeds into Supabase. Proceed?")) return;
    
    setIsMigrating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch("/api/admin/migrate", { 
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        alert(data.message);
        // Refresh page to show new breeds
        window.location.reload();
      } else {
        alert("Migration failed: " + data.error);
      }
    } catch (error) {
      console.error("Migration error:", error);
      alert("Migration failed. See console.");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div>
      <div className={styles.tableContainer}>
        {/* ─── HEADER & CONTROLS ─── */}
        <div className={styles.tableHeader} style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className={styles.tableTitle}>Breed Management CMS</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", marginTop: "4px", margin: 0 }}>
              Manage {breeds.length} dog breeds in the platform database.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            
            {/* View Mode Toggle */}
            <div style={{ 
              display: "flex", 
              backgroundColor: "var(--admin-bg)", 
              borderRadius: "10px", 
              padding: "4px",
              border: "1px solid var(--admin-border)" 
            }}>
              <button 
                onClick={() => setViewMode("table")}
                style={{
                  background: viewMode === "table" ? "var(--admin-surface)" : "transparent",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: viewMode === "table" ? "var(--admin-text-primary)" : "var(--admin-text-secondary)",
                  boxShadow: viewMode === "table" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s"
                }}
                title="Table View"
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode("grid")}
                style={{
                  background: viewMode === "grid" ? "var(--admin-surface)" : "transparent",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: viewMode === "grid" ? "var(--admin-text-primary)" : "var(--admin-text-secondary)",
                  boxShadow: viewMode === "grid" ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s"
                }}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search breeds..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                style={{ width: "200px", borderRadius: "10px", padding: "8px 12px 8px 36px" }}
              />
            </div>
            
            {/* Filter */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Filter size={16} style={{ position: "absolute", left: "10px", color: "var(--admin-text-secondary)", pointerEvents: "none" }} />
              <select 
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                style={{
                  appearance: "none",
                  backgroundColor: "var(--admin-bg)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "10px",
                  padding: "8px 32px",
                  color: "var(--admin-text-primary)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <option value="all">All Groups</option>
                <option value="sporting">Sporting</option>
                <option value="hound">Hound</option>
                <option value="working">Working</option>
                <option value="terrier">Terrier</option>
                <option value="toy">Toy</option>
                <option value="non-sporting">Non-Sporting</option>
                <option value="herding">Herding</option>
              </select>
            </div>

            {/* Migration Button */}
            {breeds.length < 100 && (
              <button 
                onClick={handleMigration}
                disabled={isMigrating}
                className={styles.tableActionBtn} 
                style={{ padding: "8px 16px", borderRadius: "10px", backgroundColor: "var(--admin-surface)", color: "var(--admin-primary)", border: "1px solid var(--admin-primary)" }}
              >
                {isMigrating ? "Migrating Data..." : "Run Migration"}
              </button>
            )}

            {/* Action */}
            <Link href="/admin/breeds/new" style={{ textDecoration: "none" }}>
              <button className={styles.tableActionBtn} style={{ padding: "8px 16px", borderRadius: "10px" }}>
                <Plus size={16} />
                <span>Add Breed</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading breeds...</p>
          </div>
        ) : filteredBreeds.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No breeds found matching your criteria.</p>
          </div>
        ) : viewMode === "table" ? (
          // TABLE VIEW
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px" }}>Breed</th>
                  <th>Group</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreeds.map((breed) => (
                  <tr key={breed.id}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <img 
                          src={breed.image_url || "/assets/placeholder-dog.png"} 
                          alt={breed.name} 
                          style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)" }} 
                          onError={(e) => {e.target.src = "https://placehold.co/100x100?text=No+Image"}}
                        />
                        <div>
                          <span style={{ fontWeight: "600", color: "var(--admin-text-primary)", display: "block", marginBottom: "2px" }}>
                            {breed.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", color: "var(--admin-text-secondary)" }}>
                        {breed.group || 'Uncategorized'}
                      </span>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize", color: "var(--admin-text-secondary)" }}>
                        {breed.size || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "4px",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        color: "var(--admin-success)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        <CheckCircle size={12} /> Published
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "32px" }}>
                      <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/breeds/edit/${breed.id}`}>
                          <button className={`${styles.iconBtn} ${styles.edit}`} title="Edit Breed">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button 
                          className={`${styles.iconBtn} ${styles.delete}`} 
                          title="Delete Breed"
                          onClick={() => handleDelete(breed.id, breed.name)}
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
        ) : (
          // GRID VIEW
          <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px", backgroundColor: "var(--admin-bg)" }}>
            {filteredBreeds.map((breed) => (
              <div key={breed.id} style={{
                backgroundColor: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                borderRadius: "16px",
                overflow: "hidden",
                transition: "all 0.2s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(232, 173, 127, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.02)";
              }}>
                <div style={{ position: "relative", height: "160px" }}>
                  <img 
                    src={breed.image_url || "https://placehold.co/400x300?text=No+Image"} 
                    alt={breed.name} 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {e.target.src = "https://placehold.co/400x300?text=No+Image"}}
                  />
                  <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: "var(--admin-surface)", borderRadius: "8px", padding: "4px", display: "flex", gap: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <button className={styles.iconBtn} style={{ padding: "4px", color: "var(--admin-text-secondary)" }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(breed.id, breed.name)} className={styles.iconBtn} style={{ padding: "4px", color: "var(--admin-danger)" }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div style={{ padding: "16px" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "var(--admin-text-primary)" }}>{breed.name}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)", textTransform: "capitalize", backgroundColor: "var(--admin-bg)", padding: "4px 8px", borderRadius: "6px" }}>
                      {breed.group || "Unknown Group"}
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)", textTransform: "capitalize" }}>
                      {breed.size || "Unknown Size"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
