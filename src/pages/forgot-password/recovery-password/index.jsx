import { Button, Form, Input, message } from "antd";
import { ChangePassword } from "../../../service/userService";
import { useLocation } from "react-router-dom";
import ForgotPassword from "..";

function RecoveryPassword() {
  const location = useLocation();

  // Lấy token từ query parameter
  const token = new URLSearchParams(location.search).get("token");

  const handleRecoveryPassword = async (value) => {
    console.log(value);
    console.log("Token nhận được:", token);
    const data = {
      token: token,
      newPassword: value.password,
    };

    try {
      const result = await ChangePassword(data);
      console.log("Password reset successful:", result);
      message.success("Khôi phục mật khẩu thành công!", 2);
    } catch (error) {
      console.log("Lỗi khôi phục mật khẩu:", error);
      message.error("Khôi phục mật khẩu thất bại!", 2);
    }
  };

  return token ? (
    <div className="forgot-password">
      <div>
        <h2>Khôi phục mật khẩu</h2>
      </div>
      <div className="forgot-password__container">
        <div style={{ marginBottom: "1rem" }}>
          <img src="/logo.svg" alt="Logo" style={{ maxWidth: "100px" }} />
        </div>
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={(value) => handleRecoveryPassword(value)}
          className="form"
        >
          <Form.Item
            label="Nhập mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Hai mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Khôi phục mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  ) : (
    <div>
      <ForgotPassword></ForgotPassword>
    </div>
  );
}

export default RecoveryPassword;
