import { useState, useEffect } from "react";
import { Button, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js"; // Đảm bảo đường dẫn đúng đến file cấu hình Firebase
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editUser } from "../../../service/userService";

ModalEditUser.propTypes = {
  title: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

function ModalEditUser({ title, userData, className = "", onChange }) {
  const initFormValue = {
<<<<<<< HEAD
    accountID: userData.accountID,
    fullName: userData.fullName,
    phoneNumber: userData.phoneNumber,
    email: userData.email,
    address: userData.address,
    imageUrl: userData.imageUrl, // Save the image URL here
    roleName: userData.roleName,
=======
    fullName: userData.fullName || "",
    phoneNumber: userData.phoneNumber || "",
    email: userData.email || "",
    address: userData.address || "",
    imageUrl: userData.imageUrl || "", // Lưu URL của ảnh
    role: userData.role || "",
>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [open, setOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setFormValue({
<<<<<<< HEAD
      accountID: userData.accountID,
      fullName: userData.fullName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      accountBalance: userData.accountBalance,
      address: userData.address,
      image: userData.image, // Image URL from userData
      roleName: userData.roleName,
=======
      fullName: userData.fullName || "",
      phoneNumber: userData.phoneNumber || "",
      email: userData.email || "",
      address: userData.address || "",
      imageUrl: userData.imageUrl || "",
      role: userData.role || "",
>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
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
  };

  const uploadImageToFirebase = async (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`); // Create reference in Firebase Storage
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL; // Return the image URL
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleOk = async () => {
    let imageUrl = formValue.image; // Default to the existing image URL

    if (fileList.length > 0 && fileList[0].originFileObj) {
      // If there's a new image to upload, upload it to Firebase
      const file = fileList[0].originFileObj;
      try {
        imageUrl = await uploadImageToFirebase(file);
      } catch (error) {
        console.error("Image upload failed:", error);
        return; 
      }
    }

    const updatedFormValue = {
      ...formValue,
      image: imageUrl,
    };

    try {
      let res = await editUser(updatedFormValue);
      if (res) {
        console.log("User updated successfully");
        onChange(updatedFormValue); 
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }

    setOpen(false);
<<<<<<< HEAD
=======
    console.log(formValue);
>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
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
        okText="Thay đổi"
        onCancel={handleCancel}
        cancelText="Hủy bỏ"
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
<<<<<<< HEAD
=======

>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
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
<<<<<<< HEAD
                    onChange={handleChange}
                    type="number"
                    name="roleName"
                    value={formValue.roleName}
=======
                    type="number"
                    name="role"
                    value={formValue.roleID}
>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
                  >
                    <option value="">Chọn vai trò</option>{" "}
                    {/* Giá trị mặc định */}
                    <option value="Admin">Quản trị viên</option>
                    <option value="Customer">Khách hàng</option>
                  </select>
                </div>
              )
<<<<<<< HEAD
=======

>>>>>>> bad687b40b0fc555d0b4a2c1fcc32ac0ffef9e11
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
export default ModalEditUser;
