import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import Statistics from './pages/Statistics';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Padel Tournament App</p>
      </footer>
    </div>
  );
}

export default App;