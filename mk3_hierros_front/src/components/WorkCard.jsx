import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ImageOff, ArrowUpRight } from "lucide-react";
import { workImageUrl } from "../lib/api";

const WorkCard = ({ work }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    work.previewImageId && !imageError
      ? workImageUrl(work.id, work.previewImageId)
      : null;

  const goToDetail = () => navigate(`/trabajo/${work.id}`);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetail();
        }
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-surface-border bg-surface-panel outline-none focus-visible:border-accent"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={work.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white/[0.03] text-text-soft">
          <ImageOff className="h-8 w-8" aria-hidden="true" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
        <h3 className="text-lg font-medium text-text-primary">{work.title}</h3>
        <p className="flex items-center gap-1.5 text-xs uppercase tracking-[2px] text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {imageError ? "Ver detalles del proyecto" : "Explorar proyecto"}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </p>
      </div>
    </motion.div>
  );
};

export default WorkCard;
