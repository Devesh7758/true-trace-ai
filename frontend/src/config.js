// Single source of truth for the AI backend URL.
// Override with REACT_APP_AI_API_URL (frontend/.env.local locally, or Vercel → Settings → Environment Variables).

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

// Python FastAPI + ONNX (deepfake inference)
export const AI_API_URL = (
  process.env.REACT_APP_AI_API_URL ||
  (isLocal ? 'http://localhost:8000' : 'https://true-trace-ai-1.onrender.com')
).replace(/\/+$/, '');

// Render free tier sleeps after ~15 min idle; first request can take ~60s.
export const COLD_START_TIMEOUT_MS = 120000;
