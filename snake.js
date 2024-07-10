const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const backgroundMusic = document.getElementById('background-music');
const playButton = document.getElementById('play-button');
const foodSelector = document.getElementById('food-selector');

const gridSize = 20;
let tileCountX;
let tileCountY;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tileCountX = Math.floor(canvas.width / gridSize);
    tileCountY = Math.floor(canvas.height / gridSize);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
let score = 0;

const snakeHeadImg = new Image();
snakeHeadImg.src = 'snake_head.png';

const foodImg = new Image();
foodImg.src = foodSelector.value;

// Update food image when the selector changes
foodSelector.addEventListener('change', () => {
    foodImg.src = foodSelector.value;
});

// Ensure music is paused initially
backgroundMusic.pause();
backgroundMusic.currentTime = 0;

// Play button functionality
playButton.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playButton.textContent = 'Pause Music';
    } else {
        backgroundMusic.pause();
        playButton.textContent = 'Play Music';
    }
});

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const { key } = event;
    switch (key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
}

function gameLoop() {
    update();
    draw();
    if (!isGameOver()) {
        setTimeout(gameLoop, 100);
    } else {
        finalScoreDisplay.textContent = score;
        gameOverDisplay.style.display = 'block';
        backgroundMusic.pause();
        playButton.textContent = 'Play Music';
    }
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        food = { x: Math.floor(Math.random() * tileCountX), y: Math.floor(Math.random() * tileCountY) };
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake head
    ctx.drawImage(snakeHeadImg, snake[0].x * gridSize, snake[0].y * gridSize, gridSize, gridSize);

    // Draw snake body as a smooth line
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = gridSize;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(snake[0].x * gridSize + gridSize / 2, snake[0].y * gridSize + gridSize / 2);
    for (let i = 1; i < snake.length; i++) {
        ctx.lineTo(snake[i].x * gridSize + gridSize / 2, snake[i].y * gridSize + gridSize / 2);
    }
    ctx.stroke();
}

function isGameOver() {
    const head = snake[0];

    if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
}

gameLoop();
