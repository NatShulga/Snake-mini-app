//настройка

const ROWS = 13;
const COLS = 21;
const SPEED = 400;

const fruitMap = {
  1: "🍓",
  2: "🍒",
  3: "🍇",
  4: "🍉",
};

let grid = [];
let snake = [];
let direction = "R"; //текущее направление
let nextDirection = "R"; //следущее направление
let score = 0;
let gameInterval = null; //id интервала для игры
let isPaused = false; // на паузе?

//DOM елементы
const gameField = document.getElementById("game-field");
const scoreSpan = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");

//инициализация игры
function initGame() {
  stopGameLoop(); //очищение предыдущей игры, если она была

  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  //начальная змейка
  const startX = Math.floor(ROWS / 2);//6
  const startY = Math.floor(COLS / 2);//10
  snake = [
    {x: startX, y: startY - 2},
    {x: startX, y: startY - 1},
    {x: startX, y: startY} //голова
  ];

  direction = "R";
  nextDirection = "R";
  score = snake.length;
  updateScore();

  //5 случайных ягод на поле
  for (let i = 0; i < 5; i++ ){
    spawnFood();
  }
  //рисуем поле
  draw();
  isPaused = false;
  pauseBtn.disabled = false;
  startBtn.textContent = 'Старт';
}

//создание еды
function spawnFood() {
    // Собираем все свободные клетки (где 0 и нет змеи)
    const freeCells = [];
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (grid[i][j] === 0 && !snake.some(seg => seg.x === i && seg.y === j)) {
                freeCells.push({ x: i, y: j });
            }
        }
    }
    if (freeCells.length === 0) return; // нет места — не создаём

    // Выбираем случайную свободную клетку
    const randIndex = Math.floor(Math.random() * freeCells.length);
    const { x, y } = freeCells[randIndex];

    // Случайный тип фрукта: 1,2,3 или 4
    const fruitType = Math.floor(Math.random() * 4) + 1;
    grid[x][y] = fruitType;
}

//отрисовка поля
function draw() {
    // Очищаем контейнер поля
    gameField.innerHTML = '';

    // Создаём каждую клетку и добавляем нужные классы
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            // Проверяем, есть ли здесь змея
            const snakeIndex = snake.findIndex(seg => seg.x === i && seg.y === j);
            if (snakeIndex !== -1) {
                // Это часть змеи
                if (snakeIndex === snake.length - 1) {
                    // Это голова
                    cell.classList.add('snake-head');
                } else {
                    // Тело
                    cell.classList.add('snake-body');
                }
            }
            // Проверяем, есть ли еда (даже под змеёй — но мы её не рисуем, т.к. змея важнее)
            if (grid[i][j] >= 1 && grid[i][j] <= 4 && snakeIndex === -1) {
                // Ягода, если здесь нет змеи
                cell.classList.add('food');
                cell.textContent = fruitMap[grid[i][j]];
            }

            gameField.appendChild(cell);
        }
    }
}

//проверка коллизий
function checkCollision(head) {
    // Столкновение со стенами
    if (head.x < 0 || head.x >= ROWS || head.y < 0 || head.y >= COLS) {
        return true;
    }
    // Столкновение с собственным телом (игнорируем хвост, который сейчас уберётся)
    // Проверяем все сегменты, кроме последнего (хвоста), потому что хвост будет удалён, если не съедим еду
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

//игровой шаг
function gameStep() {
    direction = nextDirection;

    // Координаты головы
    const head = snake[snake.length - 1];
    let newHead = { x: head.x, y: head.y };

    // Сдвигаем голову в зависимости от направления
    if (direction === 'U') newHead.x--;
    else if (direction === 'D') newHead.x++;
    else if (direction === 'L') newHead.y--;
    else if (direction === 'R') newHead.y++;

    // Проверяем коллизии (стены, тело)
    if (checkCollision(newHead)) {
        gameOver();
        return;
    }

    // Добавляем новую голову в змейку
    snake.push(newHead);

    // Проверяем, съели ли ягоду
    const cellValue = grid[newHead.x][newHead.y];
    if (cellValue >= 1 && cellValue <= 4) {
        // Съели! Увеличиваем счёт, убираем ягоду с поля, создаём новую
        grid[newHead.x][newHead.y] = 0;
        score = snake.length;
        updateScore();
        spawnFood();
        // Хвост не убираем — змея растёт
    } else {
        // Не съели — убираем хвост (первый элемент)
        snake.shift();
    }

    // Перерисовываем поле
    draw();
}

//конец игры
function gameOver() {
    stopGameLoop();
    alert('Игра окончена! Длина змейки: ' + snake.length);
    startBtn.textContent = 'Заново';
    pauseBtn.disabled = true;
}

//цикл
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

//обработчик кнопок
startBtn.addEventListener('click', () => {
    // Если игра уже идёт (не на паузе), кнопка работает как рестарт
    if (gameInterval && !isPaused) {
        // Остановить, потом инициализировать заново
        stopGameLoop();
        initGame();
        startGameLoop();
    } else {
        // Или просто начать/продолжить
        if (isPaused) {
            // Снимаем с паузы
            isPaused = false;
            pauseBtn.textContent = 'Пауза';
            startGameLoop();
        } else {
            // Новая игра
            initGame();
            startGameLoop();
        }
    }
});

pauseBtn.addEventListener('click', () => {
    if (!gameInterval) return; // нечего ставить на паузу
    if (isPaused) {
        // Продолжить
        isPaused = false;
        pauseBtn.textContent = 'Пауза';
        startGameLoop();
    } else {
        // Пауза
        isPaused = true;
        pauseBtn.textContent = 'Продолжить';
        stopGameLoop();
    }
});

//с клавиатуры
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    // Предотвращаем стандартное поведение для стрелок, чтобы не скроллилась страница
    if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright' ||
        key === 'w' || key === 'a' || key === 's' || key === 'd') {
        e.preventDefault();
    }

    // Меняем nextDirection, проверяя, чтобы не было разворота на 180 градусов
    if (key === 'arrowup' || key === 'w') {
        if (direction !== 'D') nextDirection = 'U';
    } else if (key === 'arrowdown' || key === 's') {
        if (direction !== 'U') nextDirection = 'D';
    } else if (key === 'arrowleft' || key === 'a') {
        if (direction !== 'R') nextDirection = 'L';
    } else if (key === 'arrowright' || key === 'd') {
        if (direction !== 'L') nextDirection = 'R';
    }
});

// ---------- ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ----------
function updateScore() {
    scoreSpan.textContent = score;
}

//отрисовка до старта
initGame(); // поле и змейка уже видны, но движения нет
// Игровой цикл не запущен, ждём нажатия Старт

