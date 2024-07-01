const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const groundLevel = canvas.height - 50; // Set ground level

const player = {
    x: 50,
    y: groundLevel - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false,
    punching: false,
    kicking: false,
    health: 100
};

const enemy = {
    x: 700,
    y: groundLevel - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    jumping: false,
    punching: false,
    kicking: false,
    health: 100
};

function drawGround() {
    context.fillStyle = 'green';
    context.fillRect(0, groundLevel, canvas.width, canvas.height - groundLevel);
}

function drawStickman(x, y, color, punching, kicking) {
    context.strokeStyle = color;
    context.lineWidth = 5;

    // Head
    context.beginPath();
    context.arc(x + 25, y + 15, 10, 0, Math.PI * 2, true); 
    context.stroke();

    // Body
    context.beginPath();
    context.moveTo(x + 25, y + 25);
    context.lineTo(x + 25, y + 50);
    context.stroke();

    // Arms
    if (punching) {
        context.beginPath();
        context.moveTo(x + 25, y + 30);
        context.lineTo(x + 50, y + 30);
        context.stroke();
    } else {
        context.beginPath();
        context.moveTo(x + 25, y + 30);
        context.lineTo(x + 10, y + 30);
        context.stroke();

        context.beginPath();
        context.moveTo(x + 25, y + 30);
        context.lineTo(x + 40, y + 30);
        context.stroke();
    }

    // Legs
    if (kicking) {
        context.beginPath();
        context.moveTo(x + 25, y + 50);
        context.lineTo(x + 50, y + 60);
        context.stroke();
    } else {
        context.beginPath();
        context.moveTo(x + 25, y + 50);
        context.lineTo(x + 15, y + 70);
        context.stroke();

        context.beginPath();
        context.moveTo(x + 25, y + 50);
        context.lineTo(x + 35, y + 70);
        context.stroke();
    }
}

function drawPlayer() {
    drawStickman(player.x, player.y, 'blue', player.punching, player.kicking);
}

function drawEnemy() {
    drawStickman(enemy.x, enemy.y, 'red', enemy.punching, enemy.kicking);
}

function drawHealthBars() {
    // Player health bar
    context.fillStyle = 'blue';
    context.fillRect(20, 20, player.health * 2, 20);

    // Enemy health bar
    context.fillStyle = 'red';
    context.fillRect(canvas.width - enemy.health * 2 - 20, 20, enemy.health * 2, 20);
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos(character) {
    character.x += character.dx;
    character.y += character.dy;

    // Gravity
    if (character.y + character.height < groundLevel) {
        character.dy += 1;
    } else {
        character.dy = 0;
        character.jumping = false;
        character.y = groundLevel - character.height;
    }

    // Boundary
    if (character.x < 0) character.x = 0;
    if (character.x + character.width > canvas.width) character.x = canvas.width - character.width;
}

function handleCollisions() {
    // Check for punch
    if (player.punching && player.x + player.width + 30 >= enemy.x && player.y + 10 <= enemy.y + enemy.height && player.y + 20 >= enemy.y) {
        enemy.health -= 10;
        player.punching = false;
    }

    if (enemy.punching && enemy.x - 30 <= player.x + player.width && enemy.y + 10 <= player.y + player.height && enemy.y + 20 >= player.y) {
        player.health -= 10;
        enemy.punching = false;
    }

    // Check for kick
    if (player.kicking && player.x + player.width + 30 >= enemy.x && player.y + player.height - 20 <= enemy.y + enemy.height && player.y + player.height >= enemy.y) {
        enemy.health -= 20;
        player.kicking = false;
    }

    if (enemy.kicking && enemy.x - 30 <= player.x + player.width && enemy.y + enemy.height - 20 <= player.y + player.height && enemy.y + enemy.height >= player.y) {
        player.health -= 20;
        enemy.kicking = false;
    }
}

function update() {
    clear();
    drawGround();
    drawPlayer();
    drawEnemy();
    drawHealthBars();
    newPos(player);
    newPos(enemy);
    handleCollisions();
    checkWin();
    requestAnimationFrame(update);
}

function checkWin() {
    if (player.health <= 0) {
        alert("Enemy Wins!");
        resetGame();
    } else if (enemy.health <= 0) {
        alert("Player Wins!");
        resetGame();
    }
}

function resetGame() {
    player.health = 100;
    enemy.health = 100;
    player.x = 50;
    player.y = groundLevel - player.height;
    enemy.x = 700;
    enemy.y = groundLevel - enemy.height;
}

function moveRight(character) {
    character.dx = character.speed;
}

function moveLeft(character) {
    character.dx = -character.speed;
}

function jump(character) {
    if (!character.jumping) {
        character.dy = -15;
        character.jumping = true;
    }
}

function punch(character) {
    character.punching = true;
}

function kick(character) {
    character.kicking = true;
}

function keyDown(e) {
    // Player 1 controls (WASD for movement, P for punch, K for kick)
    if (e.key === 'd') {
        moveRight(player);
    } else if (e.key === 'a') {
        moveLeft(player);
    } else if (e.key === 'w') {
        jump(player);
    } else if (e.key === 'p') {
        punch(player);
    } else if (e.key === 'k') {
        kick(player);
    }

    // Player 2 controls (Arrow keys for movement, 1 for punch, 2 for kick)
    if (e.key === 'ArrowRight') {
        moveRight(enemy);
    } else if (e.key === 'ArrowLeft') {
        moveLeft(enemy);
    } else if (e.key === 'ArrowUp') {
        jump(enemy);
    } else if (e.key === '1') {
        punch(enemy);
    } else if (e.key === '2') {
        kick(enemy);
    }
}

function keyUp(e) {
    // Player 1 controls
    if (e.key === 'd' || e.key === 'a') {
        player.dx = 0;
    }

    // Player 2 controls
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        enemy.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
