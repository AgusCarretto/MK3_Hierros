import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/Hero.css';
import backgroundImage from '../assets/img/fondoHero.jpg'; // Asegúrate de tener esta imagen en tu carpeta de assets
import titleImage from '../assets/img/logo-principal_sin_fondo_blanco.png'; // Asegúrate de tener esta imagen en tu carpeta de assets
import Navbar from './Navbar';

const Hero = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith('/trabajo/')) {
    return <Navbar standalone />;
  }

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="hero-overlay" />

      <Navbar />

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
