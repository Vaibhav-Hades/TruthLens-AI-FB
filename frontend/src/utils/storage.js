// localStorage utilities for TruthLens
export const storageKeys = {
  CHAT_HISTORY: 'truthlens_chat_history',
  VERIFICATION_HISTORY: 'truthlens_verification_history',
  USER_LANGUAGE: 'truthlens_user_language',
  USER_PREFERENCES: 'truthlens_user_preferences',
};

export const storage = {
  // Chat history
  getChatHistory: () => {
    try {
      const data = localStorage.getItem(storageKeys.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading chat history:', e);
      return [];
    }
  },

  saveChatHistory: (messages) => {
    try {
      localStorage.setItem(storageKeys.CHAT_HISTORY, JSON.stringify(messages));
      return true;
    } catch (e) {
      console.error('Error saving chat history:', e);
      return false;
    }
  },

  clearChatHistory: () => {
    try {
      localStorage.removeItem(storageKeys.CHAT_HISTORY);
      return true;
    } catch (e) {
      console.error('Error clearing chat history:', e);
      return false;
    }
  },

  // Verification history
  getVerificationHistory: () => {
    try {
      const data = localStorage.getItem(storageKeys.VERIFICATION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading verification history:', e);
      return [];
    }
  },

  addVerificationHistory: (item) => {
    try {
      const history = storage.getVerificationHistory();
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...item,
      };
      history.unshift(newItem);
      // Keep only last 100 items
      const trimmed = history.slice(0, 100);
      localStorage.setItem(storageKeys.VERIFICATION_HISTORY, JSON.stringify(trimmed));
      return newItem;
    } catch (e) {
      console.error('Error adding verification history:', e);
      return null;
    }
  },

  deleteVerificationHistoryItem: (id) => {
    try {
      const history = storage.getVerificationHistory();
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem(storageKeys.VERIFICATION_HISTORY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting verification history item:', e);
      return false;
    }
  },

  clearVerificationHistory: () => {
    try {
      localStorage.removeItem(storageKeys.VERIFICATION_HISTORY);
      return true;
    } catch (e) {
      console.error('Error clearing verification history:', e);
      return false;
    }
  },

  // User language preference
  getUserLanguage: () => {
    try {
      return localStorage.getItem(storageKeys.USER_LANGUAGE) || 'en-US';
    } catch (e) {
      return 'en-US';
    }
  },

  setUserLanguage: (lang) => {
    try {
      localStorage.setItem(storageKeys.USER_LANGUAGE, lang);
      return true;
    } catch (e) {
      console.error('Error setting user language:', e);
      return false;
    }
  },

  // Export as CSV
  exportHistoryAsCSV: (history) => {
    const headers = ['ID', 'Date', 'Content', 'Status', 'Confidence', 'Type'];
    const rows = history.map((item) => [
      item.id,
      new Date(item.timestamp).toLocaleString(),
      item.text || item.url || '',
      item.status || '',
      item.confidence || '',
      item.type || 'text',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    return csv;
  },

  downloadCSV: (csv, filename = 'truthlens_history.csv') => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
