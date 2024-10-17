import { useState } from "react";
import { Modal, Upload, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { storage } from "/src/firebase.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { editComboInfo } from "../../../../service/userService";

EditProductComboModal.propTypes = {
  fishData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

function EditProductComboModal({ fishData, onChange }) {
  const initFormValue = {
    productComboID: fishData.productComboID,
    comboName: fishData.comboName,
    breed: fishData.breed,
    size: fishData.size,
    healthStatus: fishData.healthStatus,
    description: fishData.description,
    image: fishData.image,
    price: fishData.price,
    type: fishData.type,
    quantity: fishData.quantity,
    status: fishData.status,
    desiredPrice: fishData.desiredPrice,
    consignmentType: fishData.consignmentType,
    age: fishData.age || 1,
  };

  const [formValue, setFormValue] = useState(initFormValue);
  const [fileList, setFileList] = useState(
    fishData.image
      ? [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: fishData.image,
          },
        ]
      : []
  );
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;

    setFormValue((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0) {
      const file = newFileList[0].originFileObj;
      const storageRef = ref(storage, `uploads/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            image: url,
          }));
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };

  const handleOk = async () => {
    const data = {
      productComboID: formValue.productComboID,
      comboName: formValue.comboName,
      breed: formValue.breed,
      size: formValue.size,
      healthStatus: formValue.healthStatus,
      description: formValue.description,
      image: formValue.image,
      price: parseFloat(formValue.price), // Đảm bảo là số
      type: formValue.type,
      quantity: parseInt(formValue.quantity, 10), // Đảm bảo là số nguyên
      status: formValue.status,
      desiredPrice: parseFloat(formValue.desiredPrice),
      consignmentType: formValue.consignmentType,
      age:formValue.age
    };
    try {
      let res = await editComboInfo(data);
      if (res) {
        console.log("Thành công");
        onChange();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={showModal}>Chỉnh sửa</Button>
      <Modal open={open} onOk={handleOk} onCancel={onClose} centered>
        <form>
          <div className="add-fish__modal">
            <h2>Thông tin Combo</h2>
            <div style={{ display: "flex", gap: "5rem" }}>
              <div>
                <label className="form-label">Ảnh:</label>
                <Upload
                  name="image"
                  listType="picture-card"
                  className="image-uploader"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  required
                >
                  {fileList.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </div>
            </div>
            <div>
              <label className="form-label">Giống:</label>
              <Input
                className="form-control"
                type="text"
                name="breed"
                value={formValue.breed}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Kích thước trung bình:</label>
              <Input
                className="form-control"
                type="text"
                name="size"
                value={formValue.size}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Số lượng:</label>
              <Input
                className="form-control"
                type="number"
                name="quantity"
                value={formValue.quantity}
                min={1}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Tình trạng sức khỏe:</label>
              <Input
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
              <Input
                className="form-control"
                type="text"
                name="type"
                value={formValue.type}
                onChange={handleChange}
                required
              />
            </div>
            {formValue.type === "Ký gửi" && (
              <div>
                <label className="form-label">Loại hình ký gửi:</label>
                <Input
                  className="form-control"
                  type="text"
                  name="consignmentType"
                  value={formValue.consignmentType || "Ký gửi để bán"}
                  readOnly
                />
              </div>
            )}
            <div>
              <label className="form-label">Giá:</label>
              <Input
                className="form-control"
                type="number"
                name="price"
                min={1}
                value={formValue.price}
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

export default EditProductComboModal;
