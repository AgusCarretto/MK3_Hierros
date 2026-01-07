import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Hero.css';
import backgroundImage from '../assets/img/fondoHero.jpg'; // Asegúrate de tener esta imagen en tu carpeta de assets
import titleImage from '../assets/img/logo-principal_sin_fondo_blanco.png'; // Asegúrate de tener esta imagen en tu carpeta de assets

const Hero = () => {
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-overlay" />

      <header className="hero-topbar">
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

      <div className="hero-content glow-panel">
        <span className="hero-pill neon-pill">Herrería de precisión</span>
        <img src={titleImage} alt="Mk3 Hierros" className="hero-title-img" />
        <p className="hero-subtitle">
          Ingeniería artesanal, estructuras a medida y acabados futuristas en
          cada proyecto.
        </p>
        <div className="hero-cta-row">
          <Link to="/nuestros-trabajos" className="hero-btn primary">
            Ver trabajos
          </Link>
          <Link to="/contactanos" className="hero-btn ghost">
            Agendar consulta
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
