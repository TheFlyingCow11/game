// --- קוד ג'ויסטיקים --- //
const joystick1 = document.createElement('div');
const joystick2 = document.createElement('div');
const stick1 = document.createElement('div');
const stick2 = document.createElement('div');

Object.assign(joystick1.style, {
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
Object.assign(joystick2.style, {
  position: 'fixed',
  right: '30px',
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
  stick1.style.left = 35 + dx + 'px';
  stick1.style.top = 35 + dy + 'px';
  joy1Val.x = dx / max;
  joy1Val.y = dy / max;
}, { passive: false });

joystick1.addEventListener('touchend', e => {
  joy1Active = false;
  stick1.style.left = '35px';
  stick1.style.top = '35px';
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
  stick2.style.left = 35 + dx + 'px';
  stick2.style.top = 35 + dy + 'px';
  joy2Val.x = dx / max;
  joy2Val.y = dy / max;
}, { passive: false });

joystick2.addEventListener('touchend', e => {
  joy2Active = false;
  stick2.style.left = '35px';
  stick2.style.top = '35px';
  joy2Val.x = 0;
  joy2Val.y = 0;
}, { passive: false });

// --- סוף קוד ג'ויסטיקים --- //

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

let p1 = new Player(100, canvas.height / 2, 'red');
let p2 = new Player(canvas.width - 100, canvas.height / 2, 'green');
let projectiles = [];
let orbs = [];

function spawnOrb() {
  const x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
  const y = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
  orbs.push({ x, y, radius: 15, shotBy: null });
}
setInterval(spawnOrb, 2000);

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- תנועה עם ג'ויסטיקים (או מקשים), גם רוחב וגם גובה ---
  // שחקן 1
  let p1MoveY = 0, p1MoveX = 0;
  if (Math.abs(joy1Val.y) > 0.2) {
    p1MoveY = joy1Val.y * 5;
  } else {
    if (keys['w']) p1MoveY -= 5;
    if (keys['s']) p1MoveY += 5;
  }
  if (Math.abs(joy1Val.x) > 0.2) {
    p1MoveX = joy1Val.x * 5;
  } else {
    if (keys['a']) p1MoveX -= 5;
    if (keys['d']) p1MoveX += 5;
  }
  p1.x += p1MoveX;
  p1.y += p1MoveY;

  // שחקן 2
  let p2MoveY = 0, p2MoveX = 0;
  if (Math.abs(joy2Val.y) > 0.2) {
    p2MoveY = joy2Val.y * 5;
  } else {
    if (keys['ArrowUp']) p2MoveY -= 5;
    if (keys['ArrowDown']) p2MoveY += 5;
  }
  if (Math.abs(joy2Val.x) > 0.2) {
    p2MoveX = joy2Val.x * 5;
  } else {
    if (keys['ArrowLeft']) p2MoveX -= 5;
    if (keys['ArrowRight']) p2MoveX += 5;
  }
  p2.x += p2MoveX;
  p2.y += p2MoveY;

  // גבולות מסך
  p1.y = Math.max(p1.radius, Math.min(canvas.height - p1.radius, p1.y));
  p1.x = Math.max(p1.radius, Math.min(canvas.width - p1.radius, p1.x));
  p2.y = Math.max(p2.radius, Math.min(canvas.height - p2.radius, p2.y));
  p2.x = Math.max(p2.radius, Math.min(canvas.width - p2.radius, p2.x));

  // ציור שחקנים
  p1.draw();
  p2.draw();

  // ציור כדורים כתומים
  for (let i = orbs.length - 1; i >= 0; i--) {
    const orb = orbs[i];
    ctx.beginPath();
    ctx.fillStyle = 'orange';
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();

    // רק אם הכדור עדיין לא נורה (shotBy === null) נבדוק התנגשות עם שחקן
    if (orb.shotBy === null) {
      if (Math.sqrt((orb.x - p1.x) ** 2 + (orb.y - p1.y) ** 2) < orb.radius + p1.radius) {
        // שחקן 1 ירה את הכדור על שחקן 2
        shoot(p1, p2, p1.id);
        orb.shotBy = p1.id;
      } else if (Math.sqrt((orb.x - p2.x) ** 2 + (orb.y - p2.y) ** 2) < orb.radius + p2.radius) {
        // שחקן 2 ירה את הכדור על שחקן 1
        shoot(p2, p1, p2.id);
        orb.shotBy = p2.id;
      }
    }
  }

  // תזוזת קליעים
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.move();
    proj.draw();

    // פגיעה: קליע לא פוגע ביורה שלו, רק ביריב!
    if (proj.ownerId !== p1.id && p1.isHitBy(proj)) {
      p1.hitCount++;
      projectiles.splice(i, 1);
      continue;
    }
    if (proj.ownerId !== p2.id && p2.isHitBy(proj)) {
      p2.hitCount++;
      projectiles.splice(i, 1);
      continue;
    }
    // מחיקה אם יצא מהמסך
    if (proj.x < -50 || proj.x > canvas.width + 50 || proj.y < -50 || proj.y > canvas.height + 50) {
      projectiles.splice(i, 1);
    }
  }

  // הסרה של כדורים כתומים שכבר נורו (shotBy !== null)
  for (let i = orbs.length - 1; i >= 0; i--) {
    if (orbs[i].shotBy !== null) {
      orbs.splice(i, 1);
    }
  }

  // בדיקת ניצחון
  if (p1.hitCount >= 3) {
    alert('הירוק ניצח!');
    document.location.reload();
  } else if (p2.hitCount >= 3) {
    alert('האדום ניצח!');
    document.location.reload();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
