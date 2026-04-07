/**
 * Game.js — Main Tic Tac Toe logic and AI interaction
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Board from './Board';
import GameTree from './GameTree';
import { checkWinner, checkDraw, applyMove } from '../logic/gameLogic';
import { getBestMove } from '../logic/aiLogic';

const EMPTY_BOARD = Array(9).fill(null);

export default function Game() {
    const [board, setBoard] = useState(EMPTY_BOARD);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);
    const [showTree, setShowTree] = useState(false);
    const [aiThinking, setAiThinking] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const thinkTimeout = useRef(null);

    const handleCellClick = useCallback((index) => {
        if (winner || isDraw || currentPlayer !== 'X' || board[index] || aiThinking) return;
        const newBoard = applyMove(board, index, 'X');
        const result = checkWinner(newBoard);
        const draw = !result && checkDraw(newBoard);
        setBoard(newBoard);
        if (result) { setWinner(result); return; }
        if (draw) { setIsDraw(true); return; }
        setCurrentPlayer('O');
    }, [board, winner, isDraw, currentPlayer, aiThinking]);

    useEffect(() => {
        if (currentPlayer !== 'O' || winner || isDraw) return;
        setAiThinking(true);
        thinkTimeout.current = setTimeout(() => {
            const result = getBestMove(board);
            if (!result) { setAiThinking(false); return; }
            const { index, scores, tree, bestScore } = result;
            setAiResult({ scores, bestMoveIndex: index, bestScore, tree });
            const newBoard = applyMove(board, index, 'O');
            const winResult = checkWinner(newBoard);
            const draw = !winResult && checkDraw(newBoard);
            setBoard(newBoard);
            setAiThinking(false);
            if (winResult) { setWinner(winResult); return; }
            if (draw) { setIsDraw(true); return; }
            setCurrentPlayer('X');
        }, 420);
        return () => clearTimeout(thinkTimeout.current);
    }, [currentPlayer, board, winner, isDraw]);

    const handleRestart = useCallback(() => {
        clearTimeout(thinkTimeout.current);
        setBoard(EMPTY_BOARD);
        setCurrentPlayer('X');
        setWinner(null);
        setIsDraw(false);
        setAiThinking(false);
        setAiResult(null);
    }, []);

    const statusMessage = winner
        ? winner.winner === 'X' ? '🎉 You Win!' : '🤖 AI Wins!'
        : isDraw ? "🤝 It's a Draw!"
            : aiThinking ? '🧠 AI is thinking…'
                : currentPlayer === 'X' ? '👆 Your turn (X)'
                    : '⏳ AI turn (O)';

    return (
        <div className="game-container">
            <div className="controls">
                <button className={`toggle-btn ${showTree ? 'toggle-on' : ''}`} onClick={() => setShowTree(s => !s)}>
                    {showTree ? '🌲 Tree ON' : '🌲 Tree OFF'}
                </button>
                <button className="restart-btn" onClick={handleRestart}>↺ Restart</button>
            </div>

            <div className="main-layout">
                <div className="game-area">
                    <div className={`status-bar ${winner ? (winner.winner === 'X' ? 'status-win-human' : 'status-win-ai') : isDraw ? 'status-draw' : ''}`}>
                        {statusMessage}
                    </div>
                    <Board
                        board={board}
                        onCellClick={handleCellClick}
                        winLine={winner ? winner.line : null}
                        aiScores={aiResult ? aiResult.scores : null}
                        bestMoveIndex={aiResult ? aiResult.bestMoveIndex : null}
                    />
                    <div className="player-tags">
                        <div className="player-tag tag-human">
                            <span>You</span><span className="tag-symbol">X</span><span className="tag-role">Minimizer</span>
                        </div>
                        <div className="player-tag tag-ai">
                            <span>AI</span><span className="tag-symbol">O</span><span className="tag-role">Maximizer</span>
                        </div>
                    </div>
                </div>
            </div>

            {showTree && (
                <GameTree tree={aiResult ? aiResult.tree : null} showTree={showTree} />
            )}
        </div>
    );
}
