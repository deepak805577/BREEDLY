"use client";

import { DogProfile } from "../../types/chat";

const BREEDS = [
  "Labrador Retriever", "Golden Retriever", "German Shepherd",
  "French Bulldog", "Poodle", "Beagle", "Rottweiler",
  "Yorkshire Terrier", "Dachshund", "Shih Tzu", "Siberian Husky",
  "Doberman", "Border Collie", "Cavalier King Charles Spaniel",
  "Boxer", "Bulldog", "Chihuahua", "Maltese", "Pomeranian",
  "Great Dane", "Australian Shepherd", "Cocker Spaniel",
  "Springer Spaniel", "Weimaraner", "Dalmatian", "Mixed Breed",
];

interface Props {
  profile: DogProfile;
  onChange: (p: DogProfile) => void;
}

export function DogProfileBar({ profile, onChange }: Props) {
  return (
    <div className="profile-bar">
      <div className="profile-field">
        <label htmlFor="dog-name">Dog's name</label>
        <input
          id="dog-name"
          type="text"
          placeholder="e.g. Max"
          value={profile.name ?? ""}
          onChange={(e) => onChange({ ...profile, name: e.target.value })}
          maxLength={30}
        />
      </div>
      <div className="profile-field">
        <label htmlFor="dog-breed">Breed</label>
        <select
          id="dog-breed"
          value={profile.breed}
          onChange={(e) => onChange({ ...profile, breed: e.target.value })}
        >
          <option value="">Any breed</option>
          {BREEDS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div className="profile-field">
        <label htmlFor="dog-age">Age</label>
        <input
          id="dog-age"
          type="text"
          placeholder="e.g. 3 months"
          value={profile.age}
          onChange={(e) => onChange({ ...profile, age: e.target.value })}
          maxLength={20}
        />
      </div>
    </div>
  );
}
