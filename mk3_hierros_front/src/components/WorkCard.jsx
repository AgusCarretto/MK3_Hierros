import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/WorkCard.css";

const WorkCard = ({ work }) => {
  const navigate = useNavigate();
  const [mainImageId, setMainImageId] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImageData = async () => {
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
      const cacheKey = `mk3_work_img_${work.id}_v1`;
      let cachedImageId = null;

      if (typeof window !== "undefined") {
        try {
          const cachedRaw = localStorage.getItem(cacheKey);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            const isValid =
              parsed &&
              typeof parsed.timestamp === "number" &&
              Date.now() - parsed.timestamp < CACHE_TTL &&
              parsed.imageId;

            if (isValid) {
              cachedImageId = parsed.imageId;
              setMainImageId(parsed.imageId);
              setImageError(false);
            } else {
              localStorage.removeItem(cacheKey);
            }
          }
        } catch (error) {
          console.warn("No se pudo leer el cache de imagen", error);
        }
      }

      try {
        const response = await fetch(
          `https://mk3hierros-production.up.railway.app/trabajo/${work.id}/images`
        );

        if (!response.ok) {
          throw new Error("Error al obtener imágenes");
        }

        const images = await response.json();

        if (images && images.length > 0) {
          const imageId = images[0].id;
          setMainImageId(imageId);
          setImageError(false);

          if (typeof window !== "undefined") {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ timestamp: Date.now(), imageId })
            );
          }
        } else if (!cachedImageId) {
          setMainImageId(null);
        }
      } catch (error) {
        console.error("Error al obtener metadatos de imagen:", error);
        if (!cachedImageId) {
          setImageError(true);
        }
      }
    };

    fetchImageData();
  }, [work.id]);

  const imageUrl = mainImageId
    ? `https://mk3hierros-production.up.railway.app/trabajo/${work.id}/images/${mainImageId}`
    : "https://via.placeholder.com/150";

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
      <img
        src={imageUrl}
        alt={work.title}
        className="work-thumbnail"
        loading="lazy"
        onError={() => setImageError(true)}
      />
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
