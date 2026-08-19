import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowLeft, ImageOff } from "lucide-react";
import { getWorkDetail, workImageUrl } from "../lib/api";
import { useCachedFetch } from "../hooks/useCachedFetch";
import { WorkDetailSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import { Tooltip } from "./ui/Tooltip";

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data,
    loading,
    error,
    retry,
  } = useCachedFetch(`mk3_work_detail_${id}_v1`, () => getWorkDetail(id), {
    ttl: 30 * 60 * 1000,
  });

  const work = data?.work ?? null;
  const images = data?.images ?? [];

  useEffect(() => {
    setCurrentIndex(0);
  }, [id]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, nextSlide, prevSlide]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-[6vw] py-16">
        <WorkDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-[6vw] py-16">
        <EmptyState
          title="No pudimos cargar el detalle del trabajo"
          description="Intenta nuevamente en unos instantes."
          actionLabel="Reintentar"
          onAction={retry}
        />
      </div>
    );
  }

  if (!work) {
    return (
      <div className="mx-auto max-w-4xl px-[6vw] py-16">
        <EmptyState title="Trabajo no encontrado" icon={ImageOff} />
      </div>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-[6vw] py-16">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-[2px] text-text-muted transition-colors hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver
        </button>
        <span className="neon-pill">Proyecto destacado</span>
      </div>

      <section className="glow-panel p-8 sm:p-10">
        <h1 className="text-2xl text-text-primary sm:text-3xl">{work.title}</h1>
        {work.description && (
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {work.description}
          </p>
        )}
      </section>

      <section className="glow-panel relative flex items-center justify-center p-4 sm:p-6">
        {images.length > 0 ? (
          <>
            <Tooltip label="Imagen anterior">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Imagen anterior"
                className="absolute left-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-surface-panel-strong text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            </Tooltip>

            <div className="flex w-full flex-col items-center gap-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-black/40">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[currentIndex].id}
                    src={workImageUrl(id, images[currentIndex].id)}
                    alt={`Proyecto ${currentIndex + 1}`}
                    loading="lazy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    drag={images.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -80) nextSlide();
                      else if (info.offset.x > 80) prevSlide();
                    }}
                    className="h-full w-full cursor-grab object-contain active:cursor-grabbing"
                  />
                </AnimatePresence>
              </div>
              <span className="text-xs uppercase tracking-[2px] text-text-soft">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            <Tooltip label="Imagen siguiente">
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Imagen siguiente"
                className="absolute right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-surface-panel-strong text-text-primary transition-colors hover:border-accent hover:text-accent"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </Tooltip>
          </>
        ) : (
          <p className="py-16 text-sm text-text-soft">
            No hay imágenes disponibles para este proyecto.
          </p>
        )}
      </section>
    </main>
  );
};

export default WorkDetail;
