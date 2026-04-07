/**
 * App.js — Root component, sets up Routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Game from './components/Game';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="visual-banner">
          <h2 className="visual-title">
            Visual Representation To Play Tic Tac Toe Game
          </h2>
        </div>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

