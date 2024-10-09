import PropTypes from "prop-types";
import logo from "/public/images/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import "./index.scss"; // You can keep your styles here
import api from "../../config/api";
import { toast } from "react-toastify";

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

  const handleRegister = async (values) => {
    try {
      await api.post("Register", values);
      toast.success("Đăng ký thành công")
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data);
    }
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

        <Form
          name="registerForm"
          onFinish={handleRegister}
          initialValues={initFormValue}
          layout="vertical"
        >
          

          <Form.Item
            name="fullName"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="userName"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { len: 10, message: "Số điện thoại phải có 10 ký tự!" }, // Điều chỉnh độ dài nếu cần
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="back-to-login">
          <span>Bạn đã là thành viên?</span>
          <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
