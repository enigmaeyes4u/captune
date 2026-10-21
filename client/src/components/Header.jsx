import React from 'react';
import { SparklesIcon, MusicNoteIcon } from './Icons';

export default function Header() {
  return (
    <header className="app-header">
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo-mark">
            <SparklesIcon size={18} />
          </div>
          <span className="brand-name">Captune</span>
        </div>
        <div className="nav-status">
          <span className="status-indicator-dot"></span>
          <span>Curator Online</span>
        </div>
      </nav>

      <div className="hero-section">
        <h1 className="hero-title">
          Turn Your Photos Into <span className="gradient-text">Viral Captions</span> & <span className="gradient-text-alt">Soundtracks</span>
        </h1>
        <p className="hero-subtitle">
          Select a vibe or upload any photo to generate tone-matched captions and curated Spotify & YouTube tracks in seconds.
        </p>
      </div>
    </header>
  );
}
