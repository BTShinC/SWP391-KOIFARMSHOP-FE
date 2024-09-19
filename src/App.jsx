import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/Login';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
  );
}

export default App;
