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
    };

    const existing = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    localStorage.setItem(
      "breedlyDogs",
      JSON.stringify([...existing, dogProfile])
    );

    router.push("/my-dog");
  };

  // ✅ Add handleSkip function
  const handleSkip = () => {
    // Just redirect to /my-dog without saving
    router.push("/");
  };

  return (
    <main className="add-dog-page">
      <h1>🐾 Add Your Dog</h1>
      <p className="subtitle">
        Tell us about your dog so we can guide you better.
      </p>

      <form className="dog-form" onSubmit={handleSubmit}>
        <label>
          Dog Name
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Breed
          <select
            name="breed"
            required
            value={form.breed}
            onChange={handleChange}
          >
            <option value="">Select breed</option>
            {breedCards.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </label>

        <div className="row">
          <label>
            Age (years)
            <input
              type="number"
              step="0.1"
              name="age"
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
              required
              value={form.weight}
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Allergies (if any)
          <input
            type="text"
            name="allergies"
            placeholder="e.g. Chicken, grains"
            value={form.allergies}
            onChange={handleChange}
          />
        </label>

        <label>
          City
          <input
            type="text"
            name="city"
            required
            value={form.city}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn save-btn">Save Profile</button>
        <button type="button" className="btn skip-btn" onClick={handleSkip}>
          Skip for now
        </button>
      </form>
    </main>
  );
}
