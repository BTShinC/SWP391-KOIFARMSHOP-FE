import { Button, Form, Input } from "antd";
import "./index.scss"; // Import the CSS file
import { useState } from "react";
import { sendEmailToRecoveryPassword } from "../../service/userService";
function ForgotPassword() {
  const handleRecoveryPassword = async (value) => {
    console.log(value);
    try {
      const res = await sendEmailToRecoveryPassword(value);
      console.log(res);
      // Kiểm tra mã trạng thái của phản hồi
      setSuccessMessage(
        "Chúng tôi đã gửi thông báo đến email của bạn! Kiểm tra email của bạn."
      );
    } catch (error) {
      // Kiểm tra xem error.response có tồn tại không
      if (error.response) {
        // Truy cập error.response.data để lấy thông báo lỗi
        const errorMessage =
          error.response.data || "Có lỗi xảy ra, vui lòng thử lại.";
        setErrorMessage(errorMessage);
        console.log("Lỗi khôi phục mật khẩu:", errorMessage);
      } else {
        // Trường hợp lỗi không có phản hồi từ API (lỗi mạng, v.v.)
        setErrorMessage("Có lỗi xảy ra, vui lòng kiểm tra kết nối mạng.");
        console.log("Lỗi:", error);
      }
    }
  };
  const resetForm = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  return (
    <div className="forgot-password">
      <div>
        <h2>Khôi phục mật khẩu</h2>
      </div>
      <div className="forgot-password__container">
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <img src="/images/logo.svg" alt="Logo" style={{ maxWidth: "100px" }} />
        </div>
        {successMessage ? (
          <div className="alert alert-success">{successMessage}</div>
        ) : errorMessage ? (
          <>
            <div className="alert alert-danger">{errorMessage}</div>
            <div>
              {" "}
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                onClick={resetForm}
              >
                Nhập lại email
              </Button>
            </div>
          </>
        ) : (
          <Form
            labelCol={{
              span: 24,
            }}
            onFinish={(value) => handleRecoveryPassword(value)} // Submit form handler
            className="form"
          >
            <Form.Item
              label="Nhập email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email",
                },
                {
                  type: "email",
                  message: "Định dạng email không hợp lệ",
                },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Khôi phục mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
