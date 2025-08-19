import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './components/Home';
import OurWork from './components/OurWork';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactUs from './components/ContactUs';


function App() {
  return (
    
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestros-trabajos" element={<OurWork />} />
        <Route path="/contactanos" element={<ContactUs/>} />
        
        {/* Aquí puedes agregar más rutas, como para el contacto */}
      </Routes>
    </Router>
    
    </div>
  );
}

export default App;
