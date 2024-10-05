import PropTypes from "prop-types";
import logo from "/public/images/logo.svg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.scss";
import { Register } from "../../service/userService";
import { message } from "antd";
RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};

const initFormValue = {
  userName: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  address: "",
  email: "",
  phoneNumber:"",
  accountBalance:0,
  image: ""
};

function RegisterForm() {
  const navigate = useNavigate();
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
    if (formValue.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }
    if (formValue.password !== formValue.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }
         // gọi api tạo người dùng
    const signUp = async () => {
      try {
        let res = await Register(formValue);
        console.log("Registration successful:", res);
        message.success("Đăng ký thành công ! Đăng nhập ngay")
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
      }
    };
      signUp();
  };

  return (
    <div className="register">
      <video className="register__video" autoPlay loop muted>
        <source src="/images/video.mp4" type="video/mp4" />
      </video>

      <div className="register__form">
        <div className="register__form__title">
          <img src={logo} alt="Logo" />
          <h2>Đăng ký</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Họ và tên:</label>
            <input
              className="form-control"
              type="text"
              name="fullName"
              value={formValue.fullName}
              placeholder="Nhập họ và tên"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Tên đăng nhập:</label>
            <input
              className="form-control"
              type="text"
              name="userName"
              placeholder="Nhập tên đăng nhập"
              value={formValue.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Mật khẩu:</label>
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formValue.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Nhập lại mật khẩu:</label>
            <input
              className="form-control"
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formValue.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Email:</label>

            <input
              className="form-control"
              type="text"
              name="email"
              placeholder="Nhập email"
              value={formValue.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Số điện thoại:</label>
            <input
              className="form-control"
              type="text"
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              value={formValue.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Địa chỉ:</label>
            <input
              className="form-control"
              type="text"
              name="address"
              placeholder="Nhập địa chỉ"
              value={formValue.address}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Đăng ký
          </button>
        </form>
        <div className="back-to-login">
          <span>Bạn đã là thành viên?</span>
          <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
