import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './components/Home';
import OurWork from './components/OurWork';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactUs from './components/ContactUs';
import Hero from './components/Hero';
import WorkDetail from './components/workDetail';

function App() {
  return (
    
    <div className="App">
      <Router>
        <Hero/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestros-trabajos" element={<OurWork />} />
        <Route path="/contactanos" element={<ContactUs/>} />
        <Route path="/trabajo/:id" element={<WorkDetail />} />
        {/* Aquí puedes agregar más rutas, como para el contacto */}
      </Routes>
    </Router>
    
    </div>
  );
}

export default App;
