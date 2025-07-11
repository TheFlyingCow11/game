// --- קוד בחירת מצב משחק --- //
let gameMode = 1; // 1: רגיל, 2: מחליק, 3: 4 כיוונים
let gameStarted = false;

function createGameModeMenu() {
  const menu = document.createElement('div');
  menu.id = 'gamemode-menu';
  menu.style.position = 'fixed';
  menu.style.left = 0;
  menu.style.top = 0;
  menu.style.width = '100vw';
  menu.style.height = '100vh';
  menu.style.background = 'rgba(0,0,0,0.85)';
  menu.style.zIndex = 1000;
  menu.style.display = 'flex';
  menu.style.flexDirection = 'column';
  menu.style.alignItems = 'center';
  menu.style.justifyContent = 'center';
  menu.style.color = 'white';
  menu.innerHTML = `
    <h2>בחר מצב משחק:</h2>
    <button style="font-size:2em;margin:10px;" data-mode="1">רגיל</button>
    <button style="font-size:2em;margin:10px;" data-mode="2">מפה מחליקה</button>
    <button style="font-size:2em;margin:10px;" data-mode="3">ארבעה כיוונים בלבד</button>
  `;
  document.body.appendChild(menu);

  menu.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      gameMode = parseInt(btn.getAttribute('data-mode'));
      menu.remove();
      startGame();
    };
  });
}

window.onload = createGameModeMenu;

// --- סוף קוד תפריט ---

// --- קוד ג'ויסטיקים עם מיקומים חדשים --- //
const joystick1 = document.createElement('div');
const joystick2 = document.createElement('div');
const stick1 = document.createElement('div');
const stick2 = document.createElement('div');

// אדום - פינה ימנית עליונה
Object.assign(joystick1.style, {
  position: 'fixed',
  right: '30px',
  top: '30px',
  width: '100px',
  height: '100px',
  background: 'rgba(200,200,200,0.1)',
  borderRadius: '50%',
  zIndex: 10,
  touchAction: 'none',
});
Object.assign(joystick2.style, {
  position: 'fixed',
  left: '30px',
  bottom: '30px',
  width: '100px',
  height: '100px',
  background: 'rgba(200,200,200,0.1)',
  borderRadius: '50%',
  zIndex: 10,
  touchAction: 'none',
});
Object.assign(stick1.style, {
  position: 'absolute',
  left: '35px',
  top: '35px',
  width: '30px',
  height: '30px',
  background: 'rgba(255,0,0,0.5)',
  borderRadius: '50%',
  zIndex: 11,
  pointerEvents: 'none',
});
Object.assign(stick2.style, {
  position: 'absolute',
  left: '35px',
  top: '35px',
  width: '30px',
  height: '30px',
  background: 'rgba(0,255,0,0.5)',
  borderRadius: '50%',
  zIndex: 11,
  pointerEvents: 'none',
});
joystick1.appendChild(stick1);
joystick2.appendChild(stick2);
document.body.appendChild(joystick1);
document.body.appendChild(joystick2);

let joy1Active = false, joy2Active = false;
let joy1Start = { x: 0, y: 0 }, joy2Start = { x: 0, y: 0 };
let joy1Val = { x: 0, y: 0 }, joy2Val = { x: 0, y: 0 };

joystick1.addEventListener('touchstart', e => {
  e.preventDefault();
  joy1Active = true;
  const t = e.targetTouches[0];
  const rect = joystick1.getBoundingClientRect();
  joy1Start.x = t.clientX - rect.left;
  joy1Start.y = t.clientY - rect.top;
}, { passive: false });

