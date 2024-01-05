let rows = 10;
let cols = 10;
let totalMines = 15;

let board = [];
let mines = [];

document.addEventListener('DOMContentLoaded', function () {
  const easyButton = document.getElementById('easyButton');
  easyButton.addEventListener('click', () => startGame(8, 8, 10));

  const normalButton = document.getElementById('normalButton');
  normalButton.addEventListener('click', () => startGame(10, 10, 15));

  const hardButton = document.getElementById('hardButton');
  hardButton.addEventListener('click', () => startGame(12, 12, 30));

  const expertButton = document.getElementById('expertButton');
  expertButton.addEventListener('click', () => startGame(15, 15, 45));

  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', resetGame);

  resetGame();
});

function startGame(newRows, newCols, newTotalMines) {
  rows = newRows;
  cols = newCols;
  totalMines = newTotalMines;

  resetGame();
}

function createBoard() {
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i][j] = {
        isMine: false,
        revealed: false,
        neighbors: 0,
        flagged: false
      };
    }
  }
}

function plantMines() {
  let minesPlanted = 0;
  while (minesPlanted < totalMines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      mines.push({ row, col });
      minesPlanted++;
    }
  }
}

function calculateNeighbors() {
  for (let mine of mines) {
    const { row, col } = mine;
    for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
      for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
        if (!(i === row && j === col)) {
          board[i][j].neighbors++;
        }
      }
    }
  }
}

function renderBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (!board[i][j].revealed) {
        cell.classList.add('hidden');
        if (board[i][j].flagged) {
          cell.classList.add('flagged');
          cell.innerHTML = '&#9873;'; // flag emoji
        }
      } else {
        if (board[i][j].isMine) {
          cell.classList.add('mine');
          cell.innerHTML = '&#128163;'; // bomb emoji
        } else {
          cell.innerHTML = board[i][j].neighbors || '';
        }
      }

      cell.addEventListener('click', () => revealCell(i, j));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(i, j);
      });

      boardElement.appendChild(cell);
    }
  }
}

function revealCell(row, col) {
  if (board[row][col].revealed || board[row][col].flagged) {
    return;
  }

  board[row][col].revealed = true;

  if (board[row][col].isMine) {
    alert('Game Over! You hit a mine.');
    resetGame();
  } else {
    if (board[row][col].neighbors === 0) {
      for (let i = Math.max(0, row - 1); i <= Math.min(rows - 1, row + 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(cols - 1, col + 1); j++) {
          revealCell(i, j);
        }
      }
    }

    if (checkWin()) {
      alert('Congratulations! You won!');
      resetGame();
    }
  }

  renderBoard();
}

function toggleFlag(row, col) {
  board[row][col].flagged = !board[row][col].flagged;
  renderBoard();
}

function checkWin() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!board[i][j].isMine && !board[i][j].revealed) {
        return false;
      }
    }
  }
  return true;
}

function resetGame() {
  board = [];
  mines = [];
  createBoard();
  plantMines();
  calculateNeighbors();
  renderBoard();
}
