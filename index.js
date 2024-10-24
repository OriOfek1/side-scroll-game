const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024 / 1.2;
canvas.height = 576 / 1.2;
canvas.style.border = '2px solid black';

const gravity = 0.5;

class Player {
    constructor() {
        this.position = { x: 100, y: 100 };
        this.width = 20;
        this.height = 30;
        this.velocity = { x: 0, y: 0 };
        this.isJumping = false;
        this.lastKeyPressed;
    }

    draw() {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
            this.isJumping = false;
        }
    }
}

class Platform {
    constructor(position) {
        this.position = { x: position.x, y: position.y };
        this.width = 200;
        this.height = 20;
    }

    draw() {
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
let platforms = generateInitialPlatforms();

const keys = { right: { pressed: false }, left: { pressed: false } };
let scrollOffset = 0;

// Function to generate initial platforms
function generateInitialPlatforms() {
    return [
        new Platform({ x: 200, y: 400 }),
        new Platform({ x: 500, y: 300 }),
        new Platform({ x: 800, y: 350 }),
    ];
}

// Function to generate a new platform (with some randomness)
function generatePlatform() {
    const yPosition = Math.floor(Math.random() * (canvas.height - 150) + 150); // Platforms not too close to top/bottom
    return new Platform({ x: canvas.width + 50, y: yPosition });
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach((platform) => platform.draw());
    player.update();

    // Player movement logic with scrolling
    if (keys.left.pressed && player.lastKeyPressed === 'ArrowLeft' && player.position.x > 100) {
        player.velocity.x = -5;
    } else if (keys.right.pressed && player.lastKeyPressed === 'ArrowRight' && player.position.x < 400) {
        player.velocity.x = 5;
    } else {
        player.velocity.x = 0;

        platforms.forEach((platform) => {
            if (keys.right.pressed) {
                scrollOffset += 5;
                platform.position.x -= 5;

                // Platform regeneration: Remove platform if it moves off-screen
                if (platform.position.x + platform.width < 0) {
                    platforms.splice(platforms.indexOf(platform), 1); // Remove platform
                    platforms.push(generatePlatform()); // Add a new platform to the right
                }
            } else if (keys.left.pressed) {
                scrollOffset -= 5;
                platform.position.x += 5;
            }
        });
    }

    // Platform collision detection
    platforms.forEach((platform) => {
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
            player.position.y = platform.position.y - player.height;
            player.isJumping = false;
        }
    });
}

animate();

addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = true;
            player.lastKeyPressed = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.left.pressed = true;
            player.lastKeyPressed = 'ArrowLeft';
            break;
        case ' ':
            if (!player.isJumping) {
                player.velocity.y = -10;
                player.isJumping = true;
            }
            break;
    }
});

addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            player.velocity.x = 0;
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            player.velocity.x = 0;
            break;
    }
});
