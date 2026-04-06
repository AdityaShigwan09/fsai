
import { checkWinner, getEmptyCells, applyMove } from './gameLogic';

const AI    = 'O';   
const HUMAN = 'X';   

function getScore(winner, depth) {
  if (winner === AI)    return 10 - depth;  
  if (winner === HUMAN) return depth - 10;  
  return 0;                                  
}


function minimax(board, depth, isAITurn, alpha, beta, treeNode) {

  const result = checkWinner(board);
  if (result) {
    return getScore(result.winner, depth);
  }

  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return 0; 
  }

  const shouldCapture = treeNode && depth < 2;


  if (isAITurn) {
    let best = -Infinity;

    for (const cell of emptyCells) {
  
      const newBoard = applyMove(board, cell, AI);

  
      let child = null;
      if (shouldCapture) {
        child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: AI };
        treeNode.children.push(child);
      }

      
      const score = minimax(newBoard, depth + 1, false, alpha, beta, child);
      if (child) child.score = score;

      
      if (score > best) best = score;
      if (score > alpha) alpha = score; 

      
      if (beta <= alpha) {
        if (shouldCapture) {
          const rest = emptyCells.slice(emptyCells.indexOf(cell) + 1);
          for (const skipped of rest) {
            treeNode.children.push({ board: null, move: skipped, score: null, pruned: true, children: [], player: AI });
          }
        }
        break; 
      }
    }

    if (treeNode) treeNode.score = best;
    return best;


  } else {
    let best = Infinity;

    for (const cell of emptyCells) {

      const newBoard = applyMove(board, cell, HUMAN);

      let child = null;
      if (shouldCapture) {
        child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: HUMAN };
        treeNode.children.push(child);
      }

      const score = minimax(newBoard, depth + 1, true, alpha, beta, child);
      if (child) child.score = score;

      if (score < best) best = score;
      if (score < beta) beta = score; 

      if (beta <= alpha) {
        if (shouldCapture) {
          const rest = emptyCells.slice(emptyCells.indexOf(cell) + 1);
          for (const skipped of rest) {
            treeNode.children.push({ board: null, move: skipped, score: null, pruned: true, children: [], player: HUMAN });
          }
        }
        break; // prune!
      }
    }

    if (treeNode) treeNode.score = best;
    return best;
  }
}

export function getBestMove(board) {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;

 
  const tree = {
    board,
    move: null,
    score: null,
    pruned: false,
    children: [],
    player: null,
  };

  const scores = [];      
  let bestScore = -Infinity;
  let bestIndex = emptyCells[0];

  for (const cell of emptyCells) {
 
    const newBoard = applyMove(board, cell, AI);

   
    const child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: AI };
    tree.children.push(child);


    const score = minimax(newBoard, 0, false, -Infinity, Infinity, child);
    child.score = score;

    scores.push({ index: cell, score });


    if (score > bestScore) {
      bestScore = score;
      bestIndex = cell;
    }
  }

  tree.score = bestScore;

  return { index: bestIndex, scores, tree, bestScore };
}
