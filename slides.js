// ==================== ANIMATED LESSON PLAYER ====================

const LESSON_SLIDES = {
  w1l1: [
    {
      bg: 'gradient-purple',
      mascot: '🚀',
      title: 'Welcome to Python!',
      body: 'Python is one of the most popular programming languages in the world.',
      visual: 'icons',
      icons: ['🌐', '🎮', '🤖', '📱'],
      iconLabels: ['Websites', 'Games', 'AI', 'Apps'],
      note: 'Big companies like Google, Netflix, and Instagram all use Python!'
    },
    {
      bg: 'gradient-blue',
      mascot: '🐍',
      title: 'Meet print()',
      body: 'In Python, we use a command called <strong>print()</strong> to show text on the screen.',
      visual: 'concept',
      concept: { label: 'print()', desc: 'Tells the computer:\n"Show this on the screen!"', icon: '🖥️' }
    },
    {
      bg: 'gradient-dark',
      mascot: '👨‍💻',
      title: "Let's Write Code!",
      body: 'Here\'s your very first Python program:',
      visual: 'code-anim',
      code: 'print("Hello, World!")',
      codeCaption: 'This is a Python command'
    },
    {
      bg: 'gradient-dark',
      mascot: '🔍',
      title: 'Breaking It Down',
      body: 'Every part of this code has a job:',
      visual: 'code-breakdown',
      parts: [
        { text: 'print', color: '#60a5fa', label: 'The command', desc: 'Tells Python to display something' },
        { text: '(', color: '#e8e6f0', label: '', desc: '' },
        { text: '"Hello, World!"', color: '#34d399', label: 'The message', desc: 'What you want to show (in quotes!)' },
        { text: ')', color: '#e8e6f0', label: '', desc: '' }
      ]
    },
    {
      bg: 'gradient-green',
      mascot: '▶️',
      title: 'Running Your Code',
      body: 'When Python reads your code, it follows your instructions:',
      visual: 'run-anim',
      code: 'print("Hello, World!")',
      output: 'Hello, World!'
    },
    {
      bg: 'gradient-purple',
      mascot: '✏️',
      title: 'The Quote Rule',
      body: 'Text inside print() must be wrapped in quotes — single <code>\'...\'</code> or double <code>"..."</code>',
      visual: 'compare',
      correct: 'print("Hello!")',
      wrong: 'print(Hello!)',
      correctLabel: 'With quotes',
      wrongLabel: 'Without quotes — Error!'
    },
    {
      bg: 'gradient-dark',
      mascot: '🎨',
      title: 'Print Anything!',
      body: 'You can print any text you want. Try changing the message!',
      visual: 'multi-code',
      examples: [
        { code: 'print("My name is Python!")', output: 'My name is Python!' },
        { code: 'print("I love coding!")', output: 'I love coding!' },
        { code: 'print("2 + 2 =", 2 + 2)', output: '2 + 2 = 4' }
      ]
    },
    {
      bg: 'gradient-blue',
      mascot: '🧮',
      title: 'Print Can Do Math!',
      body: 'Python can calculate numbers too — no quotes needed for math:',
      visual: 'code-anim',
      code: 'print(10 + 5)',
      codeCaption: 'No quotes = Python does the math!'
    },
    {
      bg: 'gradient-gold',
      mascot: '🏆',
      title: "You're Ready!",
      body: "Now you know how to use <strong>print()</strong> — the first tool in every programmer's toolkit!",
      visual: 'summary',
      points: [
        'print() displays text on screen',
        'Text needs quotes: "..." or \'...\'',
        'Numbers don\'t need quotes',
        'Python can do math inside print()'
      ],
      cta: 'Now try it yourself in Practice!'
    }
  ],

  w1l2: [
    {
      bg: 'gradient-purple',
      mascot: '📦',
      title: 'What Are Variables?',
      body: 'A variable is like a <strong>labeled box</strong> that stores information.',
      visual: 'concept',
      concept: { label: 'variable', desc: 'A named container\nthat holds data', icon: '📦' }
    },
    {
      bg: 'gradient-blue',
      mascot: '🏷️',
      title: 'Creating Variables',
      body: 'Use the <strong>=</strong> sign to put a value into a variable:',
      visual: 'code-anim',
      code: 'name = "Alex"\nage = 12',
      codeCaption: 'The = sign means "store this value"'
    },
    {
      bg: 'gradient-dark',
      mascot: '🔍',
      title: 'How It Works',
      body: 'Think of it like labeling boxes:',
      visual: 'boxes',
      boxes: [
        { label: 'name', value: '"Alex"', color: '#34d399' },
        { label: 'age', value: '12', color: '#fb923c' },
        { label: 'score', value: '95.5', color: '#60a5fa' }
      ]
    },
    {
      bg: 'gradient-dark',
      mascot: '🖨️',
      title: 'Using Variables',
      body: 'Once stored, use the variable name to access the value:',
      visual: 'multi-code',
      examples: [
        { code: 'name = "Alex"\nprint(name)', output: 'Alex' },
        { code: 'age = 12\nprint("Age:", age)', output: 'Age: 12' }
      ]
    },
    {
      bg: 'gradient-green',
      mascot: '🔄',
      title: 'Variables Can Change',
      body: 'You can update a variable by assigning a new value:',
      visual: 'run-anim',
      code: 'score = 10\nprint(score)\nscore = 20\nprint(score)',
      output: '10\n20'
    },
    {
      bg: 'gradient-purple',
      mascot: '📝',
      title: 'Naming Rules',
      body: 'Variable names have a few rules:',
      visual: 'compare',
      correct: 'my_name = "Alex"\nage2 = 12',
      wrong: '2age = 12\nmy name = "Alex"',
      correctLabel: 'Letters, numbers, underscores',
      wrongLabel: "Can't start with number or have spaces"
    },
    {
      bg: 'gradient-gold',
      mascot: '🏆',
      title: "You're Ready!",
      body: 'You now know how to store and use data with variables!',
      visual: 'summary',
      points: [
        'Variables store data with a name',
        'Use = to assign a value',
        'Use the name to access the value',
        'Values can be changed anytime'
      ],
      cta: 'Try creating your own variables in Practice!'
    }
  ],

  w1l3: [
    {
      bg: 'gradient-purple',
      mascot: '🧮',
      title: 'Python the Calculator',
      body: 'Python can do math just like a calculator — but way more powerful!',
      visual: 'icons',
      icons: ['+', '-', '*', '/'],
      iconLabels: ['Add', 'Subtract', 'Multiply', 'Divide']
    },
    {
      bg: 'gradient-dark',
      mascot: '➕',
      title: 'Basic Operations',
      body: 'Here are the math operators you can use:',
      visual: 'multi-code',
      examples: [
        { code: 'print(10 + 3)', output: '13' },
        { code: 'print(10 - 3)', output: '7' },
        { code: 'print(10 * 3)', output: '30' },
        { code: 'print(10 / 3)', output: '3.333...' }
      ]
    },
    {
      bg: 'gradient-blue',
      mascot: '💪',
      title: 'Power Operators',
      body: 'Python has special operators too:',
      visual: 'multi-code',
      examples: [
        { code: 'print(10 // 3)', output: '3  (whole number only)' },
        { code: 'print(10 % 3)', output: '1  (remainder)' },
        { code: 'print(2 ** 3)', output: '8  (2 to the power of 3)' }
      ]
    },
    {
      bg: 'gradient-green',
      mascot: '📐',
      title: 'Math with Variables',
      body: 'Combine variables and math for real calculations:',
      visual: 'run-anim',
      code: 'price = 25\ntax = price * 0.1\ntotal = price + tax\nprint("Total:", total)',
      output: 'Total: 27.5'
    },
    {
      bg: 'gradient-gold',
      mascot: '🏆',
      title: "You're Ready!",
      body: 'You can now use Python as your personal super-calculator!',
      visual: 'summary',
      points: [
        '+ - * / for basic math',
        '// for integer division, % for remainder',
        '** for powers',
        'Combine math with variables'
      ],
      cta: 'Try the math challenges in Practice!'
    }
  ]
};

