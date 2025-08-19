import React from 'react';
import './styles/Navbar.css'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
 return (
    <nav className="navbar">
      <Link to="/" className="nav-title">Mk3 Hierros</Link>
      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/nuestros-trabajos">Nuestros Trabajos</Link></li>
        <li><Link to="/contactanos">Contáctanos</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;