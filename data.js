const LEVELS = [
  { name: 'Apprentice', minXP: 0 },
  { name: 'Explorer', minXP: 100 },
  { name: 'Coder', minXP: 300 },
  { name: 'Developer', minXP: 600 },
  { name: 'Architect', minXP: 1000 },
  { name: 'Innovator', minXP: 1500 },
  { name: 'Code Master', minXP: 2500 },
];

const AVATARS = ['🧑‍💻', '👩‍💻', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️', '🤖', '👾', '🐉', '🦊', '🐱‍💻', '🦄'];

const THEMES = [
  { id: 'cosmic', name: 'Cosmic', icon: '🌌', color: '#7c5cfc' },
  { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#00b4d8' },
  { id: 'jungle', name: 'Jungle', icon: '🌴', color: '#4caf50' },
  { id: 'dragon', name: 'Dragon', icon: '🐉', color: '#ef5350' },
  { id: 'candy', name: 'Candy', icon: '🍬', color: '#e040fb' },
  { id: 'arctic', name: 'Arctic', icon: '❄️', color: '#3b82f6' },
];

const LEADERBOARD_BOTS = [
  { name: 'PyMaster99', avatar: '🤖', xp: 1850, streak: 28 },
  { name: 'CodeNinja', avatar: '🥷', xp: 1420, streak: 21 },
  { name: 'PixelWitch', avatar: '🧙‍♀️', xp: 1180, streak: 18 },
  { name: 'BugSquasher', avatar: '🐛', xp: 980, streak: 15 },
  { name: 'LoopLegend', avatar: '🔄', xp: 870, streak: 12 },
  { name: 'ByteKnight', avatar: '⚔️', xp: 720, streak: 10 },
  { name: 'DataDragon', avatar: '🐲', xp: 650, streak: 9 },
  { name: 'AlgoStar', avatar: '⭐', xp: 540, streak: 7 },
  { name: 'CyberFox', avatar: '🦊', xp: 380, streak: 5 },
  { name: 'TechTurtle', avatar: '🐢', xp: 210, streak: 3 },
  { name: 'BitBunny', avatar: '🐰', xp: 120, streak: 2 },
  { name: 'NewbieNova', avatar: '🌟', xp: 45, streak: 1 },
];

// Python syntax helpers for validators
function pyCheck(code) {
  const lines = code.split('\n').map(l => l.trimEnd());
  return {
    has: (kw) => code.includes(kw),
    count: (pat) => (code.match(pat) || []).length,
    // Check that keyword lines end with colon (if:, for:, while:, def:, else:, elif:, class:, try:, except:)
    colonsOk() {
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (/^(if|elif)\s+/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^else\s*/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^(for|while)\s+/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^def\s+/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^class\s+/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^try\s*/.test(trimmed) && !trimmed.endsWith(':')) return false;
        if (/^except/.test(trimmed) && !trimmed.endsWith(':')) return false;
      }
      return true;
    },
    // Check balanced parens
    parensOk() {
      let depth = 0;
      for (const ch of code) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (depth < 0) return false;
      }
      return depth === 0;
    },
    // Check balanced brackets
    bracketsOk() {
      let depth = 0;
      for (const ch of code) {
        if (ch === '[') depth++;
        else if (ch === ']') depth--;
        if (depth < 0) return false;
      }
      return depth === 0;
    },
    // Check print() has parens
    printOk() {
      if (!code.includes('print')) return true;
      return /print\s*\(/.test(code);
    },
    // Basic syntax check combining the above
    syntaxOk() {
      return this.colonsOk() && this.parensOk() && this.bracketsOk() && this.printOk();
    }
  };
}

const SYNTAX_ERR = 'Check your Python syntax! Make sure colons (:) are at the end of if/for/while/def lines, parentheses () are balanced, and print uses print().';

const WEEKS = [
  {
    id: 1,
    title: 'Week 1: Python Basics',
    description: 'Variables, printing, and your first programs',
    lessons: [
      {
        id: 'w1l1',
        title: 'Hello, World!',
        description: 'Your very first Python program',
        xp: 20,
        tags: ['basics'],
        content: `
          <h3>Welcome to Python! 🐍</h3>
          <p>Python is one of the most popular programming languages in the world. It's used to build websites, apps, games, AI, and so much more!</p>
          <p>Let's write your very first program. In Python, we use <strong>print()</strong> to display text on the screen:</p>
          <div class="code-block"><span class="code-func">print</span>(<span class="code-string">"Hello, World!"</span>)</div>
          <p>When you run this, it shows: <strong>Hello, World!</strong></p>
          <p>You can print anything you want:</p>
          <div class="code-block"><span class="code-func">print</span>(<span class="code-string">"My name is LevelUp!"</span>)
<span class="code-func">print</span>(<span class="code-string">"I am learning Python!"</span>)
<span class="code-func">print</span>(<span class="code-string">"2 + 2 ="</span>, <span class="code-number">2</span> + <span class="code-number">2</span>)</div>
        `,
        challenge: {
          prompt: 'Write a program that prints your name and your age on two separate lines. Use two print() statements.',
          hint: 'Use print("Your Name") on the first line and print("Your Age") on the second line.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const prints = py.count(/print\s*\(/g);
            return prints >= 2 ? { success: true, message: '🎉 Awesome! You used multiple print statements!' } : { success: false, message: 'Try using at least 2 print() statements.' };
          }
        }
      },
      {
        id: 'w1l2',
        title: 'Variables - Storing Data',
        description: 'Learn to store and use information',
        xp: 25,
        tags: ['basics', 'variables'],
        content: `
          <h3>What are Variables? 📦</h3>
          <p>Variables are like labeled boxes where you store information. You can put a number, text, or other data inside them and use them later.</p>
          <div class="code-block"><span class="code-comment"># Creating variables</span>
name = <span class="code-string">"Alex"</span>
age = <span class="code-number">13</span>
favorite_game = <span class="code-string">"Minecraft"</span>

<span class="code-func">print</span>(<span class="code-string">"Hi, I'm"</span>, name)
<span class="code-func">print</span>(<span class="code-string">"I am"</span>, age, <span class="code-string">"years old"</span>)
<span class="code-func">print</span>(<span class="code-string">"I love playing"</span>, favorite_game)</div>
          <h3>Variable Rules 📝</h3>
          <p>1. Names can have letters, numbers, and underscores<br>
          2. Names can't start with a number<br>
          3. No spaces allowed (use underscores instead)<br>
          4. Python cares about UPPER and lower case</p>
          <div class="code-block"><span class="code-comment"># Good variable names</span>
player_score = <span class="code-number">100</span>
highScore = <span class="code-number">500</span>
lives = <span class="code-number">3</span>

<span class="code-comment"># You can change variables!</span>
lives = lives - <span class="code-number">1</span>
<span class="code-func">print</span>(<span class="code-string">"Lives remaining:"</span>, lives)  <span class="code-comment"># Shows: 2</span>

<span class="code-comment"># Quick math with variables</span>
coins = <span class="code-number">17</span>
packs = coins // <span class="code-number">5</span>    <span class="code-comment"># Integer division: 3 (whole packs you can buy)</span>
leftover = coins % <span class="code-number">5</span>  <span class="code-comment"># Remainder (modulo): 2 coins left over</span>
<span class="code-func">print</span>(<span class="code-string">"Packs:"</span>, packs, <span class="code-string">"Leftover:"</span>, leftover)</div>
        `,
        challenge: {
          prompt: 'Create three variables: your_name (text), your_age (number), and favorite_subject (text). Then print all three using print().',
          hint: 'Remember: text goes in quotes "like this", numbers don\'t need quotes.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasVars = py.has('=') && py.count(/(?<!=)=(?!=)/g) >= 3;
            const hasPrint = py.count(/print\s*\(/g) >= 1;
            return hasVars && hasPrint ? { success: true, message: '🎉 Great job creating and using variables!' } : { success: false, message: 'Make sure you create 3 variables with = and use print().' };
          }
        }
      },
      {
        id: 'w1l3',
        title: 'Math with Python',
        description: 'Python as a super calculator',
        xp: 25,
        tags: ['basics', 'math'],
        content: `
          <h3>Python the Calculator 🧮</h3>
          <p>Python can do all kinds of math! Here are the operators:</p>
          <div class="code-block"><span class="code-func">print</span>(<span class="code-number">10</span> + <span class="code-number">5</span>)   <span class="code-comment"># Addition: 15</span>
<span class="code-func">print</span>(<span class="code-number">10</span> - <span class="code-number">3</span>)   <span class="code-comment"># Subtraction: 7</span>
<span class="code-func">print</span>(<span class="code-number">4</span> * <span class="code-number">6</span>)    <span class="code-comment"># Multiplication: 24</span>
<span class="code-func">print</span>(<span class="code-number">20</span> / <span class="code-number">4</span>)   <span class="code-comment"># Division: 5.0 (always gives a decimal)</span>
<span class="code-func">print</span>(<span class="code-number">17</span> // <span class="code-number">5</span>)  <span class="code-comment"># Integer division: 3 (drops the decimal)</span>
<span class="code-func">print</span>(<span class="code-number">2</span> ** <span class="code-number">3</span>)   <span class="code-comment"># Power: 8 (2 to the power of 3)</span>
<span class="code-func">print</span>(<span class="code-number">17</span> % <span class="code-number">5</span>)   <span class="code-comment"># Remainder (modulo): 2</span></div>
          <h3>Order of Operations ⚖️</h3>
          <p>Python follows math rules: <strong>parentheses first</strong>, then ** (power), then * / // %, then + -</p>
          <div class="code-block"><span class="code-func">print</span>(<span class="code-number">10</span> + <span class="code-number">5</span> * <span class="code-number">2</span>)    <span class="code-comment"># 20, not 30! (5*2 first, then +10)</span>
<span class="code-func">print</span>((<span class="code-number">10</span> + <span class="code-number">5</span>) * <span class="code-number">2</span>)  <span class="code-comment"># 30 (parentheses first!)</span></div>
          <h3>Math + Variables = Power! 💪</h3>
          <div class="code-block"><span class="code-comment"># Calculate the area of a rectangle</span>
width = <span class="code-number">8</span>
height = <span class="code-number">5</span>
area = width * height
<span class="code-func">print</span>(<span class="code-string">"Area:"</span>, area)  <span class="code-comment"># 40</span>

<span class="code-comment"># Convert temperature from Celsius to Fahrenheit</span>
celsius = <span class="code-number">30</span>
fahrenheit = (celsius * <span class="code-number">9</span>/<span class="code-number">5</span>) + <span class="code-number">32</span>
<span class="code-func">print</span>(celsius, <span class="code-string">"°C ="</span>, fahrenheit, <span class="code-string">"°F"</span>)</div>
        `,
        challenge: {
          prompt: 'Write a program that calculates the area of a triangle. Create variables for base and height, then calculate area = (base * height) / 2 and print the result.',
          hint: 'area = (base * height) / 2',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasCalc = py.has('*') && py.has('/');
            const hasPrint = py.count(/print\s*\(/g) >= 1;
            return hasCalc && hasPrint ? { success: true, message: '🎉 Math wizard! You calculated the triangle area!' } : { success: false, message: 'Use multiplication (*) and division (/) to calculate the area, then print it.' };
          }
        }
      },
      {
        id: 'w1l4',
        title: 'Getting User Input',
        description: 'Make interactive programs',
        xp: 25,
        tags: ['basics', 'input'],
        content: `
          <h3>Talking to the User 💬</h3>
          <p>You can ask the user for information using <strong>input()</strong>:</p>
          <div class="code-block">name = <span class="code-func">input</span>(<span class="code-string">"What is your name? "</span>)
<span class="code-func">print</span>(<span class="code-string">"Hello,"</span>, name, <span class="code-string">"!"</span>)</div>
          <p><strong>Important:</strong> input() always gives you text (a string). To use it as a number, convert it:</p>
          <div class="code-block">age_text = <span class="code-func">input</span>(<span class="code-string">"How old are you? "</span>)
age = <span class="code-func">int</span>(age_text)  <span class="code-comment"># Convert text to number</span>
next_year = age + <span class="code-number">1</span>
<span class="code-func">print</span>(<span class="code-string">"Next year you'll be"</span>, next_year)

<span class="code-comment"># Shortcut - do it in one line!</span>
height = <span class="code-func">int</span>(<span class="code-func">input</span>(<span class="code-string">"Your height in cm? "</span>))
<span class="code-func">print</span>(<span class="code-string">"That's"</span>, height / <span class="code-number">100</span>, <span class="code-string">"meters!"</span>)</div>
          <h3>Watch Out! ⚠️</h3>
          <p>If the user types something that isn't a number and you try to convert it with <strong>int()</strong>, Python throws a <strong>ValueError</strong>:</p>
          <div class="code-block"><span class="code-comment"># This would crash!</span>
<span class="code-comment"># int("hello")  → ValueError: invalid literal</span>

<span class="code-comment"># Always make sure you're converting actual numbers</span>
age = <span class="code-func">int</span>(<span class="code-string">"13"</span>)    <span class="code-comment"># Works! "13" is a number as text</span>
<span class="code-comment"># int("thirteen") → ValueError! Not a number</span></div>
        `,
        challenge: {
          prompt: 'Create a program that asks for the user\'s name and favorite number. Then print a message using both. (In the playground, use variables instead of input() since we can\'t type in real-time.)',
          hint: 'Use name = "SomeName" and number = 7 as placeholders.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasVars = py.count(/(?<!=)=(?!=)/g) >= 2;
            const hasPrint = py.count(/print\s*\(/g) >= 1;
            return hasVars && hasPrint ? { success: true, message: '🎉 Interactive programs unlocked!' } : { success: false, message: 'Create at least 2 variables and use print().' };
          }
        }
      },
      {
        id: 'w1l5',
        title: 'Week 1 Mini Project: Bio Generator',
        description: 'Build a fun bio card generator',
        xp: 50,
        tags: ['project', 'basics'],
        content: `
          <h3>🚀 Mini Project: Bio Card Generator</h3>
          <p>Let's combine everything from this week! Build a program that creates a cool bio card.</p>
          <div class="code-block"><span class="code-comment"># Bio Card Generator</span>
name = <span class="code-string">"Alex"</span>
age = <span class="code-number">13</span>
hobby = <span class="code-string">"coding"</span>
fav_game = <span class="code-string">"Minecraft"</span>
fav_subject = <span class="code-string">"Math"</span>

<span class="code-func">print</span>(<span class="code-string">"╔══════════════════════════╗"</span>)
<span class="code-func">print</span>(<span class="code-string">"║     🧙 BIO CARD 🧙      ║"</span>)
<span class="code-func">print</span>(<span class="code-string">"╠══════════════════════════╣"</span>)
<span class="code-func">print</span>(<span class="code-string">"║ Name:"</span>, name)
<span class="code-func">print</span>(<span class="code-string">"║ Age:"</span>, age)
<span class="code-func">print</span>(<span class="code-string">"║ Hobby:"</span>, hobby)
<span class="code-func">print</span>(<span class="code-string">"║ Game:"</span>, fav_game)
<span class="code-func">print</span>(<span class="code-string">"║ Subject:"</span>, fav_subject)
<span class="code-func">print</span>(<span class="code-string">"║"</span>)
<span class="code-func">print</span>(<span class="code-string">"║ Years until 18:"</span>, <span class="code-number">18</span> - age)
<span class="code-func">print</span>(<span class="code-string">"╚══════════════════════════╝"</span>)</div>
          <h3>Pro Tips 🔥</h3>
          <p><strong>String repetition:</strong> You can repeat text with *</p>
          <div class="code-block"><span class="code-func">print</span>(<span class="code-string">"Hi"</span> * <span class="code-number">3</span>)        <span class="code-comment"># HiHiHi</span>
<span class="code-func">print</span>(<span class="code-string">"="</span> * <span class="code-number">20</span>)       <span class="code-comment"># ==================== (great for borders!)</span></div>
          <p><strong>3 ways to include variables in print:</strong></p>
          <div class="code-block">name = <span class="code-string">"Alex"</span>
score = <span class="code-number">95</span>
<span class="code-comment"># Way 1: Commas (simplest)</span>
<span class="code-func">print</span>(<span class="code-string">"Score:"</span>, score)
<span class="code-comment"># Way 2: Concatenation (+) - must convert numbers!</span>
<span class="code-func">print</span>(<span class="code-string">"Hello "</span> + name)
<span class="code-comment"># Way 3: f-strings (most powerful!)</span>
<span class="code-func">print</span>(<span class="code-string">f"</span><span class="code-string">{name} scored {score} points!"</span>)</div>
          <p>Now make your own version! Add more fields, change the design, make it yours!</p>
        `,
        challenge: {
          prompt: 'Create YOUR OWN bio card with at least 5 variables and a formatted output using print(). Make it creative!',
          hint: 'Use variables for your info and print() with border characters to make it look cool.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const vars = py.count(/(?<!=)=(?!=)/g);
            const prints = py.count(/print\s*\(/g);
            return vars >= 5 && prints >= 5 ? { success: true, message: '🎉🚀 Amazing! Your first project is complete! +50 XP!' } : { success: false, message: 'Use at least 5 variables and 5 print() statements to make your bio card.' };
          }
        }
      }
    ]
  },
  {
    id: 2,
    title: 'Week 2: Decisions & Loops',
    description: 'if/else statements and loops',
    lessons: [
      {
        id: 'w2l1',
        title: 'If/Else - Making Decisions',
        description: 'Teach your program to think',
        xp: 25,
        tags: ['logic', 'if-else'],
        content: `
          <h3>Making Choices 🤔</h3>
          <p>Programs need to make decisions! We use <strong>if</strong>, <strong>elif</strong>, and <strong>else</strong>:</p>
          <div class="code-block">score = <span class="code-number">85</span>

<span class="code-keyword">if</span> score >= <span class="code-number">90</span>:
    <span class="code-func">print</span>(<span class="code-string">"A - Excellent! 🌟"</span>)
<span class="code-keyword">elif</span> score >= <span class="code-number">80</span>:
    <span class="code-func">print</span>(<span class="code-string">"B - Great job! 👍"</span>)
<span class="code-keyword">elif</span> score >= <span class="code-number">70</span>:
    <span class="code-func">print</span>(<span class="code-string">"C - Good work!"</span>)
<span class="code-keyword">else</span>:
    <span class="code-func">print</span>(<span class="code-string">"Keep practicing!"</span>)</div>
          <h3>Comparison Operators</h3>
          <div class="code-block"><span class="code-comment"># == equals    != not equal</span>
<span class="code-comment"># >  greater   <  less than</span>
<span class="code-comment"># >= greater or equal  <= less or equal</span>

age = <span class="code-number">13</span>
<span class="code-keyword">if</span> age >= <span class="code-number">13</span>:
    <span class="code-func">print</span>(<span class="code-string">"You can join LevelUp Academy!"</span>)

password = <span class="code-string">"python123"</span>
<span class="code-keyword">if</span> password == <span class="code-string">"python123"</span>:
    <span class="code-func">print</span>(<span class="code-string">"Access granted! 🔓"</span>)
<span class="code-keyword">else</span>:
    <span class="code-func">print</span>(<span class="code-string">"Wrong password! 🔒"</span>)</div>
          <h3>Combining Conditions: and, or, not</h3>
          <div class="code-block">age = <span class="code-number">15</span>
has_ticket = <span class="code-keyword">True</span>

<span class="code-comment"># and - BOTH must be true</span>
<span class="code-keyword">if</span> age >= <span class="code-number">13</span> <span class="code-keyword">and</span> has_ticket:
    <span class="code-func">print</span>(<span class="code-string">"Welcome to the movie!"</span>)

<span class="code-comment"># or - at least ONE must be true</span>
<span class="code-keyword">if</span> age < <span class="code-number">5</span> <span class="code-keyword">or</span> age > <span class="code-number">65</span>:
    <span class="code-func">print</span>(<span class="code-string">"Free ticket!"</span>)

<span class="code-comment"># not - flips True to False</span>
<span class="code-keyword">if</span> <span class="code-keyword">not</span> has_ticket:
    <span class="code-func">print</span>(<span class="code-string">"Buy a ticket first!"</span>)</div>
        `,
        challenge: {
          prompt: 'Write a program that checks a temperature variable. If temp > 30, print "Hot!". If temp is between 15-30, print "Nice!". Otherwise print "Cold!".',
          hint: 'Use if, elif, else with comparison operators.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasIf = py.has('if');
            const hasElse = py.has('else');
            const hasPrint = py.count(/print\s*\(/g) >= 1;
            return hasIf && hasElse && hasPrint ? { success: true, message: '🎉 Decision master! Your program can think!' } : { success: false, message: 'Use if/elif/else to check the temperature.' };
          }
        }
      },
      {
        id: 'w2l2',
        title: 'For Loops - Repeat!',
        description: 'Do things over and over',
        xp: 30,
        tags: ['loops', 'for'],
        content: `
          <h3>Loops - Doing Things Repeatedly 🔄</h3>
          <p>A <strong>for loop</strong> repeats code a certain number of times. The <strong>range()</strong> function generates numbers:</p>
          <div class="code-block"><span class="code-comment"># range(stop) - starts at 0</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">5</span>):
    <span class="code-func">print</span>(i)  <span class="code-comment"># prints 0, 1, 2, 3, 4 (NOT 5!)</span>

<span class="code-comment"># range(start, stop) - you pick the start</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, <span class="code-number">6</span>):
    <span class="code-func">print</span>(i)  <span class="code-comment"># prints 1, 2, 3, 4, 5</span>

<span class="code-comment"># range(start, stop, step) - skip by step</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">2</span>, <span class="code-number">10</span>, <span class="code-number">3</span>):
    <span class="code-func">print</span>(i)  <span class="code-comment"># prints 2, 5, 8 (goes up by 3)</span>

<span class="code-comment"># Countdown with negative step!</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">5</span>, <span class="code-number">0</span>, -<span class="code-number">1</span>):
    <span class="code-func">print</span>(i)
<span class="code-func">print</span>(<span class="code-string">"Blast off! 🚀"</span>)

<span class="code-comment"># Loop through a list</span>
fruits = [<span class="code-string">"apple"</span>, <span class="code-string">"banana"</span>, <span class="code-string">"cherry"</span>]
<span class="code-keyword">for</span> fruit <span class="code-keyword">in</span> fruits:
    <span class="code-func">print</span>(<span class="code-string">"I like"</span>, fruit)</div>
          <h3>Fun with Loops 🎨</h3>
          <div class="code-block"><span class="code-comment"># Draw a triangle with stars</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, <span class="code-number">6</span>):
    <span class="code-func">print</span>(<span class="code-string">"*"</span> * i)

<span class="code-comment"># Multiplication table</span>
number = <span class="code-number">7</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, <span class="code-number">11</span>):
    <span class="code-func">print</span>(number, <span class="code-string">"x"</span>, i, <span class="code-string">"="</span>, number * i)</div>
        `,
        challenge: {
          prompt: 'Write a program that prints a multiplication table for the number 5 (5x1=5, 5x2=10, ... up to 5x10=50).',
          hint: 'Use for i in range(1, 11) and multiply 5 * i.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasFor = py.has('for');
            const hasRange = py.has('range');
            const hasMult = py.has('*');
            return hasFor && hasRange && hasMult ? { success: true, message: '🎉 Loop master! Multiplication tables are easy now!' } : { success: false, message: 'Use a for loop with range() and the * operator.' };
          }
        }
      },
      {
        id: 'w2l3',
        title: 'While Loops',
        description: 'Loop until a condition is met',
        xp: 30,
        tags: ['loops', 'while'],
        content: `
          <h3>While Loops ♻️</h3>
          <p>A <strong>while loop</strong> keeps going as long as a condition is true:</p>
          <div class="code-block"><span class="code-comment"># Count up to 5</span>
count = <span class="code-number">1</span>
<span class="code-keyword">while</span> count <= <span class="code-number">5</span>:
    <span class="code-func">print</span>(<span class="code-string">"Count:"</span>, count)
    count = count + <span class="code-number">1</span>

<span class="code-comment"># Guessing game simulation</span>
secret = <span class="code-number">7</span>
guess = <span class="code-number">0</span>
attempts = <span class="code-number">0</span>
guesses = [<span class="code-number">3</span>, <span class="code-number">9</span>, <span class="code-number">5</span>, <span class="code-number">7</span>]
<span class="code-keyword">while</span> guess != secret:
    guess = guesses[attempts]
    attempts = attempts + <span class="code-number">1</span>
    <span class="code-keyword">if</span> guess < secret:
        <span class="code-func">print</span>(guess, <span class="code-string">"- Too low!"</span>)
    <span class="code-keyword">elif</span> guess > secret:
        <span class="code-func">print</span>(guess, <span class="code-string">"- Too high!"</span>)
    <span class="code-keyword">else</span>:
        <span class="code-func">print</span>(guess, <span class="code-string">"- You got it in"</span>, attempts, <span class="code-string">"tries!"</span>)</div>
          <h3>Break & Continue 🛑</h3>
          <p><strong>break</strong> exits the loop immediately. <strong>continue</strong> skips to the next round:</p>
          <div class="code-block"><span class="code-comment"># break - stop the loop early</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, <span class="code-number">100</span>):
    <span class="code-keyword">if</span> i == <span class="code-number">5</span>:
        <span class="code-func">print</span>(<span class="code-string">"Found 5, stopping!"</span>)
        <span class="code-keyword">break</span>    <span class="code-comment"># exits the loop completely</span>
    <span class="code-func">print</span>(i)  <span class="code-comment"># prints 1, 2, 3, 4</span>

<span class="code-comment"># continue - skip this round</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, <span class="code-number">6</span>):
    <span class="code-keyword">if</span> i == <span class="code-number">3</span>:
        <span class="code-keyword">continue</span>  <span class="code-comment"># skips 3</span>
    <span class="code-func">print</span>(i)  <span class="code-comment"># prints 1, 2, 4, 5</span></div>
          <p><strong>while True</strong> with break is a common pattern for "keep going until something happens":</p>
          <div class="code-block"><span class="code-keyword">while</span> <span class="code-keyword">True</span>:
    answer = <span class="code-func">input</span>(<span class="code-string">"Type 'quit' to exit: "</span>)
    <span class="code-keyword">if</span> answer == <span class="code-string">"quit"</span>:
        <span class="code-keyword">break</span>
    <span class="code-func">print</span>(<span class="code-string">"You typed:"</span>, answer)</div>
        `,
        challenge: {
          prompt: 'Write a while loop that starts at 100 and counts down by 10s (100, 90, 80... 10). Print each number.',
          hint: 'Start with num = 100, loop while num >= 10, subtract 10 each time.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasWhile = py.has('while');
            const hasPrint = py.count(/print\s*\(/g) >= 1;
            return hasWhile && hasPrint ? { success: true, message: '🎉 While loop pro! Countdown complete!' } : { success: false, message: 'Use a while loop and print().' };
          }
        }
      },
      {
        id: 'w2l4',
        title: 'Lists - Collections of Data',
        description: 'Store multiple items together',
        xp: 30,
        tags: ['data', 'lists'],
        content: `
          <h3>Lists 📋</h3>
          <p>Lists let you store multiple items in one variable:</p>
          <div class="code-block"><span class="code-comment"># Creating lists</span>
colors = [<span class="code-string">"red"</span>, <span class="code-string">"blue"</span>, <span class="code-string">"green"</span>, <span class="code-string">"yellow"</span>]
scores = [<span class="code-number">95</span>, <span class="code-number">87</span>, <span class="code-number">92</span>, <span class="code-number">78</span>, <span class="code-number">100</span>]

<span class="code-comment"># Access items (counting starts at 0!)</span>
<span class="code-func">print</span>(colors[<span class="code-number">0</span>])    <span class="code-comment"># "red" (first item)</span>
<span class="code-func">print</span>(colors[<span class="code-number">2</span>])    <span class="code-comment"># "green"</span>
<span class="code-func">print</span>(colors[<span class="code-number">-1</span>])   <span class="code-comment"># "yellow" (last item!)</span>
<span class="code-func">print</span>(colors[<span class="code-number">-2</span>])   <span class="code-comment"># "green" (second to last)</span>

<span class="code-comment"># Add and remove</span>
colors.append(<span class="code-string">"purple"</span>)
colors.remove(<span class="code-string">"red"</span>)

<span class="code-comment"># Useful list tricks</span>
<span class="code-func">print</span>(<span class="code-func">len</span>(scores))       <span class="code-comment"># How many items: 5</span>
<span class="code-func">print</span>(<span class="code-func">max</span>(scores))       <span class="code-comment"># Highest: 100</span>
<span class="code-func">print</span>(<span class="code-func">min</span>(scores))       <span class="code-comment"># Lowest: 78</span>
<span class="code-func">print</span>(<span class="code-func">sum</span>(scores))       <span class="code-comment"># Total: 452</span>

<span class="code-comment"># Loop through a list</span>
<span class="code-keyword">for</span> color <span class="code-keyword">in</span> colors:
    <span class="code-func">print</span>(<span class="code-string">"I see"</span>, color)</div>
        `,
        challenge: {
          prompt: 'Create a list of 5 numbers. Print the list, its length, the sum, and the average (sum divided by length).',
          hint: 'average = sum(my_list) / len(my_list)',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasList = py.has('[') && py.has(']');
            const hasLen = py.has('len');
            const hasSum = py.has('sum');
            return hasList && hasLen && hasSum ? { success: true, message: '🎉 List master! You can handle collections of data!' } : { success: false, message: 'Create a list with [], use len() and sum().' };
          }
        }
      },
      {
        id: 'w2l5',
        title: 'Week 2 Project: Number Guessing Game',
        description: 'Build a complete guessing game',
        xp: 60,
        tags: ['project', 'logic', 'loops'],
        content: `
          <h3>🚀 Project: Number Guessing Game</h3>
          <p>Let's build a number guessing game that uses everything from this week!</p>
          <h3>Importing Modules 📦</h3>
          <p>Python has extra tools called <strong>modules</strong>. To use one, you write <strong>import</strong> at the top of your code. The <strong>random</strong> module gives you random numbers:</p>
          <div class="code-block"><span class="code-keyword">import</span> random  <span class="code-comment"># must be at the top of your file!</span>

<span class="code-func">print</span>(random.randint(<span class="code-number">1</span>, <span class="code-number">10</span>))   <span class="code-comment"># random number from 1 to 10</span>
<span class="code-func">print</span>(random.choice([<span class="code-string">"heads"</span>, <span class="code-string">"tails"</span>]))  <span class="code-comment"># random pick from a list</span></div>
          <h3>Putting It All Together</h3>
          <div class="code-block"><span class="code-keyword">import</span> random

<span class="code-comment"># Generate a secret number between 1 and 20</span>
secret = random.randint(<span class="code-number">1</span>, <span class="code-number">20</span>)
attempts = <span class="code-number">0</span>
max_attempts = <span class="code-number">5</span>
guesses = []

<span class="code-func">print</span>(<span class="code-string">"🎯 Guess the number (1-20)"</span>)
<span class="code-func">print</span>(<span class="code-string">"You have"</span>, max_attempts, <span class="code-string">"attempts!"</span>)

<span class="code-comment"># Simulate some guesses</span>
player_guesses = [<span class="code-number">10</span>, <span class="code-number">15</span>, <span class="code-number">12</span>, <span class="code-number">8</span>, secret]

<span class="code-keyword">for</span> guess <span class="code-keyword">in</span> player_guesses:
    attempts += <span class="code-number">1</span>
    guesses.append(guess)

    <span class="code-keyword">if</span> guess == secret:
        <span class="code-func">print</span>(<span class="code-string">"🎉 You guessed"</span>, secret, <span class="code-string">"in"</span>, attempts, <span class="code-string">"tries!"</span>)
        <span class="code-keyword">break</span>
    <span class="code-keyword">elif</span> guess < secret:
        <span class="code-func">print</span>(guess, <span class="code-string">"⬆️ Higher!"</span>)
    <span class="code-keyword">else</span>:
        <span class="code-func">print</span>(guess, <span class="code-string">"⬇️ Lower!"</span>)

    <span class="code-keyword">if</span> attempts >= max_attempts:
        <span class="code-func">print</span>(<span class="code-string">"Game over! The number was"</span>, secret)

<span class="code-func">print</span>(<span class="code-string">"Your guesses:"</span>, guesses)</div>
        `,
        challenge: {
          prompt: 'Create your own version of the guessing game! Use a list of guesses, a while or for loop, and if/else to check each guess.',
          hint: 'Use a secret number, loop through guesses, compare with if/elif/else.',
          validator: (code) => {
            const py = pyCheck(code);
            if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR };
            const hasLoop = py.has('for') || py.has('while');
            const hasIf = py.has('if');
            const hasList = py.has('[');
            return hasLoop && hasIf && hasList ? { success: true, message: '🎉🚀 Incredible! You built a guessing game! +60 XP!' } : { success: false, message: 'Use a loop, if/else, and a list of guesses.' };
          }
        }
      }
    ]
  },
  {
    id: 3,
    title: 'Week 3: Functions & Strings',
    description: 'Reusable code blocks and text manipulation',
    lessons: [
      {
        id: 'w3l1', title: 'Functions - Reusable Code', description: 'Create your own commands', xp: 30, tags: ['functions'],
        content: `<h3>Functions 🔧</h3><p>Functions let you package code into reusable blocks:</p>
          <div class="code-block"><span class="code-keyword">def</span> <span class="code-func">greet</span>(name):
    <span class="code-func">print</span>(<span class="code-string">"Hello,"</span>, name, <span class="code-string">"! Welcome!"</span>)

<span class="code-func">greet</span>(<span class="code-string">"Alex"</span>)
<span class="code-func">greet</span>(<span class="code-string">"Sam"</span>)

<span class="code-keyword">def</span> <span class="code-func">add</span>(a, b):
    <span class="code-keyword">return</span> a + b

result = <span class="code-func">add</span>(<span class="code-number">5</span>, <span class="code-number">3</span>)
<span class="code-func">print</span>(<span class="code-string">"5 + 3 ="</span>, result)</div>`,
        challenge: { prompt: 'Create a function called "calculate_area" that takes width and height as parameters and returns width * height. Call it with different values.', hint: 'def calculate_area(w, h): return w * h',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') ? { success: true, message: '🎉 Function creator! Your code is reusable!' } : { success: false, message: 'Use def to create a function with return.' }; } }
      },
      {
        id: 'w3l2', title: 'More Functions & Scope', description: 'Default values and scope rules', xp: 30, tags: ['functions'],
        content: `<h3>Function Power-ups ⚡</h3>
          <div class="code-block"><span class="code-comment"># Default values</span>
<span class="code-keyword">def</span> <span class="code-func">power</span>(base, exp=<span class="code-number">2</span>):
    <span class="code-keyword">return</span> base ** exp

<span class="code-func">print</span>(<span class="code-func">power</span>(<span class="code-number">5</span>))      <span class="code-comment"># 25 (uses default exp=2)</span>
<span class="code-func">print</span>(<span class="code-func">power</span>(<span class="code-number">2</span>, <span class="code-number">8</span>))   <span class="code-comment"># 256</span>

<span class="code-comment"># Functions calling other functions</span>
<span class="code-keyword">def</span> <span class="code-func">is_even</span>(n):
    <span class="code-keyword">return</span> n % <span class="code-number">2</span> == <span class="code-number">0</span>

<span class="code-keyword">def</span> <span class="code-func">count_evens</span>(numbers):
    count = <span class="code-number">0</span>
    <span class="code-keyword">for</span> n <span class="code-keyword">in</span> numbers:
        <span class="code-keyword">if</span> <span class="code-func">is_even</span>(n):
            count += <span class="code-number">1</span>
    <span class="code-keyword">return</span> count

<span class="code-func">print</span>(<span class="code-func">count_evens</span>([<span class="code-number">1</span>,<span class="code-number">2</span>,<span class="code-number">3</span>,<span class="code-number">4</span>,<span class="code-number">5</span>,<span class="code-number">6</span>]))  <span class="code-comment"># 3</span></div>`,
        challenge: { prompt: 'Create a function that takes a list of numbers and returns only the even ones. Hint: create a new list and append even numbers.', hint: 'def get_evens(nums): result = []; for n in nums: if n % 2 == 0: result.append(n); return result',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('%') ? { success: true, message: '🎉 Advanced functions unlocked!' } : { success: false, message: 'Create a function using def, use % to check even numbers.' }; } }
      },
      {
        id: 'w3l3', title: 'String Magic', description: 'Manipulate text like a pro', xp: 25, tags: ['strings'],
        content: `<h3>String Superpowers 🪄</h3>
          <div class="code-block">message = <span class="code-string">"Hello Python World"</span>

<span class="code-func">print</span>(message.upper())       <span class="code-comment"># "HELLO PYTHON WORLD"</span>
<span class="code-func">print</span>(message.lower())       <span class="code-comment"># "hello python world"</span>
<span class="code-func">print</span>(message.replace(<span class="code-string">"Python"</span>, <span class="code-string">"Coding"</span>))
<span class="code-func">print</span>(message.split())       <span class="code-comment"># ["Hello", "Python", "World"]</span>
<span class="code-func">print</span>(<span class="code-func">len</span>(message))           <span class="code-comment"># 18</span>

<span class="code-comment"># f-strings (formatted strings) - the cool way!</span>
name = <span class="code-string">"Alex"</span>
score = <span class="code-number">95</span>
<span class="code-func">print</span>(<span class="code-string">f"Player <span class="code-number">{name}</span> scored <span class="code-number">{score}</span> points!"</span>)
<span class="code-func">print</span>(<span class="code-string">f"Double score: <span class="code-number">{score * 2}</span>"</span>)</div>`,
        challenge: { prompt: 'Create a string with your full name. Print it in UPPER case, lower case, reversed, and count the letters (not spaces).', hint: 'reversed: name[::-1], count without spaces: len(name.replace(" ", ""))',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('.upper') || py.has('.lower') ? { success: true, message: '🎉 String wizard! Text bends to your will!' } : { success: false, message: 'Use .upper() and .lower() on your string.' }; } }
      },
      {
        id: 'w3l4', title: 'Dictionaries', description: 'Key-value pairs for organized data', xp: 30, tags: ['data', 'dictionaries'],
        content: `<h3>Dictionaries 📖</h3><p>Dictionaries store data with labels (keys):</p>
          <div class="code-block">player = {
    <span class="code-string">"name"</span>: <span class="code-string">"Alex"</span>,
    <span class="code-string">"level"</span>: <span class="code-number">5</span>,
    <span class="code-string">"health"</span>: <span class="code-number">100</span>,
    <span class="code-string">"items"</span>: [<span class="code-string">"sword"</span>, <span class="code-string">"shield"</span>]
}

<span class="code-func">print</span>(player[<span class="code-string">"name"</span>])
player[<span class="code-string">"level"</span>] = <span class="code-number">6</span>
player[<span class="code-string">"gold"</span>] = <span class="code-number">50</span>

<span class="code-keyword">for</span> key, value <span class="code-keyword">in</span> player.items():
    <span class="code-func">print</span>(<span class="code-string">f"<span class="code-number">{key}</span>: <span class="code-number">{value}</span>"</span>)</div>`,
        challenge: { prompt: 'Create a dictionary for a game character with at least 4 properties. Print each property nicely formatted.', hint: 'character = {"name": "...", "class": "...", "hp": 100, "attack": 15}',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('{') && py.has(':') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '🎉 Dictionary master! Organized data FTW!' } : { success: false, message: 'Create a dictionary with {} and key:value pairs, and use print().' }; } }
      },
      {
        id: 'w3l5', title: 'Week 3 Project: Quiz Game', description: 'Build an interactive quiz', xp: 60, tags: ['project', 'functions', 'dictionaries'],
        content: `<h3>🚀 Project: Quiz Game</h3><p>Build a quiz game using functions, lists, and dictionaries!</p>
          <div class="code-block">questions = [
    {<span class="code-string">"q"</span>: <span class="code-string">"What planet is closest to the Sun?"</span>,
     <span class="code-string">"options"</span>: [<span class="code-string">"Venus"</span>, <span class="code-string">"Mercury"</span>, <span class="code-string">"Mars"</span>],
     <span class="code-string">"answer"</span>: <span class="code-number">1</span>},
    {<span class="code-string">"q"</span>: <span class="code-string">"What is 2^10?"</span>,
     <span class="code-string">"options"</span>: [<span class="code-string">"512"</span>, <span class="code-string">"1024"</span>, <span class="code-string">"2048"</span>],
     <span class="code-string">"answer"</span>: <span class="code-number">1</span>},
]

<span class="code-keyword">def</span> <span class="code-func">run_quiz</span>(questions):
    score = <span class="code-number">0</span>
    <span class="code-keyword">for</span> i, q <span class="code-keyword">in</span> <span class="code-func">enumerate</span>(questions):
        <span class="code-func">print</span>(<span class="code-string">f"\\nQ{i+1}: {q['q']}"</span>)
        <span class="code-keyword">for</span> j, opt <span class="code-keyword">in</span> <span class="code-func">enumerate</span>(q[<span class="code-string">"options"</span>]):
            <span class="code-func">print</span>(<span class="code-string">f"  {j}. {opt}"</span>)
        <span class="code-comment"># Simulate answer</span>
        answer = q[<span class="code-string">"answer"</span>]
        <span class="code-keyword">if</span> answer == q[<span class="code-string">"answer"</span>]:
            score += <span class="code-number">1</span>
            <span class="code-func">print</span>(<span class="code-string">"✅ Correct!"</span>)
    <span class="code-func">print</span>(<span class="code-string">f"\\nScore: {score}/{len(questions)}"</span>)

<span class="code-func">run_quiz</span>(questions)</div>`,
        challenge: { prompt: 'Create your own quiz with at least 3 questions about math, science, or any subject you like! Use dictionaries for questions and a function to run the quiz.', hint: 'Follow the pattern above but with your own questions.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('{') && py.count(/\{/g) >= 3 ? { success: true, message: '🎉🚀 Quiz Game complete! You built something awesome! +60 XP!' } : { success: false, message: 'Create a function and at least 3 question dictionaries.' }; } }
      }
    ]
  },
  {
    id: 4,
    title: 'Week 4: Game Building',
    description: 'Build interactive games with Python',
    lessons: [
      {
        id: 'w4l1', title: 'Random & Game Logic', description: 'Add randomness to your programs', xp: 30, tags: ['games', 'random'],
        content: `<h3>Random - Adding Surprise! 🎲</h3>
          <div class="code-block"><span class="code-keyword">import</span> random

<span class="code-comment"># Random number between 1 and 10</span>
num = random.randint(<span class="code-number">1</span>, <span class="code-number">10</span>)

<span class="code-comment"># Random choice from a list</span>
moves = [<span class="code-string">"rock"</span>, <span class="code-string">"paper"</span>, <span class="code-string">"scissors"</span>]
computer = random.choice(moves)

<span class="code-comment"># Shuffle a list</span>
cards = [<span class="code-number">1</span>,<span class="code-number">2</span>,<span class="code-number">3</span>,<span class="code-number">4</span>,<span class="code-number">5</span>]
random.shuffle(cards)
<span class="code-func">print</span>(cards)</div>`,
        challenge: { prompt: 'Create a Rock-Paper-Scissors game where the computer picks randomly and you compare with a player choice.', hint: 'Use random.choice() for computer move, then compare with if/elif.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('random') && py.has('if') ? { success: true, message: '🎉 Random master! Games are more fun now!' } : { success: false, message: 'Use random and if/else for game logic.' }; } }
      },
      {
        id: 'w4l2', title: 'Text Adventure Basics', description: 'Create story-driven games', xp: 35, tags: ['games', 'adventure'],
        content: `<h3>Text Adventures 🗺️</h3>
          <div class="code-block"><span class="code-keyword">def</span> <span class="code-func">start_adventure</span>():
    <span class="code-func">print</span>(<span class="code-string">"You stand at a crossroads in a dark forest."</span>)
    <span class="code-func">print</span>(<span class="code-string">"Left: A glowing cave"</span>)
    <span class="code-func">print</span>(<span class="code-string">"Right: A mysterious tower"</span>)

    choice = <span class="code-string">"left"</span>  <span class="code-comment"># simulated input</span>
    <span class="code-keyword">if</span> choice == <span class="code-string">"left"</span>:
        <span class="code-func">cave_room</span>()
    <span class="code-keyword">else</span>:
        <span class="code-func">tower_room</span>()

<span class="code-keyword">def</span> <span class="code-func">cave_room</span>():
    <span class="code-func">print</span>(<span class="code-string">"\\nThe cave glows with crystals!"</span>)
    <span class="code-func">print</span>(<span class="code-string">"You found a treasure chest! 💎"</span>)

<span class="code-keyword">def</span> <span class="code-func">tower_room</span>():
    <span class="code-func">print</span>(<span class="code-string">"\\nThe tower has a dragon! 🐉"</span>)
    <span class="code-func">print</span>(<span class="code-string">"Roll for combat..."</span>)

<span class="code-func">start_adventure</span>()</div>`,
        challenge: { prompt: 'Create a mini text adventure with at least 3 rooms/choices. Use functions for each room.', hint: 'Create a function for each room, use if/else for choices.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; const defs = py.count(/def /g); return defs >= 3 ? { success: true, message: '🎉 Adventure creator! Your story comes alive!' } : { success: false, message: 'Create at least 3 functions (rooms) for your adventure.' }; } }
      },
      {
        id: 'w4l3', title: 'Math Battle Game', description: 'Academic game - Math challenges', xp: 35, tags: ['games', 'math', 'academic'],
        content: `<h3>Math Battle! 🧮⚔️</h3><p>Games + Learning = Awesome!</p>
          <div class="code-block"><span class="code-keyword">import</span> random

<span class="code-keyword">def</span> <span class="code-func">math_battle</span>(rounds=<span class="code-number">5</span>):
    score = <span class="code-number">0</span>
    <span class="code-keyword">for</span> r <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, rounds+<span class="code-number">1</span>):
        a = random.randint(<span class="code-number">1</span>, <span class="code-number">20</span>)
        b = random.randint(<span class="code-number">1</span>, <span class="code-number">20</span>)
        op = random.choice([<span class="code-string">"+"</span>, <span class="code-string">"-"</span>, <span class="code-string">"*"</span>])

        <span class="code-keyword">if</span> op == <span class="code-string">"+"</span>: answer = a + b
        <span class="code-keyword">elif</span> op == <span class="code-string">"-"</span>: answer = a - b
        <span class="code-keyword">else</span>: answer = a * b

        <span class="code-func">print</span>(<span class="code-string">f"Round {r}: {a} {op} {b} = ?"</span>)
        player = answer  <span class="code-comment"># simulated correct answer</span>
        <span class="code-keyword">if</span> player == answer:
            <span class="code-func">print</span>(<span class="code-string">"✅ Correct!"</span>)
            score += <span class="code-number">1</span>
    <span class="code-func">print</span>(<span class="code-string">f"\\nFinal: {score}/{rounds}"</span>)

<span class="code-func">math_battle</span>()</div>`,
        challenge: { prompt: 'Create a math game that generates random problems. Include +, -, and * operations. Track the score!', hint: 'Use random.randint for numbers, random.choice for operations.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('random') && py.has('def') ? { success: true, message: '🎉 Math + Code = Genius! Academic game built!' } : { success: false, message: 'Use random and def to create your math game.' }; } }
      },
      {
        id: 'w4l4', title: 'Science Simulator', description: 'Physics & science in code', xp: 35, tags: ['games', 'science', 'academic'],
        content: `<h3>Science Simulator 🔬</h3><p>Use Python to simulate physics and science!</p>
          <div class="code-block"><span class="code-comment"># Gravity simulator</span>
<span class="code-keyword">def</span> <span class="code-func">drop_ball</span>(height, gravity=<span class="code-number">9.8</span>):
    time = <span class="code-number">0</span>
    velocity = <span class="code-number">0</span>
    pos = height
    <span class="code-func">print</span>(<span class="code-string">f"Dropping ball from {height}m"</span>)
    <span class="code-keyword">while</span> pos > <span class="code-number">0</span>:
        time += <span class="code-number">0.5</span>
        velocity += gravity * <span class="code-number">0.5</span>
        pos -= velocity * <span class="code-number">0.5</span>
        <span class="code-keyword">if</span> pos < <span class="code-number">0</span>: pos = <span class="code-number">0</span>
        <span class="code-func">print</span>(<span class="code-string">f"  t={time:.1f}s | height={pos:.1f}m | speed={velocity:.1f}m/s"</span>)
    <span class="code-func">print</span>(<span class="code-string">f"Hit ground at {time:.1f} seconds!"</span>)

<span class="code-func">drop_ball</span>(<span class="code-number">50</span>)
<span class="code-func">print</span>()
<span class="code-func">drop_ball</span>(<span class="code-number">50</span>, <span class="code-number">1.6</span>)  <span class="code-comment"># Moon gravity!</span></div>`,
        challenge: { prompt: 'Create a simple physics simulator — maybe a bouncing ball, projectile motion, or planet orbit calculator.', hint: 'Use loops and math to simulate physical motion over time steps.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && (py.has('while') || py.has('for')) ? { success: true, message: '🎉 Science + Code! You simulated physics!' } : { success: false, message: 'Create a function with a loop to simulate physics.' }; } }
      },
      {
        id: 'w4l5', title: 'Week 4 Project: RPG Battle Game', description: 'Build a complete RPG battle', xp: 80, tags: ['project', 'games'],
        content: `<h3>🚀 Final Project: RPG Battle Game</h3><p>Combine EVERYTHING into an epic RPG battle!</p>
          <div class="code-block"><span class="code-keyword">import</span> random

<span class="code-keyword">def</span> <span class="code-func">create_character</span>(name, hp, attack):
    <span class="code-keyword">return</span> {<span class="code-string">"name"</span>: name, <span class="code-string">"hp"</span>: hp, <span class="code-string">"max_hp"</span>: hp, <span class="code-string">"attack"</span>: attack}

<span class="code-keyword">def</span> <span class="code-func">battle</span>(hero, enemy):
    <span class="code-func">print</span>(<span class="code-string">f"⚔️ {hero['name']} vs {enemy['name']}!"</span>)
    turn = <span class="code-number">1</span>
    <span class="code-keyword">while</span> hero[<span class="code-string">"hp"</span>] > <span class="code-number">0</span> <span class="code-keyword">and</span> enemy[<span class="code-string">"hp"</span>] > <span class="code-number">0</span>:
        <span class="code-comment"># Hero attacks</span>
        dmg = random.randint(<span class="code-number">1</span>, hero[<span class="code-string">"attack"</span>])
        enemy[<span class="code-string">"hp"</span>] -= dmg
        <span class="code-func">print</span>(<span class="code-string">f"  Turn {turn}: {hero['name']} deals {dmg} damage!"</span>)
        <span class="code-keyword">if</span> enemy[<span class="code-string">"hp"</span>] <= <span class="code-number">0</span>:
            <span class="code-func">print</span>(<span class="code-string">f"🏆 {hero['name']} wins!"</span>)
            <span class="code-keyword">break</span>
        <span class="code-comment"># Enemy attacks</span>
        dmg = random.randint(<span class="code-number">1</span>, enemy[<span class="code-string">"attack"</span>])
        hero[<span class="code-string">"hp"</span>] -= dmg
        <span class="code-func">print</span>(<span class="code-string">f"  Turn {turn}: {enemy['name']} deals {dmg} damage!"</span>)
        <span class="code-keyword">if</span> hero[<span class="code-string">"hp"</span>] <= <span class="code-number">0</span>:
            <span class="code-func">print</span>(<span class="code-string">f"💀 {enemy['name']} wins!"</span>)
        turn += <span class="code-number">1</span>

hero = <span class="code-func">create_character</span>(<span class="code-string">"Wizard"</span>, <span class="code-number">100</span>, <span class="code-number">20</span>)
dragon = <span class="code-func">create_character</span>(<span class="code-string">"Dragon"</span>, <span class="code-number">80</span>, <span class="code-number">25</span>)
<span class="code-func">battle</span>(hero, dragon)</div>`,
        challenge: { prompt: 'Create your own RPG battle game! Add at least 2 characters with stats, a battle function with random damage, and a winner announcement.', hint: 'Use dictionaries for characters, random for damage, while loop for battle.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; const defs = py.count(/def /g); return defs >= 2 && py.has('random') && py.has('while') ? { success: true, message: '🎉🚀🏆 EPIC! You built an RPG battle game! +80 XP! You truly leveled up!' } : { success: false, message: 'Create at least 2 functions, use random and a while loop for the battle.' }; } }
      }
    ]
  },
  {
    id: 5,
    title: 'Week 5: Error Handling & Files',
    description: 'Handle errors gracefully and work with files',
    lessons: [
      { id: 'w5l1', title: 'Try & Except', description: 'Handle errors like a pro', xp: 30, tags: ['errors'],
        content: `<h3>Error Handling 🛡️</h3><p>Programs can crash! Try/except catches errors gracefully:</p>
          <div class="code-block"><span class="code-keyword">try</span>:
    number = <span class="code-func">int</span>(<span class="code-string">"hello"</span>)
<span class="code-keyword">except</span> ValueError:
    <span class="code-func">print</span>(<span class="code-string">"That's not a number!"</span>)

<span class="code-keyword">try</span>:
    result = <span class="code-number">10</span> / <span class="code-number">0</span>
<span class="code-keyword">except</span> ZeroDivisionError:
    <span class="code-func">print</span>(<span class="code-string">"Can't divide by zero!"</span>)
<span class="code-keyword">finally</span>:
    <span class="code-func">print</span>(<span class="code-string">"Done!"</span>)</div>`,
        challenge: { prompt: 'Write a function that safely divides two numbers. Use try/except to handle ZeroDivisionError.', hint: 'def safe_divide(a, b): try: return a/b except: return "Error"',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('try') && py.has('except') ? { success: true, message: '🎉 Error handler! Your code is bulletproof!' } : { success: false, message: 'Use try/except blocks.' }; } } },
      { id: 'w5l2', title: 'List Comprehensions', description: 'Powerful one-liners', xp: 35, tags: ['advanced', 'lists'],
        content: `<h3>List Comprehensions ⚡</h3><p>Create lists in one line:</p>
          <div class="code-block"><span class="code-comment"># Regular way</span>
squares = []
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">10</span>):
    squares.append(i ** <span class="code-number">2</span>)

<span class="code-comment"># Comprehension way - same result!</span>
squares = [i ** <span class="code-number">2</span> <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">10</span>)]

<span class="code-comment"># With condition</span>
evens = [i <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">20</span>) <span class="code-keyword">if</span> i % <span class="code-number">2</span> == <span class="code-number">0</span>]
<span class="code-func">print</span>(evens)</div>`,
        challenge: { prompt: 'Create a list comprehension that gives all numbers from 1-50 that are divisible by both 3 and 5.', hint: '[x for x in range(1,51) if x % 3 == 0 and x % 5 == 0]',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('if') && py.has('[') ? { success: true, message: '🎉 Comprehension master! One-liners are powerful!' } : { success: false, message: 'Use a list comprehension with for and if.' }; } } },
      { id: 'w5l3', title: 'Working with Data', description: 'Process and analyze data', xp: 35, tags: ['data', 'analysis'],
        content: `<h3>Data Processing 📊</h3><p>Python is great for working with data!</p>
          <div class="code-block">students = [
    {<span class="code-string">"name"</span>: <span class="code-string">"Alex"</span>, <span class="code-string">"math"</span>: <span class="code-number">92</span>, <span class="code-string">"science"</span>: <span class="code-number">88</span>},
    {<span class="code-string">"name"</span>: <span class="code-string">"Sam"</span>, <span class="code-string">"math"</span>: <span class="code-number">78</span>, <span class="code-string">"science"</span>: <span class="code-number">95</span>},
    {<span class="code-string">"name"</span>: <span class="code-string">"Pat"</span>, <span class="code-string">"math"</span>: <span class="code-number">85</span>, <span class="code-string">"science"</span>: <span class="code-number">82</span>},
]

<span class="code-comment"># Calculate averages</span>
<span class="code-keyword">for</span> s <span class="code-keyword">in</span> students:
    avg = (s[<span class="code-string">"math"</span>] + s[<span class="code-string">"science"</span>]) / <span class="code-number">2</span>
    <span class="code-func">print</span>(<span class="code-string">f"{s['name']}: {avg}"</span>)</div>`,
        challenge: { prompt: 'Create a list of 5 student dictionaries with names and scores. Find and print the student with the highest average.', hint: 'Loop through, calculate average, track the max.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('{') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '🎉 Data analyst! You can process information!' } : { success: false, message: 'Create student dicts and loop to find the best.' }; } } },
      { id: 'w5l4', title: 'Sorting & Filtering', description: 'Organize your data', xp: 30, tags: ['data', 'algorithms'],
        content: `<h3>Sort & Filter 🔍</h3>
          <div class="code-block">scores = [<span class="code-number">45</span>, <span class="code-number">92</span>, <span class="code-number">78</span>, <span class="code-number">31</span>, <span class="code-number">88</span>, <span class="code-number">65</span>]

<span class="code-comment"># Sort ascending</span>
<span class="code-func">print</span>(<span class="code-func">sorted</span>(scores))

<span class="code-comment"># Sort descending</span>
<span class="code-func">print</span>(<span class="code-func">sorted</span>(scores, reverse=True))

<span class="code-comment"># Filter: keep only passing scores</span>
passing = [s <span class="code-keyword">for</span> s <span class="code-keyword">in</span> scores <span class="code-keyword">if</span> s >= <span class="code-number">60</span>]
<span class="code-func">print</span>(<span class="code-string">"Passing:"</span>, passing)</div>`,
        challenge: { prompt: 'Create a list of numbers. Sort them, filter out negatives, and find the median (middle value).', hint: 'Sort first, then use len()//2 to find the middle index.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('sorted') || py.has('.sort') ? { success: true, message: '🎉 Data organizer! Sorted and filtered!' } : { success: false, message: 'Use sorted() to sort your data.' }; } } },
      { id: 'w5l5', title: 'Week 5 Project: Grade Tracker', description: 'Build a grade management system', xp: 70, tags: ['project', 'data'],
        content: `<h3>🚀 Project: Grade Tracker App</h3><p>Build a system that tracks grades, calculates averages, and gives letter grades!</p>
          <div class="code-block"><span class="code-keyword">def</span> <span class="code-func">letter_grade</span>(score):
    <span class="code-keyword">if</span> score >= <span class="code-number">90</span>: <span class="code-keyword">return</span> <span class="code-string">"A"</span>
    <span class="code-keyword">elif</span> score >= <span class="code-number">80</span>: <span class="code-keyword">return</span> <span class="code-string">"B"</span>
    <span class="code-keyword">elif</span> score >= <span class="code-number">70</span>: <span class="code-keyword">return</span> <span class="code-string">"C"</span>
    <span class="code-keyword">else</span>: <span class="code-keyword">return</span> <span class="code-string">"F"</span>

<span class="code-keyword">def</span> <span class="code-func">report_card</span>(students):
    <span class="code-keyword">for</span> s <span class="code-keyword">in</span> students:
        avg = <span class="code-func">sum</span>(s[<span class="code-string">"grades"</span>]) / <span class="code-func">len</span>(s[<span class="code-string">"grades"</span>])
        <span class="code-func">print</span>(<span class="code-string">f"{s['name']}: Avg={avg:.1f} Grade={letter_grade(avg)}"</span>)</div>`,
        challenge: { prompt: 'Build a grade tracker with at least 3 students, each with multiple grades. Calculate averages, assign letter grades, and find the class average.', hint: 'Use dictionaries for students, lists for grades, functions for logic.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; const defs = py.count(/def /g); return defs >= 2 && py.has('for') ? { success: true, message: '🎉🚀 Grade Tracker complete! You can build real apps!' } : { success: false, message: 'Create at least 2 functions and loop through students.' }; } } }
    ]
  },
  {
    id: 6,
    title: 'Week 6: OOP & Classes',
    description: 'Object-oriented programming',
    lessons: [
      { id: 'w6l1', title: 'Classes & Objects', description: 'Create your own data types', xp: 35, tags: ['oop', 'classes'],
        content: `<h3>Classes - Blueprints for Objects 🏗️</h3>
          <div class="code-block"><span class="code-keyword">class</span> <span class="code-func">Pet</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, name, species):
        self.name = name
        self.species = species
        self.energy = <span class="code-number">100</span>

    <span class="code-keyword">def</span> <span class="code-func">play</span>(self):
        self.energy -= <span class="code-number">20</span>
        <span class="code-func">print</span>(<span class="code-string">f"{self.name} plays! Energy: {self.energy}"</span>)

    <span class="code-keyword">def</span> <span class="code-func">feed</span>(self):
        self.energy += <span class="code-number">30</span>
        <span class="code-func">print</span>(<span class="code-string">f"{self.name} eats! Energy: {self.energy}"</span>)

my_pet = <span class="code-func">Pet</span>(<span class="code-string">"Buddy"</span>, <span class="code-string">"Dog"</span>)
my_pet.play()
my_pet.feed()</div>`,
        challenge: { prompt: 'Create a Robot class with name, battery, and methods for work() (uses battery) and charge() (adds battery).', hint: 'class Robot: def __init__(self, name): ...',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('class') && py.has('def') ? { success: true, message: '🎉 OOP unlocked! You created your first class!' } : { success: false, message: 'Use class keyword and def for methods.' }; } } },
      { id: 'w6l2', title: 'Inheritance', description: 'Build on existing classes', xp: 35, tags: ['oop', 'inheritance'],
        content: `<h3>Inheritance - Child Classes 👨‍👧</h3>
          <div class="code-block"><span class="code-keyword">class</span> <span class="code-func">Animal</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, name):
        self.name = name
    <span class="code-keyword">def</span> <span class="code-func">speak</span>(self):
        <span class="code-func">print</span>(<span class="code-string">"..."</span>)

<span class="code-keyword">class</span> <span class="code-func">Dog</span>(Animal):
    <span class="code-keyword">def</span> <span class="code-func">speak</span>(self):
        <span class="code-func">print</span>(<span class="code-string">f"{self.name}: Woof!"</span>)

<span class="code-keyword">class</span> <span class="code-func">Cat</span>(Animal):
    <span class="code-keyword">def</span> <span class="code-func">speak</span>(self):
        <span class="code-func">print</span>(<span class="code-string">f"{self.name}: Meow!"</span>)

pets = [<span class="code-func">Dog</span>(<span class="code-string">"Rex"</span>), <span class="code-func">Cat</span>(<span class="code-string">"Whiskers"</span>)]
<span class="code-keyword">for</span> pet <span class="code-keyword">in</span> pets:
    pet.speak()</div>`,
        challenge: { prompt: 'Create a Vehicle base class and two child classes (Car, Motorcycle) with different behaviors.', hint: 'class Car(Vehicle): ...',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/class /g) >= 2 ? { success: true, message: '🎉 Inheritance master! Code reuse is powerful!' } : { success: false, message: 'Create at least 2 classes, one inheriting from another.' }; } } },
      { id: 'w6l3', title: 'Game Characters with OOP', description: 'OOP for game design', xp: 35, tags: ['oop', 'games'],
        content: `<h3>Game Characters with Classes 🎮</h3>
          <div class="code-block"><span class="code-keyword">class</span> <span class="code-func">Character</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.attack = attack
    <span class="code-keyword">def</span> <span class="code-func">attack_enemy</span>(self, target):
        damage = random.randint(<span class="code-number">1</span>, self.attack)
        target.hp -= damage
        <span class="code-func">print</span>(<span class="code-string">f"{self.name} hits {target.name} for {damage}!"</span>)
    <span class="code-keyword">def</span> <span class="code-func">is_alive</span>(self):
        <span class="code-keyword">return</span> self.hp > <span class="code-number">0</span>

<span class="code-keyword">class</span> <span class="code-func">Wizard</span>(Character):
    <span class="code-keyword">def</span> <span class="code-func">fireball</span>(self, target):
        damage = self.attack * <span class="code-number">2</span>
        target.hp -= damage
        <span class="code-func">print</span>(<span class="code-string">f"{self.name} casts FIREBALL for {damage}! 🔥"</span>)</div>`,
        challenge: { prompt: 'Create a Character class with Warrior and Mage subclasses. Each should have a unique special ability.', hint: 'Warrior has shield_bash(), Mage has heal()',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/class /g) >= 3 ? { success: true, message: '🎉 Game designer! OOP makes games amazing!' } : { success: false, message: 'Create at least 3 classes (base + 2 subclasses).' }; } } },
      { id: 'w6l4', title: 'Inventory System', description: 'Build a game inventory', xp: 35, tags: ['oop', 'games', 'data'],
        content: `<h3>Inventory System 🎒</h3>
          <div class="code-block"><span class="code-keyword">class</span> <span class="code-func">Item</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self, name, item_type, value):
        self.name = name
        self.item_type = item_type
        self.value = value

<span class="code-keyword">class</span> <span class="code-func">Inventory</span>:
    <span class="code-keyword">def</span> <span class="code-func">__init__</span>(self):
        self.items = []
    <span class="code-keyword">def</span> <span class="code-func">add</span>(self, item):
        self.items.append(item)
        <span class="code-func">print</span>(<span class="code-string">f"Added {item.name}!"</span>)
    <span class="code-keyword">def</span> <span class="code-func">show</span>(self):
        <span class="code-keyword">for</span> item <span class="code-keyword">in</span> self.items:
            <span class="code-func">print</span>(<span class="code-string">f"  {item.name} ({item.item_type}) - {item.value}g"</span>)
    <span class="code-keyword">def</span> <span class="code-func">total_value</span>(self):
        <span class="code-keyword">return</span> <span class="code-func">sum</span>(i.value <span class="code-keyword">for</span> i <span class="code-keyword">in</span> self.items)</div>`,
        challenge: { prompt: 'Build an inventory system with Item and Inventory classes. Add methods for adding, removing, and searching items.', hint: 'Inventory needs add(), remove(), search(), and show() methods.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/class /g) >= 2 && py.count(/def /g) >= 4 ? { success: true, message: '🎉 Inventory system built! Ready for RPGs!' } : { success: false, message: 'Create 2+ classes with 4+ methods total.' }; } } },
      { id: 'w6l5', title: 'Week 6 Project: Pet Simulator', description: 'Virtual pet game with OOP', xp: 80, tags: ['project', 'oop', 'games'],
        content: `<h3>🚀 Project: Virtual Pet Simulator</h3><p>Build a Tamagotchi-style pet game using classes!</p>
          <div class="code-block"><span class="code-comment"># Create Pet class with hunger, happiness, energy</span>
<span class="code-comment"># Methods: feed(), play(), sleep(), status()</span>
<span class="code-comment"># Stats decrease over time</span>
<span class="code-comment"># Pet evolves when stats are high enough!</span></div>`,
        challenge: { prompt: 'Build a virtual pet with at least 3 stats and 4 actions. Make it evolve or change based on how well you care for it!', hint: 'Use a Pet class with stats dict and methods for each action.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('class') && py.count(/def /g) >= 4 ? { success: true, message: '🎉🚀 Pet Simulator complete! Your virtual pet lives!' } : { success: false, message: 'Create a class with at least 4 methods.' }; } } }
    ]
  },
  {
    id: 7,
    title: 'Week 7: Algorithms & Patterns',
    description: 'Think like a computer scientist',
    lessons: [
      { id: 'w7l1', title: 'Search Algorithms', description: 'Find items efficiently', xp: 35, tags: ['algorithms', 'search'],
        content: `<h3>Searching 🔍</h3>
          <div class="code-block"><span class="code-comment"># Linear Search - check one by one</span>
<span class="code-keyword">def</span> <span class="code-func">linear_search</span>(lst, target):
    <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-func">len</span>(lst)):
        <span class="code-keyword">if</span> lst[i] == target:
            <span class="code-keyword">return</span> i
    <span class="code-keyword">return</span> -<span class="code-number">1</span>

<span class="code-comment"># Binary Search - divide and conquer (list must be sorted!)</span>
<span class="code-keyword">def</span> <span class="code-func">binary_search</span>(lst, target):
    low = <span class="code-number">0</span>
    high = <span class="code-func">len</span>(lst) - <span class="code-number">1</span>
    <span class="code-keyword">while</span> low <= high:
        mid = (low + high) // <span class="code-number">2</span>
        <span class="code-keyword">if</span> lst[mid] == target: <span class="code-keyword">return</span> mid
        <span class="code-keyword">elif</span> lst[mid] < target: low = mid + <span class="code-number">1</span>
        <span class="code-keyword">else</span>: high = mid - <span class="code-number">1</span>
    <span class="code-keyword">return</span> -<span class="code-number">1</span></div>`,
        challenge: { prompt: 'Implement binary search. Test it on a sorted list of 20 numbers.', hint: 'Remember: binary search only works on sorted lists!',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('while') && py.has('mid') ? { success: true, message: '🎉 Algorithm ace! Binary search is super fast!' } : { success: false, message: 'Implement binary search with a while loop and mid variable.' }; } } },
      { id: 'w7l2', title: 'Sorting Algorithms', description: 'Bubble sort and selection sort', xp: 40, tags: ['algorithms', 'sorting'],
        content: `<h3>Sorting Algorithms 📊</h3>
          <div class="code-block"><span class="code-keyword">def</span> <span class="code-func">bubble_sort</span>(lst):
    n = <span class="code-func">len</span>(lst)
    <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(n):
        <span class="code-keyword">for</span> j <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">0</span>, n-i-<span class="code-number">1</span>):
            <span class="code-keyword">if</span> lst[j] > lst[j+<span class="code-number">1</span>]:
                lst[j], lst[j+<span class="code-number">1</span>] = lst[j+<span class="code-number">1</span>], lst[j]
    <span class="code-keyword">return</span> lst

nums = [<span class="code-number">64</span>, <span class="code-number">34</span>, <span class="code-number">25</span>, <span class="code-number">12</span>, <span class="code-number">22</span>, <span class="code-number">11</span>, <span class="code-number">90</span>]
<span class="code-func">print</span>(<span class="code-func">bubble_sort</span>(nums))</div>`,
        challenge: { prompt: 'Implement bubble sort from scratch. Show it sorting a list step by step.', hint: 'Compare adjacent elements and swap if out of order.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && (py.has('swap') || py.has(',')) ? { success: true, message: '🎉 Sorting wizard! You understand how sorting works!' } : { success: false, message: 'Create a bubble sort with nested for loops.' }; } } },
      { id: 'w7l3', title: 'Recursion', description: 'Functions that call themselves', xp: 40, tags: ['algorithms', 'recursion'],
        content: `<h3>Recursion 🪆</h3><p>A function that calls itself!</p>
          <div class="code-block"><span class="code-keyword">def</span> <span class="code-func">factorial</span>(n):
    <span class="code-keyword">if</span> n <= <span class="code-number">1</span>: <span class="code-keyword">return</span> <span class="code-number">1</span>
    <span class="code-keyword">return</span> n * <span class="code-func">factorial</span>(n - <span class="code-number">1</span>)

<span class="code-func">print</span>(<span class="code-func">factorial</span>(<span class="code-number">5</span>))  <span class="code-comment"># 120</span>

<span class="code-keyword">def</span> <span class="code-func">fibonacci</span>(n):
    <span class="code-keyword">if</span> n <= <span class="code-number">1</span>: <span class="code-keyword">return</span> n
    <span class="code-keyword">return</span> <span class="code-func">fibonacci</span>(n-<span class="code-number">1</span>) + <span class="code-func">fibonacci</span>(n-<span class="code-number">2</span>)

<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">10</span>):
    <span class="code-func">print</span>(<span class="code-func">fibonacci</span>(i), end=<span class="code-string">" "</span>)</div>`,
        challenge: { prompt: 'Write a recursive function that calculates the sum of all digits in a number (e.g., 1234 → 10).', hint: 'Base case: single digit. Recursive case: last digit + sum_digits(rest).',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') ? { success: true, message: '🎉 Recursion unlocked! Functions within functions!' } : { success: false, message: 'Write a recursive function with def and return.' }; } } },
      { id: 'w7l4', title: 'Pattern Challenges', description: 'Code pattern problems', xp: 35, tags: ['algorithms', 'patterns'],
        content: `<h3>Pattern Challenges 🎨</h3>
          <div class="code-block"><span class="code-comment"># Diamond pattern</span>
n = <span class="code-number">5</span>
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, n+<span class="code-number">1</span>):
    <span class="code-func">print</span>(<span class="code-string">" "</span> * (n-i) + <span class="code-string">"*"</span> * (<span class="code-number">2</span>*i-<span class="code-number">1</span>))
<span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(n-<span class="code-number">1</span>, <span class="code-number">0</span>, -<span class="code-number">1</span>):
    <span class="code-func">print</span>(<span class="code-string">" "</span> * (n-i) + <span class="code-string">"*"</span> * (<span class="code-number">2</span>*i-<span class="code-number">1</span>))

<span class="code-comment"># Pascal's triangle</span>
<span class="code-keyword">def</span> <span class="code-func">pascal</span>(rows):
    tri = [[<span class="code-number">1</span>]]
    <span class="code-keyword">for</span> i <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, rows):
        row = [<span class="code-number">1</span>]
        <span class="code-keyword">for</span> j <span class="code-keyword">in</span> <span class="code-func">range</span>(<span class="code-number">1</span>, i):
            row.append(tri[i-<span class="code-number">1</span>][j-<span class="code-number">1</span>] + tri[i-<span class="code-number">1</span>][j])
        row.append(<span class="code-number">1</span>)
        tri.append(row)
    <span class="code-keyword">return</span> tri</div>`,
        challenge: { prompt: 'Create a diamond pattern with stars (*) that is 7 rows tall. Bonus: use a different character!', hint: 'Two loops: one for top half growing, one for bottom half shrinking.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.count(/print\s*\(/g) >= 1 && py.has('*') ? { success: true, message: '🎉 Pattern pro! Beautiful code art!' } : { success: false, message: 'Use for loops and print with * operator.' }; } } },
      { id: 'w7l5', title: 'Week 7 Project: Algorithm Visualizer', description: 'See algorithms in action', xp: 80, tags: ['project', 'algorithms'],
        content: `<h3>🚀 Project: Algorithm Visualizer</h3><p>Build a text-based visualizer that shows sorting algorithms step by step!</p>`,
        challenge: { prompt: 'Create a program that visually shows bubble sort working on a list. Print the list after each swap with bars (█) to show values.', hint: 'After each swap, print the list and use "█" * value to show bar charts.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '🎉🚀 Algorithm Visualizer complete! You think like a CS major!' } : { success: false, message: 'Create a sorting visualizer with def, for, and print.' }; } } }
    ]
  },
  {
    id: 8,
    title: 'Week 8: AI & Final Project',
    description: 'Introduction to AI concepts and capstone project',
    lessons: [
      { id: 'w8l1', title: 'Intro to AI Thinking', description: 'How AI works at a high level', xp: 35, tags: ['ai', 'concepts'],
        content: `<h3>How AI Works 🤖</h3><p>AI is just smart math + lots of data! Let's build a simple one.</p>
          <div class="code-block"><span class="code-comment"># Simple keyword-based chatbot</span>
<span class="code-keyword">def</span> <span class="code-func">chatbot</span>(message):
    message = message.lower()
    <span class="code-keyword">if</span> <span class="code-string">"hello"</span> <span class="code-keyword">in</span> message:
        <span class="code-keyword">return</span> <span class="code-string">"Hi there! How can I help?"</span>
    <span class="code-keyword">elif</span> <span class="code-string">"weather"</span> <span class="code-keyword">in</span> message:
        <span class="code-keyword">return</span> <span class="code-string">"I wish I could check the weather!"</span>
    <span class="code-keyword">elif</span> <span class="code-string">"python"</span> <span class="code-keyword">in</span> message:
        <span class="code-keyword">return</span> <span class="code-string">"Python is amazing for AI!"</span>
    <span class="code-keyword">else</span>:
        <span class="code-keyword">return</span> <span class="code-string">"Interesting! Tell me more."</span>

messages = [<span class="code-string">"Hello bot"</span>, <span class="code-string">"Tell me about Python"</span>, <span class="code-string">"What is AI?"</span>]
<span class="code-keyword">for</span> msg <span class="code-keyword">in</span> messages:
    <span class="code-func">print</span>(<span class="code-string">f"You: {msg}"</span>)
    <span class="code-func">print</span>(<span class="code-string">f"Bot: {chatbot(msg)}\\n"</span>)</div>`,
        challenge: { prompt: 'Build a chatbot that responds to at least 5 different topics using keyword matching.', hint: 'Check for keywords with "in" operator: if "math" in message.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.count(/if|elif/g) >= 5 ? { success: true, message: '🎉 AI builder! Your first chatbot works!' } : { success: false, message: 'Create a function with at least 5 if/elif branches.' }; } } },
      { id: 'w8l2', title: 'Pattern Recognition', description: 'Teach computers to find patterns', xp: 40, tags: ['ai', 'patterns'],
        content: `<h3>Pattern Recognition 🧠</h3><p>AI finds patterns in data. Let's build a simple classifier!</p>
          <div class="code-block"><span class="code-comment"># Simple spam detector</span>
spam_words = [<span class="code-string">"free"</span>, <span class="code-string">"win"</span>, <span class="code-string">"prize"</span>, <span class="code-string">"click"</span>, <span class="code-string">"buy now"</span>]

<span class="code-keyword">def</span> <span class="code-func">is_spam</span>(message):
    message = message.lower()
    score = <span class="code-number">0</span>
    <span class="code-keyword">for</span> word <span class="code-keyword">in</span> spam_words:
        <span class="code-keyword">if</span> word <span class="code-keyword">in</span> message:
            score += <span class="code-number">1</span>
    <span class="code-keyword">return</span> score >= <span class="code-number">2</span>

emails = [<span class="code-string">"Free prize! Click now!"</span>, <span class="code-string">"Meeting at 3pm"</span>, <span class="code-string">"Win a free trip!"</span>]
<span class="code-keyword">for</span> email <span class="code-keyword">in</span> emails:
    <span class="code-func">print</span>(<span class="code-string">f"{'SPAM' if is_spam(email) else 'OK'}: {email}"</span>)</div>`,
        challenge: { prompt: 'Build a simple sentiment analyzer that classifies text as positive, negative, or neutral based on keywords.', hint: 'Create lists of positive and negative words, count matches.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') ? { success: true, message: '🎉 AI pattern finder! You classified data!' } : { success: false, message: 'Create a classifier function with word lists.' }; } } },
      { id: 'w8l3', title: 'Data Structures for AI', description: 'Matrices and datasets', xp: 35, tags: ['ai', 'data'],
        content: `<h3>Data for AI 📊</h3><p>AI needs organized data. Learn about matrices and datasets!</p>
          <div class="code-block"><span class="code-comment"># 2D list (matrix) - like a spreadsheet!</span>
grid = [
    [<span class="code-number">1</span>, <span class="code-number">2</span>, <span class="code-number">3</span>],
    [<span class="code-number">4</span>, <span class="code-number">5</span>, <span class="code-number">6</span>],
    [<span class="code-number">7</span>, <span class="code-number">8</span>, <span class="code-number">9</span>]
]

<span class="code-comment"># Access elements</span>
<span class="code-func">print</span>(grid[<span class="code-number">1</span>][<span class="code-number">2</span>])  <span class="code-comment"># 6 (row 1, col 2)</span>

<span class="code-comment"># Print nicely</span>
<span class="code-keyword">for</span> row <span class="code-keyword">in</span> grid:
    <span class="code-func">print</span>(row)</div>`,
        challenge: { prompt: 'Create a 5x5 multiplication table as a 2D list. Print it formatted nicely.', hint: 'Use nested loops: [[i*j for j in range(1,6)] for i in range(1,6)]',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('[') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '🎉 Data structures ready for AI!' } : { success: false, message: 'Create a 2D list with nested loops.' }; } } },
      { id: 'w8l4', title: 'Recommendation Engine', description: 'Build a simple recommender', xp: 40, tags: ['ai', 'recommendation'],
        content: `<h3>Recommendation Engine 🎯</h3><p>Netflix, YouTube, Spotify - they all use recommenders!</p>
          <div class="code-block">users = {
    <span class="code-string">"Alex"</span>: [<span class="code-string">"Python"</span>, <span class="code-string">"Math"</span>, <span class="code-string">"AI"</span>],
    <span class="code-string">"Sam"</span>: [<span class="code-string">"Python"</span>, <span class="code-string">"Games"</span>, <span class="code-string">"Art"</span>],
    <span class="code-string">"Pat"</span>: [<span class="code-string">"Math"</span>, <span class="code-string">"AI"</span>, <span class="code-string">"Science"</span>],
}

<span class="code-keyword">def</span> <span class="code-func">recommend</span>(user, all_users):
    my_interests = <span class="code-func">set</span>(all_users[user])
    scores = {}
    <span class="code-keyword">for</span> other, interests <span class="code-keyword">in</span> all_users.items():
        <span class="code-keyword">if</span> other != user:
            shared = my_interests & <span class="code-func">set</span>(interests)
            new_stuff = <span class="code-func">set</span>(interests) - my_interests
            <span class="code-keyword">for</span> item <span class="code-keyword">in</span> new_stuff:
                scores[item] = scores.get(item, <span class="code-number">0</span>) + <span class="code-func">len</span>(shared)
    <span class="code-keyword">return</span> <span class="code-func">sorted</span>(scores.items(), key=<span class="code-keyword">lambda</span> x: x[<span class="code-number">1</span>], reverse=True)

<span class="code-func">print</span>(<span class="code-func">recommend</span>(<span class="code-string">"Alex"</span>, users))</div>`,
        challenge: { prompt: 'Build a movie or book recommender. Create user profiles with interests and suggest items based on similar users.', hint: 'Compare user interests, find what similar users like that the target user hasn\'t seen.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && py.has('{') ? { success: true, message: '🎉 Recommender built! You think like Netflix!' } : { success: false, message: 'Create a recommendation function with user data.' }; } } },
      { id: 'w8l5', title: 'Week 8: Capstone Project', description: 'Build your masterpiece!', xp: 100, tags: ['project', 'ai', 'capstone'],
        content: `<h3>🚀🏆 Capstone Project: AI-Powered Game</h3>
          <p>Combine EVERYTHING you've learned to build your ultimate project! Choose one:</p>
          <p><strong>Option A:</strong> AI Chatbot with personality, learning, and conversation memory</p>
          <p><strong>Option B:</strong> Smart game that adapts difficulty based on player performance</p>
          <p><strong>Option C:</strong> Data analyzer that processes and visualizes information</p>
          <p><strong>Option D:</strong> Your own idea! Use classes, functions, data structures, and algorithms.</p>`,
        challenge: { prompt: 'Build your capstone project! It should use classes, functions, lists/dicts, loops, and at least one "AI" feature (pattern matching, recommendations, or adaptive behavior).', hint: 'Plan first: what classes? what functions? what data? Then build step by step.',
          validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; const defs = py.count(/def /g); const classes = py.count(/class /g); return defs >= 3 && (classes >= 1 || defs >= 5) ? { success: true, message: '🎉🚀🏆👑 LEGENDARY! You completed LevelUp Academy! You are a TRUE Code Master!' } : { success: false, message: 'Use at least 3 functions and 1 class (or 5+ functions) for your capstone.' }; } } }
    ]
  }
];

const PROJECTS = [
  { id: 'p1', title: 'Bio Card Generator', icon: '🪪', description: 'Create a personalized bio card with variables and print statements.',
    difficulty: 'beginner', week: 1, xp: 50,
    requirements: ['Use at least 3 variables (name, age, hobby)', 'Print a formatted bio card with borders', 'Use f-strings or string concatenation'],
    hints: ['Start by storing your info in variables: name = "Your Name"', 'Use print("=" * 30) to make a border line', 'Use f-strings like print(f"Name: {name}") to display each field'],
    starter: '# Bio Card Generator\n# Create variables and print a nice bio card!\n\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/\w+\s*=/) >= 3 && py.count(/print\s*\(/g) >= 3 ? { success: true, message: '🎉 Awesome bio card! You nailed variables and print!' } : { success: false, message: 'Use at least 3 variables and 3 print statements.' }; }
  },
  { id: 'p2', title: 'Number Guessing Game', icon: '🎯', description: 'Build a game where players guess a secret number with hints.',
    difficulty: 'beginner', week: 2, xp: 60,
    requirements: ['Generate a random number between 1 and 100', 'Use a while loop for repeated guesses', 'Print "too high" or "too low" hints', 'Count the number of guesses'],
    hints: ['Use import random and random.randint(1, 100) to pick the secret number', 'Use a while True loop and break when they guess correctly', 'Compare with if guess > secret: print("Too high!") and elif guess < secret: print("Too low!")'],
    starter: '# Number Guessing Game\nimport random\n\nsecret = random.randint(1, 100)\nprint("I\'m thinking of a number between 1 and 100!")\n\n# Add your game loop here\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('while') && py.has('random') && (py.has('high') || py.has('low') || py.has('>') || py.has('<')) ? { success: true, message: '🎉 Great guessing game! Loops + conditionals mastered!' } : { success: false, message: 'Need a while loop, random number, and high/low hints.' }; }
  },
  { id: 'p3', title: 'Quiz Master', icon: '🧠', description: 'Create a quiz game with multiple categories and scoring.',
    difficulty: 'intermediate', week: 3, xp: 60,
    requirements: ['Store at least 5 questions in a list or dictionary', 'Keep track of the score', 'Show the final score at the end', 'Use a function for asking questions'],
    hints: ['Store questions as a list of dictionaries: [{"q": "What is 2+2?", "a": "4"}, ...]', 'Create a function def ask_question(question): that returns True/False', 'Loop through questions with for q in questions: and increment score when correct'],
    starter: '# Quiz Master\n# Build a quiz game with scoring!\n\nquestions = [\n    # Add your questions here as dictionaries\n]\n\nscore = 0\n\n# Create your quiz logic\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && py.has('score') ? { success: true, message: '🎉 Quiz Master built! Functions + data structures = power!' } : { success: false, message: 'Need a function, a loop through questions, and score tracking.' }; }
  },
  { id: 'p4', title: 'Math Battle Arena', icon: '🧮', description: 'Timed math challenges with difficulty levels and leaderboards.',
    difficulty: 'intermediate', week: 3, xp: 70,
    requirements: ['Generate random math problems (+, -, *)', 'Have at least 2 difficulty levels', 'Track score and number of correct answers', 'Use functions to organize code'],
    hints: ['Use random.choice(["+", "-", "*"]) to pick an operator', 'Create a function def generate_problem(difficulty): that returns harder numbers for higher levels', 'Use eval() or if/elif to check answers based on the operator'],
    starter: '# Math Battle Arena\nimport random\n\ndef generate_problem(difficulty):\n    # Easy: numbers 1-10, Hard: numbers 1-100\n    pass\n\nscore = 0\nrounds = 5\n\n# Build your game loop\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('random') && py.has('score') ? { success: true, message: '🎉 Math arena complete! Great use of functions and randomness!' } : { success: false, message: 'Need functions, random math problems, and scoring.' }; }
  },
  { id: 'p5', title: 'Text Adventure RPG', icon: '🗺️', description: 'Multi-room adventure with inventory, combat, and story choices.',
    difficulty: 'intermediate', week: 4, xp: 80,
    requirements: ['Create at least 3 rooms/locations', 'Use a dictionary to store room data', 'Implement an inventory system (list)', 'Use functions for game actions'],
    hints: ['Store rooms as a dict: rooms = {"forest": {"description": "A dark forest...", "items": ["sword"]}, ...}', 'Use a list for inventory: inventory = [] and inventory.append(item)', 'Create functions like def look_around(room): and def pick_up(item): to keep code organized'],
    starter: '# Text Adventure RPG\n# Create an epic adventure!\n\nrooms = {\n    # Define your rooms here\n}\n\ninventory = []\ncurrent_room = "start"\n\n# Build your adventure loop\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('{') && py.has('while') ? { success: true, message: '🎉 Epic adventure! Dictionaries + game loops = awesome RPG!' } : { success: false, message: 'Need functions, a dictionary for rooms, and a game loop.' }; }
  },
  { id: 'p6', title: 'Physics Simulator', icon: '🔬', description: 'Simulate gravity, bouncing balls, and projectile motion.',
    difficulty: 'advanced', week: 4, xp: 80,
    requirements: ['Simulate a falling ball with gravity (y += velocity, velocity += gravity)', 'Print the ball position at each time step', 'Implement a bounce when the ball hits the ground'],
    hints: ['Set gravity = 9.8, velocity = 0, height = 100, then loop: velocity += gravity, height -= velocity', 'When height <= 0: velocity = -velocity * 0.8 (bounce with energy loss)', 'Use a for loop with range() to simulate time steps and print height each step'],
    starter: '# Physics Simulator\n# Simulate a bouncing ball!\n\nheight = 100\nvelocity = 0\ngravity = 9.8\n\n# Simulate the ball falling and bouncing\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('gravity') && py.has('velocity') ? { success: true, message: '🎉 Physics sim complete! You modeled real-world physics!' } : { success: false, message: 'Need a loop simulating gravity with velocity updates.' }; }
  },
  { id: 'p7', title: 'RPG Battle Game', icon: '⚔️', description: 'Full RPG with characters, items, spells, and boss fights.',
    difficulty: 'advanced', week: 4, xp: 100,
    requirements: ['Create a Player class with health, attack, and defense', 'Create an Enemy class', 'Implement a turn-based battle system', 'Add at least 2 special abilities'],
    hints: ['Create class Player: with __init__(self, name, hp, attack) and a method def take_damage(self, dmg):', 'Create class Enemy: similarly, and a def battle(player, enemy): function', 'Use while player.hp > 0 and enemy.hp > 0: for the battle loop with attack choices'],
    starter: '# RPG Battle Game\n# Create an epic battle system!\n\nclass Player:\n    def __init__(self, name, hp, attack):\n        pass\n\nclass Enemy:\n    def __init__(self, name, hp, attack):\n        pass\n\n# Build your battle system\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('class') && py.has('def') && py.has('self') ? { success: true, message: '🎉 RPG battle system built! OOP mastery unlocked!' } : { success: false, message: 'Need classes with methods for the battle system.' }; }
  },
  { id: 'p8', title: 'AI Chatbot', icon: '🤖', description: 'Build a simple chatbot that responds to keywords and learns.',
    difficulty: 'advanced', week: 4, xp: 100,
    requirements: ['Respond to at least 5 different keywords/phrases', 'Use a dictionary to map keywords to responses', 'Handle unknown inputs gracefully', 'Use functions to organize logic'],
    hints: ['Create a responses dictionary: responses = {"hello": "Hi there!", "help": "I can chat about..."}', 'Use a function def get_response(message): that checks if any keyword is in the message.lower()', 'Use a while True: loop and let the user type "quit" to exit'],
    starter: '# AI Chatbot\n# Build a smart chatbot!\n\nresponses = {\n    # Map keywords to responses\n}\n\ndef get_response(message):\n    # Check for keywords in the message\n    pass\n\n# Chat loop\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('{') && py.count(/"/g) >= 6 ? { success: true, message: '🎉 Chatbot is alive! Great use of dictionaries and functions!' } : { success: false, message: 'Need a function, keyword dictionary, and multiple responses.' }; }
  },
  { id: 'p9', title: 'Grade Tracker Pro', icon: '📊', description: 'Full grade management with letter grades, GPA, and class rankings.',
    difficulty: 'intermediate', week: 5, xp: 70,
    requirements: ['Store student grades in a dictionary', 'Calculate average grade', 'Convert number grades to letter grades (A/B/C/D/F)', 'Use try/except for input validation'],
    hints: ['Use a dict: grades = {"Math": 92, "Science": 87, ...} to store grades', 'Calculate average with sum(grades.values()) / len(grades)', 'Use if/elif to convert: if avg >= 90: return "A" elif avg >= 80: return "B" etc.'],
    starter: '# Grade Tracker Pro\n# Track and analyze grades!\n\ngrades = {}\n\ndef add_grade(subject, score):\n    pass\n\ndef get_letter_grade(score):\n    pass\n\ndef show_report():\n    pass\n\n# Build your grade tracker\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('if') && (py.has('{') || py.has('dict')) ? { success: true, message: '🎉 Grade tracker works! Error handling + data = pro!' } : { success: false, message: 'Need functions for grade management and letter conversion.' }; }
  },
  { id: 'p10', title: 'Virtual Pet Game', icon: '🐾', description: 'Tamagotchi-style pet with stats, evolution, and mini-games.',
    difficulty: 'intermediate', week: 6, xp: 80,
    requirements: ['Create a Pet class with hunger, happiness, and energy stats', 'Implement feed(), play(), and sleep() methods', 'Stats should decrease over time', 'Print the pet status with emoji'],
    hints: ['class Pet: with __init__ setting self.hunger = 50, self.happiness = 50, self.energy = 50', 'def feed(self): increases hunger (less hungry), def play(self): increases happiness but costs energy', 'Use a game loop where each "turn" decreases stats slightly, and the player picks actions'],
    starter: '# Virtual Pet Game\n# Take care of your pet!\n\nclass Pet:\n    def __init__(self, name):\n        self.name = name\n        # Add stats\n\n    def feed(self):\n        pass\n\n    def play(self):\n        pass\n\n    def status(self):\n        pass\n\n# Create your pet and game loop\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('class') && py.has('self') && py.count(/def\s+/g) >= 3 ? { success: true, message: '🎉 Your virtual pet is alive! Great OOP skills!' } : { success: false, message: 'Need a Pet class with at least 3 methods.' }; }
  },
  { id: 'p11', title: 'Sorting Visualizer', icon: '📈', description: 'Watch bubble sort, selection sort, and insertion sort in action.',
    difficulty: 'advanced', week: 7, xp: 90,
    requirements: ['Implement bubble sort', 'Print the list after each swap to visualize', 'Count the number of comparisons and swaps', 'Test with a random list'],
    hints: ['Bubble sort: for i in range(len(arr)): for j in range(len(arr)-1-i): if arr[j] > arr[j+1]: swap', 'After each swap, print the array: print(arr) so you can see it sorting', 'Add counters: comparisons += 1 before each if, swaps += 1 after each swap'],
    starter: '# Sorting Visualizer\nimport random\n\ndef bubble_sort(arr):\n    # Implement bubble sort with visualization\n    pass\n\n# Generate random list and sort it\nnumbers = [random.randint(1, 99) for i in range(10)]\nprint("Before:", numbers)\n\n# Sort and visualize!\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && (py.has('swap') || py.has('[j]') || py.has('[j+1]')) ? { success: true, message: '🎉 Sorting visualizer done! You understand algorithms!' } : { success: false, message: 'Need a sorting function with nested loops and swapping.' }; }
  },
  { id: 'p12', title: 'AI Movie Recommender', icon: '🎬', description: 'Build a recommendation engine based on user preferences.',
    difficulty: 'advanced', week: 8, xp: 100,
    requirements: ['Store movies with genres in a dictionary', 'Ask user for genre preferences', 'Score and rank movies by preference match', 'Display top recommendations'],
    hints: ['Store movies: movies = {"Inception": ["sci-fi", "thriller"], "Frozen": ["animation", "family"], ...}', 'Ask for favorite genres and store in a list', 'Score each movie: for each genre that matches a preference, add 1 point. Sort by score.'],
    starter: '# AI Movie Recommender\n# Recommend movies based on preferences!\n\nmovies = {\n    # "Movie Name": ["genre1", "genre2"]\n}\n\ndef recommend(preferences):\n    # Score movies by how many genres match\n    pass\n\n# Get user preferences and recommend!\n',
    validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('{') && py.has('for') ? { success: true, message: '🎉 Movie recommender built! You created a basic AI system!' } : { success: false, message: 'Need a function, movie dictionary, and scoring loop.' }; }
  },
];

const ACHIEVEMENTS = [
  // Progress milestones
  { id: 'a1', name: 'First Steps', icon: '👶', description: 'Complete your first lesson', xp: 10, condition: (s) => s.lessonsCompleted >= 1 },
  { id: 'a5', name: 'Century Club', icon: '💯', description: 'Earn 100 XP', xp: 15, condition: (s) => s.totalXP >= 100 },
  { id: 'a9', name: 'Half Way There', icon: '🏔️', description: 'Reach 500 XP', xp: 25, condition: (s) => s.totalXP >= 500 },
  { id: 'a12', name: 'XP Powerhouse', icon: '💡', description: 'Reach 1500 XP', xp: 40, condition: (s) => s.totalXP >= 1500 },
  { id: 'a18', name: 'XP Legend', icon: '💎', description: 'Reach 3000 XP', xp: 50, condition: (s) => s.totalXP >= 3000 },

  // Streak achievements
  { id: 'a3', name: 'On Fire', icon: '🔥', description: 'Get a 3-day streak', xp: 15, condition: (s) => s.streak >= 3 },
  { id: 'a19', name: 'Unstoppable', icon: '🌋', description: 'Get a 7-day streak', xp: 30, condition: (s) => s.streak >= 7 },
  { id: 'a21', name: 'Marathon Coder', icon: '🏃', description: 'Get a 14-day streak', xp: 50, condition: (s) => s.streak >= 14 },

  // Week completions
  { id: 'a4', name: 'Week Warrior', icon: '🗓️', description: 'Complete all Week 1 lessons', xp: 20, condition: (s) => s.weekComplete && s.weekComplete[1] },
  { id: 'a6', name: 'Loop Master', icon: '🔄', description: 'Complete Week 2 (Loops & Lists)', xp: 20, condition: (s) => s.weekComplete && s.weekComplete[2] },
  { id: 'a7', name: 'Function Pro', icon: '🔧', description: 'Complete Week 3 (Functions)', xp: 20, condition: (s) => s.weekComplete && s.weekComplete[3] },
  { id: 'a10', name: 'Game Developer', icon: '🎮', description: 'Complete Week 4 (Games & Projects)', xp: 25, condition: (s) => s.weekComplete && s.weekComplete[4] },
  { id: 'a13', name: 'Error Handler', icon: '🛡️', description: 'Complete Week 5 (Error Handling)', xp: 25, condition: (s) => s.weekComplete && s.weekComplete[5] },
  { id: 'a14', name: 'OOP Pioneer', icon: '🏛️', description: 'Complete Week 6 (Classes & OOP)', xp: 30, condition: (s) => s.weekComplete && s.weekComplete[6] },
  { id: 'a15', name: 'Algorithm Ace', icon: '🧮', description: 'Complete Week 7 (Algorithms)', xp: 30, condition: (s) => s.weekComplete && s.weekComplete[7] },
  { id: 'a16', name: 'AI Visionary', icon: '🤖', description: 'Complete Week 8 (AI & Capstone)', xp: 40, condition: (s) => s.weekComplete && s.weekComplete[8] },

  // Projects
  { id: 'a8', name: 'Project Builder', icon: '🏗️', description: 'Complete your first project', xp: 15, condition: (s) => s.projectsCompleted >= 1 },
  { id: 'a22', name: 'Project Master', icon: '🏆', description: 'Complete 5 projects', xp: 40, condition: (s) => s.projectsCompleted >= 5 },

  // Battle arena
  { id: 'a17', name: 'Duel Champion', icon: '⚔️', description: 'Win 5 code duels', xp: 20, condition: (s) => (s.duelsWon || 0) >= 5 },
  { id: 'a23', name: 'Arena Legend', icon: '🏟️', description: 'Win 15 code duels', xp: 40, condition: (s) => (s.duelsWon || 0) >= 15 },
  { id: 'a24', name: 'Win Streak', icon: '⚡', description: 'Win 3 duels in a row', xp: 25, condition: (s) => { const h = s.duelHistory || []; return h.length >= 3 && h[0].result === 'win' && h[1].result === 'win' && h[2].result === 'win'; } },

  // Quiz mastery
  { id: 'a25', name: 'Quiz Whiz', icon: '📝', description: 'Pass 5 quizzes', xp: 15, condition: (s) => (s.quizzesPassed || []).length >= 5 },
  { id: 'a26', name: 'Quiz Master', icon: '🎓', description: 'Pass 20 quizzes', xp: 35, condition: (s) => (s.quizzesPassed || []).length >= 20 },

  // Assignments
  { id: 'a27', name: 'Extra Credit', icon: '📚', description: 'Complete 5 extra assignments', xp: 15, condition: (s) => (s.assignmentsDone || []).length >= 5 },
  { id: 'a28', name: 'Overachiever', icon: '🌟', description: 'Complete 20 extra assignments', xp: 35, condition: (s) => (s.assignmentsDone || []).length >= 20 },

  // Playground & Projects
  { id: 'a30', name: 'Lab Rat', icon: '🔬', description: 'Run code in the Code Lab 10 times', xp: 15, condition: (s) => s.playgroundRuns >= 10 },
  { id: 'a31', name: 'Project Star', icon: '⭐', description: 'Complete 3 projects', xp: 30, condition: (s) => s.projectsCompleted >= 3 },
  { id: 'a32', name: 'Project Legend', icon: '🌟', description: 'Complete 8 projects', xp: 60, condition: (s) => s.projectsCompleted >= 8 },

  // Tournament
  { id: 'a33', name: 'Tournament Rookie', icon: '🎪', description: 'Complete a tournament', xp: 20, condition: (s) => (s.tournamentRound || 0) >= 3 },
  { id: 'a34', name: 'Tournament Champion', icon: '🏅', description: 'Place top 3 in a tournament', xp: 50, condition: (s) => s.tournamentScore >= 80 },

  // Duel milestones
  { id: 'a35', name: 'Duel Beginner', icon: '🤺', description: 'Win your first duel', xp: 10, condition: (s) => (s.duelsWon || 0) >= 1 },
  { id: 'a36', name: 'Duel Master', icon: '🗡️', description: 'Win 25 duels', xp: 50, condition: (s) => (s.duelsWon || 0) >= 25 },
  { id: 'a37', name: 'Battle Tested', icon: '🛡️', description: 'Fight 50 total duels', xp: 40, condition: (s) => ((s.duelsWon || 0) + (s.duelsLost || 0)) >= 50 },

  // XP milestones
  { id: 'a38', name: 'Rising Star', icon: '🌠', description: 'Reach 250 XP', xp: 15, condition: (s) => s.totalXP >= 250 },
  { id: 'a39', name: 'XP Machine', icon: '⚙️', description: 'Reach 1000 XP', xp: 30, condition: (s) => s.totalXP >= 1000 },
  { id: 'a40', name: 'XP Titan', icon: '🗿', description: 'Reach 2000 XP', xp: 40, condition: (s) => s.totalXP >= 2000 },
  { id: 'a41', name: 'XP Immortal', icon: '👼', description: 'Reach 5000 XP', xp: 75, condition: (s) => s.totalXP >= 5000 },

  // Streak milestones
  { id: 'a42', name: 'Monthly Warrior', icon: '📅', description: 'Get a 30-day streak', xp: 100, condition: (s) => s.streak >= 30 },

  // Assignment mastery
  { id: 'a43', name: 'Homework Hero', icon: '📝', description: 'Complete 40 extra assignments', xp: 50, condition: (s) => (s.assignmentsDone || []).length >= 40 },

  // Ultimate
  { id: 'a11', name: 'Code Master', icon: '👑', description: 'Complete all 40 lessons', xp: 100, condition: (s) => s.lessonsCompleted >= 40 },
  { id: 'a20', name: 'Completionist', icon: '🏆', description: 'Complete all weeks AND pass all quizzes', xp: 150, condition: (s) => s.weekComplete && [1,2,3,4,5,6,7,8].every(w => s.weekComplete[w]) && (s.quizzesPassed || []).length >= 40 },
  { id: 'a29', name: 'True Wizard', icon: '🧙', description: 'Earn every other trophy', xp: 200, condition: (s) => { const count = ACHIEVEMENTS.filter(a => a.id !== 'a29' && a.condition(s)).length; return count >= ACHIEVEMENTS.length - 1; } },
];

const DAILY_QUESTS = [
  { text: 'Complete 1 lesson', xp: 10, check: (s) => s.todayLessons >= 1 },
  { text: 'Try a code challenge', xp: 15, check: (s) => s.todayChallenges >= 1 },
  { text: 'Use the Code Playground', xp: 10, check: (s) => s.todayPlayground },
  { text: 'Complete a mini project', xp: 20, check: (s) => s.todayProject },
  { text: 'Complete 2 lessons today', xp: 25, check: (s) => s.todayLessons >= 2 },
  { text: 'Pass a quiz on your first try', xp: 20, check: (s) => (s.quizzesPassed || []).length > 0 },
  { text: 'Win a code duel', xp: 20, check: (s) => (s.duelsWon || 0) > 0 },
  { text: 'Complete 3 code challenges', xp: 25, check: (s) => s.todayChallenges >= 3 },
  { text: 'Finish an extra assignment', xp: 15, check: (s) => (s.assignmentsDone || []).length > 0 },
  { text: 'Explore a Deep Dive resource', xp: 10, check: (s) => s.todayLessons >= 1 },
  { text: 'Earn 50+ XP today', xp: 15, check: (s) => { const t = new Date().toDateString(); return s.dailyLog && s.dailyLog[t] && s.dailyLog[t].xp >= 50; } },
  { text: 'Try a hard duel challenge', xp: 25, check: (s) => s.totalXP >= 800 && (s.duelsWon || 0) > 0 },
];

const PLAYGROUND_EXAMPLES = [
  { name: 'Hello World', code: '# Your first program!\nprint("Hello, World!")\nprint("I am learning Python!")' },
  { name: 'Calculator', code: '# Simple calculator\na = 15\nb = 7\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b:.2f}")' },
  { name: 'Pattern', code: '# Star pattern\nfor i in range(1, 6):\n    print("*" * i)\nprint()\nfor i in range(5, 0, -1):\n    print("*" * i)' },
  { name: 'Dice Roller', code: 'import random\n\nprint("🎲 Rolling dice...\\n")\nfor i in range(5):\n    d1 = random.randint(1, 6)\n    d2 = random.randint(1, 6)\n    total = d1 + d2\n    print(f"Roll {i+1}: {d1} + {d2} = {total}")' },
  { name: 'Fibonacci', code: '# Fibonacci sequence\na, b = 0, 1\nprint("Fibonacci sequence:")\nfor i in range(15):\n    print(a, end=" ")\n    a, b = b, a + b' },
  { name: 'Word Counter', code: 'text = "Python is an amazing programming language that is used by millions"\nwords = text.split()\nprint(f"Text: {text}")\nprint(f"Word count: {len(words)}")\nprint(f"Character count: {len(text)}")\nprint(f"Unique words: {len(set(words))}")' },
];

// ==================== MULTIPLAYER DATA ====================
const DUEL_CHALLENGES = {
  easy: [
    { id: 'e1', title: 'Sum It Up', description: 'Calculate the sum of numbers 1 to 10', timeLimit: 60, xp: 20,
      hint: 'Use a for loop or the sum() function',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/print\s*\(/g) >= 1 && (py.has('for') || py.has('sum')) ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Print the sum of 1-10' }; } },
    { id: 'e2', title: 'Even Counter', description: 'Count even numbers from 1 to 20', timeLimit: 60, xp: 20,
      hint: 'Use modulo (%) to check if even',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/print\s*\(/g) >= 1 && py.has('%') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use % 2 to find evens' }; } },
    { id: 'e3', title: 'Star Triangle', description: 'Print a right triangle of stars (5 rows)', timeLimit: 90, xp: 25,
      hint: 'Use string multiplication: "*" * i',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('*') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use a for loop with print("*" * i)' }; } },
    { id: 'e4', title: 'Max Finder', description: 'Find the largest number in a list', timeLimit: 60, xp: 20,
      hint: 'Use max() or loop through comparing',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/print\s*\(/g) >= 1 && (py.has('max') || py.has('for')) ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use max() or a loop to find the largest' }; } },
    { id: 'e5', title: 'Countdown', description: 'Print a countdown from 10 to 1, then "Liftoff!"', timeLimit: 60, xp: 20,
      hint: 'Use range(10, 0, -1) or a while loop',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.count(/print\s*\(/g) >= 1 && (py.has('for') || py.has('while')) ? { success: true, message: '✅ Liftoff!' } : { success: false, message: 'Use a loop to count down from 10' }; } },
    { id: 'e6', title: 'Hello Greeter', description: 'Create a function greet(name) that prints "Hello, [name]!"', timeLimit: 60, xp: 20,
      hint: 'def greet(name): print(f"Hello, {name}!")',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('greet') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Great function!' } : { success: false, message: 'Define a greet(name) function that prints a greeting' }; } },
    { id: 'e7', title: 'List Reverser', description: 'Reverse a list without using .reverse() or [::-1]', timeLimit: 90, xp: 25,
      hint: 'Build a new list by looping backwards with range(len(lst)-1, -1, -1)',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && !py.has('.reverse()') && !py.has('[::-1]') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Reversed!' } : { success: false, message: 'Use a loop to reverse (no .reverse() or [::-1])' }; } },
    { id: 'e8', title: 'Multiplication Table', description: 'Print the multiplication table for 7 (7x1 through 7x10)', timeLimit: 60, xp: 20,
      hint: 'Use a for loop: for i in range(1, 11): print(f"7 x {i} = {7*i}")',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('*') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Table complete!' } : { success: false, message: 'Use a for loop to print 7 times each number' }; } },
    { id: 'e9', title: 'Vowel Counter', description: 'Count the vowels in "Python is awesome"', timeLimit: 60, xp: 20,
      hint: 'Loop through each character and check if it\'s in "aeiouAEIOU"',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && (py.has('aeiou') || py.has('AEIOU') || py.has('vowel')) && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Vowels counted!' } : { success: false, message: 'Loop through the string checking for vowels' }; } },
    { id: 'e10', title: 'Average Calculator', description: 'Calculate the average of a list of 5 numbers', timeLimit: 60, xp: 20,
      hint: 'Use sum(numbers) / len(numbers)',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return (py.has('sum') || py.has('/')) && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Average calculated!' } : { success: false, message: 'Calculate sum/length and print the average' }; } },
  ],
  medium: [
    { id: 'm1', title: 'FizzBuzz', description: 'Print FizzBuzz for numbers 1-30', timeLimit: 120, xp: 35,
      hint: 'Check divisible by 15 first, then 5, then 3',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('if') && py.has('Fizz') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use if/elif for Fizz, Buzz, FizzBuzz' }; } },
    { id: 'm2', title: 'Palindrome Check', description: 'Check if a word is a palindrome', timeLimit: 120, xp: 35,
      hint: 'Reverse the string and compare: word == word[::-1]',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Create a function that returns True/False' }; } },
    { id: 'm3', title: 'Word Frequency', description: 'Count how many times each word appears in a sentence', timeLimit: 120, xp: 40,
      hint: 'Use a dictionary to store counts',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('{') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use a dictionary to count words' }; } },
    { id: 'm4', title: 'Prime Finder', description: 'Find all prime numbers up to 50', timeLimit: 150, xp: 40,
      hint: 'A prime is only divisible by 1 and itself',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('if') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Loop and check divisibility' }; } },
    { id: 'm5', title: 'Factorial Function', description: 'Write a function that calculates n! (factorial)', timeLimit: 90, xp: 35,
      hint: 'Factorial: 5! = 5 * 4 * 3 * 2 * 1 = 120. Use a loop or recursion.',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') && (py.has('for') || py.has('factorial')) ? { success: true, message: '✅ Factorial computed!' } : { success: false, message: 'Create a factorial function with def' }; } },
    { id: 'm6', title: 'Password Checker', description: 'Validate a password: 8+ chars, has uppercase, lowercase, and digit', timeLimit: 120, xp: 35,
      hint: 'Use .isupper(), .islower(), .isdigit() in a loop through characters',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && (py.has('upper') || py.has('lower') || py.has('digit')) ? { success: true, message: '✅ Secure validator!' } : { success: false, message: 'Create a function that checks length, uppercase, lowercase, and digits' }; } },
    { id: 'm7', title: 'Diamond Pattern', description: 'Print a diamond shape made of stars (5 rows wide)', timeLimit: 120, xp: 40,
      hint: 'Print spaces then stars. Top half grows, bottom half shrinks.',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('*') && py.has(' ') ? { success: true, message: '✅ Beautiful diamond!' } : { success: false, message: 'Use loops with spaces and stars to make the diamond' }; } },
    { id: 'm8', title: 'List Comprehension', description: 'Create a list of squares of even numbers from 1 to 20', timeLimit: 90, xp: 35,
      hint: 'Use [x**2 for x in range(1,21) if x % 2 == 0]',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('[') && py.has('for') && py.has('if') && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ List comprehension master!' } : { success: false, message: 'Use a list comprehension with a condition' }; } },
    { id: 'm9', title: 'Pig Latin', description: 'Convert a word to Pig Latin (move first letter to end + "ay")', timeLimit: 120, xp: 40,
      hint: 'word[1:] + word[0] + "ay"',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') && py.has('ay') ? { success: true, message: '✅ Igpay Atinlay!' } : { success: false, message: 'Create a function that moves first letter and adds "ay"' }; } },
    { id: 'm10', title: 'Number Pyramid', description: 'Print a number pyramid:\n1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5', timeLimit: 90, xp: 35,
      hint: 'Nested for loops: outer for row, inner for numbers in that row',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.count(/for/g) >= 2 && py.count(/print\s*\(/g) >= 1 ? { success: true, message: '✅ Pyramid built!' } : { success: false, message: 'Use nested for loops to build the pyramid' }; } },
  ],
  hard: [
    { id: 'h1', title: 'Caesar Cipher', description: 'Encrypt a message by shifting letters', timeLimit: 180, xp: 50,
      hint: 'Use ord() and chr() to shift characters',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && (py.has('ord') || py.has('chr') || py.has('for')) ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Create an encrypt function' }; } },
    { id: 'h2', title: 'Matrix Sum', description: 'Add two 3x3 matrices together', timeLimit: 180, xp: 50,
      hint: 'Use nested loops for rows and columns',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('for') && py.has('[') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use nested loops with 2D lists' }; } },
    { id: 'h3', title: 'Recursive Power', description: 'Calculate x^n using recursion (no ** operator)', timeLimit: 150, xp: 55,
      hint: 'Base case: n==0 returns 1. Recursive: x * power(x, n-1)',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') && !py.has('**') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use recursion, not the ** operator' }; } },
    { id: 'h4', title: 'Binary Converter', description: 'Convert decimal to binary without bin()', timeLimit: 180, xp: 55,
      hint: 'Repeatedly divide by 2 and collect remainders',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('while') ? { success: true, message: '✅ Correct!' } : { success: false, message: 'Use a while loop dividing by 2' }; } },
    { id: 'h5', title: 'Fibonacci Generator', description: 'Write a function that returns the nth Fibonacci number', timeLimit: 120, xp: 50,
      hint: 'fib(n): if n <= 1 return n, else return fib(n-1) + fib(n-2)',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') && (py.has('fib') || py.has('fibonacci')) ? { success: true, message: '✅ Fibonacci computed!' } : { success: false, message: 'Create a fibonacci function with recursion or a loop' }; } },
    { id: 'h6', title: 'Anagram Checker', description: 'Check if two words are anagrams of each other', timeLimit: 120, xp: 50,
      hint: 'Sort both words and compare, or count letter frequencies',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('return') && (py.has('sorted') || py.has('sort') || py.has('count')) ? { success: true, message: '✅ Anagram detected!' } : { success: false, message: 'Create a function that compares sorted letters' }; } },
    { id: 'h7', title: 'Roman Numerals', description: 'Convert a number (1-100) to Roman numerals', timeLimit: 180, xp: 55,
      hint: 'Use a list of (value, numeral) pairs: [(100,"C"),(90,"XC"),(50,"L"),...] and subtract',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('while') && (py.has('X') || py.has('V') || py.has('I')) ? { success: true, message: '✅ Roman conversion!' } : { success: false, message: 'Create a function with Roman numeral values' }; } },
    { id: 'h8', title: 'Flatten Nested List', description: 'Flatten [[1,2],[3,[4,5]],6] into [1,2,3,4,5,6]', timeLimit: 150, xp: 55,
      hint: 'Use recursion: if element is a list, flatten it; otherwise append it',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && py.has('return') ? { success: true, message: '✅ Flattened!' } : { success: false, message: 'Create a recursive flatten function' }; } },
    { id: 'h9', title: 'Word Scrambler', description: 'Scramble the middle letters of each word (keep first/last)', timeLimit: 150, xp: 50,
      hint: 'For each word: keep word[0], shuffle word[1:-1], keep word[-1]',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('def') && py.has('for') && py.has('random') ? { success: true, message: '✅ Scrambled!' } : { success: false, message: 'Create a function that scrambles middle letters' }; } },
    { id: 'h10', title: 'Collatz Conjecture', description: 'Count steps to reach 1: if even n/2, if odd 3n+1', timeLimit: 120, xp: 50,
      hint: 'while n != 1: if n % 2 == 0: n = n // 2 else: n = 3 * n + 1; count steps',
      validator: (code) => { const py = pyCheck(code); if (!py.syntaxOk()) return { success: false, message: SYNTAX_ERR }; return py.has('while') && py.has('if') && py.has('%') ? { success: true, message: '✅ Collatz solved!' } : { success: false, message: 'Use a while loop with even/odd checks' }; } },
  ]
};

const DUEL_BOTS = [
  { name: 'ByteBot', avatar: '🤖', speed: 0.6, accuracy: 0.7 },
  { name: 'CodeNinja', avatar: '🥷', speed: 0.75, accuracy: 0.8 },
  { name: 'AlgoKing', avatar: '👾', speed: 0.85, accuracy: 0.85 },
  { name: 'MegaMind', avatar: '🧠', speed: 0.9, accuracy: 0.9 },
  { name: 'PyMaster', avatar: '🐍', speed: 0.95, accuracy: 0.95 },
];

const COOP_PROJECTS = [
  { id: 'coop1', title: 'Space Invaders', icon: '👾', description: 'Build a text-based space shooter together! One person writes the player, another writes the aliens.', difficulty: 'medium', xp: 80, players: '2-3', status: 'open' },
  { id: 'coop2', title: 'Weather Dashboard', icon: '🌤️', description: 'Create a weather data analyzer. Split into data, processing, and display modules.', difficulty: 'medium', xp: 90, players: '2-4', status: 'open' },
  { id: 'coop3', title: 'RPG World Builder', icon: '🏰', description: 'Design an RPG world with towns, NPCs, quests, and combat!', difficulty: 'hard', xp: 120, players: '3-5', status: 'open' },
  { id: 'coop4', title: 'School Management System', icon: '🏫', description: 'Build a system to manage students, classes, grades, and attendance.', difficulty: 'hard', xp: 100, players: '2-4', status: 'open' },
];

const TOURNAMENT_DATA = {
  name: 'Summer Code Championship',
  description: 'Solve 3 challenges. Fastest total time wins!',
  rounds: 3,
  xpPrizes: { first: 200, second: 120, third: 80 },
  challenges: ['FizzBuzz Plus', 'Pattern Maker', 'Data Cruncher'],
};
