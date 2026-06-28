"use client";
import ProtectedRoute from "../components/ProtectedRoute";
import "./breeds.css";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { breedCards } from "../data/breed";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Zap, 
  Ruler, 
  Scissors, 
  Home, 
  Leaf, 
  Inbox, 
  ArrowRight 
} from "lucide-react";

const SIZE_OPTS = ["Small", "Medium", "Large"];
const ENERGY_OPTS = ["Low", "Moderate", "High"];
const GROOMING_OPTS = ["Low", "Moderate", "High"];
const EXPENSE_OPTS = ["Low", "Standard", "High", "Very High"];
const GROUP_OPTS = ["Companion", "Sporting", "Working", "Toy", "Herding"];
const OWNER_OPTS = ["Apartment", "Family", "First-time Owner", "Active Owner"];

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filteredBreeds = useMemo(() => {
    return breedCards.filter((breed) => {
      const s = searchTerm.toLowerCase();
      const t = temperamentFilter.toLowerCase();
      return (
        (breed.name.toLowerCase().includes(s) || breed.aliases?.toLowerCase().includes(s)) &&
        (!temperamentFilter || breed.temperament?.toLowerCase().includes(t)) &&
        (!sizeFilter || breed.size?.toLowerCase().includes(sizeFilter.toLowerCase())) &&
        (!energyFilter || breed.energy?.toLowerCase() === energyFilter.toLowerCase()) &&
        (!groomingFilter || breed.grooming?.toLowerCase() === groomingFilter.toLowerCase()) &&
        (!expenseFilter || breed.expense?.toLowerCase() === expenseFilter.toLowerCase()) &&
        (!groupFilter || breed.group?.toLowerCase() === groupFilter.toLowerCase()) &&
        (!idealOwnerFilter || breed.idealOwner?.toLowerCase().includes(idealOwnerFilter.toLowerCase()))
      );
    });
  }, [searchTerm, sizeFilter, energyFilter, groomingFilter, expenseFilter, groupFilter, idealOwnerFilter, temperamentFilter]);

  const activeCount = [sizeFilter, energyFilter, groomingFilter, expenseFilter, groupFilter, idealOwnerFilter, temperamentFilter].filter(Boolean).length;

  const clearFilters = () => {
    setSearchTerm(""); setSizeFilter(""); setEnergyFilter("");
    setGroomingFilter(""); setExpenseFilter(""); setGroupFilter("");
    setIdealOwnerFilter(""); setTemperamentFilter("");
  };

  const energyClass = (e) => {
    const v = e?.toLowerCase();
    if (v === "high") return "bp-badge--high";
    if (v === "moderate") return "bp-badge--mod";
    return "bp-badge--low";
  };

  return (
    <ProtectedRoute>
      <div className="bp-page">

        {/* HEADER */}
        <header className="bp-header">
          <p className="bp-eyebrow">Dog Breeds</p>
          <h1>Find your perfect<br /><em>companion.</em></h1>
          <p className="bp-header-sub">
            Filter by lifestyle, space, energy, and care needs — find the breed that truly fits.
          </p>
        </header>

        {/* SEARCH + FILTER TOGGLE */}
        <div className="bp-controls">
          <div className="bp-search-wrap">
            <Search className="bp-search-icon" size={16} />
            <input
              className="bp-search"
              type="text"
              placeholder="Search breed or alias…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="bp-search-clear" onClick={() => setSearchTerm("")}>
                <X size={14} />
              </button>
            )}
            <button
              className={`bp-filter-toggle${filtersOpen ? " bp-filter-toggle--open" : ""}`}
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <SlidersHorizontal size={14} className="bp-btn-icon" /> Filters
              {activeCount > 0 && <span className="bp-filter-count">{activeCount}</span>}
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        {filtersOpen && (
          <div className="bp-filters">
            <div className="bp-filters-grid">
              <div className="bp-filter-group">
                <label>Group</label>
                <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
                  <option value="">All groups</option>
                  {GROUP_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group">
                <label>Size</label>
                <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)}>
                  <option value="">All sizes</option>
                  {SIZE_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group">
                <label>Energy</label>
                <select value={energyFilter} onChange={(e) => setEnergyFilter(e.target.value)}>
                  <option value="">Any energy</option>
                  {ENERGY_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group">
                <label>Grooming</label>
                <select value={groomingFilter} onChange={(e) => setGroomingFilter(e.target.value)}>
                  <option value="">Any grooming</option>
                  {GROOMING_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group">
                <label>Cost</label>
                <select value={expenseFilter} onChange={(e) => setExpenseFilter(e.target.value)}>
                  <option value="">Any cost</option>
                  {EXPENSE_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group">
                <label>Ideal Owner</label>
                <select value={idealOwnerFilter} onChange={(e) => setIdealOwnerFilter(e.target.value)}>
                  <option value="">All owners</option>
                  {OWNER_OPTS.map((o) => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                </select>
              </div>
              <div className="bp-filter-group bp-filter-group--wide">
                <label>Temperament</label>
                <input
                  type="text"
                  placeholder="e.g. friendly, calm, loyal…"
                  value={temperamentFilter}
                  onChange={(e) => setTemperamentFilter(e.target.value)}
                />
              </div>
            </div>
            {activeCount > 0 && (
              <button className="bp-clear-btn" onClick={clearFilters}>
                <X size={14} className="bp-btn-icon" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ACTIVE FILTER CHIPS */}
        {activeCount > 0 && (
          <div className="bp-active-chips">
            {[
              { label: groupFilter, clear: () => setGroupFilter("") },
              { label: sizeFilter, clear: () => setSizeFilter("") },
              { label: energyFilter, clear: () => setEnergyFilter("") },
              { label: groomingFilter, clear: () => setGroomingFilter("") },
              { label: expenseFilter, clear: () => setExpenseFilter("") },
              { label: idealOwnerFilter, clear: () => setIdealOwnerFilter("") },
              { label: temperamentFilter, clear: () => setTemperamentFilter("") },
            ].filter((c) => c.label).map((c) => (
              <button key={c.label} className="bp-active-chip" onClick={c.clear}>
                {c.label} <X size={11} className="bp-chip-x" />
              </button>
            ))}
          </div>
        )}

        {/* RESULTS COUNT */}
        <div className="bp-results-info">
          <strong>{filteredBreeds.length}</strong> breed{filteredBreeds.length !== 1 ? "s" : ""}
        </div>

        {/* GRID */}
        <div className="bp-grid">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bp-card bp-card--skeleton">
                <div className="bp-skel-img" />
                <div className="bp-skel-body">
                  <div className="bp-skel-line" />
                  <div className="bp-skel-line bp-skel-line--sm" />
                  <div className="bp-skel-line bp-skel-line--xs" />
                </div>
              </div>
            ))
          ) : filteredBreeds.length === 0 ? (
            <div className="bp-empty">
              <Inbox size={48} className="bp-empty-icon" />
              <p>No breeds match your filters.</p>
              <button onClick={clearFilters}>Reset Filters</button>
            </div>
          ) : (
            filteredBreeds.map((breed, i) => (
              <Link
                key={breed.name}
                href={`/breeds/${encodeURIComponent(breed.name)}`}
                className="bp-card"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s` }}
              >
                <div className="bp-card-img-wrap">
                  <img src={breed.image} alt={breed.name} loading="lazy" />
                </div>

                <div className="bp-card-body">
                  <h3 className="bp-card-name">{breed.name}</h3>
                  {breed.aliases && (
                    <p className="bp-card-alias">aka {breed.aliases}</p>
                  )}
                  <div className="bp-card-tags">
                    {breed.group && <span>{breed.group}</span>}
                    {breed.size && (
                      <span>
                        <Ruler size={11} className="bp-tag-icon" /> {breed.size}
                      </span>
                    )}
                  </div>
                  {breed.idealOwner && (
                    <p className="bp-card-owner">
                      <Home size={13} className="bp-card-icon" /> {breed.idealOwner}
                    </p>
                  )}
                  {breed.temperament && (
                    <p className="bp-card-temp">
                      <Leaf size={13} className="bp-card-icon" /> {breed.temperament}
                    </p>
                  )}
                  <span className="bp-view-btn">
                    View Details <ArrowRight size={13} className="bp-view-icon" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}