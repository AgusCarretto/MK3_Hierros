import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './OurWork.css'; // Crea este archivo para los estilos de la página
// Importa el componente Card que vamos a crear
import WorkCard from './WorkCard'; 

const OurWork = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch('http://localhost:3000/works'); // Asegúrate de que esta URL sea la correcta de tu backend
        if (!response.ok) {
          throw new Error('Error al obtener los trabajos.');
        }
        const data = await response.json();
        setWorks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2>Cargando trabajos...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Nuestros Trabajos</h1>
        <div className="works-grid">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurWork;