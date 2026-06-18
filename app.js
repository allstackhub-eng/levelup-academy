// ==================== STATE ====================
let state = {
  name: '',
  avatar: '🧑‍💻',
  theme: 'cosmic',
  totalXP: 0,
  streak: 0,
  lessonsCompleted: 0,
  projectsCompleted: 0,
  completedLessons: [],
  completedProjects: [],
  weekComplete: {},
  todayLessons: 0,
  todayChallenges: 0,
  todayPlayground: false,
  todayProject: false,
  lastVisit: null,
  dailyLog: {},
  onboarded: false,
  quizzesPassed: [],
  challengesPassed: [],
  assignmentsDone: [],
  duelsWon: 0,
  duelsLost: 0,
  duelHistory: [],
  parentPin: '1234',
  dailyTimeLimit: 0,
  tournamentScore: 0,
  tournamentRound: 0,
  playgroundRuns: 0,
  savedCode: {},       // persists code per lesson/project
  lessonTabState: {},  // remembers which tab user was on per lesson
  hintsUsed: {},       // tracks which hints have been revealed
};

function saveState() {
  localStorage.setItem('codewizard_state', JSON.stringify(state));
  if (typeof syncToServer === 'function') syncToServer();
}

function loadState() {
  const saved = localStorage.getItem('codewizard_state');
  if (saved) { state = { ...state, ...JSON.parse(saved) }; checkStreak(); }
}

function checkStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (state.lastVisit === today) return;
  if (state.lastVisit === yesterday) state.streak++;
  else if (state.lastVisit !== today) state.streak = 1;
  state.lastVisit = today;
  state.todayLessons = 0;
  state.todayChallenges = 0;
  state.todayPlayground = false;
  state.todayProject = false;
  saveState();
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
  loadState();
  applyTheme(state.theme || 'cosmic');
  initParticles();

  if (api.isLoggedIn() && state.onboarded) {
    const serverProgress = await api.loadProgress();
    if (serverProgress) {
      if (serverProgress.xp > state.totalXP) {
        state.totalXP = serverProgress.xp;
        state.streak = serverProgress.streak;
        state.completedLessons = serverProgress.lessonsCompleted || [];
        state.quizzesPassed = serverProgress.quizzesPassed || [];
        state.completedProjects = serverProgress.projectsCompleted || [];
        state.lessonsCompleted = state.completedLessons.length;
        state.projectsCompleted = state.completedProjects.length;
        saveState();
      }
    }
    document.getElementById('logoutBtn').style.display = '';
    initApp();
  } else if (state.onboarded && !api.isLoggedIn()) {
    initApp();
  } else {
    showOnboarding();
  }
});

function showOnboarding() {
  document.getElementById('onboarding-modal').classList.remove('hidden');
  const picker = document.getElementById('avatarPicker');
  picker.innerHTML = AVATARS.map(a =>
    `<div class="avatar-option${a === state.avatar ? ' selected' : ''}" onclick="selectAvatar(this, '${a}')">${a}</div>`
  ).join('');
  const tp = document.getElementById('onboardingThemes');
  if (tp) {
    tp.innerHTML = THEMES.map(t =>
      `<div class="theme-option${t.id === 'cosmic' ? ' active' : ''}" onclick="selectOnboardingTheme(this, '${t.id}')" style="border-color:${t.color}">
        <span class="theme-option-icon">${t.icon}</span>${t.name}
      </div>`
    ).join('');
  }
}

function showAuthTab(tab, el) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('auth-signup').classList.toggle('hidden', tab !== 'signup');
  document.getElementById('auth-login').classList.toggle('hidden', tab !== 'login');
}

function selectAvatar(el, a) {
  state.avatar = a;
  document.querySelectorAll('.avatar-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  playSound('pop');
}

function selectOnboardingTheme(el, themeId) {
  document.querySelectorAll('.theme-picker-inline .theme-option').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  applyTheme(themeId);
  state.theme = themeId;
  playSound('whoosh');
}

async function completeOnboarding() {
  const name = document.getElementById('nameInput').value.trim();
  const password = document.getElementById('passwordInput').value;
  const errorEl = document.getElementById('signupError');

  if (!name) {
    errorEl.textContent = 'Please enter a coder name!';
    errorEl.classList.remove('hidden');
    return;
  }
  if (!password || password.length < 4) {
    errorEl.textContent = 'Password must be at least 4 characters!';
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  const result = await api.signup(name, password, state.avatar, state.theme);

  if (!result) {
    errorEl.textContent = 'Could not connect to server. Try again!';
    errorEl.classList.remove('hidden');
    return;
  }
  if (result.error) {
    errorEl.textContent = result.error;
    errorEl.classList.remove('hidden');
    return;
  }

  state.name = name;
  state.onboarded = true;
  state.lastVisit = new Date().toDateString();
  state.streak = 1;
  saveState();
  document.getElementById('onboarding-modal').classList.add('hidden');
  document.getElementById('logoutBtn').style.display = '';
  initApp();
  showToast('Welcome, ' + name + '!', 'Your coding adventure begins now! 🚀');
  launchConfetti();
}

async function handleLogin() {
  const name = document.getElementById('loginNameInput').value.trim();
  const password = document.getElementById('loginPasswordInput').value;
  const errorEl = document.getElementById('loginError');

  if (!name || !password) {
    errorEl.textContent = 'Enter your coder name and password!';
    errorEl.classList.remove('hidden');
    return;
  }

  errorEl.classList.add('hidden');
  const result = await api.login(name, password);

  if (!result) {
    errorEl.textContent = 'Could not connect to server. Try again!';
    errorEl.classList.remove('hidden');
    return;
  }
  if (result.error) {
    errorEl.textContent = result.error;
    errorEl.classList.remove('hidden');
    return;
  }

  state.name = result.user.username;
  state.avatar = result.user.avatar;
  state.theme = result.user.theme;
  state.onboarded = true;
  applyTheme(state.theme);

  const serverProgress = await api.loadProgress();
  if (serverProgress) {
    state.totalXP = serverProgress.xp || 0;
    state.streak = serverProgress.streak || 0;
    state.completedLessons = serverProgress.lessonsCompleted || [];
    state.quizzesPassed = serverProgress.quizzesPassed || [];
    state.completedProjects = serverProgress.projectsCompleted || [];
    state.savedCode = serverProgress.savedCode || {};
    state.lessonTabState = serverProgress.lessonTabState || {};
    state.hintsUsed = serverProgress.hintsUsed || {};
    state.lessonsCompleted = state.completedLessons.length;
    state.projectsCompleted = state.completedProjects.length;
  }

  saveState();
  document.getElementById('onboarding-modal').classList.add('hidden');
  document.getElementById('logoutBtn').style.display = '';
  initApp();
  showToast('Welcome back, ' + state.name + '!', 'Let\'s keep coding! 🎉');
}

function handleLogout() {
  api.logout();
  state = {
    name: '', avatar: '🧑‍💻', theme: 'cosmic', totalXP: 0, streak: 0,
    lessonsCompleted: 0, projectsCompleted: 0, completedLessons: [], completedProjects: [],
    weekComplete: {}, todayLessons: 0, todayChallenges: 0, todayPlayground: false,
    todayProject: false, lastVisit: null, dailyLog: {}, onboarded: false,
    quizzesPassed: [], challengesPassed: [], assignmentsDone: [],
    duelsWon: 0, duelsLost: 0, duelHistory: [], parentPin: '1234',
    dailyTimeLimit: 0, tournamentScore: 0, tournamentRound: 0, playgroundRuns: 0, savedCode: {}, lessonTabState: {}, hintsUsed: {}
  };
  localStorage.removeItem('codewizard_state');
  document.getElementById('logoutBtn').style.display = 'none';
  applyTheme('cosmic');
  showOnboarding();
}

function initApp() {
  updatePlayerInfo();
  renderDashboard();
  renderWeekTabs();
  renderLessons(1);
  renderPlayground();
  renderProjects();
  renderLeaderboard();
  renderAchievements();
  renderThemeGrid();
}

// ==================== THEMES ====================
function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  state.theme = themeId;
  saveState();
  // Update particle colors
  if (window.particleColor) {
    const style = getComputedStyle(document.documentElement);
    window.particleColor = style.getPropertyValue('--particle-color').trim();
  }
}

function renderThemeGrid() {
  const grid = document.getElementById('themeGrid');
  if (!grid) return;
  grid.innerHTML = THEMES.map(t =>
    `<div class="theme-option${t.id === state.theme ? ' active' : ''}" onclick="changeTheme('${t.id}', this)" style="border-color:${t.color}">
      <span class="theme-option-icon">${t.icon}</span>${t.name}
    </div>`
  ).join('');
}

function changeTheme(themeId, el) {
  applyTheme(themeId);
  playSound('whoosh');
  document.querySelectorAll('#themeGrid .theme-option').forEach(e => e.classList.remove('active'));
  if (el) el.classList.add('active');
}

function toggleThemePicker() {
  const picker = document.getElementById('themePicker');
  picker.classList.toggle('hidden');
  renderThemeGrid();
}

// ==================== NAVIGATION ====================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  // Close theme picker
  document.getElementById('themePicker').classList.add('hidden');
  // Render page-specific content
  if (page === 'multiplayer') { renderBattleStats(); renderRecentDuels(); }
}

// ==================== PLAYER INFO ====================
function updatePlayerInfo() {
  document.getElementById('playerName').textContent = state.name || 'Young Coder';
  document.getElementById('playerAvatar').textContent = state.avatar;
  const level = getLevel();
  document.getElementById('playerLevel').textContent = `Level ${level.index + 1} - ${level.name}`;
}

function getLevel() {
  let lvl = LEVELS[0], idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (state.totalXP >= LEVELS[i].minXP) { lvl = LEVELS[i]; idx = i; }
  }
  return { ...lvl, index: idx };
}

