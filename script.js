 const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");
const gameOverBox = document.getElementById("gameOver");

let score = 0;
let high = localStorage.getItem("high") || 0;
let health = 3;
let gameRunning = true;
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function movePlayer() {
  if (!gameRunning) return;
  let x = player.offsetLeft;
  let y = player.offsetTop;

  if (keys["ArrowLeft"] && x > 0) player.style.left = x - 4 + "px";
  if (keys["ArrowRight"] && x < 290) player.style.left = x + 4 + "px";
  if (keys["ArrowUp"] && y > 0) player.style.top = y - 4 + "px";
  if (keys["ArrowDown"] && y < 390) player.style.top = y + 4 + "px";
}

setInterval(movePlayer, 20);

document.getElementById("fireBtn").addEventListener("touchstart", shoot);
document.addEventListener("keydown", e => { if (e.key === " ") shoot(); });

function shoot() {
  if (!gameRunning) return;
  document.getElementById("shootSound").play();

  let bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = player.offsetLeft + 12 + "px";
  bullet.style.top = player.offsetTop + "px";
  game.appendChild(bullet);

  let move = setInterval(() => {
    bullet.style.top = bullet.offsetTop - 6 + "px";
    enemies.forEach(e => {
      if (hit(bullet, e)) {
        e.remove();
        bullet.remove();
        score++;
        updateScore();
      }
    });
    if (bullet.offsetTop < 0) {
      bullet.remove();
      clearInterval(move);
    }
  }, 20);
}

let enemies = [];

function spawnEnemy() {
  if (!gameRunning) return;
  let e = document.createElement("div");
  e.className = "enemy";
  e.style.left = Math.random() * 290 + "px";
  e.style.top = "0px";
  game.appendChild(e);
  enemies.push(e);

  let move = setInterval(() => {
    if (!gameRunning) return;
    e.style.top = e.offsetTop + 1 + "px";

    if (Math.random() < 0.01) enemyShoot(e);

    if (hit(e, player)) {
      damage();
      e.remove();
      clearInterval(move);
    }
  }, 30);
}

function enemyShoot(enemy) {
  let b = document.createElement("div");
  b.className = "bullet enemyBullet";
  b.style.left = enemy.offsetLeft + "px";
  b.style.top = enemy.offsetTop + "px";
  game.appendChild(b);

  let mv = setInterval(() => {
    b.style.top = b.offsetTop + 5 + "px";
    if (hit(b, player)) {
      damage();
      b.remove();
      clearInterval(mv);
    }
    if (b.offsetTop > 420) {
      b.remove();
      clearInterval(mv);
    }
  }, 20);
}

function damage() {
  health--;
  healthEl.innerText = "❤️".repeat(health);
  if (health <= 0) endGame();
}

function endGame() {
  gameRunning = false;
  document.getElementById("outSound").play();
  gameOverBox.style.display = "block";

  // (and enemy is firing, player firing and when the game over then writ tere bas ki bat nahi hai jaker padhai ker yehe link khol and sound of out)
}

function restartGame() {
  location.reload();
}

function updateScore() {
  high = Math.max(score, high);
  localStorage.setItem("high", high);
  scoreEl.innerText = `Score: ${score} | High: ${high}`;
}

function hit(a, b) {
  return a.offsetLeft < b.offsetLeft + 30 &&
         a.offsetLeft + 10 > b.offsetLeft &&
         a.offsetTop < b.offsetTop + 30 &&
         a.offsetTop + 10 > b.offsetTop;
}

setInterval(spawnEnemy, 1200);
