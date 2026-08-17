import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Hammer } from "lucide-react";
import { getCategories } from "../lib/api";
import { useCachedFetch } from "../hooks/useCachedFetch";
import { CategoryGridSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import { Button } from "./ui/Button";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Home = () => {
  const navigate = useNavigate();
  const {
    data: categories,
    loading,
    error,
    retry,
  } = useCachedFetch("mk3_categories_cache_v1", getCategories);

  const goToCategory = (category) => {
    navigate(
      `/nuestros-trabajos?categoria=${category.id}&nombre=${encodeURIComponent(
        category.name
      )}`
    );
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-16 px-[6vw] py-20">
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="glow-panel flex flex-col gap-8 p-8 sm:p-12 lg:flex-row"
      >
        <div className="flex shrink-0 items-start gap-5">
          <span className="section-number">01</span>
          <div className="flex flex-col gap-3">
            <span className="neon-pill">Sobre Nosotros</span>
            <h2 className="max-w-sm text-2xl text-text-primary sm:text-3xl">
              Soluciones en hierro a medida
            </h2>
          </div>
        </div>
        <div className="flex flex-col gap-5 text-text-muted">
          <p className="text-base leading-relaxed text-text-primary/90">
            En <strong className="text-text-primary">MK3 Soluciones en Hierro</strong>,
            transformamos la materia prima en piezas de precisión. Combinamos
            la robustez del hierro con diseños funcionales y modernos.
          </p>
          <p className="text-sm leading-relaxed">
            Somos especialistas en trabajos a medida, ofreciendo soluciones
            creativas para cada proyecto. Nuestro compromiso reside en la
            durabilidad, la técnica artesanal y la total satisfacción de
            quienes confían en nuestro taller.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs uppercase tracking-[3px] text-accent">
            <span>/ Calidad</span>
            <span>/ Diseño</span>
            <span>/ Resistencia</span>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="glow-panel flex flex-col gap-8 p-8 sm:p-12"
      >
        <div className="flex items-start gap-5">
          <span className="section-number">02</span>
          <div className="flex flex-col gap-3">
            <span className="neon-pill">Servicios</span>
            <h2 className="text-2xl text-text-primary sm:text-3xl">
              Nuestro laboratorio metalúrgico
            </h2>
          </div>
        </div>

        {loading ? (
          <CategoryGridSkeleton />
        ) : error ? (
          <EmptyState
            title="No pudimos cargar las categorías"
            description="Revisá tu conexión e intentá de nuevo."
            actionLabel="Reintentar"
            onAction={retry}
          />
        ) : categories?.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                type="button"
                onClick={() => goToCategory(category)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-surface-border bg-white/[0.03] px-4 py-3.5 text-left text-sm text-text-primary transition-colors hover:border-accent/50 hover:bg-accent-soft hover:text-accent"
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Hammer}
            title="Sin categorías por el momento"
            description="Estamos organizando el catálogo de servicios."
          />
        )}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeInUp}
      >
        <div className="glow-panel flex flex-col items-center gap-4 px-8 py-14 text-center sm:px-16">
          <span className="neon-pill">¿Tenés un proyecto?</span>
          <h3 className="max-w-lg text-2xl text-text-primary sm:text-3xl">
            Llevamos tus ideas al plano real
          </h3>
          <p className="max-w-md text-sm text-text-muted">
            Calidad técnica y diseño industrial para soluciones duraderas en
            hierro.
          </p>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => navigate("/contactanos")}
          >
            Hablemos ahora <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </div>
      </motion.section>
    </main>
  );
};

export default Home;
