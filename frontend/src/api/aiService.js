import { AI_API_URL, COLD_START_TIMEOUT_MS } from '../config';

// fetch with a timeout so a sleeping Render service gives a clear error instead of hanging
const fetchWithTimeout = async (url, options = {}, timeoutMs = COLD_START_TIMEOUT_MS) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('The AI engine took too long to respond (it may be waking up). Please try again.');
    }
    throw new Error('Could not reach the AI engine. Check your connection and try again.');
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

export const aiService = {
  // Returns true when the engine answers /health. Also wakes a sleeping Render service.
  async health(timeoutMs = COLD_START_TIMEOUT_MS) {
    try {
      const response = await fetchWithTimeout(`${AI_API_URL}/health`, {}, timeoutMs);
      return response.ok;
    } catch {
      return false;
    }
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
