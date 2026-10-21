import React, { useState } from 'react';
import { CopyIcon, CheckIcon, SparklesIcon } from './Icons';

export default function CaptionsList({ captions = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyOne = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleCopyAll = async () => {
    try {
      const fullText = captions.map((c, i) => `[${c.tone || 'Vibe'}]\n${c.text}`).join('\n\n');
      await navigator.clipboard.writeText(fullText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy all:', err);
    }
  };

  if (!captions.length) return null;

  return (
    <div className="captions-section">
      <div className="section-title-row">
        <h3 className="section-heading">
          <SparklesIcon size={16} />
          <span>Tailored Captions ({captions.length})</span>
        </h3>
        <button
          type="button"
          className={`copy-all-btn ${copiedAll ? 'copied' : ''}`}
          onClick={handleCopyAll}
          title="Copy all captions at once"
        >
          {copiedAll ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
          <span>{copiedAll ? 'All Copied!' : 'Copy All'}</span>
        </button>
      </div>

      <div className="captions-cards-wrap">
        {captions.map((caption, idx) => {
          const isCopied = copiedIndex === idx;
          const charCount = caption.text?.length || 0;

          return (
            <div key={idx} className="caption-card">
              <div className="caption-card-header">
                <span className="caption-tone-chip">{caption.tone || 'Creative'}</span>
                <div className="caption-meta-actions">
                  <span className="char-count">{charCount} chars</span>
                  <button
                    id={`copy-caption-btn-${idx}`}
                    type="button"
                    className={`copy-btn ${isCopied ? 'copied' : ''}`}
                    onClick={() => handleCopyOne(caption.text, idx)}
                    title="Copy caption"
                  >
                    {isCopied ? (
                      <>
                        <CheckIcon size={13} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p className="caption-quote">"{caption.text}"</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
