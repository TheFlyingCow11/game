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
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 10;
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
  orbs.push({ x, y, radius: 15 });
}
setInterval(spawnOrb, 2000);

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function shoot(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mag = Math.sqrt(dx*dx + dy*dy);
  const speed = 7;
  const vx = (dx / mag) * speed;
  const vy = (dy / mag) * speed;
  projectiles.push(new Projectile(from.x, from.y, vx, vy));
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // תנועה
  if (keys['w']) p1.y -= 5;
  if (keys['s']) p1.y += 5;
  if (keys['ArrowUp']) p2.y -= 5;
  if (keys['ArrowDown']) p2.y += 5;

  // גבולות מסך
  p1.y = Math.max(p1.radius, Math.min(canvas.height - p1.radius, p1.y));
  p2.y = Math.max(p2.radius, Math.min(canvas.height - p2.radius, p2.y));

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

    // בדיקת התנגשות עם שחקן
    for (let player of [p1, p2]) {
      const dx = orb.x - player.x;
      const dy = orb.y - player.y;
      if (Math.sqrt(dx*dx + dy*dy) < orb.radius + player.radius) {
        // ירי!
        const target = player === p1 ? p2 : p1;
        shoot(player, target);
        orbs.splice(i, 1);
        break;
      }
    }
  }

  // תזוזת קליעים
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.move();
    proj.draw();

    // פגיעה
    for (let player of [p1, p2]) {
      if (player.isHitBy(proj)) {
        player.hitCount++;
        projectiles.splice(i, 1);
        break;
      }
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
