/**
 * Board.js — 3×3 game grid
 * Renders 9 Cell components and passes down game state as props.
 */
import React, { memo } from 'react';
import Cell from './Cell';

const Board = memo(function Board({ board, onCellClick, winLine, aiScores, bestMoveIndex, debugMode }) {
  // Build a score lookup from index → score for candidate display
  const scoreMap = {};
  if (debugMode && aiScores) {
    aiScores.forEach(({ index, score }) => { scoreMap[index] = score; });
  }

  return (
    <div className="board">
      {board.map((value, idx) => (
        <Cell
          key={idx}
          index={idx}
          value={value}
          onClick={onCellClick}
          isWinning={winLine ? winLine.includes(idx) : false}
          isBestMove={debugMode && idx === bestMoveIndex && !value}
          isCandidate={debugMode && scoreMap[idx] !== undefined}
          candidateScore={scoreMap[idx]}
        />
      ))}
    </div>
  );
});

export default Board;
