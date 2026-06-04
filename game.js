const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameRunning = false;
let gameOver = false;
let score = 0;
let level = 1;
let jump = false;
let gravity = 0.6;
let jumpPower = -15;

// Player object
const player = {
    x: 50,
    y: canvas.height - 80,
    width: 30,
    height: 30,
    velocityY: 0,
    color: '#667eea'
};

// Game elements
let obstacles = [];
let gameSpeed = 5;
let spawnRate = 120;
let frameCount = 0;

// Event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('restartBtn2').addEventListener('click', restartGame);
canvas.addEventListener('click', playerJump);
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        playerJump();
        e.preventDefault();
    }
});

function startGame() {
    gameRunning = true;
    gameOver = false;
    score = 0;
    level = 1;
    gameSpeed = 5;
    obstacles = [];
    frameCount = 0;
    player.y = canvas.height - 80;
    player.velocityY = 0;
    
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'inline-block';
    document.getElementById('gameOver').style.display = 'none';
    
    gameLoop();
}

function restartGame() {
    startGame();
}

function playerJump() {
    if (gameRunning && isPlayerOnGround()) {
        player.velocityY = jumpPower;
        jump = true;
    }
}

function isPlayerOnGround() {
    return player.y >= canvas.height - 80;
}

function update() {
    // Update player position
    player.velocityY += gravity;
    player.y += player.velocityY;
    
    // Ground collision
    if (player.y >= canvas.height - 50) {
        player.y = canvas.height - 50;
        player.velocityY = 0;
    }
    
    // Spawn obstacles
    frameCount++;
    if (frameCount % spawnRate === 0) {
        spawnObstacle();
    }
    
    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        
        // Check collision
        if (checkCollision(player, obstacles[i])) {
            endGame();
            return;
        }
        
        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score += 10;
        }
    }
    
    // Increase difficulty
    if (score % 100 === 0 && score > 0 && score / 100 > level - 1) {
        level++;
        gameSpeed += 1;
        spawnRate = Math.max(80, spawnRate - 5);
    }
    
    // Ceiling collision
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
    }
}

function spawnObstacle() {
    const size = 30 + Math.random() * 20;
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 50 - size,
        width: size,
        height: size,
        color: '#ff6b6b'
    };
    obstacles.push(obstacle);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function endGame() {
    gameRunning = false;
    gameOver = true;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('restartBtn').style.display = 'none';
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 5, player.y + 8, 6, 6);
    ctx.fillRect(player.x + 19, player.y + 8, 6, 6);
    
    ctx.fillStyle = 'black';
    ctx.fillRect(player.x + 6, player.y + 9, 3, 3);
    ctx.fillRect(player.x + 20, player.y + 9, 3, 3);
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Draw obstacle pattern
        ctx.strokeStyle = '#cc5555';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
    });
    
    // Update score and level display
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Initial draw
draw();