// Single source of truth for backend URLs.
// Override per environment with REACT_APP_AUTH_API_URL / REACT_APP_AI_API_URL
// (frontend/.env.local for local dev, Vercel → Settings → Environment Variables for prod).

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const stripSlash = (url) => url.replace(/\/+$/, '');

// Node + Express + MongoDB (auth + report history)
export const AUTH_API_URL = stripSlash(
  process.env.REACT_APP_AUTH_API_URL ||
    (isLocal ? 'http://localhost:5000' : 'https://true-trace-ai.onrender.com')
);

// Python FastAPI + ONNX (deepfake inference)
export const AI_API_URL = stripSlash(
  process.env.REACT_APP_AI_API_URL ||
    (isLocal ? 'http://localhost:8000' : 'https://true-trace-ai-1.onrender.com')
);

// Render free tier sleeps after ~15 min idle; first request can take ~60s.
export const COLD_START_TIMEOUT_MS = 120000;
