import PropTypes from "prop-types";
import logo from "/public/images/logo.svg";
import googleLogo from "/public/images/google.svg"; // Thêm logo Google
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDzdOryEzjKOSYu5q-EiTZyK5DcwwsUqms",
  authDomain: "koifarmshop-1f095.firebaseapp.com",
  projectId: "koifarmshop-1f095",
  storageBucket: "koifarmshop-1f095.appspot.com",
  messagingSenderId: "73945260552",
  appId: "1:73945260552:web:164c3f6496f53250b327bd",
  measurementId: "G-SNF9TGJ1Z6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

  // Hàm lưu thông tin người dùng vào database qua API backend
  const saveUserToDatabase = async (user) => {
    try {
      const response = await axios.post("/api/users", {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
      });

      console.log("User saved to DB:", response.data);
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  const loginGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;

      console.log("User:", user.displayName);
      console.log("Email:", user.email);

      // Lưu thông tin người dùng vào database
      await saveUserToDatabase(user);

      // Điều hướng đến trang home
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <div className="login">
      <video className="login__video" autoPlay loop muted>
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      <div className="login-page">
        <div className="login-page__poster">
          <div className="image-container"></div>
        </div>
        <div className="login-page__content">
          <div className="login__logo">
            <img src={logo} alt="Logo" className="logo" />
            <h2 className="shop-name">Koifish</h2>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form">
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
            <div className="form">
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

          <button
            className="google-login-button"
            onClick={() => {
              console.log("Google login button clicked.");
              loginGoogle();
            }}
          >
            <img src={googleLogo} alt="Google Logo" className="google-logo" />
            Đăng nhập với Google
          </button>

          <div className="links">
            <li>
              <Link to="/register" className="register-link">
                Đăng ký
              </Link>
            </li>
            <li>
              <Link to="/forgot-password">Quên mật khẩu</Link>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
