"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import { Trash2, Search, Edit2, ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";

export default function DogsManagement() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Table State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDogs();
  }, []);

  async function fetchDogs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("dogs")
        .select(`
          *,
          profiles ( username, avatar_url, full_name )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", JSON.stringify(error));
        throw error;
      }
      setDogs(data || []);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (dogId) => {
    if (!window.confirm("Are you sure you want to permanently delete this dog profile?")) return;
    
    try {
      const { error } = await supabase.from("dogs").delete().eq("id", dogId);
      if (error) throw error;
      setDogs(dogs.filter(d => d.id !== dogId));
    } catch (error) {
      console.error("Error deleting dog:", error);
      alert("Failed to delete dog profile. Check permissions.");
    }
  };

  // Filter and Search Logic
  const filteredDogs = dogs.filter((dog) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = dog.name?.toLowerCase().includes(searchLower);
    const breedMatch = dog.breed?.toLowerCase().includes(searchLower);
    const ownerMatch = dog.profiles?.username?.toLowerCase().includes(searchLower) || dog.profiles?.full_name?.toLowerCase().includes(searchLower);
    return nameMatch || breedMatch || ownerMatch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDogs.length / itemsPerPage);
  const paginatedDogs = filteredDogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className={styles.tableContainer}>
        {/* TABLE HEADER & CONTROLS */}
        <div className={styles.tableHeader} style={{ flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className={styles.tableTitle}>Global Dog Database</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", marginTop: "4px", margin: 0 }}>
              Manage {dogs.length} registered pets across the platform.
            </p>
          </div>
          
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div className={styles.searchBar}>
              <Search className={styles.searchIcon} size={16} />
              <input 
                type="text" 
                placeholder="Search dog, breed, or owner..." 
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
            <p>Loading dogs...</p>
          </div>
        ) : filteredDogs.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No dogs found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "32px", width: "25%" }}>Dog</th>
                  <th style={{ width: "20%" }}>Breed</th>
                  <th style={{ width: "25%" }}>Owner</th>
                  <th>Registered</th>
                  <th style={{ textAlign: "right", paddingRight: "32px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDogs.map((dog) => (
                  <tr key={dog.id}>
                    <td style={{ paddingLeft: "32px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img 
                          src={dog.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100"} 
                          alt={dog.name} 
                          style={{ width: "40px", height: "40px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--admin-border)" }} 
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "600", color: "var(--admin-text-primary)", fontSize: "14px" }}>
                            {dog.name || "Unknown"}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                            {dog.age ? `${dog.age} yrs` : "Age Unknown"} • {dog.weight ? `${dog.weight}kg` : "Weight Unknown"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        backgroundColor: "rgba(232, 173, 127, 0.15)",
                        color: "var(--admin-primary-dark)",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-block"
                      }}>
                        {dog.breed || "Mixed Breed"}
                      </span>
                    </td>
                    <td>
                      {dog.profiles ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img 
                            src={dog.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${dog.profiles?.username || 'User'}&background=FFF8F3&color=E8AD7F`} 
                            alt={dog.profiles?.username} 
                            style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }} 
                          />
                          <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--admin-text-primary)" }}>
                            {dog.profiles?.full_name || dog.profiles?.username || "Unknown"}
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--admin-text-secondary)", fontSize: "12px", fontStyle: "italic" }}>
                          <User size={14} /> No Owner (Orphaned)
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ color: "var(--admin-text-secondary)", fontSize: "13px" }}>
                        {new Date(dog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", paddingRight: "32px" }}>
                      <div className={styles.actionCell} style={{ justifyContent: "flex-end" }}>
                        <Link href={`/admin/dogs/edit/${dog.id}`}>
                          <button className={`${styles.iconBtn} ${styles.edit}`} title="Edit Dog">
                            <Edit2 size={16} />
                          </button>
                        </Link>
                        <button 
                          className={`${styles.iconBtn} ${styles.delete}`} 
                          title="Delete Dog"
                          onClick={() => handleDelete(dog.id)}
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
        {!loading && filteredDogs.length > 0 && (
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "16px 32px",
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-surface)"
          }}>
            <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDogs.length)} of {filteredDogs.length} dogs
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
