// ============================================================
// gameLogic.js — The rules of Tic Tac Toe
// ============================================================
// The board is just an array of 9 slots, like this:
//
//   index:  0 | 1 | 2
//           ---------
//           3 | 4 | 5
//           ---------
//           6 | 7 | 8
//
// Each slot is either 'X', 'O', or null (empty).
// ============================================================


// Every way you can win — 3 in a row, column, or diagonal
const WIN_LINES = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal top-left to bottom-right
  [2, 4, 6], // diagonal top-right to bottom-left
];


// checkWinner — did someone win?
// Returns { winner: 'X' or 'O', line: [i, j, k] } or null
export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    // If all three slots in a line have the same player → that player won
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null; // no winner yet
}


// getEmptyCells — which slots are still empty?
// Returns an array of index numbers, e.g. [0, 3, 7]
export function getEmptyCells(board) {
  const empty = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) empty.push(i);
  }
  return empty;
}


// checkDraw — is the board full with no winner?
export function checkDraw(board) {
  const boardFull = board.every(cell => cell !== null);
  const noWinner  = checkWinner(board) === null;
  return boardFull && noWinner;
}


// applyMove — place a player's symbol on the board
// Does NOT mutate the original board — returns a fresh copy
export function applyMove(board, index, player) {
  const newBoard = [...board];   // copy the array
  newBoard[index] = player;      // place the symbol
  return newBoard;
}
