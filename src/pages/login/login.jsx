import PropTypes from "prop-types";
import "./login.css";
import { useState } from "react";
import { Link } from 'react-router-dom';

LoginForm.propTypes = {
  setUser: PropTypes.func,
};

const initFormValue = {
  username: "",
  password: "",
};

function LoginForm({ setUser }) {
  const [formValue, setFormValue] = useState(initFormValue);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Login Values:", formValue);
    // cho api login
  };

  return (
    <div className="login-container">
      <img src="/logo.svg" alt="Logo" className="logo" />
      <h2 className="shop-name">Koifish</h2>

      <div>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label"></label>
            <input
              className="form-control"
              type="username"
              name="username"
              value={formValue.username}
              placeholder="Nhập tên đăng nhập"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label"></label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={formValue.password}
              placeholder="Nhập mật khẩu"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        <button className="google-login-button">Đăng nhập với Google</button>
        <div className="links">
          <Link to="/register">Đăng ký</Link>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
