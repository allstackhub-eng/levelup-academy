require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3456', 'http://localhost:5500'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

// --- Auth middleware ---
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// --- Auth routes ---
app.post('/api/signup', async (req, res) => {
  const { username, password, avatar, theme } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (username.length > 20) return res.status(400).json({ error: 'Username max 20 characters' });
  if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });

  const pool = getPool();
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password_hash, avatar, theme) VALUES (?, ?, ?, ?)',
      [username.trim(), hash, avatar || '🧑‍💻', theme || 'cosmic']
    );
    const userId = result.insertId;

    await pool.execute(
      'INSERT INTO progress (user_id) VALUES (?)',
      [userId]
    );

    const token = jwt.sign({ id: userId, username: username.trim() }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: userId, username: username.trim(), avatar: avatar || '🧑‍💻', theme: theme || 'cosmic' } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already taken' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid username or password' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({
      token,
      user: { id: user.id, username: user.username, avatar: user.avatar, theme: user.theme }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Progress routes ---
app.get('/api/progress', auth, async (req, res) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT * FROM progress WHERE user_id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'No progress found' });

    const p = rows[0];
    const parse = (v, fallback) => typeof v === 'string' ? JSON.parse(v) : (v || fallback);
    res.json({
      xp: p.xp,
      level: p.level,
      streak: p.streak,
      lastActive: p.last_active,
      lessonsCompleted: parse(p.lessons_completed, []),
      quizzesPassed: parse(p.quizzes_passed, []),
      projectsCompleted: parse(p.projects_completed, []),
      savedCode: parse(p.saved_code, {}),
      lessonTabState: parse(p.lesson_tab_state, {}),
      hintsUsed: parse(p.hints_used, {}),
      weeklyActivity: parse(p.weekly_activity, {})
    });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/progress', auth, async (req, res) => {
  const { xp, level, streak, lastActive, lessonsCompleted, quizzesPassed,
          projectsCompleted, savedCode, lessonTabState, hintsUsed, weeklyActivity } = req.body;

  const pool = getPool();
  try {
    await pool.execute(`
      UPDATE progress SET
        xp = ?, level = ?, streak = ?, last_active = ?,
        lessons_completed = ?, quizzes_passed = ?, projects_completed = ?,
        saved_code = ?, lesson_tab_state = ?, hints_used = ?, weekly_activity = ?
      WHERE user_id = ?
    `, [
      xp || 0, level || 1, streak || 0, lastActive || null,
      JSON.stringify(lessonsCompleted || []),
      JSON.stringify(quizzesPassed || []),
      JSON.stringify(projectsCompleted || []),
      JSON.stringify(savedCode || {}),
      JSON.stringify(lessonTabState || {}),
      JSON.stringify(hintsUsed || {}),
      JSON.stringify(weeklyActivity || {}),
      req.user.id
    ]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Achievements routes ---
app.get('/api/achievements', auth, async (req, res) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT achievement_id, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at',
      [req.user.id]
    );
    res.json(rows.map(r => ({ id: r.achievement_id, earnedAt: r.earned_at })));
  } catch (err) {
    console.error('Get achievements error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/achievements', auth, async (req, res) => {
  const { achievementId } = req.body;
  if (!achievementId) return res.status(400).json({ error: 'achievementId required' });

  const pool = getPool();
  try {
    await pool.execute(
      'INSERT IGNORE INTO achievements (user_id, achievement_id) VALUES (?, ?)',
      [req.user.id, achievementId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Add achievement error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Duels routes ---
app.get('/api/duels', auth, async (req, res) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM duels WHERE user_id = ? ORDER BY played_at DESC LIMIT 20',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get duels error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/duels', auth, async (req, res) => {
  const { difficulty, challengeId, userCode, result, xpEarned, timeTaken } = req.body;
  const pool = getPool();
  try {
    await pool.execute(
      'INSERT INTO duels (user_id, difficulty, challenge_id, user_code, result, xp_earned, time_taken) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, difficulty, challengeId || null, userCode || '', result, xpEarned || 0, timeTaken || 0]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Add duel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Leaderboard ---
app.get('/api/leaderboard', async (req, res) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.username, u.avatar, p.xp, p.level, p.streak,
        JSON_LENGTH(p.lessons_completed) as lessons_done,
        (SELECT COUNT(*) FROM duels d WHERE d.user_id = u.id AND d.result = 'win') as duel_wins
      FROM users u
      JOIN progress p ON p.user_id = u.id
      ORDER BY p.xp DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Friends ---
app.get('/api/friends', auth, async (req, res) => {
  const pool = getPool();
  try {
    const [rows] = await pool.execute(`
      SELECT u.id, u.username, u.avatar, p.xp, p.level, f.status
      FROM friend_links f
      JOIN users u ON u.id = CASE WHEN f.user_id = ? THEN f.friend_id ELSE f.user_id END
      JOIN progress p ON p.user_id = u.id
      WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
    `, [req.user.id, req.user.id, req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error('Friends error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/add', auth, async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username required' });

  const pool = getPool();
  try {
    const [users] = await pool.execute('SELECT id FROM users WHERE username = ?', [username.trim()]);
    if (!users.length) return res.status(404).json({ error: 'User not found' });
    if (users[0].id === req.user.id) return res.status(400).json({ error: 'Cannot add yourself' });

    await pool.execute(
      'INSERT INTO friend_links (user_id, friend_id, status) VALUES (?, ?, "accepted") ON DUPLICATE KEY UPDATE status = "accepted"',
      [req.user.id, users[0].id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Add friend error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- User profile ---
app.put('/api/user/profile', auth, async (req, res) => {
  const { avatar, theme, parentPin } = req.body;
  const pool = getPool();
  try {
    const updates = [];
    const values = [];
    if (avatar) { updates.push('avatar = ?'); values.push(avatar); }
    if (theme) { updates.push('theme = ?'); values.push(theme); }
    if (parentPin) {
      const hash = await bcrypt.hash(parentPin, 10);
      updates.push('parent_pin = ?');
      values.push(hash);
    }
    if (!updates.length) return res.status(400).json({ error: 'Nothing to update' });

    values.push(req.user.id);
    await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ ok: true });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`LevelUp Academy API running on port ${PORT}`);
});
