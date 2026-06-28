"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "../../../admin.module.css";
import { ArrowLeft, Save, Dog, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function EditDogPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dog, setDog] = useState(null);

  useEffect(() => {
    fetchDog();
  }, [resolvedParams.id]);

  const fetchDog = async () => {
    try {
      const { data, error } = await supabase
        .from("dogs")
        .select(`
          *,
          profiles ( username, full_name, avatar_url )
        `)
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;
      setDog(data);
    } catch (error) {
      console.error("Error fetching dog:", error);
      alert("Failed to load dog profile");
      router.push("/admin/dogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setDog({ ...dog, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        name: dog.name,
        breed: dog.breed,
        age: parseInt(dog.age) || null,
        weight: parseFloat(dog.weight) || null,
        city: dog.city,
        allergies: dog.allergies,
        photo_url: dog.photo_url
      };

      const { error } = await supabase
        .from("dogs")
        .update(updateData)
        .eq("id", dog.id);

      if (error) throw error;
      alert("Dog profile updated successfully!");
      router.push("/admin/dogs");
    } catch (error) {
      console.error("Error updating dog:", error);
      alert("Failed to update dog profile. Check permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading dog profile...</p>
      </div>
    );
  }

  if (!dog) return null;

  return (
    <div className={styles.formContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dogs">
            <button className={styles.iconBtn} style={{ backgroundColor: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h2 className={styles.tableTitle} style={{ margin: "0 0 4px 0" }}>Edit Dog Profile</h2>
            <p style={{ margin: 0, color: "var(--admin-text-secondary)", fontSize: "14px" }}>
              Updating profile for <strong style={{ color: "var(--admin-text-primary)" }}>{dog.name}</strong>
              {dog.profiles && ` (Owned by ${dog.profiles.full_name || dog.profiles.username})`}
            </p>
          </div>
        </div>
        
        <button 
          className={styles.primaryBtn} 
          onClick={handleSave} 
          disabled={saving}
          style={{ width: "auto" }}
        >
          {saving ? (
            <><div className={styles.spinner} style={{ width: "16px", height: "16px", borderWidth: "2px" }}></div> Saving...</>
          ) : (
            <><Save size={18} /> Save Changes</>
          )}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}>
        {/* Left Column - Image & Quick Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ 
            backgroundColor: "var(--admin-surface)", 
            padding: "24px", 
            borderRadius: "16px", 
            border: "1px solid var(--admin-border)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <div style={{ 
              width: "160px", height: "160px", borderRadius: "50%", 
              overflow: "hidden", border: "4px solid var(--admin-bg)", 
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginBottom: "16px",
              position: "relative"
            }}>
              <img 
                src={dog.photo_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"} 
                alt={dog.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h3 style={{ margin: "0 0 4px 0", color: "var(--admin-text-primary)", fontSize: "20px" }}>{dog.name}</h3>
            <span style={{ 
              backgroundColor: "rgba(232, 173, 127, 0.15)", color: "var(--admin-primary-dark)", 
              padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" 
            }}>
              {dog.breed || "Mixed Breed"}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <ImageIcon size={16} /> Photo URL
            </label>
            <input
              type="text"
              className={styles.input}
              value={dog.photo_url || ""}
              onChange={(e) => handleChange("photo_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div style={{ 
          backgroundColor: "var(--admin-surface)", 
          padding: "32px", 
          borderRadius: "16px", 
          border: "1px solid var(--admin-border)" 
        }}>
          <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)", display: "flex", alignItems: "center", gap: "8px", fontSize: "18px" }}>
            <Dog size={20} color="var(--admin-primary)" /> Basic Information
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Dog Name</label>
              <input
                type="text"
                className={styles.input}
                value={dog.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Buddy"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Breed</label>
              <input
                type="text"
                className={styles.input}
                value={dog.breed || ""}
                onChange={(e) => handleChange("breed", e.target.value)}
                placeholder="Golden Retriever"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Age (Years)</label>
              <input
                type="number"
                className={styles.input}
                value={dog.age || ""}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="3"
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Weight (kg)</label>
              <input
                type="number"
                className={styles.input}
                value={dog.weight || ""}
                onChange={(e) => handleChange("weight", e.target.value)}
                placeholder="25.5"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "20px" }}>
            <label className={styles.label}>City/Location</label>
            <input
              type="text"
              className={styles.input}
              value={dog.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="New York"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Allergies</label>
            <textarea
              className={styles.input}
              value={dog.allergies || ""}
              onChange={(e) => handleChange("allergies", e.target.value)}
              placeholder="Chicken, Beef, etc..."
              style={{ minHeight: "80px", resize: "vertical" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
