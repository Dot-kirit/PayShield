import { CONFIG } from '../constants/config';
import { extractUrlFromText, sanitizeDomain } from '../utils/urlExtractor';

export const analyzeSharedLink = async (rawSharedText) => {
  if (!rawSharedText || !rawSharedText.trim()) {
    throw new Error('Please enter or share a valid message/link to analyze.');
  }

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || CONFIG.API_BASE_URL;
  if (!apiUrl) {
    throw new Error('Webhook URL not configured. Check your .env file.');
  }

  const extractedUrl = extractUrlFromText(rawSharedText) || rawSharedText;
  const targetDomain = sanitizeDomain(extractedUrl);

  const controller = new AbortController();
  // 30 seconds for external WHOIS + LLM chains
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS || 30000);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        type: 'url',
        content: rawSharedText,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    let data = await response.json();
    if (Array.isArray(data)) {
      data = data[0] || {};
    }

    const parsedScore = parseInt(data.score, 10);
    const score = isNaN(parsedScore) ? 0 : parsedScore;
    const incomingVerdict = String(data.verdict || '').trim().toUpperCase();

    let finalVerdict = 'SAFE';
    if (incomingVerdict === 'SCAM' || score >= 70) {
      finalVerdict = 'SCAM';
    } else if (incomingVerdict === 'SUSPICIOUS' || (score >= 40 && score < 70)) {
      finalVerdict = 'SUSPICIOUS';
    }

    return {
      verdict: finalVerdict,
      score: score,
      targetDomain: data.domain || targetDomain || 'Unknown Domain',
      reasons: Array.isArray(data.reasons) ? data.reasons : [],
      recommendation: data.llmNotes || (finalVerdict === 'SCAM'
        ? 'High probability of fraud. Intercepted before payment authorization.'
        : finalVerdict === 'SUSPICIOUS'
        ? 'Caution advised. Verify payment details through an official channel.'
        : 'Destination link is verified safe for checkout.'),
      urgency: Boolean(data.urgency),
      impersonation: Boolean(data.impersonation),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Analysis timed out. The security checks took longer than 30s.');
    }
    throw err;
  }
};

export default analyzeSharedLink;