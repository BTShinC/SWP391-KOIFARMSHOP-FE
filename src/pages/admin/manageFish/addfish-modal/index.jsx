import { useState } from "react";
import { Button, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js"; 
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

AddFishModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
};

function AddFishModal({ title, visible, onClose }) {
  const initFormValue = {
    productID: "",
    breed: "",
    size: "",
    sex: "",
    healthStatus: "",
    personalityTrait: "",
    origin: "",
    description: "",
    imageUrl: "", 
    price: "",
    certificateUrl: "", 
    type: "",
    quantity: "",
    status: "",
    desiredPrice: "",
    consignmentType: "",
    carePackageID: "",
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState([]);
  const [certificateList, setCertificateList] = useState([]);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj; 
      const storageRef = ref(storage, `uploads/${file.name}`); 
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            imageUrl: url, 
          }));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleCertificateChange = ({ fileList: newFileList }) => {
    setCertificateList(newFileList);
  
    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj; 
      const storageRef = ref(storage, `uploads/certificates/${file.name}`); 
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            certificateUrl: url, 
          }));
        })
        .catch((error) => {
          console.error("Error uploading certificate:", error);
        });
    }
  };

  const handleOk = () => {
    // Xử lý lưu thông tin cá
    console.log("Form value:", formValue);
    onClose(); // Gọi hàm onClose để đóng modal
  };

  return (
    <Modal
      title={title}
      open={visible} 
      onOk={handleOk}
      onCancel={onClose} 
      centered
    >
      <form>
        <div className="add-fish__modal">
          <h2>Thông tin cá</h2>
          <div className="prop-input">
            <label className="form-label">Mã sản phẩm:</label>
            <input
              className="form-control"
              type="text"
              name="productID"
              value={formValue.productID}
              onChange={handleChange}
              required
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Giống:</label>
            <input
              className="form-control"
              type="text"
              name="breed"
              value={formValue.breed}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Kích thước:</label>
            <input
              className="form-control"
              type="text"
              name="size"
              value={formValue.size}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Giới tính:</label>
            <input
              className="form-control"
              type="text"
              name="sex"
              value={formValue.sex}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Tình trạng sức khỏe:</label>
            <input
              className="form-control"
              type="text"
              name="healthStatus"
              value={formValue.healthStatus}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Đặc điểm tính cách:</label>
            <input
              className="form-control"
              type="text"
              name="personalityTrait"
              value={formValue.personalityTrait}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Nguồn gốc:</label>
            <input
              className="form-control"
              type="text"
              name="origin"
              value={formValue.origin}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Mô tả:</label>
            <textarea
              className="form-control"
              name="description"
              value={formValue.description}
              onChange={handleChange}
            />
          </div>
          <div className="uploader-container">
          <div >
            <label className="form-label">Ảnh:</label>
            <Upload
              name="image"
              listType="picture-card"
              className="image-uploader"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} 
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
            <label className="form-label">Giá:</label>
            <input
              className="form-control"
              type="number"
              name="price"
              value={formValue.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Chứng nhận:</label>
            <Upload
              name="certificate"
              listType="picture-card"
              className="certificate-uploader"
              fileList={certificateList}
              onChange={handleCertificateChange}
              beforeUpload={() => false} 
            >
              {certificateList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>
          </div>
          <div className="prop-input">
            <label className="form-label">Loại:</label>
            <input
              className="form-control"
              type="text"
              name="type"
              value={formValue.type}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Số lượng:</label>
            <input
              className="form-control"
              type="number"
              name="quantity"
              value={formValue.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Trạng thái:</label>
            <input
              className="form-control"
              type="text"
              name="status"
              value={formValue.status}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Giá mong muốn:</label>
            <input
              className="form-control"
              type="number"
              name="desiredPrice"
              value={formValue.desiredPrice}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">Loại hình ký gửi:</label>
            <input
              className="form-control"
              type="text"
              name="consignmentType"
              value={formValue.consignmentType}
              onChange={handleChange}
            />
          </div>
          <div className="prop-input">
            <label className="form-label">ID gói chăm sóc:</label>
            <input
              className="form-control"
              type="text"
              name="carePackageID"
              value={formValue.carePackageID}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default AddFishModal;