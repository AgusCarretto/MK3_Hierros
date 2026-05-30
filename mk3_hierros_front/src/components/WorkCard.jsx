import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/WorkCard.css";

const WorkCard = ({ work }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    work.previewImageId && !imageError
      ? `https://mk3hierros-production.up.railway.app/trabajo/${work.id}/images/${work.previewImageId}`
      : null;

  return (
    <div
      className="work-card"
      onClick={() => navigate("/trabajo/" + work.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate("/trabajo/" + work.id);
        }
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={work.title}
          className="work-thumbnail"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="work-thumbnail work-thumbnail--empty" />
      )}
      <div className="work-info-overlay">
        <h3>{work.title}</h3>
        <p>
          {imageError
            ? "Ver detalles del proyecto"
            : "Click para explorar proyecto — MK3"}
        </p>
      </div>
    </div>
  );
};

export default WorkCard;
