import React from 'react';
import './styles/WorkCard.css'; // Asegúrate de crear este archivo para los estilos

const WorkCard = ({ work }) => {
  return (
    <div className="work-card">
      {/* <img src={work.image} alt={work.title} className="work-image" /> */}
      <div className="work-content">
        <h3 className="work-title">{work.title}</h3>
        <p className="work-description">{work.description}</p>
      </div>
    </div>
  );
};

export default WorkCard;