// ==================== DASHBOARD ====================
function renderDashboard() {
  document.getElementById('dashName').textContent = state.name || 'Young Coder';
  document.getElementById('totalXP').textContent = state.totalXP;
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('lessonsCompleted').textContent = state.lessonsCompleted;
  document.getElementById('projectsCompleted').textContent = state.projectsCompleted;

  const level = getLevel();
  const nextLevel = LEVELS[level.index + 1];
  document.getElementById('currentLevelLabel').textContent = level.name;
  if (nextLevel) {
    document.getElementById('nextLevelLabel').textContent = nextLevel.name;
    const progress = ((state.totalXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100;
    document.getElementById('levelFill').style.width = Math.min(progress, 100) + '%';
    document.getElementById('levelHint').textContent = `${nextLevel.minXP - state.totalXP} XP to reach ${nextLevel.name}!`;
  } else {
    document.getElementById('nextLevelLabel').textContent = '🏆 MAX';
    document.getElementById('levelFill').style.width = '100%';
    document.getElementById('levelHint').textContent = 'You reached the highest level! 🎉';
  }

  renderWeekActivity();
  renderDailyQuest();
  renderRecommended();
}

function renderWeekActivity() {
  const grid = document.getElementById('weekGrid');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = d.toDateString();
    const isToday = dateStr === today.toDateString();
    const completed = state.dailyLog[dateStr];
    html += `<div class="week-day${isToday ? ' today' : ''}${completed ? ' completed' : ''}">
      <div class="week-day-label">${days[i]}</div>
      <div class="week-day-status">${completed ? '✅' : isToday ? '📍' : '⬜'}</div>
    </div>`;
  }
  grid.innerHTML = html;
}

function renderDailyQuest() {
  const container = document.getElementById('dailyQuest');
  // Rotate quests daily using day-of-year as seed
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const todayQuests = getTodayQuests(dayOfYear);
  container.innerHTML = todayQuests.map((q, i) => {
    const done = q.check(state);
    return `<div class="quest-item">
      <div class="quest-check${done ? ' done' : ''}">${done ? '✓' : ''}</div>
      <span class="quest-text">${q.text}</span>
      <span class="quest-xp">+${q.xp} XP</span>
    </div>`;
  }).join('');
}

function getTodayQuests(seed) {
  // Pick 4 quests from the pool, rotating daily
  const pool = DAILY_QUESTS;
  if (pool.length <= 4) return pool;
  const picked = [];
  const indices = [];
  for (let i = 0; i < 4; i++) {
    let idx = (seed * 7 + i * 13 + seed % 3) % pool.length;
    while (indices.includes(idx)) idx = (idx + 1) % pool.length;
    indices.push(idx);
    picked.push(pool[idx]);
  }
  return picked;
}

function renderRecommended() {
  const container = document.getElementById('recommendedLesson');
  let next = null;
  for (const week of WEEKS) {
    for (const lesson of week.lessons) {
      if (!state.completedLessons.includes(lesson.id)) { next = { lesson, week }; break; }
    }
    if (next) break;
  }
  if (next) {
    container.innerHTML = `<div class="recommended-card" onclick="playSound('click'); showPage('lessons'); selectWeek(${next.week.id}); openLesson('${next.lesson.id}')">
      <div style="font-size:2.2rem" class="float">📖</div>
      <div>
        <div style="font-weight:700">${next.lesson.title}</div>
        <div style="font-size:0.82rem;color:var(--text-dim)">${next.week.title} - ${next.lesson.description}</div>
        <div style="font-size:0.8rem;color:var(--accent-yellow);margin-top:4px;font-weight:700">⚡ +${next.lesson.xp} XP</div>
      </div>
    </div>`;
  } else {
    container.innerHTML = '<p style="color:var(--text-dim)">🎉 All lessons completed! Try the Code Playground!</p>';
  }
}

// ==================== LESSONS ====================
let currentWeek = 1;

function renderWeekTabs() {
  const tabs = document.getElementById('weekTabs');
  tabs.innerHTML = WEEKS.map(w => {
    const unlocked = isWeekUnlocked(w.id);
    return `<button class="week-tab${w.id === currentWeek ? ' active' : ''}${!unlocked ? ' locked' : ''}"
      onclick="${unlocked ? `playSound('click'); selectWeek(${w.id})` : ''}"
      ${!unlocked ? 'title="Complete previous week to unlock"' : ''}>
      ${w.title}${!unlocked ? ' 🔒' : ''}
    </button>`;
  }).join('');
}

function isWeekUnlocked(weekId) {
  if (weekId === 1) return true;
  const prevWeek = WEEKS.find(w => w.id === weekId - 1);
  if (!prevWeek) return true;
  return prevWeek.lessons.filter(l => state.completedLessons.includes(l.id)).length >= 3;
}

function selectWeek(weekId) {
  if (!isWeekUnlocked(weekId)) return;
  currentWeek = weekId;
  renderWeekTabs();
  renderLessons(weekId);
}

function renderLessons(weekId) {
  const week = WEEKS.find(w => w.id === weekId);
  if (!week) return;
  const list = document.getElementById('lessonsList');
  list.innerHTML = week.lessons.map((lesson, i) => {
    const completed = state.completedLessons.includes(lesson.id);
    const locked = i > 0 && !state.completedLessons.includes(week.lessons[i - 1].id) && !completed;
    return `<div class="lesson-card${completed ? ' completed' : ''}${locked ? ' locked' : ''} pop-in" style="--delay:${i * 0.08}s"
      onclick="${!locked ? `playSound('click'); openLesson('${lesson.id}')` : ''}">
      <div class="lesson-number">${completed ? '✓' : i + 1}</div>
      <div class="lesson-info">
        <div class="lesson-title">${lesson.title}</div>
        <div class="lesson-desc">${lesson.description}</div>
        <div class="lesson-meta">
          ${lesson.tags.map(t => `<span class="lesson-tag">${t}</span>`).join('')}
          <span class="lesson-xp-badge">⚡ ${lesson.xp} XP</span>
        </div>
      </div>
      <div class="lesson-status">${completed ? '✅' : locked ? '🔒' : '▶️'}</div>
    </div>`;
  }).join('');
}

// ==================== LESSON DETAIL ====================
let currentLessonTab = 'learn';

function openLesson(lessonId) {
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (!lesson) return;
  playSound('whoosh');
  // Restore saved tab state or default to learn
  currentLessonTab = (state.lessonTabState && state.lessonTabState[lessonId]) || 'learn';
  renderLessonDetail(lesson);
  document.getElementById('lesson-overlay').classList.remove('hidden');
}

function renderLessonDetail(lesson) {
  const detail = document.getElementById('lessonDetail');
  const completed = state.completedLessons.includes(lesson.id);
  const quizPassed = state.quizzesPassed && state.quizzesPassed.includes(lesson.id);
  const challengePassed = state.challengesPassed && state.challengesPassed.includes(lesson.id);
  const hasAssignments = lesson.assignments && lesson.assignments.length > 0;
  const hasQuiz = lesson.quiz && lesson.quiz.length > 0;
  const hasResources = lesson.resources && lesson.resources.length > 0;

  detail.innerHTML = `
    <h2>${lesson.title}</h2>
    <div class="lesson-meta" style="margin-bottom:16px">
      ${lesson.tags.map(t => `<span class="lesson-tag">${t}</span>`).join('')}
      <span class="lesson-xp-badge">⚡ ${lesson.xp} XP</span>
      ${completed ? '<span style="color:var(--success);font-size:0.85rem;font-weight:700">✅ Completed</span>' : ''}
    </div>

    <div class="lesson-tabs">
      <button class="lesson-tab ${currentLessonTab === 'learn' ? 'active' : ''}" onclick="switchLessonTab('learn', '${lesson.id}')">📖 Learn</button>
      <button class="lesson-tab ${currentLessonTab === 'practice' ? 'active' : ''}" onclick="switchLessonTab('practice', '${lesson.id}')">💻 Practice ${challengePassed ? '✅' : ''}</button>
      ${hasQuiz ? `<button class="lesson-tab ${currentLessonTab === 'quiz' ? 'active' : ''}${!challengePassed && !quizPassed ? ' tab-locked' : ''}" onclick="${challengePassed || quizPassed ? `switchLessonTab('quiz', '${lesson.id}')` : `playSound('error'); showToast('🔒 Locked', 'Pass the Main Challenge first!')`}">📝 Quiz ${quizPassed ? '✅' : !challengePassed ? '🔒' : ''}</button>` : ''}
      ${hasResources ? `<button class="lesson-tab ${currentLessonTab === 'resources' ? 'active' : ''}" onclick="switchLessonTab('resources', '${lesson.id}')">📚 Deep Dive</button>` : ''}
    </div>

    <div id="lessonTabContent"></div>
  `;
  renderLessonTabContent(lesson);
}

function switchLessonTab(tab, lessonId) {
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (!lesson) return;
  currentLessonTab = tab;
  // Save tab state per lesson
  if (!state.lessonTabState) state.lessonTabState = {};
  state.lessonTabState[lessonId] = tab;
  saveState();
  playSound('click');
  // Update tab active state
  document.querySelectorAll('.lesson-tab').forEach(t => t.classList.remove('active'));
  const tabMap = { learn: 0, practice: 1, quiz: 2, resources: 3 };
  const tabs = document.querySelectorAll('.lesson-tab');
  if (tabs[tabMap[tab]]) tabs[tabMap[tab]].classList.add('active');
  renderLessonTabContent(lesson);
}

function renderLessonTabContent(lesson) {
  const container = document.getElementById('lessonTabContent');
  if (!container) return;
  const completed = state.completedLessons.includes(lesson.id);
  const quizPassed = state.quizzesPassed && state.quizzesPassed.includes(lesson.id);
  const challengePassed = state.challengesPassed && state.challengesPassed.includes(lesson.id);

  switch (currentLessonTab) {
    case 'learn':
      container.innerHTML = `
        <div class="lesson-content">${lesson.content}</div>
        <div style="margin-top:20px;text-align:center">
          <button class="btn btn-primary btn-lg" onclick="switchLessonTab('practice', '${lesson.id}')" style="min-width:200px">
            💻 Go to Practice →
          </button>
        </div>`;
      break;

    case 'practice':
      const savedChallenge = (state.savedCode && state.savedCode[lesson.id + '_challenge']) || '';
      const hintKeyChallenge = lesson.id + '_challenge';
      const challengeHintRevealed = state.hintsUsed && state.hintsUsed[hintKeyChallenge];

      const assignmentsHTML = (lesson.assignments || []).map((a, i) => {
        const assignDone = state.assignmentsDone && state.assignmentsDone.includes(lesson.id + '_a' + i);
        const savedAssign = (state.savedCode && state.savedCode[lesson.id + '_a' + i]) || '';
        const hintKey = lesson.id + '_a' + i;
        const hintRevealed = state.hintsUsed && state.hintsUsed[hintKey];
        return `
        <div class="assignment-card ${assignDone ? 'done' : ''}">
          <div class="assignment-header">
            <span class="assignment-num">${assignDone ? '✅' : '📝'} Assignment ${i + 1}</span>
            <span class="assignment-diff ${a.difficulty || 'medium'}">${(a.difficulty || 'medium').toUpperCase()}</span>
            ${a.xp ? `<span class="lesson-xp-badge">⚡ +${a.xp} XP</span>` : ''}
          </div>
          <div class="assignment-prompt">${a.prompt}</div>
          ${a.hint ? (hintRevealed ? `<p class="assignment-hint">💡 ${a.hint}</p>` :
            `<button class="btn btn-hint" onclick="revealHint('${hintKey}', this, '${a.hint.replace(/'/g, "\\'")}')">💡 Need a hint?</button>`) : ''}
          <textarea class="code-input" id="assignCode${i}" placeholder="# Write your solution here..." spellcheck="false">${assignDone ? (savedAssign || '# Already completed ✅') : (savedAssign || '')}</textarea>
          <div class="challenge-actions">
            <button class="btn btn-run" onclick="playSound('click'); runAssignmentCode('${lesson.id}', ${i})">▶️ Run</button>
            <button class="btn btn-primary" onclick="playSound('click'); checkAssignment('${lesson.id}', ${i})">✅ Submit</button>
            <button class="btn btn-secondary" onclick="document.getElementById('assignCode${i}').value=''">🗑️ Clear</button>
          </div>
          <div class="output-area" id="assignOutput${i}"></div>
        </div>`;
      }).join('');

      container.innerHTML = `
        ${lesson.challenge ? `
          <div class="challenge-area main-challenge">
            <h4>🎯 Main Challenge ${challengePassed ? '<span style="color:var(--success)">✅ Passed</span>' : '<span style="color:var(--danger)">(Required)</span>'}</h4>
            <div class="challenge-prompt">${lesson.challenge.prompt}</div>
            ${lesson.challenge.hint ? (challengeHintRevealed ? `<p style="font-size:0.8rem;color:var(--text-dim)">💡 ${lesson.challenge.hint}</p>` :
              `<button class="btn btn-hint" onclick="revealHint('${hintKeyChallenge}', this, '${lesson.challenge.hint.replace(/'/g, "\\'")}')">💡 Need a hint?</button>`) : ''}
            <textarea class="code-input" id="challengeCode" placeholder="# Write your Python code here..." spellcheck="false">${savedChallenge}</textarea>
            <div class="challenge-actions">
              <button class="btn btn-run" onclick="playSound('click'); runChallengeCode('${lesson.id}')">▶️ Run</button>
              <button class="btn btn-primary" onclick="playSound('click'); checkChallenge('${lesson.id}')">✅ Submit</button>
              <button class="btn btn-secondary" onclick="document.getElementById('challengeCode').value=''; saveCodeState('${lesson.id}_challenge', '')">🗑️ Clear</button>
            </div>
            <div class="output-area" id="challengeOutput"></div>
          </div>
        ` : ''}
        ${assignmentsHTML ? `
          <div class="assignments-section">
            <h4 style="margin-bottom:12px">📋 Extra Assignments</h4>
            <p style="font-size:0.85rem;color:var(--text-dim);margin-bottom:16px">Practice makes perfect! Complete these for bonus XP.</p>
            ${assignmentsHTML}
          </div>
        ` : ''}
        ${challengePassed && lesson.quiz && lesson.quiz.length > 0 ? `
          <div style="margin-top:20px;text-align:center">
            <button class="btn btn-primary btn-lg" onclick="switchLessonTab('quiz', '${lesson.id}')" style="min-width:200px">
              📝 Take the Quiz →
            </button>
          </div>
        ` : !challengePassed ? `
          <div class="quiz-gate-msg">
            <span>🔒</span> Pass the Main Challenge above to unlock the Quiz
          </div>
        ` : ''}`;
      // Auto-indent on colon & auto-save code
      setTimeout(() => setupCodeEditors(lesson), 50);
      break;

    case 'quiz':
      if (!lesson.quiz || lesson.quiz.length === 0) { container.innerHTML = '<p>No quiz for this lesson.</p>'; break; }
      if (!(state.challengesPassed && state.challengesPassed.includes(lesson.id))) {
        container.innerHTML = `<div class="quiz-gate-msg"><span>🔒</span> Complete the Main Challenge in Practice tab first to unlock the quiz.</div>`;
        break;
      }
      if (quizPassed) {
        container.innerHTML = `
          <div class="quiz-passed-banner">🎉 Quiz Passed! You've mastered this lesson.</div>
          ${renderQuizReview(lesson)}
          ${!completed ? `<button class="btn btn-success btn-lg" style="margin-top:20px;width:100%" onclick="completeLesson('${lesson.id}', ${lesson.xp})">
            ✅ Complete Lesson (+${lesson.xp} XP)
          </button>` : ''}`;
        break;
      }
      container.innerHTML = `
        <div class="quiz-container">
          <div class="quiz-header">
            <h4>📝 Lesson Quiz</h4>
            <p style="color:var(--text-dim);font-size:0.85rem">You need to score at least ${Math.ceil(lesson.quiz.length * 0.7)}/${lesson.quiz.length} to pass. Choose carefully!</p>
          </div>
          <form id="quizForm">
            ${lesson.quiz.map((q, i) => `
              <div class="quiz-question">
                <div class="quiz-q-num">Question ${i + 1} of ${lesson.quiz.length}</div>
                <div class="quiz-q-text">${q.question}</div>
                <div class="quiz-options">
                  ${q.options.map((opt, j) => `
                    <label class="quiz-option">
                      <input type="radio" name="q${i}" value="${j}">
                      <span class="quiz-option-text">${opt}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </form>
          <button class="btn btn-primary btn-lg" style="width:100%;margin-top:16px" onclick="playSound('click'); submitQuiz('${lesson.id}')">
            📝 Submit Quiz
          </button>
          <div id="quizResult"></div>
        </div>`;
      break;

    case 'resources':
      if (!lesson.resources || lesson.resources.length === 0) { container.innerHTML = '<p>No resources yet.</p>'; break; }
      container.innerHTML = `
        <div class="resources-section">
          <h4 style="margin-bottom:8px">📚 Deep Dive Resources</h4>
          <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:16px">Explore these links to master this topic beyond the lesson.</p>
          ${lesson.resources.map(r => `
            <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="resource-card">
              <div class="resource-icon">${r.icon || '🔗'}</div>
              <div class="resource-info">
                <div class="resource-title">${r.title}</div>
                <div class="resource-desc">${r.description}</div>
                <div class="resource-url">${r.url}</div>
              </div>
              <div class="resource-arrow">↗</div>
            </a>
          `).join('')}
        </div>`;
      break;
  }
}

function renderQuizReview(lesson) {
  return `<div class="quiz-review">
    <h4 style="margin-bottom:12px">📋 Answer Key</h4>
    ${lesson.quiz.map((q, i) => `
      <div class="quiz-review-q">
        <strong>Q${i+1}:</strong> ${q.question}<br>
        <span style="color:var(--success)">✅ ${q.options[q.correct]}</span>
        ${q.explanation ? `<br><span style="color:var(--text-dim);font-size:0.85rem">💡 ${q.explanation}</span>` : ''}
      </div>
    `).join('')}
  </div>`;
}

function closeLessonOverlay() {
  document.getElementById('lesson-overlay').classList.add('hidden');
}

// ---- Hint reveal (only on request) ----
function revealHint(hintKey, btn, hintText) {
  if (!state.hintsUsed) state.hintsUsed = {};
  state.hintsUsed[hintKey] = true;
  saveState();
  btn.outerHTML = `<p class="assignment-hint">💡 ${hintText}</p>`;
  playSound('pop');
}

// ---- Auto-save code state ----
function saveCodeState(key, code) {
  if (!state.savedCode) state.savedCode = {};
  state.savedCode[key] = code;
  saveState();
}

// ---- Setup code editors: auto-indent on colon, Tab key, auto-save ----
function setupCodeEditors(lesson) {
  document.querySelectorAll('.code-input').forEach(textarea => {
    // Auto-indent when typing colon at end of line (if/for/while/def/else/elif)
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }
      if (e.key === 'Enter') {
        const pos = textarea.selectionStart;
        const before = textarea.value.substring(0, pos);
        const after = textarea.value.substring(pos);
        const currentLine = before.split('\n').pop();
        const indent = currentLine.match(/^\s*/)[0];
        const trimmed = currentLine.trimEnd();
        if (trimmed.endsWith(':')) {
          e.preventDefault();
          const newIndent = indent + '    ';
          textarea.value = before + '\n' + newIndent + after;
          textarea.selectionStart = textarea.selectionEnd = pos + 1 + newIndent.length;
        }
      }
    });
    // Auto-save on input
    textarea.addEventListener('input', () => {
      const id = textarea.id;
      if (id === 'challengeCode') saveCodeState(lesson.id + '_challenge', textarea.value);
      else if (id.startsWith('assignCode')) {
        const idx = id.replace('assignCode', '');
        saveCodeState(lesson.id + '_a' + idx, textarea.value);
      }
    });
  });
}

function runChallengeCode(lessonId) {
  const code = document.getElementById('challengeCode').value;
  const output = document.getElementById('challengeOutput');
  saveCodeState(lessonId + '_challenge', code);
  if (!code.trim()) { output.innerHTML = '<span class="output-error">Write some code first!</span>'; playSound('error'); return; }
  try {
    const result = simulatePython(code);
    output.innerHTML = `<span class="output-success">${escapeHtml(result)}</span>`;
    playSound('pop');
  } catch (err) {
    output.innerHTML = `<span class="output-error">Error: ${escapeHtml(err.message)}</span>`;
    playSound('error');
  }
}

function runAssignmentCode(lessonId, assignIndex) {
  const code = document.getElementById('assignCode' + assignIndex)?.value || '';
  const output = document.getElementById('assignOutput' + assignIndex);
  saveCodeState(lessonId + '_a' + assignIndex, code);
  if (!code.trim()) { output.innerHTML = '<span class="output-error">Write some code first!</span>'; playSound('error'); return; }
  try {
    const result = simulatePython(code);
    output.innerHTML = `<span class="output-success">${escapeHtml(result)}</span>`;
    playSound('pop');
  } catch (err) {
    output.innerHTML = `<span class="output-error">Error: ${escapeHtml(err.message)}</span>`;
    playSound('error');
  }
}

function checkChallenge(lessonId) {
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (!lesson || !lesson.challenge) return;

  const code = document.getElementById('challengeCode').value;
  const output = document.getElementById('challengeOutput');

  // Save code regardless
  saveCodeState(lessonId + '_challenge', code);

  if (!code.trim()) {
    output.innerHTML = '<span class="output-error">Write some code first!</span>';
    playSound('error');
    return;
  }

  const result = lesson.challenge.validator(code);
  if (result.success) {
    output.innerHTML = `<span class="output-success">${result.message}</span>`;
    if (!state.challengesPassed) state.challengesPassed = [];
    if (!state.challengesPassed.includes(lessonId)) {
      state.challengesPassed.push(lessonId);
    }
    state.todayChallenges++;
    saveState();
    playSound('success');
    // Re-render to show unlocked quiz tab
    setTimeout(() => renderLessonDetail(lesson), 800);
  } else {
    output.innerHTML = `<span class="output-error">❌ ${result.message}<br><small>Fix your code and try again!</small></span>`;
    playSound('error');
  }
}

function checkAssignment(lessonId, assignIndex) {
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (!lesson || !lesson.assignments || !lesson.assignments[assignIndex]) return;

  const code = document.getElementById('assignCode' + assignIndex)?.value || '';
  const output = document.getElementById('assignOutput' + assignIndex);

  // Save code regardless
  saveCodeState(lessonId + '_a' + assignIndex, code);

  if (!code.trim()) {
    output.innerHTML = '<span class="output-error">Write some code first!</span>';
    playSound('error');
    return;
  }

  const assignment = lesson.assignments[assignIndex];
  const result = assignment.validator(code);
  if (result.success) {
    output.innerHTML = `<span class="output-success">${result.message}</span>`;
    if (!state.assignmentsDone) state.assignmentsDone = [];
    const key = lessonId + '_a' + assignIndex;
    if (!state.assignmentsDone.includes(key)) {
      state.assignmentsDone.push(key);
      state.totalXP += (assignment.xp || 5);
      showXPPopup('+' + (assignment.xp || 5) + ' XP');
    }
    saveState();
    playSound('success');
  } else {
    output.innerHTML = `<span class="output-error">❌ ${result.message}<br><small>Keep trying!</small></span>`;
    playSound('error');
  }
}

function submitQuiz(lessonId) {
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (!lesson || !lesson.quiz) return;

  const form = document.getElementById('quizForm');
  let correct = 0;
  let unanswered = false;

  lesson.quiz.forEach((q, i) => {
    const selected = form.querySelector(`input[name="q${i}"]:checked`);
    const questionDiv = form.querySelectorAll('.quiz-question')[i];
    if (!selected) {
      unanswered = true;
      questionDiv.classList.add('quiz-unanswered');
      return;
    }
    questionDiv.classList.remove('quiz-unanswered');
    const val = parseInt(selected.value);
    const options = questionDiv.querySelectorAll('.quiz-option');
    if (val === q.correct) {
      correct++;
      options[val].classList.add('quiz-correct');
    } else {
      options[val].classList.add('quiz-wrong');
      options[q.correct].classList.add('quiz-correct');
    }
    // Disable all inputs after submit
    questionDiv.querySelectorAll('input').forEach(inp => inp.disabled = true);
  });

  if (unanswered) {
    document.getElementById('quizResult').innerHTML = '<div class="quiz-result-msg warn">⚠️ Please answer all questions before submitting.</div>';
    playSound('error');
    return;
  }

  const total = lesson.quiz.length;
  const passing = Math.ceil(total * 0.7);
  const passed = correct >= passing;
  const resultDiv = document.getElementById('quizResult');

  if (passed) {
    if (!state.quizzesPassed) state.quizzesPassed = [];
    if (!state.quizzesPassed.includes(lessonId)) {
      state.quizzesPassed.push(lessonId);
      const bonusXP = 10;
      state.totalXP += bonusXP;
      showXPPopup('+' + bonusXP + ' Quiz Bonus!');
    }
    saveState();
    playSound('achievement');
    launchConfetti();
    resultDiv.innerHTML = `
      <div class="quiz-result-msg success">
        🎉 Quiz Passed! ${correct}/${total} correct!
        <br><small>You can now complete this lesson.</small>
      </div>
      <button class="btn btn-success btn-lg" style="width:100%;margin-top:12px" onclick="completeLesson('${lessonId}', ${lesson.xp})">
        ✅ Complete Lesson (+${lesson.xp} XP)
      </button>`;
  } else {
    playSound('error');
    resultDiv.innerHTML = `
      <div class="quiz-result-msg fail">
        😔 Score: ${correct}/${total}. Need at least ${passing} to pass.
        <br><small>Review the lesson and try again!</small>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="switchLessonTab('quiz', '${lessonId}')">
        🔄 Retake Quiz
      </button>`;
  }
}

function completeLesson(lessonId, xp) {
  if (state.completedLessons.includes(lessonId)) return;

  // Must pass quiz if lesson has one
  let lesson = null;
  for (const w of WEEKS) { lesson = w.lessons.find(l => l.id === lessonId); if (lesson) break; }
  if (lesson && lesson.quiz && lesson.quiz.length > 0) {
    if (!state.quizzesPassed || !state.quizzesPassed.includes(lessonId)) {
      showToast('🔒 Quiz Required', 'Pass the quiz before completing this lesson.');
      playSound('error');
      return;
    }
  }

  state.completedLessons.push(lessonId);
  state.lessonsCompleted++;
  state.totalXP += xp;
  state.todayLessons++;

  if (lessonId.endsWith('l5')) {
    state.todayProject = true;
    state.projectsCompleted++;
    const weekNum = parseInt(lessonId.charAt(1));
    state.weekComplete[weekNum] = true;
  }

  const today = new Date().toDateString();
  if (!state.dailyLog[today]) state.dailyLog[today] = { xp: 0, lessons: 0, challenges: 0 };
  state.dailyLog[today].xp = (state.dailyLog[today].xp || 0) + xp;
  state.dailyLog[today].lessons = (state.dailyLog[today].lessons || 0) + 1;
  saveState();

  // Sound & effects
  playSound('xp');
  showXPPopup('+' + xp + ' XP!');
  setTimeout(() => playSound('success'), 300);

  // Check level up
  const oldLevel = getLevel();

  checkNewAchievements();
  closeLessonOverlay();
  updatePlayerInfo();
  renderDashboard();
  renderLessons(currentWeek);
  renderWeekTabs();
  renderProjects();
  renderLeaderboard();
  renderAchievements();

  const newLevel = getLevel();
  if (newLevel.index > oldLevel.index) {
    setTimeout(() => {
      playSound('levelUp');
      launchConfetti();
      showToast('🎉 LEVEL UP!', `You are now a ${newLevel.name}!`);
    }, 600);
  } else {
    showToast(`+${xp} XP!`, `Lesson completed! Total: ${state.totalXP} XP`);
  }
}

function showXPPopup(text) {
  const popup = document.getElementById('xp-popup');
  popup.textContent = text;
  popup.classList.remove('hidden');
  popup.style.animation = 'none';
  popup.offsetHeight; // trigger reflow
  popup.style.animation = 'xpFloat 1.2s ease forwards';
  setTimeout(() => popup.classList.add('hidden'), 1200);
}

// ==================== CODE PLAYGROUND ====================
function renderPlayground() {
  const container = document.getElementById('playgroundContent');
  container.innerHTML = `
    <div class="playground-container">
      <div class="playground-editor">
        <div class="playground-editor-header">
          <h4>📝 Code Editor</h4>
          <div>
            <button class="btn btn-primary" onclick="playSound('click'); runPlayground()">▶️ Run Code</button>
            <button class="btn btn-secondary" onclick="playSound('click'); clearPlayground()" style="margin-left:8px">🗑️ Clear</button>
          </div>
        </div>
        <textarea class="playground-textarea" id="playgroundCode" spellcheck="false"
          placeholder="# Write your Python code here!"># Welcome to the Code Lab!
# Write your Python code and click Run.

name = "LevelUp"
print(f"Hello, {name}!")
print(f"Let's write some Python!")

for i in range(1, 6):
    print("⭐" * i)
</textarea>
      </div>
      <div class="playground-output">
        <h4>📤 Output</h4>
        <div class="playground-output-area" id="playgroundOutput">Click "Run Code" to see the output here...</div>
      </div>
    </div>
    <div class="playground-examples">
      <h4 style="margin-bottom:8px">📋 Try These Examples:</h4>
      ${PLAYGROUND_EXAMPLES.map((ex, i) =>
        `<button class="example-btn" onclick="playSound('pop'); loadExample(${i})">${ex.name}</button>`
      ).join('')}
    </div>
  `;

  setTimeout(() => {
    const textarea = document.getElementById('playgroundCode');
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
      });
    }
  }, 100);
}

