import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Destiny from './pages/Destiny';
import Game from './pages/Game';
import Chronicles from './pages/Chronicles';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destiny" element={<Destiny />} />
            <Route path="/game" element={<Game />} />
            <Route path="/chronicles" element={<Chronicles />} />
            <Route path="/profile" element={<Chronicles />} /> {/* Defaulting Profile to Chronicles for prototype */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;