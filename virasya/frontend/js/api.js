// ============================================
// VIRASYA - API Service Layer
// ============================================

const API_BASE = '/api';

const VirasyaAPI = {
  // Fetch all states
  async getStates() {
    try {
      const res = await fetch(`${API_BASE}/states`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Backend API offline, using local fallback:', err);
      return [];
    }
  },

  // Fetch individual state details
  async getStateById(id) {
    try {
      const res = await fetch(`${API_BASE}/states/${encodeURIComponent(id)}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Backend API error:', err);
      return null;
    }
  },

  // Fetch culture items
  async getCulture(category = 'all') {
    try {
      const res = await fetch(`${API_BASE}/culture?category=${encodeURIComponent(category)}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Backend API error:', err);
      return [];
    }
  },

  // Search across platform
  async search(query) {
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      return data.success ? data.results : null;
    } catch (err) {
      console.warn('Backend API error:', err);
      return null;
    }
  }
};
