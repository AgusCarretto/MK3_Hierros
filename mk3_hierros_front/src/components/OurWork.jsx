import React, { useState, useEffect } from 'react';
import './styles/OurWork.css';
import WorkCard from './WorkCard'; 

const OurWork = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('http://localhost:3000/trabajo');
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

  if (loading) return <div className="loader-minimal">Cargando portafolio...</div>;

  return (
    <section className="our-work-section">
      <div className="header-container">
        <span className="subtitle">Proyectos Seleccionados</span>
        <h2 className="title-minimal">Nuestra Herreía</h2>
      </div>
      
      <div className="works-minimal-grid">
        {works.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </section>
  );
};

export default OurWork;