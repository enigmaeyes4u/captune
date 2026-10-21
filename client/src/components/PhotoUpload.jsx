import React, { useRef, useState } from 'react';
import { UploadIcon, TrashIcon, SparklesIcon } from './Icons';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const SAMPLE_PRESETS = [
  { id: 'sunset', label: '🌅 Sunset Waves', url: '/samples/sunset.jpg', filename: 'sunset-waves.jpg' },
  { id: 'cafe', label: '☕ Cozy Cafe', url: '/samples/cafe.jpg', filename: 'cozy-cafe.jpg' },
  { id: 'city', label: '🏙️ Neon Nights', url: '/samples/city.jpg', filename: 'neon-city.jpg' }
];

export default function PhotoUpload({ file, previewUrl, onSelectFile, onClearFile, onError }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const inputRef = useRef(null);

  const validateAndHandle = (selectedFile) => {
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      onError('Invalid format. Please upload a JPEG, PNG, GIF, or WEBP image.');
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      onError('File size exceeds 5 MB limit. Please select a smaller photo.');
      return;
    }

    onSelectFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandle(e.target.files[0]);
    }
  };

  const handlePickSample = async (preset) => {
    try {
      setLoadingSample(true);
      const res = await fetch(preset.url);
      if (!res.ok) throw new Error('Could not load sample');
      const blob = await res.blob();
      const sampleFile = new File([blob], preset.filename, { type: 'image/jpeg' });
      validateAndHandle(sampleFile);
    } catch (err) {
      console.warn('Sample load error, using fallback preview:', err);
    } finally {
      setLoadingSample(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="upload-container">
      {!previewUrl ? (
        <>
          <div
            id="photo-dropzone"
            className={`dropzone ${isDragging ? 'active-drag' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              id="photo-file-input"
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="file-input-hidden"
              onChange={handleFileInput}
            />
            <div className="dropzone-icon-wrap">
              <UploadIcon size={24} />
            </div>
            <p className="dropzone-heading">Drop your photo here, or browse</p>
            <p className="dropzone-sub">JPEG, PNG, GIF, WEBP up to 5 MB</p>
          </div>

          <div className="sample-presets-bar">
            <span className="sample-presets-label">
              <SparklesIcon size={12} />
              Quick demo samples:
            </span>
            <div className="sample-chips">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  id={`sample-btn-${preset.id}`}
                  type="button"
                  className="sample-chip"
                  onClick={() => handlePickSample(preset)}
                  disabled={loadingSample}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="preview-container">
          <img src={previewUrl} alt="Upload preview" className="preview-img" />
          <div className="preview-top-bar">
            {file && (
              <span className="preview-meta-badge">
                {file.name} ({formatFileSize(file.size)})
              </span>
            )}
            <button
              id="remove-photo-btn"
              type="button"
              className="action-icon-btn remove-btn"
              title="Remove photo"
              onClick={onClearFile}
            >
              <TrashIcon size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
