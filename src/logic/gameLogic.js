
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5], 
  [6, 7, 8],
  [0, 3, 6], 
  [1, 4, 7], 
  [2, 5, 8], 
  [0, 4, 8], 
  [2, 4, 6], 
];


export function checkWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return null; 
}


export function getEmptyCells(board) {
  const empty = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) empty.push(i);
  }
  return empty;
}



export function checkDraw(board) {
  const boardFull = board.every(cell => cell !== null);
  const noWinner  = checkWinner(board) === null;
  return boardFull && noWinner;
}


export function applyMove(board, index, player) {
  const newBoard = [...board];   
  newBoard[index] = player;      
  return newBoard;
}
