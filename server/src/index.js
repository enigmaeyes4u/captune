import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { PORT, CLIENT_ORIGIN, ANTHROPIC_API_KEY, ANTHROPIC_MODEL } from './config/env.js';
import generateRouter from './routes/generate.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST_PATH = path.resolve(__dirname, '../../client/dist');

const app = express();

// Configure CORS
const envOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());
const defaultAllowed = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000',
  ...envOrigins
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, same-origin scripts, mobile)
      if (!origin) return callback(null, true);

      // Allow if matches wildcard or default allowed list or production
      if (
        envOrigins.includes('*') ||
        defaultAllowed.includes(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        process.env.NODE_ENV === 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Captune API',
    model: ANTHROPIC_MODEL,
    hasApiKey: Boolean(ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here'),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api', generateRouter);

// Serve Frontend in Production / Unified Deployment
if (fs.existsSync(CLIENT_DIST_PATH)) {
  console.log(`📦 Serving static client build from: ${CLIENT_DIST_PATH}`);
  app.use(express.static(CLIENT_DIST_PATH));

  // SPA catch-all
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
  });
}

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Captune Server running on http://localhost:${PORT}`);
  console.log(`📡 Allowed Client Origins: ${defaultAllowed.join(', ')}`);
  console.log(`🤖 Anthropic Model: ${ANTHROPIC_MODEL}`);
  console.log(`🔑 API Key Status: ${ANTHROPIC_API_KEY ? 'Configured' : 'Demo Mode Active'}`);
  console.log(`📦 Client Bundle: ${fs.existsSync(CLIENT_DIST_PATH) ? 'Ready to Serve' : 'Development Mode'}`);
  console.log(`===============================================`);
});

export default app;
