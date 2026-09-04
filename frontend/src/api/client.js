import { CONFIG } from '../constants/config';

export const apiClient = async (endpoint, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Network response error: ${res.status}`);
    return await res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};