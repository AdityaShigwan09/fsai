
import React, { memo } from 'react';
import Cell from './Cell';

const Board = memo(function Board({ board, onCellClick, winLine, aiScores, bestMoveIndex }) {
  const scoreMap = {};
  if (aiScores) {
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
          isBestMove={idx === bestMoveIndex && !value}
          isCandidate={scoreMap[idx] !== undefined}
          candidateScore={scoreMap[idx]}
        />
      ))}
    </div>
  );
});

export default Board;
