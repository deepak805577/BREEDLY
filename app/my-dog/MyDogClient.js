"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./my-dog.css";
import { breedCards } from "@/app/data/breed";

export default function MyDogClient() {
  const [dogs, setDogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeDogId, setActiveDogId] = useState(null);

  // Load dogs from localStorage
  useEffect(() => {
    const storedDogs = JSON.parse(localStorage.getItem("breedlyDogs")) || [];
    const storedActive = localStorage.getItem("activeDogId");

    setDogs(storedDogs);

    if (storedActive && storedDogs.find((d) => d.id === storedActive)) {
      setActiveDogId(storedActive);
    } else if (storedDogs.length > 0) {
      setActiveDogId(storedDogs[0].id);
      localStorage.setItem("activeDogId", storedDogs[0].id);
    }
  }, []);

  const selectDog = (id) => {
    setActiveDogId(id);
    localStorage.setItem("activeDogId", id);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this dog profile?")) {
      const updatedDogs = dogs.filter((dog) => dog.id !== id);
      setDogs(updatedDogs);
      localStorage.setItem("breedlyDogs", JSON.stringify(updatedDogs));
    }
  };

  const startEdit = (dog) => {
    setEditingId(dog.id);
    setEditData({ ...dog });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEdit = () => {
    const updatedDogs = dogs.map((dog) =>
      dog.id === editingId ? editData : dog
    );
    setDogs(updatedDogs);
    localStorage.setItem("breedlyDogs", JSON.stringify(updatedDogs));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };
 return (
    <main className="my-dog-page">
      <header className="my-dog-header">
        <h1>🐾 My Dogs</h1>
        <p>Your personalized dog profiles</p>
      </header>

      {dogs.length === 0 ? (
        <div className="empty-state">
          <p>You haven’t added any dogs yet.</p>
          <Link href="/my-dog/add" className="primary-btn">
            + Add Your Dog
          </Link>
        </div>
      ) : (
        <>
          <div className="dog-grid">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className={`dog-card ${activeDogId === dog.id ? "active" : ""}`}
                onClick={() => selectDog(dog.id)}
              >
                {editingId === dog.id ? (
                  <div className="edit-form">
                    <label>
                      Dog Name
                      <input
                        type="text"
                        name="name"
                        required
                        value={editData.name}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Breed
                      <select
                        name="breed"
                        required
                        value={editData.breed}
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
                          value={editData.age}
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
                          value={editData.weight}
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
                        value={editData.allergies}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      City
                      <input
                        type="text"
                        name="city"
                        required
                        value={editData.city}
                        onChange={handleChange}
                      />
                    </label>

                    <div className="card-actions">
                      <button onClick={saveEdit} className="secondary-btn">
                        💾 Save
                      </button>
                      <button onClick={cancelEdit} className="delete-btn">
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{dog.name}</h3>
                    <p className="breed">{dog.breed}</p>
                    <ul className="dog-meta">
                      <li>🎂 Age: {dog.age} yrs</li>
                      <li>⚖️ Weight: {dog.weight} kg</li>
                      {dog.allergies && <li>🚫 Allergies: {dog.allergies}</li>}
                      <li>📍 City: {dog.city}</li>
                    </ul>
                    <div className="age-warning">
                      {dog.age < 1 && (
                        <p>
                          🐶 Puppy Warning: Frequent vet visits, vaccinations,
                          socialization & puppy diet required.
                        </p>
                      )}
                      {dog.age >= 1 && dog.age < 7 && (
                        <p>
                          🐕 Adult Tip: Maintain regular exercise, balanced diet
                          & preventive care.
                        </p>
                      )}
                      {dog.age >= 7 && (
                        <p>
                          🦴 Senior Alert: Monitor joints, special diet, gentle
                          exercise, frequent vet checks.
                        </p>
                      )}
                    </div>
                    <div className="daily-care-plan">
                      <h4>📋 Daily Care Plan</h4>
                      <ul>
                        <li>
                          🥗 Meals:{" "}
                          {dog.food ? dog.food.recommended : "Check Food Guide"}
                        </li>
                        <li>💧 Hydration: Keep fresh water available</li>
                        <li>
                          🏃 Exercise:{" "}
                          {dog.age < 1
                            ? "Short frequent play"
                            : dog.age < 7
                            ? "1–2 walks/day"
                            : "Gentle walks & light play"}
                        </li>
                        <li>🩺 Health: Preventive care, regular vet checks</li>
                        <li>🧼 Grooming: Brushing, baths, dental & ear care</li>
                      </ul>
                    </div>

                    <div className="card-actions">
                      <button
                        onClick={() => startEdit(dog)}
                        className="secondary-btn edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dog.id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
                      </button>
                      <Link
                        href={`/food-guide`}
                        className="secondary-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        🍖 Food Guide
                      </Link>
                     <Link
  href={`/health-guide?breed=${encodeURIComponent(dog.breed)}&age=${dog.age}`}
  className="secondary-btn"
>
  🩺 Health Guide
</Link>

                      <Link href="/my-dog/services" className="secondary-btn">
                        📍 Local Services
                      </Link>

                      {activeDogId === dog.id && (
                        <span className="active-badge">Active 🐾</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="add-more">
            <Link href="/my-dog/add" className="primary-btn">
              + Add Another Dog
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
