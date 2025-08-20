import React from 'react';
import './styles/Home.css'; 


const Home = () => {
  return (
    <main className="home-content">
      <section className="home-part-left">
        <h2>Sobre Nosotros</h2>
        <p>
          Somos especialistas en trabajos de herrería a medida, ofreciendo soluciones creativas
          y funcionales para cada proyecto. Desde estructuras metálicas hasta detalles decorativos,
          nuestro compromiso es con la calidad y la satisfacción del cliente.
        </p>
        <img src="https://placehold.co/400x300/2c3e50/ecf0f1?text=Nuestros+Valores" alt="Nuestros Valores" />
      </section>
      <section className="home-part-right">
        <h2>Nuestros Servicios</h2>
        <ul>
          <li>Estructuras metálicas</li>
          <li>Portones y rejas</li>
          <li>Barandas y escaleras</li>
          <li>Muebles de diseño industrial</li>
          <li>Trabajos a medida</li>
        </ul>
        <img src="https://placehold.co/400x300/2c3e50/ecf0f1?text=Servicios" alt="Servicios" />
      </section>
    </main>
  );
};

export default Home;