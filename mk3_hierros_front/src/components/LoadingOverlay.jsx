import React from "react";
import "./styles/LoadingOverlay.css";

const LoadingOverlay = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-overlay__backdrop" />
      <div className="loading-overlay__content">
        <div className="loading-overlay__spinner" />
        <div className="loading-overlay__text">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