function loadExample(idx) {
  document.getElementById('playgroundCode').value = PLAYGROUND_EXAMPLES[idx].code;
  document.getElementById('playgroundOutput').textContent = 'Click "Run Code" to see the output...';
}

function clearPlayground() {
  document.getElementById('playgroundCode').value = '';
  document.getElementById('playgroundOutput').textContent = '';
}

function runPlayground() {
  const code = document.getElementById('playgroundCode').value;
  const output = document.getElementById('playgroundOutput');
  state.todayPlayground = true;
  state.playgroundRuns = (state.playgroundRuns || 0) + 1;
  saveState();
  renderDailyQuest();

  try {
    const result = simulatePython(code);
    output.innerHTML = `<span class="output-success">${escapeHtml(result)}</span>`;
    playSound('success');
  } catch (err) {
    output.innerHTML = `<span class="output-error">Error: ${escapeHtml(err.message)}</span>`;
    playSound('error');
  }
}

// ==================== PYTHON SIMULATOR ====================
function simulatePython(code, inputValues) {
  let output = [];
  let variables = {};
  let userFunctions = {};
  let inputQueue = inputValues ? [...inputValues] : [];
  let inputIndex = 0;
  const lines = code.split('\n');

  function findOperatorOutsideStrings(str, op) {
    let inStr = false, strChar = '', depth = 0;
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (inStr) { if (c === strChar && str[i-1] !== '\\') inStr = false; continue; }
      if (c === '"' || c === "'") { inStr = true; strChar = c; continue; }
      if ('([{'.includes(c)) { depth++; continue; }
      if (')]}'.includes(c)) { depth--; continue; }
      if (depth === 0 && c === op && i > 0 && i < str.length - 1 && str[i-1] !== '*' && str[i+1] !== '*') return i;
    }
    return -1;
  }

  function evaluate(expr) {
    expr = expr.trim();
    if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) return expr.slice(1, -1);
    if (expr.startsWith('f"') || expr.startsWith("f'")) {
      let s = expr.slice(2, -1);
      s = s.replace(/\{([^}]+)\}/g, (_, e) => { try { return evaluate(e); } catch { return `{${e}}`; } });
      return s;
    }
    if (!isNaN(expr) && expr !== '') return Number(expr);
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    if (variables[expr] !== undefined) return variables[expr];

    if (expr.startsWith('[') && expr.endsWith(']')) {
      const inner = expr.slice(1, -1).trim();
      if (inner === '') return [];
      return smartSplit(inner).map(e => evaluate(e.trim()));
    }
    if (expr.startsWith('{') && expr.endsWith('}')) {
      const inner = expr.slice(1, -1).trim();
      if (inner === '') return {};
      const obj = {};
      for (const pair of smartSplit(inner)) {
        const ci = pair.indexOf(':');
        if (ci > -1) obj[evaluate(pair.slice(0, ci).trim())] = evaluate(pair.slice(ci + 1).trim());
      }
      return obj;
    }

    const funcMatch = expr.match(/^(\w+(?:\.\w+)*)\((.*)?\)$/s);
    if (funcMatch) {
      const fname = funcMatch[1], argsStr = funcMatch[2] || '';
      if (fname === 'input') {
        const promptMsg = argsStr ? evaluate(argsStr) : '';
        if (inputQueue.length > inputIndex) return inputQueue[inputIndex++];
        const userInput = window.prompt(promptMsg || 'Enter input:');
        return userInput !== null ? userInput : '';
      }
      if (fname === 'len') { const a = evaluate(argsStr); return a.length !== undefined ? a.length : String(a).length; }
      if (fname === 'int') return parseInt(evaluate(argsStr));
      if (fname === 'float') return parseFloat(evaluate(argsStr));
      if (fname === 'str') return String(evaluate(argsStr));
      if (fname === 'abs') return Math.abs(evaluate(argsStr));
      if (fname === 'max') { const a = evaluate(argsStr); return Array.isArray(a) ? Math.max(...a) : Math.max(...smartSplit(argsStr).map(e => evaluate(e))); }
      if (fname === 'min') { const a = evaluate(argsStr); return Array.isArray(a) ? Math.min(...a) : Math.min(...smartSplit(argsStr).map(e => evaluate(e))); }
      if (fname === 'sum') { const a = evaluate(argsStr); return Array.isArray(a) ? a.reduce((s, n) => s + n, 0) : 0; }
      if (fname === 'range') {
        const args = smartSplit(argsStr).map(a => evaluate(a));
        const arr = [];
        let start = 0, stop, step = 1;
        if (args.length === 1) stop = args[0];
        else if (args.length === 2) { start = args[0]; stop = args[1]; }
        else { start = args[0]; stop = args[1]; step = args[2]; }
        if (step > 0) for (let i = start; i < stop; i += step) arr.push(i);
        else for (let i = start; i > stop; i += step) arr.push(i);
        return arr;
      }
      if (fname === 'enumerate') return evaluate(argsStr).map((v, i) => [i, v]);
      if (fname === 'set') return [...new Set(evaluate(argsStr))];
      if (fname === 'sorted') return [...evaluate(argsStr)].sort((x, y) => x - y);
      if (fname === 'type') return typeof evaluate(argsStr);
      if (fname === 'random.randint') { const a = smartSplit(argsStr).map(e => evaluate(e)); return Math.floor(Math.random() * (a[1] - a[0] + 1)) + a[0]; }
      if (fname === 'random.choice') { const a = evaluate(argsStr); return a[Math.floor(Math.random() * a.length)]; }
      if (fname === 'random.shuffle') { const a = variables[argsStr.trim()]; if (Array.isArray(a)) for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return undefined; }
      if (userFunctions[fname]) return callUserFunction(fname, argsStr);
    }

    const methodMatch = expr.match(/^(\w+)\.(\w+)\((.*)\)$/s);
    if (methodMatch) {
      const [, objName, method, args] = methodMatch;
      const obj = evaluate(objName);
      if (method === 'upper') return String(obj).toUpperCase();
      if (method === 'lower') return String(obj).toLowerCase();
      if (method === 'split') return String(obj).split(args ? evaluate(args) : /\s+/);
      if (method === 'replace') { const a = smartSplit(args); return String(obj).replace(new RegExp(String(evaluate(a[0])).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(evaluate(a[1]))); }
      if (method === 'append') { if (Array.isArray(obj)) obj.push(evaluate(args)); return undefined; }
      if (method === 'remove') { if (Array.isArray(obj)) { const idx = obj.indexOf(evaluate(args)); if (idx > -1) obj.splice(idx, 1); } return undefined; }
      if (method === 'items') return Object.entries(obj || {});
      if (method === 'keys') return Object.keys(obj || {});
      if (method === 'values') return Object.values(obj || {});
      if (method === 'strip') return String(obj).trim();
      if (method === 'startswith') return String(obj).startsWith(String(evaluate(args)));
      if (method === 'endswith') return String(obj).endsWith(String(evaluate(args)));
      if (method === 'count') return String(obj).split(String(evaluate(args))).length - 1;
    }

    const idxMatch = expr.match(/^(\w+)\[(.+)\]$/);
    if (idxMatch) {
      const obj = evaluate(idxMatch[1]), key = evaluate(idxMatch[2]);
      if (typeof obj === 'string' && typeof key === 'number' && key < 0) return obj[obj.length + key];
      return obj[key];
    }

    const sliceMatch = expr.match(/^(\w+)\[([^:]*):([^:]*):?([^\]]*)\]$/);
    if (sliceMatch) {
      const obj = evaluate(sliceMatch[1]);
      const start = sliceMatch[2] ? evaluate(sliceMatch[2]) : undefined;
      const end = sliceMatch[3] ? evaluate(sliceMatch[3]) : undefined;
      const step = sliceMatch[4] ? evaluate(sliceMatch[4]) : undefined;
      if (step === -1) return typeof obj === 'string' ? obj.split('').reverse().join('') : [...obj].reverse();
      return typeof obj === 'string' ? obj.slice(start, end) : obj.slice(start, end);
    }

    // String multiplication / numeric multiply — find * operator outside quotes
    const mulIdx = findOperatorOutsideStrings(expr, '*');
    if (mulIdx > 0) {
      const left = evaluate(expr.slice(0, mulIdx).trim()), right = evaluate(expr.slice(mulIdx + 1).trim());
      if (typeof left === 'string' && typeof right === 'number') return left.repeat(right);
      if (typeof left === 'number' && typeof right === 'string') return right.repeat(left);
      if (typeof left === 'number' && typeof right === 'number') return left * right;
    }

    try {
      let jsExpr = expr.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false')
        .replace(/\band\b/g, '&&').replace(/\bor\b/g, '||').replace(/\bnot\b/g, '!');
      for (const [k, v] of Object.entries(variables)) {
        const re = new RegExp(`\\b${k}\\b`, 'g');
        if (typeof v === 'string') jsExpr = jsExpr.replace(re, `"${v}"`);
        else if (typeof v === 'number' || typeof v === 'boolean') jsExpr = jsExpr.replace(re, String(v));
      }
      if (/\b(print|alert|confirm|prompt|eval)\s*\(/.test(jsExpr)) throw new Error('blocked');
      return Function('"use strict"; return (' + jsExpr + ')')();
    } catch {}
    return expr;
  }

  function smartSplit(str) {
    const result = []; let depth = 0, current = '', inStr = false, strChar = '';
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      if (inStr) { current += c; if (c === strChar && str[i-1] !== '\\') inStr = false; }
      else if (c === '"' || c === "'") { inStr = true; strChar = c; current += c; }
      else if ('([{'.includes(c)) { depth++; current += c; }
      else if (')]}'.includes(c)) { depth--; current += c; }
      else if (c === ',' && depth === 0) { result.push(current.trim()); current = ''; }
      else current += c;
    }
    if (current.trim()) result.push(current.trim());
    return result;
  }

  function callUserFunction(name, argsStr) {
    const func = userFunctions[name];
    if (!func) return undefined;
    const args = argsStr ? smartSplit(argsStr).map(a => evaluate(a)) : [];
    const savedVars = { ...variables };
    for (let i = 0; i < func.params.length; i++) {
      const p = func.params[i];
      variables[p.name] = i < args.length ? args[i] : (p.default !== undefined ? evaluate(p.default) : undefined);
    }
    const result = executeBlock(func.body);
    const globalKeys = Object.keys(savedVars);
    for (const k of func.params.map(p => p.name)) { if (!globalKeys.includes(k)) delete variables[k]; }
    Object.assign(variables, savedVars);
    return result;
  }

  function executeBlock(blockLines) {
    let i = 0;
    while (i < blockLines.length) {
      const line = blockLines[i].trim();
      if (!line || line.startsWith('#')) { i++; continue; }
      if (line.startsWith('return ')) return evaluate(line.slice(7));
      if (line === 'return') return undefined;
      if (line === 'break') return '__BREAK__';
      const result = executeLine(blockLines, i);
      if (result && result.skip) i = result.skip; else i++;
      if (result && result.returnValue !== undefined) return result.returnValue;
      if (result === '__BREAK__') return '__BREAK__';
    }
    return undefined;
  }

  function getIndent(line) { const m = line.match(/^(\s*)/); return m ? m[1].length : 0; }

  function getBlock(allLines, startIdx, baseIndent) {
    const block = [];
    for (let i = startIdx; i < allLines.length; i++) {
      const line = allLines[i];
      if (line.trim() === '' || line.trim().startsWith('#')) { block.push(line); continue; }
      if (getIndent(line) > baseIndent) block.push(line); else break;
    }
    return block;
  }

  function executeLine(allLines, idx) {
    const rawLine = allLines[idx], line = rawLine.trim();
    if (!line || line.startsWith('#') || line === 'import random') return null;
    const indent = getIndent(rawLine);

    const defMatch = line.match(/^def\s+(\w+)\(([^)]*)\)\s*:/);
    if (defMatch) {
      const params = defMatch[2].trim() ? defMatch[2].split(',').map(p => {
        p = p.trim();
        if (p.includes('=')) { const [n, d] = p.split('=').map(s => s.trim()); return { name: n, default: d }; }
        return { name: p };
      }) : [];
      const body = getBlock(allLines, idx + 1, indent);
      userFunctions[defMatch[1]] = { params, body };
      return { skip: idx + 1 + body.length };
    }

    if (line === 'print()') { output.push(''); return null; }
    const printMatch = line.match(/^print\((.+)\)$/s);
    if (printMatch) {
      const argsStr = printMatch[1];
      const endMatch = argsStr.match(/,\s*end\s*=\s*("[^"]*"|'[^']*')\s*$/);
      let end = '\n', printArgs = argsStr;
      if (endMatch) {
        end = endMatch[1].slice(1, -1);
        printArgs = argsStr.slice(0, argsStr.lastIndexOf(',', argsStr.lastIndexOf('end='))).trim();
      }
      const args = smartSplit(printArgs).map(a => {
        const v = evaluate(a);
        return v === undefined ? 'None' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      });
      const lineOut = args.join(' ');
      if (end === '\n' || end === '\\n') output.push(lineOut);
      else { if (output.length === 0) output.push(''); output[output.length - 1] += lineOut + end; }
      return null;
    }

    const forMatch = line.match(/^for\s+(\w+(?:\s*,\s*\w+)?)\s+in\s+(.+)\s*:/);
    if (forMatch) {
      const varNames = forMatch[1].split(',').map(v => v.trim());
      const body = getBlock(allLines, idx + 1, indent);
      const iterable = evaluate(forMatch[2].trim());
      if (Array.isArray(iterable)) {
        for (const item of iterable) {
          if (varNames.length === 1) variables[varNames[0]] = item;
          else if (Array.isArray(item)) varNames.forEach((v, vi) => variables[v] = item[vi]);
          const r = executeBlock(body);
          if (r === '__BREAK__') break;
        }
      }
      return { skip: idx + 1 + body.length };
    }

    const whileMatch = line.match(/^while\s+(.+)\s*:/);
    if (whileMatch) {
      const body = getBlock(allLines, idx + 1, indent);
      let safety = 0;
      while (evaluate(whileMatch[1]) && safety++ < 1000) {
        const r = executeBlock(body);
        if (r === '__BREAK__') break;
      }
      return { skip: idx + 1 + body.length };
    }

    const ifMatch = line.match(/^if\s+(.+)\s*:/);
    if (ifMatch) {
      const body = getBlock(allLines, idx + 1, indent);
      let endIdx = idx + 1 + body.length;
      let branches = [{ condition: ifMatch[1], body }];
      while (endIdx < allLines.length) {
        const nl = allLines[endIdx]?.trim();
        const elifM = nl?.match(/^elif\s+(.+)\s*:/);
        const elseM = nl?.match(/^else\s*:/);
        if (elifM) { const b = getBlock(allLines, endIdx + 1, indent); branches.push({ condition: elifM[1], body: b }); endIdx = endIdx + 1 + b.length; }
        else if (elseM) { const b = getBlock(allLines, endIdx + 1, indent); branches.push({ condition: null, body: b }); endIdx = endIdx + 1 + b.length; break; }
        else break;
      }
      for (const br of branches) { if (br.condition === null || evaluate(br.condition)) { executeBlock(br.body); break; } }
      return { skip: endIdx };
    }

    const augMatch = line.match(/^(\w+)\s*(\+=|-=|\*=|\/=)\s*(.+)$/);
    if (augMatch) {
      const val = evaluate(augMatch[3]);
      const op = augMatch[2];
      if (op === '+=') variables[augMatch[1]] = (variables[augMatch[1]] || 0) + val;
      else if (op === '-=') variables[augMatch[1]] = (variables[augMatch[1]] || 0) - val;
      else if (op === '*=') variables[augMatch[1]] = (variables[augMatch[1]] || 0) * val;
      else if (op === '/=') variables[augMatch[1]] = (variables[augMatch[1]] || 0) / val;
      return null;
    }

    const multiAssign = line.match(/^(\w+)\s*,\s*(\w+)\s*=\s*(.+)$/);
    if (multiAssign) {
      const vals = smartSplit(multiAssign[3]).map(v => evaluate(v));
      variables[multiAssign[1]] = vals[0];
      variables[multiAssign[2]] = vals[1];
      return null;
    }

    const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (assignMatch) { variables[assignMatch[1]] = evaluate(assignMatch[2]); return null; }

    const dictAssign = line.match(/^(\w+)\[(.+)\]\s*=\s*(.+)$/);
    if (dictAssign) { if (variables[dictAssign[1]]) variables[dictAssign[1]][evaluate(dictAssign[2])] = evaluate(dictAssign[3]); return null; }

    const standaloneFunc = line.match(/^(\w+(?:\.\w+)*)\((.*)?\)$/);
    if (standaloneFunc) {
      if (userFunctions[standaloneFunc[1]]) callUserFunction(standaloneFunc[1], standaloneFunc[2] || '');
      else evaluate(line);
      return null;
    }

    const methodCall = line.match(/^(\w+)\.(\w+)\((.*)\)$/);
    if (methodCall) { evaluate(line); return null; }

    return null;
  }

  for (let i = 0; i < lines.length; i++) {
    const result = executeLine(lines, i);
    if (result && result.skip) i = result.skip - 1;
  }
  return output.join('\n') || '(No output)';
}

