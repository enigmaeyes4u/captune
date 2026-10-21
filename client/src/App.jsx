import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PhotoUpload from './components/PhotoUpload';
import VibeSelector from './components/VibeSelector';
import CaptionsList from './components/CaptionsList';
import SongFrame from './components/SongFrame';
import { SparklesIcon, AlertCircleIcon, CloseIcon, EqualizerIcon } from './components/Icons';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [vibe, setVibe] = useState('any');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoNotice, setDemoNotice] = useState('');

  // Clean up preview object URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSelectFile = (newFile) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(newFile);
    setPreviewUrl(URL.createObjectURL(newFile));
    setErrorMessage('');
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setErrorMessage('');
  };

  const handleGenerate = async () => {
    if (!file) {
      setErrorMessage('Please upload a photo or pick a sample above first.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setDemoNotice('');
    setLoadingStep('Analyzing composition & aesthetic hues...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Crafting tone-tailored captions...');
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Curating matching 5-track soundtrack...');
    }, 1800);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('vibe', vibe);

      const endpoint = `${API_BASE_URL}/api/generate`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server returned error status ${response.status}`);
      }

      setResults(data);
      if (data.note) {
        setDemoNotice(data.note);
      }
    } catch (err) {
      console.error('Generation request failed:', err);
      setErrorMessage(
        err.message || 'Unable to connect to the backend server. Please verify your connection.'
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-background">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>

      <div className="app-container">
        <Header />

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert-card error-alert" role="alert">
            <div className="alert-body">
              <AlertCircleIcon size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              className="alert-close-btn"
              onClick={() => setErrorMessage('')}
              aria-label="Dismiss message"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Demo Mode Notice */}
        {demoNotice && (
          <div className="alert-card info-alert">
            <div className="alert-body">
              <SparklesIcon size={16} />
              <span>{demoNotice}</span>
            </div>
            <button
              type="button"
              className="alert-close-btn"
              onClick={() => setDemoNotice('')}
              aria-label="Dismiss"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {/* Balanced Studio Grid: Input (Left) & Outputs (Right) */}
        <main className="studio-grid">
          {/* Left Column: Visual Input Studio */}
          <section className="glass-card input-card">
            <div className="card-top-header">
              <div className="card-step-badge">1</div>
              <div>
                <h2 className="card-title">Photo & Atmosphere</h2>
                <p className="card-subtitle">Upload your picture or pick a sample</p>
              </div>
            </div>

            <PhotoUpload
              file={file}
              previewUrl={previewUrl}
              onSelectFile={handleSelectFile}
              onClearFile={handleClearFile}
              onError={(msg) => setErrorMessage(msg)}
            />

            <VibeSelector
              selectedVibe={vibe}
              onSelectVibe={(newVibe) => setVibe(newVibe)}
              disabled={loading}
            />

            <button
              id="generate-btn"
              type="button"
              className={`cta-generate-btn ${loading ? 'is-loading' : ''}`}
              onClick={handleGenerate}
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  <span>{loadingStep || 'Analyzing visual aura...'}</span>
                </>
              ) : (
                <>
                  <SparklesIcon size={18} />
                  <span>Generate Captions & Playlist</span>
                </>
              )}
            </button>
          </section>

          {/* Right Column: Balanced Curated Outputs */}
          <section className="glass-card results-card">
            <div className="card-top-header results-header-row">
              <div className="header-left-meta">
                <div className="card-step-badge">2</div>
                <div>
                  <h2 className="card-title">Curated Outputs</h2>
                  <p className="card-subtitle">AI-generated captions & soundtrack recommendations</p>
                </div>
              </div>
            </div>

            {!results ? (
              <div className="empty-state-card">
                <div className="empty-sparkle-halo">
                  <SparklesIcon size={32} />
                </div>
                <h3 className="empty-heading">Ready for Inspiration</h3>
                <p className="empty-text">
                  Choose a photo on the left, pick your desired vibe, and click <strong>Generate Captions & Playlist</strong>.
                </p>
              </div>
            ) : (
              <div className="results-wrapper">
                {/* Horizontal Atmosphere Spotlight Banner */}
                {results.mood && (
                  <div className="mood-spotlight-bar">
                    <div className="mood-spotlight-left">
                      <div className="mood-badge-icon">
                        <EqualizerIcon />
                      </div>
                      <div className="mood-details">
                        <span className="mood-caption-label">Visual Atmosphere Mood</span>
                        <span className="mood-display-title">{results.mood}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Two Balanced Columns: Captions on Left, Soundtrack on Right */}
                <div className="results-subgrid">
                  <div className="subgrid-col captions-subcol">
                    <CaptionsList captions={results.captions} />
                  </div>
                  <div className="subgrid-col playlist-subcol">
                    <SongFrame songs={results.songs} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="app-footer">
          <p>Captune &bull; Intelligent Visual Soundtrack & Caption Curator</p>
        </footer>
      </div>
    </div>
  );
}