// ==================== SLIDE PLAYER ENGINE ====================

let slidePlayer = null;

function openSlidePlayer(lessonId) {
  const slides = LESSON_SLIDES[lessonId];
  if (!slides) { showToast('🎬', 'Video lesson coming soon!'); return; }

  slidePlayer = { lessonId, slides, current: 0, autoPlay: false, autoTimer: null };
  const overlay = document.createElement('div');
  overlay.id = 'slidePlayerOverlay';
  overlay.className = 'slide-overlay';
  overlay.innerHTML = `
    <div class="slide-player">
      <button class="slide-close" onclick="closeSlidePlayer()">✕</button>
      <div class="slide-stage" id="slideStage"></div>
      <div class="slide-controls">
        <button class="slide-btn" id="slidePrev" onclick="slideNav(-1)">◀</button>
        <div class="slide-progress">
          <div class="slide-dots" id="slideDots"></div>
          <span class="slide-counter" id="slideCounter"></span>
        </div>
        <button class="slide-btn" id="slideNext" onclick="slideNav(1)">▶</button>
      </div>
      <button class="slide-auto-btn" id="slideAutoBtn" onclick="toggleAutoPlay()">▶ Auto Play</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('visible'));
  renderSlide(0);
  playSound('whoosh');

  document.addEventListener('keydown', slideKeyHandler);
}

function closeSlidePlayer() {
  const overlay = document.getElementById('slidePlayerOverlay');
  if (!overlay) return;
  if (slidePlayer && slidePlayer.autoTimer) clearInterval(slidePlayer.autoTimer);
  overlay.classList.remove('visible');
  setTimeout(() => overlay.remove(), 300);
  slidePlayer = null;
  document.removeEventListener('keydown', slideKeyHandler);
  playSound('click');
}

function slideKeyHandler(e) {
  if (!slidePlayer) return;
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); slideNav(1); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); slideNav(-1); }
  else if (e.key === 'Escape') closeSlidePlayer();
}

function slideNav(dir) {
  if (!slidePlayer) return;
  const next = slidePlayer.current + dir;
  if (next < 0 || next >= slidePlayer.slides.length) return;
  slidePlayer.current = next;
  renderSlide(next);
  playSound('pop');
}

function toggleAutoPlay() {
  if (!slidePlayer) return;
  const btn = document.getElementById('slideAutoBtn');
  if (slidePlayer.autoPlay) {
    clearInterval(slidePlayer.autoTimer);
    slidePlayer.autoPlay = false;
    btn.textContent = '▶ Auto Play';
    btn.classList.remove('active');
  } else {
    slidePlayer.autoPlay = true;
    btn.textContent = '⏸ Pause';
    btn.classList.add('active');
    slidePlayer.autoTimer = setInterval(() => {
      if (slidePlayer.current < slidePlayer.slides.length - 1) slideNav(1);
      else toggleAutoPlay();
    }, 5000);
  }
}

function renderSlide(idx) {
  const slide = slidePlayer.slides[idx];
  const stage = document.getElementById('slideStage');
  const total = slidePlayer.slides.length;

  document.getElementById('slideDots').innerHTML = slidePlayer.slides.map((_, i) =>
    `<div class="slide-dot ${i === idx ? 'active' : ''} ${i < idx ? 'done' : ''}" onclick="slidePlayer.current=${i};renderSlide(${i})"></div>`
  ).join('');
  document.getElementById('slideCounter').textContent = `${idx + 1} / ${total}`;
  document.getElementById('slidePrev').disabled = idx === 0;
  document.getElementById('slideNext').disabled = idx === total - 1;

  stage.className = `slide-stage ${slide.bg}`;
  stage.innerHTML = `<div class="slide-content slide-enter">${buildSlideContent(slide)}</div>`;
  const content = stage.querySelector('.slide-content');
  requestAnimationFrame(() => content.classList.add('visible'));

  if (slide.visual === 'code-anim' || slide.visual === 'run-anim') {
    setTimeout(() => animateSlideCode(stage, slide), 600);
  }
  if (slide.visual === 'code-breakdown') {
    setTimeout(() => animateBreakdown(stage), 400);
  }
  if (slide.visual === 'multi-code') {
    setTimeout(() => animateMultiCode(stage), 400);
  }
}

function buildSlideContent(slide) {
  let html = `<div class="slide-mascot">${slide.mascot}</div>`;
  html += `<h2 class="slide-title">${slide.title}</h2>`;
  html += `<p class="slide-body">${slide.body}</p>`;

  switch (slide.visual) {
    case 'icons':
      html += `<div class="slide-icons">${slide.icons.map((ic, i) =>
        `<div class="slide-icon-card"><span class="slide-icon-emoji">${ic}</span><span class="slide-icon-label">${slide.iconLabels[i]}</span></div>`
      ).join('')}</div>`;
      if (slide.note) html += `<p class="slide-note">${slide.note}</p>`;
      break;

    case 'concept':
      html += `<div class="slide-concept">
        <span class="slide-concept-icon">${slide.concept.icon}</span>
        <div class="slide-concept-code">${slide.concept.label}</div>
        <div class="slide-concept-desc">${slide.concept.desc.replace(/\n/g, '<br>')}</div>
      </div>`;
      break;

    case 'code-anim':
      html += `<div class="slide-code-area">
        <div class="slide-code-block" id="slideCodeBlock"></div>
        ${slide.codeCaption ? `<div class="slide-code-caption">${slide.codeCaption}</div>` : ''}
      </div>`;
      break;

    case 'code-breakdown':
      html += `<div class="slide-code-area"><div class="slide-code-block slide-breakdown">
        ${slide.parts.map((p, i) => `<span class="breakdown-part" data-idx="${i}" style="color:${p.color}">${escapeHtml(p.text)}</span>`).join('')}
      </div></div>`;
      html += `<div class="slide-breakdown-labels" id="breakdownLabels">
        ${slide.parts.filter(p => p.label).map((p, i) => `<div class="breakdown-label" data-idx="${i}" style="border-color:${p.color}">
          <strong style="color:${p.color}">${p.label}</strong><br><span>${p.desc}</span>
        </div>`).join('')}
      </div>`;
      break;

    case 'run-anim':
      html += `<div class="slide-run-area">
        <div class="slide-code-area"><div class="slide-code-block" id="slideCodeBlock"></div></div>
        <div class="slide-arrow-down">▼</div>
        <div class="slide-output-box" id="slideOutputBox"></div>
      </div>`;
      break;

    case 'compare':
      html += `<div class="slide-compare">
        <div class="slide-compare-card correct">
          <div class="slide-compare-badge">✅ ${slide.correctLabel}</div>
          <div class="slide-code-block">${escapeHtml(slide.correct)}</div>
        </div>
        <div class="slide-compare-card wrong">
          <div class="slide-compare-badge">❌ ${slide.wrongLabel}</div>
          <div class="slide-code-block">${escapeHtml(slide.wrong)}</div>
        </div>
      </div>`;
      break;

    case 'multi-code':
      html += `<div class="slide-multi-code">${slide.examples.map((ex, i) =>
        `<div class="slide-example" data-idx="${i}">
          <div class="slide-code-block mini">${escapeHtml(ex.code)}</div>
          <div class="slide-example-output">${escapeHtml(ex.output)}</div>
        </div>`
      ).join('')}</div>`;
      break;

    case 'boxes':
      html += `<div class="slide-boxes">${slide.boxes.map(b =>
        `<div class="slide-box">
          <div class="slide-box-label" style="background:${b.color}">${b.label}</div>
          <div class="slide-box-value">${b.value}</div>
        </div>`
      ).join('')}</div>`;
      break;

    case 'summary':
      html += `<div class="slide-summary">
        <ul>${slide.points.map(p => `<li>${p}</li>`).join('')}</ul>
        <div class="slide-cta">${slide.cta}</div>
      </div>`;
      break;
  }

  return html;
}

function animateSlideCode(stage, slide) {
  const block = stage.querySelector('#slideCodeBlock');
  if (!block) return;
  const code = slide.code;
  block.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'code-demo-cursor';
  block.appendChild(cursor);

  let i = 0;
  const speed = code.length > 80 ? 20 : 30;
  function type() {
    if (i < code.length) {
      cursor.before(document.createTextNode(code[i]));
      i++;
      setTimeout(type, code[i - 1] === '\n' ? speed * 4 : speed);
    } else {
      cursor.remove();
      if (slide.visual === 'run-anim' && slide.output !== undefined) {
        setTimeout(() => {
          const outputBox = stage.querySelector('#slideOutputBox');
          if (outputBox) {
            outputBox.textContent = slide.output;
            outputBox.classList.add('visible');
          }
          const arrow = stage.querySelector('.slide-arrow-down');
          if (arrow) arrow.classList.add('visible');
        }, 400);
      }
    }
  }
  type();
}

function animateBreakdown(stage) {
  const parts = stage.querySelectorAll('.breakdown-part');
  const labels = stage.querySelectorAll('.breakdown-label');
  let delay = 0;
  parts.forEach((p, i) => {
    setTimeout(() => p.classList.add('visible'), delay);
    delay += 300;
  });
  labels.forEach((l, i) => {
    setTimeout(() => l.classList.add('visible'), delay);
    delay += 400;
  });
}

function animateMultiCode(stage) {
  const examples = stage.querySelectorAll('.slide-example');
  examples.forEach((ex, i) => {
    setTimeout(() => ex.classList.add('visible'), i * 500 + 200);
  });
}