function escapeHtml(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ==================== PROJECTS ====================
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = PROJECTS.map((p, i) => {
    const unlocked = isWeekUnlocked(p.week);
    const completed = state.completedProjects.includes(p.id);
    const hasSaved = state.savedCode && state.savedCode['project_' + p.id];
    return `<div class="project-card${!unlocked ? ' locked' : ''} pop-in" style="--delay:${i * 0.08}s">
      <div class="project-icon float">${p.icon}</div>
      <div class="project-title">${p.title}</div>
      <span class="project-difficulty difficulty-${p.difficulty}">${p.difficulty}</span>
      <div class="project-desc">${p.description}</div>
      <div class="project-requirements">Week ${p.week} ${!unlocked ? '🔒' : ''} | ⚡ ${p.xp} XP</div>
      ${unlocked && !completed ? `<button class="btn btn-primary" style="margin-top:12px;width:100%" onclick="playSound('click'); openProject('${p.id}')">${hasSaved ? '📝 Continue' : '🚀 Start'} Project</button>` : ''}
      ${completed ? '<div style="color:var(--success);margin-top:12px;font-weight:700">✅ Completed</div>' : ''}
    </div>`;
  }).join('');
}

function openProject(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) return;
  playSound('whoosh');
  const savedCode = (state.savedCode && state.savedCode['project_' + projectId]) || project.starter || '';
  const completed = state.completedProjects.includes(projectId);
  const hintsRevealed = (state.hintsUsed && state.hintsUsed['project_' + projectId]) || 0;

  const overlay = document.getElementById('project-overlay');
  const detail = document.getElementById('projectDetail');
  detail.innerHTML = `
    <h2>${project.icon} ${project.title}</h2>
    <div class="lesson-meta" style="margin-bottom:16px">
      <span class="project-difficulty difficulty-${project.difficulty}">${project.difficulty}</span>
      <span class="lesson-xp-badge">⚡ ${project.xp} XP</span>
      ${completed ? '<span style="color:var(--success);font-size:0.85rem;font-weight:700">✅ Completed</span>' : ''}
    </div>
    <div class="project-brief">
      <h4>📋 Your Mission</h4>
      <p>${project.description}</p>
      ${project.requirements ? `<div class="project-requirements-list"><strong>Requirements:</strong><ul>${project.requirements.map(r => `<li>${r}</li>`).join('')}</ul></div>` : ''}
    </div>
    <div class="project-hints-section">
      <h4>💡 Hints <span style="color:var(--text-dim);font-size:0.8rem">(${Math.min(hintsRevealed, (project.hints || []).length)}/${(project.hints || []).length} revealed)</span></h4>
      <div class="project-hints" id="projectHints">
        ${(project.hints || []).map((h, i) => {
          if (i < hintsRevealed) return `<div class="project-hint revealed"><span class="hint-num">Hint ${i+1}:</span> ${h}</div>`;
          if (i === hintsRevealed) return `<button class="btn btn-hint" onclick="revealProjectHint('${projectId}', ${i})">🔓 Reveal Hint ${i+1}</button>`;
          return `<div class="project-hint locked">🔒 Hint ${i+1} — reveal previous hint first</div>`;
        }).join('')}
      </div>
    </div>
    <div class="project-editor">
      <h4>💻 Your Code</h4>
      <textarea class="code-input project-code" id="projectCode" placeholder="# Start coding your project here..." spellcheck="false">${savedCode}</textarea>
      <div class="challenge-actions">
        <button class="btn btn-run" onclick="playSound('click'); runProjectCode('${projectId}')">▶️ Run</button>
        ${!completed && project.validator ? `<button class="btn btn-primary" onclick="playSound('click'); submitProject('${projectId}')">✅ Submit</button>` : ''}
        <button class="btn btn-secondary" onclick="document.getElementById('projectCode').value=''; saveCodeState('project_${projectId}', '')">🗑️ Clear</button>
      </div>
      <div class="output-area" id="projectOutput"></div>
    </div>`;
  overlay.classList.remove('hidden');

  setTimeout(() => {
    const textarea = document.getElementById('projectCode');
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = textarea.selectionStart;
          textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(textarea.selectionEnd);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
        if (e.key === 'Enter') {
          const pos = textarea.selectionStart;
          const before = textarea.value.substring(0, pos);
          const currentLine = before.split('\n').pop();
          const indent = currentLine.match(/^\s*/)[0];
          if (currentLine.trimEnd().endsWith(':')) {
            e.preventDefault();
            const newIndent = indent + '    ';
            textarea.value = before + '\n' + newIndent + textarea.value.substring(pos);
            textarea.selectionStart = textarea.selectionEnd = pos + 1 + newIndent.length;
          }
        }
      });
      textarea.addEventListener('input', () => saveCodeState('project_' + projectId, textarea.value));
    }
  }, 50);
}

