// ============================================================
// aiLogic.js — AI brain using Minimax + Alpha-Beta Pruning
// ============================================================
//
// HOW THE AI THINKS (simple version):
//
//   1. Look at every empty cell on the board
//   2. Imagine placing "O" there
//   3. Then imagine the human plays their best response
//   4. Then imagine AI plays again... and so on until game ends
//   5. Score the final result: AI win = +10, Human win = -10, Draw = 0
//   6. Pick the cell with the highest score
//
// This is called MINIMAX:
//   - AI always tries to MAXIMIZE the score  (picks highest)
//   - Human always tries to MINIMIZE the score (picks lowest)
//
// ALPHA-BETA PRUNING speeds this up:
//   - While exploring, track the best scores found so far
//   - If a branch can't possibly beat what we already found → skip it
//   - Same result, much less work
// ============================================================

import { checkWinner, getEmptyCells, applyMove } from './gameLogic';

const AI    = 'O';   // AI is the maximizer (wants high scores)
const HUMAN = 'X';   // Human is the minimizer (wants low scores)

// ─────────────────────────────────────────────────
// STEP 1: Score a finished board
// ─────────────────────────────────────────────────
// Called when the game is over. Returns:
//   +10  if AI won  (minus depth so faster wins score higher)
//   -10  if human won (plus depth so slower losses score higher)
//     0  if it's a draw
function getScore(winner, depth) {
  if (winner === AI)    return 10 - depth;  // AI wins → positive
  if (winner === HUMAN) return depth - 10;  // Human wins → negative
  return 0;                                  // Draw → neutral
}

// ─────────────────────────────────────────────────
// STEP 2: The Minimax function
// ─────────────────────────────────────────────────
// Recursively simulates all possible future moves.
//
// Parameters:
//   board      — current board (9-element array)
//   depth      — how many moves deep we are (starts at 0)
//   isAITurn   — true = AI is choosing, false = human is choosing
//   alpha      — best score AI has found so far (starts at -Infinity)
//   beta       — best score human has found so far (starts at +Infinity)
//   treeNode   — optional: used to record moves for visualization
//
// Returns: the best score achievable from this board position
function minimax(board, depth, isAITurn, alpha, beta, treeNode) {

  // --- Check if game is already over ---
  const result = checkWinner(board);
  if (result) {
    return getScore(result.winner, depth); // game ended, score it
  }

  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return 0; // no moves left = draw
  }

  // --- Decide: should we record children for the game tree? ---
  // Only capture up to depth 2 to keep the visual tree manageable
  const shouldCapture = treeNode && depth < 2;

  // ── AI's turn: try all moves, keep the HIGHEST score ──
  if (isAITurn) {
    let best = -Infinity;

    for (const cell of emptyCells) {
      // Place AI's piece on this cell
      const newBoard = applyMove(board, cell, AI);

      // Build a child node for visualization (if capturing)
      let child = null;
      if (shouldCapture) {
        child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: AI };
        treeNode.children.push(child);
      }

      // Recursively find the score after this move
      const score = minimax(newBoard, depth + 1, false, alpha, beta, child);
      if (child) child.score = score;

      // Keep track of the best score found
      if (score > best) best = score;
      if (score > alpha) alpha = score; // update AI's best guarantee

      // ALPHA-BETA PRUNING:
      // If beta <= alpha, the human would never let us reach this branch
      // because they already have a better option. Stop searching here.
      if (beta <= alpha) {
        // Mark any remaining cells as "pruned" in the tree visualization
        if (shouldCapture) {
          const rest = emptyCells.slice(emptyCells.indexOf(cell) + 1);
          for (const skipped of rest) {
            treeNode.children.push({ board: null, move: skipped, score: null, pruned: true, children: [], player: AI });
          }
        }
        break; // prune! skip the remaining branches
      }
    }

    if (treeNode) treeNode.score = best;
    return best;

  // ── Human's turn: try all moves, keep the LOWEST score ──
  } else {
    let best = Infinity;

    for (const cell of emptyCells) {
      // Place human's piece on this cell
      const newBoard = applyMove(board, cell, HUMAN);

      let child = null;
      if (shouldCapture) {
        child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: HUMAN };
        treeNode.children.push(child);
      }

      const score = minimax(newBoard, depth + 1, true, alpha, beta, child);
      if (child) child.score = score;

      if (score < best) best = score;
      if (score < beta) beta = score; // update human's best guarantee

      // ALPHA-BETA PRUNING:
      // If beta <= alpha, the AI would never let us reach this branch
      // because it already has a better option. Stop searching here.
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

// ─────────────────────────────────────────────────
// STEP 3: Find the best move (entry point)
// ─────────────────────────────────────────────────
// Tries every empty cell, scores each one using minimax,
// and returns the cell with the highest score.
//
// Returns:
//   index     — the best cell for AI to play
//   scores    — scores for all candidate moves (for Debug panel)
//   tree      — the full game tree (for Game Tree visualization)
//   bestScore — the score of the chosen move
export function getBestMove(board) {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return null;

  // Root node for the game tree visualization
  const tree = {
    board,
    move: null,
    score: null,
    pruned: false,
    children: [],
    player: null,
  };

  const scores = [];       // scores for each candidate move
  let bestScore = -Infinity;
  let bestIndex = emptyCells[0];

  for (const cell of emptyCells) {
    // Try placing AI here
    const newBoard = applyMove(board, cell, AI);

    // Create a child node for this move in the tree
    const child = { board: newBoard, move: cell, score: null, pruned: false, children: [], player: AI };
    tree.children.push(child);

    // Score this move (human plays next, so isAITurn = false)
    const score = minimax(newBoard, 0, false, -Infinity, Infinity, child);
    child.score = score;

    scores.push({ index: cell, score });

    // Is this the best move so far?
    if (score > bestScore) {
      bestScore = score;
      bestIndex = cell;
    }
  }

  tree.score = bestScore;

  return { index: bestIndex, scores, tree, bestScore };
}
