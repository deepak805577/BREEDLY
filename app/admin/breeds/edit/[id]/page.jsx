"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "../../../admin.module.css";
import { ArrowLeft, Save, Code, AlignLeft } from "lucide-react";
import Link from "next/link";

export default function EditBreedPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // 'basic' | 'json'

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    group_name: "",
    size: "",
    description: "",
    image_url: "",
    energy_level: 3,
    trainability: 3,
  });

  const [jsonData, setJsonData] = useState("{}");
  const [jsonError, setJsonError] = useState("");

  useEffect(() => {
    fetchBreed();
  }, [resolvedParams.id]);

  const fetchBreed = async () => {
    try {
      const { data, error } = await supabase
        .from("breeds")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) throw error;
      
      setFormData({
        name: data.name || "",
        slug: data.slug || "",
        group_name: data.group_name || "",
        size: data.size || "",
        description: data.description || "",
        image_url: data.image_url || "",
        energy_level: data.energy_level || 3,
        trainability: data.trainability || 3,
      });

      setJsonData(JSON.stringify(data.content_data || {}, null, 2));

    } catch (err) {
      console.error("Error fetching breed:", err);
      alert("Error loading breed data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
    try {
      JSON.parse(e.target.value);
      setJsonError("");
    } catch (err) {
      setJsonError("Invalid JSON format");
    }
  };

  const handleSave = async () => {
    if (jsonError) {
      alert("Please fix the JSON errors before saving.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("breeds")
        .update({
          ...formData,
          content_data: JSON.parse(jsonData),
        })
        .eq("id", resolvedParams.id);

      if (error) throw error;
      
      alert("Breed updated successfully!");
      router.push("/admin/breeds");
    } catch (err) {
      console.error("Error updating breed:", err);
      alert("Error updating breed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <p style={{ color: "var(--admin-text-secondary)" }}>Loading breed data...</p>
      </div>
    );
  }

  return (
    <div className={styles.wizardContainer}>
      {/* HEADER */}
      <div className={styles.wizardHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/breeds" className={styles.backBtn}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className={styles.wizardTitle}>Edit Breed: {formData.name}</h2>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--admin-text-secondary)" }}>
              Update standard information or modify the advanced JSON profile.
            </p>
          </div>
        </div>

        <button 
          className={styles.nextBtn} 
          onClick={handleSave} 
          disabled={saving || !!jsonError}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* PREMIUM SEGMENTED CONTROL TABS */}
      <div style={{ 
        display: "inline-flex", 
        background: "var(--admin-bg)", 
        padding: "6px", 
        borderRadius: "12px", 
        border: "1px solid var(--admin-border)",
        marginBottom: "24px" 
      }}>
        <button 
          onClick={() => setActiveTab("basic")}
          style={{
            background: activeTab === "basic" ? "var(--admin-surface)" : "transparent",
            color: activeTab === "basic" ? "var(--admin-text-primary)" : "var(--admin-text-secondary)",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: activeTab === "basic" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          <AlignLeft size={16} style={{ color: activeTab === "basic" ? "var(--admin-primary)" : "inherit" }} /> 
          Basic Info
        </button>
        <button 
          onClick={() => setActiveTab("json")}
          style={{
            background: activeTab === "json" ? "var(--admin-surface)" : "transparent",
            color: activeTab === "json" ? "var(--admin-text-primary)" : "var(--admin-text-secondary)",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: activeTab === "json" ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          <Code size={16} style={{ color: activeTab === "json" ? "var(--admin-primary)" : "inherit" }} /> 
          Advanced JSON
        </button>
      </div>

      {/* CONTENT */}
      <div className={styles.wizardBody} style={{ backgroundColor: "var(--admin-surface)", borderRadius: "12px", border: "1px solid var(--admin-border)", padding: "24px" }}>
        
        {activeTab === "basic" ? (
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Breed Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className={styles.input} 
                placeholder="e.g. Golden Retriever" 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Slug (URL Identifier)</label>
              <input 
                type="text" 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                className={styles.input} 
                placeholder="e.g. golden-retriever" 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Breed Group</label>
              <select name="group_name" value={formData.group_name} onChange={handleChange} className={styles.input}>
                <option value="">Select Group...</option>
                <option value="Sporting Group">Sporting</option>
                <option value="Hound Group">Hound</option>
                <option value="Working Group">Working</option>
                <option value="Terrier Group">Terrier</option>
                <option value="Toy Group">Toy</option>
                <option value="Non-Sporting Group">Non-Sporting</option>
                <option value="Herding Group">Herding</option>
                <option value="Foundation Stock Service">FSS</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Size Category</label>
              <select name="size" value={formData.size} onChange={handleChange} className={styles.input}>
                <option value="">Select Size...</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Giant">Giant</option>
              </select>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Energy Level (1-5)</label>
              <input 
                type="number" 
                min="1" max="5" 
                name="energy_level" 
                value={formData.energy_level} 
                onChange={handleChange} 
                className={styles.input} 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Trainability (1-5)</label>
              <input 
                type="number" 
                min="1" max="5" 
                name="trainability" 
                value={formData.trainability} 
                onChange={handleChange} 
                className={styles.input} 
              />
            </div>
            
            <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
              <label>Image URL</label>
              <input 
                type="text" 
                name="image_url" 
                value={formData.image_url} 
                onChange={handleChange} 
                className={styles.input} 
                placeholder="/assets/Dogs/golden.jpg" 
              />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
              <label>Short Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className={styles.textarea} 
                rows={4} 
                placeholder="A brief overview of the breed..."
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", height: "600px", background: "#0D1117", borderRadius: "12px", overflow: "hidden", border: jsonError ? "1px solid var(--admin-danger)" : "1px solid #30363D" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#161B22", borderBottom: "1px solid #30363D" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Code size={16} color="#8B949E" />
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#C9D1D9", fontFamily: "monospace" }}>
                  content_data.json
                </span>
              </div>
              {jsonError ? (
                <span style={{ color: "#F85149", fontSize: "12px", fontWeight: "600", backgroundColor: "rgba(248, 81, 73, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                  Error: {jsonError}
                </span>
              ) : (
                <span style={{ color: "#3FB950", fontSize: "12px", fontWeight: "600", backgroundColor: "rgba(63, 185, 80, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                  Valid JSON
                </span>
              )}
            </div>
            
            <textarea 
              value={jsonData}
              onChange={handleJsonChange}
              style={{
                flex: 1,
                width: "100%",
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                fontSize: "14px",
                lineHeight: "1.6",
                padding: "20px",
                backgroundColor: "transparent",
                color: "#E6EDF3",
                border: "none",
                outline: "none",
                resize: "none"
              }}
              spellCheck="false"
            />
          </div>
        )}

      </div>
    </div>
  );
}
