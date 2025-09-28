import React from 'react';
import './styles/ContactUs.css';


const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de envío del formulario
    console.log("Formulario enviado");
  };

  return (
    <div className="contact-container">
      <div className="form-card">
        <h1>Contáctanos</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Mail</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Celular</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>
      {/* Nuevo contenedor para la imagen */}
      <div className="contact-visual">
        <p>Aquí puedes poner una imagen, mapa o texto.</p>
      </div>
    </div>
  );
};

export default ContactUs;