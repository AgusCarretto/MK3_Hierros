import React from 'react';
import Navbar from './Navbar'; 
import './styles/Home.css'; 

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Incluye la barra de navegación */}
      <header className="home-header">
        <h1>Mk3 Hierros</h1>
        <p>Tu socio en estructuras de metal.</p>
      </header>


      {/* Aquí podrías agregar más contenido para la página de inicio */}
    </div>
  );
};

export default Home;