function closeProjectOverlay() {
  document.getElementById('project-overlay').classList.add('hidden');
}

function revealProjectHint(projectId, hintIndex) {
  if (!state.hintsUsed) state.hintsUsed = {};
  state.hintsUsed['project_' + projectId] = hintIndex + 1;
  saveState();
  playSound('pop');
  openProject(projectId);
}

function runProjectCode(projectId) {
  const code = document.getElementById('projectCode').value;
  const output = document.getElementById('projectOutput');
  saveCodeState('project_' + projectId, code);
  if (!code.trim()) { output.innerHTML = '<span class="output-error">Write some code first!</span>'; playSound('error'); return; }
  try {
    const result = simulatePython(code);
    output.innerHTML = `<span class="output-success">${escapeHtml(result)}</span>`;
    playSound('pop');
  } catch (err) {
    output.innerHTML = `<span class="output-error">Error: ${escapeHtml(err.message)}</span>`;
    playSound('error');
  }
}

function submitProject(projectId) {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project || !project.validator) return;
  const code = document.getElementById('projectCode').value;
  const output = document.getElementById('projectOutput');
  saveCodeState('project_' + projectId, code);
  if (!code.trim()) { output.innerHTML = '<span class="output-error">Write some code first!</span>'; playSound('error'); return; }
  const result = project.validator(code);
  if (result.success) {
    output.innerHTML = `<span class="output-success">${result.message}</span>`;
    if (!state.completedProjects.includes(projectId)) {
      state.completedProjects.push(projectId);
      state.projectsCompleted++;
      state.totalXP += project.xp;
      state.todayProject = true;
      saveState();
      showXPPopup('+' + project.xp + ' XP!');
      playSound('achievement');
      launchConfetti();
      checkNewAchievements();
      updatePlayerInfo();
      renderDashboard();
      renderProjects();
    } else {
      playSound('success');
    }
  } else {
    output.innerHTML = `<span class="output-error">❌ ${result.message}<br><small>Keep working on it!</small></span>`;
    playSound('error');
  }
}

