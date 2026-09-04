const rawUrl = process.env.EXPO_PUBLIC_API_URL || '';

export const CONFIG = {
  API_BASE_URL: rawUrl.replace(/\/+$/, ''),
  // Give n8n's LLM pipeline enough breathing room
  TIMEOUT_MS: 60000, 
  ENABLE_OFFLINE_FALLBACK: true,
};