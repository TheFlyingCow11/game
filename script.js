// ... קוד הג'ויסטיקים מהתגובה הקודמת נשאר בדיוק כמו שהוא ...

// המשך הקוד שלך...

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
  constructor(x, y, vx, vy, owner) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 10;
    this.owner = owner; // מזהה של השחקן שירה
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
  orbs.push({ x, y, radius: 15, owner: null }); // owner=null בהתחלה
}
setInterval(spawnOrb, 2000);

let keys = {};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

function shoot(from, to, shooter) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mag = Math.sqrt(dx*dx + dy*dy);
  const speed = 7;
  const vx = (dx / mag) * speed;
  const vy = (dy / mag) * speed;
  projectiles.push(new Projectile(from.x, from.y, vx, vy, shooter)); // שמירת היורה
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // תנועה עם ג'ויסטיקים (או מקשים)
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

    // בדיקת התנגשות עם שחקן
    for (let idx = 0; idx < 2; idx++) {
      const player = idx === 0 ? p1 : p2;
      // אם הכדור לא נגע בשחקן הזה
      if (orb.owner === null && Math.sqrt((orb.x - player.x) ** 2 + (orb.y - player.y) ** 2) < orb.radius + player.radius) {
        // ירי!
        const target = player === p1 ? p2 : p1;
        shoot(player, target, idx + 1); // 1=אדום, 2=ירוק
        orb.owner = idx + 1; // משייכים את הכדור לשחקן שנגע בו
        break;
      }
    }
  }

  // תזוזת קליעים
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.move();
    proj.draw();

    // פגיעה, רק אם לא פוגע ביורה
    if (proj.owner !== 1 && p1.isHitBy(proj)) {
      p1.hitCount++;
      projectiles.splice(i, 1);
      continue;
    }
    if (proj.owner !== 2 && p2.isHitBy(proj)) {
      p2.hitCount++;
      projectiles.splice(i, 1);
      continue;
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