// ==================== LEADERBOARD ====================
async function renderLeaderboard() {
  let all;
  const myId = api.user ? api.user.id : null;

  if (api.isLoggedIn()) {
    const serverBoard = await api.getLeaderboard();
    if (serverBoard && serverBoard.length > 0) {
      all = serverBoard.map(p => ({
        name: p.username, avatar: p.avatar, xp: p.xp, streak: p.streak,
        isPlayer: p.id === myId
      }));
    }
  }

  if (!all) {
    const playerEntry = { name: state.name || 'You', avatar: state.avatar, xp: state.totalXP, streak: state.streak, isPlayer: true };
    all = [...LEADERBOARD_BOTS, playerEntry].sort((a, b) => b.xp - a.xp);
  }

  const podium = document.getElementById('podium');
  const medals = ['🥇', '🥈', '🥉'];
  const classes = ['gold', 'silver', 'bronze'];
  const top3 = all.slice(0, 3);

  podium.innerHTML = top3.map((p, i) =>
    `<div class="podium-place ${classes[i]}${p.isPlayer ? ' is-you' : ''} pop-in" style="--delay:${(2 - i) * 0.15}s">
      <div class="podium-rank">${medals[i]}</div>
      <div class="podium-avatar">${p.avatar}</div>
      <div class="podium-name">${p.isPlayer ? '⭐ YOU' : p.name}</div>
      <div class="podium-xp">⚡ ${p.xp} XP</div>
    </div>`
  ).join('');

  const table = document.getElementById('leaderboardTable');
  table.innerHTML = all.slice(3).map((p, i) => {
    const rank = i + 4;
    const lvl = getLevelForXP(p.xp);
    return `<div class="leaderboard-row${p.isPlayer ? ' is-you' : ''}">
      <div class="lb-rank">#${rank}</div>
      <div class="lb-avatar">${p.avatar}</div>
      <div class="lb-name">${p.isPlayer ? '⭐ YOU (' + p.name + ')' : p.name}</div>
      <div class="lb-level">${lvl}</div>
      <div class="lb-xp">⚡ ${p.xp} XP</div>
    </div>`;
  }).join('');
}

function getLevelForXP(xp) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXP) lvl = l; }
  return lvl.name;
}

// ==================== ACHIEVEMENTS ====================
function renderAchievements() {
  const grid = document.getElementById('achievementsGrid');
  grid.innerHTML = ACHIEVEMENTS.map((a, i) => {
    const unlocked = a.condition(state);
    return `<div class="achievement-card${unlocked ? ' unlocked' : ' locked'} pop-in" style="--delay:${i * 0.05}s">
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-name">${a.name}</div>
      <div class="achievement-desc">${a.description}</div>
      ${unlocked ? '<div style="color:var(--accent-yellow);font-size:0.78rem;margin-top:6px;font-weight:700">🏆 Unlocked!</div>' : ''}
    </div>`;
  }).join('');
}

function checkNewAchievements() {
  ACHIEVEMENTS.forEach(a => {
    const wasUnlocked = state['ach_' + a.id];
    const isUnlocked = a.condition(state);
    if (isUnlocked && !wasUnlocked) {
      state['ach_' + a.id] = true;
      const bonusXP = a.xp || 10;
      state.totalXP += bonusXP;
      saveState();
      if (api.isLoggedIn()) api.addAchievement(a.id);
      setTimeout(() => {
        playSound('achievement');
        launchConfetti();
        showToast(`🏆 Achievement Unlocked! +${bonusXP} XP`, `${a.icon} ${a.name} - ${a.description}`);
        showXPPopup('+' + bonusXP + ' Trophy XP!');
      }, 500);
    }
  });
}

// ==================== TOAST ====================
function showToast(title, body) {
  const toast = document.getElementById('toast');
  toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-body">${body}</div>`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 4000);
}

// ==================== CONFETTI ====================
function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#7c5cfc', '#2dd4bf', '#f472b6', '#fb923c', '#fbbf24', '#34d399', '#ef5350', '#00b4d8', '#e040fb'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.3 - 50,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      life: 1,
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      if (p.life <= 0) return;
      alive = true;
      p.x += p.vx;
      p.vy += 0.1;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= 0.008;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (alive && frame < 180) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ==================== PARTICLES BACKGROUND ====================
function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = 50;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const style = getComputedStyle(document.documentElement);
    const color = style.getPropertyValue('--primary').trim() || '#7c5cfc';

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    // Draw connections
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ==================== MULTIPLAYER ====================
let currentDifficulty = 'easy';
let duelTimer = null;
let duelTimeLeft = 0;
let duelActive = false;

