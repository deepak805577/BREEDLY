"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./add-dog.css";
import { breedCards } from "@/app/data/breed";
import { supabase } from "@/lib/supabase";

export default function AddDogPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    allergies: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SINGLE CLEAN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        alert("Please login first");
        setLoading(false);
        return;
      }

      console.log("Authenticated user:", { id: user.id, email: user.email });

      // 2. Insert dog
 const insertPayload = {
        user_id: user.id,
        name: form.name,
        breed: form.breed,
        age: Number(form.age),
        city: form.city,
        allergies: form.allergies,
        created_at: new Date(),
        last_fed_at: null,
      };
      
      console.log("Inserting with payload:", insertPayload);
      
      const { data, error } = await supabase
  .from("dogs")
  .insert([insertPayload])
  .select();

console.log("INSERT RESPONSE:", { data, error });

if (error) {
  console.error("INSERT FAILED - Error Object:", JSON.stringify(error, null, 2));
  alert(`Insert failed: ${error.message || JSON.stringify(error)}`);
  setLoading(false);
  return;
}

if (!data || data.length === 0) {
  console.error("INSERT FAILED - No data returned");
  alert("Insert failed: No data returned from database");
  setLoading(false);
  return;
}

const insertedDog = data[0];
      // 3. Create initial streak
      await supabase.from("streaks").insert([
        {
          dog_id: insertedDog.id,
          current_streak: 0,
          last_updated: new Date(),
        },
      ]);

      // 4. Add onboarding log (reward trigger)
      await supabase.from("care_logs").insert([
        {
          dog_id: insertedDog.id,
          type: "onboarding",
          value: "profile_created",
          created_at: new Date(),
        },
      ]);

      // 5. Redirect
      router.push("/my-dog");

    } catch (err) {
  console.error("FULL ERROR:", JSON.stringify(err, null, 2));
  alert(err?.message || "Something went wrong!");
} finally {
      setLoading(false);
    }
  };

  return (
    <main className="add-dog-page">
      <header style={{ textAlign: "center" }}>
        <h1>Welcome to Your Dog’s Journey 🐾</h1>
        <p className="subtitle">
          Every dog is unique. Tell us about your companion to generate a custom
          health and nutrition dashboard.
        </p>
      </header>

      <form className="dog-form" onSubmit={handleSubmit}>
        
        {/* BASICS */}
        <div className="form-group">
          <h3 className="form-group-title">The Basics</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <label>
              Dog Name
              <input
                type="text"
                name="name"
                placeholder="e.g. Bruno 🐶"
                required
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label>
              Breed
              <select name="breed" required value={form.breed} onChange={handleChange}>
                <option value="">Search Breed</option>
                {breedCards.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </label>

          </div>
        </div>

        {/* VITALS */}
        <div className="form-group">
          <h3 className="form-group-title">Vitals</h3>
          <div className="row">
            
            <label>
              Age (Years)
              <input
                type="number"
                step="0.1"
                name="age"
                placeholder="2"
                required
                value={form.age}
                onChange={handleChange}
              />
            </label>

            <label>
              Weight (kg)
              <input
                type="number"
                step="0.1"
                name="weight"
                placeholder="15"
                required
                value={form.weight}
                onChange={handleChange}
              />
            </label>

          </div>
        </div>

        {/* LIFESTYLE */}
        <div className="form-group">
          <h3 className="form-group-title">Lifestyle</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <label>
              Allergies & Sensitivities
              <input
                type="text"
                name="allergies"
                placeholder="e.g. Chicken, Grains, or None"
                value={form.allergies}
                onChange={handleChange}
              />
            </label>

            <label>
              Current City
              <input
                type="text"
                name="city"
                placeholder="For local vet discovery"
                required
                value={form.city}
                onChange={handleChange}
              />
            </label>

          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-footer">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Dog Profile"}
          </button>

          <button
            type="button"
            className="skip-btn"
            onClick={() => router.push("/")}
          >
            I'll do this later
          </button>
        </div>

      </form>
    </main>
  );
}