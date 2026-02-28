const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let gravity = 0.5;
let velocity = 0;
let lift = -8;

let bird = {
    x: 80,
    y: 200,
    width: 30,
    height: 30
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let frame = 0;
let score = 0;
let gameRunning = false;

function resetGame() {
    bird.y = 200;
    velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
}

function drawBird() {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    ctx.fillStyle = "#228B22";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        let topHeight = Math.random() * 250 + 50;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + pipeGap
        });
    }

    pipes.forEach(pipe => pipe.x -= 2);
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function detectCollision() {
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        return true;
    }

    for (let pipe of pipes) {
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            return true;
        }
    }
    return false;
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(score, canvas.width / 2 - 10, 50);
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    velocity += gravity;
    bird.y += velocity;

    updatePipes();
    drawPipes();
    drawBird();
    drawScore();

    if (frame % 90 === 0) score++;

    if (detectCollision()) {
        gameRunning = false;
        document.getElementById("gameOver").classList.remove("hidden");
        document.getElementById("finalScore").innerText = "Score: " + score;
    }

    frame++;
    requestAnimationFrame(update);
}

function flap() {
    if (gameRunning) velocity = lift;
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") flap();
});

document.addEventListener("touchstart", flap);

document.getElementById("startBtn").onclick = () => {
    document.getElementById("menu").classList.add("hidden");
    resetGame();
    gameRunning = true;
    update();
};

document.getElementById("restartBtn").onclick = () => {
    document.getElementById("gameOver").classList.add("hidden");
    resetGame();
    gameRunning = true;
    update();
};