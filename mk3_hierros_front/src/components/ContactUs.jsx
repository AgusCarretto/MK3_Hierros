import React, { useState } from 'react';
import './styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const sendWhatsApp = (e) => {
    e.preventDefault();

    const PHONE_NUMBER = "59898292325"; // Reemplaza con tu número (código de país + número sin espacios)
    
    // Construimos el mensaje con formato para que te llegue prolijo
    const text = `*NUEVA CONSULTA - MK3*%0A%0A` +
                 `*Nombre:* ${formData.name}%0A` +
                 `*Asunto:* ${formData.subject}%0A` +
                 `*Mensaje:* ${formData.message}`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${text}`;
    
    // Abre WhatsApp en una pestaña nueva
    window.open(url, '_blank');
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <section className="contact-info glow-panel">
          <div className="contact-header">
            <span className="section-number">03</span>
            <span className="contact-label neon-pill">Contacto directo</span>
          </div>
          <h1 className="contact-title">Hablemos por WhatsApp</h1>
          <p className="contact-intro">
            Completá los datos y te redirigiremos a nuestro chat oficial para
            asesorarte mejor.
          </p>
          <div className="info-block">
            <label>ATENCIÓN DIRECTA</label>
            <p>Lunes a Viernes de 9 a 18hs</p>
          </div>
          <div className="info-block">
            <label>UBICACIÓN</label>
            <p>Montevideo, Uruguay — Taller MK3</p>
          </div>
        </section>

        <section className="contact-form-container glow-panel">
          <form onSubmit={sendWhatsApp} className="minimal-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="TU NOMBRE"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                placeholder="PROYECTO (EJ: REJAS, PORTÓN)"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="¿CÓMO PODEMOS AYUDARTE?"
                rows="5"
                required
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn-send wpp-style">
              ENVIAR CONSULTA <span>→</span>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;