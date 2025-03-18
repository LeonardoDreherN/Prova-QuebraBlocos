const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 12;
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 25;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 50;
const BRICK_OFFSET_LEFT = 30;
const ROW_COUNT = 4;
const COLUMN_COUNT = 7;

canvas.width = 800;
canvas.height = 600;

class GameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Paddle extends GameObject {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
    this.speed = 12;
  }

  move(direction) {
    if (direction === "left" && this.x > 0) {
      this.x -= this.speed;
    } else if (direction === "right" && this.x + this.width < canvas.width) {
      this.x += this.speed;
    }
  }
}

class Ball extends GameObject {
  constructor(x, y, radius, color) {
    super(x, y, radius * 2, radius * 2, color);
    this.radius = radius;
    this.dx = 5;
    this.dy = -5;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  collideWithPaddle(paddle) {
    if (
      this.x + this.radius > paddle.x &&
      this.x - this.radius < paddle.x + paddle.width &&
      this.y + this.radius > paddle.y
    ) {
      this.dy = -this.dy;
    }
  }

  collideWithBricks(bricks) {
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (
        this.x + this.radius > brick.x &&
        this.x - this.radius < brick.x + brick.width &&
        this.y + this.radius > brick.y &&
        this.y - this.radius < brick.y + brick.height
      ) {
        this.dy = -this.dy;
        bricks.splice(i, 1);
        break;
      }
    }
  }

  collideWithWalls() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

class Brick extends GameObject {
  constructor(x, y, width, height, color) {
    super(x, y, width, height, color);
  }
}

const paddle = new Paddle(
  canvas.width / 2 - PADDLE_WIDTH / 2,
  canvas.height - PADDLE_HEIGHT - 20,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  "#00f"
);

const ball = new Ball(
  canvas.width / 2,
  canvas.height / 2,
  BALL_RADIUS,
  "#f00"
);

const bricks = [];
for (let c = 0; c < COLUMN_COUNT; c++) {
  for (let r = 0; r < ROW_COUNT; r++) {
    bricks.push(
      new Brick(
        c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
        r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
        BRICK_WIDTH,
        BRICK_HEIGHT,
        `hsl(${Math.random() * 360}, 50%, 50%)`
      )
    );
  }
}

const keys = {
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

function handlePaddleMovement() {
  if (keys.ArrowLeft) {
    paddle.move("left");
  }
  if (keys.ArrowRight) {
    paddle.move("right");
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handlePaddleMovement();

  paddle.draw();
  ball.draw();
  bricks.forEach((brick) => brick.draw());

  ball.move();

  ball.collideWithPaddle(paddle);
  ball.collideWithBricks(bricks);
  ball.collideWithWalls();

  if (ball.y + ball.radius > canvas.height) {
    alert("Game Over!");
    document.location.reload();
  } else if (bricks.length === 0) {
    alert("Você venceu!");
    document.location.reload();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();