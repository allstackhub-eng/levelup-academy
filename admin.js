// ==================== ADMIN DASHBOARD ====================
const ADMIN_API = 'https://levelup-academy-api.fly.dev';
let adminKey = '';

function showAdminLogin() {
  const mc = document.getElementById('mainContent');
  if (mc) mc.innerHTML = '';
  const sb = document.querySelector('.sidebar');
  if (sb) sb.style.display = 'none';
  document.getElementById('onboarding-modal')?.classList.add('hidden');

  const el = document.createElement('div');
  el.id = 'adminPanel';
  el.className = 'admin-panel';
  el.innerHTML = `
    <div class="admin-login-card">
      <h1>🔐 Admin Dashboard</h1>
      <p style="color:var(--text-dim);margin-bottom:16px">Enter the admin key to continue</p>
      <input type="password" id="adminKeyInput" placeholder="Admin key..." class="admin-input" onkeydown="if(event.key==='Enter')adminLogin()">
      <p id="adminLoginError" class="auth-error hidden"></p>
      <button class="btn btn-primary btn-lg" onclick="adminLogin()" style="width:100%;margin-top:8px">Enter Dashboard</button>
      <p style="text-align:center;margin-top:16px"><a href="#" onclick="event.preventDefault();window.location.hash='';window.location.reload()" style="color:var(--primary-light);font-size:0.85rem">← Back to site</a></p>
    </div>
  `;
  document.body.appendChild(el);
}

async function adminLogin() {
  const key = document.getElementById('adminKeyInput').value.trim();
  const errorEl = document.getElementById('adminLoginError');
  if (!key) { errorEl.textContent = 'Please enter the admin key'; errorEl.classList.remove('hidden'); return; }

  try {
    const res = await fetch(`${ADMIN_API}/api/admin/stats`, { headers: { 'x-admin-key': key } });
    if (!res.ok) { errorEl.textContent = 'Invalid admin key'; errorEl.classList.remove('hidden'); return; }
    adminKey = key;
    sessionStorage.setItem('adminKey', key);
    loadAdminDashboard();
  } catch (e) {
    errorEl.textContent = 'Could not connect to server';
    errorEl.classList.remove('hidden');
  }
}

async function adminFetch(path) {
  const res = await fetch(`${ADMIN_API}${path}`, { headers: { 'x-admin-key': adminKey } });
  if (!res.ok) return null;
  return await res.json();
}

async function loadAdminDashboard() {
  const panel = document.getElementById('adminPanel');
  panel.innerHTML = '<div class="admin-loading">Loading dashboard...</div>';

  const [stats, users] = await Promise.all([adminFetch('/api/admin/stats'), adminFetch('/api/admin/users')]);
  if (!stats || !users) { panel.innerHTML = '<p style="color:red;padding:40px">Failed to load data</p>'; return; }

  panel.innerHTML = `
    <div class="admin-header">
      <h1>📊 LevelUp Admin</h1>
      <div class="admin-header-actions">
        <button class="admin-btn" onclick="loadAdminDashboard()">🔄 Refresh</button>
        <a href="#" onclick="event.preventDefault();window.location.hash='';window.location.reload()" class="admin-btn">← Back to site</a>
      </div>
    </div>

    <div class="admin-stats-row">
      <div class="admin-stat-card">
        <div class="admin-stat-number">${stats.total_users}</div>
        <div class="admin-stat-label">Total Users</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-number">${stats.active_today}</div>
        <div class="admin-stat-label">Active Today</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-number">${stats.active_week}</div>
        <div class="admin-stat-label">Active This Week</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-number">${Number(stats.total_xp).toLocaleString()}</div>
        <div class="admin-stat-label">Total XP Earned</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-number">${Number(stats.total_lessons)}</div>
        <div class="admin-stat-label">Lessons Completed</div>
      </div>
    </div>

    ${stats.signups.length ? `
    <div class="admin-card">
      <h2>📈 Signups (Last 30 Days)</h2>
      <div class="admin-chart">${buildSignupChart(stats.signups)}</div>
    </div>` : ''}

    <div class="admin-card">
      <h2>👥 All Users (${users.length})</h2>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Username</th><th>Avatar</th><th>XP</th><th>Level</th><th>Streak</th>
              <th>Lessons</th><th>Parent</th><th>Joined</th><th>Last Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `<tr id="admin-user-${u.id}">
              <td>${u.id}</td>
              <td><strong>${escHtml(u.username)}</strong></td>
              <td style="font-size:1.3rem">${u.avatar || '—'}</td>
              <td>${u.xp || 0}</td>
              <td>${u.level || 1}</td>
              <td>${u.streak || 0}</td>
              <td>${countJson(u.lessons_completed)}</td>
              <td>${u.parent_name ? `${escHtml(u.parent_name)}<br><span style="font-size:0.75rem;color:var(--text-dim)">${escHtml(u.parent_email || '')}</span>` : '<span style="color:var(--text-dim)">—</span>'}</td>
              <td>${fmtDate(u.created_at)}</td>
              <td>${fmtDate(u.last_active)}</td>
              <td class="admin-actions">
                <button class="admin-btn-sm" onclick="adminResetPw(${u.id}, '${escHtml(u.username)}')" title="Reset Password">🔑</button>
                <button class="admin-btn-sm danger" onclick="adminDeleteUser(${u.id}, '${escHtml(u.username)}')" title="Delete User">🗑️</button>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function buildSignupChart(signups) {
  const maxCount = Math.max(...signups.map(s => s.count), 1);
  return `<div class="signup-chart">${signups.map(s => {
    const d = new Date(s.date);
    const label = `${d.getMonth()+1}/${d.getDate()}`;
    const height = Math.max((s.count / maxCount) * 100, 8);
    return `<div class="chart-bar-wrap">
      <div class="chart-count">${s.count}</div>
      <div class="chart-bar" style="height:${height}%"></div>
      <div class="chart-label">${label}</div>
    </div>`;
  }).join('')}</div>`;
}

async function adminResetPw(userId, username) {
  const newPw = prompt(`Enter new password for "${username}" (min 4 chars):`);
  if (!newPw) return;
  if (newPw.length < 4) { alert('Password must be at least 4 characters'); return; }

  const res = await fetch(`${ADMIN_API}/api/admin/reset-password/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify({ newPassword: newPw })
  });
  if (res.ok) alert(`Password reset for ${username}`);
  else alert('Failed to reset password');
}

async function adminDeleteUser(userId, username) {
  if (!confirm(`Delete user "${username}" and all their progress? This cannot be undone.`)) return;
  if (!confirm(`Are you sure? Type YES to confirm.`)) return;

  const res = await fetch(`${ADMIN_API}/api/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey }
  });
  if (res.ok) {
    document.getElementById(`admin-user-${userId}`)?.remove();
    alert(`Deleted ${username}`);
  } else {
    alert('Failed to delete user');
  }
}

function escHtml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') : ''; }
function countJson(s) { try { return JSON.parse(s || '[]').length; } catch { return 0; } }
function fmtDate(d) { if (!d) return '<span style="color:var(--text-dim)">—</span>'; const dt = new Date(d); return `${dt.getMonth()+1}/${dt.getDate()}/${dt.getFullYear()}`; }
