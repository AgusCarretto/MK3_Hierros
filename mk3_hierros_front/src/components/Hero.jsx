import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Hero.css';
import backgroundImage from '../assets/img/fondoHero.jpg'; // Asegúrate de tener esta imagen en tu carpeta de assets
import titleImage from '../assets/img/logo-principal_sin_fondo_blanco.png'; // Asegúrate de tener esta imagen en tu carpeta de assets

const Hero = () => {
  return (
    <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Contenido de navegación en la esquina superior derecha */}
      <ul className="hero-nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/nuestros-trabajos">Nuestros Trabajos</Link></li>
        <li><Link to="/contactanos">Contáctanos</Link></li>
      </ul>

      {/* Contenido principal con el título */}
      <div className="hero-content">
        <img src={titleImage} alt="Mk3 Hierros" className="hero-title-img" />
      </div>
    </div>
  );
};

export default Hero;
