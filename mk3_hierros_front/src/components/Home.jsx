import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const CACHE_KEY = "mk3_categories_cache_v1";
      const CACHE_TTL = 60 * 60 * 1000; // 1 hora
      let cachedCategories = null;

      if (typeof window !== "undefined") {
        try {
          const cachedRaw = localStorage.getItem(CACHE_KEY);
          if (cachedRaw) {
            const parsed = JSON.parse(cachedRaw);
            const isValid =
              parsed &&
              Array.isArray(parsed.data) &&
              typeof parsed.timestamp === "number" &&
              Date.now() - parsed.timestamp < CACHE_TTL;

            if (isValid) {
              cachedCategories = parsed.data;
              setCategories(parsed.data);
              setCategoryError(false);
            } else {
              localStorage.removeItem(CACHE_KEY);
            }
          }
        } catch (error) {
          console.warn("No se pudo leer el cache de categorías", error);
        }
      }

      setLoadingCategories(!cachedCategories);

      try {
        const response = await fetch(
          "https://mk3hierros-production.up.railway.app/categorias"
        );
        if (!response.ok) {
          throw new Error("Error al obtener categorías");
        }
        const data = await response.json();
        setCategories(data);
        setCategoryError(false);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data })
          );
        }
      } catch (error) {
        console.error("No se pudieron cargar las categorías", error);
        if (!cachedCategories) {
          setCategoryError(true);
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const goToCategory = (category) => {
    navigate(
      `/nuestros-trabajos?categoria=${category.id}&nombre=${encodeURIComponent(
        category.name
      )}`
    );
  };

  const handleCategoryKeyDown = (event, category) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToCategory(category);
    }
  };

  return (
    <main className="home-container">
      {/* SECCIÓN SOBRE NOSOTROS */}
      <section className="home-section glow-panel">
        <div className="section-title-area">
          <span className="section-number">01</span>
          <div className="section-heading">
            <span className="section-label neon-pill">Sobre Nosotros</span>
            <h2>Soluciones en hierro a medida</h2>
          </div>
        </div>
        <div className="section-text-area">
          <p className="highlight-text">
            En <strong>MK3 Soluciones en Hierro</strong>, transformamos la
            materia prima en piezas de precisión. Combinamos la robustez del
            hierro con diseños funcionales y modernos.
          </p>
          <p>
            Somos especialistas en trabajos a medida, ofreciendo soluciones
            creativas para cada proyecto. Nuestro compromiso reside en la
            durabilidad, la técnica artesanal y la total satisfacción de quienes
            confían en nuestro taller.
          </p>
          <div className="values-row">
            <span>/ CALIDAD</span>
            <span>/ DISEÑO</span>
            <span>/ RESISTENCIA</span>
          </div>
        </div>
      </section>

      {/* SECCIÓN SERVICIOS */}
      <section className="home-section glow-panel">
        <div className="section-title-area">
          <span className="section-number">02</span>
          <div className="section-heading">
            <span className="section-label neon-pill">Servicios</span>
            <h2>Nuestro laboratorio metalúrgico</h2>
          </div>
        </div>
        <div className="section-text-area">
          <div className="services-grid">
            {loadingCategories ? (
              <div className="service-placeholder">Cargando categorías...</div>
            ) : categoryError ? (
              <div className="service-placeholder">
                No pudimos cargar las categorías.
              </div>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="service-tag"
                  onClick={() => goToCategory(category)}
                  onKeyDown={(event) => handleCategoryKeyDown(event, category)}
                  role="button"
                  tabIndex={0}
                >
                  {category.name}
                </div>
              ))
            ) : (
              <div className="service-placeholder">
                No hay categorías disponibles por el momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN CALL TO ACTION (CTA) */}
      <section className="home-cta-section">
        <div className="cta-card glow-panel">
          <span className="cta-subtitle neon-pill">¿Tenés un proyecto?</span>
          <h3 className="cta-title">Llevamos tus ideas al plano real</h3>
          <p className="cta-text">
            Calidad técnica y diseño industrial para soluciones duraderas en
            hierro.
          </p>
          <button
            className="btn-contact"
            onClick={() => navigate("/contactanos")}
          >
            Hablemos ahora
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
