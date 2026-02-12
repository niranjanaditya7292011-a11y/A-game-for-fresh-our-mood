let player = document.getElementById("player");
let target = document.getElementById("target");
let scoreEl = document.getElementById("score");
let timeEl = document.getElementById("time");
let highScoreEl = document.getElementById("highScore");
let sound = document.getElementById("hit");

let x = 130, y = 130;
let score = 0;
let time = 30;
let speed = 10;
let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = highScore;

function randomTarget() {
  target.style.left = Math.random() * 260 + "px";
  target.style.top = Math.random() * 260 + "px";
}
randomTarget();

function move(dir) {
  if (dir === "up") y -= speed;
  if (dir === "down") y += speed;
  if (dir === "left") x -= speed;
  if (dir === "right") x += speed;

  player.style.left = x + "px";
  player.style.top = y + "px";

  // OUT condition
  if (x < 0 || y < 0 || x > 260 || y > 260) {
    gameOver("OUT!");
  }

  checkHit();
}

// Keyboard control
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
});

function checkHit() {
  let px = player.offsetLeft;
  let py = player.offsetTop;
  let tx = target.offsetLeft;
  let ty = target.offsetTop;

  if (Math.abs(px - tx) < 40 && Math.abs(py - ty) < 40) {
    score++;
    scoreEl.textContent = score;
    sound.play();
    randomTarget();
  }
}

// Timer
let timer = setInterval(() => {
  time--;
  timeEl.textContent = time;
  if (time === 0) gameOver("TIME UP!");
}, 1000);

function gameOver(msg) {
  clearInterval(timer);
  alert("Game Over: " + msg);

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }
}

// Restart
function restart() {
  location.reload();
}
