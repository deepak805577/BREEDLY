"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import "./breeds.css";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { breedCards } from "../data/breed";

export default function BreedsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [energyFilter, setEnergyFilter] = useState("");
  const [groomingFilter, setGroomingFilter] = useState("");
  const [expenseFilter, setExpenseFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [idealOwnerFilter, setIdealOwnerFilter] = useState("");
  const [temperamentFilter, setTemperamentFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredBreeds = useMemo(() => {
    return breedCards.filter((breed) => {
      const search = searchTerm.toLowerCase();
      const temperamentSearch = temperamentFilter.toLowerCase();

      const matchesSearch =
        breed.name.toLowerCase().includes(search) ||
        breed.aliases?.toLowerCase().includes(search);

      const matchesTemperament =
        !temperamentFilter ||
        breed.temperament?.toLowerCase().includes(temperamentSearch);

      const size = breed.size?.toLowerCase() || "";
      const energy = breed.energy?.toLowerCase() || "";
      const grooming = breed.grooming?.toLowerCase() || "";
      const expense = breed.expense?.toLowerCase() || "";
      const group = breed.group?.toLowerCase() || "";
      const idealOwner = breed.idealOwner?.toLowerCase() || "";

      return (
        matchesSearch &&
        matchesTemperament &&
        (!sizeFilter || size.includes(sizeFilter)) &&
        (!energyFilter || energy === energyFilter) &&
        (!groomingFilter || grooming === groomingFilter) &&
        (!expenseFilter || expense === expenseFilter) &&
        (!groupFilter || group === groupFilter) &&
        (!idealOwnerFilter || idealOwner.includes(idealOwnerFilter))
      );
    });
  }, [
    searchTerm,
    sizeFilter,
    energyFilter,
    groomingFilter,
    expenseFilter,
    groupFilter,
    idealOwnerFilter,
    temperamentFilter,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSizeFilter("");
    setEnergyFilter("");
    setGroomingFilter("");
    setExpenseFilter("");
    setGroupFilter("");
    setIdealOwnerFilter("");
    setTemperamentFilter("");
  };

  return (
    <ProtectedRoute>
    <div className="breeds-page">
      <header className="breeds-header">
        <h1>🐾 Browse Dog Breeds</h1>
        <p>Find your perfect match based on lifestyle & care needs</p>
      </header>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search breed or alias…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="filters sticky">
        <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option value="">Group</option>
          <option value="companion">Companion</option>
          <option value="sporting">Sporting</option>
          <option value="working">Working</option>
          <option value="toy">Toy</option>
          <option value="herding">Herding</option>
        </select>

        <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
          <option value="">Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <select value={energyFilter} onChange={(e) => setEnergyFilter(e.target.value)}>
          <option value="">Energy</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>

        <select value={groomingFilter} onChange={(e) => setGroomingFilter(e.target.value)}>
          <option value="">Grooming</option>
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>

        <select value={expenseFilter} onChange={(e) => setExpenseFilter(e.target.value)}>
          <option value="">Cost</option>
          <option value="low">Low</option>
          <option value="standard">Standard</option>
          <option value="high">High</option>
          <option value="very high">Very High</option>
        </select>

        <select
          value={idealOwnerFilter}
          onChange={(e) => setIdealOwnerFilter(e.target.value)}
        >
          <option value="">Ideal Owner</option>
          <option value="apartment">Apartment</option>
          <option value="family">Family</option>
          <option value="first-time">First-time Owner</option>
          <option value="active">Active Owner</option>
        </select>

        <input
          type="text"
          className="temperament-input"
          placeholder="Temperament (friendly, calm…) "
          value={temperamentFilter}
          onChange={(e) => setTemperamentFilter(e.target.value)}
        />

        <button className="clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {/* Result Count */}
      <div className="results-info">
        Showing <strong>{filteredBreeds.length}</strong> breeds
      </div>

      {/* Grid */}
      <div className="breed-grid">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="breed-card skeleton">
              <div className="skeleton-img"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line small"></div>
            </div>
          ))
        ) : filteredBreeds.length === 0 ? (
          <div className="empty-state">
            <p>No breeds match your filters.</p>
            <button onClick={clearFilters}>Reset Filters</button>
          </div>
        ) : (
          filteredBreeds.map((breed) => (
            <div key={breed.name} className="breed-card">
              <img src={breed.image} alt={breed.name} />

              <h3>{breed.name}</h3>
              {breed.aliases && <p className="meta">aka {breed.aliases}</p>}

              <p className="meta">
                {breed.group} • {breed.size}
              </p>

              <p className="meta">
                Energy: {breed.energy} • Grooming: {breed.grooming}
              </p>

              <p className="meta">
                Ideal for: {breed.idealOwner}
              </p>
 <p className="meta">
                Temperament: {breed.temperament}
              </p>

              <Link
                href={`/breeds/${encodeURIComponent(breed.name)}`}
                className="view-btn"
              >
                View Details →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
