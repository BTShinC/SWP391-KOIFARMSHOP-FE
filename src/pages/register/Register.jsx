import PropTypes from "prop-types";
import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};
const initFormValue = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  confirmPassword: "",
  email: "",
  address: "",
};
function RegisterForm() {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState(initFormValue);
  const handleChange = (event) => {
    const { value, name } = event.target;
    let isValid = true;
    if (name === "email") {
      const emailPattern = /^[^\s@]+@gmail.com$/;
      isValid = emailPattern.test(value);
    }
    if (isValid) {
      setFormValue({
        ...formValue,
        [name]: value,
      });
    } else {
      console.log("Giá trị không hợp lệ:", name);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formValue.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }
    if (formValue.password !== formValue.confirmPassword) {
      alert("Password và Confirm Password không khớp!");
      return;
    }
    console.log("Register Values:", formValue);
    navigate("/login");
  };
  return (
    <div className="register">
    <div className="register__form">
      <div className="register__form__title">
        <img src="/public/images/logo.svg" />
        <h2>Đăng ký</h2>
      </div>
      <form>
        <div>
          <label className="form-label">Họ:</label>
          <input
            className="form-control"
            type="text"
            name="firstName"
            value={formValue.firstName}
            placeholder="Nhập họ"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="form-label">Tên:</label>
          <input
            className="form-control"
            type="text"
            name="lastName"
            placeholder="Nhập tên"
            value={formValue.lastName}
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
          <label className="form-label">Emai:</label>
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
        <button type="submit" className="submit-button" onClick={handleSubmit}>
          Đăng ký
        </button>
      </form>
      <div className="back-to-login">
        <span>Bạn đã là thành viên ?</span>
        <Link to="/Login">Đăng nhập ngay</Link>
      </div>
    </div>
    </div>
  );
}

export default RegisterForm;
