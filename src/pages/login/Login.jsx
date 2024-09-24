import PropTypes from "prop-types";
import logo from "/public/images/logo.svg";
import googleLogo from "/public/images/google logo.svg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

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
    // Call API login here
    navigate("/home"); // Điều hướng đến trang home sau khi login thành công
  };

  return (
    <div className="login">
      <div className="login-page">
        <div className="image-container"></div>
        <div className="login-container-wrapper">
          <div className="login-container">
            <div className="login__logo">
              <img src={logo} alt="Logo" className="logo" />
              <h2 className="shop-name">Koifish</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Tên đăng nhập</label>
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  value={formValue.username}
                  placeholder="Nhập tên đăng nhập"
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Mật khẩu</label>
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

            {/* Nút đăng nhập với Google */}
            <button className="google-login-button">
              <img src={googleLogo} alt="Google Logo" className="google-logo" />
              Đăng nhập với Google
            </button>

            <div className="links">
              <Link to="/register">Đăng ký</Link>
              <Link to="/forgot-password">Quên mật khẩu</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
