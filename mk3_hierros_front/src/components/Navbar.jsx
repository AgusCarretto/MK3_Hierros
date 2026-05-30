import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = ({ standalone = false }) => {
  return (
    <header className={`hero-topbar${standalone ? ' navbar-standalone' : ''}`}>
      <div className="hero-brand">
        <span className="hero-brand-mark">MK3</span>
        <span className="hero-brand-tag">Metal Lab</span>
      </div>
      <nav>
        <ul className="hero-nav-links">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/nuestros-trabajos">Trabajos</Link>
          </li>
          <li>
            <Link to="/contactanos">Contacto</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
