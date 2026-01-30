import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/workDetails.css";

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [imagesMetadata, setImagesMetadata] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchFullDetail = async () => {
      const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
      const CACHE_KEY = `mk3_work_detail_${id}_v1`;

      const toSafeImage = (image) =>
        image && image.id
          ? {
              id: image.id,
              imageName: image.imageName ?? null,
              imageMimeType: image.imageMimeType ?? null,
            }
          : null;

      let cachedEntry = null;

      if (typeof window !== "undefined") {
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            const isValid =
              parsed &&
              typeof parsed.timestamp === "number" &&
              Date.now() - parsed.timestamp < CACHE_TTL &&
              parsed.work &&
              Array.isArray(parsed.images);

            if (isValid) {
              cachedEntry = parsed;
              setWork(parsed.work);
              setImagesMetadata(parsed.images);
              setLoading(false);
              setLoadError(false);
            } else {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        } catch (error) {
          console.warn("No se pudo leer el cache de detalle", error);
        }
      }

      if (!cachedEntry) {
        setLoading(true);
        setLoadError(false);
      }

      try {
        const resWork = await fetch(
          `https://mk3hierros-production.up.railway.app/trabajo/${id}`
        );

        if (!resWork.ok) {
          throw new Error("No se pudo obtener el detalle del trabajo");
        }

        const workData = await resWork.json();
        const resImages = await fetch(
          `https://mk3hierros-production.up.railway.app/trabajo/${id}/images`
        );

        if (!resImages.ok) {
          throw new Error("No se pudo obtener las imágenes del trabajo");
        }

        const imagesData = await resImages.json();

        const safeImages = Array.isArray(imagesData)
          ? imagesData.map(toSafeImage).filter(Boolean)
          : [];

        const safeWork = {
          ...workData,
          images: Array.isArray(workData?.images)
            ? workData.images.map(toSafeImage).filter(Boolean)
            : undefined,
        };

        setWork(safeWork);
        setImagesMetadata(safeImages);
        setLoadError(false);

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                work: safeWork,
                images: safeImages,
              })
            );
          } catch (storageError) {
            if (
              storageError instanceof DOMException &&
              storageError.name === "QuotaExceededError"
            ) {
              console.warn(
                "Cache de detalle excedió la cuota, se omitirá el almacenamiento.",
                storageError
              );
              localStorage.removeItem(CACHE_KEY);
            } else {
              console.warn(
                "No se pudo almacenar el cache de detalle",
                storageError
              );
            }
          }
        }
      } catch (error) {
        console.error("Error cargando detalle:", error);
        if (!cachedEntry) {
          setWork(null);
          setImagesMetadata([]);
          setLoadError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetail();
  }, [id]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === imagesMetadata.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? imagesMetadata.length - 1 : prev - 1
    );
  };

  if (loading)
    return <div className="detail-loading">Cargando proyecto...</div>;
  if (loadError) {
    return (
      <div className="detail-error">
        No pudimos cargar el detalle del trabajo. Intenta nuevamente en unos
        instantes.
      </div>
    );
  }
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
              <div className="detail-image-frame">
                <img
                  src={`https://mk3hierros-production.up.railway.app/trabajo/${id}/images/${imagesMetadata[currentIndex].id}`}
                  alt={`Proyecto ${currentIndex + 1}`}
                  loading="lazy"
                />
              </div>
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
