import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginForm from './pages/login/login';
import UserInfo from './pages/userinfo/userinfo';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/userinfo" element={<UserInfo />} />
        </Routes>
        
        
        <div>
          <Link to="/userinfo">Test User Info Page</Link> <br></br>
          <Link to="/login">Test Login Page</Link>
        </div>
      </div>
    </Router>
  );
}

export default App;
