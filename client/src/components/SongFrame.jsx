import React from 'react';
import { SpotifyIcon, YouTubeIcon, DiscIcon } from './Icons';

const TRACK_DURATIONS = ['3:18', '2:45', '3:42', '2:56', '4:10'];

export default function SongFrame({ songs = [] }) {
  if (!songs.length) return null;

  return (
    <div className="song-frame">
      <div className="tracklist-header-row">
        <h3 className="section-heading">
          <DiscIcon size={16} />
          <span>Soundtrack Playlist ({songs.length})</span>
        </h3>
        <span className="streaming-badge">Search on Spotify & YouTube</span>
      </div>

      <div className="tracks-wrapper">
        {songs.map((song, index) => {
          const searchQuery = `${song.title} ${song.artist}`;
          const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(searchQuery)}`;
          const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
          const duration = TRACK_DURATIONS[index % TRACK_DURATIONS.length];

          return (
            <div key={index} className="track-card">
              <div className="track-left">
                <span className="track-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="track-disc-cover">
                  <DiscIcon size={14} />
                </div>
                <div className="track-meta">
                  <span className="track-title" title={song.title}>
                    {song.title}
                  </span>
                  <span className="track-artist-row">
                    <span className="track-artist" title={song.artist}>{song.artist}</span>
                    <span className="track-dot">•</span>
                    <span className="track-duration">{duration}</span>
                  </span>
                </div>
              </div>

              <div className="track-actions">
                <a
                  href={spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-btn spotify-btn"
                  title={`Open "${song.title}" on Spotify`}
                  id={`spotify-link-${index}`}
                >
                  <SpotifyIcon size={12} />
                  <span>Spotify</span>
                </a>

                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-btn youtube-btn"
                  title={`Open "${song.title}" on YouTube`}
                  id={`youtube-link-${index}`}
                >
                  <YouTubeIcon size={12} />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
