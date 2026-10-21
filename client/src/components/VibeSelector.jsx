import React from 'react';

const VIBES = [
  { id: 'any', label: 'Any Vibe', icon: '✨' },
  { id: 'aesthetic', label: 'Aesthetic', icon: '🎨' },
  { id: 'funny', label: 'Funny', icon: '😂' },
  { id: 'romantic', label: 'Romantic', icon: '💖' },
  { id: 'motivational', label: 'Motivational', icon: '⚡' }
];

export default function VibeSelector({ selectedVibe, onSelectVibe, disabled }) {
  return (
    <div className="vibe-section">
      <div className="section-title-row">
        <label className="input-label">Select Mood / Vibe</label>
        <span className="active-vibe-tag">{selectedVibe.toUpperCase()}</span>
      </div>
      <div className="vibe-pills" role="radiogroup" aria-label="Select photo vibe">
        {VIBES.map((vibe) => {
          const isActive = selectedVibe === vibe.id;
          return (
            <button
              key={vibe.id}
              id={`vibe-btn-${vibe.id}`}
              type="button"
              className={`vibe-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectVibe(vibe.id)}
              disabled={disabled}
              role="radio"
              aria-checked={isActive}
            >
              <span className="vibe-pill-icon">{vibe.icon}</span>
              <span className="vibe-pill-label">{vibe.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
