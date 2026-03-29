// API utilities for TruthLens advanced features
import { useGlobalToast } from '../context/ToastContext';

const API_BASE_URL = 'http://127.0.0.1:8000';

export {useGlobalToast};

// Audio/Video Extraction
export const extractAudio = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error extracting audio:', error);
    throw error;
  }
};

// Sentiment Analysis
export const analyzeSentiment = async (text, language = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-sentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

// Fact Extraction
export const extractFacts = async (text, language = 'en') => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract-facts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error extracting facts:', error);
    throw error;
  }
};

// Log Verification (for trends)
export const logVerification = async (claim, verdict, source = 'text') => {
  try {
    const response = await fetch(`${API_BASE_URL}/log-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claim, verdict, source })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error logging verification:', error);
  }
};

// Get Trends
export const getTrends = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get-trends`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching trends:', error);
    throw error;
  }
};

// Combined Analysis
export const analyzeAll = async (text, language = 'en', includeSentiment = true, includeFacts = true) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        language,
        include_sentiment: includeSentiment,
        include_facts: includeFacts
      })
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error in combined analysis:', error);
    throw error;
  }
};

// Health Check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    return null;
  }
};
