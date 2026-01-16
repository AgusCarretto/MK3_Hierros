import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/WorkCard.css';

const WorkCard = ({ work, isExpanded, onToggle }) => {
  const navigate = useNavigate();
  const [mainImageId, setMainImageId] = useState(null);

  // Efecto para buscar el ID de la imagen en la base de datos
  useEffect(() => {
    const fetchImageData = async () => {
      try {
        // Llamamos a tu endpoint de metadatos: @Get(':id/images')
        const response = await fetch(`https://mk3hierros-production.up.railway.app/trabajo/${work.id}/images`);
        const images = await response.json();
        
        if (images && images.length > 0) {
          // Guardamos el ID de la primera imagen para la miniatura
          setMainImageId(images[0].id); 
        }
      } catch (err) {
        console.error("Error al obtener metadatos de imagen:", err);
      }
    };

    fetchImageData();
  }, [work.id]);

  const handleGoToDetail = (e) => {
    e.stopPropagation();
    navigate("/trabajo/" + work.id);
  };

  // Construimos la URL apuntando a tu endpoint de descarga de imagen
  const imageUrl = mainImageId 
    ? `https://mk3hierros-production.up.railway.app/trabajo/${work.id}/images/${mainImageId}`
    : 'https://via.placeholder.com/150'; // Imagen por defecto si no hay fotos

  return (
    <div className="work-card" onClick={() => navigate("/trabajo/" + work.id)}>
      <img src={imageUrl} alt={work.title} className="work-thumbnail" />
      <div className="work-info-overlay">
        <h3>{work.title}</h3>
        <p>Click para explorar proyecto — MK3</p>
      </div>
    </div>
  );
};

export default WorkCard;