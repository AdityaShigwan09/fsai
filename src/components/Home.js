import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
    const [text, setText] = useState('');
    const navigate = useNavigate();
    const fullText = "Welcome to the ultimate Tic Tac Toe challenge against an unbeatable Game Theory AI.";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index + 1));
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
            }
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">
                    <span className="title-x">X</span>
                    <span className="title-sep"> vs </span>
                    <span className="title-o">O</span>
                </h1>
                <div className="typing-container">
                    <p className="typing-text">{text}<span className="cursor">|</span></p>
                </div>
                <div className="home-actions">
                    <button className="play-button" onClick={() => navigate('/game')}>Play Now</button>
                    <button className="about-button" onClick={() => navigate('/about')}>Learn More</button>
                </div>
            </div>
        </div>
    );
}
