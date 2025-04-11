import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">Padel Tournament</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/')}`} 
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/teams" 
              className={`nav-link ${isActive('/teams')}`} 
              onClick={closeMenu}
            >
              Squadre
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/matches" 
              className={`nav-link ${isActive('/matches')}`} 
              onClick={closeMenu}
            >
              Partite
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/statistics" 
              className={`nav-link ${isActive('/statistics')}`} 
              onClick={closeMenu}
            >
              Statistiche
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;