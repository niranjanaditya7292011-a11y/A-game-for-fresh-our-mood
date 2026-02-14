let killCount = 0;
const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const healthDisplay = document.getElementById("health");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartBtn = document.getElementById("restartBtn");

const gunSound = document.getElementById("gunSound");
const outSound = document.getElementById("outSound");

let score = 0;
let health = 100;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.innerText = highScore;

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Mobile buttons
["up","down","left","right"].forEach(id=>{
    document.getElementById(id).ontouchstart = () => keys[id]=true;
    document.getElementById(id).ontouchend = () => keys[id]=false;
});

document.getElementById("fire").ontouchstart = fireBullet;

let playerX = 170;
let playerY = 430;

function movePlayer(){
    if(keys["ArrowLeft"] || keys["left"]) playerX -=5;
    if(keys["ArrowRight"] || keys["right"]) playerX +=5;
    if(keys["ArrowUp"] || keys["up"]) playerY -=5;
    if(keys["ArrowDown"] || keys["down"]) playerY +=5;

    // Stop going outside box
    playerX = Math.max(0, Math.min(340, playerX));
    playerY = Math.max(0, Math.min(440, playerY));

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";
}

function fireBullet(){
    gunSound.play();
    let bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = playerX+27+"px";
    bullet.style.top = playerY+"px";
    gameArea.appendChild(bullet);

    let interval = setInterval(()=>{
        bullet.style.top = bullet.offsetTop - 10 + "px";

        document.querySelectorAll(".enemy").forEach(enemy=>{
            if(checkCollision(bullet,enemy)){
                enemy.remove();
                bullet.remove();
                score+=10;
                scoreDisplay.innerText = score;
                clearInterval(interval);
            }
        });

        if(bullet.offsetTop <0){
            bullet.remove();
            clearInterval(interval);
        }
    },30);
}

function spawnEnemy(){
    let enemy = document.createElement("img");
    enemy.src="https://i.imgur.com/9XnKQ7G.png";
    enemy.classList.add("enemy");
    enemy.style.left = Math.random()*340+"px";
    enemy.style.top = "0px";
    gameArea.appendChild(enemy);

    let move = setInterval(()=>{
        enemy.style.top = enemy.offsetTop + (2+level) + "px";

        // Enemy firing
        if(Math.random()<0.02){
            enemyFire(enemy);
        }

        if(checkCollision(enemy,player)){
            gameOver();
        }

        if(enemy.offsetTop >500){
            enemy.remove();
            clearInterval(move);
        }
    },30);
}

function enemyFire(enemy){
    let bullet = document.createElement("div");
    bullet.classList.add("enemyBullet");
    bullet.style.left = enemy.offsetLeft+27+"px";
    bullet.style.top = enemy.offsetTop+"px";
    gameArea.appendChild(bullet);

    let interval = setInterval(()=>{
        bullet.style.top = bullet.offsetTop + 7 + "px";

        if(checkCollision(bullet,player)){
            health-=10;
            healthDisplay.innerText = health;
            bullet.remove();
            clearInterval(interval);
            if(health<=0) gameOver();
        }

        if(bullet.offsetTop >500){
            bullet.remove();
            clearInterval(interval);
        }
    },30);
}

function checkCollision(a,b){
    let rect1=a.getBoundingClientRect();
    let rect2=b.getBoundingClientRect();
    return !(rect1.top>rect2.bottom ||
             rect1.bottom<rect2.top ||
             rect1.right<rect2.left ||
             rect1.left>rect2.right);
}

function gameOver(){
    outSound.play();
    gameOverScreen.style.display="block";

    if(score>highScore){
        localStorage.setItem("highScore",score);
    }
}

restartBtn.onclick = ()=>{
    location.reload();
}

setInterval(movePlayer,20);
setInterval(spawnEnemy,1500);

// Auto fire with space
document.addEventListener("keydown",e=>{
    if(e.code==="Space") fireBullet();
});
