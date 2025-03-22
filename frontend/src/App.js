// /frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailAssistant from './components/EmailAssistant';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <EmailAssistant setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
