"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./add-dog.css";
import { breedCards } from "@/app/data/breed";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dogProfile = {
      id: `dog_${Date.now()}`,
      ...form,
      age: Number(form.age),
      weight: Number(form.weight),
      // Adding a placeholder for the care plan data
      food: { recommended: "Calculate based on breed" }
    };

    const existing = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const updatedPack = [...existing, dogProfile];
    
    localStorage.setItem("breedlyDogs", JSON.stringify(updatedPack));
    
    // Auto-select the new dog as active
    localStorage.setItem("activeDogId", dogProfile.id);

    router.push("/my-dog");
  };

  return (
    <main className="add-dog-page">
      <header style={{textAlign: 'center'}}>
        <h1>Build Your <em>Pack</em></h1>
        <p className="subtitle">
          Every dog is unique. Tell us about your companion to generate a custom 
          health and nutrition dashboard.
        </p>
      </header>

      <form className="dog-form" onSubmit={handleSubmit}>
        {/* Section 1: The Basics */}
        <div className="form-group">
          <h3 className="form-group-title">The Basics</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <label>
              Dog Name
              <input
                type="text"
                name="name"
                placeholder="e.g. Charlie"
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

        {/* Section 2: Vitals */}
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

        {/* Section 3: Lifestyle */}
        <div className="form-group">
          <h3 className="form-group-title">Lifestyle</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
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

        <div className="form-footer">
          <button type="submit" className="save-btn">Create Dog Profile</button>
          <button type="button" className="skip-btn" onClick={() => router.push("/")}>
            I'll do this later
          </button>
        </div>
      </form>
    </main>
  );
}