function selectDifficulty(diff, btn) {
  currentDifficulty = diff;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function showMPTab(tab, btn) {
  document.querySelectorAll('.mp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.mp-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('mp-' + tab).classList.remove('hidden');
  if (btn) btn.classList.add('active');
  else { const tabs = document.querySelectorAll('.mp-tab'); const map = {challenge:0,coop:1,tournament:2}; if (tabs[map[tab]]) tabs[map[tab]].classList.add('active'); }
  if (tab === 'coop') renderCoopGrid();
  if (tab === 'tournament') renderTournament();
  if (tab === 'challenge') renderBattleStats();
}

function startDuel() {
  // XP-based difficulty: auto-match based on player progress
  let autoDifficulty = 'easy';
  if (state.totalXP >= 300) autoDifficulty = 'medium';
  if (state.totalXP >= 800) autoDifficulty = 'hard';
  currentDifficulty = autoDifficulty;
  const challenges = DUEL_CHALLENGES[currentDifficulty];
  const challenge = challenges[Math.floor(Math.random() * challenges.length)];
  // Match bot by XP range
  const sortedBots = [...DUEL_BOTS].sort((a, b) => Math.abs(a.speed * 1000 - state.totalXP) - Math.abs(b.speed * 1000 - state.totalXP));
  const bot = sortedBots[Math.floor(Math.random() * Math.min(3, sortedBots.length))];
  const arena = document.getElementById('duelArena');
  duelTimeLeft = challenge.timeLimit;
  duelActive = true;

  arena.classList.remove('hidden');
  arena.innerHTML = `
    <div class="duel-arena">
      <div class="duel-header">
        <h3>⚡ ${challenge.title}</h3>
        <span style="font-size:0.85rem;color:var(--text-dim)">${currentDifficulty.toUpperCase()}</span>
      </div>
      <div class="duel-players">
        <div class="duel-player"><div class="avatar-big">${state.avatar}</div><div class="name">${state.name || 'You'}</div></div>
        <div style="font-size:2rem;font-weight:700;color:var(--primary)">⚔️ VS</div>
        <div class="duel-player"><div class="avatar-big">${bot.avatar}</div><div class="name">${bot.name}</div></div>
      </div>
      <div class="duel-timer" id="duelTimerDisplay">${duelTimeLeft}s</div>
      <div class="duel-challenge-box">
        <strong>Challenge:</strong> ${challenge.description}<br>
        <small style="color:var(--text-dim)">💡 Hint: ${challenge.hint}</small>
      </div>
      <textarea class="duel-code-area" id="duelCode" placeholder="# Write your Python code here..." spellcheck="false"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary" style="flex:1" onclick="submitDuel('${challenge.id}','${bot.name}',${bot.speed},${bot.accuracy})">🚀 Submit Answer</button>
        <button class="btn" style="background:var(--danger);color:white" onclick="cancelDuel()">✖ Forfeit</button>
      </div>
      <div id="duelResult"></div>
    </div>`;

  clearInterval(duelTimer);
  duelTimer = setInterval(() => {
    duelTimeLeft--;
    const display = document.getElementById('duelTimerDisplay');
    if (display) display.textContent = duelTimeLeft + 's';
    if (duelTimeLeft <= 10 && display) display.style.animation = 'pulse 0.5s infinite';
    if (duelTimeLeft <= 0) {
      clearInterval(duelTimer);
      if (duelActive) submitDuel(challenge.id, bot.name, bot.speed, bot.accuracy, true);
    }
  }, 1000);
  arena.scrollIntoView({ behavior: 'smooth' });
}

function submitDuel(challengeId, botName, botSpeed, botAccuracy, timedOut) {
  if (!duelActive) return;
  duelActive = false;
  clearInterval(duelTimer);

  const code = document.getElementById('duelCode')?.value || '';
  const challenge = [...DUEL_CHALLENGES.easy, ...DUEL_CHALLENGES.medium, ...DUEL_CHALLENGES.hard].find(c => c.id === challengeId);
  const timeUsed = challenge.timeLimit - duelTimeLeft;

  // Bot simulation
  const botTime = challenge.timeLimit * (1 - botSpeed) * (0.7 + Math.random() * 0.6);
  const botCorrect = Math.random() < botAccuracy;

  let playerCorrect = false;
  if (!timedOut && code.trim()) {
    const result = challenge.validator(code);
    playerCorrect = result.success;
  }

  const playerWins = playerCorrect && (!botCorrect || timeUsed < botTime);
  const resultDiv = document.getElementById('duelResult');

  if (playerWins) {
    state.duelsWon++;
    const xpEarned = challenge.xp;
    state.totalXP += xpEarned;
    state.duelHistory.unshift({ vs: botName, result: 'win', challenge: challenge.title, xp: xpEarned, date: new Date().toLocaleDateString() });
    resultDiv.innerHTML = `<div class="duel-result win">🏆 YOU WIN! +${xpEarned} XP<br><small>You: ${timeUsed}s vs ${botName}: ${Math.round(botTime)}s</small></div>`;
    playSound('success');
    launchConfetti();
    showXPPopup(xpEarned);
  } else {
    state.duelsLost++;
    state.duelHistory.unshift({ vs: botName, result: 'lose', challenge: challenge.title, xp: 0, date: new Date().toLocaleDateString() });
    const reason = timedOut ? 'Time\'s up!' : !playerCorrect ? 'Incorrect answer' : `${botName} was faster`;
    resultDiv.innerHTML = `<div class="duel-result lose">😔 ${reason}<br><small>${botName} solved it in ${Math.round(botTime)}s</small></div>`;
    playSound('error');
  }

  if (state.duelHistory.length > 20) state.duelHistory = state.duelHistory.slice(0, 20);
  saveState();
  if (api.isLoggedIn()) {
    api.addDuel({
      difficulty: currentDifficulty,
      challengeId: challengeId,
      userCode: code,
      result: playerWins ? 'win' : 'loss',
      xpEarned: playerWins ? challenge.xp : 0,
      timeTaken: timeUsed
    });
  }
  renderBattleStats();
  renderRecentDuels();
  checkNewAchievements();
}

function cancelDuel() {
  duelActive = false;
  clearInterval(duelTimer);
  // Forfeit penalty: lose XP
  const penalty = 5;
  state.totalXP = Math.max(0, state.totalXP - penalty);
  state.duelsLost++;
  state.duelHistory.unshift({ vs: 'Forfeit', result: 'lose', challenge: 'Forfeited', xp: -penalty, date: new Date().toLocaleDateString() });
  saveState();
  showXPPopup('-' + penalty + ' XP');
  playSound('error');
  showToast('⚠️ Forfeit', `You lost ${penalty} XP for forfeiting.`);
  document.getElementById('duelArena').classList.add('hidden');
  renderBattleStats();
  renderRecentDuels();
}

function renderBattleStats() {
  const el = document.getElementById('battleStats');
  if (!el) return;
  const total = state.duelsWon + state.duelsLost;
  const winRate = total > 0 ? Math.round((state.duelsWon / total) * 100) : 0;
  el.innerHTML = `
    <div class="battle-stat"><div class="stat-num">${state.duelsWon}</div><div class="stat-lbl">Wins</div></div>
    <div class="battle-stat"><div class="stat-num">${state.duelsLost}</div><div class="stat-lbl">Losses</div></div>
    <div class="battle-stat"><div class="stat-num">${winRate}%</div><div class="stat-lbl">Win Rate</div></div>
    <div class="battle-stat"><div class="stat-num">${total}</div><div class="stat-lbl">Total Duels</div></div>`;
}

function renderRecentDuels() {
  const el = document.getElementById('recentDuels');
  if (!el) return;
  if (!state.duelHistory || state.duelHistory.length === 0) {
    el.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:16px">No duels yet. Start your first code duel!</p>';
    return;
  }
  el.innerHTML = state.duelHistory.slice(0, 8).map(d => `
    <div class="recent-duel">
      <div><strong>${d.challenge}</strong> <span style="color:var(--text-dim);font-size:0.8rem">vs ${d.vs}</span></div>
      <div><span class="result-badge ${d.result}">${d.result === 'win' ? '🏆 Win' : '😔 Loss'}</span></div>
    </div>`).join('');
}

function renderCoopGrid() {
  const el = document.getElementById('coopGrid');
  if (!el) return;
  el.innerHTML = COOP_PROJECTS.map(p => `
    <div class="coop-card">
      <div class="coop-icon">${p.icon}</div>
      <div class="coop-title">${p.title}</div>
      <div class="coop-desc">${p.description}</div>
      <div class="coop-meta">
        <span>👥 ${p.players} players</span>
        <span>⚡ ${p.xp} XP</span>
        <span>${p.difficulty === 'hard' ? '🔴' : '🟡'} ${p.difficulty}</span>
      </div>
      <button class="coop-join-btn" onclick="playSound('whoosh'); showToast('🤝 Co-op projects require multiple players. Invite friends to join!')">Join Project</button>
    </div>`).join('');
}

function renderTournament() {
  const info = document.getElementById('tournamentInfo');
  const standings = document.getElementById('tournamentStandings');
  if (!info || !standings) return;

  const roundsDone = state.tournamentRound || 0;
  const totalRounds = TOURNAMENT_DATA.rounds;

  info.innerHTML = `
    <div class="tournament-status">
      <div class="tournament-stat"><div class="t-val">${roundsDone}/${totalRounds}</div><div class="t-lbl">Rounds Done</div></div>
      <div class="tournament-stat"><div class="t-val">🥇 ${TOURNAMENT_DATA.xpPrizes.first}</div><div class="t-lbl">1st Prize XP</div></div>
      <div class="tournament-stat"><div class="t-val">🥈 ${TOURNAMENT_DATA.xpPrizes.second}</div><div class="t-lbl">2nd Prize XP</div></div>
      <div class="tournament-stat"><div class="t-val">🥉 ${TOURNAMENT_DATA.xpPrizes.third}</div><div class="t-lbl">3rd Prize XP</div></div>
    </div>
    <div class="tournament-progress-text" style="text-align:center;margin:8px 0;color:var(--text-dim);font-size:0.85rem">
      ${roundsDone >= totalRounds ? '🏆 All rounds complete! Reset to play again.' : `Round ${roundsDone + 1} of ${totalRounds}`}
    </div>
    ${roundsDone >= totalRounds ?
      `<button class="btn btn-secondary btn-lg" style="width:100%" onclick="playSound('click'); resetTournament()">🔄 Reset Tournament</button>` :
      `<button class="btn btn-primary btn-lg" style="width:100%" onclick="playSound('whoosh'); enterTournament()">⚔️ Start Round ${roundsDone + 1}</button>`}`;

  const botScores = LEADERBOARD_BOTS.slice(0, 8).map(b => ({
    name: b.name, avatar: b.avatar,
    score: Math.max(0, Math.floor(b.xp * 0.15) + (b.xp % 7) * 3)
  }));
  const players = [
    ...botScores,
    { name: state.name || 'You', avatar: state.avatar, score: state.tournamentScore || 0, isPlayer: true }
  ].sort((a, b) => b.score - a.score);

  standings.innerHTML = players.map((p, i) => {
    const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
    return `<div class="tournament-standing${p.isPlayer ? ' is-you' : ''}">
      <div class="rank ${rankClass}">${medal}</div>
      <span style="font-size:1.3rem">${p.avatar}</span>
      <span class="t-name">${p.isPlayer ? '⭐ YOU' : p.name}</span>
      <span class="t-score">${p.score} pts</span>
    </div>`;
  }).join('');
}

function enterTournament() {
  const roundsDone = state.tournamentRound || 0;
  if (roundsDone >= TOURNAMENT_DATA.rounds) return;

  let diff = 'easy';
  if (state.totalXP >= 300) diff = 'medium';
  if (state.totalXP >= 800) diff = 'hard';
  const challenges = DUEL_CHALLENGES[diff];
  const challenge = challenges[roundsDone % challenges.length];

  const arena = document.getElementById('tournamentArena');
  if (!arena) return;
  arena.classList.remove('hidden');
  let timeLeft = challenge.timeLimit;
  arena.innerHTML = `
    <div class="duel-arena tournament-round">
      <div class="duel-header">
        <h3>🏆 Round ${roundsDone + 1}: ${challenge.title}</h3>
        <span style="font-size:0.85rem;color:var(--text-dim)">${diff.toUpperCase()}</span>
      </div>
      <div class="duel-timer" id="tournamentTimer">${timeLeft}s</div>
      <div class="duel-challenge-box">
        <strong>Challenge:</strong> ${challenge.description}<br>
        <small style="color:var(--text-dim)">💡 ${challenge.hint}</small>
      </div>
      <textarea class="duel-code-area" id="tournamentCode" placeholder="# Solve it!" spellcheck="false"></textarea>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary" style="flex:1" onclick="submitTournamentRound('${challenge.id}')">🚀 Submit</button>
      </div>
      <div id="tournamentResult"></div>
    </div>`;

  clearInterval(window._tournamentTimer);
  window._tournamentTimer = setInterval(() => {
    timeLeft--;
    const display = document.getElementById('tournamentTimer');
    if (display) display.textContent = timeLeft + 's';
    if (timeLeft <= 10 && display) display.style.animation = 'pulse 0.5s infinite';
    if (timeLeft <= 0) {
      clearInterval(window._tournamentTimer);
      submitTournamentRound(challenge.id, true);
    }
  }, 1000);
  arena.scrollIntoView({ behavior: 'smooth' });
}

function submitTournamentRound(challengeId, timedOut) {
  clearInterval(window._tournamentTimer);
  const code = document.getElementById('tournamentCode')?.value || '';
  const challenge = [...DUEL_CHALLENGES.easy, ...DUEL_CHALLENGES.medium, ...DUEL_CHALLENGES.hard].find(c => c.id === challengeId);
  const resultDiv = document.getElementById('tournamentResult');

  let correct = false;
  if (!timedOut && code.trim() && challenge) {
    const r = challenge.validator(code);
    correct = r.success;
  }

  const pointsEarned = correct ? challenge.xp : 0;
  state.tournamentScore = (state.tournamentScore || 0) + pointsEarned;
  state.tournamentRound = (state.tournamentRound || 0) + 1;
  if (correct) state.totalXP += pointsEarned;
  saveState();

  if (correct) {
    resultDiv.innerHTML = `<div class="duel-result win">✅ Correct! +${pointsEarned} pts</div>`;
    playSound('success');
    showXPPopup('+' + pointsEarned + ' XP!');
  } else {
    resultDiv.innerHTML = `<div class="duel-result lose">❌ ${timedOut ? "Time's up!" : 'Incorrect.'} +0 pts</div>`;
    playSound('error');
  }

  const roundsDone = state.tournamentRound;
  if (roundsDone >= TOURNAMENT_DATA.rounds) {
    const finalPlace = getFinalTournamentPlace();
    const prizes = TOURNAMENT_DATA.xpPrizes;
    let bonus = 0;
    if (finalPlace === 1) bonus = prizes.first;
    else if (finalPlace === 2) bonus = prizes.second;
    else if (finalPlace === 3) bonus = prizes.third;
    if (bonus > 0) {
      state.totalXP += bonus;
      saveState();
      setTimeout(() => {
        launchConfetti();
        playSound('achievement');
        showToast('🏆 Tournament Complete!', `You placed #${finalPlace}! +${bonus} bonus XP!`);
        showXPPopup('+' + bonus + ' Bonus!');
      }, 800);
    } else {
      setTimeout(() => showToast('🏆 Tournament Complete!', `You placed #${finalPlace}. Keep practicing!`), 800);
    }
  }

  setTimeout(() => {
    document.getElementById('tournamentArena').classList.add('hidden');
    renderTournament();
    updatePlayerInfo();
    renderLeaderboard();
  }, 1500);
}

function getFinalTournamentPlace() {
  const botScores = LEADERBOARD_BOTS.slice(0, 8).map(b => Math.max(0, Math.floor(b.xp * 0.15) + (b.xp % 7) * 3));
  const myScore = state.tournamentScore || 0;
  return botScores.filter(s => s > myScore).length + 1;
}

function resetTournament() {
  state.tournamentScore = 0;
  state.tournamentRound = 0;
  saveState();
  renderTournament();
  playSound('whoosh');
}

// ==================== PARENT DASHBOARD ====================
function showParentLogin() {
  document.getElementById('parent-overlay').classList.remove('hidden');
  document.getElementById('parentLogin').classList.remove('hidden');
  document.getElementById('parentContent').classList.add('hidden');
  document.getElementById('pinError').style.display = 'none';
  document.getElementById('parentPin').value = '';
  document.getElementById('parentPin').focus();
}

function closeParentDashboard() {
  document.getElementById('parent-overlay').classList.add('hidden');
}

function checkParentPin() {
  const pin = document.getElementById('parentPin').value;
  if (pin === (state.parentPin || '1234')) {
    document.getElementById('parentLogin').classList.add('hidden');
    document.getElementById('parentContent').classList.remove('hidden');
    document.getElementById('parentChildName').textContent = state.name || 'Your Child';
    renderParentOverview();
    renderActivityLog();
    renderParentSettings();
  } else {
    document.getElementById('pinError').style.display = 'block';
    playSound('error');
  }
}

function showParentTab(tab, btn) {
  document.querySelectorAll('.parent-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.parent-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('pt-' + tab).classList.remove('hidden');
  if (btn) btn.classList.add('active');
  else { const tabs = document.querySelectorAll('.parent-tab'); const map = {overview:0,activity:1,settings:2}; if (tabs[map[tab]]) tabs[map[tab]].classList.add('active'); }
}

function renderParentOverview() {
  const totalLessons = WEEKS.reduce((sum, w) => sum + w.lessons.length, 0);
  const completionPct = totalLessons > 0 ? Math.round((state.lessonsCompleted / totalLessons) * 100) : 0;
  const totalDuels = state.duelsWon + state.duelsLost;
  const avgXPperDay = Object.keys(state.dailyLog || {}).length > 0
    ? Math.round(state.totalXP / Object.keys(state.dailyLog).length) : 0;

  document.getElementById('parentStats').innerHTML = `
    <div class="parent-stat-card"><div class="ps-icon">⚡</div><div class="ps-value">${state.totalXP}</div><div class="ps-label">Total XP Earned</div></div>
    <div class="parent-stat-card"><div class="ps-icon">✅</div><div class="ps-value">${state.lessonsCompleted}/${totalLessons}</div><div class="ps-label">Lessons Completed</div></div>
    <div class="parent-stat-card"><div class="ps-icon">📊</div><div class="ps-value">${completionPct}%</div><div class="ps-label">Course Progress</div></div>
    <div class="parent-stat-card"><div class="ps-icon">🔥</div><div class="ps-value">${state.streak}</div><div class="ps-label">Current Streak</div></div>
    <div class="parent-stat-card"><div class="ps-icon">🏗️</div><div class="ps-value">${state.projectsCompleted}</div><div class="ps-label">Projects Built</div></div>
    <div class="parent-stat-card"><div class="ps-icon">⚔️</div><div class="ps-value">${state.duelsWon}/${totalDuels}</div><div class="ps-label">Duels Won</div></div>`;

  // Weekly chart
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const weekData = days.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i + 1);
    const key = date.toDateString();
    return { day: d, xp: (state.dailyLog && state.dailyLog[key]) ? state.dailyLog[key].xp || 0 : 0 };
  });
  const maxXP = Math.max(...weekData.map(d => d.xp), 1);
  document.getElementById('parentWeeklyChart').innerHTML = `
    <div class="weekly-chart">${weekData.map(d => `
      <div class="bar-col">
        <div class="bar-value">${d.xp}</div>
        <div class="bar" style="height:${(d.xp / maxXP) * 120}px"></div>
        <div class="bar-label">${d.day}</div>
      </div>`).join('')}
    </div>`;

  // Skills breakdown
  const skills = [
    { name: 'Basics (Variables, Print)', pct: Math.min(100, state.lessonsCompleted >= 5 ? 100 : state.lessonsCompleted * 20), color: '#6366f1' },
    { name: 'Logic (Loops, Conditions)', pct: Math.min(100, Math.max(0, (state.lessonsCompleted - 5) * 20)), color: '#10b981' },
    { name: 'Functions & Data', pct: Math.min(100, Math.max(0, (state.lessonsCompleted - 10) * 20)), color: '#f59e0b' },
    { name: 'OOP & Classes', pct: Math.min(100, Math.max(0, (state.lessonsCompleted - 25) * 20)), color: '#ef4444' },
    { name: 'Algorithms', pct: Math.min(100, Math.max(0, (state.lessonsCompleted - 30) * 20)), color: '#8b5cf6' },
    { name: 'AI Concepts', pct: Math.min(100, Math.max(0, (state.lessonsCompleted - 35) * 20)), color: '#06b6d4' },
  ];
  document.getElementById('parentSkills').innerHTML = skills.map(s => `
    <div class="skills-bar">
      <div class="skill-name"><span>${s.name}</span><span>${s.pct}%</span></div>
      <div class="skill-track"><div class="skill-fill" style="width:${s.pct}%;background:${s.color}"></div></div>
    </div>`).join('');

  // Recommendations
  const recs = [];
  if (state.streak < 3) recs.push('💡 Encourage daily practice to build a coding streak!');
  if (state.lessonsCompleted < 10) recs.push('📚 Focus on completing the foundational lessons in Weeks 1-2.');
  if (state.projectsCompleted < 2) recs.push('🏗️ Try the guided projects to apply learned concepts.');
  if (state.duelsWon + state.duelsLost === 0) recs.push('⚔️ The Battle Arena is a fun way to practice under time pressure!');
  if (completionPct > 50) recs.push('🌟 Great progress! Your child is ahead of schedule.');
  if (recs.length === 0) recs.push('🏆 Amazing work! Keep up the excellent coding journey!');
  document.getElementById('parentRecommendations').innerHTML = `<div class="parent-recommendations">${recs.map(r => `<div class="rec-item">${r}</div>`).join('')}</div>`;
}

