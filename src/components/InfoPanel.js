/**
 * InfoPanel.js — AI Decision Visualization
 *
 * When Debug Mode is ON, this panel shows:
 *  - Every candidate move the AI evaluated
 *  - The Minimax score for each move
 *  - Which move was chosen as best (and why)
 *  - A step-by-step explanation of the decision
 */
import React, { memo } from 'react';

const InfoPanel = memo(function InfoPanel({ aiScores, bestMoveIndex, bestScore, thinking, debugMode }) {
  if (!debugMode) return null;

  return (
    <aside className="info-panel">
      <h3 className="panel-title">
        <span className="panel-icon">🧠</span> AI Analysis
      </h3>

      {thinking && (
        <div className="thinking-indicator">
          <span className="dot-anim">●</span>
          <span className="dot-anim" style={{ animationDelay: '0.2s' }}>●</span>
          <span className="dot-anim" style={{ animationDelay: '0.4s' }}>●</span>
          <span style={{ marginLeft: 8 }}>AI is thinking…</span>
        </div>
      )}

      {!thinking && aiScores && aiScores.length > 0 && (
        <>
          <p className="panel-subtitle">Candidate moves evaluated by Minimax:</p>
          <div className="score-list">
            {aiScores
              .slice()
              .sort((a, b) => b.score - a.score)
              .map(({ index, score }) => {
                const isBest = index === bestMoveIndex;
                return (
                  <div key={index} className={`score-row ${isBest ? 'score-row-best' : ''}`}>
                    <span className="move-badge">Cell {index + 1}</span>
                    <div className="score-bar-wrap">
                      <div
                        className="score-bar"
                        style={{
                          width: `${Math.abs(score) / 10 * 100}%`,
                          background: score > 0 ? 'var(--ai-color)' : score < 0 ? 'var(--human-color)' : '#666'
                        }}
                      />
                    </div>
                    <span className={`score-val ${score > 0 ? 'pos' : score < 0 ? 'neg' : ''}`}>
                      {score > 0 ? `+${score}` : score}
                    </span>
                    {isBest && <span className="best-badge">✓ BEST</span>}
                  </div>
                );
              })}
          </div>

          <div className="explanation-box">
            <p className="explanation-title">💡 Decision Explanation</p>
            <p className="explanation-text">
              The AI evaluated <strong>{aiScores.length}</strong> possible move{aiScores.length > 1 ? 's' : ''} using
              Minimax with Alpha-Beta pruning. Cell <strong>{bestMoveIndex + 1}</strong> received the highest
              score of <strong>{bestScore > 0 ? `+${bestScore}` : bestScore}</strong>, so the AI selected it
              as the optimal play.
            </p>
            <p className="explanation-text">
              {bestScore > 0
                ? '🟢 Positive score → AI is in a winning position.'
                : bestScore < 0
                ? '🔴 Negative score → AI is playing defensively to delay a loss.'
                : '🟡 Score of 0 → Best achievable outcome is a draw.'}
            </p>
          </div>

          <div className="theory-box">
            <p className="theory-title">📐 Alpha-Beta Pruning</p>
            <p className="explanation-text">
              Branches where the opponent would never allow play were <em>pruned</em> — skipped entirely.
              This reduced computation while guaranteeing the same optimal result as full Minimax.
            </p>
          </div>
        </>
      )}

      {!thinking && (!aiScores || aiScores.length === 0) && (
        <p className="panel-empty">Make a move to see AI analysis here.</p>
      )}
    </aside>
  );
});

export default InfoPanel;
