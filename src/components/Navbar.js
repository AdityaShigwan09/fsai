import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="brand-x">X</span>
                <span className="brand-sep"> vs </span>
                <span className="brand-o">O</span>
            </div>
            <div className="navbar-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    Home
                </NavLink>
                <NavLink to="/game" className={({ isActive }) => Math.max(isActive) ? "nav-link active" : "nav-link"}>
                    Play Game
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                    About
                </NavLink>
            </div>
        </nav>
    );
}
