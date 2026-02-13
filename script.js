const player = document.getElementById("player");
const enemy = document.querySelector(".enemy");
const gameArea = document.getElementById("gameArea");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const healthBar = document.getElementById("healthBar");

const gunSound = document.getElementById("gunSound");
const outSound = document.getElementById("outSound");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let health = 100;
let gameRunning = true;

highScoreEl.innerText = highScore;

// PLAYER MOVE (KEYBOARD)
document.addEventListener("keydown", e => {
  if (!gameRunning) return;
  let x = player.offsetLeft;
  let y = player.offsetTop;

  if (e.key === "ArrowLeft" && x > 0) player.style.left = x - 10 + "px";
  if (e.key === "ArrowRight" && x < 290) player.style.left = x + 10 + "px";
  if (e.key === "ArrowUp" && y > 0) player.style.top = y - 10 + "px";
  if (e.key === "ArrowDown" && y < 390) player.style.top = y + 10 + "px";
  if (e.key === " ") fireBullet();
});

// PLAYER FIRE
function fireBullet() {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = player.offsetLeft + 12 + "px";
  bullet.style.top = player.offsetTop + "px";
  gameArea.appendChild(bullet);
  gunSound.play();

  let interval = setInterval(() => {
    bullet.style.top = bullet.offsetTop - 10 + "px";

    if (bullet.offsetTop < 0) {
      bullet.remove();
      clearInterval(interval);
    }

    if (collision(bullet, enemy)) {
      bullet.remove();
      score++;
      scoreEl.innerText = score;
      enemy.style.left = Math.random() * 280 + "px";
      enemy.style.top = "10px";
      clearInterval(interval);
    }
  }, 30);
}

// ENEMY FIRE
setInterval(() => {
  if (!gameRunning) return;

  const eBullet = document.createElement("div");
  eBullet.className = "bullet enemyBullet";
  eBullet.style.left = enemy.offsetLeft + 12 + "px";
  eBullet.style.top = enemy.offsetTop + 20 + "px";
  gameArea.appendChild(eBullet);

  let i = setInterval(() => {
    eBullet.style.top = eBullet.offsetTop + 6 + "px";

    if (collision(eBullet, player)) {
      eBullet.remove();
      health -= 20;
      healthBar.style.width = health + "%";
      clearInterval(i);

      if (health <= 0) gameOver();
    }
  }, 40);
}, 1200);

// COLLISION
function collision(a, b) {
  return (
    a.offsetLeft < b.offsetLeft + 30 &&
    a.offsetLeft + 5 > b.offsetLeft &&
    a.offsetTop < b.offsetTop + 30 &&
    a.offsetTop + 10 > b.offsetTop
  );
}

// GAME OVER
function gameOver() {
  gameRunning = false;
  outSound.play();
  document.getElementById("gameOver").style.display = "block";

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }
}

// RESTART
function restartGame() {
  location.reload();
}

/*
(FUTURE UPGRADE)
- 🤖 Smart Enemy AI
- 🗺 Levels & Maps
- 🌐 Multiplayer
- 📱 Better Joystick UI
*/