function renderActivityLog() {
  const el = document.getElementById('parentActivityLog');
  if (!el) return;
  const log = state.dailyLog || {};
  const dates = Object.keys(log).sort((a, b) => new Date(b) - new Date(a)).slice(0, 14);
  if (dates.length === 0) {
    el.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:20px">No activity recorded yet. Activity will appear here as your child completes lessons.</p>';
    return;
  }
  el.innerHTML = dates.map(d => {
    const entry = log[d];
    return `<div class="activity-day">
      <div class="day-date">${d}</div>
      <div class="day-details">${entry.lessons || 0} lessons · ${entry.challenges || 0} challenges</div>
      <div class="day-xp">+${entry.xp || 0} XP</div>
    </div>`;
  }).join('');
}

function renderParentSettings() {
  const el = document.getElementById('parentSettingsForm');
  if (!el) return;
  el.innerHTML = `
    <div class="setting-item">
      <div><div class="setting-label">Daily Time Limit</div><div class="setting-desc">Set a daily time limit (0 = unlimited)</div></div>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="number" id="timeLimitInput" value="${state.dailyTimeLimit || 0}" min="0" max="480" step="15">
        <span style="font-size:0.85rem;color:var(--text-dim)">min</span>
      </div>
    </div>
    <div class="setting-item">
      <div><div class="setting-label">Change PIN</div><div class="setting-desc">Update your parent dashboard PIN</div></div>
      <div style="display:flex;align-items:center;gap:8px">
        <input type="password" id="newPinInput" placeholder="New PIN" maxlength="4" style="width:100px">
      </div>
    </div>
    <div class="setting-item">
      <div><div class="setting-label">Sound Effects</div><div class="setting-desc">Enable/disable app sounds</div></div>
      <button class="toggle-switch ${soundEnabled ? 'on' : ''}" onclick="toggleSound(); this.classList.toggle('on')"></button>
    </div>
    <div style="margin-top:16px">
      <button class="btn btn-primary" onclick="saveParentSettings()">💾 Save Settings</button>
    </div>`;
}

function saveParentSettings() {
  const timeLimit = parseInt(document.getElementById('timeLimitInput')?.value || '0');
  const newPin = document.getElementById('newPinInput')?.value;
  state.dailyTimeLimit = Math.max(0, Math.min(480, timeLimit));
  if (newPin && newPin.length === 4 && /^\d{4}$/.test(newPin)) {
    state.parentPin = newPin;
    showToast('🔐 PIN updated successfully!');
  }
  saveState();
  showToast('✅ Settings saved!');
}
