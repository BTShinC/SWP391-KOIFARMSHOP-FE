import { useState, useEffect } from "react";
import { Button, Modal, Upload} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";
import PropTypes from "prop-types";

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

  const handleOk = () => {
    console.log("Thông tin mới", formValue);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    imgWindow.document.write(`<img src="${src}" style="width: 100%;" />`);
  };

  return (
    <>
      <Button
        type={className.includes("modal-edit-user-button") ? "default" : "primary"}
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
            <div>
              <label className="form-label">Ảnh đại diện:</label>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              >
                {fileList.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
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
        </form>
      </Modal>
    </>
  );
}

export default ModalEditUser;
