import React from 'react';
import { Link } from 'react-router-dom';
import './login.css'; 

function Login({setUser}    ) {
  return (
    <div className="login-container">
      <img src="/logo.svg" alt="Logo" className="logo" />
      <h2 className="shop-name">Koifish</h2>
      <form className="login-form">
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Mật khẩu" required />
        <button type="submit" className="login-button">Đăng nhập</button>
      </form>
      <button className="google-login-button">Đăng nhập với Google</button>
      <div className="links">
        <Link to="/register">Đăng ký</Link> 
        <Link to="/forgot-password">Quên mật khẩu</Link>
      </div>
    </div>
  );
}

export default Login;
