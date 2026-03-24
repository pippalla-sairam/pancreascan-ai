import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Navbar from './components/Navbar';

function App() {
  // Check localStorage on load
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('username')
  );

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('username'));
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar onLogout={() => setIsAuthenticated(false)} />}
      <div className="bg-slate-100 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route 
            path="/" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/history" 
            element={isAuthenticated ? <History /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;