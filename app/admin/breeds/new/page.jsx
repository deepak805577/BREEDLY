"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "../../admin.module.css";
import { 
  ArrowLeft, Check, UploadCloud, Save, ChevronRight, ChevronLeft,
  Info, Activity, Heart, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Info },
  { id: 2, title: "Physical", icon: Activity },
  { id: 3, title: "Temperament", icon: Heart },
  { id: 4, title: "Media", icon: ImageIcon }
];

export default function AddBreedWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    group: "sporting",
    size: "medium",
    description: "",
    lifespan: "",
    weight_male: "",
    weight_female: "",
    height_male: "",
    height_female: "",
    energy_level: 3,
    trainability: 3,
    barking_level: 3,
    grooming_needs: 3,
    good_with_children: true,
    good_with_dogs: true,
    image_url: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSliderChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.name) {
      alert("Breed name is required.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a slug from the name
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      const { data, error } = await supabase
        .from("breeds")
        .insert({
          ...formData,
          slug
        });

      if (error) throw error;
      
      alert("Breed successfully added!");
      router.push("/admin/breeds");
    } catch (error) {
      console.error("Error adding breed:", error);
      alert("Failed to add breed. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ─── HEADER ─── */}
      <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/breeds" style={{ 
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "36px", height: "36px", borderRadius: "12px",
            backgroundColor: "var(--admin-surface)", border: "1px solid var(--admin-border)",
            color: "var(--admin-text-secondary)", textDecoration: "none", transition: "all 0.2s"
          }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className={styles.pageTitle} style={{ marginBottom: "4px" }}>Add New Breed</h2>
            <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", margin: 0 }}>Follow the steps to publish a new breed profile.</p>
          </div>
        </div>
        
        {currentStep === STEPS.length && (
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={styles.tableActionBtn} 
            style={{ padding: "10px 24px", borderRadius: "12px", opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><div className={styles.spinner} style={{ width: "16px", height: "16px", borderWidth: "2px" }} /> Saving...</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Save size={16} /> Publish Breed</span>
            )}
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        
        {/* ─── PROGRESS SIDEBAR ─── */}
        <div style={{
          width: "240px",
          backgroundColor: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "20px",
          padding: "24px",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              
              return (
                <div key={step.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                  {/* Connector Line */}
                  {idx !== STEPS.length - 1 && (
                    <div style={{
                      position: "absolute", left: "15px", top: "32px", bottom: "-24px", width: "2px",
                      backgroundColor: isPast ? "var(--admin-primary)" : "var(--admin-border)",
                      zIndex: 1
                    }} />
                  )}
                  
                  {/* Indicator Circle */}
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    backgroundColor: isActive || isPast ? "var(--admin-primary)" : "var(--admin-bg)",
                    border: `2px solid ${isActive || isPast ? "var(--admin-primary)" : "var(--admin-border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isActive || isPast ? "#fff" : "var(--admin-text-secondary)",
                    zIndex: 2, transition: "all 0.3s"
                  }}>
                    {isPast ? <Check size={16} /> : <Icon size={14} />}
                  </div>
                  
                  {/* Label */}
                  <div style={{ paddingTop: "6px" }}>
                    <div style={{ fontSize: "14px", fontWeight: isActive ? "600" : "500", color: isActive || isPast ? "var(--admin-text-primary)" : "var(--admin-text-secondary)" }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginTop: "2px" }}>
                      Step {step.id} of {STEPS.length}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── FORM CONTENT ─── */}
        <div style={{
          flex: 1,
          backgroundColor: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          borderRadius: "20px",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ padding: "32px", flex: 1 }}>
            
            {/* STEP 1: BASIC INFO */}
            {currentStep === 1 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)", fontSize: "20px" }}>Basic Information</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Breed Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Golden Retriever" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none", transition: "border 0.2s" }} onFocus={(e) => e.target.style.borderColor = "var(--admin-primary)"} onBlur={(e) => e.target.style.borderColor = "var(--admin-border)"} />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Group</label>
                    <select name="group" value={formData.group} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none", appearance: "none" }}>
                      <option value="sporting">Sporting Group</option>
                      <option value="hound">Hound Group</option>
                      <option value="working">Working Group</option>
                      <option value="terrier">Terrier Group</option>
                      <option value="toy">Toy Group</option>
                      <option value="non-sporting">Non-Sporting Group</option>
                      <option value="herding">Herding Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Detailed Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Write a comprehensive description of the breed..." style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none", minHeight: "150px", resize: "vertical" }} onFocus={(e) => e.target.style.borderColor = "var(--admin-primary)"} onBlur={(e) => e.target.style.borderColor = "var(--admin-border)"}></textarea>
                </div>
              </div>
            )}

            {/* STEP 2: PHYSICAL */}
            {currentStep === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)", fontSize: "20px" }}>Physical Attributes</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Size Category</label>
                    <select name="size" value={formData.size} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none", appearance: "none" }}>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="giant">Giant</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Lifespan (Years)</label>
                    <input type="text" name="lifespan" value={formData.lifespan} onChange={handleChange} placeholder="e.g. 10-12" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", padding: "24px", backgroundColor: "var(--admin-bg)", borderRadius: "16px", border: "1px solid var(--admin-border)" }}>
                  <div>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--admin-text-primary)" }}>Weight (lbs)</h4>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>Male</label>
                        <input type="text" name="weight_male" value={formData.weight_male} onChange={handleChange} placeholder="e.g. 65-75" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--admin-border)", outline: "none" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>Female</label>
                        <input type="text" name="weight_female" value={formData.weight_female} onChange={handleChange} placeholder="e.g. 55-65" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--admin-border)", outline: "none" }} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "var(--admin-text-primary)" }}>Height (inches)</h4>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>Male</label>
                        <input type="text" name="height_male" value={formData.height_male} onChange={handleChange} placeholder="e.g. 23-24" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--admin-border)", outline: "none" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>Female</label>
                        <input type="text" name="height_female" value={formData.height_female} onChange={handleChange} placeholder="e.g. 21.5-22.5" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--admin-border)", outline: "none" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TEMPERAMENT */}
            {currentStep === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)", fontSize: "20px" }}>Traits & Temperament</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  
                  {['energy_level', 'trainability', 'barking_level', 'grooming_needs'].map(trait => (
                    <div key={trait}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "var(--admin-text-primary)", textTransform: "capitalize" }}>{trait.replace('_', ' ')}</label>
                        <span style={{ fontSize: "13px", color: "var(--admin-primary-dark)", fontWeight: "600" }}>{formData[trait]} / 5</span>
                      </div>
                      <input 
                        type="range" min="1" max="5" 
                        value={formData[trait]} 
                        onChange={(e) => handleSliderChange(trait, parseInt(e.target.value))}
                        style={{ width: "100%", accentColor: "var(--admin-primary)" }} 
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  ))}

                  <div style={{ height: "1px", backgroundColor: "var(--admin-border)", margin: "8px 0" }} />

                  <div style={{ display: "flex", gap: "32px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "var(--admin-text-primary)" }}>
                      <input type="checkbox" name="good_with_children" checked={formData.good_with_children} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "var(--admin-primary)" }} />
                      Good with Children
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "500", color: "var(--admin-text-primary)" }}>
                      <input type="checkbox" name="good_with_dogs" checked={formData.good_with_dogs} onChange={handleChange} style={{ width: "18px", height: "18px", accentColor: "var(--admin-primary)" }} />
                      Good with other Dogs
                    </label>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 4: MEDIA */}
            {currentStep === 4 && (
              <div style={{ animation: "fadeIn 0.3s ease", display: "flex", flexDirection: "column", height: "100%" }}>
                <h3 style={{ margin: "0 0 24px 0", color: "var(--admin-text-primary)", fontSize: "20px" }}>Media Upload</h3>
                
                <p style={{ color: "var(--admin-text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
                  Provide a high-quality image URL for this breed. In the future, this will support direct drag-and-drop file uploads to a storage bucket.
                </p>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--admin-text-secondary)", marginBottom: "8px" }}>Image URL</label>
                  <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid var(--admin-border)", backgroundColor: "var(--admin-bg)", fontSize: "14px", color: "var(--admin-text-primary)", outline: "none" }} />
                </div>

                {formData.image_url && (
                  <div style={{ marginTop: "24px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--admin-border)", display: "inline-block" }}>
                    <img src={formData.image_url} alt="Preview" style={{ display: "block", maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }} onError={(e) => {e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL"}} />
                  </div>
                )}
                {!formData.image_url && (
                  <div style={{ marginTop: "24px", flex: 1, minHeight: "200px", borderRadius: "16px", border: "2px dashed var(--admin-border)", backgroundColor: "var(--admin-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--admin-text-secondary)", gap: "12px" }}>
                    <UploadCloud size={48} style={{ opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: "500" }}>Image preview will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── FOOTER CONTROLS ─── */}
          <div style={{ 
            padding: "24px 32px", 
            borderTop: "1px solid var(--admin-border)",
            backgroundColor: "var(--admin-bg)",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <button 
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                padding: "10px 20px", borderRadius: "12px", background: "none", border: "1px solid var(--admin-border)",
                color: "var(--admin-text-primary)", fontWeight: "500", cursor: currentStep === 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px", opacity: currentStep === 1 ? 0.5 : 1,
                backgroundColor: "var(--admin-surface)"
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            
            <button 
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              style={{
                padding: "10px 20px", borderRadius: "12px", background: "var(--admin-primary)", border: "none",
                color: "#fff", fontWeight: "500", cursor: currentStep === STEPS.length ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px", opacity: currentStep === STEPS.length ? 0 : 1,
                boxShadow: "0 4px 12px rgba(232, 173, 127, 0.3)"
              }}
            >
              Next Step <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
