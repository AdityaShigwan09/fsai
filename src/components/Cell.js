import React, { memo } from 'react';

const Cell = memo(function Cell({ value, index, onClick, isWinning, isBestMove, isCandidate, candidateScore }) {
  let className = 'cell';
  if (value === 'X') className += ' cell-x';
  if (value === 'O') className += ' cell-o';
  if (isWinning) className += ' cell-winning';
  if (isBestMove) className += ' cell-best';
  if (isCandidate && !value) className += ' cell-candidate';

  return (
    <button
      className={className}
      onClick={() => onClick(index)}
      disabled={!!value}
      aria-label={`Cell ${index + 1}: ${value || 'empty'}`}
    >
      {value && <span className="cell-symbol">{value}</span>}
      {isCandidate && !value && candidateScore !== undefined && (
        <span className="candidate-score">{candidateScore > 0 ? `+${candidateScore}` : candidateScore}</span>
      )}
    </button>
  );
});

export default Cell;
