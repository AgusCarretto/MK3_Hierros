import React from 'react';
import './WorkCard.css'; // Crea este archivo para los estilos de la card

const WorkCard = ({ work }) => {
  return (
    <div className="work-card">
      <img src={work.image} alt={work.title} className="work-image" />
      <div className="work-content">
        <h3 className="work-title">{work.title}</h3>
        <p className="work-description">{work.description}</p>
      </div>
    </div>
  );
};

export default WorkCard;