joystick1.addEventListener('touchmove', e => {
  if (!joy1Active) return;
  const t = e.targetTouches[0];
  const rect = joystick1.getBoundingClientRect();
  let dx = t.clientX - rect.left - joy1Start.x;
  let dy = t.clientY - rect.top - joy1Start.y;
  const max = 35;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > max) {
    dx = dx / dist * max;
    dy = dy / dist * max;
  }
  if (gameMode === 3) { // 4-כיוונים בלבד
    // בוחרים את הכיוון הראשי
    if (Math.abs(dx) > Math.abs(dy)) {
      dy = 0;
      dx = Math.sign(dx) * max;
    } else {
      dx = 0;
      dy = Math.sign(dy) * max;
    }
  }
  stick1.style.left = 35 + dx + 'px';
  stick1.style.top = 35 + dy + 'px';
  joy1Val.x = dx / max;
  joy1Val.y = dy / max;
}, { passive: false });

joystick1.addEventListener('touchend', e => {
  joy1Active = false;
  stick1.style.left = '35px';
  stick1.style.top = '35px';
  // מצב מחליק - לא אפס מאפס
  if (gameMode === 2) return;
  joy1Val.x = 0;
  joy1Val.y = 0;
}, { passive: false });

joystick2.addEventListener('touchstart', e => {
  e.preventDefault();
  joy2Active = true;
  const t = e.targetTouches[0];
  const rect = joystick2.getBoundingClientRect();
  joy2Start.x = t.clientX - rect.left;
  joy2Start.y = t.clientY - rect.top;
}, { passive: false });

joystick2.addEventListener('touchmove', e => {
  if (!joy2Active) return;
  const t = e.targetTouches[0];
  const rect = joystick2.getBoundingClientRect();
  let dx = t.clientX - rect.left - joy2Start.x;
  let dy = t.clientY - rect.top - joy2Start.y;
  const max = 35;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > max) {
    dx = dx / dist * max;
    dy = dy / dist * max;
  }
  if (gameMode === 3) { // 4-כיוונים בלבד
    if (Math.abs(dx) > Math.abs(dy)) {
      dy = 0;
      dx = Math.sign(dx) * max;
    } else {
      dx = 0;
      dy = Math.sign(dy) * max;
    }
  }
  stick2.style.left = 35 + dx + 'px';
  stick2.style.top = 35 + dy + 'px';
  joy2Val.x = dx / max;
  joy2Val.y = dy / max;
}, { passive: false });

joystick2.addEventListener('touchend', e => {
  joy2Active = false;
  stick2.style.left = '35px';
  stick2.style.top = '35px';
  if (gameMode === 2) return;
  joy2Val.x = 0;
  joy2Val.y = 0;
}, { passive: false });

// --- סוף קוד ג'ויסטיקים --- //

// --- משתנים גלובליים למשחק --- //
let p1, p2, projectiles, orbs, keys, lastKeyDown = {}, lastKeyOrder = [];

function startGame() {
  gameStarted = true;
  p1 = new Player(100, canvas.height / 2, 'red');
  p2 = new Player(canvas.width - 100, canvas.height / 2, 'green');
  projectiles = [];
  orbs = [];
  keys = {};
  lastKeyDown = {};
  lastKeyOrder = [];

  setInterval(spawnOrb, 2000);
  requestAnimationFrame(gameLoop);
}

// --- קוד משחק --- //
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.color = color;
    this.hitCount = 0;
    this.id = color === 'red' ? 1 : 2;
    // מצב מחליק
    this.vx = 0;
    this.vy = 0;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  isHitBy(projectile) {
    const dx = this.x - projectile.x;
    const dy = this.y - projectile.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    return dist < this.radius + projectile.radius;
  }
}

