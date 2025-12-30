import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="home-container">
      {/* SECCIÓN SOBRE NOSOTROS */}
      <section className="home-section glow-panel">
        <div className="section-title-area">
          <span className="section-number">01</span>
          <div className="section-heading">
            <span className="section-label neon-pill">Sobre Nosotros</span>
            <h2>Soluciones en hierro a medida</h2>
          </div>
        </div>
        <div className="section-text-area">
          <p className="highlight-text">
            En <strong>MK3 Soluciones en Hierro</strong>, transformamos la
            materia prima en piezas de precisión. Combinamos la robustez del
            hierro con diseños funcionales y modernos.
          </p>
          <p>
            Somos especialistas en trabajos a medida, ofreciendo soluciones
            creativas para cada proyecto. Nuestro compromiso reside en la
            durabilidad, la técnica artesanal y la total satisfacción de quienes
            confían en nuestro taller.
          </p>
          <div className="values-row">
            <span>/ CALIDAD</span>
            <span>/ DISEÑO</span>
            <span>/ RESISTENCIA</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section className="home-section glow-panel">
        <div className="section-title-area">
          <span className="section-number">02</span>
          <div className="section-heading">
            <span className="section-label neon-pill">Servicios</span>
            <h2>Nuestro laboratorio metalúrgico</h2>
          </div>
        </div>
        <div className="section-text-area">
          <div className="services-grid">
            <div
              className="service-tag"
              onClick={() => navigate("/nuestros-trabajos")}
            >
              Estructuras metálicas
            </div>
            <div
              className="service-tag"
              onClick={() => navigate("/nuestros-trabajos")}
            >
              Portones y rejas
            </div>
            <div
              className="service-tag"
              onClick={() => navigate("/nuestros-trabajos")}
            >
              Barandas y escaleras
            </div>
            <div
              className="service-tag"
              onClick={() => navigate("/nuestros-trabajos")}
            >
              Muebles de diseño industrial
            </div>
            <div
              className="service-tag"
              onClick={() => navigate("/nuestros-trabajos")}
            >
              Trabajos a medida
            </div>
            <div
              className="service-tag"
              onClick={() => navigate("/contactanos")}
            >
              Asesoramiento técnico
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CALL TO ACTION (CTA) */}
      <section className="home-cta-section">
        <div className="cta-card glow-panel">
          <span className="cta-subtitle neon-pill">¿Tenés un proyecto?</span>
          <h3 className="cta-title">Llevamos tus ideas al plano real</h3>
          <p className="cta-text">
            Calidad técnica y diseño industrial para soluciones duraderas en
            hierro.
          </p>
          <button
            className="btn-contact"
            onClick={() => navigate("/contactanos")}
          >
            Hablemos ahora
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;