import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles/OurWork.css";
import WorkCard from "./WorkCard";

const OurWork = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [categoryName, setCategoryName] = useState("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchWorks = async () => {
      const params = new URLSearchParams(location.search);
      const categoryId = params.get("categoria");
      const categoryLabel = params.get("nombre");

      let readableName = "";

      if (categoryLabel) {
        try {
          readableName = decodeURIComponent(categoryLabel);
        } catch (error) {
          readableName = categoryLabel;
        }
      }

      setCategoryName(readableName);
      setLoadError(false);

      const CACHE_TTL = 60 * 60 * 1000; // 1 hora
      const cacheKey = categoryId
        ? `mk3_works_category_${categoryId}_v1`
        : "mk3_works_finalizados_v1";

      let cachedWorks = null;

      if (typeof window !== "undefined") {
        try {
          const cachedRaw = localStorage.getItem(cacheKey);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            const isValid =
              parsed &&
              Array.isArray(parsed.data) &&
              typeof parsed.timestamp === "number" &&
              Date.now() - parsed.timestamp < CACHE_TTL;

            if (isValid) {
              cachedWorks = parsed.data;
              setWorks(parsed.data);
            } else {
              localStorage.removeItem(cacheKey);
            }
          }
        } catch (error) {
          console.warn("No se pudo leer el cache de trabajos", error);
        }
      }

      setLoading(!cachedWorks);

      try {
        let endpoint =
          "https://mk3hierros-production.up.railway.app/trabajo/byStatus/Finalizado";

        if (categoryId) {
          endpoint = `https://mk3hierros-production.up.railway.app/trabajo/byCategory/${categoryId}`;
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Error al obtener trabajos");
        }

        const data = await response.json();
        const finalised = categoryId
          ? data.filter((work) => work.status === "Finalizado")
          : data;

        setWorks(finalised);
        setLoadError(false);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ timestamp: Date.now(), data: finalised })
          );
        }
      } catch (error) {
        console.error("No se pudieron cargar los trabajos", error);
        if (!cachedWorks) {
          setWorks([]);
          setLoadError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, [location.search]);

  if (loading) {
    return <div className="loader-minimal">Cargando trabajos...</div>;
  }

  return (
    <section className="our-work-section">
      <div className="header-container">
        <span className="subtitle neon-pill">Portafolio en evolución</span>
        <h2 className="title-minimal">
          {categoryName ? `Trabajos en ${categoryName}` : "Nuestros Trabajos"}
        </h2>
        <p className="section-description">
          {categoryName
            ? "Mostramos los proyectos finalizados de la categoría seleccionada."
            : "Explora los trabajos finalizados que ya forman parte de nuestro taller."}
        </p>
      </div>

      {loadError ? (
        <div className="empty-state glow-panel">
          <span className="empty-state-badge">Hubo un inconveniente</span>
          <h3>
            Intenta actualizar la página para volver a cargar los trabajos.
          </h3>
        </div>
      ) : works.length === 0 ? (
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
