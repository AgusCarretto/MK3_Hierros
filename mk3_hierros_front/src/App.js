import logo from './logo.svg';
import './App.css';
import React from 'react';
import Home from './components/Home';

function App() {
  return (
    
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nuestros-trabajos" element={<OurWork />} />
        
        {/* Aquí puedes agregar más rutas, como para el contacto */}
      </Routes>
    </Router>
    
    </div>
  );
}

export default App;
