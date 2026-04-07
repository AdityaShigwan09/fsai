import React, { memo, useMemo } from 'react';

function MiniBoard({ board, highlightMove }) {
  if (!board) return <div className="mini-board mini-board-empty">✂️ pruned</div>;
  return (
    <div className="mini-board">
      {board.map((cell, i) => (
        <div
          key={i}
          className={`mini-cell ${cell === 'X' ? 'mini-x' : cell === 'O' ? 'mini-o' : ''} ${i === highlightMove ? 'mini-highlight' : ''}`}
        >
          {cell || ''}
        </div>
      ))}
    </div>
  );
}

function findOptimalPath(node, isMax = true) {
  if (!node.children || node.children.length === 0) return [node.move];
  const best = node.children
    .filter(c => !c.pruned)
    .reduce((a, b) => {
      if (!a) return b;
      return isMax ? (b.score > a.score ? b : a) : (b.score < a.score ? b : a);
    }, null);
  if (!best) return [];
  return [node.move, ...findOptimalPath(best, !isMax)];
}

const TreeNode = memo(function TreeNode({ node, depth, optimalMoves, isOptimal }) {
  const score = node.score;

  return (
    <div className={`tree-node-wrap depth-${depth}`}>
      <div className={`tree-node ${node.pruned ? 'node-pruned' : ''} ${isOptimal ? 'node-optimal' : ''}`}>
        <div className="node-player">{node.player ? `${node.player} plays` : 'Start'}</div>
        <MiniBoard board={node.board} highlightMove={node.move} />
        <div className={`node-score ${score > 0 ? 'pos' : score < 0 ? 'neg' : ''}`}>
          {node.pruned ? '✂ pruned' : score !== null ? (score > 0 ? `+${score}` : score) : '…'}
        </div>
        {isOptimal && !node.pruned && <div className="node-optimal-badge">★ optimal</div>}
      </div>

      {!node.pruned && node.children && node.children.length > 0 && depth < 2 && (
        <div className="tree-children">
          {node.children.map((child, i) => {
            const childOptimal = isOptimal && optimalMoves.includes(child.move);
            return (
              <div key={i} className="tree-branch">
                <div className="branch-line" />
                <TreeNode
                  node={child}
                  depth={depth + 1}
                  optimalMoves={optimalMoves}
                  isOptimal={childOptimal}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

const GameTree = memo(function GameTree({ tree, showTree }) {
  const optimalMoves = useMemo(() => {
    if (!tree) return [];
    return findOptimalPath(tree, true);
  }, [tree]);

  if (!showTree) return null;
  if (!tree) {
    return (
      <div className="game-tree-panel">
        <h3 className="panel-title"><span className="panel-icon">🌲</span> Game Tree</h3>
        <p className="panel-empty">Make a move to see the game tree.</p>
      </div>
    );
  }

  return (
    <div className="game-tree-panel">
      <h3 className="panel-title"><span className="panel-icon">🌲</span> Game Tree (depth 2)</h3>
      <div className="tree-legend">
        <span className="legend-item optimal">★ Optimal path</span>
        <span className="legend-item pruned-legend">✂ Pruned (skipped)</span>
        <span className="legend-item pos-score">+N = AI winning</span>
        <span className="legend-item neg-score">−N = Human winning</span>
      </div>
      <div className="game-tree-scroll">
        <TreeNode
          node={tree}
          depth={0}
          optimalMoves={optimalMoves}
          isOptimal={true}
        />
      </div>
      <p className="tree-note">
        Alpha-Beta pruning skipped ✂ branches — the AI proved they couldn't affect the result.
      </p>
    </div>
  );
});

export default GameTree;