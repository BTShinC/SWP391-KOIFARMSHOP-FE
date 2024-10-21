import PropTypes from "prop-types";
import logo from "/public/images/logo.svg";
import googleLogo from "/public/images/google.svg";
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import axios from "axios";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { Button, Form, Input } from "antd";

import api from "../../config/api";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/features/userSlice";


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

// const initFormValue = {
//   username: "",
//   password: "",
// };

function LoginPage() {
  // const [formValue, setFormValue] = useState(initFormValue);

  // const handleChange = (event) => {
  //   const { value, name } = event.target;
  //   setFormValue({
  //     ...formValue,
  //     [name]: value,
  //   });
  // };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const response = await api.post("login", values);
      console.log("Values sent to API:", values);
      console.log("Response from API:", response.data);
      // Log the roleName to the console
      console.log("User Role Name:", response.data.account.roleName); // Log the roleName


      localStorage.setItem("token", response.data.token); 
      console.log("Response from API:", response.data.account);

      // Save user data to Redux
      dispatch(login(response.data));

      // Check user role and navigate accordingly
      if (response.data.account.roleName === "Admin") {
        navigate("/admin"); // Navigate to admin page if role is Admin
      } else {
        navigate("/"); // Navigate to homepage for other roles
      }

      toast.success("Đăng nhập thành công");
      // chuyển đến trang chủ
      navigate("/");

      // lưu trữ thông tin của user
      // dispatch action

    } catch (err) {
      console.error("Error response from API:", err.response?.data);
      toast.error(err.response.data);
    }
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

          <Form
            labelCol={{
              span: 24,
            }}
            onFinish={handleLogin} // Submit form handler
            className="form"
          >
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form>

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
              <Link to="/recoveryPassword">Quên mật khẩu</Link>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
