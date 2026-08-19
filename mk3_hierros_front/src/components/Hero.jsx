import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import backgroundImage from "../assets/img/fondoHero.jpg";
import titleImage from "../assets/img/logo-principal_sin_fondo_blanco.png";
import { Button } from "./ui/Button";

const Hero = () => {
  return (
    <section
      className="relative flex min-h-[70vh] w-full flex-col justify-center overflow-hidden bg-cover bg-center px-[6vw] py-20 text-text-primary sm:min-h-[80vh]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className="absolute inset-0 z-0 [backdrop-filter:saturate(120%)_brightness(0.8)]"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(121,255,225,0.18), transparent 55%), linear-gradient(180deg, rgba(5,5,7,0.7) 0%, rgba(5,5,7,0.9) 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glow-panel relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-8 py-12 text-center backdrop-blur-md sm:px-20 sm:py-16"
      >
        <span className="neon-pill tracking-[6px]">Herrería de precisión</span>
        <img
          src={titleImage}
          alt="MK3 Hierros"
          className="w-full max-w-[420px] drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)]"
        />
        <p className="max-w-md text-[1.05rem] text-text-muted">
          Ingeniería artesanal, estructuras a medida y acabados futuristas en
          cada proyecto.
        </p>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Button asChild variant="primary">
            <Link to="/nuestros-trabajos">
              Ver trabajos <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/contactanos">Agendar consulta</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
