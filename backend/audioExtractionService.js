/**
 * Audio Extraction Service - Frontend API Client
 * Location: src/services/audioExtractionService.js
 * 
 * This service handles all communication with the TruthLens Audio Extraction Backend
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

export class AudioExtractionService {
  /**
   * Extract and transcribe audio from a video URL
   * @param {string} videoUrl - The URL of the video (YouTube, Instagram, TikTok, etc.)
   * @returns {Promise<Object>} Transcript data with segments and timestamps
   */
  static async extractAudio(videoUrl) {
    if (!videoUrl || videoUrl.trim() === '') {
      throw new Error('Video URL is required');
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extract-audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Audio extraction error:', error);
      throw error;
    }
  }

  /**
   * Check if backend is available
   * @returns {Promise<boolean>}
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Format timestamp for display
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time (mm:ss)
   */
  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}

export default AudioExtractionService;