class Projectile {
  constructor(x, y, vx, vy, ownerId) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 10;
    this.ownerId = ownerId; // מזהה השחקן שירה
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnOrb() {
  if (!gameStarted) return;
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
  orbs.push({ x, y, radius: 15, shotBy: null });
}

// --- תמיכה במקלדת: 4 כיוונים בלבד ולחיצה כפולה --- //
window.addEventListener('keydown', e => {
  if (!gameStarted) return;
  if (!lastKeyDown[e.key]) {
    lastKeyOrder.push(e.key);
    lastKeyDown[e.key] = true;
  }
  keys[e.key] = true;
});
window.addEventListener('keyup', e => {
  if (!gameStarted) return;
  keys[e.key] = false;
  lastKeyDown[e.key] = false;
  // מסירים מהמיקום של הסדר
  lastKeyOrder = lastKeyOrder.filter(k => k !== e.key);
});

function shoot(from, to, shooterId) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mag = Math.sqrt(dx*dx + dy*dy);
  if (mag === 0) return;
  const speed = 7;
  const vx = (dx / mag) * speed;
  const vy = (dy / mag) * speed;
  projectiles.push(new Projectile(from.x, from.y, vx, vy, shooterId));
}

function wrapPlayer(player) {
  // Pacman map wrapping
  if (player.x < -player.radius) {
    player.x = canvas.width + player.radius;
  }
  if (player.x > canvas.width + player.radius) {
    player.x = -player.radius;
  }
  if (player.y < -player.radius) {
    player.y = canvas.height + player.radius;
  }
  if (player.y > canvas.height + player.radius) {
    player.y = -player.radius;
  }
}

// --- לוגיקת משחק עיקרית --- //
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- תנועה עם ג'ויסטיקים ומקלדת לפי מצב ---
  let p1MoveY = 0, p1MoveX = 0, p2MoveY = 0, p2MoveX = 0;

  // מצב רגיל או 4 כיוונים
  if (gameMode === 1 || gameMode === 3) {
    // שחקן 1
    if (Math.abs(joy1Val.y) > 0.2) {
      p1MoveY = joy1Val.y * 5;
    } else if (gameMode === 1) {
      if (keys['w']) p1MoveY -= 5;
      if (keys['s']) p1MoveY += 5;
    }
    if (Math.abs(joy1Val.x) > 0.2) {
      p1MoveX = joy1Val.x * 5;
    } else if (gameMode === 1) {
      if (keys['a']) p1MoveX -= 5;
      if (keys['d']) p1MoveX += 5;
    }
    if (gameMode === 3) {
      // רק כיוון אחד מהמקלדת: הראשון שנלחץ
      if (lastKeyOrder.length > 0) {
        const k = lastKeyOrder[0];
        // W S A D
        if (k === 'w') { p1MoveY = -5; p1MoveX = 0; }
        if (k === 's') { p1MoveY = 5; p1MoveX = 0; }
        if (k === 'a') { p1MoveY = 0; p1MoveX = -5; }
        if (k === 'd') { p1MoveY = 0; p1MoveX = 5; }
      }
    }

    // שחקן 2
    if (Math.abs(joy2Val.y) > 0.2) {
      p2MoveY = joy2Val.y * 5;
    } else if (gameMode === 1) {
      if (keys['ArrowUp']) p2MoveY -= 5;
      if (keys['ArrowDown']) p2MoveY += 5;
    }
    if (Math.abs(joy2Val.x) > 0.2) {
      p2MoveX = joy2Val.x * 5;
    } else if (gameMode === 1) {
      if (keys['ArrowLeft']) p2MoveX -= 5;
      if (keys['ArrowRight']) p2MoveX += 5;
    }
    if (gameMode === 3) {
      // רק כיוון אחד מהמקלדת: הראשון שנלחץ
      if (lastKeyOrder.length > 0) {
        const k = lastKeyOrder[0];
        if (k === 'ArrowUp')    { p2MoveY = -5; p2MoveX = 0; }
        if (k === 'ArrowDown')  { p2MoveY = 5;  p2MoveX = 0; }
        if (k === 'ArrowLeft')  { p2MoveY = 0;  p2MoveX = -5; }
        if (k === 'ArrowRight') { p2MoveY = 0;  p2MoveX = 5; }
      }
    }
    p1.x += p1MoveX; p1.y += p1MoveY;
    p2.x += p2MoveX; p2.y += p2MoveY;
  }

  // מצב מחליק
  if (gameMode === 2) {
    // שחקן 1
    if (Math.abs(joy1Val.y) > 0.
