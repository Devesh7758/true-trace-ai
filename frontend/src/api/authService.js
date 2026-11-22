import { AUTH_API_URL, AI_API_URL, COLD_START_TIMEOUT_MS } from '../config';

const TOKEN_KEY = 'trueTraceToken';
const USER_KEY = 'trueTraceUser';

// fetch with a timeout so a sleeping Render service gives a clear error instead of hanging
const fetchWithTimeout = async (url, options = {}, timeoutMs = COLD_START_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Server took too long to respond (it may be waking up). Please try again.');
    }
    throw new Error('Could not reach the server. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
};

const readJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const postJson = async (path, body) => {
  const response = await fetchWithTimeout(`${AUTH_API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await readJson(response);
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  return data;
};

// ---------- session ----------
export const session = {
  get() {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
      return token && user ? { token, user } : null;
    } catch {
      return null;
    }
  },
  save(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ---------- auth (Node backend) ----------
export const authService = {
  login: (email, password) => postJson('/api/auth/login', { email, password }),
  register: (name, email, password) => postJson('/api/auth/register', { name, email, password }),
};

// ---------- reports (Node backend, requires login) ----------
export const reportService = {
  async save(token, report) {
    const response = await fetchWithTimeout(`${AUTH_API_URL}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(report),
    });
    if (!response.ok) {
      const data = await readJson(response);
      throw new Error(data.message || data.error || `Report save failed (${response.status})`);
    }
    return readJson(response);
  },
  async history(token) {
    const response = await fetchWithTimeout(`${AUTH_API_URL}/api/reports/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await readJson(response);
    if (!response.ok) {
      const err = new Error(data.message || data.error || `History load failed (${response.status})`);
      err.status = response.status;
      throw err;
    }
    return Array.isArray(data) ? data : [];
  },
};

// ---------- AI inference (FastAPI backend) ----------
export const aiService = {
  // Fire-and-forget ping so Render starts waking the service before the user uploads
  wake() {
    fetch(`${AI_API_URL}/health`).catch(() => {});
  },
  async analyze(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetchWithTimeout(`${AI_API_URL}/analyze`, {
      method: 'POST',
      body: formData, // browser sets the multipart boundary header
    });
    const data = await readJson(response);
    if (!response.ok || data.error || data.detail) {
      const detail = typeof data.detail === 'string' ? data.detail : null;
      throw new Error(data.error || detail || `Analysis failed (${response.status})`);
    }
    return data;
  },
};
