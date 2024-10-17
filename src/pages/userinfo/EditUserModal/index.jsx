import { useState, useEffect } from "react";
import { Button, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js"; // Đảm bảo đường dẫn đúng đến file cấu hình Firebase
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

ModalEditUser.propTypes = {
  title: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
  className: PropTypes.string,
};

function ModalEditUser({ title, userData, className = "" }) {
  const initFormValue = {
    fullName: userData.fullName || "",
    phoneNumber: userData.phoneNumber || "",
    email: userData.email || "",
    address: userData.address || "",
    imageUrl: userData.imageUrl || "", // Lưu URL của ảnh
    role: userData.role || "",
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setFormValue({
      fullName: userData.fullName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
      address: userData.address || "",
      imageUrl: userData.imageUrl || "",
      role: userData.role || "",
    });
  }, [userData]);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj; // Lấy file từ danh sách file
      const storageRef = ref(storage, `uploads/${file.name}`); // Tạo reference đến Firebase Storage
      // Tải tệp lên Firebase Storage
      uploadBytes(storageRef, file)
        .then(() => {
          // Sau khi upload thành công, lấy URL của tệp đã tải lên
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          console.log("File available at:", url); // Debug: Xác minh URL
          // Cập nhật formValue với URL mới
          setFormValue((prevFormValue) => {
            const updatedFormValue = {
              ...prevFormValue,
              imageUrl: url, // Lưu URL của ảnh vào formValue
            };
            // Kiểm tra formValue sau khi cập nhật
            console.log("Form value sau khi cập nhật:", updatedFormValue);
            return updatedFormValue;
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error); // Debug: Xác minh lỗi
        });
    }
  };

  const handleOk = () => {
    setOpen(false);
    console.log(formValue);
  };
  return (
    <>
      <Button
        type={
          className.includes("modal-edit-user-button") ? "default" : "primary"
        }
        onClick={showModal}
        className={`modal-edit-user-button ${className}`}
      >
        {title}
      </Button>

      <Modal
        title="Cập nhật thông tin cá nhân"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <form>
          <div className="edit-user__modal">
            <h2>Thông tin cá nhân</h2>
            {className !== "modal-edit-user-button" ? (
              <div>
                <label className="form-label">Ảnh đại diện:</label>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false} // Tránh việc tự động upload file
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                <div>
                  <label className="form-label">Họ và tên:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="fullName"
                    value={formValue.fullName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label">Số điện thoại:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="phoneNumber"
                    value={formValue.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label">Email:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    value={formValue.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="form-label">Địa chỉ:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="address"
                    value={formValue.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            ) : (
              className == "modal-edit-user-button" && (
                <div>
                  <div>
                    <label className="form-label">Họ và tên:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fullName"
                      value={formValue.fullName}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">Số điện thoại:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="phoneNumber"
                      value={formValue.phoneNumber}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">Email:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      value={formValue.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="form-label">Địa chỉ:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="address"
                      value={formValue.address}
                      disabled
                    />
                  </div>
                  <label className="form-label">Vai trò:</label>
                  <select
                    className="form-control"
                    type="number"
                    name="role"
                    value={formValue.roleID}
                  >
                    <option value="">Chọn vai trò</option>{" "}
                    {/* Giá trị mặc định */}
                    <option value="Admin">Quản trị viên</option>
                    <option value="Customer">Khách hàng</option>
                  </select>
                </div>
              )

            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
export default ModalEditUser;
