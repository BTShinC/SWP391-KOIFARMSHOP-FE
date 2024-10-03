import { Button, Form, Input, message } from "antd";
import { ChangePassword } from "../../../service/userService";
import { useParams } from 'react-router-dom';

function RecoveryPassword() {
  const { token } = useParams(); // Sử dụng useParams bên ngoài hàm
  const handleRecoveryPassword = async (value) => {
    console.log(value);
    console.log("Token nhận được:", token);
    const data = {
      token: token,  // Thêm token vào data
      // Thêm các giá trị cần thiết khác vào data (ví dụ: password mới)
      newPassword: value.password
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

  return (
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
          onFinish={(value) => handleRecoveryPassword(value)} // Submit form handler
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
  );
}

export default RecoveryPassword;
