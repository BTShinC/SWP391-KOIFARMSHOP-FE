import PropTypes from "prop-types";
import logo from '/public/images/logo.svg'
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./login.scss";

LoginPage.propTypes = {
  setUser: PropTypes.func,
};

const initFormValue = {
  username: "",
  password: "",
};

function LoginPage() {
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
    Navigate("/home"); // chuyen thang toi home khi logic, chua co login logic
  };

  return (
    <div className="login-container">
      <div className="login__logo">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="shop-name">Koifish</h2>
      </div>

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

export default LoginPage;