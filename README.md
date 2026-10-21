# Captune 🎵✨

> AI-Powered Social Media Captions & Curated Soundtrack Matcher

Captune is a full-stack web application that analyzes uploaded photos or sample presets, pairs them with selected vibes, and produces tone-tailored captions alongside curated 5-track playlists with direct Spotify and YouTube streaming search links.

---

## 🌟 Key Features

- **Visual Atmosphere Analysis**: Analyzes composition, lighting, and palette.
- **Tone-Tailored Captions**: 3 captions per generation with tone badges (Poetic, Witty, Aesthetic, etc.) and character count indicator.
- **Curated Soundtrack**: 5 matching tracks with track numbers, duration estimates, and direct 1-click **Spotify** & **YouTube** search links.
- **One-Click Quick Presets**: Test instantly with built-in presets (`🌅 Sunset Waves`, `☕ Cozy Cafe`, `🏙️ Neon Nights`).
- **One-Click Copy**: Copy individual captions or all captions at once with visual checkmark feedback.
- **Single-Port Full-Stack Deployment**: Node/Express server serves both the REST API and the React SPA static build on a single port for zero-configuration cloud hosting.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in `server/`:
```bash
cp server/.env.example server/.env
```
Add your Anthropic API Key (optional — dynamic demo mode runs automatically if key is not configured):
```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-sonnet-4-6
```

### 3. Run Locally

#### Development (Hot-Reloading):
```bash
# Start backend
npm run dev:server

# Start frontend
npm run dev:client
```

#### Production (Single Port 5000):
```bash
npm run build
npm start
```

---

## ☁️ Deployment

### 1-Click Render.com
Captune includes a `render.yaml` blueprint. Simply connect this repository to Render and deploy automatically.

### Docker
```bash
docker build -t captune .
docker run -p 5000:5000 -e ANTHROPIC_API_KEY="your_key" captune
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS (Glassmorphism, CSS Equalizer, Mobile Responsive)
- **Backend**: Node.js (ES Modules), Express, Multer, Express-Rate-Limit, CORS
- **AI Vision**: `@anthropic-ai/sdk` (`claude-sonnet-4-6` with fallback chain & demo synthesizer)
