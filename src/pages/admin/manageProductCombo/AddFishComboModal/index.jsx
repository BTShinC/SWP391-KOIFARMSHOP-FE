import { useEffect, useState } from "react";
import { Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { AddFishCombo } from "../../../../service/userService";

AddFishComboModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function AddFishComboModal({ title, visible, onClose, onChange }) {
  const initFormValue = {
    comboName: "",
    size: "",
    breed: "",
    healthStatus: "",
    quantity: 0,
    description: "",
    image: "",
    image1: "",
    image2: "",
    price: 1,
    consignmentType: "",
    desiredPrice: 1,
    type: "",
    status: "Còn hàng",
    age: 1,
    sex: "Đực",
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState({ image: [], image1: [], image2: [] });

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue((prevValue) => {
      let updatedValue = { ...prevValue, [name]: value };

      // Nếu loại là "Trang trại", gán giá trị price cho desiredPrice
      if (updatedValue.type === "Trang trại") {
        updatedValue.desiredPrice = updatedValue.price;
      }

      return updatedValue;
    });
  };

  useEffect(() => {
    // Cập nhật consignmentType dựa trên loại
    if (formValue.type === "Ký gửi") {
      setFormValue((prevValue) => ({
        ...prevValue,
        consignmentType: "Ký gửi để bán",
      }));
    } else {
      setFormValue((prevValue) => ({
        ...prevValue,
        consignmentType: "Trang trại đăng bán",
      }));
    }
  }, [formValue.type]);

  const handleUploadChange = ({ fileList: newFileList }, field) => {
    setFileList((prevFileList) => ({
      ...prevFileList,
      [field]: newFileList,
    }));

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            [field]: url,
          }));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleOk = async () => {
    // Xử lý lưu thông tin
    try {
      let res = await AddFishCombo(formValue);
      if (res) {
        onChange();
        console.log("Thành công");
      }
    } catch (error) {
      console.log(error);
    }

    onClose(); // Đóng modal sau khi cập nhật
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
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {/* Upload ảnh chính */}
            <div>
              <label className="form-label">Ảnh chính:</label>
              <Upload
                name="image"
                listType="picture-card"
                className="image-uploader"
                fileList={fileList.image}
                onChange={({ fileList }) => handleUploadChange({ fileList }, "image")}
                beforeUpload={() => false}
                required
              >
                {fileList.image.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>

            {/* Upload ảnh phụ 1 */}
            <div>
              <label className="form-label">Ảnh phụ 1:</label>
              <Upload
                name="image1"
                listType="picture-card"
                className="image-uploader"
                fileList={fileList.image1}
                onChange={({ fileList }) => handleUploadChange({ fileList }, "image1")}
                beforeUpload={() => false}
                required
              >
                {fileList.image1.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>

            {/* Upload ảnh phụ 2 */}
            <div>
              <label className="form-label">Ảnh phụ 2:</label>
              <Upload
                name="image2"
                listType="picture-card"
                className="image-uploader"
                fileList={fileList.image2}
                onChange={({ fileList }) => handleUploadChange({ fileList }, "image2")}
                beforeUpload={() => false}
                required
              >
                {fileList.image2.length >= 1 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </div>

          {/* Các trường thông tin khác */}
          <div>
            <label className="form-label">Tên lô cá:</label>
            <input
              className="form-control"
              type="text"
              name="comboName"
              value={formValue.comboName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Các giống:</label>
            <input
              className="form-control"
              type="text"
              name="breed"
              value={formValue.breed}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Số lượng:</label>
            <input
              className="form-control"
              type="number"
              name="quantity"
              min={1}
              value={formValue.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Kích thước trung bình:</label>
            <input
              className="form-control"
              type="text"
              name="size"
              value={formValue.size}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="form-label">Tình trạng sức khỏe:</label>
            <input
              className="form-control"
              type="text"
              name="healthStatus"
              value={formValue.healthStatus}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Mô tả:</label>
            <textarea
              className="form-control"
              name="description"
              value={formValue.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="form-label">Loại:</label>
            <select
              className="form-control"
              name="type"
              value={formValue.type}
              onChange={handleChange}
              required
            >
              <option value="">Chọn loại</option>
              <option value="Ký gửi">Ký gửi</option>
              <option value="Trang trại">Trang trại</option>
            </select>
          </div>

          {/* Hiển thị cả hai input khi type là Ký gửi */}
          {formValue.type === "Ký gửi" && (
            <>
              <div>
                <label className="form-label">Giá mong muốn:</label>
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  name="desiredPrice"
                  value={formValue.desiredPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Giá đăng bán:</label>
                <input
                  className="form-control"
                  type="number"
                  name="price"
                  min={1}
                  value={formValue.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {/* Chỉ hiển thị giá nếu loại là Trang trại */}
          {formValue.type === "Trang trại" && (
            <div>
              <label className="form-label">Giá:</label>
              <input
                className="form-control"
                type="number"
                name="price"
                min={1}
                value={formValue.price}
                onChange={handleChange}
                required
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default AddFishComboModal;
