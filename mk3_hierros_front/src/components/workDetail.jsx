import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/workDetails.css'; 

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [imagesMetadata, setImagesMetadata] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetail = async () => {
      try {
        // 1. Obtenemos los datos del trabajo (título, descripción)
        const resWork = await fetch(`https://mk3hierros-production.up.railway.app/trabajo/${id}`);
        const workData = await resWork.json();
        setWork(workData);

        // 2. Obtenemos los metadatos de las imágenes
        const resImages = await fetch(`https://mk3hierros-production.up.railway.app/trabajo/${id}/images`);
        const imagesData = await resImages.json();
        setImagesMetadata(imagesData);
      } catch (error) {
        console.error("Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetail();
  }, [id]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imagesMetadata.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagesMetadata.length - 1 : prev - 1));
  };

  if (loading) return <div className="detail-loading">Cargando proyecto...</div>;
  if (!work) return <div className="detail-error">Trabajo no encontrado</div>;

  return (
    <main className="work-detail-page">
      <div className="detail-nav">
        <button className="back-nav" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <span className="detail-pill neon-pill">Proyecto destacado</span>
      </div>

      <section className="detail-header glow-panel">
        <h1>{work.title}</h1>
        <p>{work.description}</p>
      </section>

      <section className="slider-shell glow-panel">
        {imagesMetadata.length > 0 ? (
          <>
            <button
              className="arrow left"
              onClick={prevSlide}
              aria-label="Imagen anterior"
            >
              &#10094;
            </button>
            <div className="main-slide">
              <img
                src={`https://mk3hierros-production.up.railway.app/trabajo/${id}/images/${imagesMetadata[currentIndex].id}`}
                alt={`Proyecto ${currentIndex + 1}`}
              />
              <span className="counter">
                {currentIndex + 1} / {imagesMetadata.length}
              </span>
            </div>
            <button
              className="arrow right"
              onClick={nextSlide}
              aria-label="Imagen siguiente"
            >
              &#10095;
            </button>
          </>
        ) : (
          <p className="slider-empty">
            No hay imágenes disponibles para este proyecto.
          </p>
        )}
      </section>
    </main>
  );
};

export default WorkDetail;