import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Hammer } from "lucide-react";
import { getFinishedWorks } from "../lib/api";
import { useCachedFetch } from "../hooks/useCachedFetch";
import { WorkGridSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import WorkCard from "./WorkCard";

const OurWork = () => {
  const location = useLocation();

  const { categoryId, categoryName } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("categoria");
    const rawName = params.get("nombre");
    let name = "";
    if (rawName) {
      try {
        name = decodeURIComponent(rawName);
      } catch {
        name = rawName;
      }
    }
    return { categoryId: id, categoryName: name };
  }, [location.search]);

  const cacheKey = categoryId
    ? `mk3_works_category_${categoryId}_v1`
    : "mk3_works_finalizados_v1";

  const {
    data: works,
    loading,
    error,
    retry,
  } = useCachedFetch(cacheKey, () => getFinishedWorks(categoryId), {
    ttl: 60 * 60 * 1000,
  });

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-[6vw] py-20">
      <div className="flex flex-col gap-3">
        <span className="neon-pill self-start">Portafolio en evolución</span>
        <h2 className="text-2xl text-text-primary sm:text-3xl">
          {categoryName ? `Trabajos en ${categoryName}` : "Nuestros Trabajos"}
        </h2>
        <p className="max-w-xl text-sm text-text-muted">
          {categoryName
            ? "Mostramos los proyectos finalizados de la categoría seleccionada."
            : "Explorá los trabajos finalizados que ya forman parte de nuestro taller."}
        </p>
      </div>

      {loading ? (
        <WorkGridSkeleton />
      ) : error ? (
        <EmptyState
          title="Hubo un inconveniente"
          description="Intenta actualizar la página para volver a cargar los trabajos."
          actionLabel="Reintentar"
          onAction={retry}
        />
      ) : works?.length === 0 ? (
        <EmptyState
          icon={Hammer}
          badge="Taller en marcha"
          title="Se están forjando nuevos trabajos"
          description="Regresá pronto para poder verlos."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.05 }}
            >
              <WorkCard work={work} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OurWork;
