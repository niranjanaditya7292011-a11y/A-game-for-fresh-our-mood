const game = document.getElementById("game");
const player = document.getElementById("player");

let score = 0;
let health = 100;
let time = 60;
let highScore = localStorage.getItem("high") || 0;

document.getElementById("highScore").innerText = highScore;

let playerX = 160;
let gameOver = false;

// 🔫 SHOOT
function shoot() {
  if (gameOver) return;

  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = playerX + 17 + "px";
  bullet.style.bottom = "50px";
  game.appendChild(bullet);

  document.getElementById("gunSound").play();

  let move = setInterval(() => {
    bullet.style.bottom =
      parseInt(bullet.style.bottom) + 10 + "px";

    document.querySelectorAll(".enemy").forEach(enemy => {
      if (
        bullet.getBoundingClientRect().top <
        enemy.getBoundingClientRect().bottom &&
        bullet.getBoundingClientRect().left <
        enemy.getBoundingClientRect().right &&
        bullet.getBoundingClientRect().right >
        enemy.getBoundingClientRect().left
      ) {
        enemy.remove();
        bullet.remove();
        score++;
        document.getElementById("score").innerText = score;
      }
    });

    if (parseInt(bullet.style.bottom) > 500) {
      bullet.remove();
      clearInterval(move);
    }
  }, 30);
}

// 🤖 ENEMY AI
function spawnEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.left = Math.random() * 320 + "px";
  game.appendChild(enemy);

  let fall = setInterval(() => {
    enemy.style.top =
      (enemy.offsetTop || 0) + 3 + "px";

    if (enemy.offsetTop > 460) {
      health -= 20;
      document.getElementById("health").innerText = health;
      enemy.remove();
      clearInterval(fall);

      if (health <= 0) endGame();
    }
  }, 40);
}

// ⏱ TIMER
let timer = setInterval(() => {
  if (gameOver) return;
  time--;
  document.getElementById("time").innerText = time;
  if (time <= 0) endGame();
}, 1000);

// 🕹 KEYBOARD
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= 20;
  if (e.key === "ArrowRight" && playerX < 320) playerX += 20;
  if (e.key === " ") shoot();
  player.style.left = playerX + "px";
});

// 📱 MOBILE CONTROLS
left.onclick = () => { if (playerX > 0) playerX -= 20; player.style.left = playerX + "px"; };
right.onclick = () => { if (playerX < 320) playerX += 20; player.style.left = playerX + "px"; };
shootBtn = document.getElementById("shoot");
shootBtn.onclick = shoot;

// 🔁 SPAWN LOOP
setInterval(spawnEnemy, 1200);

// 💀 GAME OVER
function endGame() {
  gameOver = true;
  if (score > highScore) {
    localStorage.setItem("high", score);
  }

  game.innerHTML = `
    <h3>GAME OVER</h3>
    <p>tere bas ki baat nahi hai 😎</p>
    <p>ja kar padhai kar</p>
    <a href="https://viveklearn.vercel.app/ " target="_blank" style="color:yellow">
      yehe link khol
    </a>
  `;
}

// 🔄 RESTART
restart.onclick = () => location.reload();
