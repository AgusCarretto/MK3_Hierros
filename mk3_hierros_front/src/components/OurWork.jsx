import React, { useState, useEffect } from 'react';
import './styles/OurWork.css';
import WorkCard from './WorkCard'; 

const OurWork = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('https://mk3hierros-production.up.railway.app');
        const data = await response.json();
        setWorks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  if (loading)
    return <div className="loader-minimal">Cargando trabajos...</div>;

  return (
    <section className="our-work-section">
      <div className="header-container">
        <span className="subtitle neon-pill">Portafolio en evolución</span>
        <h2 className="title-minimal">Nuestros Trabajos</h2>
      </div>

      {works.length === 0 ? (
        <div className="empty-state glow-panel">
          <span className="empty-state-badge">Taller en marcha</span>
          <h3>
            Se están forjando nuevos trabajos, regresa pronto para poder verlos.
          </h3>
        </div>
      ) : (
        <div className="works-minimal-grid glow-panel">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </section>
  );
};

export default OurWork;