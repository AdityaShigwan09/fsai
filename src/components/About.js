import React from 'react';
import './About.css';

export default function About() {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1 className="about-title">How It Works</h1>

                <section className="about-section">
                    <h2>How to Play Tic Tac Toe</h2>
                    <p>
                        Tic Tac Toe is a classic game played on a 3x3 grid. You are <strong>X</strong> and the AI is <strong>O</strong>.
                        Players take turns putting their marks in empty squares. The first player to get 3 of their marks in a row
                        (up, down, across, or diagonally) is the winner. If all 9 squares are full and no player has 3 marks in a row, the game is a draw.
                    </p>
                </section>

                <section className="about-section ai-section">
                    <h2>How the AI Works</h2>
                    <p>
                        You might have noticed this AI is impossible to beat! That is because it uses a technique from Game Theory called the <strong>Minimax Algorithm</strong>.
                    </p>
                    <div className="concept-cards">
                        <div className="concept-card">
                            <div className="card-icon">🧠</div>
                            <h3>Minimax Algorithm</h3>
                            <p>
                                Before making a move, the AI generates a massive tree of all possible future moves. It assumes you will play perfectly to win, and it finds the move that minimizes your best possible outcome, while maximizing its own.
                            </p>
                        </div>
                        <div className="concept-card">
                            <div className="card-icon">✂️</div>
                            <h3>Alpha-Beta Pruning</h3>
                            <p>
                                Looking at every single future move takes a lot of time. Alpha-Beta Pruning is a trick that lets the AI safely ignore ("prune") paths that it already knows are worse than a move it previously found. This makes the AI think much faster!
                            </p>
                        </div>
                    </div>
                    <p className="tree-hint">
                        <strong>Pro Tip:</strong> When playing the game, you can turn on <strong>"Tree ON"</strong> to visually see the future paths the AI is calculating in real-time!
                    </p>
                </section>
            </div>
        </div>
    );
}
