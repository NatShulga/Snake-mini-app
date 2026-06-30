
let ROWS, COLS;
const SPEED = 300;

const fruitMap = {
  1: "🍓",
  2: "🍒",
  3: "🍇",
  4: "🍉",
};

//переменные для состояний
let grid = [];
let snake = [];
let direction = "R";
let nextDirection = "R";
let score = 0;
let gameInterval = null;
let isPaused = false;
isVertical = (ROWS === 21); 

// DOM элементы
const gameField = document.getElementById("game-field");
const scoreSpan = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");

//инициализируем игру
function initGame() {
  stopGameLoop();

  // Определяем размеры поля в зависимости от ориентации экрана
  if (window.innerWidth <= 500) {
    //Вертикально, если поле вертикально
    ROWS = 21;
    COLS = 13;
  } else {
    //Горизонтальное поле
    ROWS = 13;
    COLS = 21;
  }

  // Настраиваем CSS-сетку под новые размеры
  gameField.style.gridTemplateRows = `repeat(${ROWS}, 1fr)`;
  gameField.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
  gameField.style.aspectRatio = `${COLS} / ${ROWS}`;

  // Пустое поле
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  // Начальная змейка в центре
  const startX = Math.floor(ROWS / 2);
  const startY = Math.floor(COLS / 2);
  snake = [
    { x: startX, y: startY - 2 },
    { x: startX, y: startY - 1 },
    { x: startX, y: startY }, // голова
  ];

  direction = "R";
  nextDirection = "R";
  score = snake.length;
  updateScore();

  // Разбрасываем 5 случайных ягод
  for (let i = 0; i < 5; i++) {
    spawnFood();
  }

  draw();
  isPaused = false;
  pauseBtn.disabled = false;
  startBtn.textContent = "Start";
  isVertical = (ROWS === 21);
}

//создание еды для змеи
function spawnFood() {
  const freeCells = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        grid[i][j] === 0 &&
        !snake.some((seg) => seg.x === i && seg.y === j)
      ) {
        freeCells.push({ x: i, y: j });
      }
    }
  }
  if (freeCells.length === 0) return;

  const randIndex = Math.floor(Math.random() * freeCells.length);
  const { x, y } = freeCells[randIndex];
  const fruitType = Math.floor(Math.random() * 4) + 1;
  grid[x][y] = fruitType;
}

//отрисовка
function draw() {
  gameField.innerHTML = "";

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const snakeIndex = snake.findIndex((seg) => seg.x === i && seg.y === j);
      if (snakeIndex !== -1) {
        if (snakeIndex === snake.length - 1) {
          cell.classList.add("snake-head");
        } else {
          cell.classList.add("snake-body");
        }
      }

      if (grid[i][j] >= 1 && grid[i][j] <= 4 && snakeIndex === -1) {
        cell.classList.add("food");
        cell.textContent = fruitMap[grid[i][j]];
      }

      gameField.appendChild(cell);
    }
  }
}

//коллизия
function checkCollision(head) {
  if (head.x < 0 || head.x >= ROWS || head.y < 0 || head.y >= COLS) {
    return true;
  }
  for (let i = 0; i < snake.length - 1; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      return true;
    }
  }
  return false;
}

//шаг в игре
function gameStep() {
  direction = nextDirection;

  const head = snake[snake.length - 1];
  let newHead = { x: head.x, y: head.y };

  if (direction === "U") newHead.x--;
  else if (direction === "D") newHead.x++;
  else if (direction === "L") newHead.y--;
  else if (direction === "R") newHead.y++;

  if (checkCollision(newHead)) {
    gameOver();
    return;
  }

  snake.push(newHead);

  const cellValue = grid[newHead.x][newHead.y];
  if (cellValue >= 1 && cellValue <= 4) {
    grid[newHead.x][newHead.y] = 0;
    score = snake.length;
    updateScore();
    spawnFood();
  } else {
    snake.shift();
  }

  draw();
}

//гейм овер
function gameOver() {
  stopGameLoop();
  alert("Game over! Length: " + snake.length);
  startBtn.textContent = "Restart";
  pauseBtn.disabled = true;
}

//управление таймером, скоростью
function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameStep, SPEED);
}

function stopGameLoop() {
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

//обрабботчики кнопок
startBtn.addEventListener("click", () => {
  if (gameInterval && !isPaused) {
    stopGameLoop();
    initGame();
    startGameLoop();
  } else {
    if (isPaused) {
      isPaused = false;
      pauseBtn.textContent = "Pause";
      startGameLoop();
    } else {
      initGame();
      startGameLoop();
    }
  }
});

pauseBtn.addEventListener("click", () => {
  if (isPaused) {
    isPaused = false;
    pauseBtn.textContent = "Pause";
    startGameLoop();
  } else {
    isPaused = true;
    pauseBtn.textContent = "Resume";
    stopGameLoop();
  }
});

//
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (
    [
      "arrowup",
      "arrowdown",
      "arrowleft",
      "arrowright",
      "w",
      "a",
      "s",
      "d",
    ].includes(key)
  ) {
    e.preventDefault();
  }

  if (key === "arrowup" || key === "w") {
    if (direction !== "D") nextDirection = "U";
  } else if (key === "arrowdown" || key === "s") {
    if (direction !== "U") nextDirection = "D";
  } else if (key === "arrowleft" || key === "a") {
    if (direction !== "R") nextDirection = "L";
  } else if (key === "arrowright" || key === "d") {
    if (direction !== "L") nextDirection = "R";
  }
});

//адаптив для поворота экрана
window.addEventListener("resize", () => {
    const shouldBeVertical = window.innerWidth <= 500;
    if (shouldBeVertical === isVertical) return

    if (gameInterval && !isPaused) {
    stopGameLoop();
    initGame();
    startGameLoop();
    } else {
        initGame();
        if (isPaused) {
            stopGameLoop();                 
            isPaused = true;
            pauseBtn.textContent = 'Resume';
    }
}
});

function updateScore() {
scoreSpan.textContent = score;
}

initGame();
