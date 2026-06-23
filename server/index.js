require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const { getPool } = require('./db');

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://levelup-academy.allstackhub.com', 'http://localhost:3456', 'http://localhost:5500'],
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
function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

app.post('/api/signup', async (req, res) => {
  const { username, password, avatar, theme, parentName, parentEmail } = req.body;
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

    if (parentName && parentEmail) {
      const accessCode = generateAccessCode();
      await pool.execute(
        'INSERT INTO parent_access (user_id, parent_name, parent_email, access_code) VALUES (?, ?, ?, ?)',
        [userId, parentName.trim(), parentEmail.trim().toLowerCase(), accessCode]
      );
      try {
        await resend.emails.send({
          from: 'LevelUp Academy <noreply@allstackhub.com>',
          to: parentEmail.trim().toLowerCase(),
          subject: `Your Parent Access Code for ${username.trim()}'s LevelUp Academy`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
              <h1 style="color:#6366f1">🚀 LevelUp Academy</h1>
              <p>Hi ${parentName.trim()},</p>
              <p><strong>${username.trim()}</strong> has signed up for LevelUp Academy and listed you as their parent!</p>
              <p>Use this code to view their progress:</p>
              <div style="background:#f3f4f6;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
                <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#6366f1">${accessCode}</span>
              </div>
              <p><a href="https://levelup-academy.allstackhub.com/#parent" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Progress Dashboard</a></p>
              <p style="color:#6b7280;font-size:13px">Enter your email and the code above to see their coding journey.</p>
              <p style="color:#9ca3af;font-size:13px">If you didn't expect this email, you can safely ignore it.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error('Failed to send parent email:', emailErr);
      }
    }

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

app.post('/api/reset-password', async (req, res) => {
  const { username, parentEmail, newPassword } = req.body;
  if (!username || !parentEmail || !newPassword) return res.status(400).json({ error: 'All fields are required' });
  if (newPassword.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });

  const pool = getPool();
  try {
    const [rows] = await pool.execute('SELECT id, parent_email FROM users WHERE username = ?', [username.trim()]);
    if (!rows.length) return res.status(404).json({ error: 'Coder name not found' });

    const user = rows[0];
    if (!user.parent_email || user.parent_email.toLowerCase() !== parentEmail.trim().toLowerCase()) {
      return res.status(403).json({ error: 'Parent email does not match our records' });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
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

// --- Parent access routes ---
app.post('/api/parent/login', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Email and access code required' });

  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT pa.*, u.username, u.avatar FROM parent_access pa JOIN users u ON u.id = pa.user_id WHERE pa.parent_email = ? AND pa.access_code = ?',
      [email.trim().toLowerCase(), code.trim().toUpperCase()]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid email or access code' });

    const pa = rows[0];
    const token = jwt.sign({ parentId: pa.id, userId: pa.user_id, role: 'parent' }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, parentName: pa.parent_name, childUsername: pa.username, childAvatar: pa.avatar });
  } catch (err) {
    console.error('Parent login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function parentAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'parent') return res.status(403).json({ error: 'Parent access required' });
    req.parent = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/parent/progress', parentAuth, async (req, res) => {
  const pool = getPool();
  try {
    const [users] = await pool.execute('SELECT username, avatar FROM users WHERE id = ?', [req.parent.userId]);
    if (!users.length) return res.status(404).json({ error: 'Child account not found' });

    const [progress] = await pool.execute('SELECT * FROM progress WHERE user_id = ?', [req.parent.userId]);
    if (!progress.length) return res.status(404).json({ error: 'No progress found' });

    const [achievements] = await pool.execute(
      'SELECT achievement_id, earned_at FROM achievements WHERE user_id = ? ORDER BY earned_at',
      [req.parent.userId]
    );

    const [duels] = await pool.execute(
      'SELECT difficulty, result, xp_earned, played_at FROM duels WHERE user_id = ? ORDER BY played_at DESC LIMIT 20',
      [req.parent.userId]
    );

    const p = progress[0];
    const parse = (v, fallback) => typeof v === 'string' ? JSON.parse(v) : (v || fallback);

    res.json({
      child: { username: users[0].username, avatar: users[0].avatar },
      progress: {
        xp: p.xp,
        level: p.level,
        streak: p.streak,
        lastActive: p.last_active,
        lessonsCompleted: parse(p.lessons_completed, []),
        quizzesPassed: parse(p.quizzes_passed, []),
        projectsCompleted: parse(p.projects_completed, []),
        weeklyActivity: parse(p.weekly_activity, {})
      },
      achievements: achievements.map(r => ({ id: r.achievement_id, earnedAt: r.earned_at })),
      recentDuels: duels
    });
  } catch (err) {
    console.error('Parent progress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/parent/resend-code', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const pool = getPool();
  try {
    const [rows] = await pool.execute(
      'SELECT pa.*, u.username FROM parent_access pa JOIN users u ON u.id = pa.user_id WHERE pa.parent_email = ?',
      [email.trim().toLowerCase()]
    );
    if (!rows.length) return res.status(404).json({ error: 'No account found with that email' });

    const pa = rows[0];
    await resend.emails.send({
      from: 'LevelUp Academy <noreply@allstackhub.com>',
      to: pa.parent_email,
      subject: `Your Parent Access Code for ${pa.username}'s LevelUp Academy`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
          <h1 style="color:#6366f1">🚀 LevelUp Academy</h1>
          <p>Hi ${pa.parent_name},</p>
          <p>Here's your access code to view <strong>${pa.username}</strong>'s progress:</p>
          <div style="background:#f3f4f6;border-radius:12px;padding:20px;text-align:center;margin:20px 0">
            <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#6366f1">${pa.access_code}</span>
          </div>
          <p><a href="https://levelup-academy.allstackhub.com/#parent" style="display:inline-block;background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Progress Dashboard</a></p>
          <p style="color:#9ca3af;font-size:13px">If you didn't request this, you can safely ignore it.</p>
        </div>
      `
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Resend code error:', err);
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
