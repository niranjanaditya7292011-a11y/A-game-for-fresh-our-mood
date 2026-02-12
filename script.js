let player = document.getElementById("player");
let game = document.getElementById("game");
let scoreEl = document.getElementById("score");
let timeEl = document.getElementById("time");
let highScoreEl = document.getElementById("highScore");
let hitSound = document.getElementById("hitSound");
let gameOverText = document.getElementById("gameOver");

let score = 0;
let time = 0;
let speed = 3;
let gameRunning = true;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.innerText = highScore;

/* ⌨️ KEYBOARD CONTROL */
document.addEventListener("keydown", e => {
  if (!gameRunning) return;

  let left = player.offsetLeft;

  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = left - 20 + "px";
  }
  if (e.key === "ArrowRight" && left < 250) {
    player.style.left = left + 20 + "px";
  }
});

/* ⏱ TIMER */
setInterval(() => {
  if (gameRunning) {
    time++;
    timeEl.innerText = time;
  }
}, 1000);

/* 🔴 CREATE ENEMY */
function createEnemy() {
  if (!gameRunning) return;

  let enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 250) + "px";
  game.appendChild(enemy);

  let fall = setInterval(() => {
    let enemyTop = enemy.offsetTop;
    enemy.style.top = enemyTop + speed + "px";

    /* ❌ GAME OVER CONDITION */
    if (collision(enemy, player)) {
      hitSound.play();
      gameOver();
      clearInterval(fall);
    }

    /* ✅ SCORE INCREASE */
    if (enemyTop > 400) {
      enemy.remove();
      score++;
      scoreEl.innerText = score;
      clearInterval(fall);
    }
  }, 20);
}

setInterval(createEnemy, 1200);

/* 💥 COLLISION DETECTION */
function collision(a, b) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

/* 🛑 GAME OVER */
function gameOver() {
  gameRunning = false;
  gameOverText.style.display = "block";

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScoreEl.innerText = score;
  }
}

/* 🔄 RESTART */
function restart() {
  location.reload();
}
