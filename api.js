// ==================== API CLIENT ====================
const API_URL = 'https://levelup-academy-api.fly.dev';

const api = {
  token: localStorage.getItem('levelup_token'),
  user: JSON.parse(localStorage.getItem('levelup_user') || 'null'),

  isLoggedIn() {
    return !!this.token && !!this.user;
  },

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('levelup_token', token);
    localStorage.setItem('levelup_user', JSON.stringify(user));
  },

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('levelup_token');
    localStorage.removeItem('levelup_user');
  },

  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    try {
      const res = await fetch(`${API_URL}${path}`, { ...options, headers });
      if (res.status === 401) {
        this.clearAuth();
        return null;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      console.warn('API request failed:', err.message);
      return null;
    }
  },

  async signup(username, password, avatar, theme, parentName, parentEmail) {
    const data = await this.request('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, avatar, theme, parentName, parentEmail })
    });
    if (data && data.token) this.setAuth(data.token, data.user);
    return data;
  },

  async login(username, password) {
    const data = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data && data.token) this.setAuth(data.token, data.user);
    return data;
  },

  logout() {
    this.clearAuth();
  },

  async loadProgress() {
    return await this.request('/api/progress');
  },

  async saveProgress(progressData) {
    return await this.request('/api/progress', {
      method: 'PUT',
      body: JSON.stringify(progressData)
    });
  },

  async getAchievements() {
    return await this.request('/api/achievements');
  },

  async addAchievement(achievementId) {
    return await this.request('/api/achievements', {
      method: 'POST',
      body: JSON.stringify({ achievementId })
    });
  },

  async addDuel(duelData) {
    return await this.request('/api/duels', {
      method: 'POST',
      body: JSON.stringify(duelData)
    });
  },

  async getLeaderboard() {
    return await this.request('/api/leaderboard');
  },

  async getFriends() {
    return await this.request('/api/friends');
  },

  async addFriend(username) {
    return await this.request('/api/friends/add', {
      method: 'POST',
      body: JSON.stringify({ username })
    });
  },

  async updateProfile(data) {
    return await this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async parentLogin(email, code) {
    return await this.request('/api/parent/login', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  },

  async parentProgress(token) {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
      const res = await fetch(`${API_URL}/api/parent/progress`, { headers });
      return await res.json();
    } catch (err) {
      console.warn('Parent progress fetch failed:', err.message);
      return null;
    }
  },

  async resendParentCode(email) {
    return await this.request('/api/parent/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// Sync state to server periodically (debounced)
let syncTimeout = null;
function syncToServer() {
  if (!api.isLoggedIn()) return;
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(async () => {
    await api.saveProgress({
      xp: state.totalXP,
      level: getLevel(state.totalXP).level,
      streak: state.streak,
      lastActive: state.lastVisit,
      lessonsCompleted: state.completedLessons,
      quizzesPassed: state.quizzesPassed,
      projectsCompleted: state.completedProjects,
      savedCode: state.savedCode,
      lessonTabState: state.lessonTabState,
      hintsUsed: state.hintsUsed,
      weeklyActivity: state.dailyLog
    });
  }, 2000);
}
